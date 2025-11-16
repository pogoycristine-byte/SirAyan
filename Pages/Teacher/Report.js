import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { useFocusEffect } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

export default function Report() {
  // ALL HOOKS AT TOP LEVEL — UNCONDITIONAL
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const subsRef = useRef([]);

  // new: date filter (ISO YYYY-MM-DD)
  const todayIso = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayIso);

  // helper to get short weekday name (Mon/Tue/...)
  const getDayName = (isoDate) => {
    try {
      const d = new Date(isoDate + "T00:00:00");
      return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
    } catch {
      return null;
    }
  };
  const changeSelectedDate = (deltaDays) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + deltaDays);
    setSelectedDate(d.toISOString().split("T")[0]);
  };
  const setToday = () => setSelectedDate(new Date().toISOString().split("T")[0]);

  // Load teacher info
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem("currentUser");
        if (saved) setTeacher(JSON.parse(saved));
      } catch (e) {
        console.error("load teacher error", e);
      }
    };
    load();
  }, []);

  // Use isFocused + useEffect to run focus behavior reliably (hooks remain top-level)
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    if (!teacher?.uid) {
      setReports([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const q = query(collection(db, "sessions"), where("teacherId", "==", teacher.uid));
        const snap = await getDocs(q);
        const sessionDocs = snap.docs;

        subsRef.current.forEach((u) => typeof u === "function" && u());
        subsRef.current = [];

        const reportsMap = {};
        const selectedDayName = getDayName(selectedDate);

        for (const sDoc of sessionDocs) {
          const sData = sDoc.data();
          const sessionId = sDoc.id;
          const sessionName = sData.subject || sData.title || "Untitled";
          const sessionBlock = sData.block || sData.section || "";
          const sessionDaysArr = Array.isArray(sData.days) ? sData.days : (sData.days ? [sData.days] : []);
          const sessionDaysShort = sessionDaysArr.map((d) => (typeof d === "string" ? d : ""));

          const attCol = collection(db, "sessions", sessionId, "attendance");
          const studentsCol = collection(db, "sessions", sessionId, "students");

          const studentsSnap = await getDocs(studentsCol);
          const allStudents = studentsSnap.docs.map((sd) => ({
            studentUid: sd.id,
            studentName: sd.data()?.fullname || sd.data()?.name || "Unknown",
          }));

          const unsub = onSnapshot(
            attCol,
            (attSnap) => {
              attSnap.forEach((docSnap) => {
                const d = docSnap.data();
                const rawStatus = (d.status || "").toString().trim();
                const lower = rawStatus.toLowerCase();
                let normalizedStatus = "absent";
                if (["present", "p", "true", "scanned", "1"].includes(lower)) {
                  normalizedStatus = "present";
                } else if (["absent", "a", "false", "0"].includes(lower)) {
                  normalizedStatus = "absent";
                } else if (["excused", "e"].includes(lower)) {
                  normalizedStatus = "excused";
                } else if (lower) {
                  normalizedStatus = lower;
                }

                const date = d.date || d.createdAt?.toDate?.()?.toISOString?.().split("T")[0] || new Date().toISOString().split("T")[0];
                if (date !== selectedDate) return;
                const key = `${sessionId}_${date}`;

                if (!reportsMap[key]) {
                  reportsMap[key] = {
                    id: key,
                    sessionId,
                    sessionName,
                    block: sessionBlock,
                    date,
                    students: [],
                    present: 0,
                    absent: 0,
                    excused: 0,
                    total: 0,
                  };
                }

                if (reportsMap[key].students.length === 0 && allStudents.length > 0) {
                  reportsMap[key].students = allStudents.map((s) => ({
                    studentUid: s.studentUid,
                    studentName: s.studentName,
                    status: "absent",
                  }));
                }

                const existingIndex = reportsMap[key].students.findIndex((s) => s.studentUid === d.studentUid);
                const studentEntry = {
                  studentUid: d.studentUid,
                  studentName: d.studentName || "Unknown",
                  status: normalizedStatus,
                  markedBy: d.markedBy || null,
                  createdAt: d.createdAt || null,
                };

                if (existingIndex >= 0) {
                  reportsMap[key].students[existingIndex] = studentEntry;
                } else {
                  reportsMap[key].students.push(studentEntry);
                }
              });

              if (sessionDaysShort.includes(getDayName(selectedDate))) {
                const defaultKey = `${sessionId}_${selectedDate}`;
                if (!reportsMap[defaultKey]) {
                  reportsMap[defaultKey] = {
                    id: defaultKey,
                    sessionId,
                    sessionName,
                    block: sessionBlock,
                    date: selectedDate,
                    students: allStudents.map((s) => ({
                      studentUid: s.studentUid,
                      studentName: s.studentName,
                      status: "absent",
                    })),
                    present: 0,
                    absent: allStudents.length,
                    excused: 0,
                    total: allStudents.length,
                  };
                }
              }

              Object.keys(reportsMap).forEach((k) => {
                if (k.startsWith(sessionId + "_")) {
                  const entry = reportsMap[k];
                  entry.present = entry.students.filter((s) => (s.status || "").toString().toLowerCase() === "present").length;
                  entry.absent = entry.students.filter((s) => (s.status || "").toString().toLowerCase() === "absent").length;
                  entry.excused = entry.students.filter((s) => (s.status || "").toString().toLowerCase() === "excused").length;
                  entry.total = entry.students.length;
                }
              });

              const arr = Object.values(reportsMap).sort((a, b) => {
                if (a.date === b.date) return a.sessionName.localeCompare(b.sessionName);
                return b.date.localeCompare(a.date);
              });

              if (mounted) setReports(arr);
            },
            (err) => {
              console.error("attendance onSnapshot error:", err);
              if (mounted) setReports(Object.values(reportsMap));
            }
          );

          subsRef.current.push(unsub);
        }

        if (mounted) setLoading(false);
      } catch (err) {
        console.error("fetch sessions for reports error", err);
        if (mounted) {
          setReports([]);
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
      subsRef.current.forEach((u) => typeof u === "function" && u());
      subsRef.current = [];
    };
  }, [isFocused, teacher?.uid, selectedDate]);

  const openModal = (entry) => setSelected(entry);
  const closeModal = () => setSelected(null);

  // small date selector UI
  const DateSelector = () => (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
      <TouchableOpacity onPress={() => changeSelectedDate(-1)} style={{ padding: 8 }}>
        <Ionicons name="chevron-back" size={20} color="#2563EB" />
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontWeight: "700", color: "#0F172A" }}>{selectedDate}</Text>
        <Text style={{ color: "#6B7280", fontSize: 12 }}>{getDayName(selectedDate)}</Text>
      </View>
      <TouchableOpacity onPress={() => changeSelectedDate(1)} style={{ padding: 8 }}>
        <Ionicons name="chevron-forward" size={20} color="#2563EB" />
      </TouchableOpacity>
      <TouchableOpacity onPress={setToday} style={{ padding: 8 }}>
        <Text style={{ color: "#2563EB", fontWeight: "600" }}>Today</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.sessionName}</Text>
        {item.block ? <Text style={styles.blockText}>{`Block ${item.block}`}</Text> : null}
        <Text style={styles.sub}>{item.date}</Text>
        <Text style={styles.small}>{item.total} total • {item.present} present • {item.absent} absent</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#475569" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 30 }} />
      ) : (
        <>
    
          <Text style={[styles.header, { marginTop: 15 }]}>Attendance Reports</Text>
          <DateSelector />
          {reports.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
              <Text style={{ color: "#64748b", marginTop: 10 }}>No attendance recorded yet</Text>
            </View>
          ) : (
            <FlatList
              data={reports}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}
        </>
      )}

      <Modal visible={!!selected} animationType="slide" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selected?.sessionName}</Text>
              <Text style={styles.modalDate}>{selected?.date}</Text>
              {selected?.block ? <Text style={styles.modalBlock}>{`Block ${selected.block}`}</Text> : null}
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalSummary}>
                Total: {selected?.total || 0} — Present: {selected?.present || 0} — Absent: {selected?.absent || 0}
              </Text>

              <FlatList
                data={selected?.students || []}
                keyExtractor={(s) => s.studentUid || s.studentName}
                renderItem={({ item }) => (
                  <View style={styles.studentRow}>
                    <View style={[
                      styles.dot,
                      item.status.toLowerCase() === "present" ? styles.dotPresent :
                      item.status.toLowerCase() === "excused" ? styles.dotExcused : styles.dotAbsent
                    ]} />
                    <Text style={styles.studentName}>{item.studentName}</Text>
                    <Text style={[
                      styles.studentStatus,
                      item.status.toLowerCase() === "present" ? { color: "#10B981" } : { color: "#EF4444" }
                    ]}>
                      {item.status}
                    </Text>
                  </View>
                )}
              />
            </View>

            <Pressable style={styles.closeBtn} onPress={closeModal}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFF", padding: 16 },
  header: { fontSize: 20, fontWeight: "700", color: "#1E3A8A", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EEF2FF",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  blockText: { fontSize: 13, color: "#044f85ff", marginTop: 4 },   // added for list cards
  sub: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  small: { fontSize: 12, color: "#475569", marginTop: 6 },
  empty: { alignItems: "center", marginTop: 40 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeader: { marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  modalDate: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  modalBlock: { fontSize: 13, color: "#6B7280", marginTop: 6 }, // added for modal header
  modalBody: { marginTop: 8, marginBottom: 12 },
  modalSummary: { fontSize: 13, color: "#475569", marginBottom: 8 },
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  dot: { width: 12, height: 12, borderRadius: 12, marginRight: 12 },
  dotPresent: { backgroundColor: "#10B981" },
  dotAbsent: { backgroundColor: "#EF4444" },
  dotExcused: { backgroundColor: "#F59E0B" },
  studentName: { flex: 1, fontSize: 15, color: "#0F172A" },
  studentStatus: { fontSize: 13, fontWeight: "700" },
  closeBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  closeText: { color: "#fff", fontWeight: "700" },
});

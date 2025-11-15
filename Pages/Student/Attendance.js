import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { useFocusEffect } from "@react-navigation/native";

export default function AttachLetter() {
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  // Load student info
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const saved = await AsyncStorage.getItem("currentUser");
        if (saved) {
          setStudent(JSON.parse(saved));
        }
      } catch (e) {
        console.error("load student error", e);
      }
    };
    loadStudent();
  }, []);

  // Fetch joined sessions + attendance records
  useFocusEffect(
    React.useCallback(() => {
      if (!student?.uid) {
        setClasses([]);
        setLoading(false);
        return;
      }

      let mounted = true;
      setLoading(true);

      (async () => {
        try {
          const sessionsRef = collection(db, "sessions");
          const allSessions = await getDocs(sessionsRef);

          const classList = [];

          // For each session, check if student joined
          for (const sessionDoc of allSessions.docs) {
            const sessionId = sessionDoc.id;
            const sessionData = sessionDoc.data();

            const studentDocRef = doc(
              db,
              "sessions",
              sessionId,
              "students",
              student.uid
            );
            const studentSnap = await getDoc(studentDocRef);

            // Only include sessions the student joined
            if (!studentSnap.exists()) continue;

            // Fetch attendance records for this student in this session
            const attendanceRef = collection(
              db,
              "sessions",
              sessionId,
              "attendance"
            );
            const attendanceSnap = await getDocs(attendanceRef);

            const sessions = [];
            attendanceSnap.forEach((attDoc) => {
              const attData = attDoc.data();
              // Only include attendance records for this student
              if (attData.studentUid === student.uid) {
                sessions.push({
                  id: attDoc.id,
                  date: attData.date || "Unknown",
                  status: attData.status || "Absent",
                });
              }
            });

            // Sort by date (newest first)
            sessions.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateB - dateA;
            });

            classList.push({
              id: sessionId,
              name: sessionData.subject || "Class", // subject only
              section: sessionData.block || "N/A",   // block shown below once
              sessions,
            });
          }

          if (mounted) {
            setClasses(classList);
            if (classList.length > 0) {
              setSelectedClassId(classList[0].id);
            }
            setLoading(false);
          }
        } catch (err) {
          console.error("fetch attendance error", err);
          if (mounted) {
            setClasses([]);
            setLoading(false);
          }
        }
      })();
    }, [student?.uid])
  );

  const selected = classes.find((c) => c.id === selectedClassId) || null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563EB"
          style={{ marginTop: 30 }}
        />
      ) : classes.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="clipboard-outline" size={48} color="#CBD5E1" />
          <Text style={{ color: "#64748b", marginTop: 10 }}>
            No classes joined yet
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {classes.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.card,
                selectedClassId === c.id && styles.activeCard,
              ]}
              onPress={() => setSelectedClassId(c.id)}
            >
              <View style={styles.cardRow}>
                <View>
                  <Text style={styles.className}>{c.name}</Text>
                  <Text style={styles.classSection}>
                    {c.section && c.section !== "N/A" ? `Block ${c.section}` : c.section}
                  </Text>
                  <Text style={styles.sessionCount}>
                    {c.sessions.length} attendance record
                    {c.sessions.length !== 1 ? "s" : ""}
                  </Text>
                </View>
                <Ionicons
                  name={
                    selectedClassId === c.id
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={22}
                  color="#2563EB"
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* 🔵 MODAL POPUP FOR ATTENDANCE LOG */}
      <Modal
        visible={selectedClassId !== null && !!selected}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setSelectedClassId(null)}
            >
              <Ionicons name="close" size={26} color="#1E3A8A" />
            </TouchableOpacity>

            {selected && (
              <>
                <Text style={styles.modalTitle}>
                  {selected.name} — Attendance Log
                </Text>

                {selected.sessions.length === 0 ? (
                  <Text style={styles.empty}>
                    No attendance records.
                  </Text>
                ) : (
                  <ScrollView style={{ maxHeight: 350 }}>
                    {selected.sessions.map((s) => (
                      <View key={s.id} style={styles.sessionRow}>
                        <Text style={styles.sessionDate}>
                          {s.date}
                        </Text>
                        <Text
                          style={[
                            styles.sessionStatus,
                            s.status === "Present"
                              ? styles.present
                              : s.status === "Absent"
                              ? styles.absent
                              : styles.late,
                          ]}
                        >
                          {s.status}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    padding: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 12,
  },
  list: { paddingBottom: 40 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: "#2563EB",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  className: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  classSection: { color: "#6b7280", marginTop: 4 },
  sessionCount: { fontSize: 12, color: "#9CA3AF", marginTop: 6 },

  empty: {
    alignItems: "center",
    paddingVertical: 40,
    color: "#6b7280",
  },

  /* 📌 Modal */
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalBox: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    maxHeight: "80%",
  },
  modalClose: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 14,
  },

  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2ff",
  },
  sessionDate: { color: "#334155", fontWeight: "500" },
  sessionStatus: { fontWeight: "700" },
  present: { color: "#059669" },
  absent: { color: "#ef4444" },
  late: { color: "#d97706" },
});

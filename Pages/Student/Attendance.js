import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AttachLetter() {
  const [selectedClassId, setSelectedClassId] = useState(null);

  const classes = [
    {
      id: "c1",
      name: "Mathematics 101",
      section: "BSCS-1",
      sessions: [
        { id: "m1", date: "Nov 10, 2025", status: "Present" },
        { id: "m2", date: "Nov 09, 2025", status: "Absent" },
        { id: "m3", date: "Nov 08, 2025", status: "Present" },
      ],
    },
    {
      id: "c2",
      name: "English Literature",
      section: "BSCS-2",
      sessions: [
        { id: "e1", date: "Nov 10, 2025", status: "Present" },
        { id: "e2", date: "Nov 07, 2025", status: "Late" },
      ],
    },
    {
      id: "c3",
      name: "Data Structures",
      section: "BSCS-3",
      sessions: [
        { id: "d1", date: "Nov 10, 2025", status: "Absent" },
        { id: "d2", date: "Nov 06, 2025", status: "Present" },
      ],
    },
  ];

  const selected = classes.find((c) => c.id === selectedClassId) || null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Classes</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {classes.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.card}
            onPress={() => setSelectedClassId(c.id)}
          >
            <View style={styles.cardRow}>
              <View>
                <Text style={styles.className}>{c.name}</Text>
                <Text style={styles.classSection}>{c.section}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#2563EB" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 🔵 MODAL POPUP FOR ATTENDANCE LOG */}
      <Modal
        visible={selectedClassId !== null}
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
                  <Text style={styles.empty}>No attendance records.</Text>
                ) : (
                  <ScrollView style={{ maxHeight: 350 }}>
                    {selected.sessions.map((s) => (
                      <View key={s.id} style={styles.sessionRow}>
                        <Text style={styles.sessionDate}>{s.date}</Text>
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
  container: { flex: 1, backgroundColor: "#f7f9fc", padding: 16 },
  header: { fontSize: 22, fontWeight: "700", color: "#1E3A8A", marginBottom: 12 },
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
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  className: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  classSection: { color: "#6b7280", marginTop: 4 },

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
  },
  modalClose: {
    alignSelf: "flex-end",
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 14,
  },

  empty: { color: "#6b7280", paddingVertical: 8 },

  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2ff",
  },
  sessionDate: { color: "#334155" },
  sessionStatus: { fontWeight: "700" },
  present: { color: "#059669" },
  absent: { color: "#ef4444" },
  late: { color: "#d97706" },
});

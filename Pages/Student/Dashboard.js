// Dashboard.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function Dashboard() {
  const [student, setStudent] = useState({
    id: "STU2025-001",
    name: "Abhay Kumar",
    section: "CS-3A",
  });

  const [attendance, setAttendance] = useState(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setToday(formatted);
  }, []);

  const handleAttendance = async (status) => {
    setAttendance(status);
    try {
      // Example backend call
      await fetch("https://your-api-endpoint.com/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.id,
          date: new Date().toISOString().split("T")[0],
          status: status,
        }),
      });
      Alert.alert("Success", `Attendance marked as ${status}`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to mark attendance. Please try again.");
    }
  };

  const qrData = JSON.stringify({
    id: student.id,
    name: student.name,
    section: student.section,
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.headerTitle}>Home</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* QR Code Section */}
        <View style={styles.qrContainer}>
          <QRCode
            value={qrData}
            size={180}
            backgroundColor="#1f1f1f"
            color="#fbbf24"
          />
          <Text style={styles.qrLabel}>Scan this code for attendance</Text>
        </View>

        {/* Attendance Card */}
        <View style={styles.card}>
          <View style={styles.studentRow}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
              }}
              style={styles.studentImage}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentSection}>{student.section}</Text>
            </View>
            <Text style={styles.dateText}>{today}</Text>
          </View>

          <Text style={styles.attendanceTitle}>ATTENDANCE</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.attendanceButton,
                attendance === "Present" && styles.presentButton,
              ]}
              onPress={() => handleAttendance("Present")}
            >
              <Text
                style={[
                  styles.buttonText,
                  attendance === "Present" && styles.presentText,
                ]}
              >
                PRESENT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.attendanceButton,
                attendance === "Absent" && styles.absentButton,
              ]}
              onPress={() => handleAttendance("Absent")}
            >
              <Text
                style={[
                  styles.buttonText,
                  attendance === "Absent" && styles.absentText,
                ]}
              >
                ABSENT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <Text style={[styles.navItem, styles.activeNav]}>HOME</Text>
        <Text style={styles.navItem}>NOTIFICATION</Text>
        <Text style={styles.navItem}>ATTACH LETTER</Text>
        <Text style={styles.navItem}>LOG</Text>
        <Text style={styles.navItem}>MORE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f3f3" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  profileImage: { width: 40, height: 40, borderRadius: 20 },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  content: {
    padding: 20,
    alignItems: "center",
  },
  qrContainer: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    alignItems: "center",
  },
  qrLabel: { color: "#fbbf24", marginTop: 10, fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  studentImage: { width: 40, height: 40, borderRadius: 20 },
  studentName: { fontWeight: "bold", fontSize: 16 },
  studentSection: { color: "#666", fontSize: 13 },
  dateText: { color: "#666", fontSize: 12 },
  attendanceTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-around" },
  attendanceButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  presentButton: {
    backgroundColor: "#d1fae5",
    borderWidth: 1,
    borderColor: "#10b981",
  },
  absentButton: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  buttonText: { fontWeight: "bold", color: "#333" },
  presentText: { color: "#065f46" },
  absentText: { color: "#7f1d1d" },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#201c2b",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: { color: "#ccc", fontSize: 12, fontWeight: "bold" },
  activeNav: { color: "#fbbf24" },
});

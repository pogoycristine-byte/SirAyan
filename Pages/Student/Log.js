import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Log() {
  const attendanceData = [
    { date: "October 6", status: "Absent", remarks: "Excuse Letter Sent" },
    { date: "October 5", status: "Present", remarks: "" },
    { date: "October 4", status: "Present", remarks: "" },
    { date: "October 3", status: "Present", remarks: "" },
    { date: "October 2", status: "Present", remarks: "" },
    { date: "October 1", status: "Absent", remarks: "" },
  ];

  const renderStatusIcon = (status) => {
    if (status === "Present") {
      return <Ionicons name="checkmark-circle" size={18} color="#22c55e" />;
    } else {
      return <Ionicons name="close-circle" size={18} color="#ef4444" />;
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Attendance Log</Text>
      </View>

      {/* Card Container */}
      <View style={styles.card}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCol, { flex: 1 }]}>Date</Text>
          <Text style={[styles.headerCol, { flex: 1 }]}>Status</Text>
          <Text style={[styles.headerCol, { flex: 1.5 }]}>Remarks</Text>
        </View>

        {/* Table Body */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {attendanceData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                { backgroundColor: index % 2 === 0 ? "#f0f9ff" : "#e0f2fe" },
              ]}
            >
              <Text style={[styles.cellText, { flex: 1 }]}>{item.date}</Text>

              <View style={[styles.statusCell, { flex: 1 }]}>
                {renderStatusIcon(item.status)}
                <Text style={[styles.cellText, { marginLeft: 6 }]}>
                  {item.status}
                </Text>
              </View>

              <Text style={[styles.cellText, { flex: 1.5 }]}>
                {item.remarks || "-"}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc", // light gray-blue background
    paddingHorizontal: 15,
    paddingTop: 40,
  },
  header: {
    backgroundColor: "#1d4ed8", // blue header like in your pic
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#3b82f6",
    paddingBottom: 8,
    marginBottom: 5,
  },
  headerCol: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1e3a8a",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 4,
  },
  cellText: {
    color: "#1e3a8a",
    fontSize: 14,
  },
  statusCell: {
    flexDirection: "row",
    alignItems: "center",
  },
});

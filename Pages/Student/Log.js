import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Log() {
  // Replace this with your API data when ready
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
      return <Ionicons name="checkmark-circle" size={18} color="#22c55e" />; // green
    } else {
      return <Ionicons name="close-circle" size={18} color="#ef4444" />; // red
    }
  };

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, { flex: 1 }]}>Date</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>Status</Text>
        <Text style={[styles.headerText, { flex: 1.5 }]}>Remarks</Text>
      </View>

      <ScrollView style={{ marginTop: 5 }}>
        {/* Table Rows */}
        {attendanceData.map((item, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              { backgroundColor: index % 2 === 0 ? "#e0f2fe" : "#bae6fd" }, // alternating light blues
            ]}
          >
            <Text style={[styles.cellText, { flex: 1, color: "#1e3a8a" }]}>{item.date}</Text>
            <View style={[styles.statusCell, { flex: 1 }]}>
              {renderStatusIcon(item.status)}
              <Text style={[styles.cellText, { marginLeft: 6, color: "#1e3a8a" }]}>{item.status}</Text>
            </View>
            <Text style={[styles.cellText, { flex: 1.5, color: "#1e3a8a" }]}>{item.remarks || "-"}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // white background
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#3b82f6", // blue border
    paddingBottom: 8,
    marginBottom: 5,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#2563eb", // blue text
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cellText: {
    fontSize: 15,
  },
  statusCell: {
    flexDirection: "row",
    alignItems: "center",
  },
});

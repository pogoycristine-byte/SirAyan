import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { globalStyles } from "../../Styles/globalStyles";
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
      return <Ionicons name="checkmark-circle" size={18} color="green" />;
    } else {
      return <Ionicons name="close-circle" size={18} color="red" />;
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Attendance Log</Text>

      {/* Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, { flex: 1 }]}>Date</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>Status</Text>
        <Text style={[styles.headerText, { flex: 1.5 }]}>Remarks</Text>
      </View>

      {/* Rows */}
      {attendanceData.map((item, index) => (
        <View
          key={index}
          style={[
            styles.tableRow,
            { backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" },
          ]}
        >
          <Text style={[styles.cellText, { flex: 1 }]}>{item.date}</Text>
          <View style={[styles.statusCell, { flex: 1 }]}>
            {renderStatusIcon(item.status)}
            <Text style={{ marginLeft: 4 }}>{item.status}</Text>
          </View>
          <Text style={[styles.cellText, { flex: 1.5 }]}>{item.remarks}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  cellText: {
    fontSize: 14,
  },
  statusCell: {
    flexDirection: "row",
    alignItems: "center",
  },
});

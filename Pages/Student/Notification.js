import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

// Example attendance notifications
const notificationsData = [
  { id: "1", type: "present", date: "Oct 15, 2025", time: "08:15 AM" },
  { id: "2", type: "late", date: "Oct 14, 2025", time: "08:45 AM" },
  { id: "3", type: "absent", date: "Oct 13, 2025", time: null },
  { id: "4", type: "reminder", date: "Oct 15, 2025", time: "08:00 AM", class: "CS101" },
];

export default function AttendanceNotifications() {
  const renderItem = ({ item }) => {
    let icon, message;

    switch (item.type) {
      case "present":
        icon = "✅";
        message = `You have been marked present.`;
        break;
      case "absent":
        icon = "❌";
        message = `You have been marked absent.`;
        break;
      case "late":
        icon = "⏰";
        message = `You were marked late.`;
        break;
      case "reminder":
        icon = "🔔";
        message = `Reminder to mark attendance for ${item.class}.`;
        break;
      default:
        icon = "";
        message = "";
    }

    return (
      <View style={styles.notification}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.dateTime}>
            {item.date} {item.time ? `• ${item.time}` : ""}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance Notifications</Text>
      <FlatList
        data={notificationsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  notification: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 14,
    color: "#555",
  },
});

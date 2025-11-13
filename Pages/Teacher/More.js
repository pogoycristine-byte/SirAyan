import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function More() {
  const navigation = useNavigation();

  const user = {
    name: "Prof. Maria Gonzales",
    department: "Computer Science Department",
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => navigation.navigate("Account") },
    ]);
  };

  const handleHelp = () => {
    Alert.alert(
      "Help & Support",
      "Useful Links for Attendance Tracker:\n\n- Guide: https://example.com/guide\n- FAQ: https://example.com/faq\n- Support: https://example.com/support",
      [
        { text: "Close", style: "cancel" },
        { text: "Open Guide", onPress: () => Linking.openURL("https://example.com/guide") },
        { text: "Open FAQ", onPress: () => Linking.openURL("https://example.com/faq") },
        { text: "Contact Support", onPress: () => Linking.openURL("mailto:support@example.com") },
      ]
    );
  };

  const handleFAQ = () => {
    Alert.alert(
      "FAQs",
      "Frequently Asked Questions:\n\n- How to start a session?\n- How to add students?\n- How to track attendance?",
      [
        { text: "Close", style: "cancel" },
        { text: "Open FAQ Page", onPress: () => Linking.openURL("https://example.com/faq") },
      ]
    );
  };

  return (
    <View style={styles.morecContainer}>
      {/* User Info */}
      <View style={styles.morecUserCard}>
        <Text style={styles.morecUserName}>{user.name}</Text>
        <Text style={styles.morecUserDept}>{user.department}</Text>
      </View>

      {/* Help & Support */}
      <TouchableOpacity style={styles.morecOptionButton} onPress={handleHelp}>
        <Text style={styles.morecOptionText}>Help & Support</Text>
      </TouchableOpacity>

      {/* FAQs */}
      <TouchableOpacity style={styles.morecOptionButton} onPress={handleFAQ}>
        <Text style={styles.morecOptionText}>FAQs</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.morecOptionButton} onPress={handleLogout}>
        <Text style={[styles.morecOptionText, { color: "#EF4444" }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  morecContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 57, // slightly lower
    backgroundColor: "#F0F4FF",
  },
  morecUserCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 10, // smaller gap
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  morecUserName: { fontSize: 17, fontWeight: "700", color: "#1E3A8A" },
  morecUserDept: { fontSize: 13, color: "#555", marginTop: 3 },
  morecOptionButton: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 0, // removed extra gap
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  morecOptionText: { fontSize: 15, color: "#1E3A8A", fontWeight: "600" },
});

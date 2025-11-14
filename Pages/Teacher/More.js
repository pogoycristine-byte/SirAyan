import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function More() {
  const navigation = useNavigation();

  // ------------------ HOOKS (must stay at top level) ------------------ //
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // ------------------------------------------------------------------- //

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
    <View style={styles.container}>
      {/* USER INFO CARD */}
      <View style={styles.userCard}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userDept}>{user.department}</Text>
      </View>

      {/* -------------------- PROFILE SETTINGS -------------------- */}
      <Text style={styles.sectionHeader}>PROFILE SETTINGS</Text>

      <TouchableOpacity style={styles.rowButton}>
        <Text style={styles.rowLabel}>Name</Text>
        <Ionicons name="chevron-forward" size={20} color="#475569" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.rowButton}>
        <Text style={styles.rowLabel}>Change Password</Text>
        <Ionicons name="chevron-forward" size={20} color="#475569" />
      </TouchableOpacity>

      {/* -------------------- APPLICATION PREFERENCES -------------------- */}
      <Text style={styles.sectionHeader}>APPLICATION PREFERENCES</Text>

      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.rowLabel}>Notification Preferences</Text>
          <Text style={styles.smallLabel}>Status: {notifEnabled ? "On" : "Off"}</Text>
        </View>
        <Switch
          value={notifEnabled}
          onValueChange={setNotifEnabled}
          thumbColor={notifEnabled ? "#2563EB" : "#CBD5E1"}
        />
      </View>

      {/* Removed Dark Mode toggle here */}

      {/* -------------------- HELP & SUPPORT -------------------- */}
      <Text style={styles.sectionHeader}>HELP & SUPPORT</Text>

      <TouchableOpacity style={styles.rowButton} onPress={handleFAQ}>
        <Text style={styles.rowLabel}>FAQs / Contact Support</Text>
        <Ionicons name="chevron-forward" size={20} color="#475569" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.rowButton} onPress={handleHelp}>
        <Text style={styles.rowLabel}>Privacy Policy</Text>
        <Ionicons name="chevron-forward" size={20} color="#475569" />
      </TouchableOpacity>

      {/* -------------------- LOGOUT BUTTON -------------------- */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/* --------------------------- STYLES --------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
    backgroundColor: "#F0F4FF",
  },

  userCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  userName: { fontSize: 18, fontWeight: "700", color: "#1E3A8A" },
  userDept: { fontSize: 14, color: "#6B7280", marginTop: 2 },

  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 18,
    marginBottom: 8,
  },

  rowButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },

  rowLabel: { fontSize: 15, fontWeight: "600", color: "#1E293B" },
  smallLabel: { fontSize: 12, color: "#64748B", marginTop: 2 },

  toggleRow: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoutButton: {
    marginTop: 25,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 1,
    paddingRight: 250,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#EF4444",
  },
});

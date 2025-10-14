import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";

export default function TeacherDashboard() {
  const navigation = useNavigation();
  const [teacher, setTeacher] = useState({
    id: "i don't know",
    name: "Jay Ian Camelotes",
    department: "Computer Study Department",
  });
  // Logout Function
  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Splash" }],
            })
          );
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.headerTitle}>Teacher Dashboard</Text>
        </View>

        {/* ✅ Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/1828/1828490.png",
            }}
            style={styles.logoutIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Teacher ID</Text>
          <Text style={styles.value}>{teacher.id}</Text>

          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{teacher.name}</Text>

          <Text style={styles.label}>Department</Text>
          <Text style={styles.value}>{teacher.department}</Text>
        </View>

        {/* Scan QR Button */}
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => navigation.navigate("QRScannerPage")}
        >
          <Text style={styles.qrButtonText}>📷 Scan Student QR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f3f3" },

  header: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 2,
  },

  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  profileImage: { width: 40, height: 40, borderRadius: 20 },
  headerTitle: { fontSize: 18, fontWeight: "600" },

  logoutButton: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 10,
  },
  logoutIcon: { width: 22, height: 22, tintColor: "#ef4444" },

  content: { padding: 20, alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  label: { fontSize: 14, color: "#666", marginTop: 10 },
  value: { fontSize: 16, fontWeight: "600", color: "#222" },

  qrButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  qrButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

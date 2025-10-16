import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "students"));
      const data = querySnapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter(
          (s) =>
            s.excuse_letter &&
            (s.excuse_letter === "Pending" || s.excuse_letter === "Submitted")
        );
      setStudents(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch excuse letters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  const handleApproveLetter = async (studentId) => {
    Alert.alert("Approve Excuse Letter", "Approve this student's excuse letter?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: async () => {
          try {
            const studentRef = doc(db, "students", studentId);
            await updateDoc(studentRef, { excuse_letter: "Approved" });
            Alert.alert("Success", "Excuse letter approved.");
            fetchStudents();
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to approve letter.");
          }
        },
      },
    ]);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStudent = ({ item }) => (
    <View style={styles.studentCard}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
        }}
        style={styles.studentImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentId}>
          {item.studentId || item.id} • {item.section || "No section"}
        </Text>
        <Text
          style={[
            styles.statusText,
            { color: item.status === "Present" ? "#22c55e" : "#ef4444" },
          ]}
        >
          {item.status || "Absent"}
        </Text>
        <Text style={styles.lastAttendance}>
          Last Attendance: {item.last_date || "—"}
        </Text>
        <Text
          style={[
            styles.letterStatus,
            {
              color:
                item.excuse_letter === "Pending"
                  ? "#facc15"
                  : item.excuse_letter === "Approved"
                  ? "#22c55e"
                  : "#64748b",
            },
          ]}
        >
          Excuse Letter: {item.excuse_letter || "None"}
        </Text>
      </View>

      {item.excuse_letter === "Pending" && (
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleApproveLetter(item.id)}
        >
          <Ionicons name="checkmark" size={18} color="#fff" />
          <Text style={styles.approveText}>Approve</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.header}>📄 Review Excuse Letters</Text>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#2563EB" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or ID"
              value={searchQuery}
              onChangeText={setSearchQuery}
              keyboardShouldPersistTaps="handled"
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={filteredStudents}
              keyExtractor={(item) => item.id}
              renderItem={renderStudent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>No pending excuse letters.</Text>
              }
              contentContainerStyle={{ paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FF",
    padding: 0,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: "#333" },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  studentImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  studentName: { fontSize: 16, fontWeight: "bold", color: "#1E3A8A" },
  studentId: { fontSize: 13, color: "#555" },
  statusText: { fontSize: 14, fontWeight: "600", marginTop: 3 },
  lastAttendance: { fontSize: 12, color: "#64748B", marginTop: 2 },
  letterStatus: { fontSize: 13, fontWeight: "600", marginTop: 2 },
  approveButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  approveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 20,
    fontSize: 14,
  },
});

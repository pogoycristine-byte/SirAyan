import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Modal from "react-native-modal";
import * as DocumentPicker from "expo-document-picker";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Firestore
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../src/config/firebase";

export default function ManageStudents({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { classInfo } = route.params;
  const [students, setStudents] = useState([]);

  // Form state
  const [studentName, setStudentName] = useState("");
  const [year, setYear] = useState("");
  const [block, setBlock] = useState("");
  const [email, setEmail] = useState("");

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [tempStudent, setTempStudent] = useState(null);

  // View Student Modal
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // ---------------- load students from Firestore ----------------
  useEffect(() => {
    if (!classInfo?.id) return;
    const studentsCol = collection(db, "sessions", classInfo.id, "students");
    const unsub = onSnapshot(
      studentsCol,
      (snap) => {
        const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        arr.sort((a, b) => {
          const ta = a.joinedAt ? a.joinedAt.toMillis?.() || 0 : 0;
          const tb = b.joinedAt ? b.joinedAt.toMillis?.() || 0 : 0;
          return tb - ta;
        });
        setStudents(arr);
      },
      (err) => {
        console.error("students onSnapshot error:", err);
      }
    );
    return () => unsub();
  }, [classInfo?.id]);

  // ---------------- add student (confirm) ----------------
  const addStudent = () => {
    if (!studentName || !year || !block || !email) {
      Alert.alert("Validation", "Please fill in all fields");
      return;
    }
    const newStudent = {
      id: Date.now().toString(),
      name: studentName,
      year,
      block,
      email,
      file: null,
    };
    setTempStudent(newStudent);
    setIsConfirm(true);
  };

  const confirmAddStudent = async () => {
    if (!tempStudent) return;
    try {
      const studentRef = doc(db, "sessions", classInfo.id, "students", tempStudent.id);
      await setDoc(studentRef, {
        uid: tempStudent.id,
        fullname: tempStudent.name,
        year: tempStudent.year,
        block: tempStudent.block,
        email: tempStudent.email,
        file: null,
        joinedAt: new Date().toISOString(),
      });

      setStudentName("");
      setYear("");
      setBlock("");
      setEmail("");
      setTempStudent(null);
      setIsConfirm(false);
      setModalVisible(false);
      Alert.alert("Success", "Student added");
    } catch (err) {
      console.error("confirmAddStudent error:", err);
      Alert.alert("Error", "Failed to add student");
    }
  };

  const cancelAddStudent = () => {
    setIsConfirm(false);
  };

  // ---------------- delete student from Firestore ----------------
  const deleteStudent = (id) => {
    Alert.alert("Delete Student", "Are you sure you want to delete this student?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "sessions", classInfo.id, "students", id));
            Alert.alert("Deleted", "Student removed");
          } catch (err) {
            console.error("deleteStudent error:", err);
            Alert.alert("Error", "Failed to delete student");
          }
        },
      },
    ]);
  };

  // ---------------- view student (FIXED SECTION/BLOCK HERE) ----------------
  const viewStudent = async (student) => {
    try {
      let enriched = { ...student };

      let uid = student.uid || student.id || student.studentUid || student.userId || null;

      if (!uid && (student.email || student.username || student.fullname)) {
        const usersCol = collection(db, "users");
        let q = null;
        if (student.email) q = query(usersCol, where("email", "==", student.email));
        else if (student.username) q = query(usersCol, where("username", "==", student.username));
        else q = query(usersCol, where("fullname", "==", student.fullname));
        const snaps = await getDocs(q);
        if (!snaps.empty) {
          const udoc = snaps.docs[0];
          uid = udoc.id;
          enriched = { ...udoc.data(), ...enriched, uid };
        }
      }

      if (uid) {
        const userRef = doc(db, "users", String(uid));
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const ud = userSnap.data();
          enriched = {
            ...enriched,
            fullname: enriched.fullname || ud.fullname || ud.name || "",
            "student-id": enriched["student-id"] || ud["student-id"] || ud.studentId || "",
            year: enriched.year || ud.year || "",

            // ---------------- FIXED SECTION/BLOCK ----------------
            section: ud.section || enriched.section || "",
            block: ud.block || enriched.block || "",
            // -----------------------------------------------------

            email: enriched.email || ud.email || "",
            uid: String(uid),
          };
        }
      }

      setSelectedStudent(enriched);
      setViewModalVisible(true);
    } catch (err) {
      console.error("viewStudent error:", err);
      setSelectedStudent(student);
      setViewModalVisible(true);
    }
  };

  // ---------------- attach file ----------------
  const attachFile = async (studentId) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (res.type === "success") {
        const file = { name: res.name, uri: res.uri, type: res.mimeType || "document" };
        const studentRef = doc(db, "sessions", classInfo.id, "students", studentId);
        await setDoc(
          studentRef,
          {
            file,
            fileAttachedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        Alert.alert("File Attached", `File attached for student`);
      }
    } catch (err) {
      console.error("attachFile error:", err);
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const viewFile = (file) => {
    if (!file?.uri) return;
    Linking.openURL(file.uri).catch(() => {
      Alert.alert("Error", "Cannot open this file.");
    });
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.uid?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 15 + insets.top }}>
            {/* Search Bar */}
            <View style={styles.manageSearchContainer}>
              <Ionicons name="search" size={20} color="#2563EB" />
              <TextInput
                style={styles.manageSearchInput}
                placeholder="Search by name or ID"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Header Row */}
            <View style={styles.manageHeaderRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="list" size={22} color="#1E3A8A" style={{ marginRight: 8 }} />
                <Text style={styles.manageListTitle}>Student's List</Text>
              </View>
              <TouchableOpacity
                style={styles.manageAddButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.manageAddButtonText}>Add Student</Text>
              </TouchableOpacity>
            </View>

            {/* Add / Confirm Modal */}
            <Modal
              isVisible={modalVisible}
              onBackdropPress={() => setModalVisible(false)}
              backdropOpacity={0.5}
            >
              <View style={styles.manageModalContent}>
                {!isConfirm ? (
                  <>
                    <Text style={styles.manageModalTitle}>Add New Student</Text>
                    <TextInput style={styles.manageInput} placeholder="Name" placeholderTextColor="#777" value={studentName} onChangeText={setStudentName} />
                    <TextInput style={styles.manageInput} placeholder="Year" placeholderTextColor="#777" value={year} onChangeText={setYear} />
                    <TextInput style={styles.manageInput} placeholder="Block" placeholderTextColor="#777" value={block} onChangeText={setBlock} />
                    <TextInput style={styles.manageInput} placeholder="Email" placeholderTextColor="#777" value={email} onChangeText={setEmail} />
                    <TouchableOpacity style={styles.manageModalAddButton} onPress={addStudent}>
                      <Text style={styles.manageAddButtonText}>Add Student</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.manageModalTitle}>Confirm Student Details</Text>
                    <Text style={styles.manageDetailText}>Name: {tempStudent.name}</Text>
                    <Text style={styles.manageDetailText}>Year: {tempStudent.year}</Text>
                    <Text style={styles.manageDetailText}>Block: {tempStudent.block}</Text>
                    <Text style={styles.manageDetailText}>Email: {tempStudent.email}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                      <TouchableOpacity style={[styles.manageModalAddButton, { flex: 1, marginRight: 10 }]} onPress={cancelAddStudent}>
                        <Text style={styles.manageAddButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.manageModalAddButton, { flex: 1, marginLeft: 10 }]} onPress={confirmAddStudent}>
                        <Text style={styles.manageAddButtonText}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </Modal>

            {/* View Student Modal */}
            <Modal
              isVisible={viewModalVisible}
              onBackdropPress={() => setViewModalVisible(false)}
              backdropOpacity={0.5}
            >
              {selectedStudent && (
                <View style={styles.manageModalContent}>
                  <Text style={styles.manageModalTitle}>{selectedStudent.fullname || selectedStudent.name}</Text>

                  <Text style={styles.manageDetailText}>Student ID: {selectedStudent["student-id"] || selectedStudent.uid || selectedStudent.id}</Text>
                  <Text style={styles.manageDetailText}>Year: {selectedStudent.year || ""}</Text>
                  <Text style={styles.manageDetailText}>Section / Block: {selectedStudent.section || selectedStudent.block || ""}</Text>
                  <Text style={styles.manageDetailText}>Email: {selectedStudent.email || ""}</Text>

                  {selectedStudent.file && (
                    <TouchableOpacity style={[styles.manageModalAddButton, { backgroundColor: "#10B981" }]} onPress={() => viewFile(selectedStudent.file)}>
                      <Text style={styles.manageAddButtonText}>View Attached File</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={[styles.manageModalAddButton, { marginTop: 15 }]} onPress={() => setViewModalVisible(false)}>
                    <Text style={styles.manageAddButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Modal>

            {/* Students List */}
            <FlatList
              data={filteredStudents}
              keyExtractor={(item) => item.uid || item.id}
              renderItem={({ item }) => (
                <View style={styles.manageStudentCardRow}>
                  <Text style={styles.manageStudentName}>{item.fullname || item.name}</Text>
                  <View style={styles.manageStudentActions}>
                    <TouchableOpacity onPress={() => viewStudent(item)} style={styles.manageActionBtn}>
                      <Ionicons name="eye" size={20} color="#2563EB" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteStudent(item.uid || item.id)} style={styles.manageActionBtn}>
                      <Ionicons name="trash" size={20} color="#EF4444" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => attachFile(item.uid || item.id)} style={styles.manageActionBtn}>
                      <Ionicons name="document-text-outline" size={20} color={item.file ? "#10B981" : "#6B7280"} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>No students added yet</Text>}
              scrollEnabled={false}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  manageSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 15,
    marginTop: 15,
  },
  manageSearchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: "#333" },
  manageHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15, marginTop: 10 },
  manageListTitle: { fontSize: 18, fontWeight: "700", color: "#1E3A8A" },
  manageAddButton: { backgroundColor: "#2563EB", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  manageAddButtonText: { color: "#fff", fontWeight: "bold" },
  manageInput: { width: "100%", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 10, padding: 12, backgroundColor: "#fff", color: "#000", fontSize: 16, marginBottom: 10 },
  manageStudentCardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  manageStudentName: { fontSize: 16, color: "#1E3A8A", fontWeight: "700" },
  manageStudentActions: { flexDirection: "row" },
  manageActionBtn: { marginLeft: 15 },
  manageModalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 20 },
  manageModalTitle: { fontSize: 18, fontWeight: "700", color: "#1E3A8A", marginBottom: 15, textAlign: "center" },
  manageModalAddButton: { backgroundColor: "#2563EB", paddingVertical: 12, borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 10 },
  manageDetailText: { fontSize: 16, marginBottom: 5, color: "#333" },
});

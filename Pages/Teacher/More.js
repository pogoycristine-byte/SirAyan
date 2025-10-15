import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Animated,
  Easing,
  Image,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

const More = () => {
  const navigation = useNavigation();
  const [teacher, setTeacher] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    role: "Teacher",
  });

  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showTeacherPasswordModal, setShowTeacherPasswordModal] = useState(false);
  const [showStudentPasswordModal, setShowStudentPasswordModal] = useState(false);
  const [showViewStudentsModal, setShowViewStudentsModal] = useState(false);

  const [newStudent, setNewStudent] = useState({ username: "", email: "", password: "" });
  const [teacherPassword, setTeacherPassword] = useState("");
  const [studentPasswordChange, setStudentPasswordChange] = useState({ username: "", newPassword: "" });

  const [fadeAnim] = useState(new Animated.Value(0));

  const studentsList = [
    "Cristine Pogoy",
    "Carl Romanda",
    "Cherry Ruth Taghoy",
    "Deasyrie Sanico",
    "Mylene Boncales",
    "Genie Mae Crompido",
    "Imee Palmero",
    "Jubelle Franze Mabalatan",
    "Judelien Tampos",
    "Myla Vallentos",
  ];

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const fadeOut = (callback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start(() => callback && callback());
  };

  const handleAddStudent = () => {
    if (!newStudent.username || !newStudent.email || !newStudent.password) {
      Alert.alert("Error", "Please fill all fields to add a student");
      return;
    }
    Alert.alert("Success", `Student ${newStudent.username} added!`);
    setNewStudent({ username: "", email: "", password: "" });
    fadeOut(() => setShowAddStudentModal(false));
  };

  const handleChangeTeacherPassword = () => {
    if (!teacherPassword) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }
    Alert.alert("Success", "Your password has been updated!");
    setTeacherPassword("");
    fadeOut(() => setShowTeacherPasswordModal(false));
  };

  const handleChangeStudentPassword = () => {
    if (!studentPasswordChange.username || !studentPasswordChange.newPassword) {
      Alert.alert("Error", "Please enter student username and new password");
      return;
    }
    Alert.alert("Success", `Password for ${studentPasswordChange.username} updated!`);
    setStudentPasswordChange({ username: "", newPassword: "" });
    fadeOut(() => setShowStudentPasswordModal(false));
  };

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.reset({
                index: 0,
                routes: [{ name: "Account" }],
              });
            } catch (error) {
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          },
        },
      ]
    );
  };

  const openModal = (setModal) => {
    setModal(true);
    fadeIn();
  };

  const renderModal = (visible, setVisible, title, content) => (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => fadeOut(() => setVisible(false))}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>{title}</Text>
          {content}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => fadeOut(() => setVisible(false))}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
      <LinearGradient colors={["#2563EB", "#1E3A8A"]} style={styles.headerGradient}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
            style={styles.profileImage}
          />
          <View style={{ marginLeft: 12 }}>
            {/* Removed "Welcome back," */}
            <Text style={styles.teacherName}>{teacher.name}</Text>
            <Text style={styles.departmentText}>{teacher.role}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Action Cards */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => openModal(setShowViewStudentsModal)}>
          <Text style={styles.cardText}>View Students</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Attendance Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Class Schedule</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
      <Text style={styles.sectionHeader}>Manage Students & Account</Text>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => openModal(setShowAddStudentModal)}>
          <Text style={styles.buttonText}>Add Student</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openModal(setShowTeacherPasswordModal)}>
          <Text style={styles.buttonText}>Update Your Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openModal(setShowStudentPasswordModal)}>
          <Text style={styles.buttonText}>Update Student Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutBtn]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {renderModal(showViewStudentsModal, setShowViewStudentsModal, "Students List", (
        <ScrollView style={{ maxHeight: 250 }}>
          {studentsList
            .map(name => {
              const parts = name.split(" ");
              const surname = parts.slice(-1)[0];
              const firstname = parts.slice(0, -1).join(" ");
              return { surname, firstname };
            })
            .sort((a, b) => a.surname.localeCompare(b.surname))
            .map((student, index) => (
              <View key={index} style={styles.studentItem}>
                <Text style={styles.studentText}>{`${student.surname}, ${student.firstname}`}</Text>
              </View>
            ))
          }
        </ScrollView>
      ))}

      {renderModal(showAddStudentModal, setShowAddStudentModal, "Add New Student", (
        <>
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={newStudent.username}
            onChangeText={(text) => setNewStudent((prev) => ({ ...prev, username: text }))}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={newStudent.email}
            onChangeText={(text) => setNewStudent((prev) => ({ ...prev, email: text }))}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={newStudent.password}
            onChangeText={(text) => setNewStudent((prev) => ({ ...prev, password: text }))}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddStudent}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ))}

      {renderModal(showTeacherPasswordModal, setShowTeacherPasswordModal, "Update Your Password", (
        <>
          <TextInput
            placeholder="New Password"
            style={styles.input}
            secureTextEntry
            value={teacherPassword}
            onChangeText={setTeacherPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleChangeTeacherPassword}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ))}

      {renderModal(showStudentPasswordModal, setShowStudentPasswordModal, "Update Student Password", (
        <>
          <TextInput
            placeholder="Student Username"
            style={styles.input}
            value={studentPasswordChange.username}
            onChangeText={(text) => setStudentPasswordChange((prev) => ({ ...prev, username: text }))}
          />
          <TextInput
            placeholder="New Password"
            style={styles.input}
            secureTextEntry
            value={studentPasswordChange.newPassword}
            onChangeText={(text) => setStudentPasswordChange((prev) => ({ ...prev, newPassword: text }))}
          />
          <TouchableOpacity style={styles.button} onPress={handleChangeStudentPassword}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerGradient: { paddingVertical: 5, paddingHorizontal: 20, elevation: 5 },
  header: { flexDirection: "row", alignItems: "center", marginTop: 35 },
  profileImage: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#fff" },
  headerText: { color: "#DCE7FF", fontSize: 13 },
  teacherName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  departmentText: { color: "#DCE7FF", fontSize: 12 },
  quickActionsContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 15 },
  card: { flex: 1, backgroundColor: "#E0F2FE", marginHorizontal: 5, padding: 15, borderRadius: 10, alignItems: "center" },
  cardText: { fontWeight: "bold", color: "#1E3A8A" },
  divider: { height: 1, backgroundColor: "#BDBDBD", marginVertical: 20 },
  sectionHeader: { fontSize: 18, fontWeight: "bold", marginLeft: 20, marginBottom: 10 },
  buttonsContainer: { paddingHorizontal: 20 },
  button: { backgroundColor: "#2196F3", paddingVertical: 12, borderRadius: 8, marginBottom: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  logoutBtn: { backgroundColor: "#F44336" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", backgroundColor: "#fff", borderRadius: 10, padding: 20 },
  modalHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#000" },
  cancelButton: { backgroundColor: "#F44336", marginTop: 5 },
  studentItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#E0E7FF" },
  studentText: { fontSize: 16, color: "#1E3A8A" },
});

export default More;

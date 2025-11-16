import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase Auth  (FIXED PATH)
import { auth } from "../../src/config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Firestore functions
import { addUser } from "../../src/services/database";

export default function Register({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [section, setSection] = useState("");
  const [studentId, setStudentId] = useState("");
  const [year, setYear] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !role) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userData = {
        uid,
        email,
        fullname: fullName,
        username: email,
        role,
        // save the entered "Section / Block" value for both students and teachers
        section: section || "",
        ...(role === "student"
          ? { "student-id": studentId || "", year: year || "" }
          : {}),
        createdAt: new Date().toISOString(),
      };

      await addUser(uid, userData);

      await AsyncStorage.setItem("currentUser", JSON.stringify(userData));

      if (role === "teacher") {
        navigation.replace("TeacherDashboard", { user: userData });
      } else if (role === "student") {
        navigation.replace("StudentDashboard", { user: userData });
      }

      Alert.alert("Success", "Account created successfully!");
    } catch (error) {
      Alert.alert("Registration Error", error.message || "Registration failed");
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F5F8FF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="assignment" size={50} color="#2D4EFF" />
            <Text style={styles.appTitle}>Attendify</Text>
          </View>

          <Text style={styles.registerTitle}>Create Account</Text>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          {/* Username */}
          <View style={styles.inputContainer}>
            <Ionicons name="at" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              placeholderTextColor="#a0a0a0"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
              placeholderTextColor="#a0a0a0"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          {/* Role Picker */}
          <View style={styles.pickerContainer}>
            <Ionicons name="person-circle-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <Picker selectedValue={role} onValueChange={setRole} style={styles.picker}>
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Teacher" value="teacher" />
            </Picker>
          </View>

          {/* Section / Department */}
          <View style={styles.inputContainer}>
            <Ionicons
              name={role === "teacher" ? "school-outline" : "book-outline"}
              size={22}
              color="#2D4EFF"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder={role === "teacher" ? "Department" : "Section / Block"}
              value={section}
              onChangeText={setSection}
              editable={!loading}
              placeholderTextColor="#a0a0a0"
            />
          </View>

          {/* Student-only */}
          {role === "student" && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="id-card-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Student ID"
                  value={studentId}
                  onChangeText={setStudentId}
                  editable={!loading}
                  placeholderTextColor="#a0a0a0"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="school-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Year (e.g., 1 or 1A)"
                  value={year}
                  onChangeText={setYear}
                  editable={!loading}
                  keyboardType="default"
                  autoCapitalize="characters"
                  placeholderTextColor="#a0a0a0"
                />
              </View>
            </>
          )}

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, { opacity: loading ? 0.6 : 1 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerText}>Register</Text>}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginPromptText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Account")} disabled={loading}>
              <Text style={styles.loginLink}>Login here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: "center" },
  container: { justifyContent: "center", alignItems: "center", padding: 20 },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 12,
  },

  appTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#2D4EFF",
    letterSpacing: 1,
  },

  registerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    height: 50,
    backgroundColor: "#fff",
    marginBottom: 0, // ⬅ REMOVE GAPS
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D0D7FF",
  },

  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    height: 50,
    backgroundColor: "#fff",
    marginBottom: 0, // ⬅ REMOVE GAPS
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D0D7FF",
  },

  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#333", paddingVertical: 8 },
  picker: { flex: 1, color: "#333" },

  registerButton: {
    backgroundColor: "#2D4EFF",
    paddingVertical: 14,
    width: "85%",
    alignItems: "center",
    borderRadius: 6,
    marginTop: 18, // ⬅ KEEP spacing for button
  },

  registerText: { color: "#fff", fontSize: 18, fontWeight: "600" },

  loginContainer: { flexDirection: "row", marginTop: 20 },
  loginPromptText: { fontSize: 15, color: "#555" },
  loginLink: { fontSize: 15, color: "#2D4EFF", fontWeight: "600" },
});

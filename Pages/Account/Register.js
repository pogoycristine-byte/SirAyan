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
import { addUser, getUserByUsername } from "../../src/services/database";

export default function Register({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [section, setSection] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Validation
    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !section.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Check if username already exists
      const existingUser = await getUserByUsername(username);
      if (existingUser.length > 0) {
        Alert.alert("Error", "Username already exists. Please choose another.");
        setLoading(false);
        return;
      }

      // Add user to database
      await addUser(username, password, email, role, fullName, section);

      Alert.alert(
        "Registration Successful",
        `Welcome, ${fullName}! You can now log in.`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Account"),
          },
        ]
      );

      // Clear form
      setFullName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("student");
      setSection("");
    } catch (error) {
      Alert.alert("Error", "Registration failed: " + error.message);
      console.error("Registration error:", error);
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

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#a0a0a0"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="at" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#a0a0a0"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#a0a0a0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#a0a0a0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#a0a0a0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <Ionicons name="person-circle-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <Picker
              selectedValue={role}
              onValueChange={setRole}
              style={styles.picker}
              enabled={!loading}
            >
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Teacher" value="teacher" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name={role === "teacher" ? "school-outline" : "book-outline"} size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={role === "teacher" ? "Department" : "Section / Block"}
              placeholderTextColor="#a0a0a0"
              value={section}
              onChangeText={setSection}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, { opacity: loading ? 0.6 : 1 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerText}>Register</Text>}
          </TouchableOpacity>

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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
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
    marginBottom: 15,
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
    marginBottom: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D0D7FF",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  picker: {
    flex: 1,
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#2D4EFF",
    paddingVertical: 14,
    width: "85%",
    alignItems: "center",
    borderRadius: 6,
    marginTop: 10,
  },
  registerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  loginPromptText: {
    fontSize: 15,
    color: "#555",
  },
  loginLink: {
    fontSize: 15,
    color: "#2D4EFF",
    fontWeight: "600",
  },
});

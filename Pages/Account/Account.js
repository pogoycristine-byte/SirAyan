import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Account({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // usernames, passwords, and user info
  const users = [
    {
      username: "jayian",
      password: "teacher123",
      role: "teacher",
      name: "Jayian Teacher",
      section: "Faculty",
    },
    {
      username: "carl",
      password: "philip",
      role: "student",
      name: "Carl Philip Romanda",
      section: "BSIT-3 Block-01",
    },
    {
      username: "pogoycristine",
      password: "leader123",
      role: "student",
      name: "Cristine Pogoy",
      section: "BSIT-3 Block-01",
    },
    {
      username: "jubelle",
      password: "franze",
      role: "student",
      name: "Jubelle Franze",
      section: "BSIT-3 Block-01",
    },
    {
      username: "student2",
      password: "student1234",
      role: "student",
      name: "Student Two",
      section: "BSIT-3 Block-01",
    },
  ];

  // remembered user
  useEffect(() => {
    const loadRememberedUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("rememberedUser");
        if (savedUser) {
          const { username, password } = JSON.parse(savedUser);
          setUsername(username);
          setPassword(password);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error loading saved user:", error);
      }
    };
    loadRememberedUser();
  }, []);

  // login
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Save user if Remember Me is checked
      if (rememberMe) {
        await AsyncStorage.setItem(
          "rememberedUser",
          JSON.stringify({ username, password })
        );
      } else {
        await AsyncStorage.removeItem("rememberedUser");
      }

      // Navigate role with user info
      if (user.role === "teacher") {
        navigation.replace("TeacherDashboard", { user });
      } else if (user.role === "student") {
        navigation.replace("StudentDashboard", { user });
      } else {
        Alert.alert("Error", "No dashboard found for this user role.");
      }
    } else {
      Alert.alert("Login Failed", "Invalid username or password. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Login</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Remember Me */}
      <TouchableOpacity
        style={styles.rememberMeContainer}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <Ionicons
          name={rememberMe ? "checkbox-outline" : "square-outline"}
          size={22}
          color="#007bff"
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f6ff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingRight: 10,
  },
  eyeButton: {
    padding: 8,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginBottom: 25,
  },
  rememberMeText: {
    marginLeft: 8,
    color: "#333",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { MoveLeft } from "lucide-react";

export default function Account({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const users = [
    { username: "jayian", password: "teacher123", role: "teacher", name: "Jayian Teacher", section: "Faculty" },
    { username: "carl", password: "philip", role: "student", name: "Carl Philip Romanda", section: "BSIT-3 Block-01" },
    { username: "pogoycristine", password: "leader123", role: "student", name: "Cristine Pogoy", section: "BSIT-3 Block-01" },
    { username: "jubelle", password: "franze", role: "student", name: "Jubelle Franze", section: "BSIT-3 Block-01" },
    { username: "student2", password: "student1234", role: "student", name: "Student Two", section: "BSIT-3 Block-01" },
  ];

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

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);
    const user = users.find(u => u.username === username && u.password === password);
    setLoading(false);

    if (user) {
      if (rememberMe) {
        await AsyncStorage.setItem("rememberedUser", JSON.stringify({ username, password }));
      } else {
        await AsyncStorage.removeItem("rememberedUser");
      }

      if (user.role === "teacher") navigation.replace("TeacherDashboard", { user });
      else if (user.role === "student") navigation.replace("StudentDashboard", { user });
      else Alert.alert("Error", "No dashboard found for this user role.");
    } else {
      Alert.alert("Login Failed", "Invalid username or password. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* App Icon + Title */}
      <View style={styles.logoContainer}>
        <MaterialCommunityIcons name="clipboard-text-outline" size={50} color="#2D2DFF" />
        <Text style={styles.appTitle}>Attendify</Text>
      </View>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-circle-outline" size={22} color="#2D2DFF" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={22} color="#2D2DFF" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Remember Me */}
      <TouchableOpacity
        style={styles.rememberMeContainer}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <MaterialCommunityIcons
          name={rememberMe ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}
          size={22}
          color="#2D2DFF"
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginButton, { opacity: username && password ? 1 : 0.6 }]}
        onPress={handleLogin}
        disabled={!username || !password || loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Login</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6EBFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    gap: 10,
  },
  appTitle: {
    fontSize: 38,
    fontWeight: "800",
    color: "#2D2DFF",
    letterSpacing: 2,
    fontFamily: "sans-serif-medium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: "#333",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start", // center the checkbox + text
    marginBottom: 30,
      marginLeft: 40,
    gap: 8,
  },
  rememberMeText: {
    fontSize: 16,
    color: "#555",
  },
  loginButton: {
    backgroundColor: "#2D2DFF",
    paddingVertical: 14,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getUserByUsername } from "../../src/services/database";

export default function Account({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

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

    try {
      const users = await getUserByUsername(username);
      
      if (users.length === 0) {
        Alert.alert("Login Failed", "Invalid username or password. Try again.");
        setLoading(false);
        return;
      }

      const user = users[0];
      
      if (user.password === password) {
        if (rememberMe) {
          await AsyncStorage.setItem("rememberedUser", JSON.stringify({ username, password }));
        } else {
          await AsyncStorage.removeItem("rememberedUser");
        }

        // Save current user to AsyncStorage
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));

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
    } catch (error) {
      Alert.alert("Error", "Login failed: " + error.message);
      console.error("Login error:", error);
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
            <MaterialIcons name="assignment" size={60} color="#2D4EFF" />
            <Text style={styles.appTitle}>Attendify</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
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
            <Ionicons name="lock-closed-outline" size={22} color="#2D4EFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#a0a0a0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            disabled={loading}
          >
            <Ionicons
              name={rememberMe ? "checkbox-outline" : "square-outline"}
              size={22}
              color="#2D4EFF"
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, { opacity: username && password && !loading ? 1 : 0.6 }]}
            onPress={handleLogin}
            disabled={!username || !password || loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Login</Text>}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")} disabled={loading}>
              <Text style={styles.registerLink}>Register here</Text>
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
    marginBottom: 50,
    gap: 12,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: "#2D4EFF",
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    marginBottom: 20,
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
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 25,
    marginLeft: "10%",
    gap: 8,
  },
  rememberMeText: {
    fontSize: 15,
    color: "#555",
  },
  loginButton: {
    backgroundColor: "#2D4EFF",
    paddingVertical: 14,
    width: "80%",
    alignItems: "center",
    borderRadius: 6,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 25,
  },
  registerText: {
    fontSize: 15,
    color: "#555",
  },
  registerLink: {
    fontSize: 15,
    color: "#2D4EFF",
    fontWeight: "600",
  },
});

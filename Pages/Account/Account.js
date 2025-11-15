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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/config/firebase";

// NEW IMPORTS
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";

export default function Account({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRememberedUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("rememberedUser");
        if (savedUser) {
          const { email, password } = JSON.parse(savedUser);
          setEmail(email);
          setPassword(password);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error loading saved user:", error);
      }
    };
    loadRememberedUser();
  }, []);

  // ✔ UPDATED LOGIN FUNCTION
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // 1. LOGIN WITH FIREBASE AUTH
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 🔥 STORE UID
      await AsyncStorage.setItem("currentUserId", firebaseUser.uid);

      // 2. GET FIRESTORE USER
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert("Profile Error", "User profile not found in Firestore.");
        return;
      }

      const userProfile = userSnap.data();

      // 3. REMEMBER ME
      if (rememberMe) {
        await AsyncStorage.setItem("rememberedUser", JSON.stringify({ email, password }));
      } else {
        await AsyncStorage.removeItem("rememberedUser");
      }

      await AsyncStorage.setItem("currentUser", JSON.stringify(userProfile));

      // 4. NAVIGATE BY ROLE
      if (userProfile.role === "teacher") {
        navigation.replace("TeacherDashboard", { user: userProfile });
      } else if (userProfile.role === "student") {
        navigation.replace("StudentDashboard", { user: userProfile });
      } else {
        Alert.alert("Error", "No dashboard found for this user role.");
      }

    } catch (error) {
      Alert.alert("Login Failed", error.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#E8F0FF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>

          {/* 🔵 Logo + Attendify */}
          <View style={styles.logoContainer}>
            <MaterialIcons name="fact-check" size={64} color="#1E3A8A" />
            <Text style={styles.appTitle}>Attendify</Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={22} color="#1E40AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A3B1D9"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={22} color="#1E40AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#A3B1D9"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#475569"
              />
            </TouchableOpacity>
          </View>

          {/* Remember Me */}
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            disabled={loading}
          >
            <Ionicons
              name={rememberMe ? "checkbox" : "square-outline"}
              size={22}
              color="#1E40AF"
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              { opacity: email && password && !loading ? 1 : 0.6 },
            ]}
            onPress={handleLogin}
            disabled={!email || !password || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
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

  /* 🔵 Logo Section */
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50,
    gap: 12,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1E3A8A",
    letterSpacing: 1.5,
  },

  /* 🔵 Inputs */
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 54,
    backgroundColor: "#FFFFFF",
    marginBottom: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#93C5FD",
    borderRadius: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    paddingVertical: 8,
  },

  /* 🔵 Remember Me */
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
    color: "#334155",
  },

  /* 🔵 Login Button */
  loginButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 14,
    width: "80%",
    alignItems: "center",
    borderRadius: 8,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  /* 🔵 Register Link */
  registerContainer: {
    flexDirection: "row",
    marginTop: 25,
  },
  registerText: {
    fontSize: 15,
    color: "#475569",
  },
  registerLink: {
    fontSize: 15,
    color: "#1E40AF",
    fontWeight: "700",
  },
});

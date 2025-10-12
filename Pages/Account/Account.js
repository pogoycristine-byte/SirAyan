import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

export default function Account({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Predefined usernames and passwords
  const users = [
    { username: "jayian", password: "teacher123", role: "teacher" },
    { username: "carl", password: "philip", role: "student" },
    { username: "pogoycristine", password: "leader123", role: "student" },
    { username: "jubelle", password: "franze", role: "student" },
    { username: "student2", password: "student1234", role: "student" },
  ];

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Navigate based on role
      if (user.role === "teacher") navigation.replace("TeacherDashboard");
      else if (user.role === "student") navigation.replace("StudentDashboard");
      else if (user.role === "planted") navigation.replace("PlantedDashboard");
    } else {
      Alert.alert("Error", "Invalid username or password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, marginBottom: 15 },
});

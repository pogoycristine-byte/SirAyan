import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My Attendance Tracker App</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Account")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 40, textAlign: "center" },
  button: { backgroundColor: "#007bff", paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});

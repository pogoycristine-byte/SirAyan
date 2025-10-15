import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function About({ goBack }) {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>About Us</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButton: { marginBottom: 20,
    marginTop: 20
   },
  backText: { fontSize: 16, color: "#007AFF", fontWeight: "bold" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold" },
});

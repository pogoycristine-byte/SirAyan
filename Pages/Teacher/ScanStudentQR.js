import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ScanStudentQR() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Scanner Placeholder</Text>
      <Text>(Here the teacher will scan the student QR code)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

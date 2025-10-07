import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function TeacherDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Dashboard</Text>
      <Button title="Scan Student QR" onPress={() => navigation.navigate("QRScannerPage")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

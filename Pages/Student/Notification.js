import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function Notification() {
  const studentId = "student123"; // replace with dynamic user ID later

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification</Text>
      <QRCode value={studentId} size={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

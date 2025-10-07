import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeGenerator({ value }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code Placeholder</Text>
      <QRCode value={value || "PLACEHOLDER"} size={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center", marginVertical: 20 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
});

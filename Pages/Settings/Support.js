import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function Support() {
  const handleEmailPress = () => {
    Linking.openURL("sirIan@email.com");
  };

  const handleFAQPress = () => {
    Linking.openURL("https://qrcodeattendance.com/faq");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛠️ Help & Support</Text>

      <Text style={styles.paragraph}>
        Need assistance? We're here to help you get the most out of QR Code
        Attendance.
      </Text>

      <Text style={styles.subtitle}>📋 Frequently Asked Questions</Text>
      <Text style={styles.paragraph}>
        Visit our FAQ page to find answers to common questions about scanning,
        syncing, and reporting.
      </Text>
      <TouchableOpacity onPress={handleFAQPress}>
        <Text style={styles.link}>Go to FAQ</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>📧 Contact Support</Text>
      <Text style={styles.paragraph}>
        If you can't find what you're looking for, feel free to reach out to our
        support team.
      </Text>
      <TouchableOpacity onPress={handleEmailPress}>
        <Text style={styles.link}>sirIan@gmail.com</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>💡 Tips for Troubleshooting</Text>
      <Text style={styles.paragraph}>
        - Ensure your camera has permission to scan QR codes.{"\n"}- Check your
        internet connection for syncing.{"\n"}- Restart the app if scanning
        fails.{"\n"}- Make sure the QR code is not damaged or blurry.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007AFF",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
    color: "#333",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: "#555",
  },
  link: {
    fontSize: 16,
    color: "#007AFF",
    marginTop: 5,
    marginBottom: 15,
  },
});

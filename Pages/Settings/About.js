import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function About() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📘 About QR Code Attendance</Text>

      <Text style={styles.paragraph}>
        QR Code Attendance is a smart and efficient solution designed to
        simplify how organizations track presence and participation. Whether
        you're managing a classroom, workplace, event, or training session, our
        system makes attendance seamless, secure, and paperless.
      </Text>

      <Text style={styles.subtitle}>🚀 How It Works</Text>
      <Text style={styles.paragraph}>
        - Each participant scans a unique QR code using their mobile device.
        {"\n"}- The system instantly records the time, location, and identity of
        the attendee.{"\n"}- Data is securely stored and can be exported for
        reports, payroll, or academic records.
      </Text>

      <Text style={styles.subtitle}>🎯 Key Features</Text>
      <Text style={styles.paragraph}>
        - Real-time tracking with timestamps{"\n"}- Secure and tamper-proof QR
        codes{"\n"}- Offline support with sync capabilities{"\n"}- Customizable
        reports{"\n"}- User-friendly interface
      </Text>

      <Text style={styles.subtitle}>💡 Why Use QR Code Attendance?</Text>
      <Text style={styles.paragraph}>
        Traditional attendance methods are slow, error-prone, and hard to
        manage. Our system eliminates manual entry, reduces fraud, and gives
        administrators powerful tools to monitor engagement and compliance.
      </Text>

      <Text style={styles.paragraph}>
        Whether you're a teacher, HR manager, or event organizer, QR Code
        Attendance helps you focus on what matters—while we handle the
        check-ins.
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
});

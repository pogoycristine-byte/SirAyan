import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";

// Dummy data for QR and attendance
const dummySessions = [
  { id: "1", name: "Math Class", qrCode: "12345" },
  { id: "2", name: "English Class", qrCode: "67890" },
];

export default function AttendanceTracker() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [excuseLetters, setExcuseLetters] = useState([]);
  const [username, setUsername] = useState("");
  const [scannedQRCode, setScannedQRCode] = useState("");
  const [excuseText, setExcuseText] = useState("");

  // User Registration
  const registerUser = () => {
    if (!username.trim()) return;
    const newUser = { id: Date.now().toString(), name: username };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setUsername("");
  };

  // Mark Attendance via QR code
  const markAttendance = (session) => {
    if (!currentUser) return alert("Please register first!");
    const alreadyMarked = attendance.find(
      (a) => a.userId === currentUser.id && a.sessionId === session.id
    );
    if (alreadyMarked) return alert("Attendance already marked for this session.");
    setAttendance([
      ...attendance,
      { id: Date.now().toString(), userId: currentUser.id, sessionId: session.id, date: new Date() },
    ]);
    alert(`Attendance marked for ${session.name}`);
  };

  // Submit excuse letter
  const submitExcuse = (sessionId) => {
    if (!currentUser) return alert("Please register first!");
    if (!excuseText.trim()) return;
    setExcuseLetters([
      ...excuseLetters,
      { id: Date.now().toString(), userId: currentUser.id, sessionId, text: excuseText },
    ]);
    setExcuseText("");
    alert("Excuse letter submitted");
  };

  // Get user attendance
  const getUserAttendance = () =>
    attendance.filter((a) => currentUser && a.userId === currentUser.id);

  // Get user excuse letters
  const getUserExcuses = () =>
    excuseLetters.filter((e) => currentUser && e.userId === currentUser.id);

  return (
    <View style={styles.container}>
      {!currentUser ? (
        <View style={styles.section}>
          <Text style={styles.title}>Register User</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={username}
            onChangeText={setUsername}
          />
          <Button title="Register" onPress={registerUser} />
        </View>
      ) : (
        <>
          <Text style={styles.title}>Welcome, {currentUser.name}</Text>

          {/* Attendance Section */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Mark Attendance</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter QR Code"
              value={scannedQRCode}
              onChangeText={setScannedQRCode}
            />
            {dummySessions.map((session) =>
              session.qrCode === scannedQRCode ? (
                <Button
                  key={session.id}
                  title={`Mark ${session.name}`}
                  onPress={() => markAttendance(session)}
                />
              ) : null
            )}
          </View>

          {/* Excuse Letter Section */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Submit Excuse Letter</Text>
            <TextInput
              style={styles.input}
              placeholder="Write your excuse..."
              value={excuseText}
              onChangeText={setExcuseText}
            />
            <FlatList
              data={dummySessions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => submitExcuse(item.id)}
                >
                  <Text style={styles.buttonText}>Submit for {item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* View Attendance */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Your Attendance</Text>
            <FlatList
              data={getUserAttendance()}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const session = dummySessions.find((s) => s.id === item.sessionId);
                return (
                  <Text>
                    {session?.name} - {item.date.toLocaleDateString()}
                  </Text>
                );
              }}
            />
          </View>

          {/* View Excuse Letters */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Your Excuse Letters</Text>
            <FlatList
              data={getUserExcuses()}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const session = dummySessions.find((s) => s.id === item.sessionId);
                return (
                  <Text>
                    {session?.name}: {item.text}
                  </Text>
                );
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  section: { marginVertical: 15 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});

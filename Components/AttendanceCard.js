import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { globalStyles } from "../Styles/globalStyles";

export default function AttendanceCard({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");

  const handleRegister = () => {
    if (!name || !email) return Alert.alert("Fill all fields");
    onRegister({ id: Date.now().toString(), name, email, role });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>User Registration</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={globalStyles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={globalStyles.input} />
      <Text>Select Role:</Text>
      <Button title="Student" onPress={() => setRole("student")} />
      <Button title="Teacher" onPress={() => setRole("teacher")} />
      <Button title="Register" onPress={handleRegister} color="#28a745" />
    </View>
  );
}

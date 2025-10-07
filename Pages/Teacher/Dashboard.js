import React from "react";
import { View, Text, Button } from "react-native";
import { globalStyles } from "../../Styles/globalStyles";

export default function Dashboard({ onLogout }) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Teacher Dashboard</Text>
      <Button title="Mark Attendance" onPress={() => alert("Navigate to MarkAttendance")} />
      <Button title="Excuse Letters" onPress={() => alert("Navigate to ExcuseLetters")} />
      <Button title="Settings" onPress={() => alert("Navigate to Settings")} />
      <Button title="Logout" onPress={onLogout} color="#ff4d4d" />
    </View>
  );
}

import React from "react";
import { View, Text, Button } from "react-native";
import { globalStyles } from "../../Styles/globalStyles";

export default function Dashboard({ onLogout }) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Student Dashboard</Text>
      <Button title="Scan QR Code" onPress={() => alert("Navigate to ScanQRCode")} />
      <Button title="Submit Excuse" onPress={() => alert("Navigate to SubmitExcuse")} />
      <Button title="Attendance History" onPress={() => alert("Navigate to AttendanceHistory")} />
      <Button title="Settings" onPress={() => alert("Navigate to Settings")} />
      <Button title="Logout" onPress={onLogout} color="#ff4d4d" />
    </View>
  );
}

import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../../Styles/globalStyles";

export default function ScanStudentQR() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Scan Student QR Code</Text>
    </View>
  );
}

import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../../Styles/globalStyles";

export default function ScanQRCode() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Scan QR Code</Text>
    </View>
  );
}

import React, { useEffect } from "react";
import { View, Text, Alert } from "react-native";

export default function Logout({ navigation }) {
  useEffect(() => {
    Alert.alert("Logged out", "You have been signed out.");
    navigation.navigate("Settings");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Logging out...</Text>
    </View>
  );
}

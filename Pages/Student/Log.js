import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../../Styles/globalStyles";

export default function Log() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Log</Text>
    </View>
  );
}

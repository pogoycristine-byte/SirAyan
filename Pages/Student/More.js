import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../../Styles/globalStyles";
import SettingsScreen from "../Settings/SettingScreen";

export default function More() {
  return (
    <View style={globalStyles.container}>
      <SettingsScreen />
    </View>
  );
}

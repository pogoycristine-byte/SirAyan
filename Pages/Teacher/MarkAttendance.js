import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../../Styles/globalStyles";

export default function MarkAttendance() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Mark Attendance</Text>
    </View>
  );
}

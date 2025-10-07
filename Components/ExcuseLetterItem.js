import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ExcuseLetterItem({ text, status }) {
  return (
    <View style={styles.container}>
      <Text>{text || "Excuse Text Placeholder"}</Text>
      <Text>Status: {status || "Pending"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#f2f2f2", marginVertical: 5, borderRadius: 8 },
});

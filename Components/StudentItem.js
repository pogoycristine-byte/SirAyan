import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StudentItem({ name }) {
  return (
    <View style={styles.container}>
      <Text>{name || "Student Name"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#f2f2f2", marginVertical: 5, borderRadius: 8 },
});

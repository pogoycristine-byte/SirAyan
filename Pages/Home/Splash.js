import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Splash({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Account");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Can't decide sa design aria.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#007bff" },
  title: { color: "#fff", fontSize: 28, fontWeight: "bold", textAlign: "center", padding: 20 },
});

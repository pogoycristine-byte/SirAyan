import React, { useEffect } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";

export default function Splash({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Account");
    }, 7000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../../assets/2.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}></View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 20,
    borderRadius: 10,
  },
});

import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

import Account from "./screens/Account";
import Security from "./screens/Security";
import Preferences from "./screens/Preferences";
import Support from "./screens/Support";
import About from "./screens/About";
import Logout from "./screens/Logout";

export default function SettingsScreen() {
  const [activeScreen, setActiveScreen] = useState("Settings");

  const renderScreen = () => {
    switch (activeScreen) {
      case "Account":
        return <Account />;
      case "Security":
        return <Security />;
      case "Preferences":
        return <Preferences />;
      case "Support":
        return <Support />;
      case "About":
        return <About />;
      case "Logout":
        return <Logout onBack={() => setActiveScreen("Settings")} />;
      default:
        return renderSettingsMenu();
    }
  };

  const renderSettingsMenu = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://placekitten.com/100/100" }}
          style={styles.profileImage}
        />
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <View style={styles.menu}>
        {[
          "Account",
          "Security",
          "App Preferences",
          "Help and support",
          "About Us",
          "Logout",
        ].map((label, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => setActiveScreen(label.replace(" ", ""))}
          >
            <Text style={styles.menuText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.navBar}>
        <Ionicons name="home" size={24} color="black" />
        <Ionicons name="notifications" size={24} color="black" />
        <Entypo name="attachment" size={24} color="black" />
        <MaterialIcons name="insert-drive-file" size={24} color="black" />
        <Entypo name="grid" size={24} color="black" />
      </View>
    </View>
  );

  return renderScreen();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20 },
  profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerText: { fontSize: 24, fontWeight: "bold" },
  menu: { marginTop: 30, paddingHorizontal: 20 },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { fontSize: 18 },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
});

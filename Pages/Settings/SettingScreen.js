import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

// Import your screen components
import Account from "./Account";
import Security from "./Security";
import Support from "./Support";
import About from "./About";
import Logout from "./Logout";

export default function SettingsScreen() {
  const [activeScreen, setActiveScreen] = useState("Settings");

  const renderScreen = () => {
    switch (activeScreen) {
      case "Account":
        return <Account />;
      case "Security":
        return <Security />;
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

  const menuItems = [
    { label: "Account", key: "Account" },
    { label: "Security", key: "Security" },
    { label: "Help and support", key: "Support" },
    { label: "About Us", key: "About" },
    { label: "Logout", key: "Logout" },
  ];

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
        {menuItems.map(({ label, key }, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => setActiveScreen(key)}
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

import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import Account from "./SulodsaMore/Account";
import Security from "./SulodsaMore/Security";
import Support from "./SulodsaMore/Support";
import About from "./SulodsaMore/About";

export default function More() {
  const [activeScreen, setActiveScreen] = useState("Settings");

  const goBack = () => setActiveScreen("Settings");
  const renderScreen = () => {
    switch (activeScreen) {
      case "Account":
        return <Account goBack={goBack} />;
      case "Security":
        return <Security goBack={goBack} />;
      case "Support":
        return <Support goBack={goBack} />;
      case "About":
        return <About goBack={goBack} />;
      default:
        return renderSettingsMenu();
    }
  };

  const menuItems = [
    { label: "Account", key: "Account" },
    { label: "Security", key: "Security" },
    { label: "Help and support", key: "Support" },
    { label: "About Us", key: "About" },
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
});

import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

import Account from "./Account";
import Security from "./Security";
import Support from "./Support";
import About from "./About";
import Logout from "./Logout";

export default function SettingsScreen() {
  const [activeScreen, setActiveScreen] = useState("Settings");

  const handleBack = () => setActiveScreen("Settings");

  const renderHeader = (title) => (
    <View style={styles.header}>
      {activeScreen !== "Settings" && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );

  const renderScreen = () => {
    switch (activeScreen) {
      case "Account":
        return (
          <View style={styles.container}>
            {renderHeader("Account")}
            <Account />
          </View>
        );
      case "Security":
        return (
          <View style={styles.container}>
            {renderHeader("Security")}
            <Security />
          </View>
        );
      case "Support":
        return (
          <View style={styles.container}>
            {renderHeader("Help and Support")}
            <Support />
          </View>
        );
      case "About":
        return (
          <View style={styles.container}>
            {renderHeader("About Us")}
            <About />
          </View>
        );

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
      {renderHeader("Settings")}

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

      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://placekitten.com/100/100" }}
          style={styles.profileImage}
        />
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#007AFF",
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  menu: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 18,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
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

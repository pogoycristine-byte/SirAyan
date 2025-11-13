import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 
import { useNavigation, CommonActions } from "@react-navigation/native";

// Import your sub-components
import Account from "./SulodsaMore/Account";
import Security from "./SulodsaMore/Security";
import Support from "./SulodsaMore/Support";
import About from "./SulodsaMore/About";

export default function More() {
    const [activeScreen, setActiveScreen] = useState("Settings");
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const goBack = () => setActiveScreen("Settings"); 

    const handleLogout = () => {
        Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Logout", 
                style: "destructive", 
                onPress: () => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: "Account" }],
                        })
                    );
                } 
            }
        ]);
    };

    const menuItems = [
        { label: "Account", key: "Account" },
        { label: "Security", key: "Security" },
        { label: "Help and support", key: "Support" },
        { label: "About Us", key: "About" },
    ];

    const renderSettingsMenu = () => (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <StatusBar backgroundColor="#f7f9fc" barStyle="dark-content" />

            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Welcome to your settings.</Text>
                <Text style={styles.welcomeSubtitle}>Manage your account and app preferences below.</Text>
            </View>

            {/* Menu Items */}
            <View style={styles.menu}>
                {menuItems.map(({ label, key }, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.menuItem, index === menuItems.length - 1 && { borderBottomWidth: 0 }]}
                        onPress={() => setActiveScreen(key)}
                    >
                        <Text style={styles.menuText}>{label}</Text>
                        <Text style={{ color: "#888", fontSize: 16 }}>›</Text>
                    </TouchableOpacity>
                ))}

                {/* Logout Button */}
                <TouchableOpacity
                    style={[styles.menuItem, { justifyContent: 'center', borderBottomWidth: 0 }]}
                    onPress={handleLogout}
                >
                    <Text style={[styles.menuText, { color: "#EF4444", fontWeight: "bold" }]}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

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

    return renderScreen();
}

// --- Main Component Styles ---
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#f7f9fc",
        paddingHorizontal: 0,
    },
    welcomeSection: {
        paddingHorizontal: 20,
        paddingVertical: 25,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 15,
    },
    welcomeTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#343a40',
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 5,
    },
    menu: { 
        marginTop: 10, 
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    menuText: { 
        fontSize: 16, 
        color: '#333' 
    },
});

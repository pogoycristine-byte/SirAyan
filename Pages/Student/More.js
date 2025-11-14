import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Alert,
} from "react-native";
    import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Import student sub-screens
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
                },
            },
        ]);
    };

    const menuItems = [
        { label: "Account", key: "Account", icon: "person-outline" },
        { label: "Security", key: "Security", icon: "lock-closed-outline" },
        { label: "Help and Support", key: "Support", icon: "help-circle-outline" },
        { label: "About Us", key: "About", icon: "information-circle-outline" },
    ];

    // ---------------- SETTINGS MAIN PAGE ----------------
    const renderSettingsMenu = () => (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <StatusBar backgroundColor="#F0F4FF" barStyle="dark-content" />

            {/* Student Card */}
            <View style={styles.userCard}>
                <Ionicons name="person-circle-outline" size={60} color="#1E3A8A" />
                <View style={{ marginLeft: 15 }}>
                    <Text style={styles.userName}>Student User</Text>
                    <Text style={styles.userDept}>BSCS Department</Text>
                </View>
            </View>

            {/* Section header */}
            <Text style={styles.sectionHeader}>SETTINGS</Text>

            {/* Settings Menu */}
            {menuItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.rowButton}
                    onPress={() => setActiveScreen(item.key)}
                >
                    <View style={styles.rowLeft}>
                        <Ionicons name={item.icon} size={22} color="#475569" />
                        <Text style={styles.rowLabel}>{item.label}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#475569" />
                </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );

    // ---------------- SCREEN ROUTER ----------------
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

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F0F4FF",
    },

    userCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        alignItems: "center",
    },

    userName: { fontSize: 18, fontWeight: "700", color: "#1E3A8A" },
    userDept: { fontSize: 14, color: "#6B7280", marginTop: 2 },

    sectionHeader: {
        fontSize: 13,
        fontWeight: "700",
        color: "#64748B",
        marginBottom: 10,
        marginLeft: 2,
    },

    rowButton: {
        backgroundColor: "#fff",
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 1,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },

    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    rowLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1E293B",
    },

    logoutButton: {
        marginTop: 25,
        paddingVertical: 14,
        backgroundColor: "#fff",
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        elevation: 1,
        gap: 10,
        paddingRight: 210,
    },

    logoutText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#EF4444",
    },
});

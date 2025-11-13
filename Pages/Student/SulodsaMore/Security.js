import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
    StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// --- Helper Component: Sub-screen Header (Reused from ProfileSettings) ---
const SubScreenHeader = ({ title, onBackPress }) => {
    // Get insets to calculate safe padding for the content below the status bar
    const insets = useSafeAreaInsets();
    const paddingTop = insets.top + 18; 

    return (
        <LinearGradient 
            colors={["#2563EB", "#1E3A8A"]} 
            // Apply dynamic top padding
            style={[headerStyles.headerGradient, { paddingTop: paddingTop }]}
        >
            <StatusBar backgroundColor="#1E3A8A" barStyle="light-content" />
            <View style={headerStyles.header}>
                {/* BACK BUTTON */}
                <TouchableOpacity onPress={onBackPress} style={headerStyles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={[headerStyles.mainTitle, {marginLeft: 15}]}>{title}</Text>
            </View>
        </LinearGradient>
    );
};

// --- Header Styles (Reused from ProfileSettings) ---
const headerStyles = StyleSheet.create({
    headerGradient: {
        paddingVertical: 18, 
        paddingHorizontal: 20,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    mainTitle: { 
        color: "#fff", 
        fontSize: 22, 
        fontWeight: "bold" 
    },
    backButton: {
        paddingRight: 5,
    }
});
// -----------------------------------------------------------------


export default function Security({ goBack }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Missing Fields", "Please fill out all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Mismatch", "New passwords do not match.");
            return;
        }
        
        // Add checks for password complexity (e.g., minimum length)
        if (newPassword.length < 8) {
            Alert.alert("Weak Password", "New password must be at least 8 characters long.");
            return;
        }

        // Simulate password update (replace with actual backend logic)
        Alert.alert("Success", "Your password has been updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Optional: Navigate back after success
        // goBack();
    };

    return (
        <View style={{flex: 1, backgroundColor: '#f0f4f7'}}> 
            {/* Custom Header */}
            <SubScreenHeader title="Security & Password" onBackPress={goBack} />

            <ScrollView contentContainerStyle={styles.contentContainer}>
                
                <View style={styles.infoBox}>
                    <Ionicons name="lock-closed-outline" size={24} color="#1E3A8A" />
                    <Text style={styles.infoText}>
                        To change your password, you must first verify your current password.
                    </Text>
                </View>

                {/* Password Input Card */}
                <Text style={styles.sectionTitle}>Change Your Password</Text>
                <View style={styles.card}>
                    
                    {/* Current Password Field */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Current Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                    </View>

                    {/* New Password Field */}
                    <View style={styles.field}>
                        <Text style={styles.label}>New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="•••••••• (Min 8 characters)"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                    </View>

                    {/* Confirm Password Field */}
                    <View style={[styles.field, styles.noBorder]}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>
                </View>

                {/* Save Button (Styled like the Save Changes button) */}
                <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                    <Text style={styles.saveButtonText}>Update Password</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

// --- Component Styles (Adapted from ProfileSettings) ---
const styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: "#f0f4f7",
    },
    
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#e0f2fe',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#2563EB',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#1E3A8A',
        marginLeft: 10,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6c757d',
        marginTop: 15,
        marginBottom: 8,
        paddingHorizontal: 5,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 10,
    },
    field: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: '#6c757d',
        marginBottom: 3,
    },
    input: {
        fontSize: 17,
        padding: 0,
        color: '#343a40',
        fontWeight: 'bold',
    },

    saveButton: {
        backgroundColor: "#2563EB",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
        marginHorizontal: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    }
});
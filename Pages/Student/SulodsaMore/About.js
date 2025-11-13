import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from "react-native";

export default function About({ goBack }) {
    return (
        <View style={styles.container}>
            {/* Custom Header (Replaces LinearGradient/Safe Area) */}
            <View style={styles.customHeader}>
                <StatusBar backgroundColor="#1E3A8A" barStyle="light-content" />
                <View style={styles.headerContent}>
                    {/* Back Button */}
                    <TouchableOpacity onPress={goBack} style={styles.backButton}>
                        {/* Using an arrow character as a replacement for an icon */}
                        <Text style={styles.backIcon}>&lt;</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>About Attendify</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* App Identity Section */}
                <View style={styles.appIdentity}>
                    <Text style={styles.appIcon}>📝</Text>
                    <Text style={styles.appName}>Attendify</Text>
                    <Text style={styles.appVersion}>Version 1.2.0 (Build 45)</Text>
                </View>

                {/* Mission Card */}
                <Text style={styles.sectionTitle}>Our Mission</Text>
                <View style={styles.card}>
                    <Text style={styles.missionText}>
                        **Attendify** is dedicated to providing a seamless, reliable, and transparent attendance tracking system for educational institutions. Our goal is to minimize administrative overhead for faculty and ensure students have accurate, real-time records of their course participation.
                    </Text>
                </View>

                {/* Institutional Information Card */}
                <Text style={styles.sectionTitle}>Institutional Information</Text>
                <View style={styles.card}>
                    <View style={styles.field}>
                        <Text style={styles.fieldIcon}>🏫</Text>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Developed For</Text>
                            <Text style={styles.value}>Example University College of IT</Text>
                        </View>
                    </View>
                    <View style={[styles.field, styles.noBorder]}>
                        <Text style={styles.fieldIcon}>💻</Text>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Core Technology</Text>
                            <Text style={styles.value}>React Native & Expo</Text>
                        </View>
                    </View>
                </View>

                {/* Copyright */}
                <Text style={styles.copyrightText}>
                    &copy; 2024 Attendify Development Team. All rights reserved.
                </Text>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#f0f4f7" 
    },
    
    // --- Custom Header Styles ---
    customHeader: {
        backgroundColor: "#2563EB", 
        paddingTop: 20, // Simulating Safe Area Inset
        paddingBottom: 1,
        paddingHorizontal: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        paddingRight: 15,
        paddingVertical: 5, // Make touch target easier
    },
    backIcon: {
        fontSize: 24, 
        color: "#fff", 
        fontWeight: "bold"
    },
    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    
    // --- Content Styles ---
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    appIdentity: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    appIcon: {
        fontSize: 48,
        marginBottom: 5,
    },
    appName: {
        fontSize: 34,
        fontWeight: '900',
        color: '#1E3A8A',
        marginTop: 5,
    },
    appVersion: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 5,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6c757d',
        marginTop: 15,
        marginBottom: 8,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 10,
        padding: 15,
    },
    missionText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#343a40',
        textAlign: 'justify',
    },
    
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    fieldIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: '#6c757d',
    },
    value: {
        fontSize: 16,
        color: '#343a40',
        fontWeight: '600',
    },

    copyrightText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 20,
    }
});

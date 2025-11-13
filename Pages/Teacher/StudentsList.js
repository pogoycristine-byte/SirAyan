import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Notifications() {
    const insets = useSafeAreaInsets(); // Safe area for top/bottom padding

    // Sample notifications for UI preview
    const [notifications] = useState([
        { id: "1", name: "John Doe", last_date: "Nov 10, 2025", excuse_letter: "Pending" },
        { id: "2", name: "Jane Smith", last_date: "Nov 9, 2025", excuse_letter: "Submitted" },
        { id: "3", name: "Michael Brown", last_date: "Nov 8, 2025", excuse_letter: "Pending" },
    ]);

    const renderNotification = ({ item }) => (
        <View style={styles.notificationCard}>
            <View style={styles.textContainer}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text
                    style={[
                        styles.letterStatus,
                        { color: item.excuse_letter === "Pending" ? "#facc15" : "#22c55e" },
                    ]}
                >
                    Excuse Letter: {item.excuse_letter}
                </Text>
                <Text style={styles.lastAttendance}>Last Attendance: {item.last_date}</Text>
            </View>
            <TouchableOpacity style={styles.approveButton}>
                <Ionicons name="checkmark" size={16} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top -10, paddingBottom: insets.bottom + 10 }]}>
            {/* Notifications Header with Bell */}
            <View style={styles.headerRow}>
                <Ionicons name="notifications-outline" size={24} color="#1E3A8A" style={{ marginRight: 8 }} />
                <Text style={styles.notificationsHeader}>Notifications</Text>
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderNotification}
                ListEmptyComponent={<Text style={styles.emptyText}>No notifications available.</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F0F4FF", paddingHorizontal: 20 },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    notificationsHeader: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1E3A8A",
    },
    notificationCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginVertical: 6,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    studentName: { fontSize: 14, fontWeight: "bold", color: "#1E3A8A" },
    letterStatus: { fontSize: 12, marginTop: 2 },
    lastAttendance: { fontSize: 11, color: "#64748b", marginTop: 2 },
    approveButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
    },
    emptyText: { textAlign: "center", color: "#64748B", marginTop: 50, fontSize: 14 },
});

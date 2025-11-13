import React from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 

const headerStyles = StyleSheet.create({
    headerGradient: {
        paddingBottom: 15,
        paddingHorizontal: 20,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    mainTitle: {
        color: "#fff",
        fontSize: 22, 
        fontWeight: "bold"
    },
});

const LogHeader = () => {
    const insets = useSafeAreaInsets();
    const paddingTop = insets.top + 15;

    return (
        <LinearGradient
            colors={["#2563EB", "#1E3A8A"]}
            style={[headerStyles.headerGradient, { paddingTop: paddingTop }]}
        >
            <StatusBar backgroundColor="#1E3A8A" barStyle="light-content" />
            <View style={headerStyles.header}>
                <Text style={headerStyles.mainTitle}>Attendance Log</Text>
            </View>
        </LinearGradient>
    );
};

export default function Log() {
    const attendanceData = [
        { date: "Oct 6, 2024", status: "Absent", remarks: "Excuse Letter Sent" },
        { date: "Oct 5, 2024", status: "Present", remarks: "" },
        { date: "Oct 4, 2024", status: "Present", remarks: "" },
        { date: "Oct 3, 2024", status: "Present", remarks: "" },
        { date: "Oct 2, 2024", status: "Present", remarks: "" },
        { date: "Oct 1, 2024", status: "Absent", remarks: "" }, 
        { date: "Sep 30, 2024", status: "Present", remarks: "" },
        { date: "Sep 29, 2024", status: "Present", remarks: "" },
        { date: "Sep 28, 2024", status: "Present", remarks: "" },
        { date: "Sep 27, 2024", status: "Absent", remarks: "Excuse Letter Sent" }, 
        { date: "Sep 26, 2024", status: "Present", remarks: "" },
        { date: "Sep 25, 2024", status: "Present", remarks: "" },
    ];

    const renderStatusIcon = (status) => {
        if (status === "Present") {
            return <Ionicons name="checkmark-circle" size={20} color="#10b981" />; 
        } else {
            return <Ionicons name="close-circle" size={20} color="#f87171" />; 
        }
    };

    return (
        <View style={styles.container}>
            <LogHeader />

            <View style={styles.contentContainer}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.headerText, { flex: 1.2 }]}>Date</Text> 
                    <Text style={[styles.headerText, { flex: 1.2, marginLeft: 10 }]}>Status</Text> 
                    <Text style={[styles.headerText, { flex: 1.8, textAlign: 'left', paddingLeft: 10 }]}>Remarks</Text> 
                </View>

                <ScrollView style={{ flex: 1 }}>
                    {attendanceData.map((item, index) => (
                        <View
                            key={index}
                            style={[
                                styles.tableRow,
                                { backgroundColor: index % 2 === 0 ? "#fff" : "#f5f8ff" }, 
                            ]}
                        >
                            <Text style={[styles.cellText, { flex: 1.2, color: "#475569", fontWeight: '600' }]}>
                                {item.date}
                            </Text>
                            <View style={[styles.statusCell, { flex: 1.2 }]}> 
                                {renderStatusIcon(item.status)}
                                <Text style={[styles.cellText, { marginLeft: 8, color: item.status === "Present" ? "#10b981" : "#f87171", fontWeight: 'bold' }]}>
                                    {item.status.toUpperCase()}
                                </Text>
                            </View>
                            <Text style={[styles.cellText, { flex: 1.8, color: item.remarks ? "#064E3B" : "#64748b", fontStyle: item.remarks ? 'italic' : 'normal', paddingLeft: 10 }]}>
                                {item.remarks || "No remarks"}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f4f7",
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#cbd5e1", 
        paddingVertical: 10,
        backgroundColor: "#e0f2fe", 
        paddingHorizontal: 10,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    headerText: {
        fontWeight: "700",
        fontSize: 14,
        color: "#1e3a8a", 
    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    cellText: {
        fontSize: 14,
    },
    statusCell: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15, 
    },
});

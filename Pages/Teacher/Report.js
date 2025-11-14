// Report.js
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// Enable animation on Android
if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Report() {
    const insets = useSafeAreaInsets();

    // HOOKS AT TOP LEVEL — UNCONDITIONAL
    const [expandedCard, setExpandedCard] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formattedDate = selectedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const classReports = [
        {
            id: 1,
            title: "Math Class",
            time: "11:00 AM",
            total: 18,
            students: [
                { name: "John Smith", status: "Present" },
                { name: "Emily Johnson", status: "Absent" },
                { name: "Sarah Kim", status: "Late" },
            ],
            color: "#E9FDEB",
        },
        {
            id: 2,
            title: "English Lit",
            time: "2:00 PM",
            total: 18,
            students: [
                { name: "John Smith", status: "Present" },
                { name: "Sarah Kim", status: "Absent" },
            ],
            color: "#E7F1FF",
        },
    ];

    const handleDateChange = (event, date) => {
        if (Platform.OS === "android") setShowDatePicker(false);
        if (date) setSelectedDate(date);
    };

    const sortByLastName = (students) => {
        return [...students].sort((a, b) => {
            const lastA = a.name.split(" ").pop();
            const lastB = b.name.split(" ").pop();
            return lastA.localeCompare(lastB);
        });
    };

    const toggleExpand = (id) => {
        LayoutAnimation.easeInEaseOut();
        setExpandedCard((prev) => (prev === id ? null : id));
    };

    return (
        <SafeAreaView
            style={[
                styles.container,
                { paddingTop: insets.top + 25, paddingBottom: insets.bottom + 5 },
            ]}
        >
            {/* HEADER */}
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>ATTENDANCE REPORTS</Text>
            </View>

            {/* DATE SELECTOR */}
            <TouchableOpacity
                style={styles.dateSelector}
                onPress={() => setShowDatePicker(true)}
            >
                <Ionicons name="calendar-outline" size={24} color="#1E3A8A" />
                <Text style={styles.dateText}>{formattedDate}</Text>
                <Ionicons name="chevron-down" size={24} color="#1E3A8A" />
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                />
            )}

            {Platform.OS === "ios" && showDatePicker && (
                <View style={styles.datePickerActions}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.datePickerButton}>Done</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text style={styles.summaryText}>
                DAILY SUMMARY FOR {formattedDate.toUpperCase()}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {classReports.map((item) => {
                    const isExpanded = expandedCard === item.id;
                    const sorted = sortByLastName(item.students);
                    const present = sorted.filter((s) => s.status === "Present");
                    const absent = sorted.filter((s) => s.status === "Absent");
                    const late = sorted.filter((s) => s.status === "Late");

                    return (
                        <View key={item.id} style={[styles.card, { backgroundColor: item.color }]}>
                            <TouchableOpacity
                                onPress={() => toggleExpand(item.id)}
                                style={styles.cardHeader}
                            >
                                <View>
                                    <Text style={styles.className}>{item.title}</Text>
                                    <Text style={styles.timeLabel}>Time: {item.time}</Text>
                                </View>

                                <Ionicons
                                    name={isExpanded ? "chevron-up" : "chevron-down"}
                                    size={26}
                                    color="#1E3A8A"
                                />
                            </TouchableOpacity>

                            {isExpanded && (
                                <View style={styles.expandedArea}>
                                    <View style={styles.studentList}>
                                        {sorted.map((stu, index) => {
                                            const dot =
                                                stu.status === "Present"
                                                    ? styles.presentDot
                                                    : stu.status === "Absent"
                                                    ? styles.absentDot
                                                    : styles.lateDot;

                                            return (
                                                <View key={index} style={styles.studentRow}>
                                                    <View style={dot} />
                                                    <Text style={styles.studentName}>
                                                        {stu.name} ({stu.status})
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>

                                    <View style={styles.sessionSummary}>
                                        <Text style={styles.summaryHeader}>SESSION SUMMARY</Text>

                                        <Text style={styles.summaryTextSmall}>Total: {item.total}</Text>
                                        <Text style={styles.summaryTextSmall}>Present: {present.length}</Text>
                                        <Text style={styles.summaryTextSmall}>Absent: {absent.length}</Text>
                                        <Text style={styles.summaryTextSmall}>Late: {late.length}</Text>

                                        <Text style={styles.summaryTextSmall}>
                                            Attendance Rate: {Math.round((present.length / item.total) * 100)}%
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F1F5FF", paddingHorizontal: 20 },

    headerRow: {
        marginBottom: 25, // moved lower
    },

    headerTitle: { fontSize: 22, fontWeight: "800", color: "#1E3A8A" }, // bigger

    dateSelector: {
        backgroundColor: "#fff",
        padding: 16, // bigger
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
        gap: 12,
        marginBottom: 15,
    },

    dateText: { flex: 1, fontWeight: "700", fontSize: 16, color: "#1E3A8A" }, // bigger

    datePickerActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#f0f0f0",
    },
    datePickerButton: {
        color: "#2563EB",
        fontSize: 18,
        fontWeight: "600",
        paddingHorizontal: 20,
    },

    summaryText: {
        marginTop: 10,
        marginBottom: 12,
        color: "#475569",
        fontWeight: "700",
        fontSize: 14,
    },

    card: {
        borderRadius: 16,
        padding: 18, // bigger
        marginBottom: 18,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    className: { fontSize: 18, fontWeight: "800", color: "#1E3A8A" }, // bigger
    timeLabel: { color: "#475569", fontWeight: "600", fontSize: 15, marginTop: 3 }, // bigger

    expandedArea: { marginTop: 12 },

    studentList: { marginVertical: 12 },

    studentRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },

    studentName: { marginLeft: 8, color: "#1E293B", fontSize: 15 }, // bigger

    presentDot: { width: 12, height: 12, backgroundColor: "#22c55e", borderRadius: 50 },
    absentDot: { width: 12, height: 12, backgroundColor: "#ef4444", borderRadius: 50 },
    lateDot: { width: 12, height: 12, backgroundColor: "#eab308", borderRadius: 50 },

    sessionSummary: {
        backgroundColor: "rgba(255,255,255,0.75)",
        padding: 14,
        borderRadius: 12,
    },

    summaryHeader: { fontWeight: "800", fontSize: 16, color: "#1E3A8A", marginBottom: 6 },
    summaryTextSmall: { fontSize: 14, color: "#334155", marginBottom: 2 },
});

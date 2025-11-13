// Reports.js
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const mockData = [
    { date: "2025-10-01", name: "Alexandra Smith", status: "present" },
    { date: "2025-10-01", name: "John Doe", status: "absent" },
    { date: "2025-10-02", name: "Sarah Lee", status: "excused" },
    { date: "2025-10-02", name: "James Cruz", status: "present" },
    { date: "2025-10-03", name: "Emma Wilson", status: "present" },
];

export default function Reports() {
    const [selectedDate, setSelectedDate] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [filteredData, setFilteredData] = useState(mockData);
    const [statusFilter, setStatusFilter] = useState("all");

    // filter logic
    useEffect(() => {
        const filtered = mockData.filter((item) => {
            const dateMatch = selectedDate ? item.date === selectedDate : true;
            const statusMatch = statusFilter === "all" || item.status === statusFilter;
            return dateMatch && statusMatch;
        });
        setFilteredData(filtered);
    }, [selectedDate, statusFilter]);

    const onDateChange = (event, date) => {
        setShowDatePicker(Platform.OS === "ios");
        if (date) setSelectedDate(date.toISOString().split("T")[0]);
    };

    const summary = filteredData.reduce(
        (acc, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        },
        { present: 0, absent: 0, excused: 0 }
    );

    const chartData = [
        {
            name: "Present",
            population: summary.present,
            color: "#22c55e",
            legendFontColor: "#1E3A8A",
            legendFontSize: 14,
        },
        {
            name: "Absent",
            population: summary.absent,
            color: "#ef4444",
            legendFontColor: "#1E3A8A",
            legendFontSize: 14,
        },
        {
            name: "Excused",
            population: summary.excused,
            color: "#facc15",
            legendFontColor: "#1E3A8A",
            legendFontSize: 14,
        },
    ].filter((item) => item.population > 0);

    const SmallButton = ({ title, onPress, active }) => (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.smallButton, active && styles.activeButton]}
        >
            <Text style={[styles.buttonText, active && styles.buttonTextActive]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Attendance Reports</Text>

            {/* Filter Buttons */}
            <View style={styles.filterRow}>
                <SmallButton
                    title={selectedDate || "Select Date"}
                    onPress={() => setShowDatePicker(true)}
                    active={!!selectedDate}
                />
                <SmallButton
                    title="All"
                    onPress={() => setStatusFilter("all")}
                    active={statusFilter === "all"}
                />
                <SmallButton
                    title="Present"
                    onPress={() => setStatusFilter("present")}
                    active={statusFilter === "present"}
                />
                <SmallButton
                    title="Absent"
                    onPress={() => setStatusFilter("absent")}
                    active={statusFilter === "absent"}
                />
                <SmallButton
                    title="Excused"
                    onPress={() => setStatusFilter("excused")}
                    active={statusFilter === "excused"}
                />
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate ? new Date(selectedDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            {/* Summary Cards */}
            <View style={styles.summaryContainer}>
                <View style={[styles.summaryCard, { backgroundColor: "#dcfce7" }]}>
                    <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                    <Text style={styles.summaryNumber}>{summary.present}</Text>
                    <Text style={styles.summaryLabel}>Present</Text>
                </View>

                <View style={[styles.summaryCard, { backgroundColor: "#fee2e2" }]}>
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                    <Text style={styles.summaryNumber}>{summary.absent}</Text>
                    <Text style={styles.summaryLabel}>Absent</Text>
                </View>

                <View style={[styles.summaryCard, { backgroundColor: "#fef9c3" }]}>
                    <Ionicons name="document-text" size={24} color="#facc15" />
                    <Text style={styles.summaryNumber}>{summary.excused}</Text>
                    <Text style={styles.summaryLabel}>Excused</Text>
                </View>
            </View>

            {/* Attendance Table */}
            <Text style={styles.tableTitle}>Attendance Records</Text>
            <FlatList
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View
                        style={[
                            styles.row,
                            { backgroundColor: index % 2 === 0 ? "#f8fafc" : "#fff" },
                        ]}
                    >
                        <Text style={[styles.cell, { flex: 1 }]}>{item.date}</Text>
                        <Text style={[styles.cell, { flex: 1.5 }]}>{item.name}</Text>
                        <Text
                            style={[
                                styles.cell,
                                {
                                    color:
                                        item.status === "present"
                                            ? "#22c55e"
                                            : item.status === "excused"
                                                ? "#facc15"
                                                : "#ef4444",
                                    fontWeight: "bold",
                                },
                            ]}
                        >
                            {item.status}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", color: "#64748b", marginTop: 20 }}>
                        No data available.
                    </Text>
                }
            />

            {/* Pie Chart - Modified Height and Width */}
            {chartData.length > 0 && (
                <View style={styles.chartContainer}>
                    <PieChart
                        data={chartData}
                        // Reduced width
                        width={screenWidth - 60} 
                        // Reduced height
                        height={180} 
                        chartConfig={{
                            backgroundGradientFrom: "#E0F2FE",
                            backgroundGradientTo: "#DBEAFE",
                            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                </View>
            )}
        </View>
    );
}

// ------------------- Styles -------------------
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F0F6FF", padding: 15 },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1E3A8A",
        textAlign: "center",
        marginVertical: 15,
    },
    filterRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 15,
    },
    smallButton: {
        backgroundColor: "#93C5FD",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        margin: 4,
    },
    activeButton: { backgroundColor: "#2563EB" },
    buttonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
    buttonTextActive: { color: "#fff" },

    summaryContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },
    summaryCard: {
        width: "30%",
        alignItems: "center",
        paddingVertical: 15,
        borderRadius: 12,
    },
    summaryNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1E3A8A",
        marginTop: 5,
    },
    summaryLabel: { fontSize: 14, color: "#1E3A8A" },

    tableTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E3A8A",
        marginTop: 15,
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E7FF",
        paddingVertical: 8,
        paddingHorizontal: 6,
    },
    cell: { textAlign: "center", fontSize: 14, color: "#1E40AF" },

    chartContainer: { 
        // Ensure the chart remains centered
        marginTop: 20, 
        alignItems: "center" 
    },
});

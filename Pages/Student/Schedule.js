import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { useFocusEffect } from "@react-navigation/native";

export default function Schedule() {
    const insets = useSafeAreaInsets();
    const [todayClasses, setTodayClasses] = useState([]);
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const getDayName = (date) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return days[date.getDay()];
    };

    const loadSessions = async () => {
        setLoading(true);
        try {
            const saved = await AsyncStorage.getItem("currentUser");
            const user = saved ? JSON.parse(saved) : null;
            if (!user) {
                setTodayClasses([]);
                setUpcomingClasses([]);
                setLoading(false);
                return;
            }

            const sessionsQuery = query(collection(db, "sessions"));
            const sessionsSnap = await getDocs(sessionsQuery);

            const sessions = [];
            const today = new Date();
            const todayDayName = getDayName(today);

            for (const sDoc of sessionsSnap.docs) {
                const data = sDoc.data();
                const sessionId = sDoc.id;

                let isUserSession = false;
                if (data.teacherId && String(data.teacherId) === String(user.uid)) {
                    isUserSession = true;
                } else {
                    const studentDocRef = doc(db, "sessions", sessionId, "students", String(user.uid));
                    const studentSnap = await getDoc(studentDocRef);
                    isUserSession = studentSnap.exists();
                }

                if (!isUserSession) continue;

                const sessionDays = Array.isArray(data.days) ? data.days : [data.days];
                const isToday = sessionDays.includes(todayDayName);
                const daysStr = sessionDays.join(", ");

                sessions.push({
                    id: sessionId,
                    title: data.subject || "Class",
                    days: daysStr,
                    block: data.block || "",
                    startTime: data.startTime || "",
                    endTime: data.endTime || "",
                    isToday,
                });
            }

            const today_arr = sessions.filter((s) => s.isToday);
            const upcoming_arr = sessions.filter((s) => !s.isToday);

            const sortByTime = (a, b) => {
                const timeA = a.startTime ? parseInt(a.startTime.replace(":", "")) : 0;
                const timeB = b.startTime ? parseInt(b.startTime.replace(":", "")) : 0;
                return timeA - timeB;
            };

            setTodayClasses(today_arr.sort(sortByTime));
            setUpcomingClasses(upcoming_arr.sort(sortByTime));
        } catch (err) {
            console.error("loadSessions error:", err);
            setTodayClasses([]);
            setUpcomingClasses([]);
        } finally {
            setLoading(false);
        }
    };

    // HOOK AT TOP LEVEL — MOVED BEFORE ANY CONDITIONAL LOGIC
    useFocusEffect(
        React.useCallback(() => {
            loadSessions();
        }, [])
    );

    const ClassCard = ({ item, isToday }) => (
        <View style={[styles.classCard, isToday && styles.todayCard]}>
            <View style={{ flex: 1 }}>
                <Text style={styles.classTitle}>{item.title}</Text>
                <Text style={styles.classTime}>
                    {item.startTime} - {item.endTime}
                </Text>
                <Text style={styles.classDays}>{item.days}</Text>
                {item.block && <Text style={styles.classBlock}>Block {item.block}</Text>}
            </View>
            <View style={[styles.iconCircle, isToday && styles.todayIcon]}>
                <Ionicons
                    name={isToday ? "star" : "calendar"}
                    size={20}
                    color={isToday ? "#FBBF24" : "#22C55E"}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                {loading ? (
                    <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
                ) : (
                    <>
                        {/* TODAY'S CLASSES */}
                        <Text style={styles.sectionHeader}>TODAY'S CLASSES</Text>
                        {todayClasses.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="checkmark-circle-outline" size={40} color="#CBD5E1" />
                                <Text style={styles.emptyText}>No classes today</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={todayClasses}
                                renderItem={({ item }) => <ClassCard item={item} isToday={true} />}
                                keyExtractor={(item) => `today-${item.id}`}
                                scrollEnabled={false}
                            />
                        )}

                        {/* UPCOMING CLASSES */}
                        <Text style={[styles.sectionHeader, { marginTop: 25 }]}>UPCOMING CLASSES</Text>
                        {upcomingClasses.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="calendar-outline" size={40} color="#CBD5E1" />
                                <Text style={styles.emptyText}>No upcoming classes</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={upcomingClasses}
                                renderItem={({ item }) => <ClassCard item={item} isToday={false} />}
                                keyExtractor={(item) => `upcoming-${item.id}`}
                                scrollEnabled={false}
                            />
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4FF",
        paddingHorizontal: 15,
        paddingTop: 50,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E3A8A",
        marginBottom: 12,
        marginTop: 15,
    },
    classCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    todayCard: {
        borderLeftColor: "#FBBF24",
        backgroundColor: "#FFFBEB",
    },
    classTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E3A8A",
    },
    classTime: {
        fontSize: 13,
        color: "#2563EB",
        fontWeight: "600",
        marginTop: 4,
    },
    classDays: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 4,
    },
    classBlock: {
        fontSize: 11,
        color: "#9CA3AF",
        marginTop: 4,
    },
    iconCircle: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "#E8FBEF",
    },
    todayIcon: {
        backgroundColor: "#FEF3C7",
    },
    emptyContainer: {
        alignItems: "center",
        paddingVertical: 30,
    },
    emptyText: {
        marginTop: 12,
        color: "#64748b",
        fontSize: 14,
    },
});

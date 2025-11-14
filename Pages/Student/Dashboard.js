import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    StatusBar,
    Dimensions,
    ScrollView,
    Platform,
    TextInput,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as DocumentPicker from 'expo-document-picker';

// Placeholder components
import Notification from "./Schedule";
import AttachLetter from "./Attendance";
import More from "./More";

const { width, height } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

// ---------------- Dashboard Header ----------------
function DashboardHeader({ studentName, insets, onJoinPress, showJoinButton }) {
    const paddingTop = insets.top + 15;

    return (
        <View style={[styles.headerGradient, { paddingTop }]}>
            <View style={styles.headerHorizontal}>
                <View>
                    <Text style={[styles.headerText, { color: "#1E3A8A" }]}>Welcome back,</Text>
                    <Text style={[styles.studentNameHeader, { color: "#1E3A8A" }]}>{studentName}</Text>
                </View>

                {showJoinButton && (
                    <TouchableOpacity
                        style={styles.joinClassButtonHorizontal}
                        onPress={onJoinPress}
                    >
                        <Text style={styles.joinClassButtonText}>Join a Class</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

// ---------------- Dashboard Main ----------------
function DashboardMain({ route }) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const user = route.params?.user;

    const [student, setStudent] = useState({
        id: "42-123456",
        name: "Alexandra Smith",
        section: "BSCS-2 Block-02",
    });

    const [today, setToday] = useState("");
    const [joinedClasses, setJoinedClasses] = useState([]);
    const [activeClassId, setActiveClassId] = useState(null);
    const [classCode, setClassCode] = useState("");
    const [joinModalVisible, setJoinModalVisible] = useState(false);
    const [attendance, setAttendance] = useState(null);
    const [attachedFile, setAttachedFile] = useState(null);

    useEffect(() => {
        const now = new Date();
        const formatted = now.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        setToday(formatted);
    }, []);

    useEffect(() => {
        if (user) {
            setStudent({
                id: user.id || user.username || "42-123456",
                name: user.name || "Unknown User",
                section: user.section || "Unknown Section",
            });
        }
    }, [user]);

    const activeClass = joinedClasses.find(cls => cls.id === activeClassId);

    useEffect(() => {
        if (!activeClass) return;

        const todaySession = {
            id: Date.now().toString(),
            date: today,
            status: null,
        };

        const updatedClasses = joinedClasses.map(cls => {
            if (cls.id === activeClass.id) {
                const existing = cls.sessions?.find(s => s.date === today);
                if (!existing) {
                    cls.sessions = [todaySession, ...(cls.sessions || [])];
                }
            }
            return cls;
        });

        setJoinedClasses(updatedClasses);
        setAttendance(null);
        setAttachedFile(null);
    }, [activeClassId, today]);

    const handleAttendance = async (status) => {
        if (!activeClass) {
            Alert.alert("No Class Selected", "Please select a class first.");
            return;
        }

        const updatedClasses = joinedClasses.map(cls => {
            if (cls.id === activeClass.id && cls.sessions && cls.sessions.length > 0) {
                cls.sessions[0].status = status;
            }
            return cls;
        });

        setJoinedClasses(updatedClasses);
        setAttendance(status);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            Alert.alert("Success", `Attendance marked as ${status}`, [{ text: "OK" }]);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to mark attendance. Please try again.");
        }
    };

    const handleJoinClass = () => {
        if (!classCode.trim()) {
            Alert.alert("Invalid Code", "Please enter a valid class code.");
            return;
        }
        const fakeClass = {
            id: classCode.trim(),
            name: `Class ${classCode.trim()}`,
            section: `Section ${joinedClasses.length + 1}`,
            sessions: [],
        };
        setJoinedClasses([...joinedClasses, fakeClass]);
        setActiveClassId(fakeClass.id);
        setJoinModalVisible(false);
        setClassCode("");
        Alert.alert("Joined Class", `You joined ${fakeClass.name}`);
    };

    const handleAttachFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
        if (result.type === "success") {
            setAttachedFile(result);
            Alert.alert("File Attached", result.name);
        }
    };

    const qrData = JSON.stringify({
        studentId: student.id,
        studentName: student.name,
        section: activeClass ? activeClass.section : student.section,
        sessionId: activeClass && activeClass.sessions && activeClass.sessions[0] ? activeClass.sessions[0].id : null,
        classId: activeClass ? activeClass.id : null,
    });

    return (
        <View style={styles.mainContainer}>
            <DashboardHeader
                studentName={student.name}
                insets={insets}
                onJoinPress={() => setJoinModalVisible(true)}
                showJoinButton={joinedClasses.length > 0}
            />

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: 30 }]}>
                {joinedClasses.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyTitle}>No classes joined yet</Text>
                        <Text style={styles.emptySubtitle}>Start by joining a class to track your attendance</Text>
                        <TouchableOpacity style={styles.joinClassButton} onPress={() => setJoinModalVisible(true)}>
                            <Text style={styles.joinClassButtonText}>Join a Class</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {joinedClasses.map(cls => {
                    const isActive = cls.id === activeClassId;
                    return (
                        <View key={cls.id} style={[styles.classCard, isActive ? styles.activeClassCard : null]}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View>
                                    <Text style={styles.className}>{cls.name}</Text>
                                    <Text style={styles.classSection}>{cls.section}</Text>
                                </View>
                                {!isActive && (
                                    <TouchableOpacity
                                        style={styles.selectButton}
                                        onPress={() => setActiveClassId(cls.id)}
                                    >
                                        <Text style={styles.selectButtonText}>Select</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {isActive && (
                                <>
                                    <View style={styles.qrContainer}>
                                        <QRCode value={qrData} size={150} color="#2563EB" backgroundColor="white" />
                                        <Text style={styles.qrLabel}>Scan this code for attendance</Text>
                                    </View>

                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity
                                            style={[styles.attendanceButton, attendance === "Present" && styles.presentButtonActive]}
                                            onPress={() => handleAttendance("Present")}
                                        >
                                            <Text style={[styles.buttonText, attendance === "Present" && styles.presentText]}>
                                                PRESENT
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.attendanceButton, attendance === "Absent" && styles.absentButtonActive]}
                                            onPress={() => handleAttendance("Absent")}
                                        >
                                            <Text style={[styles.buttonText, attendance === "Absent" && styles.absentText]}>
                                                ABSENT
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {attendance && (
                                        <Text style={[styles.statusIndicator, attendance === 'Present' ? styles.statusPresent : styles.statusAbsent]}>
                                            Status: {attendance}
                                        </Text>
                                    )}

                                    <TouchableOpacity style={[styles.joinClassButton, { marginTop: 15 }]} onPress={handleAttachFile}>
                                        <Text style={styles.joinClassButtonText}>Attach Excuse Letter</Text>
                                    </TouchableOpacity>
                                    {attachedFile && (
                                        <Text style={{ marginTop: 5, fontSize: 14, color: "#555" }}>Attached: {attachedFile.name}</Text>
                                    )}
                                </>
                            )}

                            {cls.sessions && cls.sessions.length > 0 && (
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontWeight: "600", color: "#1E3A8A", marginBottom: 5 }}>Attendance History:</Text>
                                    {cls.sessions.map((sess) => (
                                        <View key={sess.id} style={styles.historyRow}>
                                            <Text style={{ flex: 1 }}>{sess.date}</Text>
                                            <Text style={{ fontWeight: "bold", color: sess.status === "Present" ? "#059669" : sess.status === "Absent" ? "#EF4444" : "#555" }}>
                                                {sess.status || "Not Marked"}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                })}

                <Modal
                    isVisible={joinModalVisible}
                    onBackdropPress={() => setJoinModalVisible(false)}
                    backdropOpacity={0.5}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    style={styles.centeredModal}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Join Class</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Class Code"
                            value={classCode}
                            onChangeText={setClassCode}
                        />
                        <TouchableOpacity style={styles.joinButton} onPress={handleJoinClass}>
                            <Text style={styles.joinButtonText}>Join</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
}

export default function Dashboard() {
    const insets = useSafeAreaInsets();
    const route = useRoute();

    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor('#F0F4FF');
        }
    }, []);

    const tabIcons = {
        DashboardMain: ({ focused, color }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
        ),
        Notification: ({ focused, color }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={24} color={color} />
        ),
        AttachLetter: ({ focused, color }) => (
            <MaterialIcons name={focused ? "attach-file" : "attachment"} size={24} color={color} />
        ),
        More: ({ focused, color }) => (
            <Ionicons name={focused ? "menu" : "menu-outline"} size={24} color={color} />
        ),
    };

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                initialRouteName="DashboardMain"
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarActiveTintColor: "#2563EB",
                    tabBarInactiveTintColor: "#808080",
                    tabBarStyle: {
                        backgroundColor: "#fff",
                        borderTopWidth: 0,
                        height: 60 + insets.bottom,
                        paddingBottom: 5 + insets.bottom,
                    },
                    tabBarIcon: ({ color, focused }) => {
                        const IconComponent = tabIcons[route.name];
                        return IconComponent ? <IconComponent color={color} focused={focused} /> : null;
                    },
                })}
            >
                <Tab.Screen
                    name="DashboardMain"
                    component={DashboardMain}
                    initialParams={{ user: route.params?.user }}
                    options={{ title: "Home" }}
                />
                <Tab.Screen name="Notification" component={Notification} options={{ title: "Schedule" }} />
                <Tab.Screen name="AttachLetter" component={AttachLetter} options={{ title: "Attendance" }} />
                <Tab.Screen name="More" component={More} options={{ title: "Settings" }} />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: "#F0F4FF" },
    headerGradient: { paddingBottom: 15, paddingHorizontal: 20 },
    headerHorizontal: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    headerText: { fontSize: 13 },
    studentNameHeader: { fontSize: 18, fontWeight: "bold" },
    scrollContent: { paddingBottom: 40, alignItems: 'center', minHeight: height - 100 },
    qrContainer: { backgroundColor: "white", padding: 15, borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4, alignItems: "center" },
    qrLabel: { marginTop: 10, fontSize: 14, fontWeight: "600", color: "#1E3A8A", textAlign: "center" },
    joinClassButtonHorizontal: { backgroundColor: "#2563EB", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 },
    joinClassButton: { backgroundColor: "#2563EB", padding: 12, borderRadius: 10, alignItems: "center" },
    joinClassButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    classCard: { width: width * 0.9, backgroundColor: "#fff", borderRadius: 18, padding: 15, marginVertical: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
    activeClassCard: { borderColor: "#2563EB", borderWidth: 2 },
    className: { fontSize: 16, fontWeight: "700", color: "#1E3A8A" },
    classSection: { fontSize: 14, color: "#555", marginTop: 3 },
    selectButton: { backgroundColor: "#2563EB", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
    selectButtonText: { color: "#fff", fontWeight: "bold" },
    historyRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
    attendanceButton: { flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 10, backgroundColor: "#e9ecef", alignItems: "center" },
    presentButtonActive: { backgroundColor: "#22c55e" },
    absentButtonActive: { backgroundColor: "#ef4444" },
    buttonText: { fontSize: 15, fontWeight: "700", color: "#333" },
    presentText: { color: "#fff" },
    absentText: { color: "#fff" },
    statusIndicator: { marginTop: 15, padding: 10, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
    statusPresent: { backgroundColor: '#D1FAE5', color: '#059669' },
    statusAbsent: { backgroundColor: '#FEE2E2', color: '#EF4444' },
    centeredModal: { justifyContent: "center", alignItems: "center" },
    modalContent: { width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 20, alignItems: "stretch" },
    modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#1E3A8A", textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 10, padding: 10, marginVertical: 5, backgroundColor: "#F8FAFC" },
    joinButton: { backgroundColor: "#2563EB", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 5 },
    joinButtonText: { color: "#fff", fontWeight: "bold" },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", height: height - 150 },
    emptyTitle: { fontSize: 18, fontWeight: "bold", color: "#1E3A8A", marginBottom: 10 },
    emptySubtitle: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 20 },
});

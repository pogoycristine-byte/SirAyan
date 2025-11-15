// Student Dashboard (connected to Firestore by class code)
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
    ActivityIndicator,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as DocumentPicker from "expo-document-picker";
import { collection, addDoc, query, where, getDocs, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../src/config/firebase";

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
                    <Text style={[styles.headerText, { color: "#1E3A8A" }]}>
                        Welcome back,
                    </Text>
                    <Text style={[styles.studentNameHeader, { color: "#1E3A8A" }]}>
                        {studentName}
                    </Text>
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
        id: "",
        name: "",
        section: "",
        email: "",
        uid: null,
    });

    const [today, setToday] = useState("");
    const [joinedClasses, setJoinedClasses] = useState([]);
    const [activeClassId, setActiveClassId] = useState(null);
    const [classCode, setClassCode] = useState("");
    const [joinModalVisible, setJoinModalVisible] = useState(false);
    const [attendance, setAttendance] = useState(null);
    const [attachedFile, setAttachedFile] = useState(null);
    const [submittingExcuse, setSubmittingExcuse] = useState(false);
    const [loading, setLoading] = useState(false);

    // ======== SET DATE ========
    useEffect(() => {
        const now = new Date();
        const formatted = now.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        setToday(formatted);
    }, []);

    // ======== SET STUDENT FROM FIREBASE AUTH ========
    useEffect(() => {
        if (user) {
            setStudent({
                id: user.id || "",
                name: user.fullname || "",
                section: user.section || "",
                email: user.email || "",
                uid: user.uid,
            });

            // Load joined classes from Firestore
            loadJoinedClasses(user.uid);
        }
    }, [user]);

    // ======================================================
    // 🔥 NEW FUNCTION: LOAD JOINED CLASSES FROM FIRESTORE
    // ======================================================
    const loadJoinedClasses = async (uid) => {
        try {
            const sessionsRef = collection(db, "sessions");
            const sessionsSnapshot = await getDocs(sessionsRef);

            let classes = [];

            for (let session of sessionsSnapshot.docs) {
                const sessionId = session.id;

                // Check if this student is inside: sessions/<sessionId>/students/<uid>
                const studentRef = doc(db, "sessions", sessionId, "students", uid);
                const studentSnap = await getDoc(studentRef);

                if (studentSnap.exists()) {
                    const sessionData = session.data();

                    classes.push({
                        id: sessionId,
                        name: `${sessionData.subject || "Class"} (${sessionData.block || ""})`,
                        section: sessionData.block || "",
                        subject: sessionData.subject || "",
                        block: sessionData.block || "",
                        days: Array.isArray(sessionData.days)
                            ? sessionData.days.join(", ")
                            : sessionData.days || "",
                        startTime: sessionData.startTime || "",
                        endTime: sessionData.endTime || "",
                        code: sessionData.code || "",
                        sessions: [],
                    });
                }
            }

            setJoinedClasses(classes);

            // auto-select first joined class
            if (classes.length > 0) {
                setActiveClassId(classes[0].id);
            }

        } catch (err) {
            console.log("Error loading joined classes:", err);
        }
    };

    const activeClass = joinedClasses.find((cls) => cls.id === activeClassId);

    // ======== AUTO-CREATE TODAY SESSION LOCALLY ========
    useEffect(() => {
        if (!activeClass) return;

        const todaySession = {
            id: Date.now().toString(),
            date: today,
            status: null,
        };

        const updated = joinedClasses.map((cls) => {
            if (cls.id === activeClass.id) {
                const exists = cls.sessions?.find((s) => s.date === today);
                if (!exists) {
                    cls.sessions = [todaySession, ...(cls.sessions || [])];
                }
            }
            return cls;
        });

        setJoinedClasses(updated);
        setAttendance(null);
        setAttachedFile(null);
    }, [activeClassId, today]);

    // ======================================================
    // 🔥 JOIN CLASS BY CODE — NOW PERSISTENT
    // ======================================================
    const handleJoinClass = async () => {
        if (!classCode.trim()) {
            Alert.alert("Invalid Code", "Please enter a valid class code.");
            return;
        }

        try {
            setLoading(true);

            const q = query(
                collection(db, "sessions"),
                where("code", "==", classCode.trim())
            );
            const result = await getDocs(q);

            if (result.empty) {
                Alert.alert("Not found", "No class found for that code.");
                return;
            }

            const sessionDoc = result.docs[0];
            const sessionId = sessionDoc.id;
            const sessionData = sessionDoc.data();

            const studentRef = doc(
                db,
                "sessions",
                sessionId,
                "students",
                student.uid
            );

            const exists = await getDoc(studentRef);

            if (!exists.exists()) {
                await setDoc(studentRef, {
                    uid: student.uid,
                    fullname: student.name,
                    email: student.email,
                    section: student.section,
                    joinedAt: serverTimestamp(),
                });
            }

            // Local UI update — avoid duplicates
            const alreadyJoined = joinedClasses.some((c) => c.id === sessionId);
            if (!alreadyJoined) {
                setJoinedClasses((prev) => [
                    {
                        id: sessionId,
                        name: `${sessionData.subject} (${sessionData.block})`,
                        section: sessionData.block,
                        subject: sessionData.subject,
                        block: sessionData.block,
                        days: Array.isArray(sessionData.days)
                            ? sessionData.days.join(", ")
                            : sessionData.days || "",
                        startTime: sessionData.startTime,
                        endTime: sessionData.endTime,
                        code: sessionData.code,
                        sessions: [],
                    },
                    ...prev,
                ]);
            }

            setActiveClassId(sessionId);
            setJoinModalVisible(false);
            setClassCode("");

            Alert.alert("Joined!", `You joined ${sessionData.subject}`);

        } catch (err) {
            Alert.alert("Error", err.message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // ATTENDANCE — SAME AS YOUR LOGIC
    // ======================================================
    const handleAttendance = async (status) => {
        if (!activeClass) return;

        const updated = joinedClasses.map((cls) => {
            if (cls.id === activeClass.id && cls.sessions?.length > 0) {
                cls.sessions[0].status = status;
            }
            return cls;
        });

        setJoinedClasses(updated);
        setAttendance(status);

        try {
            setLoading(true);

            const attendanceId = `${student.uid}_${today.replace(/\s+/g, "_")}`;

            await setDoc(
                doc(db, "sessions", activeClass.id, "attendance", attendanceId),
                {
                    studentUid: student.uid,
                    studentName: student.name,
                    studentEmail: student.email,
                    classId: activeClass.id,
                    status,
                    date: today,
                    createdAt: serverTimestamp(),
                }
            );

            Alert.alert("Success", `Attendance marked as ${status}`);
        } catch (err) {
            Alert.alert("Error", "Failed to save attendance.");
        } finally {
            setLoading(false);
        }
    };

    const handleAttachFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
            });

            if (result.type === "success" && result.assets?.length > 0) {
                const file = result.assets[0]; // correct!

                setAttachedFile({
                    name: file.name,
                    uri: file.uri,
                    size: file.size,
                    mimeType: file.mimeType,
                });

                Alert.alert("File Selected", file.name);
            }
        } catch (err) {
            console.error("Error picking file:", err);
            Alert.alert("Error", "Failed to pick file");
        }
    };

    // Submit excuse letter to Firebase
    const handleSubmitExcuse = async () => {
        if (!activeClass) {
            Alert.alert("No Class Selected", "Please select a class first.");
            return;
        }

        if (!attachedFile) {
            Alert.alert("No File", "Please attach a file first.");
            return;
        }

        setSubmittingExcuse(true);

        try {
            // 1. Upload file to Firebase Storage
            const storage = getStorage();
            const fileName = `${student.uid}_${Date.now()}_${attachedFile.name}`;
            const storageRef = ref(storage, `excuseLetters/${fileName}`);

            // Fetch file blob from local URI
            const response = await fetch(attachedFile.uri);
            const blob = await response.blob();

            // Upload blob to Storage
            await uploadBytes(storageRef, blob);

            // Get downloadable URL
            const downloadUrl = await getDownloadURL(storageRef);

            // 2. Save metadata to Firestore excuseLetters collection
            const excusesRef = collection(db, "excuseLetters");

            const excuseData = {
                studentUid: student.uid,
                fullname: student.name,
                "student-id": user?.["student-id"] || "",
                username: user?.username || user?.email || "",
                section: user?.section || "",
                year: user?.year || "",
                date: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
                fileName: attachedFile.name,
                fileUrl: downloadUrl,     // 🔥 Public downloadable URL from Storage
                reason: "",
                status: "Pending",
                submittedAt: serverTimestamp(),
            };

            await addDoc(excusesRef, excuseData);

            Alert.alert("Success", "Excuse letter submitted to teacher.");
            setAttachedFile(null);

        } catch (err) {
            console.error("Error submitting excuse:", err);
            Alert.alert("Error", "Failed to submit excuse: " + err.message);
        } finally {
            setSubmittingExcuse(false);
        }
    };

    const qrData = JSON.stringify({
        studentId: student.uid,
        studentName: student.name,
        section: activeClass ? activeClass.section : student.section,
        sessionId:
            activeClass && activeClass.sessions && activeClass.sessions[0]
                ? activeClass.sessions[0].id
                : null,
        classId: activeClass ? activeClass.id : null,
    });

    // ================= UI  =======================
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
                        <Text style={styles.emptyTitle}>
                            No classes joined yet
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            Start by joining a class to track attendance
                        </Text>
                        <TouchableOpacity
                            style={styles.joinClassButton}
                            onPress={() => setJoinModalVisible(true)}
                        >
                            <Text style={styles.joinClassButtonText}>
                                Join a Class
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {joinedClasses.map((cls) => {
                    const isActive = cls.id === activeClassId;
                    return (
                        <View key={cls.id} style={[styles.classCard, isActive ? styles.activeClassCard : null]}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <View>
                                    <Text style={styles.className}>
                                        {cls.name}
                                    </Text>
                                </View>
                                {!isActive && (
                                    <TouchableOpacity
                                        style={styles.selectButton}
                                        onPress={() => setActiveClassId(cls.id)}
                                    >
                                        <Text style={styles.selectButtonText}>
                                            Select
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {isActive && (
                                <>
                                    <View style={styles.qrContainer}>
                                        <QRCode
                                            value={qrData}
                                            size={150}
                                            color="#2563EB"
                                            backgroundColor="white"
                                        />
                                        <Text style={styles.qrLabel}>
                                            Scan this code for attendance
                                        </Text>
                                    </View>

                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity
                                            style={[
                                                styles.attendanceButton,
                                                attendance === "Present" &&
                                                    styles.presentButtonActive,
                                            ]}
                                            onPress={() =>
                                                handleAttendance("Present")
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.buttonText,
                                                    attendance === "Present" &&
                                                        styles.presentText,
                                                ]}
                                            >
                                                PRESENT
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styles.attendanceButton,
                                                attendance === "Absent" &&
                                                    styles.absentButtonActive,
                                            ]}
                                            onPress={() =>
                                                handleAttendance("Absent")
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.buttonText,
                                                    attendance === "Absent" &&
                                                        styles.absentText,
                                                ]}
                                            >
                                                ABSENT
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {attendance && (
                                        <Text
                                            style={[
                                                styles.statusIndicator,
                                                attendance === "Present"
                                                    ? styles.statusPresent
                                                    : styles.statusAbsent,
                                            ]}
                                        >
                                            Status: {attendance}
                                        </Text>
                                    )}

                                    {/* Attach Excuse Letter */}
                                    {!attachedFile ? (
                                        <TouchableOpacity
                                            style={[styles.joinClassButton, { marginTop: 15, backgroundColor: "#F59E0B" }]}
                                            onPress={handleAttachFile}
                                        >
                                            <Text style={styles.joinClassButtonText}>Attach Excuse Letter</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={{ marginTop: 10, padding: 10, backgroundColor: "#FEF3C7", borderRadius: 8 }}>
                                            <Text style={{ fontSize: 14, color: "#92400E", fontWeight: "600", marginBottom: 8 }}>
                                                File: {attachedFile.name}
                                            </Text>
                                            <View style={{ flexDirection: "row", gap: 10 }}>
                                                <TouchableOpacity
                                                    style={[styles.joinClassButton, { flex: 1, backgroundColor: "#10B981" }]}
                                                    onPress={handleSubmitExcuse}
                                                    disabled={submittingExcuse}
                                                >
                                                    <Text style={styles.joinClassButtonText}>
                                                        {submittingExcuse ? "Submitting..." : "Submit Excuse"}
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.joinClassButton, { flex: 1, backgroundColor: "#EF4444" }]}
                                                    onPress={() => setAttachedFile(null)}
                                                >
                                                    <Text style={styles.joinClassButtonText}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </>
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
                            editable={!loading}
                        />
                        <TouchableOpacity
                            style={styles.joinButton}
                            onPress={handleJoinClass}
                            disabled={loading}
                        >
                            <Text style={styles.joinButtonText}>
                                {loading ? "Joining..." : "Join"}
                            </Text>
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
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("#F0F4FF");
        }
    }, []);

    const tabIcons = {
        DashboardMain: ({ focused, color }) => (
            <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
            />
        ),
        Notification: ({ focused, color }) => (
            <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={24}
                color={color}
            />
        ),
        AttachLetter: ({ focused, color }) => (
            <MaterialIcons
                name={focused ? "attach-file" : "attachment"}
                size={24}
                color={color}
            />
        ),
        More: ({ focused, color }) => (
            <Ionicons
                name={focused ? "menu" : "menu-outline"}
                size={24}
                color={color}
            />
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
                        return IconComponent ? (
                            <IconComponent color={color} focused={focused} />
                        ) : null;
                    },
                })}
            >
                <Tab.Screen
                    name="DashboardMain"
                    component={DashboardMain}
                    initialParams={{ user: route.params?.user }}
                    options={{ title: "Home" }}
                />
                <Tab.Screen
                    name="Notification"
                    component={Notification}
                    options={{ title: "Schedule" }}
                />
                <Tab.Screen
                    name="AttachLetter"
                    component={AttachLetter}
                    options={{ title: "Attendance" }}
                />
                <Tab.Screen
                    name="More"
                    component={More}
                    options={{ title: "Settings" }}
                />
            </Tab.Navigator>
        </View>
    );
}

// ====================== STYLES =======================
const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: "#F0F4FF" },
    headerGradient: { paddingBottom: 15, paddingHorizontal: 20 },
    headerHorizontal: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerText: { fontSize: 13 },
    studentNameHeader: { fontSize: 18, fontWeight: "bold" },
    scrollContent: {
        paddingBottom: 40,
        alignItems: "center",
        minHeight: height - 100,
    },
    qrContainer: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        alignItems: "center",
    },
    qrLabel: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "600",
        color: "#1E3A8A",
        textAlign: "center",
    },
    joinClassButtonHorizontal: {
        backgroundColor: "#2563EB",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    joinClassButton: {
        backgroundColor: "#2563EB",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    joinClassButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    classCard: {
        width: width * 0.9,
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 15,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    activeClassCard: { borderColor: "#2563EB", borderWidth: 2 },
    className: { fontSize: 16, fontWeight: "700", color: "#1E3A8A" },
    classSection: { fontSize: 14, color: "#555", marginTop: 3 },
    selectButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    selectButtonText: { color: "#fff", fontWeight: "bold" },
    historyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 2,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    attendanceButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: "#e9ecef",
        alignItems: "center",
    },
    presentButtonActive: { backgroundColor: "#22c55e" },
    absentButtonActive: { backgroundColor: "#ef4444" },
    buttonText: { fontSize: 15, fontWeight: "700", color: "#333" },
    presentText: { color: "#fff" },
    absentText: { color: "#fff" },
    statusIndicator: {
        marginTop: 15,
        padding: 10,
        borderRadius: 8,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
    statusPresent: { backgroundColor: "#D1FAE5", color: "#059669" },
    statusAbsent: { backgroundColor: "#FEE2E2", color: "#EF4444" },
    centeredModal: {
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
        alignItems: "stretch",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
        color: "#1E3A8A",
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        backgroundColor: "#F8FAFC",
    },
    joinButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 5,
    },
    joinButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: height - 150,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1E3A8A",
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginBottom: 20,
    },
});

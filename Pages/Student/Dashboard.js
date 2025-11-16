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

import AsyncStorage from "@react-native-async-storage/async-storage";  // ⭐ ADDED (for saving emailSent)

import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as DocumentPicker from "expo-document-picker";
import * as MailComposer from "expo-mail-composer";

import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
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
  const routeInfo = useRoute();
  
  // join helper by Firestore session id
  const joinById = async (sessionId) => {
    try {
      if (!student?.uid || !sessionId) return;
      const studentRef = doc(db, "sessions", sessionId, "students", student.uid);
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
      // reload classes and select this one
      await loadJoinedClasses(student.uid);
      setActiveClassId(sessionId);
      Alert.alert("Joined!", "Joined class from link");
    } catch (e) {
      console.warn("joinById error", e);
      Alert.alert("Error", "Failed to join class from link");
    }
  };

  // join helper by class code (exact match)
  const joinByCode = async (code) => {
    try {
      if (!code || !student?.uid) return;
      const q = query(collection(db, "sessions"), where("code", "==", code.trim()));
      const result = await getDocs(q);
      if (result.empty) {
        Alert.alert("Not found", "No class found for that code.");
        return;
      }
      const sessionDoc = result.docs[0];
      const sessionId = sessionDoc.id;
      await joinById(sessionId);
    } catch (e) {
      console.warn("joinByCode error", e);
      Alert.alert("Error", "Failed to join class");
    }
  };

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

  const [emailSentByClass, setEmailSentByClass] = useState({}); // { classId: true/false }

  // ⭐ Load email-sent status on app open AND CHECK IF IT'S EXPIRED (1 day old)
  // — Modified to be per-user (user.uid) so new users don't inherit other users' flags.
  useEffect(() => {
      const loadEmailStatus = async () => {
          try {
              if (!student?.uid) return; // wait until we have the current user's uid

              const allKeys = await AsyncStorage.getAllKeys();
              const prefix = `excuse_email_sent_${student.uid}_`;
              const emailKeys = allKeys.filter((k) => k.startsWith(prefix));

              const statuses = {};

              for (const key of emailKeys) {
                  const savedTime = await AsyncStorage.getItem(key);

                  // if corrupted or missing, remove it
                  if (!savedTime || isNaN(parseInt(savedTime, 10))) {
                      await AsyncStorage.removeItem(key);
                      continue;
                  }

                  const sentTime = parseInt(savedTime, 10);
                  const now = Date.now();
                  const oneDayMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

                  if (now - sentTime < oneDayMs) {
                      // key format: excuse_email_sent_<uid>_<classId>
                      const classId = key.replace(prefix, "");
                      statuses[classId] = true;
                  } else {
                      // Expired — remove it
                      await AsyncStorage.removeItem(key);
                  }
              }

              setEmailSentByClass(statuses);
          } catch (e) {
              console.log("Error loading email sent status", e);
          }
      };

      loadEmailStatus();
  }, [student?.uid]);



  // ======== SET DATE ========
  useEffect(() => {
      const formatted = new Date().toISOString().split("T")[0];
      setToday(formatted);
  }, []);



  // ======== SET STUDENT AND LOAD CLASSES ========
  useEffect(() => {
      if (user) {
          setStudent({
              id: user.id || "",
              name: user.fullname || "",
              section: user.section || "",
              email: user.email || "",
              uid: user.uid,
          });

          // If the navigator passed a code or sessionId (link), try auto-join after student is set
          const incoming = routeInfo.params || {};
          const incomingCode = incoming.code || incoming.classCode || incoming.sessionCode;
          const incomingSessionId = incoming.sessionId || incoming.classId;

          // wait a tick so student state is applied then run join
          setTimeout(() => {
            if (incomingSessionId) joinById(incomingSessionId);
            else if (incomingCode) joinByCode(incomingCode);
          }, 300);

          loadJoinedClasses(user.uid);
      }
  }, [user]);



  // Load joined classes
  const loadJoinedClasses = async (uid) => {
      try {
          const sessionsRef = collection(db, "sessions");
          const sessionsSnapshot = await getDocs(sessionsRef);

          let classes = [];

          for (let session of sessionsSnapshot.docs) {
              const sessionId = session.id;

              const studentRef = doc(
                  db,
                  "sessions",
                  sessionId,
                  "students",
                  uid
              );
              const studentSnap = await getDoc(studentRef);

              if (studentSnap.exists()) {
                  const sessionData = session.data();

                  classes.push({
                      id: sessionId,
                      name: `${sessionData.subject} (${sessionData.block})`,
                      section: sessionData.block,
                      subject: sessionData.subject,
                      block: sessionData.block,
                      days: Array.isArray(sessionData.days)
                          ? sessionData.days.join(", ")
                          : sessionData.days,
                      startTime: sessionData.startTime,
                      endTime: sessionData.endTime,
                      code: sessionData.code,
                      sessions: [],
                  });
              }
          }

          setJoinedClasses(classes);

          if (classes.length > 0) {
              setActiveClassId(classes[0].id);
          }
      } catch (err) {
          console.log("Error loading joined classes:", err);
      }
  };



  const activeClass = joinedClasses.find((cls) => cls.id === activeClassId);



  // Auto create today's session
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
                  cls.sessions = [
                      todaySession,
                      ...(cls.sessions || []),
                  ];
              }
          }
          return cls;
      });

      setJoinedClasses(updated);
      setAttendance(null);
      setAttachedFile(null);
  }, [activeClassId, today]);



  // Join class
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
              Alert.alert("Not found", "No class found.");
              return;
          }

          const sessionDoc = result.docs[0];
          const sessionData = sessionDoc.data();
          const sessionId = sessionDoc.id;

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

          const alreadyJoined = joinedClasses.some(
              (c) => c.id === sessionId
          );
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
                          : sessionData.days,
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
      } finally {
          setLoading(false);
      }
  };



  // ATTENDANCE LOGIC (unchanged)
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

          const attendanceId = `${student.uid}_${today}`;

          await setDoc(
              doc(
                  db,
                  "sessions",
                  activeClass.id,
                  "attendance",
                  attendanceId
              ),
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

          Alert.alert("Success", `Attendance: ${status}`);
      } finally {
          setLoading(false);
      }
  };



  // --------------------------------------------------------------
  // ⭐⭐⭐ UPDATED: Attach File + Email (MailComposer + AsyncStorage)
  // --------------------------------------------------------------
  const handleAttachFile = async () => {
      if (!activeClass) {
          Alert.alert("No Class Selected", "Please select a class.");
          return;
      }

      if (!student.email) {
          Alert.alert("Error", "Your email is missing.");
          return;
      }

      try {
          // resolve teacher email
          let teacherEmail = "teacher@example.com";
          try {
              const sessionRef = doc(db, "sessions", activeClass.id);
              const sessionSnap = await getDoc(sessionRef);

              if (sessionSnap.exists()) {
                  const data = sessionSnap.data();
                  const teacherId = data.teacherId || data.teacherUid;

                  if (teacherId) {
                      const teacherRef = doc(db, "users", teacherId);
                      const teacherSnap = await getDoc(teacherRef);
                      if (teacherSnap.exists()) {
                          teacherEmail = teacherSnap.data().email || teacherEmail;
                      }
                  } else if (data.teacherEmail) {
                      teacherEmail = data.teacherEmail;
                  }
              }
          } catch (e) {}

          let subject = `Excuse Letter Submission - ${activeClass.subject}`;
          let body =
              `Good day,\n\n` +
              `I would like to submit my excuse letter for the following class:\n\n` +
              `Name: ${student.name}\n` +
              `Subject: ${activeClass.subject}\n` +
              `Block: ${activeClass.block}\n` +
              `Date: ${today}\n\n` +
              `Please see the attached file.\n\nThank you.`;

          const emailOptions = {
              recipients: [teacherEmail],
              subject,
              body,
          };

          const canSend = await MailComposer.isAvailableAsync();
          if (!canSend) {
              Alert.alert("Error", "No email app is available.");
              return;
          }

          await MailComposer.composeAsync(emailOptions);

          // ⭐ SAVE EMAIL SENT FLAG + TIMESTAMP PER USER + PER CLASS
          // key format: excuse_email_sent_<userUid>_<classId>
          const key = `excuse_email_sent_${student.uid}_${activeClass.id}`;
          await AsyncStorage.setItem(key, Date.now().toString());

          setEmailSentByClass((prev) => ({
              ...prev,
              [activeClass.id]: true,
          }));
      } catch (error) {
          Alert.alert("Error", "Failed to open email app.");
      }
  };



  // File upload (not touched)
  const handleSubmitExcuse = async () => {
      if (!activeClass) {
          Alert.alert("No Class Selected");
          return;
      }

      if (!attachedFile) {
          Alert.alert("No File", "Attach a file first.");
          return;
      }

      setSubmittingExcuse(true);

      try {
          const storage = getStorage();
          const fileName = `${student.uid}_${Date.now()}_${attachedFile.name}`;
          const storageRef = ref(storage, `excuseLetters/${fileName}`);

          const response = await fetch(attachedFile.uri);
          const blob = await response.blob();

          await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageRef);

          const excusesRef = collection(db, "excuseLetters");

          await addDoc(excusesRef, {
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
              fileUrl: downloadUrl,
              reason: "",
              status: "Pending",
              submittedAt: serverTimestamp(),
          });

          Alert.alert("Success", "Excuse submitted.");
          setAttachedFile(null);
      } finally {
          setSubmittingExcuse(false);
      }
  };



  // ⭐ NEW: Leave/Delete class
  const handleLeaveClass = async (classId) => {
      Alert.alert(
          "Leave Class?",
          "Are you sure you want to leave this class? This action cannot be undone.",
          [
              {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
              },
              {
                  text: "Leave",
                  onPress: async () => {
                      try {
                          setLoading(true);

                          // Delete student from session/students subcollection
                          const studentRef = doc(
                              db,
                              "sessions",
                              classId,
                              "students",
                              student.uid
                          );

                          await deleteDoc(studentRef);

                          // Remove from local state
                          const updated = joinedClasses.filter(
                              (cls) => cls.id !== classId
                          );
                          setJoinedClasses(updated);

                          // If this was the active class, select another one
                          if (activeClassId === classId) {
                              if (updated.length > 0) {
                                  setActiveClassId(updated[0].id);
                              } else {
                                  setActiveClassId(null);
                              }
                          }

                          Alert.alert("Left Class", "You have successfully left the class.");
                      } catch (err) {
                          console.error("Error leaving class:", err);
                          Alert.alert("Error", "Failed to leave class.");
                      } finally {
                          setLoading(false);
                      }
                  },
                  style: "destructive",
              },
          ]
      );
  };

  const qrData = JSON.stringify({
      studentId: student.uid,
      studentName: student.name,
      section: activeClass ? activeClass.section : student.section,
      sessionId: activeClass?.sessions?.[0]?.id || null,
      classId: activeClass?.id || null,
  });



  // ================= UI ====================
  return (
      <View style={styles.mainContainer}>
          <DashboardHeader
              studentName={student.name}
              insets={insets}
              onJoinPress={() => setJoinModalVisible(true)}
              showJoinButton={joinedClasses.length > 0}
          />

          <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: 30 }]}>
              
              {/* NO CLASSES */}
              {joinedClasses.length === 0 && (
                  <View style={styles.emptyContainer}>
                      <Text style={styles.emptyTitle}>No classes joined yet</Text>
                      <Text style={styles.emptySubtitle}>
                          Start by joining a class to track attendance
                      </Text>
                      <TouchableOpacity
                          style={styles.joinClassButton}
                          onPress={() => setJoinModalVisible(true)}
                      >
                          <Text style={styles.joinClassButtonText}>Join a Class</Text>
                      </TouchableOpacity>
                  </View>
              )}



              {/* CLASS LIST */}
              {joinedClasses.map((cls) => {
                  const isActive = cls.id === activeClassId;
                  return (
                      <View
                          key={cls.id}
                          style={[
                              styles.classCard,
                              isActive ? styles.activeClassCard : null,
                          ]}
                      >
                          <View
                              style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                              }}
                          >
                              <View>
                                  <Text style={styles.className}>{cls.name}</Text>
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
                                  {/* QR CODE */}
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

                                  {/* ATTACH EXCUSE BTN */}
                                  <TouchableOpacity
                                      style={[
                                          styles.joinClassButton,
                                          {
                                              marginTop: 15,
                                              backgroundColor: emailSentByClass[cls.id]
                                                  ? "#0bd036ff"
                                                  : "#93520dff",
                                          },
                                      ]}
                                      onPress={handleAttachFile}
                                      disabled={emailSentByClass[cls.id]}
                                  >
                                      <Text style={styles.joinClassButtonText}>
                                          {emailSentByClass[cls.id] ? "Email Sent" : "Attach Excuse Letter"}
                                      </Text>
                                  </TouchableOpacity>

                                  {/* ⭐ NEW: LEAVE CLASS BTN */}
                                  <TouchableOpacity
                                      style={[
                                          styles.joinClassButton,
                                          {
                                              marginTop: 10,
                                              backgroundColor: "#EF4444",
                                          },
                                      ]}
                                      onPress={() => handleLeaveClass(cls.id)}
                                  >
                                      <Text style={styles.joinClassButtonText}>
                                          Leave Class
                                      </Text>
                                  </TouchableOpacity>
                              </>
                          )}
                      </View>
                  );
              })}



              {/* JOIN CLASS MODAL */}
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



// ---------------- NAVIGATION ----------------
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
    activeClassCard: {
        borderColor: "#2563EB",
        borderWidth: 2,
    },

    className: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E3A8A",
    },

    selectButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    selectButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },

    centeredModal: { justifyContent: "center", alignItems: "center" },

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

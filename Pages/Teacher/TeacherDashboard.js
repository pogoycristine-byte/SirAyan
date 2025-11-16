import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";

// Firebase imports
import { collection, addDoc, query, where, getDocs, Timestamp, deleteDoc, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../src/config/firebase";

// local screens
import StudentsList from "./Report";
import More from "./More";
import Subjects from "./Subjects";
import ManageStudents from "./ManageStudents";
import { getQRCodeByCode } from "../../src/services/database";

const Notifications = StudentsList;
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const { width } = Dimensions.get("window");

// TIME PICKER COMPONENT
function TimePickerScroll({ value, onTimeChange, onClose }) {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  const currentHour = value.getHours().toString().padStart(2, "0");
  const currentMinute = value.getMinutes().toString().padStart(2, "0");

  const handleHourScroll = (hour) => {
    const newDate = new Date(value);
    newDate.setHours(parseInt(hour));
    onTimeChange(newDate);
  };

  const handleMinuteScroll = (minute) => {
    const newDate = new Date(value);
    newDate.setMinutes(parseInt(minute));
    onTimeChange(newDate);
  };

  return (
    <View style={styles.timePickerModal}>
      <View style={styles.timePickerHeader}>
        <Text style={styles.timePickerTitle}>Set Time</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.timePickerClose}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timePickerContainer}>
        <ScrollView
          ref={hourRef}
          style={styles.timeColumn}
          snapToInterval={50}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ height: 100 }} />
          {hours.map((hour) => (
            <TouchableOpacity
              key={hour}
              onPress={() => handleHourScroll(hour)}
              style={[styles.timeItem, hour === currentHour && styles.timeItemActive]}
            >
              <Text style={[styles.timeItemText, hour === currentHour && styles.timeItemTextActive]}>
                {hour}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>

        <Text style={styles.timeSeparator}>:</Text>

        <ScrollView
          ref={minuteRef}
          style={styles.timeColumn}
          snapToInterval={50}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ height: 100 }} />
          {minutes.map((minute) => (
            <TouchableOpacity
              key={minute}
              onPress={() => handleMinuteScroll(minute)}
              style={[styles.timeItem, minute === currentMinute && styles.timeItemActive]}
            >
              <Text
                style={[
                  styles.timeItemText,
                  minute === currentMinute && styles.timeItemTextActive,
                ]}
              >
                {minute}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </View>
  );
}

function DashboardMain() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const [teacher, setTeacher] = useState({ id: "", name: "Teacher", section: "" });
  const [today, setToday] = useState("");
  const [classes, setClasses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Session fields
  const [sessionSubject, setSessionSubject] = useState("");
  const [sessionBlock, setSessionBlock] = useState("");
  const [sessionDays, setSessionDays] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000));
  // teacher will enter time manually as text
  const [startTimeStr, setStartTimeStr] = useState(
    startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [endTimeStr, setEndTimeStr] = useState(
    endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  // manual time input (no time picker toggles)

  // Camera scanner states
  const [cameraVisible, setCameraVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem("currentUser");
        if (currentUser) {
          const user = JSON.parse(currentUser);
          setTeacher({
            id: user.uid,
            name: user.fullname,
            section: user.section,
          });
          
          // Load sessions from Firebase
          await loadSessions(user.uid);
        }
      } catch (error) {
        console.error("Error loading teacher data:", error);
      }
    };
    loadTeacherData();

    const now = new Date();
    setToday(
      now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );

    if (!permission) requestPermission();
  }, [permission]);

  // Load sessions from Firebase
  const loadSessions = async (teacherId) => {
    try {
      setLoadingClasses(true);
      const q = query(collection(db, "sessions"), where("teacherId", "==", teacherId));
      const querySnapshot = await getDocs(q);
      
      const sessionsList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessionsList.push({
          id: doc.id,
          name: `${data.subject} (${data.block})`,
          block: data.block,
          subject: data.subject,
          days: Array.isArray(data.days) ? data.days.join(", ") : data.days || "",
          startTime: data.startTime,
          endTime: data.endTime,
          code: data.code,
          teacherId: data.teacherId,
        });
      });
      
      setClasses(sessionsList);
    } catch (error) {
      console.error("Error loading sessions:", error);
      Alert.alert("Error", "Failed to load sessions");
    } finally {
      setLoadingClasses(false);
    }
  };

  const generateClassCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreateClass = async () => {
    if (!sessionSubject || !sessionBlock || sessionDays.length === 0 || !startTimeStr || !endTimeStr) {
      Alert.alert("Incomplete Fields", "Please fill in all session details.");
      return;
    }

    try {
      setLoading(true);

      // Save to Firebase
      const docRef = await addDoc(collection(db, "sessions"), {
        subject: sessionSubject,
        block: sessionBlock,
        days: sessionDays, // Array
        // store exactly what teacher typed
        startTime: startTimeStr,
        endTime: endTimeStr,
        code: generateClassCode(),
        teacherId: teacher.id,
        isActive: true,
        createdAt: Timestamp.now(),
      });

      const newClass = {
        id: docRef.id,
        name: `${sessionSubject} (${sessionBlock})`,
        block: sessionBlock,
        subject: sessionSubject,
        days: sessionDays.join(", "),
        startTime: startTimeStr,
        endTime: endTimeStr,
        code: generateClassCode(),
      };

      setClasses((prev) => [...prev, newClass]);
      
      // Reset form
      setSessionSubject("");
      setSessionBlock("");
      setSessionDays([]);
      setStartTime(new Date());
      setEndTime(new Date(Date.now() + 3600000));
      setStartTimeStr(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setEndTimeStr(new Date(Date.now() + 3600000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setModalVisible(false);

      Alert.alert("Success", "Session created successfully!");
    } catch (error) {
      console.error("Error creating session:", error);
      Alert.alert("Error", "Failed to create session: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day) => {
    if (sessionDays.includes(day))
      setSessionDays(sessionDays.filter((d) => d !== day));
    else setSessionDays([...sessionDays, day]);
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setLoading(true);
    try {
      // try parse student QR (student -> teacher scan)
      let payload = null;
      try { payload = JSON.parse(data); } catch (e) { payload = null; }

      if (payload && payload.studentId && payload.classId) {
        const studentId = String(payload.studentId);
        const sessionId = String(payload.classId);
        const studentName = payload.studentName || payload.studentName || "Student";

        // Use ISO format YYYY-MM-DD for consistency
        const date = new Date().toISOString().split("T")[0];

        const attendanceId = `${studentId}_${date.replace(/\s+/g, "_")}`;

        const attRef = doc(db, "sessions", sessionId, "attendance", attendanceId);
        const attSnap = await getDoc(attRef);
        if (attSnap.exists()) {
          Alert.alert("Info", `${studentName} already marked for ${date}.`);
        } else {
          await setDoc(attRef, {
            studentUid: studentId,
            studentName,
            classId: sessionId,
            status: "Present",
            date,
            markedBy: teacher.id || null,
            createdAt: serverTimestamp(),
          });
          Alert.alert("Success", `${studentName} marked Present for ${date}.`);
        }

        setCameraVisible(false);
        return;
      }

      // fallback: treat scanned data as teacher-generated QR code string
      const qrCode = await getQRCodeByCode(data);
      if (qrCode) {
        Alert.alert("Success", `QR Code scanned for class: ${qrCode.classId || qrCode.code}`);
        setCameraVisible(false);
        return;
      }

      Alert.alert("Invalid QR Code", "This QR code is not recognized.");
    } catch (error) {
      Alert.alert("Error", "Failed to process QR code: " + (error.message || error));
      console.error("QR Scan error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId, className) => {
    Alert.alert(
      "Delete Class",
      `Are you sure you want to delete "${className}"? This action cannot be undone.`,
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setLoading(true);
              // Delete from Firebase
              await deleteDoc(doc(db, "sessions", classId));
              
              // Remove from local state
              setClasses((prev) => prev.filter((c) => c.id !== classId));
              
              Alert.alert("Success", "Class deleted successfully!");
            } catch (error) {
              console.error("Error deleting class:", error);
              Alert.alert("Error", "Failed to delete class: " + error.message);
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderClassCard = ({ item }) => (
    <View style={styles.classCardUnique}>
      {/* Delete Icon - Upper Right Corner */}
      <TouchableOpacity
        style={styles.deleteIconContainer}
        onPress={() => handleDeleteClass(item.id, item.name)}
        disabled={loading}
      >
        <Ionicons name="trash" size={20} color="#EF4444" />
      </TouchableOpacity>

      <Text style={styles.classTitleUnique}>{item.name}</Text>
      <Text style={styles.classDetailsUnique}>
        {item.subject} - Block {item.block}
      </Text>
      <Text style={styles.classDetailsUnique}>Days: {item.days}</Text>
      <Text style={styles.classDetailsUnique}>
        Time: {item.startTime} - {item.endTime}
      </Text>
      <Text style={styles.classCodeUnique}>Class Code: {item.code}</Text>

      <TouchableOpacity
        style={styles.manageBtnUnique}
        onPress={() =>
          navigation.navigate("ManageStudentsScreen", { classInfo: item })
        }
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Manage Students
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.manageBtnUnique,
          { backgroundColor: "#2563EB", marginTop: 8 },
        ]}
        onPress={() => {
          setCameraVisible(true);
          setScanned(false);
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Scan QR Code</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaUnique}>
      <StatusBar backgroundColor="#F0F4FF" barStyle="dark-content" />

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: insets.top - 15, paddingBottom: 15 }}>
          <View style={styles.headerUnique}>
            <View style={styles.headerLeftUnique}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                }}
                style={styles.profileImageUnique}
              />
              <View>
                <Text style={styles.headerTextUnique}>Welcome back,</Text>
                <Text style={styles.teacherNameUnique}>{teacher.name}</Text>
                <Text style={styles.departmentTextUnique}>
                  Department: {teacher.section}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionButtonsUnique}>
          <TouchableOpacity
            style={[
              styles.actionCardUnique,
              { backgroundColor: "#2563EB", paddingVertical: 25, minHeight: 120 },
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="play-circle-outline" size={38} color="#fff" />
            <Text style={styles.actionTextUnique}>Start New Session</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardUnique}>
          <Text style={styles.dateTextUnique}>{today}</Text>
          <Text style={styles.attendanceTitleUnique}>Your Classes</Text>

          {loadingClasses ? (
            <Text style={{ textAlign: "center", color: "#777", marginTop: 15 }}>
              Loading sessions...
            </Text>
          ) : classes.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#777", marginTop: 15 }}>
              No classes created yet.
            </Text>
          ) : (
            <FlatList
              data={classes}
              renderItem={renderClassCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={{ marginTop: 10 }}
            />
          )}
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", paddingHorizontal: 20 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
            >
              <ScrollView
                contentContainerStyle={{ paddingVertical: 10 }}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={true}
                nestedScrollEnabled={true}
              >
                <View style={styles.modalContentUnique}>
                  <Text style={styles.modalTitleUnique}>Create New Session</Text>

                  <TextInput
                    style={styles.inputUnique}
                    placeholder="Subject"
                    value={sessionSubject}
                    onChangeText={setSessionSubject}
                  />
                  <TextInput
                    style={styles.inputUnique}
                    placeholder="Block"
                    value={sessionBlock}
                    onChangeText={setSessionBlock}
                  />

                  <Text style={{ marginVertical: 8, fontWeight: "600" }}>
                    Select Days:
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {daysOfWeek.map((day) => (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleDay(day)}
                        style={{
                          padding: 8,
                          margin: 4,
                          borderRadius: 6,
                          borderWidth: 1,
                          borderColor: sessionDays.includes(day)
                            ? "#2563EB"
                            : "#CBD5E1",
                          backgroundColor: sessionDays.includes(day)
                            ? "#2563EB"
                            : "#F8FAFC",
                        }}
                      >
                        <Text
                          style={{
                            color: sessionDays.includes(day) ? "#fff" : "#000",
                          }}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={{ marginVertical: 8, fontWeight: "600" }}>
                    Start Time (e.g. 09:00 AM):
                  </Text>
                  <TextInput
                    style={styles.inputUnique}
                    placeholder="Start time (e.g. 09:00 AM)"
                    value={startTimeStr}
                    onChangeText={setStartTimeStr}
                  />

                  <Text style={{ marginVertical: 8, fontWeight: "600" }}>
                    End Time (e.g. 10:00 AM):
                  </Text>
                  <TextInput
                    style={styles.inputUnique}
                    placeholder="End time (e.g. 10:00 AM)"
                    value={endTimeStr}
                    onChangeText={setEndTimeStr}
                  />

                  <TouchableOpacity
                    style={styles.createButtonUnique}
                    onPress={handleCreateClass}
                    disabled={loading}
                  >
                    <Text style={styles.createButtonTextUnique}>
                      {loading ? "Creating..." : "Create Session"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{ marginTop: 10, paddingVertical: 8 }}
                  >
                    <Text style={{ color: "#EF4444", fontWeight: "600", textAlign: "center" }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </ScrollView>

      {cameraVisible && permission?.granted && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFill}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanText}>Align QR Code</Text>

            {scanned && !loading && (
              <TouchableOpacity
                style={styles.rescanButton}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.rescanButtonText}>Tap to Rescan</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.rescanButton,
                { bottom: 80, backgroundColor: "#F87171" },
              ]}
              onPress={() => setCameraVisible(false)}
            >
              <Text style={styles.rescanButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// Stack for Teacher Screens
function TeacherStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMainScreen" component={DashboardMain} />
      <Stack.Screen name="ManageStudentsScreen" component={ManageStudents} />
    </Stack.Navigator>
  );
}

export default function TeacherDashboard() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#808080",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 65 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
        },
        tabBarIcon: ({ color, focused }) => {
          const icons = {
            DashboardTab: (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
            SubjectsTab: (
              <Ionicons
                name={focused ? "book" : "book-outline"}
                size={24}
                color={color}
              />
            ),
            Reports: (
              <MaterialIcons name="assessment" size={24} color={color} />
            ),
            More: <Feather name="menu" size={24} color={color} />,
          };
          return icons[route.name] || null;
        },
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={TeacherStack}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="SubjectsTab"
        component={Subjects}
        options={{ title: "Subjects" }}
      />
      <Tab.Screen
        name="Reports"
        component={Notifications}
        options={{ title: "Reports" }}
      />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  safeAreaUnique: { flex: 1, backgroundColor: "#F0F4FF" },
  headerUnique: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeftUnique: { flexDirection: "row", alignItems: "center" },
  headerTextUnique: { fontSize: 12, lineHeight: 14 },
  teacherNameUnique: { fontSize: 16, fontWeight: "bold", lineHeight: 18 },
  departmentTextUnique: { fontSize: 11, lineHeight: 12 },
  actionButtonsUnique: { flexDirection: "row", justifyContent: "space-around", marginTop: 15, marginHorizontal: 15 },
  actionCardUnique: { flex: 1, marginHorizontal: 5, paddingVertical: 18, borderRadius: 15, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3, minHeight: 100, justifyContent: "center" },
  actionTextUnique: { color: "#fff", fontWeight: "600", fontSize: 14, marginTop: 6, textAlign: "center" },
  cardUnique: { backgroundColor: "#fff", borderRadius: 18, margin: 20, padding: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  dateTextUnique: { fontSize: 14, color: "#333", textAlign: "right" },
  attendanceTitleUnique: { marginTop: 10, fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 10 },
  classCardUnique: { backgroundColor: "#F9FAFB", padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  classTitleUnique: { fontSize: 16, fontWeight: "700", color: "#1E3A8A" },
  classDetailsUnique: { fontSize: 14, color: "#555", marginVertical: 2 },
  classCodeUnique: { fontSize: 13, color: "#2563EB", marginBottom: 8 },
  manageBtnUnique: { backgroundColor: "#10B981", paddingVertical: 8, borderRadius: 8, alignItems: "center" },
  inputUnique: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 10, padding: 10, marginVertical: 5, backgroundColor: "#F8FAFC" },
  createButtonUnique: { backgroundColor: "#2563EB", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 5 },
  createButtonTextUnique: { color: "#fff", fontWeight: "bold" },
  centeredModalUnique: { justifyContent: "center", alignItems: "center", paddingHorizontal: 0 },
  modalContentUnique: { width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 20, alignItems: "stretch", maxHeight: "100%" },
  modalTitleUnique: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#1E3A8A", textAlign: "center" },
  cameraContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, backgroundColor: "#000" },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" },
  scanFrame: { width: 250, height: 250, borderWidth: 3, borderColor: "#2563EB", borderRadius: 10, backgroundColor: "transparent" },
  scanText: { color: "#fff", fontSize: 16, marginTop: 20, fontWeight: "600" },
  rescanButton: { position: "absolute", bottom: 30, backgroundColor: "#2563EB", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  rescanButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  timePickerModal: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", width: width * 0.85 },
  timePickerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, backgroundColor: "#F0F4FF", borderBottomWidth: 1, borderBottomColor: "#E0E7FF" },
  timePickerTitle: { fontSize: 16, fontWeight: "700", color: "#1E3A8A" },
  timePickerClose: { fontSize: 14, fontWeight: "600", color: "#2563EB" },
  timePickerContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", height: 250, paddingVertical: 10 },
  timeColumn: { width: 60, height: 200 },
  timeItem: { height: 50, justifyContent: "center", alignItems: "center" },
  timeItemActive: { backgroundColor: "#E0E7FF", borderRadius: 8 },
  timeItemText: { fontSize: 18, color: "#94A3B8", fontWeight: "500" },
  timeItemTextActive: { fontSize: 20, color: "#2563EB", fontWeight: "700" },
  timeSeparator: { fontSize: 24, fontWeight: "700", color: "#1E3A8A", marginHorizontal: 10 },
  deleteIconContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#FEE2E2",
  },
});

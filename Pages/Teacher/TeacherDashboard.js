import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CameraView, useCameraPermissions } from "expo-camera";

// local screens

import StudentsList from "./Report";
import More from "./More";
import Subjects from "./Subjects";
import ManageStudents from "./ManageStudents";
import { getQRCodeByCode } from "../../src/services/database";

const Notifications = StudentsList;
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardMain() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [teacher, setTeacher] = useState({ id: "", name: "Teacher", section: "" });
  const [today, setToday] = useState("");
  const [classes, setClasses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Session fields
  const [sessionSubject, setSessionSubject] = useState("");
  const [sessionBlock, setSessionBlock] = useState("");
  const [sessionDays, setSessionDays] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

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
          setTeacher({ id: user.id, name: user.name, section: user.section });
        }
      } catch (error) {
        console.error("Error loading teacher data:", error);
      }
    };
    loadTeacherData();

    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setToday(formatted);

    if (!permission) requestPermission();
  }, [permission]);

  const generateClassCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreateClass = () => {
    if (!sessionSubject || !sessionBlock || sessionDays.length === 0) {
      Alert.alert("Incomplete Fields", "Please fill in all session details.");
      return;
    }
    const newClass = {
      id: Date.now().toString(),
      name: `${sessionSubject} (${sessionBlock})`,
      block: sessionBlock,
      subject: sessionSubject,
      days: sessionDays.join(", "),
      startTime: startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      endTime: endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      code: generateClassCode(),
    };
    setClasses((prev) => [...prev, newClass]);
    setSessionSubject("");
    setSessionBlock("");
    setSessionDays([]);
    setStartTime(new Date());
    setEndTime(new Date());
    setModalVisible(false);
  };

  const toggleDay = (day) => {
    if (sessionDays.includes(day)) setSessionDays(sessionDays.filter((d) => d !== day));
    else setSessionDays([...sessionDays, day]);
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setLoading(true);
    try {
      const qrCode = await getQRCodeByCode(data);
      if (qrCode) {
        Alert.alert("Success", `QR Code scanned for class: ${qrCode.classId}`);
        setCameraVisible(false); // <-- Auto close scanner
      } else {
        Alert.alert("Invalid QR Code", "This QR code is not recognized.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to scan QR code: " + error.message);
      console.error("QR Scan error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderClassCard = ({ item }) => (
    <View style={styles.classCardUnique}>
      <Text style={styles.classTitleUnique}>{item.name}</Text>
      <Text style={styles.classDetailsUnique}>{item.subject} - Block {item.block}</Text>
      <Text style={styles.classDetailsUnique}>Days: {item.days}</Text>
      <Text style={styles.classDetailsUnique}>Time: {item.startTime} - {item.endTime}</Text>
      <Text style={styles.classCodeUnique}>Class Code: {item.code}</Text>

      <TouchableOpacity
        style={styles.manageBtnUnique}
        onPress={() => navigation.navigate("ManageStudentsScreen", { classInfo: item })}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Manage Students</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.manageBtnUnique, { backgroundColor: "#2563EB", marginTop: 8 }]}
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
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: insets.top - 15, paddingBottom: 15 }}>
          <View style={styles.headerUnique}>
            <View style={styles.headerLeftUnique}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                style={styles.profileImageUnique}
              />
              <View style={{ justifyContent: "center" }}>
                <Text style={[styles.headerTextUnique, { color: "#333" }]}>Welcome back,</Text>
                <Text style={[styles.teacherNameUnique, { color: "#000" }]}>{teacher.name}</Text>
                <Text style={[styles.departmentTextUnique, { color: "#555" }]}>Department: {teacher.section}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsUnique}>
          <TouchableOpacity
            style={[styles.actionCardUnique, { backgroundColor: "#2563EB", paddingVertical: 25, minHeight: 120 }]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="play-circle-outline" size={38} color="#fff" />
            <Text style={styles.actionTextUnique}>Start New Session</Text>
          </TouchableOpacity>
        </View>

        {/* Classes */}
        <View style={styles.cardUnique}>
          <Text style={styles.dateTextUnique}>{today}</Text>
          <Text style={styles.attendanceTitleUnique}>Your Classes</Text>

          {classes.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#777", marginTop: 15 }}>No classes created yet.</Text>
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

        {/* Modal */}
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          backdropOpacity={0.5}
          animationIn="zoomIn"
          animationOut="zoomOut"
          style={styles.centeredModalUnique}
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

            <Text style={{ marginVertical: 8, fontWeight: "600" }}>Select Days:</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={{
                    padding: 8,
                    margin: 4,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: sessionDays.includes(day) ? "#2563EB" : "#CBD5E1",
                    backgroundColor: sessionDays.includes(day) ? "#2563EB" : "#F8FAFC",
                  }}
                >
                  <Text style={{ color: sessionDays.includes(day) ? "#fff" : "#000" }}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ marginVertical: 8, fontWeight: "600" }}>Start Time:</Text>
            <TouchableOpacity style={styles.inputUnique} onPress={() => setShowStartPicker(true)}>
              <Text>{startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowStartPicker(Platform.OS === "ios");
                  if (selectedDate) setStartTime(selectedDate);
                }}
              />
            )}

            <Text style={{ marginVertical: 8, fontWeight: "600" }}>End Time:</Text>
            <TouchableOpacity style={styles.inputUnique} onPress={() => setShowEndPicker(true)}>
              <Text>{endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowEndPicker(Platform.OS === "ios");
                  if (selectedDate) setEndTime(selectedDate);
                }}
              />
            )}

            <TouchableOpacity style={styles.createButtonUnique} onPress={handleCreateClass}>
              <Text style={styles.createButtonTextUnique}>Create Session</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>

      {/* Camera Overlay */}
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
              <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
                <Text style={styles.rescanButtonText}>Tap to Rescan</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.rescanButton, { bottom: 80, backgroundColor: "#F87171" }]}
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

// Bottom Tabs
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
            DashboardTab: <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />,
            SubjectsTab: <Ionicons name={focused ? "book" : "book-outline"} size={24} color={color} />,
            Reports: <MaterialIcons name="assessment" size={24} color={color} />,
            More: <Feather name="menu" size={24} color={color} />,
          };
          return icons[route.name] || null;
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={TeacherStack} options={{ title: "Home" }} />
      <Tab.Screen name="SubjectsTab" component={Subjects} options={{ title: "Subjects" }} />
      <Tab.Screen name="Reports" component={Notifications} options={{ title: "Reports" }} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  safeAreaUnique: { flex: 1, backgroundColor: "#F0F4FF" },
  headerUnique: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeftUnique: { flexDirection: "row", alignItems: "center" },
  profileImageUnique: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", marginRight: 10 },
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
  centeredModalUnique: { justifyContent: "center", alignItems: "center" },
  modalContentUnique: { width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 20, alignItems: "stretch" },
  modalTitleUnique: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#1E3A8A", textAlign: "center" },
  cameraContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, backgroundColor: "#000" },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" },
  scanFrame: { width: 250, height: 250, borderWidth: 3, borderColor: "#2563EB", borderRadius: 10, backgroundColor: "transparent" },
  scanText: { color: "#fff", fontSize: 16, marginTop: 20, fontWeight: "600" },
  rescanButton: { position: "absolute", bottom: 30, backgroundColor: "#2563EB", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  rescanButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

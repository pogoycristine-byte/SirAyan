import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import Notification from "./Notification";
import AttachLetter from "./AttachLetter";
import Log from "./Log";
import More from "./More";

const { width } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

function DashboardMain() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [student, setStudent] = useState({
    id: "12-000447",
    name: "Jubelle Franze C. Mabalatan",
    section: "BSIT-3 Block-01",
  });

  const [attendance, setAttendance] = useState(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setToday(formatted);
  }, []);

  const handleAttendance = async (status) => {
    setAttendance(status);
    try {
      await fetch("https://your-api-endpoint.com/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.id,
          date: new Date().toISOString().split("T")[0],
          status: status,
        }),
      });
      Alert.alert("Success", `Attendance marked as ${status}`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to mark attendance. Please try again.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Account" }],
            })
          );
        },
      },
    ]);
  };

  const qrData = JSON.stringify({
    id: student.id,
    name: student.name,
    section: student.section,
  });

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#1E3A8A" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
          <LinearGradient
            colors={["#2563EB", "#1E3A8A"]}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                  }}
                  style={styles.profileImage}
                />
                <View>
                  <Text style={styles.headerText}>Welcome back,</Text>
                  <Text style={styles.studentNameHeader}>{student.name}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/1828/1828490.png",
                  }}
                  style={styles.logoutIcon}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.qrSection}>
            <View style={styles.qrContainer}>
              <QRCode value={qrData} size={180} color="#2563EB" backgroundColor="white" />
            </View>
            <Text style={styles.qrLabel}>Scan this code for attendance</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.studentRow}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
                }}
                style={styles.studentImage}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentSection}>{student.section}</Text>
              </View>
              <Text style={styles.dateText}>{today}</Text>
            </View>

            <Text style={styles.attendanceTitle}>Today’s Attendance</Text>
            <Text style={styles.infoNote}>
              Your teacher will scan your QR code to mark attendance.
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.attendanceButton,
                  attendance === "Present" && styles.presentButton,
                ]}
                onPress={() => handleAttendance("Present")}
              >
                <Text
                  style={[
                    styles.buttonText,
                    attendance === "Present" && styles.presentText,
                  ]}
                >
                  PRESENT
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.attendanceButton,
                  attendance === "Absent" && styles.absentButton,
                ]}
                onPress={() => handleAttendance("Absent")}
              >
                <Text
                  style={[
                    styles.buttonText,
                    attendance === "Absent" && styles.absentText,
                  ]}
                >
                  ABSENT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const tabIcons = {
    DashboardMain: ({ focused, color }) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />,
    Notification: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
    AttachLetter: ({ color }) => <MaterialIcons name="attach-file" size={24} color={color} />,
    Log: ({ color }) => <Feather name="book" size={24} color={color} />,
    More: ({ color }) => <Feather name="menu" size={24} color={color} />,
  };

  return (
    <Tab.Navigator
      initialRouteName="DashboardMain"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#808080",
        tabBarStyle: { 
          backgroundColor: "#fff", 
          borderTopLeftRadius: 20, 
          borderTopRightRadius: 20, 
          height: 65 + insets.bottom, 
          paddingBottom: 10 + insets.bottom,
        },
        tabBarIcon: ({ color, focused }) => {
          const IconComponent = tabIcons[route.name];
          return IconComponent ? <IconComponent color={color} focused={focused} /> : null;
        },
      })}
    >
      <Tab.Screen name="DashboardMain" component={DashboardMain} options={{ title: "Home" }} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="AttachLetter" component={AttachLetter} />
      <Tab.Screen name="Log" component={Log} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F0F4FF" },
  safeArea: { flex: 1, backgroundColor: "#F0F4FF" },
  headerGradient: { paddingVertical: 15, paddingHorizontal: 20, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, elevation: 5 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileImage: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#fff" },
  headerText: { color: "#DCE7FF", fontSize: 13 },
  studentNameHeader: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  logoutButton: { backgroundColor: "#FFFFFF20", padding: 8, borderRadius: 12 },
  logoutIcon: { width: 22, height: 22, tintColor: "white" },
  qrSection: { alignItems: "center", marginTop: 30 },
  qrContainer: { backgroundColor: "white", padding: 25, borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4 },
  qrLabel: { marginTop: 12, fontSize: 14, fontWeight: "600", color: "#1E3A8A" },
  card: { backgroundColor: "#fff", borderRadius: 18, margin: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  studentRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  studentImage: { width: 45, height: 45, borderRadius: 22 },
  studentName: { fontWeight: "bold", fontSize: 16, color: "#1E3A8A" },
  studentSection: { color: "#64748B", fontSize: 13 },
  dateText: { color: "#64748B", fontSize: 12 },
  attendanceTitle: { textAlign: "center", fontSize: 18, fontWeight: "bold", color: "#1E3A8A", marginVertical: 10 },
  infoNote: { textAlign: "center", color: "#64748B", fontSize: 12, marginBottom: 15 },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 5 },
  attendanceButton: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8, backgroundColor: "#E2E8F0" },
  presentButton: { backgroundColor: "#BFDBFE", borderWidth: 1, borderColor: "#2563EB" },
  absentButton: { backgroundColor: "#FEE2E2", borderWidth: 1, borderColor: "#EF4444" },
  buttonText: { fontWeight: "bold", color: "#1E3A8A" },
  presentText: { color: "#1E3A8A" },
  absentText: { color: "#B91C1C" },
});

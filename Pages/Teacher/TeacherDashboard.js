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
  FlatList,
} from "react-native";
import { useNavigation, CommonActions, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

import ScanQR from "./ScanQR";
import StudentsList from "./StudentsList";
import Reports from "./Reports";
import More from "./More";

const Tab = createBottomTabNavigator();

function DashboardMain() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [teacher, setTeacher] = useState({
    id: "TCH-001",
    name: "Prof. Maria Gonzales",
    department: "Computer Science Department",
  });

  const [today, setToday] = useState("");
  const [summary, setSummary] = useState({ present: 0, absent: 0, excused: 0 });
  const [recentAttendance, setRecentAttendance] = useState([]);

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
    setSummary({ present: 22, absent: 3, excused: 1 });
    setRecentAttendance([
      { id: "42-123456", name: "Alexandra Smith", status: "Present" },
      { id: "42-654321", name: "John Doe", status: "Absent" },
      { id: "42-789012", name: "Sarah Lee", status: "Excused" },
    ]);
  }, []);

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

  const renderStudent = ({ item }) => (
    <View style={styles.studentCard}>
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png" }}
        style={styles.studentImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentId}>{item.id}</Text>
      </View>
      <Text
        style={[
          styles.statusText,
          {
            color:
              item.status === "Present"
                ? "#22c55e"
                : item.status === "Excused"
                ? "#facc15"
                : "#ef4444",
          },
        ]}
      >
        {item.status}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1E3A8A" barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <LinearGradient colors={["#2563EB", "#1E3A8A"]} style={styles.headerGradient}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.headerText}>Welcome back,</Text>
                <Text style={styles.teacherName}>{teacher.name}</Text>
                <Text style={styles.departmentText}>{teacher.department}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/1828/1828490.png" }}
                style={styles.logoutIcon}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

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

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#2563EB" }]}
            onPress={() => navigation.navigate("ScanQR")}
          >
            <Ionicons name="qr-code" size={32} color="#fff" />
            <Text style={styles.actionText}>Scan Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#facc15" }]}
            onPress={() => navigation.navigate("ReviewLetters")}
          >
            <Ionicons name="description" size={32} color="#fff" />
            <Text style={styles.actionText}>Review Letters</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#22c55e" }]}
            onPress={() => navigation.navigate("Reports")}
          >
            <Ionicons name="bar-chart" size={32} color="#fff" />
            <Text style={styles.actionText}>View Reports</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.dateText}>{today}</Text>
          <Text style={styles.attendanceTitle}>Recent Attendance</Text>

          <FlatList
            data={recentAttendance}
            renderItem={renderStudent}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function TeacherDashboard() {
  const insets = useSafeAreaInsets();

  const tabIcons = {
    DashboardMain: ({ focused, color }) => (
      <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
    ),
    ScanQR: ({ color }) => <Ionicons name="qr-code" size={24} color={color} />,
    ReviewLetters: ({ color }) => <MaterialIcons name="description" size={24} color={color} />,
    Reports: ({ color }) => <Feather name="bar-chart-2" size={24} color={color} />,
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
      <Tab.Screen name="ScanQR" component={ScanQR} />
      <Tab.Screen name="ReviewLetters" component={StudentsList} options={{ title: "Review Letters" }} />
      <Tab.Screen name="Reports" component={Reports} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F4FF" },
  headerGradient: { paddingVertical: 15, paddingHorizontal: 20, elevation: 5 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileImage: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#fff" },
  headerText: { color: "#DCE7FF", fontSize: 13 },
  teacherName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  departmentText: { color: "#DCE7FF", fontSize: 12 },
  logoutButton: { backgroundColor: "#FFFFFF20", padding: 8, borderRadius: 12 },
  logoutIcon: { width: 22, height: 22, tintColor: "white" },
  summaryContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  summaryCard: { width: "28%", padding: 15, borderRadius: 15, alignItems: "center" },
  summaryNumber: { fontSize: 20, fontWeight: "bold", color: "#1E3A8A", marginTop: 4 },
  summaryLabel: { fontSize: 14, color: "#1E3A8A" },
  actionButtons: { flexDirection: "row", justifyContent: "space-around", marginTop: 20, marginHorizontal: 10 },
  actionCard: { flex: 1, marginHorizontal: 5, paddingVertical: 15, borderRadius: 15, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  actionText: { color: "#fff", fontWeight: "600", fontSize: 13, marginTop: 5, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 18, margin: 20, padding: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  dateText: { fontSize: 14, color: "#333", textAlign: "right" },
  attendanceTitle: { marginTop: 10, fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 10 },
  studentCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#F1F5FF", padding: 12, borderRadius: 10, marginVertical: 5 },
  studentImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  studentName: { fontSize: 16, fontWeight: "600", color: "#1E3A8A" },
  studentId: { fontSize: 13, color: "#555" },
  statusText: { fontSize: 15, fontWeight: "600" },
});

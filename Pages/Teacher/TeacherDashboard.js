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
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";

// local screens
import ScanQR from "./ScanQR";
import StudentsList from "./StudentsList";
import More from "./More";
import ManageStudents from "./ManageStudents";

const Notifications = StudentsList;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardMain() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [teacher, setTeacher] = useState({
    id: "",
    name: "Teacher",
    section: "",
  });

  const [today, setToday] = useState("");
  const [classes, setClasses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");

  // Load teacher data from AsyncStorage
  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem("currentUser");
        if (currentUser) {
          const user = JSON.parse(currentUser);
          setTeacher({
            id: user.id,
            name: user.name,
            section: user.section,
          });
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
  }, []);

  const generateClassCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreateClass = () => {
    if (!className || !section || !subject) {
      Alert.alert("Incomplete Fields", "Please fill in all class details.");
      return;
    }

    const newClass = {
      id: Date.now().toString(),
      name: className,
      section,
      subject,
      code: generateClassCode(),
    };

    setClasses((prev) => [...prev, newClass]);
    setClassName("");
    setSection("");
    setSubject("");
    setModalVisible(false);
  };

  const renderClassCard = ({ item }) => (
    <View style={styles.classCardUnique}>
      <Text style={styles.classTitleUnique}>{item.name}</Text>
      <Text style={styles.classDetailsUnique}>
        {item.subject} - Section {item.section}
      </Text>
      <Text style={styles.classCodeUnique}>Class Code: {item.code}</Text>

      <TouchableOpacity
        style={styles.manageBtnUnique}
        onPress={() => navigation.navigate("ManageStudents", { classInfo: item })}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Manage Students</Text>
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
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                }}
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
            <Text style={styles.modalTitleUnique}>Create New Class</Text>

            <TextInput
              style={styles.inputUnique}
              placeholder="Class Name"
              value={className}
              onChangeText={setClassName}
            />
            <TextInput
              style={styles.inputUnique}
              placeholder="Section"
              value={section}
              onChangeText={setSection}
            />
            <TextInput
              style={styles.inputUnique}
              placeholder="Subject"
              value={subject}
              onChangeText={setSubject}
            />
            <TouchableOpacity
              style={styles.createButtonUnique}
              onPress={handleCreateClass}
            >
              <Text style={styles.createButtonTextUnique}>Create Class</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

// Stack for Teacher Screens
function TeacherStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardMain} />
      <Stack.Screen name="ManageStudents" component={ManageStudents} />
    </Stack.Navigator>
  );
}

// Bottom Tabs
export default function TeacherDashboard() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="DashboardMain"
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
            DashboardMain: <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />,
            ScanQR: <Ionicons name="qr-code" size={24} color={color} />,
            Notifications: <MaterialIcons name="notifications" size={24} color={color} />,
            More: <Feather name="menu" size={24} color={color} />,
          };
          return icons[route.name] || null;
        },
      })}
    >
      <Tab.Screen name="DashboardMain" component={TeacherStack} options={{ title: "Home" }} />
      <Tab.Screen name="ScanQR" component={ScanQR} />
      <Tab.Screen name="Notifications" component={Notifications} options={{ title: "Notifications" }} />
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
  actionCardUnique: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 100,
    justifyContent: "center",
  },
  actionTextUnique: { color: "#fff", fontWeight: "600", fontSize: 14, marginTop: 6, textAlign: "center" },
  cardUnique: {
    backgroundColor: "#fff",
    borderRadius: 18,
    margin: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dateTextUnique: { fontSize: 14, color: "#333", textAlign: "right" },
  attendanceTitleUnique: { marginTop: 10, fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 10 },
  classCardUnique: {
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  classTitleUnique: { fontSize: 16, fontWeight: "700", color: "#1E3A8A" },
  classDetailsUnique: { fontSize: 14, color: "#555", marginVertical: 4 },
  classCodeUnique: { fontSize: 13, color: "#2563EB", marginBottom: 8 },
  manageBtnUnique: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  inputUnique: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#F8FAFC",
  },
  createButtonUnique: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  createButtonTextUnique: { color: "#fff", fontWeight: "bold" },
  centeredModalUnique: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentUnique: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "stretch",
  },
  modalTitleUnique: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#1E3A8A", textAlign: "center" },
});

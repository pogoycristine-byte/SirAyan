
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

// Import Pages
import Splash from "./Pages/Home/Splash";
import Account from "./Pages/Account/Account";
// Student Pages
import Dashboard from "./Pages/Student/Dashboard";
import Notification from "./Pages/Student/Notification";
import AttachLetter from "./Pages/Student/AttachLetter";
import Log from "./Pages/Student/Log";
import More from "./Pages/Student/More";

// Teacher Pages
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import TeacherExcuses from "./Pages/Teacher/Excuses";
import TeacherRecords from "./Pages/Teacher/Records";
import TeacherNotifications from "./Pages/Teacher/Notification";
import TeacherMore from "./Pages/Teacher/More";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// Student Bottom Tabs
function StudentTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#808080",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 65,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, focused }) => {
          if (route.name === "Dashboard") {
            return <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />;
          } else if (route.name === "Notification") {
            return <Ionicons name={focused ? "notifications" : "notifications-outline"} size={24} color={color} />;
          } else if (route.name === "AttachLetter") {
            return <MaterialIcons name="attach-file" size={24} color={color} />;
          } else if (route.name === "Log") {
            return <Feather name="book" size={24} color={color} />;
          } else if (route.name === "More") {
            return <Feather name="menu" size={24} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: "Home" }} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="AttachLetter" component={AttachLetter} options={{ title: "Attach" }} />
      <Tab.Screen name="Log" component={Log} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}


// Teacher Bottom Tabs
function TeacherTabs() {
  return (
    <Tab.Navigator
      initialRouteName="TeacherDashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#808080",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 65,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, focused }) => {
          if (route.name === "TeacherDashboard") {
            return <MaterialIcons name="insert-drive-file" size={24} color={color} />;
          } else if (route.name === "TeacherExcuses") {
            return <MaterialIcons name="insert-drive-file" size={24} color={color} />;
          } else if (route.name === "TeacherRecords") {
            return <Feather name="book" size={24} color={color} />;
          } else if (route.name === "TeacherNotifications") {
            return <Ionicons name={focused ? "notifications" : "notifications-outline"} size={24} color={color} />;
          } else if (route.name === "TeacherMore") {
            return <Feather name="menu" size={24} color={color} />;
          }
        },
      })}
    >
     <Tab.Screen name="TeacherDashboard" component={TeacherDashboard} options={{ title: "Dashboard" }} />
      <Tab.Screen name="TeacherExcuses" component={TeacherExcuses} options={{ title: "Excuses" }} />
      <Tab.Screen name="TeacherRecords" component={TeacherRecords} options={{ title: "Records" }} />
      <Tab.Screen name="TeacherNotifications" component={TeacherNotifications} options={{ title: "Notification" }} />
      <Tab.Screen name="TeacherMore" component={TeacherMore} options={{ title: "More" }} />
    </Tab.Navigator>
  );
}


// Main Navigation Stack
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        {/* Startup Page */}
        <Stack.Screen name="Splash" component={Splash} />

        {/* Login / Account */}
        <Stack.Screen name="Account" component={Account} />

        {/* Student Dashboard */}
        <Stack.Screen name="StudentDashboard" component={StudentTabs} />

        {/* Teacher Dashboard */}
        <Stack.Screen name="TeacherDashboard" component={TeacherTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

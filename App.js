import * as React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

import Account from "./Pages/Account/Account";
import Dashboard from "./Pages/Student/Dashboard";
import Notification from "./Pages/Student/Notification";
import AttachLetter from "./Pages/Student/AttachLetter";
import Log from "./Pages/Student/Log";
import More from "./Pages/Student/More";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StudentTabs({ route }) {
  const studentId = route.params?.studentId;
  const insets = useSafeAreaInsets();

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
          height: 65 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
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
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: "Home" }} initialParams={{ studentId }} />
      <Tab.Screen name="Notification" component={Notification} initialParams={{ studentId }} />
      <Tab.Screen name="AttachLetter">
        {props => <AttachLetter {...props} studentId={studentId} />}
      </Tab.Screen>
      <Tab.Screen name="Log" component={Log} initialParams={{ studentId }} />
      <Tab.Screen name="More" component={More} initialParams={{ studentId }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Account" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="StudentDashboard" component={StudentTabs} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

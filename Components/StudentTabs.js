// StudentTabs.js
import React from "react";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Student Pages
import Dashboard from "../Pages/Student/Dashboard";
import Notification from "../Pages/Student/Notification";
import AttachLetter from "../Pages/Student/AttachLetter";
import Log from "../Pages/Student/Log";
import More from "../Pages/Student/More";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Student Bottom Tabs
export default function StudentTabs() {
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
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            );
          } else if (route.name === "Notification") {
            return (
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={24}
                color={color}
              />
            );
          } else if (route.name === "AttachLetter") {
            return (
              <MaterialIcons name="attach-file" size={24} color={color} />
            );
          } else if (route.name === "Log") {
            return <Feather name="book" size={24} color={color} />;
          } else if (route.name === "More") {
            return <Feather name="menu" size={24} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: "Home" }}
      />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen
        name="AttachLetter"
        component={AttachLetter}
        options={{ title: "Attach" }}
      />
      <Tab.Screen name="Log" component={Log} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}
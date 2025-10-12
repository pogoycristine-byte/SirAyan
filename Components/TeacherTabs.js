//TeacherTabs
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
// Teacher Pages
import TeacherDashboard from "../Pages/Teacher/TeacherDashboard";
import TeacherExcuses from "../Pages/Teacher/Excuses";
import TeacherRecords from "../Pages/Teacher/Records";
import TeacherNotifications from "../Pages/Teacher/Notification";
import TeacherMore from "../Pages/Teacher/More";

const Tab = createBottomTabNavigator();

export default function TeacherTabs() {
  return (
    <Tab.Navigator
      initialRouteName="TeacherDashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#2563EB", // Modern blue tone
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 65,
          paddingBottom: 10,
          elevation: 10,
        },
        tabBarIcon: ({ color, focused }) => {
          switch (route.name) {
            case "TeacherDashboard":
              return <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />;
            case "TeacherExcuses":
              return <MaterialIcons name="description" size={24} color={color} />;
            case "TeacherRecords":
              return <Feather name="book" size={24} color={color} />;
            case "TeacherNotifications":
              return (
                <Ionicons
                  name={focused ? "notifications" : "notifications-outline"}
                  size={24}
                  color={color}
                />
              );
            case "TeacherMore":
              return <Feather name="menu" size={24} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="TeacherDashboard"
        component={TeacherDashboard}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="TeacherExcuses"
        component={TeacherExcuses}
        options={{ title: "Excuses" }}
      />
      <Tab.Screen
        name="TeacherRecords"
        component={TeacherRecords}
        options={{ title: "Records" }}
      />
      <Tab.Screen
        name="TeacherNotifications"
        component={TeacherNotifications}
        options={{ title: "Notification" }}
      />
      <Tab.Screen
        name="TeacherMore"
        component={TeacherMore}
        options={{ title: "More" }}
      />
    </Tab.Navigator>
  );
}
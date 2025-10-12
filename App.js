// App.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Icons (used inside your tab navigators)
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

// Pages
import Splash from "./Pages/Home/Splash";
import Account from "./Pages/Account/Account";

// Navigation Components
import TeacherTabs from "./Components/TeacherTabs";
import StudentTabs from "./Components/StudentTabs";

const Stack = createNativeStackNavigator();

// Main App Navigation
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

        {/* Student Section */}
        <Stack.Screen name="StudentTabs" component={StudentTabs} />

        {/* Teacher Section */}
        <Stack.Screen name="TeacherTabs" component={TeacherTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
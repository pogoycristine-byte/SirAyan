import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "./Pages/Home/Splash";
import Account from "./Pages/Account/Account";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import StudentDashboard from "./Pages/Student/Dashboard";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={Account} options={{ title: "Login" }} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} options={{ title: "Teacher Dashboard" }} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} options={{ title: "Student Dashboard" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

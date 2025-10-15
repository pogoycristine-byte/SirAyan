import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "./Pages/Home/Splash";
import Account from "./Pages/Account/Account";
import Dashboard from "./Pages/Student/Dashboard";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import Home from "./Pages/Home/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
  <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="StudentDashboard" component={Dashboard} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

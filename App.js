//jahahaha
import React, { useState, useEffect } from "react";
import { StatusBar, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initDB } from "./src/services/database";

import Splash from "./Pages/Home/Splash";
import Account from "./Pages/Account/Account";
import Register from "./Pages/Account/Register";
import Dashboard from "./Pages/Student/Dashboard";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initDB();
        console.log("Database initialized successfully");
        setDbReady(true);
      } catch (err) {
        console.error("Database initialization error:", err);
      }
    })();
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="#1E3A8A" barStyle="light-content" translucent={false} />

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="StudentDashboard" component={Dashboard} />
          <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

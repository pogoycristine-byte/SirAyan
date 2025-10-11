import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

// Import Pages
import Account from './Pages/Account/Account';
import Dashboard from './Pages/Student/Dashboard';
import Notification from './Pages/Student/Notification';
import AttachLetter from './Pages/Student/AttachLetter';
import Log from './Pages/Student/Log';
import More from './Pages/Student/More';
import TeacherDashboard from './Pages/Teacher/TeacherDashboard';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Bottom Tabs for Students
function StudentTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#808080',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 65,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'Dashboard') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />;
          } else if (route.name === 'Notification') {
            return <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={24} color={color} />;
          } else if (route.name === 'AttachLetter') {
            return <MaterialIcons name="attach-file" size={24} color={color} />;
          } else if (route.name === 'Log') {
            return <Feather name="book" size={24} color={color} />;
          } else if (route.name === 'More') {
            return <Feather name="menu" size={24} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: 'Home' }} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="AttachLetter" component={AttachLetter} options={{ title: 'Attach' }} />
      <Tab.Screen name="Log" component={Log} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}

// ✅ Main Navigation
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
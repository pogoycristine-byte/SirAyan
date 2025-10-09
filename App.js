import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

// Import your pages
import Dashboard from './Pages/Student/Dashboard';
import Notification from './Pages/Student/Notification';
import AttachLetter from './Pages/Student/AttachLetter';
import Log from './Pages/Student/Log';
import More from './Pages/Student/More';

import Splash from "./Pages/Home/Splash";
import Account from "./Pages/Account/Account";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import StudentDashboard from "./Pages/Student/Dashboard";

const Tab = createBottomTabNavigator();


export default function App() {
  return (
       <NavigationContainer>
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
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name={iconName} size={24} color={color} />;
            } else if (route.name === 'Notification') {
              iconName = focused ? 'notifications' : 'notifications-outline';
              return <Ionicons name={iconName} size={24} color={color} />;
            } else if (route.name === 'AttachLetter') {
              iconName = focused ? 'attach-file' : 'attach-file';
              return <MaterialIcons name={iconName} size={24} color={color} />;
            } else if (route.name === 'Log') {
              iconName = focused ? 'book-open' : 'book';
              return <Feather name={iconName} size={24} color={color} />;
            } else if (route.name === 'More') {
              iconName = focused ? 'menu' : 'menu';
              return <Feather name={iconName} size={24} color={color} />;
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
    </NavigationContainer>
  );
  
}

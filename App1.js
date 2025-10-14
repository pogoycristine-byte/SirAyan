import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import { AppProvider } from './AppContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Attendance" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

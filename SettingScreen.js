import React, { useContext } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';
import { AppContext } from './AppContext';

const SettingsScreen = () => {
  const { darkMode, setDarkMode, resetAttendance } = useContext(AppContext);

  return (
    <View style={[styles.container, darkMode && { backgroundColor: '#111' }]}>
      <Text style={[styles.label, darkMode && { color: '#fff' }]}>Dark Mode</Text>
      <Switch
        value={darkMode}
        onValueChange={(value) => setDarkMode(value)}
      />

      <View style={{ marginTop: 30 }}>
        <Button
          title="Reset Attendance"
          onPress={resetAttendance}
          color="#e74c3c"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default SettingsScreen;
          

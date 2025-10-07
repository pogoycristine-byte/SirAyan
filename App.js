import React from 'react';
import { SafeAreaView } from 'react-native';
import CommentSection from './Components/CommentSection';
import AttendanceTracker from './Components/AttendanceTracker';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AttendanceTracker />
    </SafeAreaView>
  );
}

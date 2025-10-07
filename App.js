import React from 'react';
import { SafeAreaView } from 'react-native';
import CommentSection from './Components/CommentSection';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CommentSection />
    </SafeAreaView>
  );
}

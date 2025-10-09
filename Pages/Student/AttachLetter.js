import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { globalStyles } from "../../Styles/globalStyles";

export default function AttachLetter() {
  const [letter, setLetter] = useState("");

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Excuse Letter</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Type your excuse here..."
        multiline
        value={letter}
        onChangeText={setLetter}
      />
    </View>
  );
}
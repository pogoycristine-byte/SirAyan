import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { globalStyles } from "../../Styles/globalStyles";

export default function AttachLetter() {
  const [fileName, setFileName] = useState(null);

  const handlePick = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.plainText],
      });
      setFileName(res.name);
      console.log("Picked file:", res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled picker");
      } else {
        console.error("Picker error:", err);
      }
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Excuse Letter</Text>
      <Button title="Attach File" onPress={handlePick} />
      {fileName && <Text>Attached: {fileName}</Text>}
    </View>
  );
}
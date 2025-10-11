import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function AttachLetter({ studentId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/plain"],
      });

      if (res.type === "success") {
        setFile({ name: res.name || "Unnamed File", uri: res.uri, size: res.size });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to pick the file.");
    }
  };

  const removeFile = () => setFile(null);

  const uploadFile = async () => {
    if (!file) return Alert.alert("No file selected", "Please attach a file first.");
    setUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Success", `Uploaded: ${file.name}`);
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FF" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Attach Excuse Letter</Text>

          <TouchableOpacity style={styles.box} onPress={pickFile} activeOpacity={0.8}>
            {!file ? (
              <>
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/109/109612.png" }}
                  style={styles.icon}
                />
                <Text style={styles.placeholder}>Tap to select your PDF/TXT file</Text>
                <Text style={styles.helperText}>Maximum file size: 5MB</Text>
              </>
            ) : (
              <View style={styles.fileInfo}>
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/337/337946.png" }}
                  style={styles.fileIcon}
                />
                <Text style={styles.fileName}>{file.name}</Text>
                {file.size && <Text style={styles.fileSize}>{(file.size / 1024).toFixed(2)} KB</Text>}
                <TouchableOpacity style={styles.removeButton} onPress={removeFile}>
                  <Text style={styles.buttonText}>Remove File</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, { opacity: uploading || !file ? 0.7 : 1 }]}
            onPress={uploadFile}
            disabled={uploading || !file}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit Excuse Letter</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.note}>
            Please ensure your excuse letter is clear and valid. Only PDF or TXT files are allowed.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F7FF",
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#1E3A8A", marginBottom: 25 },
  box: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    backgroundColor: "#fff",
    minHeight: 160,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  icon: { width: 60, height: 60, marginBottom: 15, tintColor: "#3B82F6" },
  placeholder: { color: "#3B82F6", fontWeight: "500", textAlign: "center", fontSize: 16 },
  helperText: { fontSize: 12, color: "#64748B", marginTop: 5, textAlign: "center" },
  fileInfo: { alignItems: "center" },
  fileIcon: { width: 50, height: 50, marginBottom: 10 },
  fileName: { fontWeight: "700", color: "#1E3A8A", fontSize: 16, textAlign: "center" },
  fileSize: { fontSize: 12, color: "#64748B", marginBottom: 10 },
  removeButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 14,
    width: "80%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  note: { fontSize: 12, color: "#64748B", textAlign: "center", marginTop: 15, paddingHorizontal: 10 },
});

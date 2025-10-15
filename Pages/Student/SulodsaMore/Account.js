import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ProfileSettings({ goBack }) {
  const [fullName, setFullName] = useState("Juan Dela Cruz");
  const [studentId] = useState("2025-00123");
  const [department] = useState("Computer Science");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      {goBack && (
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>Profile Settings</Text>

      <View style={styles.photoContainer}>
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} style={styles.photo} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Photo</Text>
          </View>
        )}
        <Button title="Upload Photo" onPress={pickImage} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Student/Employee ID</Text>
        <Text style={styles.value}>{studentId}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Class/Department</Text>
        <Text style={styles.value}>{department}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80, // increased top padding to move content lower
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 0, 
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholderText: {
    color: "#888",
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
  },
});


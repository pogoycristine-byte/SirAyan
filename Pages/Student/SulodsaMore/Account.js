import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context"; // <-- ADDED for proper header spacing

// --- Helper Component: Sub-screen Header (Updated) ---
const SubScreenHeader = ({ title, onBackPress }) => (
    <LinearGradient colors={["#2563EB", "#1E3A8A"]} style={headerStyles.headerGradient}>
        <StatusBar backgroundColor="#1E3A8A" barStyle="light-content" />
        <View style={headerStyles.header}>
            {/* THIS IS THE BACK BUTTON (Ionicons arrow-back) */}
            <TouchableOpacity onPress={onBackPress} style={headerStyles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={[headerStyles.mainTitle, {marginLeft: 15}]}>{title}</Text>
        </View>
    </LinearGradient>
);
// -----------------------------------------------------------------


export default function ProfileSettings({ goBack }) {
  // --- Functions/State (UNCHANGED) ---
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
  // ------------------------------------

  return (
    // Wrapped entire screen in SafeAreaView for correct header alignment
    <SafeAreaView style={{flex: 1, backgroundColor: '#f0f4f7'}}> 
        {/* 1. Use the custom header */}
        <SubScreenHeader title="Account Settings" onBackPress={goBack} />

        <ScrollView contentContainerStyle={styles.contentContainer}>
            
            <View style={styles.photoSection}>
                <View style={styles.photoContainer}>
                    {profilePhoto ? (
                        <Image source={{ uri: profilePhoto }} style={styles.photo} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Ionicons name="person" size={50} color="#888" />
                        </View>
                    )}
                </View>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    <Text style={styles.uploadButtonText}>Change Photo</Text>
                </TouchableOpacity>
            </View>

            {/* Account Details Card */}
            <Text style={styles.sectionTitle}>Account Details</Text>
            <View style={styles.card}>
                <View style={styles.field}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter full name"
                    />
                </View>

                <View style={[styles.field, styles.noBorder]}>
                    <Text style={styles.label}>Student/Employee ID</Text>
                    <Text style={styles.value}>{studentId}</Text>
                </View>
            </View>

            {/* Department Card */}
            <Text style={styles.sectionTitle}>Affiliation</Text>
            <View style={styles.card}>
                <View style={styles.field}>
                    <Text style={styles.label}>Class/Department</Text>
                    <Text style={styles.value}>{department}</Text>
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={() => alert('Profile Saved!')}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

        </ScrollView>
    </SafeAreaView>
  );
}

// ---
// ## Header Styles (Adjusted to ensure visibility)
// NOTE: You need to install `react-native-safe-area-context` to use SafeAreaView correctly.
const headerStyles = StyleSheet.create({
    headerGradient: {
        paddingVertical: 18, 
        paddingHorizontal: 20,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        // The padding here is handled by SafeAreaView, ensuring the content is below the notch
    },
    mainTitle: { 
        color: "#fff", 
        fontSize: 22, 
        fontWeight: "bold" 
    },
    backButton: {
        paddingRight: 5,
    }
});
// ---

// ## Component Styles (Minor adjustments for spacing)
const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f0f4f7",
  },
  
  photoSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    backgroundColor: "#eef2f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: '#ccc',
  },
  uploadButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: '#ccc',
  },
  uploadButtonText: {
    color: "#007bff",
    fontWeight: '600',
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6c757d',
    marginTop: 15,
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  field: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: '#6c757d',
    marginBottom: 3,
  },
  input: {
    fontSize: 17,
    padding: 0,
    color: '#343a40',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 17,
    color: '#343a40',
    fontWeight: 'bold',
    paddingVertical: 0,
  },

  saveButton: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  }
});
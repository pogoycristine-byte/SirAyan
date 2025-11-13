import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons"; // <-- Import for icons

export default function AttachLetter({ studentId }) {
    const [file, setFile] = useState(null);
    const [fileContent, setFileContent] = useState(""); // For TXT preview
    const [uploading, setUploading] = useState(false);

    const pickFile = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: [
                    "application/pdf",
                    "text/plain",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                ],
            });

            if (res.type === "success") {
                setFile({ name: res.name || "Unnamed File", uri: res.uri, size: res.size });

                if (res.mimeType === "text/plain" || res.name.endsWith(".txt")) {
                    const content = await FileSystem.readAsStringAsync(res.uri);
                    setFileContent(content);
                } else {
                    setFileContent(""); // reset content for non-TXT files
                }
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to pick the file.");
        }
    };

    const removeFile = () => {
        setFile(null);
        setFileContent("");
    };

    const uploadFile = async () => {
        if (!file) return Alert.alert("No file selected", "Please attach a file first.");

        setUploading(true);
        try {
            // Simulate API upload delay
            await new Promise((resolve) => setTimeout(resolve, 1500)); 
            Alert.alert("Success", `Uploaded: ${file.name}`);
            setFile(null);
            setFileContent("");
        } finally {
            setUploading(false);
        }
    };

    const getFileIcon = (name) => {
        if (name.endsWith(".pdf")) return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
        if (name.endsWith(".txt")) return "https://cdn-icons-png.flaticon.com/512/136/136538.png";
        if (name.endsWith(".doc") || name.endsWith(".docx")) return "https://cdn-icons-png.flaticon.com/512/732/732220.png";
        if (name.endsWith(".xls") || name.endsWith(".xlsx")) return "https://cdn-icons-png.flaticon.com/512/732/732233.png";
        if (name.endsWith(".ppt") || name.endsWith(".pptx")) return "https://cdn-icons-png.flaticon.com/512/732/732205.png";
        return "https://cdn-icons-png.flaticon.com/512/230/230322.png"; // generic document icon
    };

    return (
        <View style={styles.container}>
            {/* StatusBar only */}
            <StatusBar backgroundColor="#f7f9fc" barStyle="dark-content" />

            {/* Content wrapped in KeyboardAvoidingView and ScrollView */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.flex}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Optional: small title instead of blue header */}
                    <Text style={styles.headerText}>Attach Excuse Letter</Text>
                    
                    <TouchableOpacity style={styles.box} onPress={pickFile} activeOpacity={0.8}>
                        {!file ? (
                            <View style={styles.centeredContent}>
                                <Ionicons name="document-attach-outline" size={60} color="#3B82F6" />
                                <Text style={styles.placeholder}>Tap to select your document</Text>
                                <Text style={styles.helperText}>PDF, DOCX, TXT | Max file size: 5MB</Text>
                            </View>
                        ) : (
                            <View style={styles.fileInfo}>
                                <Image source={{ uri: getFileIcon(file.name) }} style={styles.fileIcon} />
                                <Text style={styles.fileName}>{file.name}</Text>
                                {file.size && (
                                    <Text style={styles.fileSize}>{(file.size / 1024).toFixed(2)} KB</Text>
                                )}

                                {fileContent ? (
                                    <View style={styles.textPreview}>
                                        <ScrollView>
                                            <Text style={{fontSize: 13}}>{fileContent}</Text>
                                        </ScrollView>
                                    </View>
                                ) : (
                                    <Text style={styles.helperText}>File attached successfully.</Text>
                                )}

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
                        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Excuse Letter</Text>}
                    </TouchableOpacity>

                    <Text style={styles.note}>
                        Please ensure your document is clear and valid. Your submission will be reviewed by the school administration.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// --- Component Styles ---
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#f7f9fc" 
    },
    flex: { flex: 1 },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 20,
        paddingTop: 40, // moved contents a little lower
    },
    headerText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1E3A8A",
        marginBottom: 20,
    },
    box: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 30,
        alignItems: "center",
        backgroundColor: "#fff",
        minHeight: 200,
        marginBottom: 30,
    },
    centeredContent: { alignItems: "center" },
    placeholder: { color: "#3B82F6", fontWeight: "600", textAlign: "center", fontSize: 16, marginTop: 10 },
    helperText: { fontSize: 13, color: "#6c757d", marginTop: 5, textAlign: "center" },
    fileInfo: { alignItems: "center", width: '100%' },
    fileIcon: { width: 50, height: 50, marginBottom: 10 },
    fileName: { fontWeight: "700", color: "#343a40", fontSize: 16, textAlign: "center" },
    fileSize: { fontSize: 12, color: "#6c757d", marginBottom: 10 },
    removeButton: {
        backgroundColor: "#EF4444",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 15,
    },
    submitButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 18,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    note: { fontSize: 13, color: "#6c757d", textAlign: "center", paddingHorizontal: 10 },
    textPreview: {
        marginTop: 15,
        maxHeight: 100,
        width: "100%",
        borderWidth: 1,
        borderColor: "#e9ecef",
        borderRadius: 8,
        padding: 8,
        backgroundColor: "#f8f9fa",
        flexShrink: 0,
    },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ScanQR() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);

  // Request camera permission
  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  // Real-time listener for attendance
  useEffect(() => {
    const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttendanceList(data);
    });
    return () => unsubscribe();
  }, []);

  // Handle QR scan
  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return; // prevent double scan
    setScanned(true);

    try {
      const parsed = JSON.parse(data);

      if (!parsed.studentId || !parsed.name) {
        Alert.alert("Invalid QR", "Missing student information in the QR code.");
        setScanned(false);
        return;
      }

      setLoading(true);

      await addDoc(collection(db, "attendance"), {
        studentId: parsed.studentId,
        name: parsed.name,
        section: parsed.section || "Unknown",
        timestamp: serverTimestamp(),
        status: "Present",
      });

      setLoading(false);

      Alert.alert(
        "✅ Attendance Recorded",
        `Student: ${parsed.name}\nSection: ${parsed.section || "N/A"}`,
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert("Invalid QR", "Please scan a valid student QR code.");
      setScanned(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📷 Scan Student QR Code</Text>

      <View style={styles.scannerContainer}>
        <View style={styles.cameraFrame}>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />
        </View>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#2563EB"
          style={{ marginTop: 20 }}
        />
      )}

      {scanned && !loading && (
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => setScanned(false)}
        >
          <Ionicons name="reload" size={20} color="#fff" />
          <Text style={styles.rescanText}>Scan Again</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>📝 Recent Attendance</Text>
      <FlatList
        data={attendanceList}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.itemRow}>
              <Ionicons name="person-circle-outline" size={24} color="#2563EB" />
              <View style={{ flex: 1 }}>
                <Text style={styles.listText}>{item.name}</Text>
                <Text style={styles.sectionText}>{item.section}</Text>
              </View>
            </View>
            <Text style={styles.listTime}>
              {item.timestamp?.toDate
                ? item.timestamp.toDate().toLocaleString()
                : ""}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "linear-gradient(180deg, #E3E9FF 0%, #F7F9FF 100%)",
    alignItems: "center",
    paddingTop: 100,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5EDFF",
  },
  infoText: {
    fontSize: 16,
    color: "#1E3A8A",
    fontWeight: "500",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    color: "#1E3A8A",
  },
  scannerContainer: {
    width: "90%",
    height: 380,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraFrame: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "rgba(37, 99, 235, 0.3)",
    backgroundColor: "rgba(255,255,255,0.1)",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  rescanButton: {
    flexDirection: "row",
    marginTop: 25,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  rescanText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  permissionButton: {
    marginTop: 15,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  permissionText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 35,
    color: "#1E3A8A",
    marginBottom: 8,
  },
  list: {
    width: "90%",
    marginTop: 5,
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  listText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  sectionText: {
    fontSize: 14,
    color: "#64748B",
  },
  listTime: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "right",
  },
});

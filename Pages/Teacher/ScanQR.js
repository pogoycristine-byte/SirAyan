import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { getQRCodeByCode, markAttendance } from "../../src/services/database";

export default function ScanQR() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  // Request camera permission
  React.useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setLoading(true);

    try {
      const qrCode = await getQRCodeByCode(data);

      if (qrCode) {
        Alert.alert("Success", `QR Code scanned for class: ${qrCode.classId}`);
        // Mark attendance here if needed
      } else {
        Alert.alert("Invalid QR Code", "This QR code is not recognized.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to scan QR code: " + error.message);
      console.error("QR Scan error:", error);
    } finally {
      setLoading(false);
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
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={styles.camera}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>Align QR Code</Text>
        </View>
      </CameraView>

      {scanned && (
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => setScanned(false)}
          disabled={loading}
        >
          <Text style={styles.rescanButtonText}>
            {loading ? "Processing..." : "Tap to Rescan"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#2563EB",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  scanText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 20,
    fontWeight: "600",
  },
  rescanButton: {
    position: "absolute",
    bottom: 30,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  rescanButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  permissionText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

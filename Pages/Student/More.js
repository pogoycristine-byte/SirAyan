import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "../../src/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";

export default function More({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const saved = await AsyncStorage.getItem("currentUser");
        if (saved) {
          setUser(JSON.parse(saved));
          setLoading(false);
          return;
        }

        const uid = await AsyncStorage.getItem("currentUserId");
        if (uid) {
          const userRef = doc(db, "users", uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setUser({ uid: snap.id, ...snap.data() });
          }
        }
      } catch (err) {
        console.error("Error loading user in More:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            try {
              await signOut(auth);
            } catch (e) {
              console.warn("signOut warning:", e.message || e);
            }

            await AsyncStorage.multiRemove([
              "currentUser",
              "currentUserId",
              "rememberedUser",
            ]);

            navigation.reset({
              index: 0,
              routes: [{ name: "Account" }],
            });
          } catch (err) {
            console.error("Logout error:", err);
            Alert.alert("Error", "Failed to logout. Try again.");
          }
        },
      },
    ]);
  };

  // ABOUT US POPUP
  const handleAboutUs = () => {
    Alert.alert(
      "About Us",
      "Leader: Pogoy, Cristine N. \n\n Members: \n    Boncales, Mylene\n    Crompido, Genie Mae\n    Mabalatan, Jubelle Franz\n    Palmero, Imee\n    Romanda, Carl\n    Sanico, Deasyrie\n    Taghoy, Cherry Ruth\n    Tampos, Judelien\n    Vallentos, Myla"
    );
  };

  // Display values
  const displayName =
    user?.fullname || user?.name || user?.displayName || "No name";
  const email = user?.email || user?.gmail || user?.contact || "No email";
  const department = user?.department || user?.section || user?.role || "—";

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#1E3AFA" />
        </View>
      ) : (
        <>
          {/* HEADER CARD */}
          <View style={styles.userCard}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userBlockLabel}>Block</Text>
            <Text style={styles.userDept}>{department}</Text>
          </View>

          <Text style={styles.sectionHeader}>YOUR INFORMATION</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{displayName}</Text>

            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{email}</Text>

            {/* BLOCK */}
            <Text style={styles.infoLabel}>Block:</Text>
            <Text style={styles.infoValue}>{department}</Text>
          </View>

          {/* ABOUT US BUTTON */}
          <TouchableOpacity style={styles.aboutButton} onPress={handleAboutUs}>
            <Text style={styles.aboutText}>About Us</Text>
          </TouchableOpacity>

          {/* LOGOUT BUTTON */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

/* --------------------------- STYLES --------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF2FF",
    padding: 20,
    paddingTop: 75,
  },

  userCard: {
    backgroundColor: "#2563EB",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },

  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  userBlockLabel: {
    fontSize: 12,
    color: "#BFDBFE",
    marginTop: 6,
    textTransform: "uppercase",
    fontWeight: "600",
  },

  userDept: {
    fontSize: 14,
    color: "#DBEAFE",
    marginTop: 3,
  },

  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    marginTop: 20,
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },

  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 10,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 2,
  },

  aboutButton: {
    backgroundColor: "#1E40AF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    marginTop: 10,
  },

  aboutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  logoutButton: {
    marginTop: 15,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

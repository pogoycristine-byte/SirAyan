import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "../../src/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { Ionicons } from "@expo/vector-icons";

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

  const handleAboutUs = () => {
    Alert.alert(
      "About Us",
      "Submitted By:\nGroup 2 \n \nLeader: Pogoy, Cristine N.\nMembers: \n    Boncales, Mylene\n    Crompido, Genie Mae\n    Mabalatan, Jubelle Franz\n    Palmero, Imee\n    Romanda, Carl\n    Sanico, Deasyrie\n    Taghoy, Cherry Ruth\n    Tampos, Judelien\n    Vallentos, Myla\n\nSubmitted To: Jay Ian Camelotes"
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#1E3AFA" />
      </View>
    );
  }

  const displayName =
    user?.fullname || user?.name || user?.displayName || "No name";
  const email = user?.email || user?.gmail || user?.contact || "No email";
  const department = user?.department || user?.section || user?.role || "—";

  return (
    <ScrollView style={styles.container}>
      {/* PROFILE CARD */}
      <View style={styles.userCard}>
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userBlockLabel}>Department</Text>
        <Text style={styles.userDept}>{department}</Text>
      </View>

      {/* INFORMATION CARD */}
      <Text style={styles.sectionHeader}>Your Information</Text>

      <View style={styles.infoCard}>
        {/* NAME */}
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#2563EB" />
          <Text style={styles.infoLabel}>Name: </Text>
          <Text style={styles.infoValueInline}>{displayName}</Text>
        </View>

        {/* EMAIL */}
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#2563EB" />
          <Text style={styles.infoLabel}>Email: </Text>
          <Text style={styles.infoValueInline}>{email}</Text>
        </View>

        {/* DEPARTMENT */}
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={20} color="#2563EB" />
          <Text style={styles.infoLabel}>Department: </Text>
          <Text style={styles.infoValueInline}>{department}</Text>
        </View>
      </View>

      {/* FAQ SECTION */}
      <Text style={styles.sectionHeader}>FAQs</Text>

      <View style={styles.faqCard}>
        <Text style={styles.faqTitle}>
          How does the attendance tracker work?
        </Text>
        <Text style={styles.faqText}>
          Students are recorded through sessions you create. Attendance logs are
          saved in real-time.
        </Text>

        <Text style={styles.faqTitle}>Can I edit or remove students?</Text>
        <Text style={styles.faqText}>
          Yes, you can view, or delete students inside each class session.
        </Text>

        <Text style={styles.faqTitle}>Where are my records saved?</Text>
        <Text style={styles.faqText}>
          All data is stored securely in Firebase Firestore and synced
          automatically.
        </Text>
      </View>

      {/* ABOUT US BUTTON */}
      <TouchableOpacity style={styles.aboutButton} onPress={handleAboutUs}>
        <Ionicons name="information-circle-outline" size={22} color="#fff" />
        <Text style={styles.aboutText}>About Us</Text>
      </TouchableOpacity>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* --------------------------- STYLES --------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF2FF",
    padding: 20,
    paddingTop: 60,
  },

  userCard: {
    backgroundColor: "#1a338dff",
    padding: 3,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    elevation: 3,
  },

  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 10,
  },

  userBlockLabel: {
    fontSize: 13,
    color: "#BFDBFE",
    marginTop: 8,
    textTransform: "uppercase",
    fontWeight: "600",
  },

  userDept: {
    fontSize: 15,
    color: "#DBEAFE",
    marginTop: 3,
  },

  sectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
    marginTop: 15,
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: "#fff",
    padding: 3,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    flexWrap: "wrap",
  },

  infoLabel: {
    fontSize: 13,
    color: "#374151",
    marginLeft: 8,
  },

  infoValueInline: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 4,
  },

  faqCard: {
    backgroundColor: "#FFFFFF",
    padding: 5,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },

  faqTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E40AF",
    marginTop: 12,
  },

  faqText: {
    fontSize: 13,
    color: "#475569",
    marginTop: 4,
  },

  aboutButton: {
    flexDirection: "row",
    backgroundColor: "#1E40AF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
    marginTop: 10,
  },

  aboutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  logoutButton: {
    flexDirection: "row",
    marginTop: 15,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
    marginBottom: 50,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
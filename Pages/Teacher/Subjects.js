import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { Ionicons } from "@expo/vector-icons";

export default function Subjects() {
  const [classesData, setClassesData] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadTeacherAndSessions();
    }, [])
  );

  const loadTeacherAndSessions = async () => {
    try {
      setLoading(true);
      const currentUser = await AsyncStorage.getItem("currentUser");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        setTeacher(user);

        const q = query(
          collection(db, "sessions"),
          where("teacherId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const sessions = [];
        for (const sessionDoc of querySnapshot.docs) {
          const sessionData = sessionDoc.data();

          const studentsRef = collection(
            db,
            "sessions",
            sessionDoc.id,
            "students"
          );
          const studentsSnap = await getDocs(studentsRef);
          const studentCount = studentsSnap.size;

          sessions.push({
            id: sessionDoc.id,
            name: sessionData.subject,
            subject: sessionData.subject,
            block: sessionData.block,
            students: studentCount,
            studentList: studentsSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })),
            days: Array.isArray(sessionData.days)
              ? sessionData.days.join(", ")
              : sessionData.days || "",
            startTime: sessionData.startTime,
            endTime: sessionData.endTime,
            code: sessionData.code,
          });
        }

        setClassesData(sessions);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      Alert.alert("Error", "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const renderStudent = ({ item }) => (
    <View style={styles.studentItem}>
      {/* avatar removed */}
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={styles.studentText}>{item.fullname || item.name}</Text>
        <Text style={styles.studentSubText}>
          {item.email || "No email"}
        </Text>
      </View>
    </View>
  );

  const renderCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedClass(item);
          setStudents(item.studentList || []);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.subject}</Text>
            <Text style={styles.cardSubTitle}>Block {item.block}</Text>
            <Text style={styles.cardTime}>
              {item.days} • {item.startTime} - {item.endTime}
            </Text>
          </View>
          <View style={styles.studentCountBadge}>
            <Text style={styles.studentCountText}>{item.students}</Text>

            {/* ❗ FIXED HERE — plural aware */}
            <Text style={styles.studentCountLabel}>
              {item.students === 1 ? "Student" : "Students"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.heading}>Subjects</Text>
        {teacher && (
          <Text style={styles.teacherInfo}>
            Teacher: {teacher.fullname}
          </Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
      ) : classesData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={48} color="#CBD5E1" />
          <Text style={styles.emptyText}>No subjects created yet</Text>
          <Text style={styles.emptySubText}>
            Create a session from the Home tab to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={classesData}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cardsContainer}
          refreshing={loading}
          onRefresh={loadTeacherAndSessions}
        />
      )}

      <Modal
        visible={selectedClass !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedClass(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {selectedClass?.subject}
                </Text>
                <Text style={styles.modalSubTitle}>
                  Block {selectedClass?.block}
                </Text>
                <Text style={styles.modalStudentCount}>
                  {students.length} Student{students.length !== 1 ? "s" : ""} Joined
                </Text>
              </View>
              <Pressable
                onPress={() => setSelectedClass(null)}
                style={styles.closeIconButton}
              >
                <Ionicons name="close" size={24} color="#555" />
              </Pressable>
            </View>

            {students.length === 0 ? (
              <View style={styles.emptyStudentsContainer}>
                <Ionicons name="person-outline" size={40} color="#CBD5E1" />
                <Text style={styles.emptyStudentsText}>
                  No students joined yet
                </Text>
              </View>
            ) : (
              <FlatList
                data={students}
                renderItem={renderStudent}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
              />
            )}

            <Pressable
              style={styles.closeButton}
              onPress={() => setSelectedClass(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FF",
    paddingTop: 55,
  },
  headerSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  teacherInfo: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  cardContainer: {
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  cardSubTitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  cardTime: {
    fontSize: 12,
    color: "#999",
  },
  studentCountBadge: {
    backgroundColor: "#E0E7FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 70,
  },
  studentCountText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
  },
  studentCountLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 13,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
},

  modalContent: {
  width: "90%",
  maxHeight: "80%",
  backgroundColor: "#fff",
  borderRadius: 20,
  paddingTop: 20,
  paddingBottom: 20,
},

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  modalSubTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  modalStudentCount: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
  },
  closeIconButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#F0F4FF",
  },
  emptyStudentsContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStudentsText: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
  },
  studentItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    alignItems: "center",
  },
  studentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  studentSubText: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  closeButton: {
    marginHorizontal: 20,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

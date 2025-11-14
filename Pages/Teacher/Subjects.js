import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";

export default function ScanQR() {
  // Placeholder data for sessions/classes
  const classesData = [
    {
      id: "1",
      name: "Math - Section A",
      students: ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince"],
    },
    {
      id: "2",
      name: "Science - Section B",
      students: ["Ethan Hunt", "Fiona Gallagher", "George Clooney", "Hannah Montana"],
    },
    {
      id: "3",
      name: "English - Section C",
      students: ["Ian McKellen", "Jane Doe", "Kevin Hart", "Laura Croft"],
    },
  ];

  const [selectedClass, setSelectedClass] = useState(null);

  const renderStudent = ({ item }) => (
    <View style={styles.studentItem}>
      <Text style={styles.studentText}>{item}</Text>
    </View>
  );

  const renderCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedClass(item)}
      >
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardValue}>{item.students.length} Students</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Subjects</Text>
      <FlatList
        data={classesData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardsContainer}
      />

      {/* Modal for student list */}
      <Modal
        visible={selectedClass !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedClass(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedClass?.name} - Students
            </Text>
            <FlatList
              data={selectedClass?.students || []}
              renderItem={renderStudent}
              keyExtractor={(item, index) => index.toString()}
            />

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
    paddingTop: 75,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  cardValue: {
    fontSize: 14,
    marginTop: 5,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1E3A8A",
    textAlign: "center",
  },
  studentItem: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  studentText: {
    fontSize: 16,
    color: "#1E3A8A",
  },
  closeButton: {
    marginTop: 15,
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

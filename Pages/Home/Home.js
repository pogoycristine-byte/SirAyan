import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Home({ navigation }) {
  const handleGetStarted = () => {
    setTimeout(() => {
      navigation.navigate("Account");
    }, 999);
  };

  return (
    <LinearGradient colors={["#e6f0ff", "#ffffff"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.appTitle}>BSIT Attendance Management System</Text>
          <Text style={styles.subtitle}>
            Trinidad Municipal College – Empowering learning through technology.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vision</Text>
          <Text style={styles.paragraph}>
            A model institution with fully developed academic,
            technical-vocational education and skill of manpower with positive
            work attitudes anchored in the core values of leadership and
            professionalism essential in the creation of self-reliant citizens.
          </Text>

          <Text style={styles.sectionTitle}>Mission</Text>
          <Text style={styles.paragraph}>
            To build well-trained, competent, and employable professionals who
            will meet the demands of the local workplaces.
          </Text>

          <Text style={styles.sectionTitle}>Goal</Text>
          <Text style={styles.paragraph}>
            TMC aims at evolving a whole individual as a child of God and a
            member of a democratic society who is professionally competent, can
            provide leadership, and advance knowledge—well-trained in a certain
            vocation not only to help himself but to help others, and practical
            yet responsible and obedient to the laws of God and the laws of the
            government.
          </Text>

          <Text style={styles.sectionTitle}>Philosophy</Text>
          <Text style={styles.paragraph}>
            TMC adheres to the philosophy that education is life and growth
            guided by faith in God and love of fellowmen in an environment of
            competitiveness, professionalism, and excellence.
          </Text>

          <Text style={styles.sectionTitle}>Slogan</Text>
          <Text style={styles.paragraph}>
            TMC is committed to public educational services second to none.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <LinearGradient
            colors={["#007bff", "#0056b3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerText}>© 2025 Trinidad Municipal College</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    padding: 25,
    alignItems: "center",
    paddingBottom: 50,
  },
  headerContainer: {
    marginTop: 60,
    alignItems: "center",
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "hsl(61.6,58.5%,40.9%)",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 25,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "hsl(61.6,58.5%,40.9%)",
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    textAlign: "justify",
  },
  button: {
    marginTop: 40,
    width: "80%",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  footerText: {
    fontSize: 13,
    color: "#777",
    marginTop: 40,
    textAlign: "center",
  },
});
import { StyleSheet, Platform, StatusBar } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 20,
    paddingBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  card: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    marginVertical: 5,
    borderRadius: 8,
  },
});

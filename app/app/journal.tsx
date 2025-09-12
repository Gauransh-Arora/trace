import { StyleSheet, Text, View } from "react-native";

export default function Journal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal</Text>
      <Text style={styles.subtitle}>Your personal journal entries</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
});
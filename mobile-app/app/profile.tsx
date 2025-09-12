import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Amit Sharma</Text>
        <Text style={styles.email}>amit.sharma@email.com</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionText}>
          Passionate about technology and helping others. Loves to travel and explore new places.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.sectionText}>+91 98765 43210</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "center",
    paddingTop: 60,
  },
  card: {
    backgroundColor: "#232323",
    borderRadius: 24,
    alignItems: "center",
    padding: 28,
    width: "88%",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 28,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#3e8cff",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: "#aaa",
    marginBottom: 16,
  },
  editBtn: {
    backgroundColor: "#3e8cff",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: "#232323",
    borderRadius: 18,
    padding: 18,
    width: "88%",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3e8cff",
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 15,
    color: "#ccc",
  },
});
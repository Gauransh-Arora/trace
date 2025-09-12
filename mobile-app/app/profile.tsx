import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, Pressable, FlatList } from "react-native";
import { useState, useContext } from "react";
import { LanguageContext } from "../LanguageContext.js";

export default function Profile() {
  const { selectedLanguage, changeLanguage, getText, getAvailableLanguages } = useContext(LanguageContext);
  const [modalVisible, setModalVisible] = useState(false);
  
  const languages = getAvailableLanguages();

  const handleLanguageSelect = (language) => {
    changeLanguage(language);
    setModalVisible(false);
  };

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
          <Text style={styles.editBtnText}>{getText("profile.editProfile")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.languageBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.languageBtnText}>{getText("profile.selectLanguage")}: {selectedLanguage}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{getText("profile.aboutTitle")}</Text>
        <Text style={styles.sectionText}>
         {getText("profile.aboutText")}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{getText("profile.contactTitle")}</Text>
        <Text style={styles.sectionText}>+91 98765 43210</Text>
      </View>

      {/* Language Selection Dialog */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{getText("profile.selectLanguage")}</Text>
            <FlatList
              data={languages}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.languageOption,
                    selectedLanguage === item && styles.selectedLanguageOption
                  ]}
                  onPress={() => handleLanguageSelect(item)}
                >
                  <Text style={[
                    styles.languageOptionText,
                    selectedLanguage === item && styles.selectedLanguageText
                  ]}>
                    {item}
                  </Text>
                  {selectedLanguage === item && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              )}
            />
            <Pressable style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>{getText("profile.cancel")}</Text>
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
  languageBtn: {
    backgroundColor: "#3e8cff",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 12,
  },
  languageBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#232323",
    borderRadius: 20,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3e8cff",
    marginBottom: 16,
  },
  languageOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#181818",
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedLanguageOption: {
    backgroundColor: "#3e8cff22",
    borderColor: "#3e8cff",
    borderWidth: 1,
  },
  languageOptionText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedLanguageText: {
    color: "#3e8cff",
    fontWeight: "600",
  },
  checkmark: {
    color: "#3e8cff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: "#3e8cff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  closeBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
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
import React, { useState } from "react";
import {
    FlatList, Image,
    KeyboardAvoidingView,
    Platform, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";

const initialMessages: { [key: string]: any[] } = {
  "1": [
    { id: "1", text: "Hey, how are you?", sender: "friend", time: "09:30 AM" },
    { id: "2", text: "I'm good! How about you?", sender: "me", time: "09:31 AM" },
    { id: "3", text: "Doing well, thanks!", sender: "friend", time: "09:32 AM" },
  ],
  "2": [
    { id: "1", text: "Let's meet tomorrow.", sender: "friend", time: "08:15 AM" },
    { id: "2", text: "Sure! What time works for you?", sender: "me", time: "08:16 AM" },
  ],
  "3": [
    { id: "1", text: "Sent the documents.", sender: "friend", time: "Yesterday" },
    { id: "2", text: "Got them, thanks!", sender: "me", time: "Yesterday" },
  ],
  "4": [
    { id: "1", text: "Thank you!", sender: "friend", time: "Yesterday" },
    { id: "2", text: "You're welcome!", sender: "me", time: "Yesterday" },
  ],
};

interface Message {
  id: string;
  text: string;
  sender: string;
  time?: string;
}

interface OpenChatProps {
  friend: {
    id: string;
    name: string;
    avatar: string;
    status: string;
    isBot?: boolean;
  };
  onBackPress: () => void;
}

export default function OpenChat({ friend, onBackPress }: OpenChatProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>(
    friend.isBot
      ? [{ id: "1", sender: "bot", text: "Hi! I'm TRACE Bot. How can I help you today?" }]
      : initialMessages[friend.id] || []
  );

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: friend.isBot ? "user" : "me",
      text: input,
      time: friend.isBot ? undefined : "Now"
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    if (friend.isBot) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: currentInput, history: chatMessages }),
        });
        const data = await response.json();
        
        const botMessage: Message = {
          id: Date.now().toString() + "b",
          sender: "bot",
          text: data.answer
        };
        
        setChatMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        const errorMessage: Message = {
          id: Date.now().toString() + "e",
          sender: "bot",
          text: "Sorry, I couldn't connect to the bot."
        };
        setChatMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (friend.isBot) {
      return (
        <View
          style={[
            styles.msgBubble,
            item.sender === "bot" ? styles.botBubble : styles.userBubble,
          ]}
        >
          <Text style={styles.msgText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          item.sender === "me" ? styles.myMessage : styles.friendMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        {item.time && <Text style={styles.messageTime}>{item.time}</Text>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBackPress}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image source={{ uri: friend.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{friend.name}</Text>
          <Text style={styles.status}>{friend.status}</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={friend.isBot ? styles.list : styles.messagesList}
        inverted={!friend.isBot}
      />

      {/* Input Bar */}
      <View style={friend.isBot ? styles.inputRow : styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
          editable={!loading}
        />
        <TouchableOpacity
          style={friend.isBot ? styles.sendBtn : styles.sendButton}
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={friend.isBot ? styles.sendBtnText : styles.sendButtonText}>
            {loading ? "..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  // Header styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232323",
    paddingVertical: 16,
    paddingHorizontal: 18,
    paddingTop: 50, // Account for status bar
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  backButton: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  backButtonText: {
    color: "#3e8cff",
    fontSize: 24,
    fontWeight: "600",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#3e8cff",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 19,
    fontWeight: "600",
    color: "#fff",
  },
  status: {
    fontSize: 13,
    color: "#3e8cff",
    marginTop: 2,
  },
  
  // Bot chat styles
  list: {
    padding: 16,
  },
  msgBubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  botBubble: {
    backgroundColor: "#232323",
    alignSelf: "flex-start",
  },
  userBubble: {
    backgroundColor: "#3e8cff",
    alignSelf: "flex-end",
  },
  msgText: {
    color: "#fff",
    fontSize: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#232323",
    backgroundColor: "#232323",
  },
  sendBtn: {
    backgroundColor: "#3e8cff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  sendBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  // Friend chat styles
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageContainer: {
    maxWidth: "75%",
    marginBottom: 14,
    borderRadius: 16,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  myMessage: {
    backgroundColor: "#3e8cff",
    alignSelf: "flex-end",
  },
  friendMessage: {
    backgroundColor: "#232323",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  messageTime: {
    color: "#ccc",
    fontSize: 11,
    marginTop: 2,
    alignSelf: "flex-end",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232323",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  input: {
    flex: 1,
    backgroundColor: "#181818",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  sendButton: {
    backgroundColor: "#3e8cff",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
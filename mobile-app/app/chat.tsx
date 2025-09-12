import React, { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import OpenChat from "./openchat";

const friends = [
  {
    id: "0",
    name: "TRACE Bot",
    lastMessage: "Ask me anything about travel safety!",
    time: "Online",
    avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712027.png",
    status: "online",
    isBot: true,
  },
  {
    id: "1",
    name: "Amit Sharma",
    lastMessage: "Hey, how are you?",
    time: "09:30 AM",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "online",
  },
  {
    id: "2",
    name: "Priya Singh",
    lastMessage: "Let's meet tomorrow.",
    time: "08:15 AM",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "online",
  },
  {
    id: "3",
    name: "Rahul Verma",
    lastMessage: "Sent the documents.",
    time: "Yesterday",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    status: "offline",
  },
  {
    id: "4",
    name: "Sneha Patel",
    lastMessage: "Thank you!",
    time: "Yesterday",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    status: "online",
  },
];

export default function Chat() {
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleFriendPress = (friend) => {
    setSelectedFriend(friend);
  };

  const handleBackPress = () => {
    setSelectedFriend(null);
  };

  // If a friend is selected, show the OpenChat component
  if (selectedFriend) {
    return (
      <OpenChat
        friend={selectedFriend}
        onBackPress={handleBackPress}
      />
    );
  }

  // Otherwise, show the chat list
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatPreview}
            onPress={() => handleFriendPress(item)}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.info}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 20,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 10,
  },
  chatPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232323",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#3e8cff",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  time: {
    fontSize: 13,
    color: "#aaa",
    marginLeft: 10,
  },
  lastMessage: {
    fontSize: 15,
    color: "#ccc",
    marginTop: 2,
  },
});
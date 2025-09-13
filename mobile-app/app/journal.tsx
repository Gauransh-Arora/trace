import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Sample travel journal posts
const journalPosts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    caption:
      "Watching the sunrise over the mountains in Switzerland 🏔️ Nothing beats this peaceful moment!",
    location: "Swiss Alps, Switzerland",

    time: "2 hours ago",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop",
    caption:
      "Crystal clear waters and endless blue skies 🌊 Paradise found in the Maldives!",
    location: "Maldives",
    time: "5 hours ago",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=800&fit=crop",
    caption:
      "Lost in the cherry blossoms of Kyoto 🌸 Spring in Japan is absolutely magical!",
    location: "Kyoto, Japan",
    time: "1 day ago",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop",
    caption:
      "Hiking through the misty forests of Norway 🌲 Nature's therapy at its finest!",
    location: "Lofoten Islands, Norway",
    time: "2 days ago",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=800&fit=crop",
    caption:
      "Golden hour at Santorini never gets old ✨ Every sunset here feels like a dream!",
    location: "Santorini, Greece",
    time: "3 days ago",
  },
];

export default function Journal() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Travel Journal</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#3e8cff" />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {journalPosts.map((post) => (
          <View key={post.id} style={styles.postContainer}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={20} color="#3e8cff" />
                </View>
                <View>
                  <Text style={styles.username}>You</Text>
                  <Text style={styles.location}>{post.location}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Post Image */}
            <Image source={{ uri: post.image }} style={styles.postImage} />

            {/* Post Info */}
            <View style={styles.postInfo}>
              <Text style={styles.caption}>{post.caption}</Text>
              <Text style={styles.time}>{post.time}</Text>
            </View>
          </View>
        ))}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    padding: 8,
  },
  feed: {
    flex: 1,
    paddingTop: 20,
  },
  postContainer: {
    backgroundColor: "#232323",
    marginBottom: 24,
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3e8cff20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  location: {
    fontSize: 12,
    color: "#aaa",
  },
  postImage: {
    width: "100%",
    height: width - 32, // Square image with more margin
    resizeMode: "cover",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: "row",
  },
  actionButton: {
    marginRight: 18,
    padding: 4,
  },
  postInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  caption: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
    marginBottom: 8,
    marginTop: 12
  },
  time: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
  bottomSpacing: {
    height: 30,
  },
});

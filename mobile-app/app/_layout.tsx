import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#262d36",
              height: 70,
              paddingBottom: 10,
              paddingTop: 10,
              borderTopWidth: 0,
            },
            tabBarActiveTintColor: "#ffffff",
            tabBarInactiveTintColor: "#888888",
            tabBarShowLabel: true,
          }}
        >
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              href: "/profile",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: "Chat",
              href: "/chat",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="chatbubble-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="index"
            options={{
              title: "Map",
              href: "/",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="map-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="journal"
            options={{
              title: "Journal",
              href: "/journal",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="book-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="sos"
            options={{
              title: "SOS",
              href: "/sos",
              tabBarIcon: () => (
                <Ionicons name="warning-outline" size={24} color="#ff4444" />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // optional background to match your theme
  },
});

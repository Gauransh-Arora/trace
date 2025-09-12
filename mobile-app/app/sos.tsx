import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

// Configuration - Update these values
const SOS_CONFIG = {
  BACKEND_URL: "http://172.31.129.194:5000/send-sos",
  EMERGENCY_CONTACT: "+919142016901",
};

const quickAssistance = [
  { label: "Police", icon: "police-badge", color: "#3e8cff" },
  { label: "Hospital", icon: "hospital", color: "#4cd964" },
  { label: "Fire", icon: "fire", color: "#ff3b30" },
  { label: "Women Helpline", icon: "human-female", color: "#ff2d55" },
  { label: "Child Helpline", icon: "baby-face-outline", color: "#ff9500" },
];

export default function SOS() {
  const [location, setLocation] = useState<string>("Locating...");
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isSendingSOS, setIsSendingSOS] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Permission denied");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});

      // Store coordinates for SOS API
      setCoordinates({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      let geo = await Location.reverseGeocodeAsync(loc.coords);
      if (geo && geo.length > 0) {
        setLocation(
          `${geo[0].city || geo[0].region || "Unknown"}, ${geo[0].country}`
        );
      } else {
        setLocation("Location unavailable");
      }
    })();
  }, []);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [sosSent, setSosSent] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const sendSOSAlert = async () => {
    if (!coordinates) {
      Alert.alert("Error", "Location not available. Cannot send SOS.");
      return;
    }

    setIsSendingSOS(true);

    try {
      const response = await fetch(SOS_CONFIG.BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientPhoneNumber: SOS_CONFIG.EMERGENCY_CONTACT,
          messageBody: `EMERGENCY ALERT! I need immediate assistance. This is an automated SOS from TRACE app. Current location: ${location}`,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("SOS sent successfully:", result);
        setSosSent(true);
        Alert.alert(
          "SOS Sent Successfully",
          "Emergency message has been sent to your emergency contact with your location."
        );
      } else {
        throw new Error(result.error || "Failed to send SOS");
      }
    } catch (error) {
      console.error("SOS Error:", error);
      Alert.alert(
        "SOS Failed",
        "Failed to send emergency message. Please try again or call emergency services directly."
      );
      setSosSent(false);
    } finally {
      setIsSendingSOS(false);
    }
  };

  const handlePressIn = () => {
    setCountdown(3);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
          // Trigger actual SOS API call
          sendSOSAlert();
          return 0;
        }
        return (prev || 0) - 1;
      });
    }, 1000);
  };

  const handlePressOut = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setCountdown(null);
  };

  const getButtonContent = () => {
    if (isSendingSOS) {
      return (
        <>
          <Ionicons
            name="refresh"
            size={32}
            color="#fff"
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.sosSentText}>Sending SOS...</Text>
        </>
      );
    }
    if (sosSent) {
      return (
        <>
          <Ionicons
            name="checkmark-circle"
            size={32}
            color="#fff"
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.sosSentText}>SOS Sent Successfully</Text>
        </>
      );
    }
    if (countdown && countdown > 0) {
      return <Text style={styles.countdownText}>{countdown}</Text>;
    }
    return (
      <>
        <Ionicons
          name="warning"
          size={32}
          color="#fff"
          style={{ marginBottom: 8 }}
        />
        <Text style={styles.sosText}>Press & Hold for 3 seconds</Text>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="location-sharp" size={22} color="#3e8cff" />
        <Text style={styles.locationText}>Your Location: {location}</Text>
      </View>
      <View style={styles.card}>
        <Animated.View
          style={[
            styles.sosButton,
            sosSent && styles.sosButtonEmergency,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={sosSent || isSendingSOS ? undefined : handlePressIn}
            onPressOut={sosSent || isSendingSOS ? undefined : handlePressOut}
            disabled={sosSent || isSendingSOS}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {getButtonContent()}
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.cardText}>
          {isSendingSOS
            ? "Sending emergency alert with your location..."
            : sosSent
            ? "Emergency message sent successfully with your location. Help is on the way."
            : "SOS will be sent to your emergency contact with your precise location."}
        </Text>

        {sosSent && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSosSent(false);
              setCountdown(null);
            }}
          >
            <Text style={styles.resetButtonText}>Reset for Testing</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.assistSection}>
        <Text style={styles.assistTitle}>Quick Assistance</Text>
        <View style={styles.assistRow}>
          {quickAssistance.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.assistBtn, { backgroundColor: item.color + "22" }]}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={28}
                color={item.color}
              />
              <Text style={[styles.assistLabel, { color: item.color }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.illustrationWrap}>
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/2046015/screenshots/15145399/media/6e8e7e8e7e8e7e8e7e8e7e8e7e8e7e.png?compress=1&resize=800x600",
          }}
          style={styles.illustration}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    paddingTop: 40,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "#232323",
    borderRadius: 16,
    padding: 10,
    width: "88%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  locationText: {
    color: "#3e8cff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
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
  sosButton: {
    backgroundColor: "#3e8cff",
    borderRadius: 100,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: "#3e8cff",
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  sosButtonEmergency: {
    backgroundColor: "#b71c1c",
    shadowColor: "#b71c1c",
  },
  sosText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  countdownText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 38,
    textAlign: "center",
  },
  sosSentText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 2,
  },
  cardText: {
    color: "#ccc",
    fontSize: 15,
    textAlign: "center",
    marginTop: 4,
  },
  assistSection: {
    width: "88%",
    marginBottom: 18,
  },
  assistTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3e8cff",
    marginBottom: 10,
    marginLeft: 2,
  },
  assistRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  assistBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: 64,
    marginHorizontal: 2,
    backgroundColor: "#232323",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  assistLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  illustrationWrap: {
    width: "88%",
    alignItems: "center",
    marginTop: 12,
  },
  illustration: {
    width: "100%",
    height: 120,
    borderRadius: 18,
    resizeMode: "cover",
    opacity: 0.8,
  },
  resetButton: {
    backgroundColor: "#666",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});
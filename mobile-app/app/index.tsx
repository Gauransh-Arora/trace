import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState("Getting location...");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);
  const [route, setRoute] = useState<{
    coordinates: [number, number][];
    distance: number;
    duration: number;
  } | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [riskData, setRiskData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationStatus("Location permission denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setLocationStatus("Location found");

        // Load risk data
        loadRiskData();
      } catch (error) {
        setLocationStatus("Error getting location");
      }
    })();
  }, []);

  const loadRiskData = () => {
    // Sample Patiala risk data (in production, you'd load from CSV)
    const sampleRiskData = [
      {
        latitude: 30.3398,
        longitude: 76.3869,
        severity: 9,
        type: "Dense Forest Area",
      },
      {
        latitude: 30.3156,
        longitude: 76.4012,
        severity: 8,
        type: "Dense Forest Area",
      },
      {
        latitude: 30.2987,
        longitude: 76.3756,
        severity: 7,
        type: "Dense Forest Area",
      },
      {
        latitude: 30.2845,
        longitude: 76.3923,
        severity: 8,
        type: "Isolated Area",
      },
      {
        latitude: 30.3567,
        longitude: 76.4156,
        severity: 7,
        type: "Isolated Area",
      },
      {
        latitude: 30.3234,
        longitude: 76.3845,
        severity: 6,
        type: "Water Body Risk",
      },
      {
        latitude: 30.3089,
        longitude: 76.3967,
        severity: 5,
        type: "Water Body Risk",
      },
      {
        latitude: 30.3445,
        longitude: 76.4023,
        severity: 6,
        type: "Construction Zone",
      },
      {
        latitude: 30.2934,
        longitude: 76.3812,
        severity: 5,
        type: "Construction Zone",
      },
      {
        latitude: 30.3123,
        longitude: 76.3934,
        severity: 7,
        type: "Night Risk Zone",
      },
      {
        latitude: 30.3267,
        longitude: 76.4001,
        severity: 6,
        type: "Night Risk Zone",
      },
      {
        latitude: 30.3501,
        longitude: 76.3723,
        severity: 9,
        type: "Dense Forest Area",
      },
      {
        latitude: 30.2789,
        longitude: 76.3856,
        severity: 8,
        type: "Dense Forest Area",
      },
      {
        latitude: 30.3345,
        longitude: 76.4089,
        severity: 7,
        type: "Dense Forest Area",
      },
      {
        latitude: 30.2678,
        longitude: 76.3945,
        severity: 8,
        type: "Isolated Area",
      },
      {
        latitude: 30.3612,
        longitude: 76.3834,
        severity: 7,
        type: "Isolated Area",
      },
      {
        latitude: 30.3178,
        longitude: 76.3778,
        severity: 6,
        type: "Water Body Risk",
      },
      {
        latitude: 30.3423,
        longitude: 76.3912,
        severity: 5,
        type: "Water Body Risk",
      },
      {
        latitude: 30.3289,
        longitude: 76.4067,
        severity: 6,
        type: "Construction Zone",
      },
      {
        latitude: 30.2856,
        longitude: 76.3789,
        severity: 5,
        type: "Construction Zone",
      },
    ];
    setRiskData(sampleRiskData);
  };

  const toggleHeatmap = () => {
    setShowHeatmap(!showHeatmap);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      // Nominatim Geocoding API (OpenStreetMap) with proper headers
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1&addressdetails=1`,
        {
          headers: {
            "User-Agent": "TRACE-Mobile-App/1.0",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const newDestination = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          name: result.display_name,
        };

        setDestination(newDestination);
        console.log("Found location:", newDestination);

        // Update the map to show the destination
        updateMapWithDestination(newDestination);
      } else {
        console.log("No results found for:", searchQuery);
        // You could show an alert here
      }
    } catch (error) {
      console.error("Geocoding error:", error);

      // Fallback: Try a simple coordinate test for common places
      const fallbackLocations: {
        [key: string]: { lat: number; lon: number; name: string };
      } = {
        "times square": {
          lat: 40.758,
          lon: -73.9855,
          name: "Times Square, New York",
        },
        "eiffel tower": {
          lat: 48.8584,
          lon: 2.2945,
          name: "Eiffel Tower, Paris",
        },
        "big ben": { lat: 51.4994, lon: -0.1245, name: "Big Ben, London" },
        airport: {
          lat: userLocation?.latitude || 0 + 0.1,
          lon: userLocation?.longitude || 0 + 0.1,
          name: "Nearby Airport",
        },
      };

      const searchLower = searchQuery.toLowerCase();
      const fallback = fallbackLocations[searchLower];

      if (fallback) {
        const newDestination = {
          latitude: fallback.lat,
          longitude: fallback.lon,
          name: fallback.name,
        };
        setDestination(newDestination);
        updateMapWithDestination(newDestination);
        console.log("Used fallback location:", newDestination);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const updateMapWithDestination = async (dest: {
    latitude: number;
    longitude: number;
    name: string;
  }) => {
    if (!userLocation) return;

    setIsCalculatingRoute(true);

    try {
      // Calculate route using OSRM (Open Source Routing Machine) - free alternative
      const routeResponse = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLocation.longitude},${userLocation.latitude};${dest.longitude},${dest.latitude}?overview=full&geometries=geojson`,
        {
          headers: {
            "User-Agent": "TRACE-Mobile-App/1.0",
            Accept: "application/json",
          },
        }
      );

      if (!routeResponse.ok) {
        throw new Error(`HTTP error! status: ${routeResponse.status}`);
      }

      const routeData = await routeResponse.json();

      if (routeData.routes && routeData.routes.length > 0) {
        const route = routeData.routes[0];
        const coordinates = route.geometry.coordinates.map(
          (coord: [number, number]) => [
            coord[1], // lat
            coord[0], // lng
          ]
        );

        const distance = route.distance; // meters
        const duration = route.duration; // seconds

        const newRoute = {
          coordinates,
          distance: Math.round((distance / 1000) * 10) / 10, // km with 1 decimal
          duration: Math.round(duration / 60), // minutes
        };

        setRoute(newRoute);
        console.log("Route calculated:", newRoute);
      }
    } catch (error) {
      console.error("Routing error:", error);
      // Fallback: just show destination without route
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDestination(null);
    setRoute(null);
  };

  return (
    <View style={styles.container}>
      {/* Fullscreen Interactive Map */}
      {userLocation ? (
        <WebView
          style={styles.map}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                <script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
                <style>
                  body { margin: 0; padding: 0; }
                  #map { height: 100vh; width: 100vw; }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <script>
                  var map = L.map('map').setView([${userLocation.latitude}, ${
              userLocation.longitude
            }], 13);
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                  }).addTo(map);
                  
                  // User location marker
                  var userMarker = L.marker([${userLocation.latitude}, ${
              userLocation.longitude
            }])
                    .addTo(map)
                    .bindPopup('You are here!');
                    
                  // User location circle
                  var circle = L.circle([${userLocation.latitude}, ${
              userLocation.longitude
            }], {
                    color: '#3e8cff',
                    fillColor: '#3e8cff',
                    fillOpacity: 0.2,
                    radius: 100
                  }).addTo(map);

                  // Risk data for heatmap
                  var riskData = ${JSON.stringify(riskData)};
                  var heatmapLayer = null;
                  
                  // Create heatmap layer
                  function createHeatmap() {
                    if (riskData && riskData.length > 0) {
                      var heatPoints = riskData.map(function(point) {
                        return [point.latitude, point.longitude, point.severity / 10]; // Normalize severity
                      });
                      
                      heatmapLayer = L.heatLayer(heatPoints, {
                        radius: 35,
                        blur: 20,
                        maxZoom: 17,
                        minOpacity: 0.4,
                        max: 1.0,
                        gradient: {
                          0.0: 'rgba(0, 255, 0, 0.8)',    // Bright green for low risk
                          0.2: 'rgba(255, 255, 0, 0.8)',  // Bright yellow for low-medium risk
                          0.4: 'rgba(255, 165, 0, 0.8)',  // Bright orange for medium risk
                          0.6: 'rgba(255, 69, 0, 0.8)',   // Red-orange for high risk
                          0.8: 'rgba(255, 0, 0, 0.8)',    // Bright red for very high risk
                          1.0: 'rgba(139, 0, 0, 0.9)'     // Dark red for extreme risk
                        }
                      });
                    }
                  }
                  
                  // Toggle heatmap visibility
                  function toggleHeatmap(show) {
                    if (show) {
                      if (!heatmapLayer) {
                        createHeatmap();
                      }
                      if (heatmapLayer) {
                        map.addLayer(heatmapLayer);
                      }
                    } else {
                      if (heatmapLayer) {
                        map.removeLayer(heatmapLayer);
                      }
                    }
                  }
                  
                  // Initialize heatmap if needed
                  ${showHeatmap ? "toggleHeatmap(true);" : ""}

                  ${
                    destination
                      ? `
                  // Destination marker
                  var destMarker = L.marker([${destination.latitude}, ${
                          destination.longitude
                        }])
                    .addTo(map)
                    .bindPopup('${destination.name.replace(/'/g, "\\'")}');
                  `
                      : ""
                  }

                  ${
                    route
                      ? `
                  // Route polyline
                  var routeCoords = ${JSON.stringify(route.coordinates)};
                  var routeLine = L.polyline(routeCoords, {
                    color: '#ff3b30',
                    weight: 4,
                    opacity: 0.8
                  }).addTo(map);
                  
                  // Fit map to show both markers and route
                  var group = new L.featureGroup([userMarker, destMarker, routeLine]);
                  map.fitBounds(group.getBounds().pad(0.1));
                  `
                      : destination
                      ? `
                  // Fit map to show both markers
                  var group = new L.featureGroup([userMarker, destMarker]);
                  map.fitBounds(group.getBounds().pad(0.2));
                  `
                      : ""
                  }
                </script>
              </body>
              </html>
            `,
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Ionicons name="map" size={80} color="#3e8cff" />
          <Text style={styles.loadingText}>Loading Map...</Text>
          <Text style={styles.statusText}>{locationStatus}</Text>
        </View>
      )}

      {/* Floating Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
          {(isSearching || isCalculatingRoute) && (
            <View style={styles.loadingIndicator}>
              <Ionicons name="refresh" size={20} color="#3e8cff" />
            </View>
          )}
        </View>
      </View>

      {/* Heatmap Toggle Button */}
      <View style={styles.heatmapContainer}>
        <TouchableOpacity
          style={[
            styles.heatmapButton,
            showHeatmap && styles.heatmapButtonActive,
          ]}
          onPress={toggleHeatmap}
        >
          <Ionicons
            name={showHeatmap ? "eye" : "eye-off"}
            size={20}
            color={showHeatmap ? "#fff" : "#888"}
          />
          <Text
            style={[
              styles.heatmapButtonText,
              showHeatmap && styles.heatmapButtonTextActive,
            ]}
          >
            Risk Map
          </Text>
        </TouchableOpacity>
      </View>

      {/* Route Info Panel */}
      {route && destination && (
        <View style={styles.routeInfoContainer}>
          <View style={styles.routeInfo}>
            <View style={styles.routeStats}>
              <View style={styles.routeStat}>
                <Ionicons name="time" size={16} color="#3e8cff" />
                <Text style={styles.routeStatText}>{route.duration} min</Text>
              </View>
              <View style={styles.routeStat}>
                <Ionicons name="location" size={16} color="#3e8cff" />
                <Text style={styles.routeStatText}>{route.distance} km</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.startButton}>
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={styles.startButtonText}>Start Navigation</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#3e8cff",
    fontWeight: "600",
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  searchBar: {
    backgroundColor: "#262d36",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  routeInfoContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  routeInfo: {
    backgroundColor: "#262d36",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routeStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  routeStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  routeStatText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  startButton: {
    backgroundColor: "#3e8cff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  heatmapContainer: {
    position: "absolute",
    top: 120,
    right: 16,
    zIndex: 1000,
  },
  heatmapButton: {
    backgroundColor: "#262d36",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heatmapButtonActive: {
    backgroundColor: "#ff3b30",
  },
  heatmapButtonText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  heatmapButtonTextActive: {
    color: "#fff",
  },
});

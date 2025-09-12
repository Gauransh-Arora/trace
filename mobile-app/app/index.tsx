// import React, { useState } from "react";
// import { StyleSheet, Text, View, Dimensions } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import * as Location from "expo-location";

// const { width, height } = Dimensions.get("window");

// export default function MapScreen() {
//   const [region, setRegion] = useState({
//     latitude: 19.0760,
//     longitude: 72.8777,
//     latitudeDelta: 0.05,
//     longitudeDelta: 0.05,
//   });
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);

//   // Example destination (Gateway of India, Mumbai)
//   const destination = {
//     latitude: 18.9218,
//     longitude: 72.8346,
//   };

//   // Example route (straight line for demo)
//   const route = userLocation
//     ? [
//         { latitude: userLocation.latitude, longitude: userLocation.longitude },
//         destination,
//       ]
//     : [];

//   React.useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") return;
//       let location = await Location.getCurrentPositionAsync({});
//       setUserLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//       setRegion({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.05,
//         longitudeDelta: 0.05,
//       });
//     })();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Map</Text>
//       <Text style={styles.subtitle}>Interactive map and navigation</Text>
//       <MapView
//         style={styles.map}
//         region={region}
//         showsUserLocation={true}
//         followsUserLocation={true}
//       >
//         {userLocation && (
//           <Marker
//             coordinate={userLocation}
//             title="You"
//             pinColor="#3e8cff"
//           />
//         )}
//         <Marker
//           coordinate={destination}
//           title="Destination"
//           pinColor="#ff3b30"
//         />
//         {route.length === 2 && (
//           <Polyline
//             coordinates={route}
//             strokeColor="#3e8cff"
//             strokeWidth={4}
//           />
//         )}
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#181818",
//     alignItems: "center",
//     paddingTop: 40,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#aaa",
//     marginBottom: 12,
//   },
//   map: {
//     width: width * 0.95,
//     height: height * 0.7,
//     borderRadius: 18,
//     marginTop: 10,
//   },
// });
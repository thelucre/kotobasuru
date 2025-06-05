// src/ui/Map/MapView.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";

// Data
import { locations } from "@/data/locations";

interface MapViewProps {
  onLocationSelect: (locationId: string) => void;
}

export default function MapView({ onLocationSelect }: MapViewProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Link href="/konbini">
        <Text>Go to Konbini</Text>
      </Link>
      <Text style={styles.heading}>🗺️ Choose a Location</Text>
      <View style={styles.grid}>
        {locations.map((loc) => (
          <TouchableOpacity
            key={loc.id}
            style={styles.gridItem}
            onPress={() => onLocationSelect(loc.id)}
          >
            <Text style={styles.kanji}>{loc.kanji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#eee",
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  kanji: {
    fontSize: 20,
    fontWeight: "600",
  },
});

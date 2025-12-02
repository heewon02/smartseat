import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

function AdminPlaceScreen({ navigation }) {
  const places = [
    { id: "11", name: "제1열람실" },
    { id: "12", name: "제2열람실" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>일반열람실</Text>
      <View style={styles.separator} />

      {places.map((room) => (
        <TouchableOpacity
          key={room.id}
          style={styles.item}
          onPress={() =>
            navigation.navigate("AdminRoomScreen", {
              roomId: room.id,
              roomName: room.name,
            })
          }
        >
          <Text style={styles.itemText}>{room.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 16 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5A8DEE",
    marginBottom: 6,
  },
  separator: { height: 1, backgroundColor: "#DADADA", marginBottom: 16 },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#EFEFEF",
  },
  itemText: {
    fontSize: 16,
  },
});

export default AdminPlaceScreen;

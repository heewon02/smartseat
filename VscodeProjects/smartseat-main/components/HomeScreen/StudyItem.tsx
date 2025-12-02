import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

function format(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function StudyItem({ item, selectedId, uiTime, onSelect, onEdit, onDelete }) {
  const isSelected = item.id === selectedId;

  return (
    <View style={styles.list}>
      <TouchableOpacity
        style={[
          styles.circle,
          { backgroundColor: isSelected ? "#5A8DEE" : "#E3EBFF" },
        ]}
        onPress={() => onSelect(item.id)}
      />

      <TouchableOpacity style={styles.item} onPress={onEdit}>
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>

      <View style={styles.timeBox}>
        <Text style={styles.timeText}>
          {isSelected ? format(uiTime) : format(item.time ?? 0)}
        </Text>
      </View>

      {item.id !== "0" ? (
        <TouchableOpacity onPress={onDelete}>
          <Icon name="delete" size={24} color="#000" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 12,
    marginRight: 12,
  },
  item: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "#555",
    fontSize: 16,
  },
  timeBox: {
    width: 90,
    alignItems: "flex-end",
    marginRight: 10,
  },
  timeText: {
    fontSize: 15,
    color: "#333",
    fontVariant: ["tabular-nums"],
  },
});

export default StudyItem;

// components/Reservation/Room/SeatBox.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

function SeatBox({ seatNumber, disabled, onPress, adminColor }) {
  // 🔥 적용할 배경색 결정
  const backgroundColor = adminColor
    ? adminColor                              // 관리자 전용 색상
    : disabled
    ? "#CCCCCC"                                // 기존 disabled 색
    : "#E3EBFF";                               // 기존 available 색

  return (
    <TouchableOpacity
      style={[
        styles.seat,
        { backgroundColor }                    // 🔥 최종 배경색 적용
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.6}
    >
      <Text style={styles.seatText}>{seatNumber}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  seat: {
    width: 40,
    height: 40,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },

  // ⚠ 기존 seatAvailable / seatDisabled는 이제 필요 없음.
  // UI에 적용되지 않으므로 삭제해도 되고 남겨도 됨(미사용).
  seatAvailable: {
    backgroundColor: "#E3EBFF",
    borderWidth: 2,
    borderColor: "#5A8DEE",
  },

  seatDisabled: {
    backgroundColor: "#CCCCCC",
    borderWidth: 2,
    borderColor: "#999999",
  },

  seatText: {
    fontSize: 14,
    color: "#333",
  },
});

export default SeatBox;

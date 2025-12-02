// components/Reservation/Room/SeatGrid.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import SeatBox from "./SeatBox";

interface SeatItem {
  id: string;
  seat_number: number;
  status: string;
  student_number: string;
  room: string;

  // 관리자용 custom color
  adminColor?: string;
}

interface Props {
  seats: SeatItem[];
  seatsPerRow: number;
  onSeatPress: (seat: SeatItem) => void;

  // 🔥 seat의 색상을 외부(AdminRoomScreen)에서 결정하는 함수
  seatColorFn?: (seat: SeatItem) => string;
}

function SeatGrid({ seats, seatsPerRow, onSeatPress, seatColorFn }: Props) {
  const seatRows: SeatItem[][] = [];
  for (let i = 0; i < seats.length; i += seatsPerRow) {
    seatRows.push(seats.slice(i, i + seatsPerRow));
  }

  return (
    <View style={styles.seatContainer}>
      {seatRows.map((row, rowIdx) => (
        <View key={`row-${rowIdx}`} style={styles.seatRow}>
          {row.map((seat) => {
            // 🔥 외부에서 색상 함수를 넘겨줬다면 적용
            const dynamicColor = seatColorFn ? seatColorFn(seat) : undefined;

            return (
              <SeatBox
                key={seat.id}
                seatNumber={seat.seat_number}
                disabled={seat.status !== "none"}
                adminColor={dynamicColor}   // 추가된 부분
                onPress={() => {
                  if (seat.status === "none") {
                    onSeatPress(seat);
                  }
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  seatContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  seatRow: {
    flexDirection: "row",
    marginVertical: 5,
  },
});

export default SeatGrid;

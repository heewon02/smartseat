import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import firestore from "@react-native-firebase/firestore";
import SeatGrid from "../../components/Reservation/Room/SeatGrid";

function AdminRoomScreen({ route }) {
  const { roomId, roomName } = route.params;

  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatAlert, setSeatAlert ] = useState(null);

  useEffect(() => {
    const unsub = firestore()
      .collection("seats")
      .where("room", "==", roomId)
      .onSnapshot((snap) => {
        const list = snap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => a.seat_number - b.seat_number); // 🔥 번호 순 정렬

        setSeats(list);
      });

    return () => unsub();
  }, [roomId]);

  //좌석 클릭
  const handleSeatPress = async (seat) => {
    setSelectedSeat(seat);

    const notifSnap = await firestore()
      .collection("notifications")
      .where("seatId", "==", seat.id)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

      if(!notifSnap.empty){
        const data = notifSnap.docs[0].data();
        if(data.type === "idle"){
          setSeatAlert("90분 이상 자리 비움");
        }else if(data.type === "anomaly"){
          setSeatAlert("90분 이상 이상 압력 감지");
        }
      }else{
        setSeatAlert("상태 정보 없음");
      }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{roomName}</Text>

        <SeatGrid
        seats={seats}
        seatsPerRow={6}
        seatColorFn={(seat) => 
            seat.status === "empty" || seat.status === "object"
            ? "#FF6B6B"   // 빨간색
            : "#D9ECFF"   // 파란색
        }
        onSeatPress={(seat) => setSelectedSeat(seat)}
        />



      {/* Modal */}
      <Modal visible={!!selectedSeat} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{roomName}</Text>
            <Text style={styles.modalSeat}>
              {selectedSeat?.seat_number}번 좌석
            </Text>
            <Text style={styles.modalSeat}>
              상태: {selectedSeat?.status}
            </Text>

            <TouchableOpacity
              onPress={() => setSelectedSeat(null)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 16 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5A8DEE",
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "70%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalSeat: { fontSize: 16, marginBottom: 10 },
  closeBtn: {
    backgroundColor: "#5A8DEE",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  closeText: { color: "white", fontWeight: "bold" },
});

export default AdminRoomScreen;

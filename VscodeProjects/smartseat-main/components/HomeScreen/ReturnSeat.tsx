import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useUserContext } from '../../contexts/UserContext';
import firestore from '@react-native-firebase/firestore';

function ReturnSeat({ seat }) {
  const { user, setUser } = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);

  const hasSeat = !!user?.seatId; // seatLabel 대신 seatId 기준으로 체크


  const seatIdToLabel = (seatId: string) => {
    if (!seatId) return "";

    const parts = seatId.split("_");
    if (parts.length !== 3) return seatId;

    const room = parts[1];        // 1
    const num = parts[2];         // 1

    return `제${room}열람실 ${num}번`;
  };


  const handleReturn = async () => {
    try {
        
      const seatId = user?.seatId;
      if (!seatId) {
        Alert.alert("오류", "현재 예약된 좌석이 없습니다.");
        return;
      }

      // 🔥 seatId(문서 ID)로 seats 문서 직접 업데이트
      await firestore().collection("seats").doc(seatId).update({
        status: "none",
        reservedSt: "",
        reservedEd: "",
        student_number: "",
        isStudying: false,
      });

      // 🔥 users 문서 업데이트 (seatId / seatLabel 모두 비우기)
      await firestore().collection("users").doc(user.uid).update({
        seatId: "",
      });

      // 🔥 UserContext 업데이트
      setUser(prev => ({
        ...prev,
        seatId: "",
      }));

      setModalVisible(false);
      Alert.alert("반납 완료", "좌석이 성공적으로 반납되었습니다.");

    } catch (e) {
      console.log("❌ 반납 오류:", e);
      setModalVisible(false);
      Alert.alert("오류", "좌석 반납 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.reserveText}>
            예약좌석: {hasSeat ? seatIdToLabel(user.seatId) : ""}
        </Text>

        <TouchableOpacity
          style={[styles.returnButton, !hasSeat && { opacity: 0 }]}
          disabled={!hasSeat}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.returnText}>반납</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>좌석을 반납하시겠습니까?</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#5A8DEE" }]}
                onPress={handleReturn}
              >
                <Text style={{ color: "white" }}>반납</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default ReturnSeat;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA'
  },
  reserveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  returnButton: {
    backgroundColor: '#5A8DEE',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  returnText: {
    color: 'white',
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    backgroundColor: "white",
    width: "75%",
    borderRadius: 12,
    padding: 20
  },
  modalText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center"
  }
});

import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useUserContext } from "../../contexts/UserContext";
import { clearSeat } from "../../lib/users";
import { clearSeatStatus } from "../../lib/seats";

function NowInfo() {
  const { user, setUser } = useUserContext();
  const [reservedSt, setReservedSt] = useState("00:00");
  const [reservedEd, setReservedEd] = useState("00:00");

  /** 좌석 Label → 좌석 문서 ID 찾기 */
  const findSeatDocId = async (seatLabel) => {
    if (!seatLabel) return null;

    const parts = seatLabel.trim().split(/\s+/); // ["제1열람실", "3번"]
    if (parts.length < 2) return null;

    const roomName = parts[0];
    const seatNum = parseInt(parts[1].replace("번", ""), 10);

    const roomMap = {
      "제1열람실": "11",
      "제2-1열람실": "21",
      "제2-2열람실": "22",
      "제2-2열람실(대학원생전용)": "23"
    };

    const roomId = roomMap[roomName];
    if (!roomId) return null;

    const snap = await firestore()
      .collection("seats")
      .where("room", "==", roomId)
      .where("seat_number", "==", seatNum)
      .limit(1)
      .get();

    return snap.empty ? null : snap.docs[0].id;
  };

  /** 예약 시간 가져오기 */
  useEffect(() => {
    const loadSeatInfo = async () => {
      if (!user?.seatId) return;

      const seatDocId = await findSeatDocId(user.seatId);
      if (!seatDocId) return;

      const doc = await firestore().collection("seats").doc(seatDocId).get();
      if (!doc.exists) return;

      const data = doc.data();
      setReservedSt(data.reservedSt || "00:00");
      setReservedEd(data.reservedEd || "00:00");
    };

    loadSeatInfo();
  }, [user?.seatId]);

  /** 반납 기능 */
  const handleReturn = async () => {
    try {
      const seatId = user.seatId;
      const seatDocId = await findSeatDocId(seatId);

      if (seatDocId) {
        await clearSeatStatus(seatDocId);
      }

      await clearSeat(user.uid);

      setUser((prev) => ({ ...prev, seatId: "" }));
      setReservedSt("00:00");
      setReservedEd("00:00");

      Alert.alert("반납 완료", "좌석이 성공적으로 반납되었습니다.");
    } catch (e) {
      console.log("반납 오류:", e);
      Alert.alert("오류", "좌석 반납 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.contentList}>

      {/* 예약 좌석 */}
      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>예약좌석</Text>

        <View style={styles.rightGroup}>
          <Text style={styles.contentText}>{user?.seatId || "-"}</Text>

          {user?.seatId ? (
            <TouchableOpacity style={styles.returnButton} onPress={handleReturn}>
              <Text style={styles.returnButtonText}>반납</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* 예약 시간 */}
      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>예약시간</Text>
        <Text style={styles.contentText}>
          {reservedSt} ~ {reservedEd}
        </Text>
      </View>

      {/* 아래 항목은 추후 Firestore 연동 예정 */}
      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>공부시작시간</Text>
        <Text style={styles.contentText}>00:00</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>공부시간</Text>
        <Text style={styles.contentText}>00:00</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>쉬는시간</Text>
        <Text style={styles.contentText}>00:00</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentList: { flex: 1 },

  contentBox:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },

  contentTitle: { fontSize: 15, color: '#828282', marginLeft: 24 },
  contentText: { fontSize: 15, color: '#828282', marginRight: 24 },

  rightGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  returnButton: {
    backgroundColor: '#005bac',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  returnButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NowInfo;

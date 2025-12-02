import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import firestore from "@react-native-firebase/firestore";
import { useUserContext } from "../../contexts/UserContext";

function DailyInfo() {
  const { user } = useUserContext();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [targetTime, setTargetTime] = useState("00:00");
  const [goalMinutes, setGoalMinutes] = useState(0);

  const [showTimeModal, setShowTimeModal] = useState(false);

  // 🔥 오늘 공부시간(분)
  const [todayStudyMin, setTodayStudyMin] = useState(0); // 나중에 실제 값 넣으면 됨

  // 시간 리스트 생성
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const formatted = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      timeOptions.push(formatted);
    }
  }

  const formatDate = (date) =>
    `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;

  const handlePrevDay = () =>
    setSelectedDate(
      (prev) => new Date(prev.setDate(prev.getDate() - 1))
    );

  const handleNextDay = () =>
    setSelectedDate(
      (prev) => new Date(prev.setDate(prev.getDate() + 1))
    );

  const openDatePicker = () => setShowDatePicker(true);

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const openTimeModal = () => setShowTimeModal(true);
  const closeTimeModal = () => setShowTimeModal(false);

  // 🔥 Firestore에서 목표시간 로드
  useEffect(() => {
    if (!user?.uid) return;

    const unsub = firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const g = doc.data().goals || 0;
          setGoalMinutes(g);

          const h = Math.floor(g / 60)
            .toString()
            .padStart(2, "0");
          const m = (g % 60).toString().padStart(2, "0");

          setTargetTime(`${h}:${m}`);
        }
      });

    return () => unsub();
  }, [user?.uid]);

  // 🔥 목표 시간 선택 → Firestore 반영
  const selectTime = async (time) => {
    setTargetTime(time);
    closeTimeModal();

    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m;

    setGoalMinutes(total);

    try {
      await firestore().collection("users").doc(user.uid).update({
        goals: total,
      });
    } catch (e) {
      console.log("목표시간 저장 오류:", e);
      Alert.alert("오류", "목표 시간을 저장할 수 없습니다.");
    }
  };

  // 🔥 그래프 = 오늘 공부시간 기준으로 계산
  const progressPercent =
    goalMinutes === 0 ? 0 : Math.min(todayStudyMin / goalMinutes, 1) * 100;

  return (
    <View style={styles.contentList}>
      {/* 날짜 선택바 */}
      <View style={styles.dateBar}>
        <TouchableOpacity onPress={handlePrevDay}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={openDatePicker}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNextDay}>
          <Icon name="chevron-right" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 공부시작시간 */}
      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>공부시작시간</Text>
        <Text style={styles.contentText}>00:00</Text>
      </View>

      {/* 목표시간 */}
      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>목표 시간</Text>
        <View style={styles.rightGroup}>
          <Text style={styles.contentText}>{targetTime}</Text>
          <TouchableOpacity onPress={openTimeModal}>
            <Icon name="arrow-drop-down" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 목표시간 Modal */}
      <Modal visible={showTimeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>목표 시간 선택</Text>
            <FlatList
              data={timeOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.timeItem}
                  onPress={() => selectTime(item)}
                >
                  <Text style={styles.timeText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={closeTimeModal}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 오늘 공부시간 (항상 오늘 기준) */}
      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>오늘공부시간</Text>
        <Text style={styles.contentText}>
          {String(Math.floor(todayStudyMin / 60)).padStart(2, "0")}:
          {String(todayStudyMin % 60).padStart(2, "0")}
        </Text>
      </View>

      {/* 쉬는시간 */}
      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>쉬는시간</Text>
        <Text style={styles.contentText}>00:00</Text>
      </View>

      {/* 그래프 — 항상 오늘 기준 */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressFill,
            { width: `${progressPercent}%` },
          ]}
        />
        <View style={styles.progressRemain} />
      </View>

      <View style={styles.progressLabel}>
        <Text style={styles.graphLabel}>오늘 공부시간</Text>
        <Text style={styles.graphLabel}>목표시간</Text>
      </View>

      {/* 날짜 선택기 */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

export default DailyInfo;

/* 🔥 기존 CSS 전부 그대로 유지 */
const styles = StyleSheet.create({
  contentList: {
    flex: 1,
  },

  contentBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    width: "100%",
  },

  contentTitle: {
    fontSize: 15,
    color: "#828282",
    marginLeft: 24,
  },

  contentText: {
    fontSize: 15,
    color: "#828282",
    marginRight: 24,
  },

  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  progressContainer: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 6,
    marginTop: 20,
    overflow: "hidden",
  },

  progressFill: {
    backgroundColor: "#005bac",
  },

  progressRemain: {
    flex: 1,
    backgroundColor: "#ddd",
  },

  progressLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    marginTop: 8,
  },

  graphLabel: {
    color: "#555",
    fontSize: 14,
  },

  dateBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf0fb",
    paddingVertical: 8,
    paddingHorizontal: 20,
  },

  dateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    height: "70%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  timeItem: {
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  timeText: {
    fontSize: 18,
    color: "#333",
  },

  closeButton: {
    backgroundColor: "#005bac",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  closeText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});

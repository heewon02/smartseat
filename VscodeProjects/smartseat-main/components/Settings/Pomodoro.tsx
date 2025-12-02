import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useUserContext } from "../../contexts/UserContext";
import notifee, { TimestampTrigger, TriggerType } from "@notifee/react-native";

function Pomodoro() {
  const { user, setUser } = useUserContext();
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(user?.pomodoro || "00:00");

  /** Timer options (00:00 ~ 02:00, every 10min) */
  const timerOptions = [];
  for (let h = 0; h <= 0; h++) {
    for (let m = 0; m < 60; m += 1) {
      if (h === 2 && m > 0) break;
      const formatted = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      timerOptions.push(formatted);
    }
  }

  /** Notification channel 생성 */
  async function createChannel() {
    await notifee.createChannel({
      id: "pomodoro",
      name: "Pomodoro Timer Alerts",
      importance: 4,
      sound: "default",
    });
  }

  useEffect(() => {
    createChannel();
  }, []);

  /** 알림 예약 함수 */
  async function scheduleNotification(minutes) {
    const timestamp = Date.now() + minutes * 60 * 1000;

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp,
      alarmManager: true,
    };

    await notifee.createTriggerNotification(
      {
        title: "휴식을 취할 시간입니다",
        body: "포모도로 타이머가 종료되었습니다.",
        android: { channelId: "pomodoro" },
      },
      trigger
    );
  }

  /** Firestore + Context + Notification 저장 */
  const savePomodoro = async () => {
    try {
      await firestore().collection("users").doc(user.uid).update({
        pomodoro: selectedTime,
      });

      setUser((prev) => ({ ...prev, pomodoro: selectedTime }));

      // minutes 계산
      const mins =
        parseInt(selectedTime.split(":")[0]) * 60 +
        parseInt(selectedTime.split(":")[1]);

      await scheduleNotification(mins);

      Alert.alert("저장됨", "포모도로 타이머가 설정되었습니다.");
      setShowTimerModal(false);
    } catch (e) {
      console.log(e);
      Alert.alert("오류", "포모도로 시간을 저장할 수 없습니다.");
    }
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>포모도로 타이머</Text>

      <TouchableOpacity
        style={styles.rightGroup}
        onPress={() => setShowTimerModal(true)}
      >
        <Text style={styles.value}>{selectedTime}</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={showTimerModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>포모도로 시간 설정</Text>

            <FlatList
              data={timerOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.timerItem,
                    item === selectedTime && styles.selectedItem,
                  ]}
                  onPress={() => setSelectedTime(item)}
                >
                  <Text
                    style={[
                      styles.timerText,
                      item === selectedTime && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.saveButton} onPress={savePomodoro}>
              <Text style={styles.saveText}>저장</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTimerModal(false)}
            >
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= 스타일 ================= */

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  label: { fontSize: 16, color: "#555" },
  rightGroup: { flexDirection: "row", alignItems: "center", gap: 10 },
  value: { fontSize: 16, color: "#333" },

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
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  timerItem: {
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  timerText: { fontSize: 18, color: "#333" },
  selectedItem: { backgroundColor: "#D3E3FF" },
  selectedText: { color: "#005bac", fontWeight: "bold" },

  saveButton: {
    backgroundColor: "#005bac",
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  saveText: { color: "white", textAlign: "center", fontWeight: "600", fontSize: 16 },

  closeButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  closeText: { textAlign: "center", fontWeight: "600", fontSize: 16 },
});

export default Pomodoro;

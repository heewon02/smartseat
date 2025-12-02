import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useUserContext } from "../../contexts/UserContext";

function TodayTimer() {
  const { user } = useUserContext();
  const [display, setDisplay] = useState("00:00");

  const userUnsubRef = useRef(null);
  const seatUnsubRef = useRef(null);

  const format = (min: number) => {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  // users/{uid}.TotalStudyTime 실시간 구독
  useEffect(() => {
    if (!user?.uid) return;

    const ref = firestore().collection("users").doc(user.uid);

    userUnsubRef.current = ref.onSnapshot((snap) => {
      if (!snap.exists) return;
      const total = snap.data().TotalStudyTime ?? 0;

      if (!user.seatId) {
        setDisplay(format(total));
      }
    });

    return () => {
      if (userUnsubRef.current) userUnsubRef.current();
    };
  }, [user]);

  // 좌석 변화 → 최신 TotalStudyTime만 표시
  useEffect(() => {
    if (!user?.seatId) return;

    const seatRef = firestore().collection("seats").doc(user.seatId);

    seatUnsubRef.current = seatRef.onSnapshot(async () => {
      const snap = await firestore()
        .collection("users")
        .doc(user.uid)
        .get();

      const total = snap.data()?.TotalStudyTime ?? 0;
      setDisplay(format(total));
    });

    return () => {
      if (seatUnsubRef.current) seatUnsubRef.current();
    };
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Text style={styles.text}>{display}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6F0FF",
    height: "60%",
  },
  circle: {
    width: 275,
    height: 275,
    borderRadius: 200,
    borderWidth: 10,
    borderColor: "#5A8DEE",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 60,
    color: "#828282",
    fontWeight: "400",
  },
});

export default TodayTimer;

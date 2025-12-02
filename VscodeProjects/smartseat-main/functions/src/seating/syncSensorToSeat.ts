import { onValueWritten } from "firebase-functions/v2/database";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const syncSensorToSeat = onValueWritten(
  {
    ref: "/sensors/{seatId}/status",
    region: "asia-southeast1",
  },
  async (event) => {
    const seatId = event.params.seatId;

    const newSensorState = event.data.after.val();
    const before = event.data.before.val();

    console.log(
      `syncSensorToSeat 실행 | seatId=${seatId}, before=${before}, after=${newSensorState}`
    );

    // 값 변경이 없으면 종료
    if (newSensorState === before) {
      console.log("변경 없음 → 종료");
      return;
    }

    let newStatus = "";
    if (newSensorState === "human") newStatus = "occupied";
    if (newSensorState === "empty") newStatus = "empty";
    if (newSensorState === "object") newStatus = "object";

    if (!newStatus) {
      console.log(`알 수 없는 상태 → ${newSensorState}`);
      return;
    }

    // Firestore 좌석 상태 업데이트
    await db.collection("seats").doc(seatId).update({
      status: newStatus,
    });

    console.log(`Firestore seat/${seatId} → status=${newStatus} 업데이트 완료`);
  }
);

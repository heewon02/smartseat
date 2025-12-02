import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const reserveEnd = onSchedule(
    {
        region: "asia-northeast3",
        schedule: "every 1 minutes",
        timeZone: "Asia/Seoul",
    }, async () => {

  const now = new Date();

  // KST 변환
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const current = kst.toTimeString().slice(0, 5);  // "HH:MM"

  logger.log("현재시간(KST):", current);

  // 1️⃣ reservedEd == current 인 좌석 찾기
  const seatsSnap = await db
    .collection("seats")
    .where("reservedEd", "==", current)
    .get();

  for (const doc of seatsSnap.docs) {
    const seatId = doc.id;    // 예: "seat_1_1"

    logger.log(`⏱ 자동 반납 처리: ${seatId}`);

    // 2️⃣ studylogs 중 seatId 일치하는 가장 최근 로그 찾기
    const logsSnap = await db
      .collection("studylogs")
      .where("seatId", "==", seatId)
      .orderBy("occupiedAt", "desc")
      .limit(1)
      .get();

    if (!logsSnap.empty) {
      await logsSnap.docs[0].ref.update({
        lastSeated: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 3️⃣ 이 좌석을 사용한 user 찾기
    const userSnap = await db
      .collection("users")
      .where("seatId", "==", seatId)
      .limit(1)
      .get();

    if (!userSnap.empty) {
      await userSnap.docs[0].ref.update({
        seatId: "",
      });
    }

    // 4️⃣ seats 문서 초기화
    await doc.ref.set({
    status: "none",
    reservedSt: "",
    reservedEd: "",
    student_number: "",
    occupiedAt: null,
    lastSeated: null,
    lastChecked: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    logger.log(`✔ 자동 반납 완료: ${seatId}`);
  }

  return;
});

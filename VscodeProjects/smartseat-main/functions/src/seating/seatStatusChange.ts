// import { onDocumentUpdated } from "firebase-functions/v2/firestore";
// import * as logger from "firebase-functions/logger";
// import * as admin from "firebase-admin";

// admin.initializeApp();
// const db = admin.firestore();

// /**
//  * 좌석 상태 변화 감지 (v2)
//  * empty → occupied : 착석
//  * occupied → empty : 자리비움
//  */
// export const seatStatusChange = onDocumentUpdated(
//     {
//         document:   "seats/{seatId}",
//         region : 'asia-northeast3',
//     },  
//   async (event) => {
//     const before = event.data?.before.data();
//     const after = event.data?.after.data();
//     const seatId = event.params.seatId;

//     if (!before || !after) return;

//     const now = admin.firestore.Timestamp.now();

//     /* ------------------------------
//        1) 착석 감지 (empty → occupied)
//     ------------------------------ */
//     if (before.status === "empty" && after.status === "occupied") {
//       await event.data?.after.ref.update({
//         occupiedAt: now,
//         lastChecked: now,
//         isStudying: true,
//       });

//       const { student_number, reservedSt, reservedEd } = after;

//       // 기존 로그 존재 여부 확인
//       const existing = await db
//         .collection("studylogs")
//         .where("seatId", "==", seatId)
//         .where("reservedSt", "==", reservedSt)
//         .where("reservedEd", "==", reservedEd)
//         .limit(1)
//         .get();

//       if (existing.empty) {
//         await db.collection("studylogs").add({
//           uid: after.uid ?? "",
//           seatId,
//           student_number,
//           reservedSt,
//           reservedEd,
//           occupiedAt: now,
//           totalTime: 0,
//           createdAt: now,
//         });
//         logger.log(`📘 새 studylog 생성 seat=${seatId}`);
//       } else {
//         // 이미 있는 경우 → 시간 초기화
//         await existing.docs[0].ref.update({
//           occupiedAt: now,
//         });
//         logger.log(`📘 기존 studylog 재사용 seat=${seatId}`);
//       }

//       return;
//     }

//     /* ------------------------------
//        2) 자리 비움 감지 (occupied → empty)
//     ------------------------------ */
//     if (before.status === "occupied" && after.status === "empty") {
//       await event.data?.after.ref.update({
//         lastSeated: now,
//         lastChecked: now,
//         isStudying: false,
//       });

//       const logs = await db
//         .collection("studylogs")
//         .where("seatId", "==", seatId)
//         .orderBy("createdAt", "desc")
//         .limit(1)
//         .get();

//       if (!logs.empty) {
//         const logRef = logs.docs[0].ref;
//         const log = logs.docs[0].data();

//         const occupiedAt = log.occupiedAt;
//         const total = log.totalTime ?? 0;

//         if (occupiedAt) {
//           const diff = now.toMillis() - occupiedAt.toMillis(); // ms 경과 시간
//           await logRef.update({
//             totalTime: total + diff,
//             lastSeated: now,
//           });
//           logger.log(
//             `⏱ 총 공부 시간 업데이트 seat=${seatId} / +${diff}ms / total=${
//               total + diff
//             }ms`
//           );
//         }
//       }

//       return;
//     }

//     return;
//   }
// );

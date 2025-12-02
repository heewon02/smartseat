// // functions/src/changeSubject.ts
// import { onCall, CallableRequest } from "firebase-functions/v2/https";
// import * as admin from "firebase-admin";

// admin.initializeApp();
// const db = admin.firestore();

// export const changeSubject = onCall(
//   { region: "asia-northeast3" },
//   async (req: CallableRequest) => {

//     const uid = req.auth?.uid;
//     const { subjectName, seatId } = req.data;

//     if (!uid) throw new Error("UNAUTHENTICATED");
//     if (!subjectName || !seatId) throw new Error("INVALID_REQUEST");

//     // 가장 최근 studylog 찾기
//     const snap = await db.collection("studylogs")
//       .where("uid", "==", uid)
//       .where("seatId", "==", seatId)
//       .orderBy("occupiedAt", "desc")
//       .limit(1)
//       .get();

//     if (snap.empty) return;

//     await snap.docs[0].ref.update({
//       subject: admin.firestore.FieldValue.arrayUnion({
//         subjectName,
//         studyTime: 0,
//       }),
//     });
//   }
// );

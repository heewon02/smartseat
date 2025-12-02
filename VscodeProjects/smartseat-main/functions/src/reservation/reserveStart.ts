// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";

// const db = admin.firestore();

// //예약 시간이 되면 seat의 status를 empty로 변경
// export const reserveStart = functions.pubsub
//     .schedule("every 1 minutes")
//     .onRun(async () => {
//         const now = new Date();
//         const current = now.toTimeString().slice(0, 5); // HH:MM

//         const seatsSnap = await db.collection("seats")
//             .where("reservedSt", "==", current)
//             .where("status", "==", "none")
//             .get();

//         for (const doc of seatsSnap.docs) {

//             const seatId = doc.id; //seatId
//             const seatData = doc.data();
//             const student_number = seatData.student_number;

//             await doc.ref.update({
//                 status: "empty",
//                 lastChecked: admin.firestore.FieldValue.serverTimestamp(),
//             });

//             const userSnap = await db.collection("users")
//                 .where("student_number", "==", student_number)
//                 .limit(1)
//                 .get();

//             if (!userSnap.empty) {
//                     await userSnap.docs[0].ref.update({
//                         seatId: seatId,
//                     });
//             }

//             console.log(`예약 시작: seat ${doc.id}`);
//         }

//         return null;
//     });
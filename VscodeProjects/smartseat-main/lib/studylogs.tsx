// lib/studylogs.ts

import firestore from "@react-native-firebase/firestore";

export async function getTodayTotalTime(uid) {
  const snapshot = await firestore()
    .collection("studylogs")
    .where("uid", "==", uid)
    .limit(1)
    .get();

  if (snapshot.empty) return 0;
  return snapshot.docs[0].data().totalTime ?? 0;
}
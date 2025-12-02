import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

export default async function saveAdminToken(uid) {
  try {
    const token = await messaging().getToken();
    console.log("현재 FCM 토큰:", token);

    const userRef = firestore().doc(`users/${uid}`);

    await userRef.set(
      { fcmToken: token },
      { merge: true }
    );

    console.log("Firestore에 관리자 토큰 저장 완료!");

  } catch (e) {
    console.error("관리자 FCM 토큰 저장 오류:", e);
  }
}

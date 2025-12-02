import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

export default async function saveUserToken(uid) {
  try {
    const token = await messaging().getToken();
    console.log("현재 FCM 토큰:", token);

    const userRef = firestore().doc(`users/${uid}`);

    await userRef.set(
      { fcmToken: token },
      { merge: true }
    );

    console.log("Firestore에 사용자 토큰 저장 완료!");

  } catch (e) {
    console.error("사용자 FCM 토큰 저장 오류:", e);
  }
}

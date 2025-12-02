// App.js 또는 가장 상위 컴포넌트에서 실행
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
      console.log("🔁 새로운 FCM 토큰 감지:", newToken);

      const user = auth().currentUser;
      if (!user) return;

      await firestore()
        .collection("users")
        .doc(user.uid)
        .set({ fcmToken: newToken }, { merge: true });

      console.log("🔁 Firestore에 토큰 자동 갱신 완료");
    });

    return unsubscribe;
  }, []);

  return (
    // 나머지 App 내용
  );
}

export default App;

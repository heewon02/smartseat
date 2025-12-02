// screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TodayTimer from '../components/HomeScreen/TodayTimer';
import ReturnSeat from '../components/HomeScreen/ReturnSeat';
import StudyList from '../components/HomeScreen/StudyList';
import { useUserContext } from '../contexts/UserContext';
import { getSubjects } from '../lib/users';
import { useSelectedSubject } from '../contexts/SelectedSubjectContext';
import firestore from '@react-native-firebase/firestore';

function HomeScreen() {
  const { user, setUser } = useUserContext();
  const [subjects, setSubjects] = useState([]);
  const { setSelectedSubject } = useSelectedSubject();

  /** ------------------------------
   * ① Firestore 실시간 구독
   *    seatId 변경 → 즉시 반영
   * ------------------------------ */
    useEffect(() => {
        if (!user?.uid) return;

        const unsub = firestore()
        .collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
            if (doc.exists) {
            const data = doc.data();

            // uid는 유지하면서 user 업데이트
            setUser(prev => ({
                ...prev,
                ...data,
                uid: prev.uid
            }));
            }
        });

        return () => unsub();
    }, [user?.uid]);

    useEffect(() => {
        if (!user?.uid) return;

        const load = async () => {
        const data = await getSubjects(user.uid); 
        setSubjects(data);     // ⭐ 변환 제거
        };

        load();
    }, [user]);

    console.log(user);
    console.log("Project ID = ", firestore().app?.options.projectId);
  /** ------------------------------
   * ③ 선택된 과목(Context에 저장)
   * ------------------------------ */
  useEffect(() => {
    const current = subjects.find(s => s.selected);
    setSelectedSubject(current ? current.name : null);
  }, [subjects]);

  return (
    
    <View style={styles.container}>
      <TodayTimer />

      <ReturnSeat seat={user?.seatId ?? ''} />

      <StudyList subjects={subjects} setSubjects={setSubjects} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
});

export default HomeScreen;




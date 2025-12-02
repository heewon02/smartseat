import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection("users");

// 유저 전체 로드
export const getUser = async (uid) => {
  const doc = await usersCollection.doc(uid).get();
  if (!doc.exists) return null;
  return { uid: doc.id, ...doc.data() };
};

// 신규 유저 생성
export const createUser = async ({ id, profileExtra }) => {
  await usersCollection.doc(id).set({
    id,
    subject: {},  // MAP 구조
    ...profileExtra,
  });
};

// subjects 불러오기 (Map → Array)
export async function getSubjects(uid) {
  const doc = await usersCollection.doc(uid).get();
  if (!doc.exists) return [];

  const data = doc.data();
  if (!data.subject) return [];

  const subjectMap = data.subject;

    return Object.keys(subjectMap).map((key) => ({
    id: key,
    name: subjectMap[key].name,
    selected: subjectMap[key].selected,
    time: subjectMap[key].time ?? 0,    // 🔥 time 포함
    }));
}

// subjects 저장하기 (Array → Map)
export async function updateSubjects(uid, arr) {
  const map = {};
  arr.forEach((s) => {
    map[s.id] = { 
      name: s.name, 
      selected: s.selected,
      time: s.time ?? 0,        // 🔥 time 저장
    };
  });

  await firestore().collection("users").doc(uid).update({ subject: map });
}


// 좌석 해제 용도
export async function clearSeat(uid) {
  await usersCollection.doc(uid).update({
    seatLabel: "",
  });
}

// 오늘 전체 공부 시간 가져오기
export const getTodayTotalTime = async (uid) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const todayKey = `${yyyy}-${mm}-${dd}`;

  const doc = await firestore()
    .collection("studylogs")
    .doc(uid)
    .collection("daily")
    .doc(todayKey)
    .get();

  if (!doc.exists) return 0;

  return doc.data()?.dailyTotalTime ?? 0;
};

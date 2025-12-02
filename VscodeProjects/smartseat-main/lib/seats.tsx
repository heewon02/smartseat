// lib/seats.tsx
import firestore from '@react-native-firebase/firestore';

/** 방(roomId) 기준 좌석 목록 가져오기 */
export async function getSeatsByRoom(roomId) {
  const snapshot = await firestore()
    .collection("seats")
    .where("room", "==", roomId)
    .get();

  return snapshot.docs.map((doc) => ({
    seatId: doc.id,               // 🔥 seatId 필드는 문서 id!
    ...doc.data(),
  }));
}


/** 방(roomId) 기준 좌석 수 */
export async function getSeatCountByRoom(roomId: string) {
  const snapshot = await firestore()
    .collection('seats')
    .where('room', '==', roomId)
    .get();

  return snapshot.size;
}

/** roomId → 한글 열람실 이름 */
export function roomIdToName(roomId: string) {
  switch (roomId) {
    case '11':
      return '제1열람실';
    case '21':
      return '제2-1열람실';
    case '22':
      return '제2-2열람실';
    case '23':
      return '제2-2열람실 (대학원생 전용)';
    default:
      return roomId;
  }
}

/**
 * 좌석 예약 트랜잭션
 * - seats/{seatDocId} 갱신
 * - users/{uid}/seatId 갱신
 * - studylogs/{uid} 생성(or merge)
 */
export async function reserveSeat({
  seatDocId,
  roomId,
  seatNumber,
  user,
}: {
  seatDocId: string;
  roomId: string;
  seatNumber: number | string;
  user: {
    uid: string;
    student_number: string;
    selectedSubject: string;
  };
}) {
  const db = firestore();

  const seatRef = db.collection('seats').doc(seatDocId);
  const userRef = db.collection('users').doc(user.uid);
  const studyRef = db.collection('studylogs').doc();

  await db.runTransaction(async (tx) => {
    const [seatSnap, userSnap] = await Promise.all([
      tx.get(seatRef),
      tx.get(userRef),
    ]);

    if (!seatSnap.exists) throw new Error('NO_SEAT');

    const seatData: any = seatSnap.data();
    const userData: any = userSnap.data();

    if (seatData.status !== 'none') throw new Error('SEAT_ALREADY_RESERVED');
    if (userData?.seatId && userData.seatId !== '') throw new Error('USER_ALREADY_HAS_SEAT');

    const now = new Date();
    const z = (n: number) => String(n).padStart(2, "0");

    const reservedSt = `${z(now.getHours())}:${z(now.getMinutes())}`;
    const end = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    const reservedEd = `${z(end.getHours())}:${z(end.getMinutes())}`;

    const roomName = roomIdToName(roomId);
    const seatLabel = `${roomName}-${seatNumber}번`;

    tx.update(seatRef, {
      student_number: user.student_number,
      status: 'empty',
      reservedSt,
      reservedEd,
      lastSeated: now,
      occupiedAt: now,
      seatLabel,
      studylogId: studyRef.id,
    });

    tx.update(userRef, {
        seatId: seatDocId,
        selectedSubject: user.selectedSubject ?? "",
    } );

    // ⭐ 새 로그 문서를 생성
    tx.set(studyRef, {
      uid: user.uid,
      seatId: seatDocId,
      lastSeated: null,
      occupiedAt: null,
      student_number: user.student_number,
      totalTime: 0,
      createdAt: now,   // 🔥 추가 (로그 정렬용)
      studylogId: studyRef.id,
      subject: [
        {
          subjectName: user.selectedSubject,
          studyTime: 0,
        },
      ],
    });
  });
}


export const clearSeatStatus = async (seatDocId: string) => {
  await firestore().collection("seats").doc(seatDocId).update({
    reservedSt: "",
    reservedEd: "",
    status: "none",
    student_number: "",
  });
};
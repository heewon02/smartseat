import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../contexts/UserContext";

/**
 * selectedSubjectId: 현재 선택된 과목 ID
 * subjects: [{ id, name, time, selected }]
 */
export function useStudyTimer(selectedSubjectId, subjects) {
  const { user } = useUserContext();
  const [uiTime, setUiTime] = useState(0);
  const intervalRef = useRef(null);

  const getSelectedTimeFromDB = () => {
    const sub = subjects.find((s) => s.id === selectedSubjectId);
    return sub?.time ?? 0;
  };

  // 🔥 과목이 바뀌면 UI 타이머 초기화
  useEffect(() => {
    stopTimer();

    const baseTime = getSelectedTimeFromDB();
    setUiTime(baseTime);

    if (user?.seatId) {
      startTimer();
    }

    return stopTimer;
  }, [selectedSubjectId, subjects]);

  // 🔥 좌석 반납/자리비움 → 타이머 멈춤
  useEffect(() => {
    if (!user?.seatId) stopTimer();
  }, [user?.seatId]);

  const startTimer = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setUiTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return uiTime;
}

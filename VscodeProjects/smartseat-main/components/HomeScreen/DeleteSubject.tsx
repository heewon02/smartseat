import firestore from "@react-native-firebase/firestore";
import { updateSubjects } from "../../lib/users";
import { useUserContext } from "../../contexts/UserContext";

export default function useDeleteSubject(subjects, setSubjects) {
  const { user } = useUserContext();

  const deleteSubject = async (id) => {
    if (id === "0") return;

    // 🔵 삭제 대상 과목
    const target = subjects.find((s) => s.id === id);
    const wasSelected = target?.selected;

    // 🔵 삭제 반영
    const updated = subjects.filter((s) => s.id !== id);

    // 상태 업데이트
    setSubjects(updated);
    await updateSubjects(user.uid, updated);

    // 🔥 삭제한 과목이 선택되어 있었다면
    if (wasSelected) {
      const first = updated[0];

      if (first) {
        // 첫 번째 과목을 다시 선택
        const newUpdated = updated.map((s) =>
          s.id === first.id ? { ...s, selected: true } : { ...s, selected: false }
        );

        // 상태 업데이트
        setSubjects(newUpdated);
        await updateSubjects(user.uid, newUpdated);

        // Firestore에도 selectedSubject 수정
        await firestore()
          .collection("users")
          .doc(user.uid)
          .update({
            selectedSubject: first.name,
          });
      } else {
        // 🔥 더 이상 과목이 없다면 선택 과목 값 제거
        await firestore()
          .collection("users")
          .doc(user.uid)
          .update({
            selectedSubject: "",
          });
      }
    }
  };

  // 🔥 반드시 return 해야 함!!!
  return { deleteSubject };
}

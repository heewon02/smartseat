import React, { useState } from "react";
import { FlatList } from "react-native";
import StudyItem from "./StudyItem";
import AddSubject from "./AddSubject";
import EditSubject from "./EditSubject";
import useDeleteSubject from "./DeleteSubject";
import { updateSubjects } from "../../lib/users";
import firestore from "@react-native-firebase/firestore";
import { useUserContext } from "../../contexts/UserContext";
import { useStudyTimer } from "../../components/HomeScreen/useStudyTimer";

function StudyList({ subjects, setSubjects }) {
  const { user } = useUserContext();

  const [editVisible, setEditVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [newName, setNewName] = useState("");

  const { deleteSubject } = useDeleteSubject(subjects, setSubjects);

  // 🔥 선택된 과목 ID
  const selected = subjects.find((s) => s.selected);
  const selectedId = selected?.id ?? null;

  // 🔥 UI 타이머 (1초 단위 증가)
  const uiTime = useStudyTimer(selectedId, subjects);

  // 🔵 과목 선택
  const toggleSelect = async (id) => {
    const updated = subjects.map((s) => ({
      ...s,
      selected: s.id === id,
    }));

    setSubjects(updated);
    await updateSubjects(user.uid, updated);

    // 🔥 Firestore 반영
    const selected = updated.find((s) => s.selected);
    await firestore().collection("users").doc(user.uid).update({
      selectedSubject: selected?.name ?? "",
    });
  };

  const openEdit = (sub) => {
    if (sub.id === "0") return;
    setEditingSubject(sub);
    setNewName(sub.name);
    setEditVisible(true);
  };

  return (
    <>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudyItem
            item={item}
            selectedId={selectedId}
            uiTime={uiTime}
            onSelect={toggleSelect}
            onEdit={() => openEdit(item)}
            onDelete={() => deleteSubject(item.id)}
          />
        )}
        ListFooterComponent={
          <AddSubject subjects={subjects} setSubjects={setSubjects} />
        }
      />

      <EditSubject
        visible={editVisible}
        setVisible={setEditVisible}
        editingSubject={editingSubject}
        newName={newName}
        setNewName={setNewName}
        subjects={subjects}
        setSubjects={setSubjects}
        syncToFirestore={async (updated) =>
          await updateSubjects(user.uid, updated)
        }
      />
    </>
  );
}

export default StudyList;

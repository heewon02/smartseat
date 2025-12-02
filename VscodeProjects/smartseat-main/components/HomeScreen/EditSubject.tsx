import React from "react";
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from "react-native";

function EditSubject({
  visible,
  setVisible,
  editingSubject,
  newName,
  setNewName,
  subjects,
  setSubjects,
  syncToFirestore,
}) {
  if (!editingSubject) return null;

  const saveEdit = async () => {
    if (!newName.trim()) {
      Alert.alert("입력 오류", "과목을 입력하세요.");
      return;
    }

    const updated = subjects.map((s) =>
      s.id === editingSubject.id ? { ...s, name: newName } : s
    );

    setSubjects(updated);
    await syncToFirestore(updated);

    // 🔥 선택된 과목이면 Firestore selectedSubject도 갱신
    if (editingSubject.selected) {
      await firestore()
        .collection("users")
        .doc(user.uid)
        .update({
          selectedSubject: newName,
        });
    }

    setVisible(false);
  };  // ← 여기까지만 필요!

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>과목 수정</Text>

          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
          />

          <TouchableOpacity style={styles.button} onPress={saveEdit}>
            <Text style={styles.buttonText}>저장</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#888", marginTop: 8 }]}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default EditSubject;

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  box: { width: "85%", padding: 20, borderRadius: 10, backgroundColor: "white" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: "#ddd",
    borderRadius: 8, padding: 10, marginBottom: 20,
  },
  button: {
    padding: 12, borderRadius: 8, backgroundColor: "#5A8DEE",
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "600" },
});

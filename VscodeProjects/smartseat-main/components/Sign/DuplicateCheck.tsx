import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { checkDuplicateUser } from '../../lib/users';

function DuplicateCheck({ type, value, onValid }) {
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!value.trim()) {
      Alert.alert(
        '입력 오류',
        `${type === 'student_number' ? '학번' : '닉네임'}을 입력하세요.`
      );
      return;
    }

    try {
      setLoading(true);
      const isDuplicate = await checkDuplicateUser(type, value);

      if (isDuplicate) {
        Alert.alert(
          '중복',
          type === 'student_number'
            ? '이미 사용 중인 학번입니다.'
            : '이미 사용 중인 닉네임입니다.'
        );
        onValid(false);
      } else {
        Alert.alert(
          '확인 완료',
          type === 'student_number'
            ? '사용 가능한 학번입니다!'
            : '사용 가능한 닉네임입니다!'
        );
        onValid(true);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '중복 확인 중 문제가 발생했습니다.');
      onValid(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleCheck}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <Text style={styles.text}>중복확인</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#005bac',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#E8F0FE',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#005bac',
  },
});

export default DuplicateCheck;

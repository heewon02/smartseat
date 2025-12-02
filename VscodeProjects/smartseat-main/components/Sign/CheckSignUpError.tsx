// components/Sign/CheckSignUpError.tsx
import { Alert } from 'react-native';
import {
  isValidName,
  isValidPassword,
  isValidNickname,
} from './CheckRegEx';

/**
 * 회원가입 입력값 검증 함수
 * @param {object} form - 회원가입 입력 데이터
 * @param {object} duplicateValid - 중복확인 결과 (student_number, nickname)
 * @returns {boolean} true면 통과, false면 실패
 */
export default function checkSignUpError(form, duplicateValid) {
  const { name, student_number, password, confirmPassword, nickname, department } = form;

    // 이름
    if (!name || name.length < 2 || name.length > 40) {
        Alert.alert('입력 오류', '이름은 2자 이상 40자 이하로 입력하세요.');
        return false;
    }

    if (!isValidName(name)) {
        Alert.alert('입력 오류', '이름은 한글 또는 영어만 입력 가능합니다.');
        return false;
    }

    // 학번
    if (!student_number || student_number.length < 8) {
        Alert.alert('입력 오류', '올바른 학번을 입력하세요.');
        return false;
    }

    if (isNaN(Number(student_number))) {
        Alert.alert('입력 오류', '학번은 숫자만 입력할 수 있습니다.');
        return false;
    }

    // 비밀번호
    if (!password || password.length < 6 || password.length > 16) {
        Alert.alert('입력 오류', '비밀번호는 6~16자리여야 합니다.');
        return false;
    }

    if (!isValidPassword(password)) {
        Alert.alert(
            '입력 오류',
            '비밀번호는 영어, 숫자, 특수기호만 사용할 수 있습니다.'
        );
        return false;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
        Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
        return false;
    }

    // 닉네임
    if (!nickname || nickname.length < 1 || nickname.length > 8) {
        Alert.alert('입력 오류', '닉네임은 1~8글자 이내로 입력하세요.');
        return false;
    }

    if (!isValidNickname(nickname)) {
        Alert.alert('입력 오류', '닉네임은 한글, 영어, 숫자만 입력 가능합니다.');
        return false;
    }

    // 학과
    if (!department) {
        Alert.alert('입력 오류', '학과를 입력하세요.');
        return false;
    }

    // 중복확인
    if (!duplicateValid.student_number || !duplicateValid.nickname) {
        Alert.alert('중복 확인 필요', '학번과 닉네임 중복확인을 완료하세요.');
        return false;
    }

    return true;
}

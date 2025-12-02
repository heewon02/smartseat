import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signIn } from '../../lib/auth';
import { getUser } from '../../lib/users';
import { useUserContext } from '../../contexts/UserContext';
import PWFind from '../../components/Sign/PWFind';

//관리자 토큰 저장
import saveAdminToken from '../../src/saveAdminToken';
//사용자 토큰 저장
import saveUserToken from '../../src/saveUserToken';

function SignInScreen({ navigation }) {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserContext();
  const [pwModal, setPwModal] = useState(false);


  const handleLogin = async () => {
    if (!studentNumber || !password) {
      Alert.alert('오류', '학번과 비밀번호를 입력하세요.');
      return;
    }

    const DOMAIN = 'inha.edu';
    const email = `${String(studentNumber).trim()}@${DOMAIN}`;

    try {
      setLoading(true);
      const { user } = await signIn({ email, password });
      const profile = await getUser(user.uid);

      if (!profile) {
        Alert.alert('로그인 실패', '등록된 회원이 아닙니다.');
        return;
      }

      setUser(profile);

      //관리자 FCM 토큰 저장
      if (profile.isadmin === true) {
        try {
          await saveAdminToken(user.uid);
        } catch (e) {
          console.log("관리자 토큰 저장 실패:", e);
        }
      }

      //사용자 FCM 토큰 저장
      if (profile.isadmin === false) {
        try {
          await saveUserToken(user.uid);
        } catch (e) {
          console.log("사용자 토큰 저장 실패:", e);
        }
      }


    } catch (e) {
      console.log(e);
      Alert.alert('로그인 실패', '학번 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>로그인</Text>

        <TextInput
          style={styles.input}
          placeholder="학번"
          keyboardType="number-pad"
          value={studentNumber}
          onChangeText={setStudentNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>{loading ? '로그인 중...' : '로그인'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>회원가입</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => setPwModal(true)}
            style={{ marginTop: 16 }}
        >
            <Text style={{ textAlign: 'center', color: '#005bac' }}>
                비밀번호 찾기
            </Text>
        </TouchableOpacity>
    <PWFind
        visible={pwModal}
        onClose={() => setPwModal(false)}
    />
      </SafeAreaView>


    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 48,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#005bac',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 16,
    fontSize: 15,
    color: '#005bac',
    fontWeight: '600',
  },
});

export default SignInScreen;

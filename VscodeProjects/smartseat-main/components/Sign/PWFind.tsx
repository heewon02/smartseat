import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { sendResetEmail } from '../../lib/auth';

function PWFind({ visible, onClose }) {
    const [student, setStudent] = useState('');

    const handleSend = async () => {
        if (!student.trim()) {
            Alert.alert("오류", "학번을 입력하세요.");
            return;
        }

        const email = `${student.trim()}@inha.edu`;

        try {
            await sendResetEmail(email);
            Alert.alert(
                "메일 전송됨",
                `${email} 주소로 비밀번호 재설정 메일을 보냈습니다.`
            );
            onClose();
            setStudent('');
        } catch (e) {
            console.log(e);
            Alert.alert("오류", "해당 학번의 계정이 존재하지 않습니다.");
        }
    };

    console.log(visible);

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>비밀번호 찾기</Text>

                    <TextInput
                        style={styles.input}
                        value={student}
                        onChangeText={setStudent}
                        placeholder="학번"
                        keyboardType="numeric"
                    />

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#ccc' }]}
                            onPress={onClose}
                        >
                            <Text>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#5A8DEE' }]}
                            onPress={handleSend}
                        >
                            <Text style={{ color: '#fff' }}>전송</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    container: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: 'center',
    },
});

export default PWFind;

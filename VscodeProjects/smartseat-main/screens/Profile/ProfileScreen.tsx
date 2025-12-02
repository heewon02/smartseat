import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUserContext } from '../../contexts/UserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Inha from '../../assets/inha.svg';
import NowInfo from '../../components/Profile/NowInfo';
import DailyInfo from '../../components/Profile/DailyInfo';
import MonthInfo from '../../components/Profile/MonthInfo';

function ProfileScreen({ navigation }) {
    const { user } = useUserContext();
    const [selectedTab, setSelectedTab] = useState('자리');

    /** 좌석 코드 변환 함수 */
    const convertSeatCode = (seatLabel) => {
        if (!seatLabel) return "-";

        const parts = seatLabel.trim().split(/\s+/); // ["제1열람실", "3번"]
        if (parts.length < 2) return "-";

        const roomName = parts[0];
        const seatNum = parseInt(parts[1].replace("번",""), 10);

        let roomCode = "0-0";

        if (roomName === "제1열람실") roomCode = "1-1";
        if (roomName === "제2-1열람실") roomCode = "2-1";
        if (roomName === "제2-2열람실") roomCode = "2-2";
        if (roomName.includes("대학원생")) roomCode = "2-2";

        return `${roomCode}-${seatNum}`;
    };

    /** 상단 바 간단 정보 */
    const BriefContent = () => {
        return(
            <View style={styles.StateBar}>
                <View style={styles.StateItem}>
                    <Text style={styles.StateBarLabel}>공부 시간</Text>
                    <Text style={styles.StateBarValue}>00:00</Text>
                </View>
                <View style={styles.StateItem}>
                    <Text style={styles.StateBarLabel}>목표 시간</Text>
                    <Text style={styles.StateBarValue}>00:00</Text>
                </View>
                <View style={styles.StateItem}>
                    <Text style={styles.StateBarLabel}>내 좌석</Text>
                    <Text style={styles.StateBarValue}>
                        {convertSeatCode(user?.seatLabel)}
                    </Text>
                </View>
            </View>
        );
    };

    const renderContent = () => {
        switch(selectedTab) {
            case '자리':
                return <NowInfo />;

            case '일별':
                return <DailyInfo />;

            case '월별':
                return <MonthInfo />;

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {/* 상단 프로필 */}
            <View style={styles.header}>
                <View style={styles.imageWrapper}>
                    <Inha width={67} height={67}/>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.header_first}>
                        <Text style={styles.nickname}>{user?.nickname}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                            <Icon name="settings" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.studentNumber}>{user?.student_number}</Text>
                </View>
            </View>

            {/* 탭 */}
            <View style={styles.tabContainer}>
                {['자리', '일별', '월별'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabItem, selectedTab === tab && styles.activeTab]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {BriefContent()}

            <View style={styles.content}>
                {renderContent()}
            </View>
        </View>
    );
}

/* ========================= 스타일 ========================= */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#d3e3ff',
        height: '20%',
    },

    imageWrapper: {
        width: 67,
        height: 67,
        borderRadius: 33.5,
        overflow: 'hidden',
        marginRight: 16,
    },

    infoContainer: { flex: 1 },

    header_first:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    nickname: { fontSize: 30, fontWeight: 'bold' },
    studentNumber: { fontSize: 20, color: '#555' },

    StateBar: {
        backgroundColor: '#A2C6FC',
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    StateItem: { alignItems: 'center' },

    StateBarLabel: {
        color: '#828282',
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '600',
    },

    StateBarValue: {
        color: '#828282',
        fontSize: 18,
        fontWeight: 'bold',
    },

    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#d3e3ff',
        borderBottomWidth: 1,
        borderBottomColor: '#4D8CEB'
    },
    
    tabItem: {
        paddingVertical: 10,
        flex: 1,
        alignItems: 'center',
        opacity: 0.4,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent'
    },

    activeTab: {
        opacity: 1,
        borderBottomColor: '#4D8CEB'
    },

    tabText: { fontSize: 16, color: '#4D8CEB' },
    activeTabText: { fontWeight: 'bold' },

    content: { flex: 1 }
});

export default ProfileScreen;

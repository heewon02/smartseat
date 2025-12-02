import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, Pressable} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

function Calendar() {
    const today = new Date(2025, 10, 11); // JS에서 10은 11월
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);

    //하드코딩
    const studyData = {
        12: 60,
        13: 240,
        14: 420,
        15: 600,
    };

    // 월 이동
    const prevMonth = () => {
        if (month === 1) {
        setMonth(12);
        setYear((prev) => prev - 1);
        } else {
        setMonth((prev) => prev - 1);
        }
    };

    const nextMonth = () => {
        if (month === 12) {
        setMonth(1);
        setYear((prev) => prev + 1);
        } else {
        setMonth((prev) => prev + 1);
        }
    };

    // 해당 월의 일 수 계산
    const daysInMonth = new Date(year, month, 0).getDate();

    // 첫 번째 날 요일 (0:일, 6:토)
    const firstDay = new Date(year, month - 1, 1).getDay();

    // 색상 계산
    const getColorByTime = (time) => {
        if (time >= 600) return "#72A6F3";
        if (time >= 420) return "#A2C6FC";
        if (time >= 240) return "#D3E3FF";
        if (time > 0) return "#EEF4FF";
        return "transparent";
    };

    // 날짜 클릭
    const handlePressDate = (day) => {
        setSelectedDate(day);
        setShowModal(true);
    };

    // 달력 데이터 구성
    const calendarCells = [];
    for (let i = 0; i < firstDay; i++) {
        calendarCells.push(null); // 앞 빈칸
    }
    for (let d = 1; d <= daysInMonth; d++) {
        calendarCells.push(d);
    }

    // 평균/목표 달성 일수 (임시)
    const averageTime = "05:30";
    const goalDays = 3;

    return (
        <View style={styles.container}>
            <Text style={styles.yearText}>{year}</Text>

            <View style={styles.monthBar}>
                <TouchableOpacity onPress={prevMonth}>
                    <Icon name="chevron-left" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.monthText}>{month}월</Text>
                <TouchableOpacity onPress={nextMonth}>
                    <Icon name="chevron-right" size={28} color="#333" />
                </TouchableOpacity>
            </View>


            <View style={styles.summaryBox}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>하루 평균 공부 시간</Text>
                    <Text style={styles.summaryValue}>{averageTime}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>목표 달성 일수</Text>
                    <Text style={styles.summaryValue}>{goalDays}일</Text>
                </View>
            </View>

        {/* 요일 */}
        <View style={styles.weekRow}>
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                (w, idx) => 
                    (
                        <Text
                            key={idx}
                            style={
                                [
                                    styles.weekText,
                                    idx === 0 && { color: "red" },
                                    idx === 6 && { color: "#005bac" },
                                ]
                            }
                        >
                            {w}
                        </Text>
                    )
                )
            }
        </View>

        {/* 달력 */}
        <View style={styles.calendarGrid}>
            {calendarCells.map(
                (day, index) => 
                    {
                        const time = studyData[day] || null;
                        return (
                            <TouchableOpacity
                            key={index}
                            style=
                            {
                                [
                                    styles.dayCell,
                                    { backgroundColor: getColorByTime(time) },
                                ]
                            }
                                onPress={
                                    () => day && handlePressDate(day)
                                }
                                disabled={!day}
                            >

                            {day && (
                            <>
                                <Text style={styles.dayText}>{day}</Text>
                                {time && (
                                    () => 
                                        {
                                            const hours = Math.floor(time / 60);
                                            const minutes = time % 60;
                                            const dateformatted = `${hours}:${minutes.toString().padStart(2, "0")}`;

                                            return <Text style={styles.timeText}>{dateformatted}</Text>;
                                        }
                                    )
                                ()
                                }
                            </>
                            )}
                            </TouchableOpacity>
                        );
                    }
                )
            }
        </View>

        <Modal
            visible={showModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.modalTitle}>
                        {year}년 {month}월 {selectedDate}일
                    </Text>
                    <Pressable onPress={() => setShowModal(false)} style={styles.closeButton}>
                        <Text style={styles.closeText}>닫기</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
        </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "white", 
        alignItems: "center" 
    },

    yearText: {
        fontSize: 28,
        fontWeight: "600",
        color: "#555",
        marginTop: 20,
    },

    monthBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },

    monthText: { 
        fontSize: 40, 
        fontWeight: "600", 
        marginHorizontal: 20, 
        color: "#444" 
    },

    todayText: { 
        fontSize: 16, 
        color: "#666", 
        marginBottom: 10 
    },

    summaryBox: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "90%",
        marginBottom: 10,
    },
  
    summaryItem: { 
        alignItems: "center" 
    },

    summaryLabel: { 
        fontSize: 14, 
        color: "#666", 
        marginBottom: 4 
    },

    summaryValue: { 
        fontSize: 16, 
        fontWeight: "600", 
        color: "#555" 
    },

    weekRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        paddingVertical: 6,
    },

    weekText: { 
        fontSize: 14, 
        color: "#555", 
        width: "14.28%", 
        textAlign: "center" 
    },

    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        paddingHorizontal: 4,
    },

    dayCell: {
        width: "14.28%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: "#eee",
    },

    dayText: { 
        fontSize: 14, 
        color: "#333" 
    },

    timeText: { 
        fontSize: 12, 
        color: "#333" 
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    modalBox: {
        width: "70%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
    },

    modalTitle: { 
        fontSize: 18,
        fontWeight: "600", 
        marginBottom: 10 
    },

    closeButton: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: "#005bac",
        borderRadius: 8,
    },

    closeText: { 
        color: "white", 
        fontWeight: "600" 
    },
});

export default Calendar;

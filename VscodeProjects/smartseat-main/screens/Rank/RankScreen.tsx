import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

function RankScreen() {
  const [selectedTab, setSelectedTab] = useState("전체 랭킹");
  const [expandedDept, setExpandedDept] = useState(null);

    // 하드코딩
    const totalRanking = [
        { id: 1, name: "망고", time: "00:00:00" },
        { id: 2, name: "사과", time: "00:00:00"}, 
        { id: 3, name: "딸기", time: "00:00:00" }, 
        { id: 4, name: "바나나", time: "00:00:00" },
        { id: 5, name: "메론", time: "00:00:00" },
        { id: 6, name: "수박", time: "00:00:00" },
        { id: 7, name: "체리", time: "00:00:00" },
    ];

    const departmentData = [
        {
        id: "DS",
        name: "데이터사이언스학과",
        ranking: 
            [
                { id: 1, name: "망고", time: "00:00:00" },
                { id: 2, name: "메론", time: "00:00:00" },
                { id: 3, name: "수박", time: "00:00:00" },
                { id: 4, name: "체리", time: "00:00:00" },
                { id: 5, name: "자두", time: "00:00:00" },
            ],
        },

        {
        id: "CE",
        name: "컴퓨터공학과",
        ranking: 
            [
                { id: 1, name: "망고", time: "00:00:00" },
                { id: 2, name: "메론", time: "00:00:00" },
                { id: 3, name: "수박", time: "00:00:00" },
                { id: 4, name: "체리", time: "00:00:00" },
                { id: 5, name: "자두", time: "00:00:00" },
                { id: 6, name: "포도", time: "00:00:00" },
                { id: 7, name: "참외", time: "00:00:00" },
            ],
        },

        {
        id: "EE",
        name: "전기공학과",
        ranking: 
            [
                { id: 1, name: "망고", time: "00:00:00" },
                { id: 2, name: "사과", time: "00:00:00" },
                { id: 3, name: "딸기", time: "00:00:00" },
                { id: 4, name: "바나나", time: "00:00:00" },
            ],
        },
    ];

    const renderMedalRow = ({ item, index }) => {
        let medalColor = null;
        if (index === 0) medalColor = "#FFD700"; 
        else if (index === 1) medalColor = "#C0C0C0"; 
        else if (index === 2) medalColor = "#CD7F32";

        return (
        <View style={styles.rankRow}>
            <View style={styles.rankLeft}>
                <View
                    style={[
                    styles.circle,
                    { backgroundColor: medalColor ? medalColor : "#FFF" },
                    ]}
                />
                <Text style={styles.name}>{item.name}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
        </View>
        );
    };

    const renderDept = (dept) => {
        const expanded = expandedDept === dept.id;
        return (
        <View key={dept.id} style={styles.deptBox}>
            <TouchableOpacity
                onPress=
                {
                    () => setExpandedDept(expanded ? null : dept.id)
                }
                style={styles.deptHeader}
            >
                <Text style={styles.deptArrow}>
                    {expanded ? "▲" : "▼"} {dept.name}
                </Text>
            </TouchableOpacity>

            {expanded && (
            <FlatList
                data={dept.ranking}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMedalRow}
            />
            )}
        </View>
        );
    };


    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {["전체 랭킹", "학과 랭킹"].map
                    (
                        (tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabItem, selectedTab === tab && styles.activeTab]}
                                onPress={() => setSelectedTab(tab)}
                            >
                                <Text
                                style=
                                    {
                                        [
                                            styles.tabText,
                                            selectedTab === tab && styles.activeTabText,
                                        ]
                                    }
                                >
                                {tab}
                                </Text>
                            </TouchableOpacity>
                        )
                    )
                }
            </View>

            {selectedTab === "전체 랭킹" ? (
                <>
                    <View style={styles.myRankBox}>
                        <Text style={styles.myRankLabel}>내 등수</Text>
                        <Text style={styles.myRankValue}>100</Text>
                    </View>

                    <FlatList
                        data={totalRanking}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderMedalRow}
                        contentContainerStyle={styles.listContainer}
                    />
                </>
            ) : (
                    <View style={styles.deptListContainer}>
                        {departmentData.map((dept) => renderDept(dept))}
                    </View>
                )
            }
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    tabContainer: {
        flexDirection: "row",
        alignItems: 'flex-end',
        justifyContent: "space-around",
        borderBottomColor: "#e0e0e0",
        borderBottomWidth: 1,
        height: '10%',
    },

    tabItem: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
    },

    tabText: {
        color: "#999",
        fontSize: 16,
    },

    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#4D8CEB",
    },

    activeTabText: {
        color: "#4D8CEB",
        fontWeight: "bold",
    },

    myRankBox: {
        backgroundColor: "#D3E3FF",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
        height: '20%',
    },

    myRankLabel: {
        fontSize: 18,
        color: "#555",
        marginBottom: 8,
    },

    myRankValue: {
        fontSize: 64,
        fontWeight: "bold",
        color: "#666",
    },

    listContainer: {
        paddingBottom: 30,
    },

    rankRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
        paddingVertical: 12,
        paddingHorizontal: 28,
    },

    rankLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 12,
    },

    name: {
        fontSize: 16,
        color: "#333",
    },

    time: {
        fontSize: 15,
        color: "#555",
        marginRight: 20, 
    },

    deptListContainer: { 
        paddingVertical: 10
    },
    deptBox: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
    },

    deptHeader: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
    },

    deptArrow: {
        fontSize: 16,
        color: "#333",
    },
});

export default RankScreen;

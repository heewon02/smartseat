import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

function TabBar({ selectedTab, onSelect }) {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tabItem, selectedTab === 'reading_room' && styles.activeTab]}
        onPress={() => onSelect('reading_room')}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab === 'reading_room' && styles.activeTabText
          ]}
        >
          일반열람실
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    tabBar: {
        height: '20%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        marginBottom: 8,
    },

    tabItem: {
        marginRight: 16,
        paddingBottom: 6,
    },

    tabText: {
        fontSize: 16,
        color: '#666',
    },

    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#5A8DEE',
    },
    
    activeTabText: {
        color: '#5A8DEE',
        fontWeight: 'bold',
    },
});

export default TabBar;

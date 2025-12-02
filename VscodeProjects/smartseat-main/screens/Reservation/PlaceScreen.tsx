import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TabBar from '../../components/Reservation/Place/TabBar';
import RoomList from '../../components/Reservation/Place/RoomList';

function PlaceScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('reading_room');

  return (
    <View style={styles.container}>
      <TabBar selectedTab={selectedTab} onSelect={setSelectedTab} />

      <View style={styles.separator} />

      <RoomList selectedTab={selectedTab} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  separator: { height: 1, backgroundColor: '#DADADA' },
});

export default PlaceScreen;

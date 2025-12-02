import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { getSeatCountByRoom } from '../../../lib/seats';

const ROOMS = [
  { id: '11', name: '제1열람실', type: 'reading_room' },
  { id: '21', name: '제2-1열람실', type: 'reading_room' },
  { id: '22', name: '제2-2열람실', type: 'reading_room' },
  { id: '23', name: '제2-2열람실 (대학원생 전용)', type: 'reading_room' },
];

function RoomList({ selectedTab, navigation }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      const result = [];

      for (const room of ROOMS) {
        const count = await getSeatCountByRoom(room.id);
        result.push({ ...room, seats: count });
      }

      setRooms(result);
    };
    fetchCounts();
  }, []);

  const filteredRooms = rooms.filter(room => room.type === selectedTab);

  return (
    <FlatList
      data={filteredRooms}
      numColumns={2}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={{ justifyContent: 'space-around' }}
      renderItem={
        ({ item }) => (
                <TouchableOpacity
                    style={styles.roomButton}
                    onPress={
                        () => navigation.navigate('Room', {
                                roomName: item.name,
                                roomId: item.id,
                            }
                        )
                    }
                >
                    <View style={styles.circle}>
                        <Text style={styles.circleText}>{item.seats ?? 0}</Text>
                    </View>

                    <Text style={styles.roomName}>{item.name}</Text>
                    
                </TouchableOpacity>
            )
        }
    />
  );
}

const styles = StyleSheet.create({
    roomButton: {
        alignItems: 'center',
        marginVertical: 20,
    },
    circle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 6,
        borderColor: '#5A8DEE',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    circleText: {
        fontSize: 16,
        color: '#555',
    },
    roomName: {
        marginTop: 8,
        fontSize: 14,
        color: '#555',
    },
});

export default RoomList;

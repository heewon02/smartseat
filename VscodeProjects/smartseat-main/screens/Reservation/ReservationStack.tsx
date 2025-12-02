import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlaceScreen from './PlaceScreen';
import RoomScreen from './RoomScreen';

const Stack = createNativeStackNavigator();

function ReservationStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Place" component={PlaceScreen} />
            <Stack.Screen name="Room" component={RoomScreen} />
        </Stack.Navigator>
    );
}

export default ReservationStack;

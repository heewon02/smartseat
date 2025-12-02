import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RankScreen from './RankScreen';

const Stack = createNativeStackNavigator();

function RankStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Rank" component={RankScreen} />
    </Stack.Navigator>
  );
}

export default RankStack;

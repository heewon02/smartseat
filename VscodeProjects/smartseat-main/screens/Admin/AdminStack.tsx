import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminTab from "./AdminTab";
import AdminPlaceScreen from "./AdminPlaceScreen";
import AdminRoomScreen from "./AdminRoomScreen";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTab" component={AdminTab} />
      <Stack.Screen name="AdminPlaceScreen" component={AdminPlaceScreen} />
      <Stack.Screen name="AdminRoomScreen" component={AdminRoomScreen} />
    </Stack.Navigator>
  );
}

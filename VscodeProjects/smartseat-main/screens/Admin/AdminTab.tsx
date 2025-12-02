import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

import AdminPlaceScreen from "./AdminPlaceScreen";
import SettingsScreen from "../Settings/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function AdminTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#005bac",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tab.Screen
        name="AdminPlaces"
        component={AdminPlaceScreen}
        options={{
          title: "자리관리",
          tabBarIcon: ({ color }) => (
            <Icon name="chair-alt" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AdminSettings"
        component={SettingsScreen}
        options={{
          title: "설정",
          tabBarIcon: ({ color }) => (
            <Icon name="settings" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserContext } from "../contexts/UserContext";
import { subscribeAuth } from "../lib/auth";
import { getUser } from "../lib/users";

import SignInScreen from "./Sign/SignInScreen";
import SignUpScreen from "./Sign/SignUpScreen";
import MainTab from "./MainTab";
import AdminStack from "./Admin/AdminStack";

const Stack = createNativeStackNavigator();

// 🔵 인증(로그인/회원가입) 전용 네비게이터
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

// 🔵 앱 내부(일반 사용자 + 관리자) 네비게이터
function AppStack({ isadmin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isadmin ? (
        <Stack.Screen name="AdminStack" component={AdminStack} />
      ) : (
        <Stack.Screen name="MainTab" component={MainTab} />
      )}
    </Stack.Navigator>
  );
}

export default function RootStack() {
  const { user, setUser } = useUserContext();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = subscribeAuth(async (currentUser) => {
      if (currentUser) {
        const profile = await getUser(currentUser.uid);
        setUser(profile ?? null);
      } else {
        setUser(null);
      }
      setInitializing(false);
    });
    return unsub;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5A8DEE" />
      </View>
    );
  }

  // 🔥 핵심: 인증 여부에 따라 전체 네비게이터를 교체함
  if (!user) {
    return <AuthStack />;
  }

  return <AppStack isadmin={user.isadmin} />;
}

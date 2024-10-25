import * as React from "react";
import { Text, View } from "react-native";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from "./BottomNavigation";
import { RootStackParamList } from "../types/StackParamlist";
import VideoPlayer from "../screens/VideoPlayer";
import CategoryScreen from "../screens/CategoryScreen";

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function NavigationSafeMode() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTab" component={TabNavigation} />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            animation: "slide_from_right",
          }}
        />

        <Stack.Screen
          name="VideoPlayer"
          component={VideoPlayer}
          options={{
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

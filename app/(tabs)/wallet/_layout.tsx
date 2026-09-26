import React from "react";
import { Stack } from "expo-router";

export default function WalletStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0F172A" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="fund-wallet" />
    </Stack>
  );
}

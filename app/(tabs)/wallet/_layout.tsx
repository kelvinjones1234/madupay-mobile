import React from "react";
import { Stack } from "expo-router";
import { colors } from "../../../src/theme/colors";

export default function WalletStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.ditto.canvas },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="fund-wallet" />
    </Stack>
  );
}

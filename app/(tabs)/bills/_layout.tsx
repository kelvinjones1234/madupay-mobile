import React from "react";
import { Stack } from "expo-router";

export default function BillsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0F172A" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="bills" />
      <Stack.Screen name="airtime" />
      <Stack.Screen name="data" />
      <Stack.Screen name="electricity" />
      <Stack.Screen name="cable" />
    </Stack>
  );
}

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Button } from "../../src/components/Button";

export default function WelcomeScreen() {
  const router = useRouter();

  const features = [
    {
      icon: "flash-outline" as const,
      title: "Instant Bill Payments",
      description: "Airtime, internet data, electricity, and cable TV top-ups in seconds.",
    },
    {
      icon: "wallet-outline" as const,
      title: "Smart Virtual Wallet",
      description: "Dedicated NGN account numbers for automatic wallet funding.",
    },
    {
      icon: "shield-checkmark-outline" as const,
      title: "Bank-Grade Security",
      description: "Enterprise encryption and idempotent transaction safety.",
    },
  ];

  return (
    <ScreenWrapper className="justify-between py-6">
      {/* Top Header Branding */}
      <View className="items-center mt-8">
        <View className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 items-center justify-center mb-4">
          <Ionicons name="wallet" size={32} color="#818CF8" />
        </View>
        <Text className="text-3xl font-extrabold text-white tracking-tight">
          Madu<Text className="text-indigo-400">Pay</Text>
        </Text>
        <Text className="text-slate-400 text-sm mt-1 text-center font-medium">
          Fast, Reliable Payments & Virtual Wallets
        </Text>
      </View>

      {/* Feature Highlights */}
      <View className="my-8 space-y-4">
        {features.map((item, index) => (
          <View
            key={index}
            className="flex-row items-center bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-3"
          >
            <View className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center mr-4">
              <Ionicons name={item.icon} size={22} color="#818CF8" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base mb-0.5">
                {item.title}
              </Text>
              <Text className="text-slate-400 text-xs leading-4">
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA Buttons */}
      <View className="w-full space-y-3 pb-4">
        <Button
          title="Create an Account"
          onPress={() => router.push("/(auth)/register")}
          size="lg"
          className="mb-3"
        />

        <Button
          title="Sign In to Existing Account"
          onPress={() => router.push("/(auth)/login")}
          variant="secondary"
          size="lg"
        />

        <View className="flex-row items-center justify-center mt-4">
          <Ionicons name="lock-closed" size={12} color="#64748B" />
          <Text className="text-slate-500 text-xs ml-1.5 font-medium">
            256-bit encrypted & secure customer platform
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

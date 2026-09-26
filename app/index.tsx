import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../src/hooks/useAuth";
import { ScreenWrapper } from "../src/components/ScreenWrapper";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isInitialized) return;

    // Small delay to provide smooth splash transition
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/welcome");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isInitialized, router]);

  return (
    <ScreenWrapper className="items-center justify-between py-12">
      <View />

      {/* Center Branding */}
      <View className="items-center">
        <View className="w-20 h-20 rounded-3xl bg-indigo-600/20 border-2 border-indigo-500/50 items-center justify-center mb-5 shadow-lg shadow-indigo-500/20">
          <Ionicons name="wallet" size={40} color="#818CF8" />
        </View>

        <Text className="text-4xl font-black text-white tracking-tight">
          Madu<Text className="text-indigo-400">Pay</Text>
        </Text>
        <Text className="text-slate-400 text-sm mt-1.5 font-medium tracking-wide">
          Fast, Reliable Payments & Virtual Wallets
        </Text>

        <View className="mt-8">
          <ActivityIndicator size="small" color="#818CF8" />
        </View>
      </View>

      {/* Bottom Security Assurance */}
      <View className="items-center">
        <View className="flex-row items-center bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-full">
          <Ionicons name="shield-checkmark" size={14} color="#10B981" />
          <Text className="text-slate-400 text-xs font-medium ml-1.5">
            Bank-grade Secure Encryption
          </Text>
        </View>
        <Text className="text-slate-600 text-[10px] mt-2 font-mono">
          v1.0.0 • Customer Mobile Client
        </Text>
      </View>
    </ScreenWrapper>
  );
}

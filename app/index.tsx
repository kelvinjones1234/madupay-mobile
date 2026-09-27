import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../src/hooks/useAuth";
import { ScreenWrapper } from "../src/components/ScreenWrapper";
import { colors } from "../src/theme/colors";

import * as SecureStore from "expo-secure-store";
import { ONBOARDING_STORAGE_KEY } from "./(auth)/onboarding";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isInitialized) return;

    // Small delay to provide smooth splash transition
    const timer = setTimeout(async () => {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        try {
          const hasSeen = await SecureStore.getItemAsync(ONBOARDING_STORAGE_KEY);
          if (hasSeen === "true") {
            router.replace("/(auth)/login");
          } else {
            router.replace("/(auth)/onboarding");
          }
        } catch {
          router.replace("/(auth)/onboarding");
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isInitialized, router]);

  return (
    <ScreenWrapper className="items-center justify-between py-12">
      <View />

      {/* Center Branding */}
      <View className="items-center">
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-5 shadow-xs"
          style={{ backgroundColor: colors.ditto.nightInk }}
        >
          <Ionicons name="wallet" size={38} color={colors.ditto.gold} />
        </View>

        <Text className="text-4xl font-extrabold text-ditto-ink tracking-tight">
          Madu<Text style={{ color: colors.ditto.gold }}>Pay</Text>
        </Text>
        <Text className="text-ditto-slate text-sm mt-1.5 font-medium tracking-wide">
          Fast, Reliable Payments & Virtual Wallets
        </Text>

        <View className="mt-8">
          <ActivityIndicator size="small" color={colors.ditto.ink} />
        </View>
      </View>

      {/* Bottom Security Assurance */}
      <View className="items-center">
        <View className="flex-row items-center bg-ditto-meadow border border-ditto-outline/10 px-3.5 py-1.5 rounded-full">
          <Ionicons name="shield-checkmark" size={14} color="#059669" />
          <Text className="text-ditto-ink text-xs font-semibold ml-1.5">
            Bank-grade Secure Encryption
          </Text>
        </View>
        <Text className="text-ditto-slate text-[10px] mt-2 font-medium">
          v1.0.0 • Customer Mobile Client
        </Text>
      </View>
    </ScreenWrapper>
  );
}

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  useWindowDimensions,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { colors } from "../../src/theme/colors";
import {
  MobilePaymentsIllustration,
  WalletManagementIllustration,
  BillServicesIllustration,
  SecurityTrustIllustration,
} from "../../src/components/illustrations";

export const ONBOARDING_STORAGE_KEY = "madupay_has_seen_onboarding";

interface OnboardingSlide {
  id: string;
  theme: string;
  headline: string;
  description: string;
  illustration: (width: number, height: number) => React.ReactNode;
  ctaText: string;
}

const ONBOARDING_DATA: OnboardingSlide[] = [
  {
    id: "screen-1",
    theme: "Welcome / Digital Payments",
    headline: "Pay bills. Anytime. Anywhere.",
    description:
      "Manage your everyday payments from one simple and secure mobile wallet.",
    illustration: (width, height) => (
      <MobilePaymentsIllustration width={width} height={height} />
    ),
    ctaText: "Continue",
  },
  {
    id: "screen-2",
    theme: "Wallet Management",
    headline: "Your money, always within reach",
    description:
      "Fund your wallet, monitor transactions, and stay in control of your spending.",
    illustration: (width, height) => (
      <WalletManagementIllustration width={width} height={height} />
    ),
    ctaText: "Continue",
  },
  {
    id: "screen-3",
    theme: "Bills & Services",
    headline: "Pay all your bills in one place",
    description:
      "Buy airtime, data, electricity, and other services without stress.",
    illustration: (width, height) => (
      <BillServicesIllustration width={width} height={height} />
    ),
    ctaText: "Continue",
  },
  {
    id: "screen-4",
    theme: "Security & Trust",
    headline: "Simple. Fast. Secure.",
    description:
      "Your transactions are protected while you enjoy seamless payments.",
    illustration: (width, height) => (
      <SecurityTrustIllustration width={width} height={height} />
    ),
    ctaText: "Get Started",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  // Responsive sizing
  const illustrationHeight = Math.min(Math.max(height * 0.32, 220), 280);
  const illustrationWidth = Math.min(width - 32, 340);

  const handleComplete = async (targetRoute: "/(auth)/register" | "/(auth)/login" = "/(auth)/login") => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_STORAGE_KEY, "true");
    } catch (e) {
      console.warn("Could not save onboarding status to SecureStore", e);
    }
    router.replace(targetRoute);
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      handleComplete("/(auth)/login");
    }
  };

  const handleSkip = () => {
    handleComplete("/(auth)/login");
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex >= 0 && newIndex < ONBOARDING_DATA.length) {
      setCurrentIndex(newIndex);
    }
  };

  const isLastScreen = currentIndex === ONBOARDING_DATA.length - 1;

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.ditto.canvas,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.ditto.canvas} />

      {/* Top Header Bar: Clean open header with right-aligned Skip button */}
      <View className="flex-row items-center justify-between px-6 py-2 h-14">
        <View className="w-10" />

        {/* Skip button (fades on last screen) */}
        {!isLastScreen ? (
          <TouchableOpacity
            onPress={handleSkip}
            activeOpacity={0.65}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            className="py-1 px-1"
          >
            <Text className="text-ditto-slate text-sm font-semibold">Skip</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
      </View>

      {/* Horizontal Pager */}
      <Animated.FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          return (
            <View
              style={{ width }}
              className="flex-1 items-center justify-between px-6 pt-4 pb-2"
            >
              {/* Centered Large Illustration with Generous Whitespace */}
              <View className="flex-1 items-center justify-center w-full py-4">
                {item.illustration(illustrationWidth, illustrationHeight)}
              </View>

              {/* Text Block */}
              <View className="w-full items-center mb-4">
                <Text className="text-2xl sm:text-3xl font-extrabold text-ditto-ink text-center tracking-tight leading-8 mb-3 px-2">
                  {item.headline}
                </Text>
                <Text className="text-ditto-slate text-sm sm:text-base text-center leading-6 font-medium px-4 max-w-sm">
                  {item.description}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Bottom Controls Area */}
      <View className="px-6 pt-2 pb-4">
        {/* Animated Pagination Dots */}
        <View className="flex-row items-center justify-center mb-6">
          {ONBOARDING_DATA.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            // Smooth width expansion into a pill shape
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8],
              extrapolate: "clamp",
            });

            // Smooth opacity transition
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.35, 1, 0.35],
              extrapolate: "clamp",
            });

            // Smooth color transition
            const dotBgColor = scrollX.interpolate({
              inputRange,
              outputRange: [
                colors.ditto.outline,
                colors.ditto.ink,
                colors.ditto.outline,
              ],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                style={{
                  width: dotWidth,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: dotBgColor,
                  opacity: dotOpacity,
                  marginHorizontal: 4,
                }}
              />
            );
          })}
        </View>

        {/* Primary Action Button (Continue / Get Started) */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.88}
          className="w-full h-14 rounded-full items-center justify-center flex-row shadow-sm"
          style={{ backgroundColor: colors.ditto.gold }}
        >
          <Text className="text-ditto-ink text-base font-extrabold tracking-tight mr-1">
            {isLastScreen ? "Get Started" : "Continue"}
          </Text>
          <Ionicons
            name={isLastScreen ? "arrow-forward" : "chevron-forward"}
            size={18}
            color={colors.ditto.ink}
          />
        </TouchableOpacity>

        {/* Secondary Register Link on Last Screen / Step counter on earlier screens */}
        <View className="mt-3.5 h-6 items-center justify-center">
          {isLastScreen ? (
            <TouchableOpacity
              onPress={() => handleComplete("/(auth)/register")}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
            >
              <Text className="text-ditto-slate text-xs font-medium">
                New to MaduPay?{" "}
                <Text className="text-ditto-ink font-bold">Create Account</Text>
              </Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-ditto-slate/60 text-[11px] font-medium">
              Step {currentIndex + 1} of {ONBOARDING_DATA.length}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

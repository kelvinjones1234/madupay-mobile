import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function Header({
  title,
  showBack = false,
  onBackPress,
  rightAction,
  className = "",
  dark = false,
}: HeaderProps) {
  const router = useRouter();

  const iconColor = dark ? colors.ditto.paper : colors.ditto.ink;
  const titleColor = dark ? "text-ditto-paper" : "text-ditto-ink";
  const backBtnBg = dark
    ? "bg-white/10 border-white/15"
    : "bg-ditto-meadow border-ditto-outline/10";

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(auth)/onboarding");
    }
  };

  return (
    <View className={`flex-row items-center justify-between py-3 mb-2 ${className}`}>
      <View className="flex-row items-center flex-1">
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            className={`w-10 h-10 rounded-full ${backBtnBg} items-center justify-center mr-3 border`}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color={iconColor} />
          </TouchableOpacity>
        ) : null}

        {title ? (
          <Text className={`${titleColor} text-xl font-bold tracking-tight`}>{title}</Text>
        ) : null}
      </View>

      {rightAction ? <View>{rightAction}</View> : null}
    </View>
  );
}

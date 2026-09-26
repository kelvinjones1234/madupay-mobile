import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  showBack = false,
  rightAction,
  className = "",
}: HeaderProps) {
  const router = useRouter();

  return (
    <View className={`flex-row items-center justify-between py-3 mb-2 ${className}`}>
      <View className="flex-row items-center flex-1">
        {showBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center mr-3 border border-slate-700"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}

        {title ? (
          <Text className="text-white text-xl font-bold tracking-tight">{title}</Text>
        ) : null}
      </View>

      {rightAction ? <View>{rightAction}</View> : null}
    </View>
  );
}

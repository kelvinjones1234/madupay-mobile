import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../Button";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = "file-tray-outline",
  title,
  description,
  actionTitle,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <View className={`items-center justify-center py-10 px-6 ${className}`}>
      <View className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 items-center justify-center mb-4 shadow-sm">
        <Ionicons name={icon} size={32} color="#64748B" />
      </View>
      <Text className="text-white text-base font-bold text-center mb-1.5">{title}</Text>
      <Text className="text-slate-400 text-xs text-center leading-5 max-w-xs mb-5">
        {description}
      </Text>
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} size="sm" />
      )}
    </View>
  );
}

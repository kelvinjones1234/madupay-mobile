import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../Button";
import { colors } from "../../theme/colors";

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
      <View className="w-16 h-16 rounded-full bg-ditto-meadow border border-ditto-outline/15 items-center justify-center mb-4 shadow-xs">
        <Ionicons name={icon} size={28} color={colors.ditto.ink} />
      </View>
      <Text className="text-ditto-ink text-base font-bold text-center mb-1.5">{title}</Text>
      <Text className="text-ditto-slate text-xs text-center leading-5 max-w-xs mb-5 font-normal">
        {description}
      </Text>
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} size="sm" />
      )}
    </View>
  );
}

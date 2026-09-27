import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../Button";
import { colors } from "../../theme/colors";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an unexpected error while loading your data.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <View className={`items-center justify-center py-10 px-6 ${className}`}>
      <View className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 items-center justify-center mb-4 shadow-xs">
        <Ionicons name="alert-circle-outline" size={30} color={colors.ditto.error} />
      </View>
      <Text className="text-ditto-ink text-base font-bold text-center mb-1.5">{title}</Text>
      <Text className="text-ditto-slate text-xs text-center leading-5 max-w-xs mb-5 font-normal">
        {message}
      </Text>
      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="secondary"
          size="sm"
          icon={<Ionicons name="refresh-outline" size={16} color={colors.ditto.ink} />}
        />
      )}
    </View>
  );
}

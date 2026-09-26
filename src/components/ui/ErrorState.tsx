import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../Button";

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
      <View className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 items-center justify-center mb-4">
        <Ionicons name="alert-circle-outline" size={32} color="#F43F5E" />
      </View>
      <Text className="text-white text-base font-bold text-center mb-1.5">{title}</Text>
      <Text className="text-slate-400 text-xs text-center leading-5 max-w-xs mb-5">
        {message}
      </Text>
      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="secondary"
          size="sm"
          icon={<Ionicons name="refresh-outline" size={16} color="#FFFFFF" />}
        />
      )}
    </View>
  );
}

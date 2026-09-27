import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { colors } from "../theme/colors";

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  fullscreen?: boolean;
}

export function LoadingState({
  message = "Processing request...",
  subMessage = "Please do not close the app",
  fullscreen = false,
}: LoadingStateProps) {
  const content = (
    <View className="items-center justify-center p-6">
      <View className="w-16 h-16 rounded-full bg-ditto-meadow border border-ditto-outline/15 items-center justify-center mb-4 shadow-xs">
        <ActivityIndicator size="large" color={colors.ditto.ink} />
      </View>
      <Text className="text-ditto-ink text-base font-bold tracking-tight text-center">
        {message}
      </Text>
      {subMessage ? (
        <Text className="text-ditto-slate text-xs mt-1 text-center font-normal">
          {subMessage}
        </Text>
      ) : null}
    </View>
  );

  if (fullscreen) {
    return (
      <View className="flex-1 items-center justify-center bg-ditto-canvas/95 absolute inset-0 z-50">
        {content}
      </View>
    );
  }

  return content;
}

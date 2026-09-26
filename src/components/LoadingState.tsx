import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

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
      <View className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 items-center justify-center mb-4">
        <ActivityIndicator size="large" color="#818CF8" />
      </View>
      <Text className="text-white text-base font-bold tracking-tight text-center">
        {message}
      </Text>
      {subMessage ? (
        <Text className="text-slate-400 text-xs mt-1 text-center font-medium">
          {subMessage}
        </Text>
      ) : null}
    </View>
  );

  if (fullscreen) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-900/95 absolute inset-0 z-50">
        {content}
      </View>
    );
  }

  return content;
}

import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../Button";
import { Card } from "../Card";

interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
  className?: string;
}

export function NetworkError({
  onRetry,
  message = "Unable to connect to MaduPay secure servers. Please check your internet connection and try again.",
  className = "",
}: NetworkErrorProps) {
  return (
    <View className={`flex-1 items-center justify-center p-6 ${className}`}>
      <Card className="p-6 items-center bg-slate-800/80 border border-slate-700/60 w-full max-w-sm">
        <View className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 items-center justify-center mb-4">
          <Ionicons name="cloud-offline-outline" size={32} color="#818CF8" />
        </View>

        <Text className="text-white text-lg font-bold text-center mb-2">
          Connection Issue
        </Text>

        <Text className="text-slate-400 text-xs text-center leading-5 mb-6">
          {message}
        </Text>

        {onRetry && (
          <Button
            title="Try Again"
            onPress={onRetry}
            size="md"
            icon={<Ionicons name="refresh-outline" size={16} color="#FFFFFF" />}
            className="w-full"
          />
        )}
      </Card>
    </View>
  );
}

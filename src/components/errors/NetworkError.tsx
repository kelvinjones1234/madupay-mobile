import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../Button";
import { colors } from "../../theme/colors";

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
      <View className="p-6 items-center bg-ditto-meadow border border-ditto-outline/10 rounded-[24px] w-full max-w-sm">
        <View className="w-16 h-16 rounded-full bg-ditto-meadowHigh items-center justify-center mb-4">
          <Ionicons name="cloud-offline-outline" size={32} color={colors.ditto.ink} />
        </View>

        <Text className="text-ditto-ink text-lg font-extrabold text-center mb-2">
          Connection Issue
        </Text>

        <Text className="text-ditto-slate text-xs text-center leading-5 mb-6 font-medium">
          {message}
        </Text>

        {onRetry && (
          <Button
            title="Try Again"
            onPress={onRetry}
            size="md"
            icon={<Ionicons name="refresh-outline" size={16} color={colors.ditto.ink} />}
            className="w-full"
          />
        )}
      </View>
    </View>
  );
}

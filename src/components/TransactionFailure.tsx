import React from "react";
import { View, Text, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./Button";
import { colors } from "../theme/colors";

interface TransactionFailureProps {
  visible: boolean;
  title?: string;
  error?: string;
  onRetry?: () => void;
  onCancel: () => void;
}

export function TransactionFailure({
  visible,
  title = "Transaction Failed",
  error = "An error occurred while processing your transaction. Your account has not been debited.",
  onRetry,
  onCancel,
}: TransactionFailureProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-ditto-canvas border-t border-ditto-outline/15 rounded-t-[2.5rem] p-6 pb-10">
          {/* Failure Alert Icon */}
          <View className="items-center mb-5 mt-2">
            <View className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-500 items-center justify-center mb-3">
              <Ionicons name="close" size={30} color={colors.ditto.error} />
            </View>
            <Text className="text-ditto-ink text-2xl font-black tracking-tight text-center">
              {title}
            </Text>
          </View>

          {/* Error Message Container */}
          <View className="bg-rose-50 border border-rose-200 rounded-[24px] p-4 mb-5">
            <Text className="text-rose-900 text-xs font-medium leading-5 text-center">
              {error}
            </Text>
          </View>

          <Text className="text-ditto-slate text-xs text-center mb-6 font-normal">
            If you were debited, settlements are automatically reversed within a few minutes.
          </Text>

          {/* Action Buttons */}
          <View className="space-y-3">
            {onRetry && (
              <Button
                title="Try Again"
                onPress={onRetry}
                size="lg"
                className="mb-2.5"
              />
            )}
            <Button
              title="Close"
              onPress={onCancel}
              variant="secondary"
              size="md"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

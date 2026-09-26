import React from "react";
import { View, Text, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./Button";

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
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-end bg-black/80">
        <View className="bg-slate-900 border-t border-slate-700/80 rounded-t-3xl p-6">
          {/* Failure Alert Icon */}
          <View className="items-center mb-5 mt-2">
            <View className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500/60 items-center justify-center mb-3 shadow-lg shadow-rose-500/30">
              <Ionicons name="close" size={32} color="#F43F5E" />
            </View>
            <Text className="text-white text-2xl font-black tracking-tight text-center">
              {title}
            </Text>
          </View>

          {/* Error Message Container */}
          <View className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 mb-6">
            <Text className="text-rose-300 text-xs font-medium leading-5 text-center">
              {error}
            </Text>
          </View>

          <Text className="text-slate-400 text-xs text-center mb-6">
            If you were debited, settlements are automatically reversed within a few minutes.
          </Text>

          {/* Action Buttons */}
          <View className="space-y-3">
            {onRetry && (
              <Button
                title="Try Again"
                onPress={onRetry}
                size="lg"
                className="mb-2"
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

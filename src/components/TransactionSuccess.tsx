import React from "react";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { Button } from "./Button";
import { formatNgnCurrency, formatDate } from "../utils/formatters";
import { colors } from "../theme/colors";

interface TransactionSuccessProps {
  visible: boolean;
  title?: string;
  amount: number;
  reference: string;
  serviceName: string;
  recipient: string;
  onDone: () => void;
  onShareReceipt?: () => void;
}

export function TransactionSuccess({
  visible,
  title = "Payment Successful!",
  amount,
  reference,
  serviceName,
  recipient,
  onDone,
  onShareReceipt,
}: TransactionSuccessProps) {
  const handleCopyRef = () => {
    Alert.alert("Reference Copied", `Transaction reference ${reference} copied to clipboard.`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDone}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-ditto-canvas border-t border-ditto-outline/15 rounded-t-[2.5rem] p-6 pb-10">
          {/* Success Badge */}
          <View className="items-center mb-5 mt-2">
            <View className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 items-center justify-center mb-3">
              <Ionicons name="checkmark" size={30} color="#10B981" />
            </View>
            <Text className="text-ditto-ink text-2xl font-black tracking-tight text-center">
              {title}
            </Text>
            <Text className="text-ditto-slate text-xs mt-1 font-normal">
              Your transaction has been processed instantly.
            </Text>
          </View>

          {/* Amount Box */}
          <Card className="items-center p-4 mb-5 bg-ditto-meadow border border-ditto-outline/10">
            <Text className="text-ditto-slate text-xs font-semibold uppercase tracking-wider mb-1">
              Amount Transferred
            </Text>
            <Text className="text-ditto-ink text-3xl font-extrabold tracking-tight">
              {formatNgnCurrency(amount)}
            </Text>
          </Card>

          {/* Details */}
          <View className="bg-ditto-meadow border border-ditto-outline/10 rounded-[24px] p-5 mb-6">
            <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
              <Text className="text-ditto-slate text-xs font-medium">Service</Text>
              <Text className="text-ditto-ink text-xs font-semibold">{serviceName}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
              <Text className="text-ditto-slate text-xs font-medium">Recipient</Text>
              <Text className="text-ditto-ink text-xs font-mono font-medium">{recipient}</Text>
            </View>

            <View className="flex-row justify-between items-center py-2 border-b border-ditto-outline/10">
              <Text className="text-ditto-slate text-xs font-medium">Reference</Text>
              <TouchableOpacity
                onPress={handleCopyRef}
                className="flex-row items-center bg-ditto-meadowHigh px-2.5 py-1 rounded-full border border-ditto-outline/10"
              >
                <Text className="text-ditto-ink text-xs font-mono font-medium mr-1.5">{reference}</Text>
                <Ionicons name="copy-outline" size={12} color={colors.ditto.ink} />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-ditto-slate text-xs font-medium">Date & Time</Text>
              <Text className="text-ditto-ink text-xs font-medium">
                {formatDate(new Date().toISOString())}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="space-y-3">
            <Button title="Done" onPress={onDone} size="lg" className="mb-2.5" />
            {onShareReceipt && (
              <Button
                title="Share Receipt"
                onPress={onShareReceipt}
                variant="secondary"
                size="md"
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

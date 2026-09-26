import React from "react";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { Button } from "./Button";
import { formatNgnCurrency, formatDate } from "../utils/formatters";

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
      <View className="flex-1 justify-end bg-black/80">
        <View className="bg-slate-900 border-t border-slate-700/80 rounded-t-3xl p-6">
          {/* Success Badge */}
          <View className="items-center mb-5 mt-2">
            <View className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 items-center justify-center mb-3 shadow-lg shadow-emerald-500/30">
              <Ionicons name="checkmark" size={32} color="#10B981" />
            </View>
            <Text className="text-white text-2xl font-black tracking-tight text-center">
              {title}
            </Text>
            <Text className="text-slate-400 text-xs mt-1 font-medium">
              Your transaction has been processed instantly.
            </Text>
          </View>

          {/* Amount Box */}
          <Card variant="accent" className="items-center p-4 mb-5 border border-indigo-500/40">
            <Text className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
              Amount Transferred
            </Text>
            <Text className="text-white text-3xl font-extrabold tracking-tight">
              {formatNgnCurrency(amount)}
            </Text>
          </Card>

          {/* Receipt Details */}
          <View className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 mb-6">
            <View className="flex-row justify-between py-2 border-b border-slate-700/50">
              <Text className="text-slate-400 text-xs font-medium">Service</Text>
              <Text className="text-white text-xs font-semibold">{serviceName}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-slate-700/50">
              <Text className="text-slate-400 text-xs font-medium">Recipient</Text>
              <Text className="text-white text-xs font-mono font-medium">{recipient}</Text>
            </View>

            <View className="flex-row justify-between items-center py-2 border-b border-slate-700/50">
              <Text className="text-slate-400 text-xs font-medium">Reference</Text>
              <TouchableOpacity
                onPress={handleCopyRef}
                className="flex-row items-center bg-slate-700/50 px-2 py-0.5 rounded-md"
              >
                <Text className="text-indigo-300 text-xs font-mono mr-1.5">{reference}</Text>
                <Ionicons name="copy-outline" size={12} color="#818CF8" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-slate-400 text-xs font-medium">Date & Time</Text>
              <Text className="text-white text-xs font-medium">
                {formatDate(new Date().toISOString())}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="space-y-3">
            <Button
              title="Return to Dashboard"
              onPress={onDone}
              size="lg"
              className="mb-2"
            />
            {onShareReceipt && (
              <Button
                title="Share Receipt"
                onPress={onShareReceipt}
                variant="outline"
                size="md"
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

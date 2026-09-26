import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { Button } from "./Button";
import { formatNgnCurrency } from "../utils/formatters";

interface TransactionConfirmationProps {
  visible: boolean;
  title?: string;
  serviceName: string;
  provider: string;
  recipient: string;
  amount: number;
  fee?: number;
  extraDetails?: Array<{ label: string; value: string }>;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TransactionConfirmation({
  visible,
  title = "Confirm Transaction",
  serviceName,
  provider,
  recipient,
  amount,
  fee = 0,
  extraDetails = [],
  onConfirm,
  onCancel,
  loading = false,
}: TransactionConfirmationProps) {
  const total = amount + fee;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-end bg-black/75">
        <View className="bg-slate-900 border-t border-slate-700/80 rounded-t-3xl p-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-white text-lg font-extrabold tracking-tight">
              {title}
            </Text>
            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              className="w-8 h-8 rounded-full bg-slate-800 items-center justify-center border border-slate-700"
            >
              <Ionicons name="close" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Amount Display */}
          <Card variant="accent" className="items-center p-4 mb-5 border border-indigo-500/40">
            <Text className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
              Amount to Pay
            </Text>
            <Text className="text-white text-3xl font-extrabold tracking-tight">
              {formatNgnCurrency(total)}
            </Text>
            {fee > 0 && (
              <Text className="text-slate-400 text-xs mt-1">
                Includes {formatNgnCurrency(fee)} service fee
              </Text>
            )}
          </Card>

          {/* Transaction Metadata Breakdown */}
          <View className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 mb-6">
            <View className="flex-row justify-between py-2 border-b border-slate-700/50">
              <Text className="text-slate-400 text-xs font-medium">Service Type</Text>
              <Text className="text-white text-xs font-semibold">{serviceName}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-slate-700/50">
              <Text className="text-slate-400 text-xs font-medium">Provider / Network</Text>
              <Text className="text-white text-xs font-semibold">{provider}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-slate-700/50">
              <Text className="text-slate-400 text-xs font-medium">Recipient</Text>
              <Text className="text-white text-xs font-mono font-medium">{recipient}</Text>
            </View>

            {extraDetails.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between py-2 border-b border-slate-700/50"
              >
                <Text className="text-slate-400 text-xs font-medium">{item.label}</Text>
                <Text className="text-white text-xs font-semibold">{item.value}</Text>
              </View>
            ))}

            <View className="flex-row justify-between pt-2.5">
              <Text className="text-slate-300 text-xs font-bold">Total Debit</Text>
              <Text className="text-indigo-300 text-xs font-bold font-mono">
                {formatNgnCurrency(total)}
              </Text>
            </View>
          </View>

          {/* Security Assurance */}
          <View className="flex-row items-center justify-center mb-5">
            <Ionicons name="shield-checkmark" size={14} color="#10B981" />
            <Text className="text-slate-400 text-xs ml-1.5 font-medium">
              Secured with MaduPay settlement guarantee
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            <Button
              title={loading ? "Processing..." : `Pay ${formatNgnCurrency(total)}`}
              onPress={onConfirm}
              loading={loading}
              size="lg"
              className="mb-2"
            />
            <Button
              title="Cancel"
              onPress={onCancel}
              variant="secondary"
              size="md"
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

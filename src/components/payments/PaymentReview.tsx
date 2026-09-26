import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../Card";
import { Button } from "../Button";
import { formatNgnCurrency } from "../../utils/formatters";

interface PaymentReviewItem {
  label: string;
  value: string;
}

interface PaymentReviewProps {
  visible: boolean;
  title?: string;
  serviceTitle: string;
  provider: string;
  recipient: string;
  amount: number;
  fee?: number;
  items?: PaymentReviewItem[];
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function PaymentReview({
  visible,
  title = "Review Payment",
  serviceTitle,
  provider,
  recipient,
  amount,
  fee = 0,
  items = [],
  onConfirm,
  onCancel,
  loading = false,
}: PaymentReviewProps) {
  const total = amount + fee;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View className="flex-1 justify-end bg-black/75">
        <View className="bg-slate-900 border-t border-slate-700/80 rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-lg font-black tracking-tight">{title}</Text>
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
              Total Charge
            </Text>
            <Text className="text-white text-3xl font-extrabold tracking-tight">
              {formatNgnCurrency(total)}
            </Text>
          </Card>

          {/* Details breakdown */}
          <View className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 mb-6">
            <View className="flex-row justify-between py-2 border-b border-slate-700/40">
              <Text className="text-slate-400 text-xs font-medium">Service</Text>
              <Text className="text-white text-xs font-semibold">{serviceTitle}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-slate-700/40">
              <Text className="text-slate-400 text-xs font-medium">Provider</Text>
              <Text className="text-white text-xs font-semibold">{provider}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-slate-700/40">
              <Text className="text-slate-400 text-xs font-medium">Account / Recipient</Text>
              <Text className="text-white text-xs font-mono font-medium">{recipient}</Text>
            </View>

            {items.map((item, idx) => (
              <View
                key={idx}
                className="flex-row justify-between py-2 border-b border-slate-700/40"
              >
                <Text className="text-slate-400 text-xs font-medium">{item.label}</Text>
                <Text className="text-white text-xs font-semibold">{item.value}</Text>
              </View>
            ))}

            <View className="flex-row justify-between pt-2.5">
              <Text className="text-slate-300 text-xs font-bold">Total Debit</Text>
              <Text className="text-indigo-400 text-xs font-bold font-mono">
                {formatNgnCurrency(total)}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="space-y-3">
            <Button
              title={loading ? "Processing..." : `Confirm & Pay ${formatNgnCurrency(total)}`}
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

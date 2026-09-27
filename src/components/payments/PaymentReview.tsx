import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../Card";
import { Button } from "../Button";
import { formatNgnCurrency } from "../../utils/formatters";
import { colors } from "../../theme/colors";

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
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-ditto-canvas border-t border-ditto-outline/15 rounded-t-[2.5rem] p-6 pb-10">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-ditto-ink text-xl font-bold tracking-tight">{title}</Text>
            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              className="w-9 h-9 rounded-full bg-ditto-meadow items-center justify-center border border-ditto-outline/10"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color={colors.ditto.ink} />
            </TouchableOpacity>
          </View>

          {/* Amount Display */}
          <Card className="items-center p-5 mb-5 bg-ditto-meadow border border-ditto-outline/10">
            <Text className="text-ditto-slate text-xs font-semibold uppercase tracking-wider mb-1">
              Total Charge
            </Text>
            <Text className="text-ditto-ink text-3xl font-extrabold tracking-tight">
              {formatNgnCurrency(total)}
            </Text>
          </Card>

          {/* Details breakdown */}
          <View className="bg-ditto-meadow border border-ditto-outline/10 rounded-[24px] p-5 mb-6">
            <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
              <Text className="text-ditto-slate text-xs font-medium">Service</Text>
              <Text className="text-ditto-ink text-xs font-semibold">{serviceTitle}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
              <Text className="text-ditto-slate text-xs font-medium">Provider</Text>
              <Text className="text-ditto-ink text-xs font-semibold">{provider}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
              <Text className="text-ditto-slate text-xs font-medium">Account / Recipient</Text>
              <Text className="text-ditto-ink text-xs font-mono font-medium">{recipient}</Text>
            </View>

            {items.map((item, idx) => (
              <View
                key={idx}
                className="flex-row justify-between py-2 border-b border-ditto-outline/10"
              >
                <Text className="text-ditto-slate text-xs font-medium">{item.label}</Text>
                <Text className="text-ditto-ink text-xs font-semibold">{item.value}</Text>
              </View>
            ))}

            <View className="flex-row justify-between pt-3">
              <Text className="text-ditto-ink text-xs font-bold">Total Debit</Text>
              <Text className="text-ditto-ink text-xs font-bold font-mono">
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
              className="mb-2.5"
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

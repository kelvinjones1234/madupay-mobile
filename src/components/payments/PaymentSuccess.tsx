import React from "react";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../Card";
import { Button } from "../Button";
import { formatNgnCurrency, formatDate } from "../../utils/formatters";
import { colors } from "../../theme/colors";

interface PaymentSuccessProps {
  visible: boolean;
  title?: string;
  amount: number;
  reference: string;
  serviceTitle: string;
  recipient: string;
  token?: string; // For prepaid electricity tokens
  units?: string;
  onDone: () => void;
  onShareReceipt?: () => void;
}

export function PaymentSuccess({
  visible,
  title = "Payment Successful!",
  amount,
  reference,
  serviceTitle,
  recipient,
  token,
  units,
  onDone,
  onShareReceipt,
}: PaymentSuccessProps) {
  const handleCopy = (label: string, text: string) => {
    Alert.alert(`${label} Copied`, `${text} copied to clipboard.`);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDone}>
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-ditto-canvas border-t border-ditto-outline/15 rounded-t-[2.5rem] p-6 pb-10">
          {/* Header */}
          <View className="items-center mb-4 mt-1">
            <View className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 items-center justify-center mb-2.5">
              <Ionicons name="checkmark" size={30} color="#10B981" />
            </View>
            <Text className="text-ditto-ink text-2xl font-black tracking-tight">{title}</Text>
            <Text className="text-ditto-slate text-xs mt-0.5 font-normal">
              Transaction completed successfully
            </Text>
          </View>

          {/* Electricity Token Card if available */}
          {token ? (
            <Card className="p-4 mb-4 border border-ditto-gold/50 bg-ditto-gold/15 items-center">
              <Text className="text-ditto-ink text-xs font-bold uppercase tracking-wider mb-1">
                Your Electricity Recharge Token
              </Text>
              <TouchableOpacity
                onPress={() => handleCopy("Token", token)}
                className="flex-row items-center bg-white px-5 py-2 rounded-full border border-ditto-gold/50 my-1 shadow-xs"
              >
                <Text className="text-ditto-ink font-mono text-xl font-black mr-2">{token}</Text>
                <Ionicons name="copy-outline" size={16} color={colors.ditto.ink} />
              </TouchableOpacity>
              {units ? (
                <Text className="text-ditto-slate text-xs mt-1 font-medium">Units: {units}</Text>
              ) : null}
            </Card>
          ) : null}

          {/* Amount Box */}
          <Card className="items-center p-4 mb-4 bg-ditto-meadow border border-ditto-outline/10">
            <Text className="text-ditto-slate text-xs font-semibold uppercase tracking-wider">
              Amount Paid
            </Text>
            <Text className="text-ditto-ink text-3xl font-extrabold tracking-tight mt-0.5">
              {formatNgnCurrency(amount)}
            </Text>
          </Card>

          {/* Details */}
          <View className="bg-ditto-meadow border border-ditto-outline/10 rounded-[24px] p-5 mb-5">
            <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
              <Text className="text-ditto-slate text-xs font-medium">Service</Text>
              <Text className="text-ditto-ink text-xs font-semibold">{serviceTitle}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-ditto-outline/10">
              <Text className="text-ditto-slate text-xs font-medium">Recipient</Text>
              <Text className="text-ditto-ink text-xs font-mono font-medium">{recipient}</Text>
            </View>

            <View className="flex-row justify-between items-center py-2 border-b border-ditto-outline/10">
              <Text className="text-ditto-slate text-xs font-medium">Reference</Text>
              <TouchableOpacity
                onPress={() => handleCopy("Reference", reference)}
                className="flex-row items-center bg-ditto-meadowHigh px-2.5 py-1 rounded-full border border-ditto-outline/10"
              >
                <Text className="text-ditto-ink text-xs font-mono font-medium mr-1.5">{reference}</Text>
                <Ionicons name="copy-outline" size={12} color={colors.ditto.ink} />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-ditto-slate text-xs font-medium">Date</Text>
              <Text className="text-ditto-ink text-xs font-medium">
                {formatDate(new Date().toISOString())}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="space-y-3">
            <Button title="Done" onPress={onDone} size="lg" className="mb-2" />
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

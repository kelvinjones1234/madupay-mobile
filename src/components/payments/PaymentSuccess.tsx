import React from "react";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../Card";
import { Button } from "../Button";
import { formatNgnCurrency, formatDate } from "../../utils/formatters";

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
      <View className="flex-1 justify-end bg-black/80">
        <View className="bg-slate-900 border-t border-slate-700/80 rounded-t-3xl p-6">
          {/* Header */}
          <View className="items-center mb-4 mt-1">
            <View className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 items-center justify-center mb-2.5">
              <Ionicons name="checkmark" size={32} color="#10B981" />
            </View>
            <Text className="text-white text-2xl font-black tracking-tight">{title}</Text>
            <Text className="text-slate-400 text-xs mt-0.5">Transaction completed successfully</Text>
          </View>

          {/* Electricity Token Card if available */}
          {token ? (
            <Card className="p-4 mb-4 border border-amber-500/40 bg-amber-500/10 items-center">
              <Text className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                Your Electricity Recharge Token
              </Text>
              <TouchableOpacity
                onPress={() => handleCopy("Token", token)}
                className="flex-row items-center bg-slate-900/90 px-4 py-2 rounded-xl border border-amber-500/30 my-1"
              >
                <Text className="text-white font-mono text-xl font-black mr-2">{token}</Text>
                <Ionicons name="copy-outline" size={16} color="#FBBF24" />
              </TouchableOpacity>
              {units ? (
                <Text className="text-amber-200 text-xs mt-1">Units: {units}</Text>
              ) : null}
            </Card>
          ) : null}

          {/* Amount Box */}
          <Card variant="accent" className="items-center p-3.5 mb-4 border border-indigo-500/40">
            <Text className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              Amount Paid
            </Text>
            <Text className="text-white text-3xl font-extrabold tracking-tight mt-0.5">
              {formatNgnCurrency(amount)}
            </Text>
          </Card>

          {/* Details */}
          <View className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 mb-5">
            <View className="flex-row justify-between py-1.5 border-b border-slate-700/40">
              <Text className="text-slate-400 text-xs">Service</Text>
              <Text className="text-white text-xs font-semibold">{serviceTitle}</Text>
            </View>

            <View className="flex-row justify-between py-1.5 border-b border-slate-700/40">
              <Text className="text-slate-400 text-xs">Recipient</Text>
              <Text className="text-white text-xs font-mono font-medium">{recipient}</Text>
            </View>

            <View className="flex-row justify-between items-center py-1.5 border-b border-slate-700/40">
              <Text className="text-slate-400 text-xs">Reference</Text>
              <TouchableOpacity
                onPress={() => handleCopy("Reference", reference)}
                className="flex-row items-center"
              >
                <Text className="text-indigo-300 text-xs font-mono mr-1">{reference}</Text>
                <Ionicons name="copy-outline" size={12} color="#818CF8" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between py-1.5">
              <Text className="text-slate-400 text-xs">Date</Text>
              <Text className="text-white text-xs font-medium">
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

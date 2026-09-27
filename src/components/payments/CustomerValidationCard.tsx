import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../Card";
import { colors } from "../../theme/colors";

interface CustomerValidationCardProps {
  customerName?: string;
  identifier: string;
  accountType?: string;
  address?: string;
  loading?: boolean;
  onClear?: () => void;
  className?: string;
}

export function CustomerValidationCard({
  customerName,
  identifier,
  accountType,
  address,
  loading = false,
  onClear,
  className = "",
}: CustomerValidationCardProps) {
  if (loading) {
    return (
      <Card className={`p-4 mb-4 border border-ditto-outline/15 bg-ditto-meadow ${className}`}>
        <View className="flex-row items-center">
          <ActivityIndicator size="small" color={colors.ditto.ink} className="mr-3" />
          <View>
            <Text className="text-ditto-ink text-xs font-bold">Verifying Customer Account...</Text>
            <Text className="text-ditto-slate text-[11px]">Contacting provider validation gateway</Text>
          </View>
        </View>
      </Card>
    );
  }

  if (!customerName) {
    return null;
  }

  return (
    <Card className={`p-4 mb-4 border border-emerald-600/30 bg-ditto-meadow ${className}`}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="w-5 h-5 rounded-full bg-emerald-500/20 items-center justify-center mr-2">
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
          </View>
          <Text className="text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Verified Customer
          </Text>
        </View>

        {onClear && (
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={16} color={colors.ditto.slate} />
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-ditto-ink text-base font-extrabold mb-1" numberOfLines={1}>
        {customerName}
      </Text>

      <View className="flex-row items-center justify-between mt-1">
        <Text className="text-ditto-slate text-xs font-mono">ID: {identifier}</Text>
        {accountType && (
          <View className="bg-ditto-meadowHigh px-2.5 py-0.5 rounded-full">
            <Text className="text-ditto-ink text-[10px] font-bold uppercase">{accountType}</Text>
          </View>
        )}
      </View>

      {address ? (
        <Text className="text-ditto-slate text-[11px] mt-1.5 leading-4" numberOfLines={2}>
          {address}
        </Text>
      ) : null}
    </Card>
  );
}

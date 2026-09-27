import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

interface BillProviderSelectorProps {
  providers: string[];
  selectedProvider: string;
  onSelect: (provider: string) => void;
  label?: string;
  horizontal?: boolean;
  className?: string;
}

export function BillProviderSelector({
  providers,
  selectedProvider,
  onSelect,
  label = "Select Provider",
  horizontal = true,
  className = "",
}: BillProviderSelectorProps) {
  if (horizontal) {
    return (
      <View className={`mb-4 ${className}`}>
        {label ? (
          <Text className="text-ditto-slate text-xs font-semibold uppercase tracking-wider mb-2.5 ml-1">
            {label}
          </Text>
        ) : null}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {providers.map((prov) => {
            const isSelected = selectedProvider.toUpperCase() === prov.toUpperCase();
            return (
              <TouchableOpacity
                key={prov}
                onPress={() => onSelect(prov)}
                activeOpacity={0.8}
                className={`mr-2 px-5 py-2.5 rounded-full border items-center justify-center ${
                  isSelected
                    ? "bg-ditto-ink border-ditto-ink shadow-xs"
                    : "bg-ditto-meadow border-ditto-outline/10"
                }`}
              >
                <Text
                  className={`text-xs font-bold tracking-wide ${
                    isSelected ? "text-white" : "text-ditto-ink"
                  }`}
                >
                  {prov}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={`mb-4 ${className}`}>
      {label ? (
        <Text className="text-ditto-slate text-xs font-semibold uppercase tracking-wider mb-2.5 ml-1">
          {label}
        </Text>
      ) : null}
      <View className="flex-row flex-wrap justify-between">
        {providers.map((prov) => {
          const isSelected = selectedProvider.toUpperCase() === prov.toUpperCase();
          return (
            <TouchableOpacity
              key={prov}
              onPress={() => onSelect(prov)}
              activeOpacity={0.8}
              className={`w-[48%] py-3 px-4 rounded-full border mb-2.5 items-center justify-center ${
                isSelected
                  ? "bg-ditto-ink border-ditto-ink shadow-xs"
                  : "bg-ditto-meadow border-ditto-outline/10"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isSelected ? "text-white" : "text-ditto-ink"
                }`}
              >
                {prov}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

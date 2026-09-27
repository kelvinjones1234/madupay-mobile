import React from "react";
import { View, Text } from "react-native";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "primary" | "gold";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  label,
  variant = "neutral",
  size = "sm",
  className = "",
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-50 border-emerald-300 text-emerald-800";
      case "warning":
        return "bg-amber-50 border-amber-300 text-amber-800";
      case "error":
        return "bg-rose-50 border-rose-300 text-rose-800";
      case "gold":
      case "primary":
        return "bg-ditto-gold/25 border-ditto-gold/50 text-ditto-ink";
      case "info":
        return "bg-ditto-meadowHigh border-ditto-outline/15 text-ditto-ink";
      case "neutral":
      default:
        return "bg-ditto-meadow border-ditto-outline/15 text-ditto-slate";
    }
  };

  const isSmall = size === "sm";

  return (
    <View
      className={`self-start rounded-full border px-3 py-1 ${getVariantStyles()} ${className}`}
    >
      <Text
        className={`font-bold uppercase tracking-wider ${
          isSmall ? "text-[10px]" : "text-xs"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

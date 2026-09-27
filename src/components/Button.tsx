import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { colors } from "../theme/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ink" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  icon,
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-ditto-meadow border border-ditto-outline/15 active:bg-ditto-meadowHigh";
      case "ink":
        return "bg-ditto-ink active:opacity-90 shadow-xs";
      case "outline":
        return "bg-transparent border border-ditto-ink active:bg-ditto-meadow/50";
      case "danger":
        return "bg-ditto-error active:opacity-90";
      case "primary":
      default:
        // Warm Gold signature CTA with Deep Ink text
        return "bg-ditto-gold active:opacity-90 shadow-xs";
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case "secondary":
      case "outline":
        return "text-ditto-ink font-semibold";
      case "danger":
      case "ink":
        return "text-white font-semibold";
      case "primary":
      default:
        return "text-ditto-ink font-bold";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "py-2 px-4 rounded-full";
      case "lg":
        return "py-4 px-8 rounded-full";
      case "md":
      default:
        return "py-3.5 px-6 rounded-full";
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      case "md":
      default:
        return "text-sm";
    }
  };

  const spinnerColor =
    variant === "primary"
      ? colors.ditto.ink
      : variant === "secondary" || variant === "outline"
      ? colors.ditto.ink
      : "#FFFFFF";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${getVariantStyles()} ${getSizeStyles()} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text className={`${getTextStyles()} ${getTextSizeStyles()}`}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

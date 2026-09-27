import React from "react";
import { View, Text } from "react-native";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const getInitials = (str: string) => {
    if (!str) return "U";
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { container: "w-8 h-8 rounded-full", text: "text-xs font-bold" };
      case "lg":
        return { container: "w-14 h-14 rounded-full", text: "text-lg font-extrabold" };
      case "xl":
        return { container: "w-20 h-20 rounded-full", text: "text-2xl font-black" };
      case "md":
      default:
        return { container: "w-11 h-11 rounded-full", text: "text-sm font-bold" };
    }
  };

  const sz = getSizeStyles();

  return (
    <View
      className={`${sz.container} bg-ditto-meadow border border-ditto-outline/15 items-center justify-center ${className}`}
    >
      <Text className={`text-ditto-ink ${sz.text}`}>{getInitials(name)}</Text>
    </View>
  );
}

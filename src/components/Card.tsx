import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "accent" | "canvas";
}

export function Card({
  children,
  className = "",
  variant = "default",
  style,
  ...props
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "accent":
        // Iconic deep ink card (used for balance overview)
        return "bg-ditto-nightInk border border-white/10";
      case "elevated":
        return "bg-ditto-meadowHigh border border-ditto-outline/15 shadow-xs";
      case "canvas":
        return "bg-ditto-canvas border border-ditto-outline/10";
      case "default":
      default:
        // Authentic Soft Meadow card
        return "bg-ditto-meadow border border-ditto-outline/10";
    }
  };

  return (
    <View
      className={`rounded-[24px] p-5 ${getVariantStyles()} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

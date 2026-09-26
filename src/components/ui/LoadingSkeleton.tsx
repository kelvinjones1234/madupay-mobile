import React, { useEffect, useRef } from "react";
import { View, Animated, ViewProps } from "react-native";

interface LoadingSkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export function LoadingSkeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  className = "",
  style,
  ...props
}: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          backgroundColor: "#334155",
          opacity,
        },
        style,
      ]}
      className={className}
      {...props}
    />
  );
}

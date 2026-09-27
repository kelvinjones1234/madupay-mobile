import React, { useEffect, useRef } from "react";
import { Animated, ViewProps } from "react-native";
import { colors } from "../../theme/colors";

interface LoadingSkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export function LoadingSkeleton({
  width = "100%",
  height = 20,
  borderRadius = 1440,
  className = "",
  style,
  ...props
}: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 750,
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
          backgroundColor: colors.ditto.meadowHigh,
          opacity,
        },
        style,
      ]}
      className={className}
      {...props}
    />
  );
}

import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  isPassword?: boolean;
  containerClassName?: string;
  inputWrapperClassName?: string;
  leftIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helper,
  isPassword = false,
  containerClassName = "",
  inputWrapperClassName = "",
  leftIcon,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`w-full mb-5 ${containerClassName}`}>
      {label ? (
        <Text className="text-ditto-slate text-xs font-semibold uppercase tracking-wider mb-2 ml-2">
          {label}
        </Text>
      ) : null}

      <View
        className={`flex-row items-center bg-white border ${
          error
            ? "border-ditto-error"
            : isFocused
            ? "border-ditto-ink shadow-xs"
            : "border-ditto-outline/15"
        } rounded-full px-5 min-h-[56px] py-3.5 ${inputWrapperClassName}`}
      >
        {leftIcon ? <View className="mr-3 items-center justify-center">{leftIcon}</View> : null}

        <TextInput
          placeholderTextColor="#5F5C6E80"
          className="flex-1 text-ditto-ink text-base py-0 font-medium"
          style={{ textAlignVertical: "center", minHeight: Platform.OS === "android" ? 44 : 24 }}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="ml-2 p-1"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.ditto.slate}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text className="text-ditto-error text-xs mt-1.5 font-medium ml-2">{error}</Text>
      ) : helper ? (
        <Text className="text-ditto-slate text-xs mt-1.5 ml-2 font-medium">{helper}</Text>
      ) : null}
    </View>
  );
}

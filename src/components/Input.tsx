import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  isPassword?: boolean;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helper,
  isPassword = false,
  containerClassName = "",
  leftIcon,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`w-full mb-4 ${containerClassName}`}>
      {label ? (
        <Text className="text-slate-300 text-sm font-medium mb-1.5">{label}</Text>
      ) : null}

      <View
        className={`flex-row items-center bg-slate-800/80 border ${
          error ? "border-rose-500" : "border-slate-700 focus:border-indigo-500"
        } rounded-xl px-3.5 py-3`}
      >
        {leftIcon ? <View className="mr-2.5">{leftIcon}</View> : null}

        <TextInput
          placeholderTextColor="#64748B"
          className="flex-1 text-white text-base py-0"
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text className="text-rose-400 text-xs mt-1.5 font-medium">{error}</Text>
      ) : helper ? (
        <Text className="text-slate-400 text-xs mt-1">{helper}</Text>
      ) : null}
    </View>
  );
}

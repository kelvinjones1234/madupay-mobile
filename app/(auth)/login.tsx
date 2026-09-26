import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Header } from "../../src/components/Header";
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
import { useAuth } from "../../src/hooks/useAuth";
import { loginSchema } from "../../src/utils/validation";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, setError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleLogin = async () => {
    setError(null);
    setValidationErrors({});

    // Validate using Zod schema
    const result = loginSchema.safeParse({
      email: email.trim().toLowerCase(),
      password,
    });

    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "email") fieldErrors.email = issue.message;
        if (issue.path[0] === "password") fieldErrors.password = issue.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }

    const success = await login({
      email: email.trim().toLowerCase(),
      password,
    });

    if (!success && error) {
      Alert.alert("Login Failed", error);
    }
  };

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header showBack title="" />

      <View className="mb-8 mt-2">
        <Text className="text-3xl font-extrabold text-white tracking-tight">
          Welcome back
        </Text>
        <Text className="text-slate-400 text-sm mt-1.5 leading-5 font-normal">
          Enter your MaduPay credentials to securely access your account and virtual wallet.
        </Text>
      </View>

      {/* Global Error Banner */}
      {error ? (
        <View className="flex-row items-center bg-rose-500/15 border border-rose-500/40 rounded-xl p-3.5 mb-5">
          <Ionicons name="alert-circle" size={20} color="#F43F5E" />
          <Text className="text-rose-300 text-xs ml-2.5 flex-1 font-medium leading-4">
            {error}
          </Text>
        </View>
      ) : null}

      <View className="w-full">
        <Input
          label="Email Address"
          placeholder="e.g. user@example.com"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            if (validationErrors.email) {
              setValidationErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={validationErrors.email}
          leftIcon={<Ionicons name="mail-outline" size={18} color="#94A3B8" />}
        />

        <Input
          label="Password"
          placeholder="••••••••••••"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (validationErrors.password) {
              setValidationErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          isPassword
          error={validationErrors.password}
          leftIcon={<Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />}
        />

        <View className="flex-row justify-end mb-6">
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Password Reset",
                "Password reset is managed via MaduPay security services. Please contact support or visit the web portal."
              );
            }}
          >
            <Text className="text-indigo-400 text-xs font-semibold">
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title={isLoading ? "Signing in..." : "Sign In"}
          onPress={handleLogin}
          loading={isLoading}
          size="lg"
          className="mt-2"
        />

        <View className="flex-row justify-center items-center mt-8">
          <Text className="text-slate-400 text-sm">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="text-indigo-400 font-semibold text-sm">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

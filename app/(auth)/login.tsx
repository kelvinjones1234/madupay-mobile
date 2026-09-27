import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { Header } from "../../src/components/Header";
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
import { GoogleIcon } from "../../src/components/icons/GoogleIcon";
import { useAuth } from "../../src/hooks/useAuth";
import { loginSchema } from "../../src/utils/validation";
import { colors } from "../../src/theme/colors";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, setError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleGoogleSignIn = async () => {
    try {
      const apiUrl =
        process.env.EXPO_PUBLIC_API_URL?.replace("/api/v1", "") || "https://madupay.com";
      const targetUrl = `${apiUrl}/authentication/login`;
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
      } else {
        Alert.alert(
          "Google Sign In",
          "Google OAuth is available on the web portal. Please continue with your credentials or open in browser."
        );
      }
    } catch {
      Alert.alert(
        "Google Sign In",
        "Could not launch Google authentication browser session."
      );
    }
  };

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
      <Header
        showBack
        title=""
        onBackPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/(auth)/onboarding");
          }
        }}
      />

      <View className="mb-8 mt-2">
        <Text className="text-3xl font-extrabold text-ditto-ink tracking-tight">
          Welcome back
        </Text>
        <Text className="text-ditto-slate text-sm mt-1.5 leading-5 font-normal">
          Enter your MaduPay credentials to securely access your account and virtual wallet.
        </Text>
      </View>

      {/* Global Error Banner */}
      {error ? (
        <View className="flex-row items-center bg-rose-50 border border-rose-200 rounded-[24px] p-3.5 mb-5">
          <Ionicons name="alert-circle" size={20} color={colors.ditto.error} />
          <Text className="text-rose-900 text-xs ml-2.5 flex-1 font-medium leading-4">
            {error}
          </Text>
        </View>
      ) : null}

      <View className="w-full">
        {/* Google Sign In (Web-aligned SSO) */}
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          activeOpacity={0.82}
          className="w-full min-h-[56px] h-14 flex-row items-center justify-center bg-ditto-meadow border border-ditto-outline/10 rounded-full px-5 shadow-xs mb-4"
        >
          <GoogleIcon size={20} />
          <Text className="text-ditto-ink font-bold text-sm ml-3">
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Clean Divider */}
        <View className="flex-row items-center justify-center my-2 mb-5">
          <View className="flex-1 h-[1px] bg-ditto-outline/10" />
          <Text className="text-ditto-slate text-xs uppercase font-bold mx-3 tracking-wider">
            or continue with email
          </Text>
          <View className="flex-1 h-[1px] bg-ditto-outline/10" />
        </View>

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
          leftIcon={<Ionicons name="mail-outline" size={18} color={colors.ditto.slate} />}
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
          containerClassName="mb-3"
          error={validationErrors.password}
          leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.ditto.slate} />}
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
            <Text className="text-ditto-ink text-xs font-semibold underline">
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
          <Text className="text-ditto-slate text-sm">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="text-ditto-ink font-bold text-sm underline">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

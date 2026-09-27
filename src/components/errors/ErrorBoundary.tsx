import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../Button";
import { colors } from "../../theme/colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 bg-ditto-canvas justify-center items-center p-6">
          <View className="p-6 items-center bg-ditto-meadow border border-ditto-outline/10 rounded-[24px] w-full max-w-sm">
            <View className="w-16 h-16 rounded-full bg-rose-100 items-center justify-center mb-4">
              <Ionicons name="warning-outline" size={32} color="#E11D48" />
            </View>

            <Text className="text-ditto-ink text-xl font-extrabold text-center mb-2">
              Something went wrong
            </Text>

            <Text className="text-ditto-slate text-xs text-center leading-5 mb-5 font-medium">
              An unexpected error occurred. Your wallet balance and account data remain completely safe.
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView className="max-h-24 bg-white/70 p-2.5 rounded-xl border border-rose-200 mb-5 w-full">
                <Text className="text-rose-700 text-[10px] font-mono">
                  {this.state.error.toString()}
                </Text>
              </ScrollView>
            )}

            <Button
              title="Reload View"
              onPress={this.handleReset}
              size="md"
              className="w-full"
              icon={<Ionicons name="reload-outline" size={16} color={colors.ditto.ink} />}
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

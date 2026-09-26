import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../Button";
import { Card } from "../Card";

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
        <View className="flex-1 bg-slate-900 justify-center items-center p-6">
          <Card className="p-6 items-center bg-slate-800 border border-slate-700 w-full max-w-sm">
            <View className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/30 items-center justify-center mb-4">
              <Ionicons name="warning-outline" size={32} color="#F43F5E" />
            </View>

            <Text className="text-white text-xl font-bold text-center mb-2">
              Something went wrong
            </Text>

            <Text className="text-slate-400 text-xs text-center leading-5 mb-5">
              An unexpected error occurred. Your wallet balance and account data remain completely safe.
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView className="max-h-24 bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60 mb-5 w-full">
                <Text className="text-rose-400 text-[10px] font-mono">
                  {this.state.error.toString()}
                </Text>
              </ScrollView>
            )}

            <Button
              title="Reload View"
              onPress={this.handleReset}
              size="md"
              className="w-full"
              icon={<Ionicons name="reload-outline" size={16} color="#FFFFFF" />}
            />
          </Card>
        </View>
      );
    }

    return this.props.children;
  }
}

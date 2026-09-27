import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../src/components/ScreenWrapper";
import { Header } from "../../../src/components/Header";
import { Input } from "../../../src/components/Input";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { TransactionConfirmation } from "../../../src/components/TransactionConfirmation";
import { TransactionSuccess } from "../../../src/components/TransactionSuccess";
import { TransactionFailure } from "../../../src/components/TransactionFailure";
import { useAuth } from "../../../src/hooks/useAuth";
import { useWalletSummary } from "../../../src/hooks/useWallet";
import { useWalletFunding } from "../../../src/hooks/useWalletFunding";
import { formatNgnCurrency } from "../../../src/utils/formatters";
import { colors } from "../../../src/theme/colors";

export default function FundWalletScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: wallet } = useWalletSummary();
  const fundingMutation = useWalletFunding();

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "BANK_TRANSFER">("CARD");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successData, setSuccessData] = useState<{ amount: number; reference: string } | null>(null);
  const [failureError, setFailureError] = useState<string | null>(null);

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 100 && parsedAmount <= 5000000;

  const virtualAccount = wallet?.virtualAccount || {
    bankName: "Wema Bank / MaduPay",
    accountNumber: user?.phone ? user.phone.slice(-10) : "0123456789",
    accountName: `MADUPAY - ${user?.fullName?.toUpperCase() || "CUSTOMER"}`,
  };

  const handleCopyAccount = (text: string) => {
    Alert.alert("Account Number Copied", `${text} has been copied to your clipboard.`);
  };

  const handleProceed = () => {
    if (!isValidAmount) {
      Alert.alert("Invalid Amount", "Please enter a valid amount between ₦100 and ₦5,000,000.");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmFunding = async () => {
    try {
      const res = await fundingMutation.mutateAsync({
        amount: parsedAmount,
        paymentMethod,
      });

      setShowConfirmation(false);

      if (paymentMethod === "CARD") {
        if (res.authorizationUrl) {
          Alert.alert(
            "Complete Payment",
            "You will be redirected to the secure payment gateway to complete your card deposit.",
            [
              {
                text: "Open Gateway",
                onPress: () => {
                  Linking.openURL(res.authorizationUrl!).catch(() => {});
                  setSuccessData({
                    amount: parsedAmount,
                    reference: res.reference || "MADUPAY-FUND",
                  });
                },
              },
            ]
          );
        } else {
          setSuccessData({
            amount: parsedAmount,
            reference: res.reference || "MADUPAY-FUND",
          });
        }
      } else {
        setSuccessData({
          amount: parsedAmount,
          reference: res.reference || "TRANSFER-REQUEST",
        });
      }
    } catch (err) {
      setShowConfirmation(false);
      setFailureError(err instanceof Error ? err.message : "Failed to initialize wallet funding.");
    }
  };

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header showBack title="Fund Wallet" />

      {/* Balance Pill */}
      <View className="flex-row items-center justify-between bg-ditto-meadow border border-ditto-outline/10 rounded-full px-5 py-2.5 mb-5 shadow-xs">
        <View className="flex-row items-center">
          <Ionicons name="wallet-outline" size={16} color={colors.ditto.ink} />
          <Text className="text-ditto-slate text-xs ml-2 font-medium">Current Balance:</Text>
        </View>
        <Text className="text-ditto-ink font-bold text-xs">
          {formatNgnCurrency(wallet?.balance ?? 0)}
        </Text>
      </View>

      {/* Amount Input */}
      <View className="mb-4">
        <Text className="text-ditto-slate text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
          Enter Deposit Amount
        </Text>
        <Input
          placeholder="e.g. 5000"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          leftIcon={<Ionicons name="cash-outline" size={18} color={colors.ditto.slate} />}
          helper="Min: ₦100 • Max: ₦5,000,000"
        />

        {/* Quick Amount Chips with selection by tone */}
        <View className="flex-row flex-wrap justify-between mt-1">
          {quickAmounts.map((amt) => {
            const isSelected = amount === amt.toString();
            return (
              <TouchableOpacity
                key={amt}
                onPress={() => setAmount(amt.toString())}
                activeOpacity={0.8}
                className={`w-[31%] rounded-full py-2.5 items-center mb-2.5 border ${
                  isSelected
                    ? "bg-ditto-ink border-ditto-ink shadow-xs"
                    : "bg-ditto-meadow border-ditto-outline/10"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected ? "text-white" : "text-ditto-ink"
                  }`}
                >
                  ₦{amt.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Payment Method Selector */}
      <View className="mb-6">
        <Text className="text-ditto-slate text-xs font-semibold uppercase tracking-wider mb-2.5 ml-1">
          Select Payment Method
        </Text>

        {/* Option 1: Card / Online Paystack */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("CARD")}
          activeOpacity={0.85}
          className={`flex-row items-center justify-between p-4 rounded-[24px] border mb-3 ${
            paymentMethod === "CARD"
              ? "bg-ditto-meadowHigh border-ditto-ink shadow-xs"
              : "bg-ditto-meadow border-ditto-outline/10"
          }`}
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View
              className={`w-11 h-11 rounded-full items-center justify-center mr-3 ${
                paymentMethod === "CARD" ? "bg-ditto-ink" : "bg-ditto-meadowHigh"
              }`}
            >
              <Ionicons
                name="card-outline"
                size={20}
                color={paymentMethod === "CARD" ? "#FFFFFF" : colors.ditto.ink}
              />
            </View>
            <View className="flex-1">
              <Text className="text-ditto-ink text-sm font-bold">Debit Card / Online</Text>
              <Text className="text-ditto-slate text-xs mt-0.5">
                Instant credit via Mastercard, Visa, or Verve
              </Text>
            </View>
          </View>
          <View
            className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
              paymentMethod === "CARD" ? "border-ditto-ink bg-ditto-ink" : "border-ditto-slate/40"
            }`}
          >
            {paymentMethod === "CARD" && (
              <View className="w-2 h-2 rounded-full bg-white" />
            )}
          </View>
        </TouchableOpacity>

        {/* Option 2: Dedicated Virtual Account */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("BANK_TRANSFER")}
          activeOpacity={0.85}
          className={`flex-row items-center justify-between p-4 rounded-[24px] border ${
            paymentMethod === "BANK_TRANSFER"
              ? "bg-ditto-meadowHigh border-ditto-ink shadow-xs"
              : "bg-ditto-meadow border-ditto-outline/10"
          }`}
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View
              className={`w-11 h-11 rounded-full items-center justify-center mr-3 ${
                paymentMethod === "BANK_TRANSFER" ? "bg-ditto-ink" : "bg-ditto-meadowHigh"
              }`}
            >
              <Ionicons
                name="business-outline"
                size={20}
                color={paymentMethod === "BANK_TRANSFER" ? "#FFFFFF" : colors.ditto.ink}
              />
            </View>
            <View className="flex-1">
              <Text className="text-ditto-ink text-sm font-bold">Bank Transfer</Text>
              <Text className="text-ditto-slate text-xs mt-0.5">
                Transfer directly to your dedicated virtual account
              </Text>
            </View>
          </View>
          <View
            className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
              paymentMethod === "BANK_TRANSFER"
                ? "border-ditto-ink bg-ditto-ink"
                : "border-ditto-slate/40"
            }`}
          >
            {paymentMethod === "BANK_TRANSFER" && (
              <View className="w-2 h-2 rounded-full bg-white" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* If Bank Transfer is selected, preview dedicated account */}
      {paymentMethod === "BANK_TRANSFER" && (
        <Card className="p-5 mb-6 bg-ditto-meadow border border-ditto-outline/10">
          <Text className="text-ditto-ink font-bold text-sm mb-2.5">Your Virtual Account</Text>
          <View className="bg-ditto-canvas rounded-[18px] p-4 border border-ditto-outline/10 mb-2">
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-ditto-slate text-xs">Bank</Text>
              <Text className="text-ditto-ink text-xs font-semibold">{virtualAccount.bankName}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-1.5">
              <Text className="text-ditto-slate text-xs">Account No.</Text>
              <TouchableOpacity
                onPress={() => handleCopyAccount(virtualAccount.accountNumber)}
                className="flex-row items-center bg-ditto-meadowHigh px-2.5 py-1 rounded-full border border-ditto-outline/10"
              >
                <Text className="text-ditto-ink font-bold text-sm mr-1 font-mono">
                  {virtualAccount.accountNumber}
                </Text>
                <Ionicons name="copy-outline" size={12} color={colors.ditto.ink} />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-ditto-slate text-xs">Account Name</Text>
              <Text className="text-ditto-ink text-xs font-medium">{virtualAccount.accountName}</Text>
            </View>
          </View>
          <Text className="text-ditto-slate text-[11px] text-center font-normal">
            Zero processing fees. Transferred funds are credited instantly.
          </Text>
        </Card>
      )}

      {/* Action Button */}
      <Button
        title={
          fundingMutation.isPending
            ? "Initializing..."
            : `Proceed with ${paymentMethod === "CARD" ? "Card Payment" : "Transfer"}`
        }
        onPress={handleProceed}
        disabled={!isValidAmount || fundingMutation.isPending}
        loading={fundingMutation.isPending}
        size="lg"
        className="mb-8"
      />

      {/* Confirmation Modal */}
      <TransactionConfirmation
        visible={showConfirmation}
        title="Confirm Wallet Top-up"
        serviceName="Wallet Funding"
        provider={paymentMethod === "CARD" ? "Debit Card (Paystack)" : "Instant Bank Transfer"}
        recipient={virtualAccount.accountName}
        amount={parsedAmount || 0}
        fee={0}
        extraDetails={[
          { label: "Payment Channel", value: paymentMethod === "CARD" ? "Online Card" : "Bank Transfer" },
        ]}
        onConfirm={handleConfirmFunding}
        onCancel={() => setShowConfirmation(false)}
        loading={fundingMutation.isPending}
      />

      {/* Success Modal */}
      {successData && (
        <TransactionSuccess
          visible={!!successData}
          title="Funding Initialized!"
          amount={successData.amount}
          reference={successData.reference}
          serviceName="Wallet Deposit"
          recipient={virtualAccount.accountName}
          onDone={() => {
            setSuccessData(null);
            router.replace("/(tabs)/wallet");
          }}
        />
      )}

      {/* Failure Modal */}
      {failureError && (
        <TransactionFailure
          visible={!!failureError}
          title="Funding Failed"
          error={failureError}
          onRetry={() => {
            setFailureError(null);
            handleProceed();
          }}
          onCancel={() => setFailureError(null)}
        />
      )}
    </ScreenWrapper>
  );
}

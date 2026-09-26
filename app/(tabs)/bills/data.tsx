import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
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
import { useCatalog } from "../../../src/hooks/useCatalog";
import { useDataPurchase } from "../../../src/hooks/useDataPurchase";
import { formatNgnCurrency } from "../../../src/utils/formatters";

export default function DataScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: wallet } = useWalletSummary();
  const { data: catalog, isLoading: catalogLoading } = useCatalog();
  const purchaseMutation = useDataPurchase();

  const [selectedProvider, setSelectedProvider] = useState("MTN");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successData, setSuccessData] = useState<{ amount: number; reference: string; planName: string } | null>(null);
  const [failureError, setFailureError] = useState<string | null>(null);

  const fallbackProviders = ["MTN", "AIRTEL", "GLO", "9MOBILE"];
  const providers = useMemo(() => {
    return catalog?.data?.providers?.length ? catalog.data.providers : fallbackProviders;
  }, [catalog]);

  // Available data plans for active provider
  const availablePlans = useMemo(() => {
    if (!catalog?.data?.plans) return [];
    return catalog.data.plans.filter(
      (p) => p.network.toUpperCase() === selectedProvider.toUpperCase()
    );
  }, [catalog, selectedProvider]);

  // Set first plan by default when provider changes or plans load
  React.useEffect(() => {
    if (availablePlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(availablePlans[0].id);
    }
  }, [availablePlans, selectedPlanId]);

  const activePlan = useMemo(() => {
    return availablePlans.find((p) => p.id === selectedPlanId);
  }, [availablePlans, selectedPlanId]);

  const isPhoneValid = /^0[789][01]\d{8}$/.test(phoneNumber.trim().replace(/\s+/g, ""));

  const handleUseMyNumber = () => {
    if (user?.phone) {
      setPhoneNumber(user.phone);
    } else {
      Alert.alert("No Phone Number", "Your profile does not have a saved phone number.");
    }
  };

  const handleReview = () => {
    if (!selectedProvider) {
      Alert.alert("Missing Provider", "Please select a mobile network provider.");
      return;
    }

    if (!activePlan) {
      Alert.alert("Missing Data Plan", "Please select a data bundle plan.");
      return;
    }

    if (!isPhoneValid) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 11-digit Nigerian mobile number (e.g. 08012345678).");
      return;
    }

    const safeBalance = wallet?.safeToSpend ?? wallet?.balance ?? 0;
    if (activePlan.sellingPrice > safeBalance) {
      Alert.alert(
        "Insufficient Balance",
        `Your safe-to-spend balance is ${formatNgnCurrency(safeBalance)}. You need ${formatNgnCurrency(
          activePlan.sellingPrice
        )} to buy this data bundle.`
      );
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmPurchase = async () => {
    if (!activePlan) return;

    try {
      const sanitizedPhone = phoneNumber.trim().replace(/\s+/g, "");
      const res = await purchaseMutation.mutateAsync({
        provider: selectedProvider,
        phoneNumber: sanitizedPhone,
        planId: activePlan.id,
        amount: activePlan.sellingPrice,
      });

      setShowConfirmation(false);
      setSuccessData({
        amount: activePlan.sellingPrice,
        reference: res.reference || res.transactionId || "SUCCESS",
        planName: activePlan.name,
      });

      // Clear input fields
      setPhoneNumber("");
    } catch (err) {
      setShowConfirmation(false);
      setFailureError(
        err instanceof Error ? err.message : "Failed to process data bundle purchase. Please try again."
      );
    }
  };

  return (
    <ScreenWrapper scrollable className="py-2">
      <Header showBack title="Buy Internet Data" />

      {/* Balance Pill */}
      <View className="flex-row items-center justify-between bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 mb-5">
        <View className="flex-row items-center">
          <Ionicons name="wallet-outline" size={16} color="#818CF8" />
          <Text className="text-slate-300 text-xs ml-2 font-medium">Safe to Spend:</Text>
        </View>
        <Text className="text-white font-bold text-xs">
          {formatNgnCurrency(wallet?.safeToSpend ?? wallet?.balance ?? 0)}
        </Text>
      </View>

      {/* Network Provider Selector */}
      <View className="mb-4">
        <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
          Select Network
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {providers.map((prov) => {
            const isSelected = selectedProvider.toUpperCase() === prov.toUpperCase();
            return (
              <TouchableOpacity
                key={prov}
                onPress={() => {
                  setSelectedProvider(prov);
                  setSelectedPlanId("");
                }}
                activeOpacity={0.8}
                className={`mr-3 px-5 py-3 rounded-2xl border items-center justify-center ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 shadow-sm"
                    : "bg-slate-800/60 border-slate-700/60"
                }`}
              >
                <Text
                  className={`text-sm font-bold tracking-wide ${
                    isSelected ? "text-indigo-400" : "text-slate-300"
                  }`}
                >
                  {prov}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Phone Number Input */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-slate-300 text-sm font-medium">Recipient Phone Number</Text>
          {user?.phone ? (
            <TouchableOpacity onPress={handleUseMyNumber}>
              <Text className="text-indigo-400 text-xs font-semibold">Use My Number</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Input
          placeholder="08012345678"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={11}
          leftIcon={<Ionicons name="call-outline" size={18} color="#94A3B8" />}
          helper="Valid 11-digit Nigerian mobile number"
        />
      </View>

      {/* Plans List */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-2.5">
          <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
            Available {selectedProvider} Data Plans
          </Text>
          <Text className="text-slate-500 text-xs font-medium">
            {availablePlans.length} packages
          </Text>
        </View>

        {catalogLoading ? (
          <View className="py-8 items-center justify-center">
            <ActivityIndicator size="small" color="#818CF8" />
            <Text className="text-slate-400 text-xs mt-2">Loading data plans...</Text>
          </View>
        ) : availablePlans.length === 0 ? (
          <Card className="items-center justify-center py-6">
            <Ionicons name="wifi-outline" size={28} color="#64748B" />
            <Text className="text-slate-400 text-xs mt-2">
              No data plans currently available for {selectedProvider}
            </Text>
          </Card>
        ) : (
          <ScrollView
            style={{ maxHeight: 260 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-2"
          >
            {availablePlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  onPress={() => setSelectedPlanId(plan.id)}
                  activeOpacity={0.7}
                  className={`flex-row items-center justify-between p-3.5 rounded-xl mb-2 border ${
                    isSelected
                      ? "bg-indigo-600/25 border-indigo-500"
                      : "bg-slate-800/70 border-slate-700/50"
                  }`}
                >
                  <View className="flex-1 mr-3">
                    <Text className="text-white text-sm font-bold" numberOfLines={1}>
                      {plan.name}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Ionicons name="time-outline" size={12} color="#94A3B8" />
                      <Text className="text-slate-400 text-xs ml-1 font-medium">
                        Validity: {plan.duration}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-indigo-400 font-extrabold text-sm font-mono">
                      {formatNgnCurrency(plan.sellingPrice)}
                    </Text>
                    <View
                      className={`w-4 h-4 rounded-full border mt-1 items-center justify-center ${
                        isSelected ? "border-indigo-400 bg-indigo-500" : "border-slate-600"
                      }`}
                    >
                      {isSelected && <View className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Selected Plan Summary Card */}
      {activePlan && (
        <Card className="p-4 mb-6 bg-slate-800/70 border border-slate-700/60">
          <Text className="text-white font-bold text-sm mb-3">Order Details</Text>
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-slate-400 text-xs">Selected Plan</Text>
            <Text className="text-white text-xs font-medium" numberOfLines={1}>
              {activePlan.name}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-slate-400 text-xs">Validity Period</Text>
            <Text className="text-white text-xs font-medium">{activePlan.duration}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-400 text-xs">Recipient</Text>
            <Text className="text-white text-xs font-mono font-medium">
              {phoneNumber || "—"}
            </Text>
          </View>
          <View className="flex-row justify-between pt-2 border-t border-slate-700/60">
            <Text className="text-white text-sm font-bold">Total Price</Text>
            <Text className="text-indigo-400 text-base font-extrabold">
              {formatNgnCurrency(activePlan.sellingPrice)}
            </Text>
          </View>
        </Card>
      )}

      {/* Review & Purchase Button */}
      <Button
        title={
          purchaseMutation.isPending
            ? "Processing..."
            : `Purchase ${activePlan ? formatNgnCurrency(activePlan.sellingPrice) : ""}`
        }
        onPress={handleReview}
        disabled={!activePlan || !isPhoneValid || purchaseMutation.isPending}
        loading={purchaseMutation.isPending}
        size="lg"
        className="mb-8"
      />

      {/* Confirmation Modal */}
      {activePlan && (
        <TransactionConfirmation
          visible={showConfirmation}
          title="Confirm Data Bundle"
          serviceName="Internet Data Bundle"
          provider={selectedProvider}
          recipient={phoneNumber}
          amount={activePlan.sellingPrice}
          fee={0}
          extraDetails={[
            { label: "Data Package", value: activePlan.name },
            { label: "Validity", value: activePlan.duration },
          ]}
          onConfirm={handleConfirmPurchase}
          onCancel={() => setShowConfirmation(false)}
          loading={purchaseMutation.isPending}
        />
      )}

      {/* Success Modal */}
      {successData && (
        <TransactionSuccess
          visible={!!successData}
          title="Data Activated!"
          amount={successData.amount}
          reference={successData.reference}
          serviceName={`${selectedProvider} ${successData.planName}`}
          recipient={phoneNumber}
          onDone={() => {
            setSuccessData(null);
            router.replace("/(tabs)/bills");
          }}
        />
      )}

      {/* Failure Modal */}
      {failureError && (
        <TransactionFailure
          visible={!!failureError}
          title="Data Purchase Failed"
          error={failureError}
          onRetry={() => {
            setFailureError(null);
            handleReview();
          }}
          onCancel={() => setFailureError(null)}
        />
      )}
    </ScreenWrapper>
  );
}

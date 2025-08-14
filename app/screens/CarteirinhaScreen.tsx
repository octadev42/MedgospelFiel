import { FC, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { ArrowLeft, Plus, CreditCard } from "lucide-react-native"

import { BottomNavigation } from "@/components/BottomNavigation"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useStores } from "@/models"

type CarteirinhaScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Carteirinha">
}

interface PaymentMethod {
  id: string
  type: "credit" | "debit"
  brand: "mastercard" | "visa"
  lastDigits: string
  isDefault: boolean
}

interface Transaction {
  id: string
  type: "purchase" | "recharge"
  description: string
  amount: number
  date: string
}

export const CarteirinhaScreen: FC<CarteirinhaScreenProps> = observer(function CarteirinhaScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { appGeralStore } = useStores()

  const [balance] = useState(120.00)
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit",
      brand: "mastercard",
      lastDigits: "9999",
      isDefault: true,
    },
    {
      id: "2",
      type: "credit",
      brand: "visa",
      lastDigits: "9999",
      isDefault: false,
    },
  ])

  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "purchase",
      description: "Compra no crédito",
      amount: -12.00,
      date: "2024-01-15",
    },
    {
      id: "2",
      type: "recharge",
      description: "Recarga de crédito",
      amount: 100.00,
      date: "2024-01-10",
    },
  ])

  useEffect(() => {
    appGeralStore.setActiveTab('carteirinha')
  }, [])

  const formatCurrency = (amount: number) => {
    return `R$ ${Math.abs(amount).toFixed(2).replace('.', ',')}`
  }

  const getCardBrandIcon = (brand: string) => {
    switch (brand) {
      case "mastercard":
        return "💳" // You can replace with actual Mastercard icon
      case "visa":
        return "💳" // You can replace with actual Visa icon
      default:
        return "💳"
    }
  }

  return (
    <View style={themed($container)}>
      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        safeAreaEdges={["top"]}
        systemBarStyle="light"
      >
        {/* Header Section */}
        <View style={themed($headerContainer)}>
          <View style={themed($headerTop)}>
            <TouchableOpacity style={themed($backButton)} onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={themed($headerTitle)} text="Adicionar Cartão" />
            <View style={themed($headerSpacer)} />
          </View>
          
          <Text style={themed($headerGreeting)} text="Olá Flávio, este é seu saldo" />
          
          {/* Balance Card */}
          <View style={themed($balanceCard)}>
            <View style={themed($balanceInfo)}>
              <Text style={themed($balanceLabel)} text="Saldo" />
              <Text style={themed($balanceSubLabel)} text="Saldo disponível" />
              <Text style={themed($balanceAmount)} text={formatCurrency(balance)} />
            </View>
            <TouchableOpacity style={themed($addFundsButton)}>
              <Plus size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={themed($mainContent)}>
          {/* Payment Methods Section */}
          <View style={themed($sectionContainer)}>
            <View style={themed($sectionHeader)}>
              <Text style={themed($sectionTitle)} text="Formas de Pagamento" />
              <TouchableOpacity>
                <Text style={themed($sectionLink)} text="Todos >" />
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={themed($paymentMethodsScroll)}>
              <TouchableOpacity style={themed($addCardButton)}>
                <Plus size={24} color="#1E90FF" />
                <Text style={themed($addCardText)} text="Cadastrar novo cartão" />
              </TouchableOpacity>
              
              {paymentMethods.map((method) => (
                <View key={method.id} style={themed($paymentMethodCard)}>
                  <Text style={themed($cardBrand)} text={getCardBrandIcon(method.brand)} />
                  <Text style={themed($cardType)} text="Crédito" />
                  <Text style={themed($cardNumber)} text={`${method.brand === 'mastercard' ? 'Mastercard' : 'VISA'} .... ${method.lastDigits}`} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Transactions Section */}
          <View style={themed($sectionContainer)}>
            <Text style={themed($sectionTitle)} text="Extrato" />
            
            {transactions.map((transaction) => (
              <View key={transaction.id} style={themed($transactionItem)}>
                <View style={themed($transactionInfo)}>
                  <Text style={themed($transactionTitle)} text={transaction.description} />
                  {transaction.type === "purchase" && (
                    <Text style={themed($transactionSubtitle)} text="Exame" />
                  )}
                </View>
                <Text 
                  style={[
                    themed($transactionAmount),
                    transaction.amount > 0 ? themed($positiveAmount) : themed($negativeAmount)
                  ]} 
                  text={`${transaction.amount > 0 ? '+' : '-'} ${formatCurrency(transaction.amount)}`} 
                />
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Navigation - Fixed at bottom */}
        <View style={themed($bottomNavigationContainer)}>
          <BottomNavigation />
        </View>
      </Screen>
    </View>
  )
})

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
  paddingBottom: 100, // Add padding to account for bottom navigation
})

const $bottomNavigationContainer: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "white",
  borderTopWidth: 1,
  borderTopColor: "#E0E0E0",
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#1E90FF",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xl,
  paddingBottom: spacing.lg,
})

const $headerTop: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: spacing.lg,
})

const $backButton: ThemedStyle<ViewStyle> = () => ({
  padding: 8,
})

const $headerTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
  fontWeight: "700",
  color: "white",
  flex: 1,
  textAlign: "center",
})

const $headerSpacer: ThemedStyle<ViewStyle> = () => ({
  width: 40,
})

const $headerGreeting: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 16,
  color: "white",
  marginBottom: spacing.md,
})

const $balanceCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  borderRadius: 12,
  padding: spacing.lg,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $balanceInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $balanceLabel: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "#666",
  marginBottom: 4,
})

const $balanceSubLabel: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  color: "#999",
  marginBottom: 8,
})

const $balanceAmount: ThemedStyle<TextStyle> = () => ({
  fontSize: 24,
  fontWeight: "700",
  color: "#4CAF50",
})

const $addFundsButton: ThemedStyle<ViewStyle> = () => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#F5F5F5",
  alignItems: "center",
  justifyContent: "center",
})

const $mainContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  backgroundColor: "white",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
})

const $sectionContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

const $sectionHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: spacing.md,
})

const $sectionTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "600",
  color: "#333",
})

const $sectionLink: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "500",
  color: "#1E90FF",
})

const $paymentMethodsScroll: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 0,
})

const $addCardButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 120,
  height: 120,
  backgroundColor: "#F8F9FA",
  borderRadius: 12,
  borderWidth: 2,
  borderColor: "#E0E0E0",
  borderStyle: "dashed",
  alignItems: "center",
  justifyContent: "center",
  marginRight: spacing.md,
})

const $addCardText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "500",
  color: "#1E90FF",
  textAlign: "center",
  marginTop: 4,
})

const $paymentMethodCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 120,
  height: 120,
  backgroundColor: "white",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E0E0E0",
  padding: spacing.sm,
  marginRight: spacing.md,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
})

const $cardBrand: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
  marginBottom: 4,
})

const $cardType: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "500",
  color: "#666",
  marginBottom: 2,
})

const $cardNumber: ThemedStyle<TextStyle> = () => ({
  fontSize: 10,
  color: "#999",
})

const $transactionItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: "#F0F0F0",
})

const $transactionInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $transactionTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "500",
  color: "#333",
  marginBottom: 2,
})

const $transactionSubtitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#666",
})

const $transactionAmount: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
})

const $positiveAmount: ThemedStyle<TextStyle> = () => ({
  color: "#4CAF50",
})

const $negativeAmount: ThemedStyle<TextStyle> = () => ({
  color: "#F44336",
}) 
import { FC, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, Image, ImageStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { ChevronLeft, Trash2, Plus } from "lucide-react-native"

import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useStores } from "@/models"
import { Header } from "@/components/Header"
import { useCarrinho } from "@/hooks/useCarrinho"

type CarrinhoScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "MainTabs">
}

interface CartItem {
  id: string
  name: string
  type: string
  price: number
  quantity: number
  selected: boolean
  image?: string
  icon?: string
}

export const CarrinhoScreen: FC<CarrinhoScreenProps> = observer(function CarrinhoScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { cartItems, isLoading, error, getCarrinho } = useCarrinho()
  
  const [selectAll, setSelectAll] = useState(false)
  const [useWalletCredits, setUseWalletCredits] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // Load cart items on component mount
  useEffect(() => {
    getCarrinho()
  }, [getCarrinho])



  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    if (newSelectAll) {
      setSelectedItems(new Set(cartItems.map(item => item.id.toString())))
    } else {
      setSelectedItems(new Set())
    }
  }
  
  const toggleItemSelection = (itemId: string) => {
    const newSelectedItems = new Set(selectedItems)
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId)
    } else {
      newSelectedItems.add(itemId)
    }
    setSelectedItems(newSelectedItems)
  }

  const updateItemQuantity = (itemId: string, increment: boolean) => {
    // This would need to be implemented with API call to update quantity
    console.log(`Update quantity for item ${itemId}, increment: ${increment}`)
  }

  const removeItem = (itemId: string) => {
    // This would need to be implemented with API call to remove item
    console.log(`Remove item ${itemId}`)
  }

  const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id.toString()))
  const totalPrice = selectedCartItems.reduce((sum, item) => sum + (parseFloat(item.valor_total || '0')), 0)

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handlePaymentPress = () => {
    // Navigate to payment screen
    console.log("Going to payment with total:", totalPrice)
  }

  const renderCartItem = (item: any) => {
    const isSelected = selectedItems.has(item.id.toString())
    
    return (
      <View key={item.id} style={themed($cartItemContainer)}>
        <TouchableOpacity
          style={themed($checkboxContainer)}
          onPress={() => toggleItemSelection(item.id.toString())}
        >
          <View style={[
            themed($checkbox),
            isSelected && themed($checkboxSelected)
          ]}>
            {isSelected && <Icon icon="check" size={12} color="white" />}
          </View>
        </TouchableOpacity>

        <View style={themed($itemImageContainer)}>
          <View style={themed($itemIconContainer)}>
            <Icon icon="view" size={24} color="#666" />
          </View>
        </View>

        <View style={themed($itemInfoContainer)}>
          <Text style={themed($itemName)} text={typeof item.fk_procedimento === 'object' ? item.fk_procedimento?.nome || "Item" : item.fk_procedimento || "Item"} />
          <Text style={themed($itemType)} text="Procedimento" />
          <Text style={themed($itemPrice)} text={`R$ ${parseFloat(item.valor_total || '0').toFixed(2).replace('.', ',')}`} />
        </View>

        <View style={themed($itemActionsContainer)}>
          <TouchableOpacity
            style={themed($removeButton)}
            onPress={() => removeItem(item.id.toString())}
          >
            <Trash2 size={16} color="#FF6B6B" />
          </TouchableOpacity>

          <View style={themed($quantityContainer)}>
            <Text style={themed($quantityText)} text={item.quantidade?.toString() || "1"} />
            <TouchableOpacity
              style={themed($quantityButton)}
              onPress={() => updateItemQuantity(item.id.toString(), true)}
            >
              <Plus size={16} color="#1E90FF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={themed($container)}>
      <Header title="Carrinho" titleStyle={{ color: "white" }} leftIcon="back" leftIconColor="white" onLeftPress={handleBackPress} />

      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        systemBarStyle="light"
      >
        {/* Cart Content */}
        <View style={themed($cartContentContainer)}>
          {/* Select All */}
          <TouchableOpacity style={themed($selectAllContainer)} onPress={toggleSelectAll}>
            <View style={[
              themed($checkbox),
              selectAll && themed($checkboxSelected)
            ]}>
              {selectAll && <Icon icon="check" size={12} color="white" />}
            </View>
            <Text style={themed($selectAllText)} text="Selecionar todos" />
          </TouchableOpacity>

                  {/* Loading State */}
        {isLoading && (
          <View style={themed($loadingContainer)}>
            <Text style={themed($loadingText)} text="Carregando carrinho..." />
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={themed($errorContainer)}>
            <Text style={themed($errorText)} text={error} />
            <TouchableOpacity style={themed($retryButton)} onPress={getCarrinho}>
              <Text style={themed($retryButtonText)} text="Tentar novamente" />
            </TouchableOpacity>
          </View>
        )}

        {/* Cart Items */}
        {!isLoading && !error && cartItems.length === 0 && (
          <View style={themed($emptyContainer)}>
            <Text style={themed($emptyText)} text="Seu carrinho está vazio" />
          </View>
        )}

        {!isLoading && !error && cartItems.map(renderCartItem)}

          {/* Payment Summary */}
          <View style={themed($paymentSummaryContainer)}>
            <Text style={themed($sectionTitle)} text="Resumo do Pagamento" />
            <View style={themed($totalContainer)}>
              <Text style={themed($totalLabel)} text="Total" />
              <Text style={themed($totalValue)} text={`R$ ${totalPrice.toFixed(2).replace('.', ',')}`} />
            </View>
          </View>

          {/* Payment Methods */}
          <View style={themed($paymentMethodsContainer)}>
            <Text style={themed($sectionTitle)} text="Método de Pagamento" />

            {/* VISA Card */}
            <View style={themed($paymentMethodCard)}>
              <Text style={themed($paymentMethodText)} text="VISA" />
              <TouchableOpacity style={themed($changeButton)}>
                <Text style={themed($changeButtonText)} text="Mudar" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Payment Button */}
        <View style={themed($paymentButtonContainer)}>
          <TouchableOpacity
            style={themed($paymentButton)}
            onPress={handlePaymentPress}
            activeOpacity={0.8}
          >
            <Text style={themed($paymentButtonText)} text="Ir para Pagamento" />
          </TouchableOpacity>
        </View>
      </Screen>


    </View>
  )
})

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "#1E90FF",
})

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
  paddingBottom: 100, // Add padding to account for bottom navigation
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
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

const $cartContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
  flex: 1,
})

const $selectAllContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  marginBottom: spacing.lg,
})

const $checkboxContainer: ThemedStyle<ViewStyle> = () => ({
  padding: 4,
})

const $checkbox: ThemedStyle<ViewStyle> = () => ({
  width: 20,
  height: 20,
  borderRadius: 4,
  borderWidth: 2,
  borderColor: "#E0E0E0",
  backgroundColor: "white",
  alignItems: "center",
  justifyContent: "center",
})

const $checkboxSelected: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#4CAF50",
  borderColor: "#4CAF50",
})

const $selectAllText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
  marginLeft: 12,
})

const $cartItemContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: "#F0F0F0",
})

const $itemImageContainer: ThemedStyle<ViewStyle> = () => ({
  marginLeft: 12,
  marginRight: 16,
})

const $itemImage: ThemedStyle<ImageStyle> = () => ({
  width: 60,
  height: 60,
  borderRadius: 8,
  backgroundColor: "#F0F0F0",
})

const $itemIconContainer: ThemedStyle<ViewStyle> = () => ({
  width: 60,
  height: 60,
  borderRadius: 8,
  backgroundColor: "#F0F0F0",
  alignItems: "center",
  justifyContent: "center",
})

const $itemInfoContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $itemName: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
  marginBottom: 4,
})

const $itemType: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#666",
  marginBottom: 8,
})

const $itemPrice: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "700",
  color: "#4CAF50",
})

const $itemActionsContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "flex-end",
  gap: 8,
})

const $removeButton: ThemedStyle<ViewStyle> = () => ({
  padding: 4,
})

const $quantityContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
})

const $quantityText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
  minWidth: 20,
  textAlign: "center",
})

const $quantityButton: ThemedStyle<ViewStyle> = () => ({
  padding: 4,
})

const $paymentSummaryContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
  marginBottom: spacing.lg,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 18,
  fontWeight: "700",
  color: "#333",
  marginBottom: spacing.md,
})

const $totalContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $totalLabel: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
})

const $totalValue: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "700",
  color: "#4CAF50",
})

const $paymentMethodsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

const $paymentMethodCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 12,
  padding: spacing.md,
  marginBottom: spacing.md,
  borderWidth: 1,
  borderColor: "#E0E0E0",
})

const $paymentMethodText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
})

const $changeButton: ThemedStyle<ViewStyle> = () => ({
  paddingVertical: 6,
  paddingHorizontal: 12,
})

const $changeButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "#1E90FF",
})

const $walletCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 12,
  padding: spacing.md,
  borderWidth: 1,
  borderColor: "#E0E0E0",
})

const $walletInfoContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $walletQuestion: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
  marginBottom: 4,
})

const $walletBalance: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#666",
})

const $paymentButtonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.lg,
})

const $paymentButton: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#4CAF50",
  borderRadius: 12,
  paddingVertical: 16,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $paymentButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "700",
  color: "white",
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  paddingVertical: 32,
})

const $loadingText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#666",
})

const $errorContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  paddingVertical: 32,
})

const $errorText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#FF6B6B",
  textAlign: "center",
  marginBottom: 16,
})

const $retryButton: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#1E90FF",
  paddingHorizontal: 24,
  paddingVertical: 8,
  borderRadius: 8,
})

const $retryButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "white",
})

const $emptyContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  paddingVertical: 32,
})

const $emptyText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#666",
  textAlign: "center",
})


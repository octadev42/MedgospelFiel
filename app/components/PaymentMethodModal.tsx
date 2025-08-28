import { FC } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, Modal } from "react-native"
import { observer } from "mobx-react-lite"
import { CreditCard, QrCode, X } from "lucide-react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface PaymentMethodModalProps {
  visible: boolean
  onClose: () => void
  onSelectPix: () => void
  onSelectCreditCard: () => void
  orderData?: any
}

export const PaymentMethodModal: FC<PaymentMethodModalProps> = observer(
  function PaymentMethodModal({ visible, onClose, onSelectPix, onSelectCreditCard, orderData }) {
    const { themed } = useAppTheme()

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={themed($modalOverlay)}>
          <View style={themed($modalContainer)}>
            {/* Header */}
            <View style={themed($modalHeader)}>
              <Text style={themed($modalTitle)} text="Escolha o método de pagamento" />
              <TouchableOpacity style={themed($closeButton)} onPress={onClose}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Order Summary */}
            {orderData && (
              <View style={themed($orderSummary)}>
                <Text style={themed($orderSummaryTitle)} text="Resumo do Pedido" />
                {/* <View style={themed($orderSummaryRow)}>
                  <Text style={themed($orderSummaryLabel)} text="Número do Pedido:" />
                  <Text style={themed($orderSummaryValue)} text={orderData.numero_pedido || orderData.id} />
                </View> */}
                <View style={themed($orderSummaryRow)}>
                  <Text style={themed($orderSummaryLabel)} text="Total:" />
                  <Text style={themed($orderSummaryValue)} text={`R$ ${parseFloat(orderData.valor_total || '0').toFixed(2).replace('.', ',')}`} />
                </View>
              </View>
            )}

            {/* Payment Methods */}
            <View style={themed($paymentMethodsContainer)}>
              {/* PIX Option */}
              <TouchableOpacity
                style={themed($paymentMethodOption)}
                onPress={onSelectPix}
                activeOpacity={0.8}
              >
                <View style={themed($paymentMethodIcon)}>
                  <QrCode size={32} color="#4CAF50" />
                </View>
                <View style={themed($paymentMethodContent)}>
                  <Text style={themed($paymentMethodTitle)} text="PIX" />
                  <Text style={themed($paymentMethodDescription)} text="Pagamento instantâneo via PIX" />
                </View>
              </TouchableOpacity>

              {/* Credit Card Option */}
              <TouchableOpacity
                style={themed($paymentMethodOption)}
                onPress={onSelectCreditCard}
                activeOpacity={0.8}
              >
                <View style={themed($paymentMethodIcon)}>
                  <CreditCard size={32} color="#1E90FF" />
                </View>
                <View style={themed($paymentMethodContent)}>
                  <Text style={themed($paymentMethodTitle)} text="Cartão de Crédito" />
                  <Text style={themed($paymentMethodDescription)} text="Pagamento com cartão de crédito" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              style={themed($cancelButton)}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={themed($cancelButtonText)} text="Cancelar" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  },
)

const $modalOverlay: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
})

const $modalContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderRadius: 16,
  padding: spacing.lg,
  margin: spacing.lg,
  width: "90%",
  maxWidth: 400,
})

const $modalHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.lg,
})

const $modalTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 20,
  fontWeight: "700",
  color: colors.text,
  flex: 1,
})

const $closeButton: ThemedStyle<ViewStyle> = () => ({
  padding: 4,
})

const $orderSummary: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  padding: spacing.md,
  marginBottom: spacing.lg,
})

const $orderSummaryTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 16,
  fontWeight: "600",
  color: colors.text,
  marginBottom: spacing.sm,
})

const $orderSummaryRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.xs,
})

const $orderSummaryLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.palette.neutral600,
})

const $orderSummaryValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  fontWeight: "600",
  color: colors.text,
})

const $paymentMethodsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $paymentMethodOption: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.background,
  borderRadius: 12,
  padding: spacing.md,
  marginBottom: spacing.md,
  borderWidth: 1,
  borderColor: colors.palette.neutral200,
})

const $paymentMethodIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.md,
})

const $paymentMethodContent: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $paymentMethodTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 16,
  fontWeight: "600",
  color: colors.text,
  marginBottom: spacing.xxs,
})

const $paymentMethodDescription: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 14,
  color: colors.palette.neutral600,
})

const $cancelButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  paddingVertical: spacing.md,
  alignItems: "center",
})

const $cancelButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  fontWeight: "600",
  color: colors.text,
})

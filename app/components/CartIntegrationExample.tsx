import React from "react"
import { View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { ScheduleCalendar } from "@/components/ScheduleCalendar"
import { useCart } from "@/hooks/useCart"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface CartIntegrationExampleProps {
  horarios?: Array<{
    id?: number
    data?: string
    hora_inicial: string
    hora_final: string
    vagas_disponiveis?: number
    vagas_total?: number
    vagas?: number
    dias_semana?: number[]
    fk_tabela_preco_item_horario?: number
    horario_completo?: boolean
  }>
  tipo_agenda: 'AGENDA_CLINICA' | 'AGENDA_PROFISSIONAL' | 'LIVRE_LIMITADA' | 'AGENDA_LIVRE'
  tabelaPrecoItemId: number
  valor: string
  pacienteId: number
}

export const CartIntegrationExample: React.FC<CartIntegrationExampleProps> = observer(function CartIntegrationExample({
  horarios = [],
  tipo_agenda,
  tabelaPrecoItemId,
  valor,
  pacienteId,
}) {
  const { themed } = useAppTheme()
  const {
    selectedTimeSlot,
    selectedDate,
    hasRequiredFieldsForCart,
    cartItemToAdd,
    isAddingToCart,
    addToCart,
    cartItems,
  } = useCart()

  const handleAddToCart = async () => {
    const result = await addToCart()
    if (result.success) {
      console.log("Item added to cart successfully!")
    } else {
      console.error("Failed to add item to cart:", result.error)
    }
  }

  return (
    <View style={themed($container)}>
      <Text style={themed($title)} text="Agendamento com Carrinho" />
      
      {/* Schedule Calendar with Cart Integration */}
      <ScheduleCalendar
        tipo_agenda={tipo_agenda}
        horarios={horarios}
        tabelaPrecoItemId={tabelaPrecoItemId}
        valor={valor}
        pacienteId={pacienteId}
        enableCartIntegration={true}
      />

      {/* Cart Status */}
      <View style={themed($statusContainer)}>
        <Text style={themed($statusTitle)} text="Status do Carrinho:" />
        
        <Text style={themed($statusText)} text={`Horário selecionado: ${selectedTimeSlot?.time || 'Nenhum'}`} />
        <Text style={themed($statusText)} text={`Data selecionada: ${selectedDate || 'Nenhuma'}`} />
        <Text style={themed($statusText)} text={`Campos obrigatórios preenchidos: ${hasRequiredFieldsForCart ? 'Sim' : 'Não'}`} />
        <Text style={themed($statusText)} text={`Itens no carrinho: ${cartItems.length}`} />
        
        {cartItemToAdd && (
          <View style={themed($cartItemContainer)}>
            <Text style={themed($cartItemTitle)} text="Item a ser adicionado:" />
            <Text style={themed($cartItemText)} text={`fk_tabela_preco_item: ${cartItemToAdd.fk_tabela_preco_item}`} />
            <Text style={themed($cartItemText)} text={`fk_tabela_preco_item_horario: ${cartItemToAdd.fk_tabela_preco_item_horario}`} />
            <Text style={themed($cartItemText)} text={`data_agendada: ${cartItemToAdd.data_agendada || 'N/A'}`} />
            <Text style={themed($cartItemText)} text={`valor: ${cartItemToAdd.valor}`} />
          </View>
        )}
      </View>

      {/* Add to Cart Button */}
      <Button
        text={isAddingToCart ? "Adicionando..." : "Adicionar ao Carrinho"}
        onPress={handleAddToCart}
        disabled={!hasRequiredFieldsForCart || isAddingToCart}
        style={themed($addToCartButton)}
      />
    </View>
  )
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.md,
})

const $title: ThemedStyle<ViewStyle> = () => ({
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 16,
  textAlign: "center",
})

const $statusContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#f5f5f5",
  padding: spacing.md,
  borderRadius: 8,
  marginVertical: spacing.md,
})

const $statusTitle: ThemedStyle<ViewStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 8,
})

const $statusText: ThemedStyle<ViewStyle> = () => ({
  fontSize: 14,
  marginBottom: 4,
})

const $cartItemContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#e8f5e8",
  padding: spacing.sm,
  borderRadius: 6,
  marginTop: spacing.sm,
})

const $cartItemTitle: ThemedStyle<ViewStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  marginBottom: 4,
  color: "#2e7d32",
})

const $cartItemText: ThemedStyle<ViewStyle> = () => ({
  fontSize: 12,
  marginBottom: 2,
  color: "#2e7d32",
})

const $addToCartButton: ThemedStyle<ViewStyle> = () => ({
  marginTop: 16,
})

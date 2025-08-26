import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ecommerceService, PedidoItemCreate, CarrinhoAddItensRequest } from "@/services/ecommerce.service"
import { showToast } from "@/components/Toast"

export const CartStoreModel = types
  .model("CartStore")
  .props({
    selectedTimeSlot: types.maybe(types.frozen<{
      id: string
      time: string
      available: boolean
      vagas_disponiveis?: number
      originalData?: any
    }>()),
    selectedDate: types.maybe(types.string),
    selectedPacienteId: types.maybe(types.number),
    selectedTabelaPrecoItem: types.maybe(types.number),
    selectedValor: types.maybe(types.string),
    isAddingToCart: types.optional(types.boolean, false),
    cartItems: types.optional(types.array(types.frozen<PedidoItemCreate>()), []),
  })
  .views((store) => ({
    get hasRequiredFieldsForCart() {
      return !!(
        store.selectedTimeSlot?.originalData?.fk_tabela_preco_item_horario &&
        store.selectedPacienteId &&
        store.selectedTabelaPrecoItem &&
        store.selectedValor
      )
    },
    get cartItemToAdd(): PedidoItemCreate | null {
      if (!store.hasRequiredFieldsForCart) return null
      
      return {
        fk_tabela_preco_item: store.selectedTabelaPrecoItem!,
        fk_tabela_preco_item_horario: store.selectedTimeSlot!.originalData!.fk_tabela_preco_item_horario,
        quantidade: 1,
        data_agendada: store.selectedDate,
        valor: store.selectedValor!,
      }
    }
  }))
  .actions((self) => ({
    setSelectedTimeSlot(timeSlot: {
      id: string
      time: string
      available: boolean
      vagas_disponiveis?: number
      originalData?: any
    }) {
      self.selectedTimeSlot = timeSlot
    },
    setSelectedDate(date: string) {
      self.selectedDate = date
    },
    setSelectedPacienteId(pacienteId: number) {
      self.selectedPacienteId = pacienteId
    },
    setSelectedTabelaPrecoItem(tabelaPrecoItemId: number) {
      self.selectedTabelaPrecoItem = tabelaPrecoItemId
    },
    setSelectedValor(valor: string) {
      self.selectedValor = valor
    },
    async addToCart() {
      if (!self.hasRequiredFieldsForCart) {
        showToast.error("Erro", "Informações incompletas para adicionar ao carrinho")
        return { success: false, error: "Missing required fields" }
      }

      if (!self.cartItemToAdd) {
        showToast.error("Erro", "Item do carrinho não pôde ser criado")
        return { success: false, error: "Could not create cart item" }
      }

      self.isAddingToCart = true

      try {
        const request: CarrinhoAddItensRequest = {
          fk_paciente: self.selectedPacienteId!,
          itens: [self.cartItemToAdd]
        }

        const response = await ecommerceService.addAoCarrinho(request)

        if (response.kind === "ok") {
          showToast.success("Sucesso", "Item adicionado ao carrinho com sucesso!")
          
          // Add to local cart items
          self.cartItems.push(self.cartItemToAdd)
          
          // Reset selection after successful add
          self.resetSelection()
          
          return { success: true, data: response.data }
        } else {
          const errorMessage = response.error?.message || "Erro ao adicionar ao carrinho"
          showToast.error("Erro", errorMessage)
          return { success: false, error: errorMessage }
        }
      } catch (error) {
        const errorMessage = "Erro inesperado ao adicionar ao carrinho"
        showToast.error("Erro", errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        self.isAddingToCart = false
      }
    },
    resetSelection() {
      self.selectedTimeSlot = undefined
      self.selectedDate = undefined
      self.selectedTabelaPrecoItem = undefined
      self.selectedValor = undefined
    },
    clearCart() {
      self.cartItems.clear()
    },
    removeFromCart(index: number) {
      if (index >= 0 && index < self.cartItems.length) {
        self.cartItems.splice(index, 1)
      }
    }
  }))

export interface CartStore extends Instance<typeof CartStoreModel> {}
export interface CartStoreSnapshot extends SnapshotOut<typeof CartStoreModel> {}

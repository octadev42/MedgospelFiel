import { useStores } from "@/models"

export const useCart = () => {
  const { cartStore } = useStores()
  
  return {
    // State
    selectedTimeSlot: cartStore.selectedTimeSlot,
    selectedDate: cartStore.selectedDate,
    selectedPacienteId: cartStore.selectedPacienteId,
    selectedTabelaPrecoItem: cartStore.selectedTabelaPrecoItem,
    selectedValor: cartStore.selectedValor,
    isAddingToCart: cartStore.isAddingToCart,
    cartItems: cartStore.cartItems,
    
    // Computed
    hasRequiredFieldsForCart: cartStore.hasRequiredFieldsForCart,
    cartItemToAdd: cartStore.cartItemToAdd,
    
    // Actions
    setSelectedTimeSlot: cartStore.setSelectedTimeSlot,
    setSelectedDate: cartStore.setSelectedDate,
    setSelectedPacienteId: cartStore.setSelectedPacienteId,
    setSelectedTabelaPrecoItem: cartStore.setSelectedTabelaPrecoItem,
    setSelectedValor: cartStore.setSelectedValor,
    addToCart: cartStore.addToCart,
    resetSelection: cartStore.resetSelection,
    clearCart: cartStore.clearCart,
    removeFromCart: cartStore.removeFromCart,
  }
}

import { useState, useCallback } from "react"
import { useStores } from "@/models"
import { ecommerceService, CarrinhoAddItensRequest } from "@/services/ecommerce.service"
import { showToast } from "@/components/Toast"

export const useCarrinho = () => {
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const getCarrinho = useCallback(async () => {
    if (!authenticationStore.authToken) {
      setError("Usuário não autenticado")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await ecommerceService.getCarrinho(authenticationStore.authToken)
      
      if (response.kind === "ok") {
        setCartItems(response.data || [])
        return response.data
      } else {
        const errorMessage = response.error?.message || "Erro ao carregar carrinho"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return null
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao carregar carrinho"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [authenticationStore.authToken])

  const addToCarrinho = useCallback(async (params: CarrinhoAddItensRequest) => {
    if (!authenticationStore.authToken) {
      setError("Usuário não autenticado")
      showToast.error("Erro", "Usuário não autenticado")
      return { success: false, error: "Usuário não autenticado" }
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await ecommerceService.addAoCarrinho(params, authenticationStore.authToken)
      
      if (response.kind === "ok") {
        showToast.success("Sucesso", "Item adicionado ao carrinho!")
        
        // Refresh cart items after adding
        await getCarrinho()
        
        return { success: true, data: response.data }
      } else {
        const errorMessage = response.error?.message || "Erro ao adicionar ao carrinho"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao adicionar ao carrinho"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [authenticationStore.authToken, getCarrinho])

  return {
    cartItems,
    isLoading,
    error,
    getCarrinho,
    addToCarrinho,
    isAuthenticated: !!authenticationStore.authToken,
  }
}

import { useState, useCallback } from "react"
import { useStores } from "@/models"
import { ecommerceService, CartaoPFRequestValidacao, CartaoPFResponse, CartaoPessoaFisicaCreate } from "@/services/ecommerce.service"
import { showToast } from "@/components/Toast"

export const useCartoes = () => {
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [cartoes, setCartoes] = useState<CartaoPFResponse[]>([])
  const [error, setError] = useState<string | null>(null)

  const getCartoes = useCallback(async () => {
    if (!authenticationStore.authToken) {
      setError("Usuário não autenticado")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await ecommerceService.getCartoes(authenticationStore.authToken)
      
      if (response.kind === "ok") {
        setCartoes(response.data || [])
        return response.data
      } else {
        const errorMessage = response.error?.message || "Erro ao carregar cartões"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return null
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao carregar cartões"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [authenticationStore.authToken])

  const criarCartao = useCallback(async (params: CartaoPFRequestValidacao) => {
    if (!authenticationStore.authToken) {
      setError("Usuário não autenticado")
      showToast.error("Erro", "Usuário não autenticado")
      return { success: false, error: "Usuário não autenticado" }
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await ecommerceService.criarCartao(params, authenticationStore.authToken)
      
      if (response.kind === "ok") {
        showToast.success("Sucesso", "Cartão adicionado com sucesso!")
        
        // Refresh cartoes list after adding
        await getCartoes()
        
        return { success: true, data: response.data }
      } else {
        const errorMessage = response.error?.message || "Erro ao adicionar cartão"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao adicionar cartão"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [authenticationStore.authToken, getCartoes])

  const deletarCartao = useCallback(async (cartaoId: number) => {
    if (!authenticationStore.authToken) {
      setError("Usuário não autenticado")
      showToast.error("Erro", "Usuário não autenticado")
      return { success: false, error: "Usuário não autenticado" }
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await ecommerceService.deletarCartao(cartaoId, authenticationStore.authToken)
      
      if (response.kind === "ok") {
        showToast.success("Sucesso", "Cartão removido com sucesso!")
        
        // Refresh cartoes list after removing
        await getCartoes()
        
        return { success: true }
      } else {
        const errorMessage = response.error?.message || "Erro ao remover cartão"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao remover cartão"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [authenticationStore.authToken, getCartoes])

  return {
    cartoes,
    isLoading,
    error,
    getCartoes,
    criarCartao,
    deletarCartao,
    isAuthenticated: !!authenticationStore.authToken,
  }
}

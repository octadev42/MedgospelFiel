import { useState, useCallback } from "react"
import { useStores } from "@/models"
import { ecommerceService, CarrinhoAddItensRequest, CarrinhoRemoverItensRequest, GerarPedidoResponse, GerarPedidoRequest, PagamentoRequest, PagamentoResponse } from "@/services/ecommerce.service"
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

  const removeFromCarrinho = useCallback(async (itemIds: number[]) => {
    if (!authenticationStore.authToken) {
      setError("Usuário não autenticado")
      showToast.error("Erro", "Usuário não autenticado")
      return { success: false, error: "Usuário não autenticado" }
    }

    setIsLoading(true)
    setError(null)

    try {
      const params: CarrinhoRemoverItensRequest = {
        itens: itemIds
      }
      
      const response = await ecommerceService.removerItensCarrinho(params, authenticationStore.authToken)
      
      if (response.kind === "ok") {
        showToast.success("Sucesso", "Itens removidos do carrinho!")
        
        // Refresh cart items after removing
        await getCarrinho()
        
        return { success: true, data: response.data }
      } else {
        const errorMessage = response.error?.message || "Erro ao remover itens do carrinho"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao remover itens do carrinho"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [authenticationStore.authToken, getCarrinho])

  const gerarPedido = useCallback(async (selectedItemIds: number[]) => {
    if (!authenticationStore.authToken) {
      setError("Usuário não autenticado")
      showToast.error("Erro", "Usuário não autenticado")
      return { success: false, error: "Usuário não autenticado" }
    }

    if (selectedItemIds.length === 0) {
      setError("Nenhum item selecionado")
      showToast.error("Erro", "Nenhum item selecionado")
      return { success: false, error: "Nenhum item selecionado" }
    }

    setIsLoading(true)
    setError(null)

    try {
      const params: GerarPedidoRequest = {
        itens: selectedItemIds
      }
      
      const response = await ecommerceService.gerarPedido(params, authenticationStore.authToken)
      
      if (response.kind === "ok") {
        showToast.success("Sucesso", "Pedido gerado com sucesso!")
        
        // Clear cart items after successful order generation
        setCartItems([])
        
        return { success: true, data: response.data }
      } else {
        const errorMessage = response.error?.message || "Erro ao gerar pedido"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao gerar pedido"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [authenticationStore.authToken, cartItems.length])

  const criarPagamento = useCallback(async (params: PagamentoRequest) => {
    if (!authenticationStore.authToken) {
      setError("Usuário não autenticado")
      showToast.error("Erro", "Usuário não autenticado")
      return { success: false, error: "Usuário não autenticado" }
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await ecommerceService.criarPagamento(params, authenticationStore.authToken)
      
      if (response.kind === "ok") {
        const isPix = 'qr_code' in response.data
        const message = isPix 
          ? "Pagamento PIX criado com sucesso!" 
          : "Pagamento com cartão processado com sucesso!"
        
        showToast.success("Sucesso", message)
        
        return { success: true, data: response.data }
      } else {
        const errorMessage = response.error?.message || "Erro ao processar pagamento"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao processar pagamento"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [authenticationStore.authToken])

  return {
    cartItems,
    isLoading,
    error,
    getCarrinho,
    addToCarrinho,
    removeFromCarrinho,
    gerarPedido,
    criarPagamento,
    isAuthenticated: !!authenticationStore.authToken,
  }
}

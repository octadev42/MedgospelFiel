import { useState, useCallback } from "react"
import { useStores } from "@/models"
import { ecommerceService, Cirurgia } from "@/services/ecommerce.service"
import { showToast } from "@/components/Toast"

export const useCirurgias = () => {
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [cirurgias, setCirurgias] = useState<Cirurgia[]>([])
  const [error, setError] = useState<string | null>(null)

  const getCirurgias = useCallback(async (params: {
    search?: string
    descricao?: string
    fk_pessoa_juridica?: number
    informacoes?: string
    nome_fantasia?: string
    situacao?: string
    valor?: number
    ordering?: string
    page?: number
  } = {}) => {
    console.log('getCirurgias called with params:', params)
    setIsLoading(true)
    setError(null)

    try {
      const response = await ecommerceService.getCirurgias(params)
      
      if (response.kind === "ok") {
        console.log('Cirurgias loaded successfully:', response.data?.length || 0, 'items')
        setCirurgias(response.data || [])
        return response.data
      } else {
        const errorMessage = response.error?.message || "Erro ao carregar cirurgias"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return null
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao carregar cirurgias"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchCirurgias = useCallback(async (searchTerm: string) => {
    console.log('Searching for:', searchTerm)
    
    if (!searchTerm.trim()) {
      console.log('Empty search term, loading all cirurgias')
      return getCirurgias()
    }
    
    console.log('Searching with term:', searchTerm)
    return getCirurgias({ search: searchTerm })
  }, [getCirurgias])

  return {
    cirurgias,
    isLoading,
    error,
    getCirurgias,
    searchCirurgias,
    isAuthenticated: !!authenticationStore.authToken,
  }
}

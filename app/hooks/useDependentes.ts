import { useState, useCallback } from "react"
import { useStores } from "@/models"
import { ecommerceService, Dependente } from "@/services/ecommerce.service"
import { showToast } from "@/components/Toast"

export const useDependentes = () => {
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [dependentes, setDependentes] = useState<Dependente[]>([])
  const [error, setError] = useState<string | null>(null)

  const getDependentes = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await ecommerceService.getDependentes(authenticationStore.authToken)
      
      if (response.kind === "ok") {
        setDependentes(response.data || [])
        return response.data
      } else {
        const errorMessage = response.error?.message || "Erro ao carregar dependentes"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return null
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao carregar dependentes"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [authenticationStore.authToken])

  return {
    dependentes,
    isLoading,
    error,
    getDependentes,
    isAuthenticated: !!authenticationStore.authToken,
  }
}

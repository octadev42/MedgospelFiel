import { useState, useCallback } from "react"
import { useStores } from "@/models"
import { ecommerceService, PessoaFisicaUpdate } from "@/services/ecommerce.service"
import { showToast } from "@/components/Toast"

export const usePessoaFisica = () => {
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updatePessoaFisica = useCallback(async (
    id: number,
    data: PessoaFisicaUpdate
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await ecommerceService.updatePessoaFisica(
        id,
        data,
        authenticationStore.authToken
      )
      
      if (response.kind === "ok") {
        showToast.success("Sucesso", "Dados atualizados com sucesso!")
        return response.data
      } else {
        const errorMessage = response.error?.message || "Erro ao atualizar dados"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return null
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao atualizar dados"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [authenticationStore.authToken])

  return {
    isLoading,
    error,
    updatePessoaFisica,
    isAuthenticated: !!authenticationStore.authToken,
  }
}

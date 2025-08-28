import { useState, useCallback } from "react"
import { ecommerceService, DominioValor } from "@/services/ecommerce.service"
import { showToast } from "@/components/Toast"

/**
 * Hook for fetching and managing domain values from the API
 * 
 * @example
 * // Basic usage
 * const { dominioValores, isLoading, error, getDominioValores } = useDominios()
 * 
 * useEffect(() => {
 *   getDominioValores("GRAU_PARENTESCO")
 * }, [])
 * 
 * @example
 * // Using with Select component
 * const { getActiveOptionsForSelect } = useDominios()
 * const options = getActiveOptionsForSelect()
 * 
 * @example
 * // Finding a specific value
 * const { findDominioValor } = useDominios()
 * const parentesco = findDominioValor("FILHO")
 */

export const useDominios = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [dominioValores, setDominioValores] = useState<DominioValor[]>([])
  const [error, setError] = useState<string | null>(null)

    const getDominioValores = useCallback(async (mnemonico: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await ecommerceService.getDominioValores({ mnemonico })
      
      if (response.kind === "ok") {
        // Handle direct array response
        const results = response.data || []
        setDominioValores(results)
        return results
      } else {
        const errorMessage = response.error?.message || "Erro ao carregar valores do domínio"
        setError(errorMessage)
        showToast.error("Erro", errorMessage)
        return []
      }
    } catch (err) {
      const errorMessage = "Erro inesperado ao carregar valores do domínio"
      setError(errorMessage)
      showToast.error("Erro", errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Utility functions for form usage
  const getOptionsForSelect = useCallback(() => {
    return dominioValores.map(item => ({
      label: item.fk_valor,
      value: item.fk_valor,
      id: item.id,
      status: item.status
    }))
  }, [dominioValores])

  const getActiveOptionsForSelect = useCallback(() => {
    return dominioValores
      .filter(item => item.status === true)
      .map(item => ({
        label: item.fk_valor,
        value: item.fk_valor,
        id: item.id,
        status: item.status
      }))
  }, [dominioValores])

  const findDominioValor = useCallback((valor: string) => {
    return dominioValores.find(item => item.fk_valor === valor)
  }, [dominioValores])

  return {
    dominioValores,
    isLoading,
    error,
    getDominioValores,
    getOptionsForSelect,
    getActiveOptionsForSelect,
    findDominioValor,
  }
}

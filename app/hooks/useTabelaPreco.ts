import { useState, useEffect } from "react"
import { ecommerceService } from "@/services/ecommerce.service"
import type { TabelaPrecoResponse } from "@/services/ecommerce.service"

interface UseTabelaPrecoParams {
  app?: boolean
  fk_procedimento?: string
  tipo_procedimento?: string
  fk_especialista?: number
  fk_especialidade?: number
  fk_estabelecimento?: number
  fk_cidade?: number
}

interface UseTabelaPrecoReturn {
  loading: boolean
  error: string | null
  data: TabelaPrecoResponse | null
  refetch: () => Promise<void>
}

export const useTabelaPreco = (params: UseTabelaPrecoParams = {}): UseTabelaPrecoReturn => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TabelaPrecoResponse | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('useTabelaPreco Debug - params:', params)
      
      const response = await ecommerceService.tabelaPreco(
        params.app ?? true,
        params.fk_procedimento,
        params.tipo_procedimento,
        params.fk_especialista,
        params.fk_especialidade,
        params.fk_estabelecimento,
        params.fk_cidade ?? 818,
      )
      console.log('response', response)
      if (response.kind === "ok") {
        setData(response.data)
      } else {
        setError(response.error?.message || "Erro ao carregar dados")
      }
    } catch (err) {
      setError("Erro inesperado ao carregar dados")
      console.error("Error fetching tabela preco:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [
    params.app,
    params.fk_procedimento,
    params.tipo_procedimento,
    params.fk_especialidade,
    params.fk_especialista,
    params.fk_estabelecimento,
    params.fk_cidade
  ])
  console.log('data', data)
  return {
    loading,
    error,
    data,
    refetch: fetchData
  }
}

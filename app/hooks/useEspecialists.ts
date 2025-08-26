import { useEffect, useState } from "react"

import { useStores } from "@/models"
import { authService, PessoaFisicaData } from "@/services/auth.service"
import { showToast } from "@/components/Toast"
import { showApiErrors } from "@/utils/errorHandler"
import { ecommerceService, Especialista } from "@/services/ecommerce.service"

interface UseEspecialistsReturn {
    loading: boolean
    error: string | null
    especialistas: Especialista[]
}

export const useEspecialists = (especialityId?: number): UseEspecialistsReturn => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [especialistas, setEspecialistas] = useState<Especialista[]>([])

    // Debug logging
    console.log('useEspecialists hook called with especialityId:', especialityId)

    useEffect(() => {
        const fetchEspecialistas = async () => {
            setLoading(true)
            setError(null)
            
            console.log('Calling especialistas API with params:', {
                fk_especialidade: especialityId?.toString(),
                especialityId
            })
            
            const result = await ecommerceService.especialistas(
                undefined, // fk_procedimento
                especialityId?.toString(), // fk_especialidade
                undefined, // fk_cidade
                undefined, // fk_estabelecimento
                undefined, // ordering
                undefined, // page
                undefined  // search
            )
            
            if (result.kind === "ok") {
                setEspecialistas(result.data)
            } else {
                setError(result.error || "Erro ao carregar especialistas")
            }
            
            setLoading(false)
        }
        
        fetchEspecialistas()
    }, [especialityId])

    return {
        loading,
        error,
        especialistas,
    }
}
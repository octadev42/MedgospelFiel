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

export const useEspecialists = (): UseEspecialistsReturn => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [especialistas, setEspecialistas] = useState<Especialista[]>([])

    useEffect(() => {
        const fetchEspecialistas = async () => {

            setLoading(true)
            const result = await ecommerceService.especialistas()
            if (result.kind === "ok") {
                setEspecialistas(result.data)
            } else {
                setError(result.error)
            }
        }
        fetchEspecialistas()
    }, [])

    return {
        loading,
        error,
        especialistas,
    }
}
import { useState, useEffect } from "react"
import { ecommerceService, ProcedimentosResponse, ProcedimentoEcommerce } from "../services/ecommerce.service"

export const useProcedimentos = () => {
    const [procedimentos, setProcedimentos] = useState<ProcedimentosResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProcedimentos = async (
        codigo?: string,
        descricao?: string,
        grupo?: string,
        nome?: string,
        ordering?: string,
        page?: number,
        search?: string,
        sigla?: string,
        sinonimia?: string,
        situacao?: string,
        status?: boolean,
        tipo?: string,
    ) => {
        setLoading(true)
        setError(null)

        try {
            const result = await ecommerceService.procedimentos(
                codigo,
                descricao,
                grupo,
                nome,
                ordering,
                page,
                search,
                sigla,
                sinonimia,
                situacao,
                status,
                tipo,
            )

            if (result.kind === "ok") {
                setProcedimentos(result.data)
            } else {
                setError("Erro ao carregar procedimentos")
            }
        } catch (err) {
            setError("Erro inesperado ao carregar procedimentos")
        } finally {
            setLoading(false)
        }
    }

    return {
        procedimentos,
        loading,
        error,
        fetchProcedimentos,
    }
}

interface ProcedimentosEcommerceParams {
    fk_cidade?: number
    tipo_procedimento: "EL" | "EI" | "PP"
    app?: boolean
    nome?: string
}

export const useProcedimentosEcommerce = () => {
    const [procedimentos, setProcedimentos] = useState<ProcedimentoEcommerce[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProcedimentosEcommerce = async (params: ProcedimentosEcommerceParams) => {
        setLoading(true)
        setError(null)

        try {
            const result = await ecommerceService.procedimentosEcommerce(
                params.fk_cidade ?? 818,
                params.tipo_procedimento,
                params.app ?? true,
                params.nome,
            )

            if (result.kind === "ok") {
                // Transform the data to add concatenated ID
                const transformedData = result.data.map(procedimento => ({
                    ...procedimento,
                    id: `${procedimento.fk_procedimento}.${procedimento.subgrupo_codigo}`
                }))
                setProcedimentos(transformedData)
            } else {
                setError("Erro ao carregar procedimentos")
            }
        } catch (err) {
            setError("Erro inesperado ao carregar procedimentos")
        } finally {
            setLoading(false)
        }
    }

    return {
        procedimentos,
        loading,
        error,
        fetchProcedimentosEcommerce,
    }
}

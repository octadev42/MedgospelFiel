import { api } from "@/services/api"
import { GeneralApiProblem, getGeneralApiProblem } from "@/services/api/apiProblem"

export interface CEPResponse {
    cep: string
    logradouro: string
    complemento: string
    unidade: string
    bairro: string
    localidade: string
    uf: string
    estado: string
    regiao: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
}

export const cepLib = {
    getCEPInfo: async (cep: string): Promise<{ kind: "ok"; data: CEPResponse } | GeneralApiProblem | null> => {
        const response = await api.apisauce.get<CEPResponse>(`https://viacep.com.br/ws/${cep}/json/`)

        if (response.ok && response.data) {
            return {
                kind: "ok",
                data: response.data
            }
        }

        return getGeneralApiProblem(response)
    }
}
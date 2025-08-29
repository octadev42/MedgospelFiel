import { api } from "./api"
import { GeneralApiProblem, getGeneralApiProblem } from "./api/apiProblem"
import { getGeneralApiProblemWithAuthHandling } from "./api/authHandler"

// Types for location
export interface Cidade {
    id: number
    nome: string
    uf: string
    numero_ibge?: string
    is_capital?: boolean
}

export const locationService = {
    async getCidadesByState(uf: string): Promise<{ kind: "ok"; data: Cidade[] } | GeneralApiProblem | null> {
        const response = await api.apisauce.get<Cidade[]>(`https://98.84.138.10.nip.io/v1/cidades/?uf=${uf}`)

        if (response.ok && response.data) {
            return {
                kind: "ok",
                data: response.data
            }
        } else {
            return getGeneralApiProblemWithAuthHandling(response)
        }
    },

    getStateAbbreviation(stateName: string): string {
        const stateMap: { [key: string]: string } = {
            'Acre': 'AC',
            'Alagoas': 'AL',
            'Amapá': 'AP',
            'Amazonas': 'AM',
            'Bahia': 'BA',
            'Ceará': 'CE',
            'Distrito Federal': 'DF',
            'Espírito Santo': 'ES',
            'Goiás': 'GO',
            'Maranhão': 'MA',
            'Mato Grosso': 'MT',
            'Mato Grosso do Sul': 'MS',
            'Minas Gerais': 'MG',
            'Pará': 'PA',
            'Paraíba': 'PB',
            'Paraná': 'PR',
            'Pernambuco': 'PE',
            'Piauí': 'PI',
            'Rio de Janeiro': 'RJ',
            'Rio Grande do Norte': 'RN',
            'Rio Grande do Sul': 'RS',
            'Rondônia': 'RO',
            'Roraima': 'RR',
            'Santa Catarina': 'SC',
            'São Paulo': 'SP',
            'Sergipe': 'SE',
            'Tocantins': 'TO'
        }

        return stateMap[stateName] || stateName
    }
}
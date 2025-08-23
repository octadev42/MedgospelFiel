import { ApiResponse } from "apisauce"

import { api } from "./api"
import { GeneralApiProblem, getGeneralApiProblem } from "./api/apiProblem"

export type TabelaPrecoResponse = Array<{
    fk_pessoa_juridica: number
    nome_fantasia: string
    endereco: string
    telefone: string
    valor_total: number
    valor_total_disponivel: number
    foto: string
    itens: Array<{
        nome: string
        subgrupo_codigo: string | null
        subgrupo_descricao: string | null
        disponivel: boolean
        valor_item: number
        ordem: string
        fk_tabela_preco_item: number
        observacao: string
        informacao: string
        venda_generica: boolean
        venda_restrita: boolean
        horario_marcado: boolean
        exibir_horario_completo: boolean
        tipo_agenda: string
        horarios_tabela_preco: Array<{
            id: number
            data: string
            hora_inicial: string
            hora_final: string
            vagas_total: number
            vagas_disponiveis: number
        }>
    }>
}>

const mockTabelaPrecoResponse: TabelaPrecoResponse = [
    {
        "fk_pessoa_juridica": 12345,
        "nome_fantasia": "HVisão",
        "endereco": "Rua das Flores, 123 - Centro, São Paulo - SP",
        "telefone": "(11) 3456-7890",
        "foto": 'https://lh3.googleusercontent.com/p/AF1QipOSGiGTeyViY0RBgxfWrEvOl6PjL8XkLDY7qenz=s1360-w1360-h1020-rw',
        "valor_total": 850.00,
        "valor_total_disponivel": 650.00,
        "itens": [
            {
                "nome": "Consulta Cardiologista",
                "subgrupo_codigo": null,
                "subgrupo_descricao": null,
                "disponivel": true,
                "valor_item": 250.00,
                "ordem": "1",
                "fk_tabela_preco_item": 1001,
                "observacao": "Trazer exames anteriores se houver",
                "informacao": "Consulta com Dr. Carlos Silva - Cardiologista",
                "venda_generica": true,
                "venda_restrita": false,
                "horario_marcado": true,
                "exibir_horario_completo": true,
                "tipo_agenda": "LIVRE_LIMITADO",
                "horarios_tabela_preco": [
                    {
                        "id": 2001,
                        "data": "2025-07-15",
                        "hora_inicial": "09:00:00",
                        "hora_final": "09:30:00",
                        "vagas_total": 1,
                        "vagas_disponiveis": 1
                    },
                    {
                        "id": 2002,
                        "data": "2025-07-15",
                        "hora_inicial": "14:00:00",
                        "hora_final": "14:30:00",
                        "vagas_total": 1,
                        "vagas_disponiveis": 0
                    },
                    {
                        "id": 2003,
                        "data": "2025-07-16",
                        "hora_inicial": "10:00:00",
                        "hora_final": "10:30:00",
                        "vagas_total": 1,
                        "vagas_disponiveis": 1
                    }
                ]
            },
        ]
    }
]

export interface Especialista {
    id: number
    usuario_criacao: string
    usuario_edicao: string
    usuario_delecao: string | null
    data_criacao: string
    data_edicao: string
    data_delecao: string | null
    nome: string
    email: string
    foto: string
    situacao: string
    tipo_conselho: string
    numero_conselho: string
    perfil: string
    observacao: string
    codigo_externo: number
    uf_conselho: string
    fk_pessoa_juridica: number
    fk_pessoa_fisica: number
    fk_especialidades: number[]
}

export interface EspecialistasResponse {
    count: number
    next: string
    previous: string | null
    results: Especialista[]
}

const mockEspecialistasResponse: EspecialistasResponse = {
    "count": 15,
    "next": "http://api.example.org/accounts/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "usuario_criacao": "admin",
            "usuario_edicao": "admin",
            "usuario_delecao": null,
            "data_criacao": "2023-01-15T10:30:00Z",
            "data_edicao": "2024-01-10T14:20:00Z",
            "data_delecao": null,
            "nome": "Dr. Carlos Eduardo Silva",
            "email": "carlos.silva@medgospel.com",
            "foto": "https://avatar.iran.liara.run/public",
            "situacao": "ATIVO",
            "tipo_conselho": "CRM",
            "numero_conselho": "12345",
            "perfil": "Cardiologista",
            "observacao": "Atende segundas, quartas e sextas das 8h às 17h",
            "codigo_externo": 1001,
            "uf_conselho": "SP",
            "fk_pessoa_juridica": 1,
            "fk_pessoa_fisica": 1,
            "fk_especialidades": [1, 5]
        },
        {
            "id": 2,
            "usuario_criacao": "admin",
            "usuario_edicao": "admin",
            "usuario_delecao": null,
            "data_criacao": "2023-02-20T09:15:00Z",
            "data_edicao": "2024-01-12T16:45:00Z",
            "data_delecao": null,
            "nome": "Dra. Ana Paula Costa",
            "email": "ana.costa@medgospel.com",
            "foto": "https://avatar.iran.liara.run/public",
            "situacao": "ATIVO",
            "tipo_conselho": "CRM",
            "numero_conselho": "23456",
            "perfil": "Dermatologista",
            "observacao": "Atende terças e quintas das 9h às 18h",
            "codigo_externo": 1002,
            "uf_conselho": "SP",
            "fk_pessoa_juridica": 1,
            "fk_pessoa_fisica": 2,
            "fk_especialidades": [2]
        },
        {
            "id": 3,
            "usuario_criacao": "admin",
            "usuario_edicao": "admin",
            "usuario_delecao": null,
            "data_criacao": "2023-03-10T11:00:00Z",
            "data_edicao": "2024-01-08T13:30:00Z",
            "data_delecao": null,
            "nome": "Dr. Roberto Mendes",
            "email": "roberto.mendes@medgospel.com",
            "foto": "https://avatar.iran.liara.run/public",
            "situacao": "ATIVO",
            "tipo_conselho": "CRM",
            "numero_conselho": "34567",
            "perfil": "Ortopedista",
            "observacao": "Atende segundas, quartas e sextas das 7h às 16h",
            "codigo_externo": 1003,
            "uf_conselho": "SP",
            "fk_pessoa_juridica": 1,
            "fk_pessoa_fisica": 3,
            "fk_especialidades": [3]
        },
        {
            "id": 4,
            "usuario_criacao": "admin",
            "usuario_edicao": "admin",
            "usuario_delecao": null,
            "data_criacao": "2023-04-05T14:20:00Z",
            "data_edicao": "2024-01-15T10:15:00Z",
            "data_delecao": null,
            "nome": "Dra. Mariana Santos",
            "email": "mariana.santos@medgospel.com",
            "foto": "https://avatar.iran.liara.run/public",
            "situacao": "ATIVO",
            "tipo_conselho": "CRM",
            "numero_conselho": "45678",
            "perfil": "Ginecologista e obstetra",
            "observacao": "Atende terças, quintas e sábados das 8h às 17h",
            "codigo_externo": 1004,
            "uf_conselho": "SP",
            "fk_pessoa_juridica": 1,
            "fk_pessoa_fisica": 4,
            "fk_especialidades": [4]
        },
        {
            "id": 5,
            "usuario_criacao": "admin",
            "usuario_edicao": "admin",
            "usuario_delecao": null,
            "data_criacao": "2023-05-12T16:30:00Z",
            "data_edicao": "2024-01-11T11:45:00Z",
            "data_delecao": null,
            "nome": "Dr. Fernando Oliveira",
            "email": "fernando.oliveira@medgospel.com",
            "foto": "https://avatar.iran.liara.run/public",
            "situacao": "ATIVO",
            "tipo_conselho": "CRM",
            "numero_conselho": "56789",
            "perfil": "Neurologista",
            "observacao": "Atende segundas, quartas e sextas das 9h às 18h",
            "codigo_externo": 1005,
            "uf_conselho": "SP",
            "fk_pessoa_juridica": 1,
            "fk_pessoa_fisica": 5,
            "fk_especialidades": [6]
        }
    ]
}

export interface Procedimento {
    id: number
    nome: string
    codigo: string
    status: boolean
    subgrupos: string
}

export interface ProcedimentosResponse {
    count: number
    next: string | null
    previous: string | null
    results: Procedimento[]
}

export interface ProcedimentoEcommerce {
    fk_procedimento: number
    nome: string
    tipo_procedimento: string
    grupo: string
    codigo: string
    descricao: string
    sigla: string
    sinonimia: string
    subgrupo_codigo: string
    subgrupo_descricao: string
    menor_preco: number
    id?: string // Concatenated fk_procedimento.subgrupo_codigo
}

export const ecommerceService = {
    /**
     * Show stablishments with pricing information
     */
    async tabelaPreco(
        app?: boolean,
        fk_procedimento?: string,
        tipo_procedimento?: string,
        fk_especialista?: number,
        fk_estabelecimento?: number,
        fk_especialidade?: number,
        fk_cidade?: number,
    ): Promise<
        { kind: "ok"; data: TabelaPrecoResponse } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const response: ApiResponse<TabelaPrecoResponse> = await api.apisauce.get(
                "/v1/tabela-precos/ecommerce/",
                {
                    app,
                    fk_procedimento,
                    tipo_procedimento,
                    fk_especialista,
                    fk_estabelecimento,
                    fk_especialidade,
                    fk_cidade,
                }
            )
            console.log('params', {
                app,
                fk_procedimento,
                tipo_procedimento,
                fk_especialista,
                fk_estabelecimento,
                fk_especialidade,
                fk_cidade,
            })

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const tabelaPreco = response.data

            if (tabelaPreco) {
                return { kind: "ok", data: tabelaPreco }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },
    async especialistas(
        fk_procedimento?: string,
        fk_especialidade?: string,
        fk_cidade?: number,
        fk_estabelecimento?: number,
    ): Promise<
        { kind: "ok"; data: EspecialistasResponse } | (GeneralApiProblem & { error?: any })
    > {
        return { kind: "ok", data: mockEspecialistasResponse }
    },
    /**
     * List all procedures with pagination and search capabilities.
     */
    async procedimentos(
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
    ): Promise<
        { kind: "ok"; data: ProcedimentosResponse } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const response: ApiResponse<ProcedimentosResponse> = await api.apisauce.get(
                "/v1/procedimentos/",
                {
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
                }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const procedures = response.data

            if (procedures) {
                return { kind: "ok", data: procedures }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },
    /**
     * List procedures for ecommerce with pricing information.
     */
    async procedimentosEcommerce(
        fk_cidade: number,
        tipo_procedimento: "EL" | "EI" | "PP",
        app?: boolean,
        nome?: string,
    ): Promise<
        { kind: "ok"; data: ProcedimentoEcommerce[] } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const response: ApiResponse<ProcedimentoEcommerce[]> = await api.apisauce.get(
                "/v1/procedimentos/ecommerce/",
                {
                    app,
                    fk_cidade,
                    nome,
                    tipo_procedimento,
                }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const procedures = response.data

            if (procedures) {
                return { kind: "ok", data: procedures }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    }
}

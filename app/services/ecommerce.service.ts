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
        horarios_realizacao: Array<{
            id: number
            data: string
            hora_inicial: string
            hora_final: string
            vagas_total: number
            vagas_disponiveis: number
        }>
    }>
}>

export interface Especialista {
    id: number
    situacao: string
    especialidades: {
        id: number
        descricao: string
    }[]
    foto: string
    tipo_conselho: string
    numero_conselho: string
    uf_conselho: string
    nome: string
}

export type EspecialistasResponse = Especialista[]


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

// Carrinho types
export interface PedidoItemCreate {
    fk_tabela_preco_item: number
    fk_tabela_preco_item_horario?: number
    quantidade?: number
    data_agendada?: string
    valor: string
}

export interface CarrinhoAddItensRequest {
    fk_paciente: number
    itens: PedidoItemCreate[]
}

export interface CarrinhoRemoverItensRequest {
    itens: number[]
}

export interface CarrinhoRemoverItensResponse {
    detail: string
    itens_removidos: number[]
}

export interface PedidoItemDetail {
    id: number
    fk_paciente: {
        id: number
        nome: string
        // Add other PessoaFisica properties as needed
    }
    fk_procedimento: string
    valor_unitario: string
    valor_total: string
    situacao: string
    usuario_criacao: string
    usuario_edicao: string
    data_criacao: string
    data_edicao: string
    data_expiracao: string
    valor_final: string
    data_agendada: string
    quantidade: number
    fk_pedido: number
    fk_tabela_preco_item_horario: number
}

export type PaginatedPedidoItemDetailList = PedidoItemDetail[]

export const ecommerceService = {
    /**
     * Add items to the user's cart
     */
    async addAoCarrinho(params: CarrinhoAddItensRequest, authToken?: string): Promise<
        { kind: "ok"; data: PaginatedPedidoItemDetailList } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const headers: any = {}
            if (authToken) {
                headers.Authorization = `Bearer ${authToken}`
            }
            
            const response: ApiResponse<PaginatedPedidoItemDetailList> = await api.apisauce.post(
                "/v1/carrinho/adicionar-itens/",
                params,
                { headers }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const carrinhoData = response.data

            if (carrinhoData) {
                return { kind: "ok", data: carrinhoData }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },

    /**
     * Get cart items for the logged-in user
     */
    async getCarrinho(authToken?: string): Promise<
        { kind: "ok"; data: PaginatedPedidoItemDetailList } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const headers: any = {}
            if (authToken) {
                headers.Authorization = `Bearer ${authToken}`
            }
            
            const response: ApiResponse<PaginatedPedidoItemDetailList> = await api.apisauce.get(
                "/v1/carrinho/itens/",
                {},
                { headers }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const carrinhoData = response.data

            if (carrinhoData) {
                return { kind: "ok", data: carrinhoData }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },

    /**
     * Remove items from the user's cart
     */
    async removerItensCarrinho(params: CarrinhoRemoverItensRequest, authToken?: string): Promise<
        { kind: "ok"; data: CarrinhoRemoverItensResponse } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const headers: any = {}
            if (authToken) {
                headers.Authorization = `Bearer ${authToken}`
            }
            
            const response: ApiResponse<CarrinhoRemoverItensResponse> = await api.apisauce.post(
                "/v1/carrinho/remover-itens/",
                params,
                { headers }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const removeData = response.data

            if (removeData) {
                return { kind: "ok", data: removeData }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },

    /**
     * Show stablishments with pricing information
     */
    async tabelaPreco(params: {
        app?: boolean
        fk_procedimento?: string
        tipo_procedimento?: string
        fk_especialista?: number
        fk_estabelecimento?: number
        fk_especialidade?: number
        fk_cidade?: number
    } = {}): Promise<
        { kind: "ok"; data: TabelaPrecoResponse } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const response: ApiResponse<TabelaPrecoResponse> = await api.apisauce.get(
                "/v1/tabela-precos/ecommerce/",
                params
            )
            console.log('params', params)

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
        ordering?: string,
        page?: number,
        search?: string,
    ): Promise<
        { kind: "ok"; data: EspecialistasResponse } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const response: ApiResponse<EspecialistasResponse> = await api.apisauce.get(
                "/v1/profissionais-saude/",
                {
                    fk_procedimento,
                    fk_especialidade,
                    fk_cidade,
                    fk_estabelecimento,
                    ordering,
                    page,
                    search,
                }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const especialistas = response.data

            if (especialistas) {
                return { kind: "ok", data: especialistas }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
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

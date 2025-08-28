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

export interface GerarPedidoRequest {
    itens: number[]
}

export interface GerarPedidoResponse {
    id: number
    numero_pedido: string
    status: string
    valor_total: string
    data_criacao: string
    itens: PedidoItemDetail[]
}

export interface PagamentoRequest {
    fk_estabelecimento: number
    fk_pedido: number
    metodo_pagamento: "pix" | "cartao_credito"
    parcelas?: number
    fk_cartao?: number
    cvv?: string
}

export interface DadosPagamentoPix {
    id: string
    valor: string
    dt_aprovacao: string | null
    dt_criado: string
    parcelas: number
    status: string
    qr_code_base64: string
    qr_code: string
    url: string
}

export interface DadosPagamentoCartao {
    id: string
    valor: string
    dt_aprovacao: string | null
    dt_criado: string
    parcelas: number
    status: string
    status_motivo?: string | null
}

export type PagamentoResponse = DadosPagamentoPix | DadosPagamentoCartao

// Credit Card types
export interface CartaoPFRequestValidacao {
    token: string
}

export interface CartaoPFResponse {
    id: number
    card_id: string
    payment_method: string
    last_four_digits: string
    expiration_month: string
    expiration_year: string
    cardholder_name: string
}

export interface CartaoPessoaFisicaCreate {
    id: number
    situacao: string
    usuario_criacao: string
    usuario_edicao: string
    data_criacao: string
    data_edicao: string | null
    padrao_padrao: boolean
    cartao_mercado_pago_id: string
    ultimos_digitos: string
    tipo_cartao: string
    fk_bandeira: string
    fk_banco: string
    fk_pessoa_fisica: number
}

export interface PessoaJuridica {
    nome_fantasia: string
    endereco: string
}

export interface Cirurgia {
    descricao: string
    valor: number
    pessoa_juridica: PessoaJuridica[]
}

export interface Dependente {
    id: number
    nome: string
    data_nascimento: string
    sexo: string
    grau_parentesco: string
}

export interface PessoaFisicaUpdate {
    nome?: string
    cpf?: string
    data_nascimento?: string
    sexo?: string
    email?: string
    telefone?: string
    apelido?: string
    observacao?: string
    foto?: string
    latitude?: string
    longitude?: string
    codigo_device?: string
    plataforma?: string
    codigo_indicacao?: string
    origem?: string
    situacao?: string
}

export interface DominioValor {
    id: number
    fk_dominio: string
    fk_valor: string
    status: boolean
}

export type PaginatedDominioValorList = DominioValor[]

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
     * Generate order from cart
     */
    async gerarPedido(params: GerarPedidoRequest, authToken?: string): Promise<
        { kind: "ok"; data: GerarPedidoResponse } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const headers: any = {}
            if (authToken) {
                headers.Authorization = `Bearer ${authToken}`
            }
            
            const response: ApiResponse<GerarPedidoResponse> = await api.apisauce.post(
                "/v1/carrinho/gerar-pedido/",
                params,
                { headers }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const pedidoData = response.data

            if (pedidoData) {
                return { kind: "ok", data: pedidoData }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },

    /**
     * Create payment
     */
    async criarPagamento(params: PagamentoRequest, authToken?: string): Promise<
        { kind: "ok"; data: PagamentoResponse } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const headers: any = {}
            if (authToken) {
                headers.Authorization = `Bearer ${authToken}`
            }
            
            const response: ApiResponse<PagamentoResponse> = await api.apisauce.post(
                "/v1/pagamentos/",
                params,
                { headers }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const pagamentoData = response.data

            if (pagamentoData) {
                return { kind: "ok", data: pagamentoData }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },

    /**
     * Get credit cards for the logged-in user
     */
    async getCartoes(authToken?: string): Promise<
        { kind: "ok"; data: CartaoPFResponse[] } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const headers: any = {}
            if (authToken) {
                headers.Authorization = `Bearer ${authToken}`
            }
            
            const response: ApiResponse<CartaoPFResponse[]> = await api.apisauce.get(
                "/v1/cartoes-pessoa-fisica/",
                {},
                { headers }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const cartoesData = response.data

            if (cartoesData) {
                return { kind: "ok", data: cartoesData }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },

    /**
     * Create a new credit card
     */
    async criarCartao(params: CartaoPFRequestValidacao, authToken?: string): Promise<
        { kind: "ok"; data: CartaoPessoaFisicaCreate } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const headers: any = {}
            if (authToken) {
                headers.Authorization = `Bearer ${authToken}`
            }
            
            const response: ApiResponse<CartaoPessoaFisicaCreate> = await api.apisauce.post(
                "/v1/cartoes-pessoa-fisica/",
                params,
                { headers }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const cartaoData = response.data

            if (cartaoData) {
                return { kind: "ok", data: cartaoData }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },

    /**
     * Delete a credit card
     */
    async deletarCartao(cartaoId: number, authToken?: string): Promise<
        { kind: "ok" } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const headers: any = {}
            if (authToken) {
                headers.Authorization = `Bearer ${authToken}`
            }
            
            const response: ApiResponse<void> = await api.apisauce.delete(
                `/v1/cartoes-pessoa-fisica/${cartaoId}/`,
                {},
                { headers }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            return { kind: "ok" }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },

    /**
     * Get cirurgias list
     */
    async getCirurgias(params: {
        search?: string
        descricao?: string
        fk_pessoa_juridica?: number
        informacoes?: string
        nome_fantasia?: string
        situacao?: string
        valor?: number
        ordering?: string
        page?: number
    } = {}): Promise<
        { kind: "ok"; data: Cirurgia[] } | (GeneralApiProblem & { error?: any })
    > {
        console.log('API call to /v1/cirurgias/ with params:', params)
        try {
            const response: ApiResponse<Cirurgia[]> = await api.apisauce.get(
                "/v1/cirurgias/",
                params
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const cirurgiasData = response.data

            if (cirurgiasData) {
                console.log('API response received:', cirurgiasData.length, 'items')
                return { kind: "ok", data: cirurgiasData }
            } else {
                console.log('API response is empty')
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },

    /**
     * Get dependentes (family group)
     */
    async getDependentes(authToken?: string): Promise<
        { kind: "ok"; data: Dependente[] } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const response: ApiResponse<Dependente[]> = await api.apisauce.get(
                "/v1/pessoa-fisica/grupo-familiar/",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const dependentesData = response.data

            if (dependentesData) {
                return { kind: "ok", data: dependentesData }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },

    /**
     * Update pessoa fisica partially
     */
    async updatePessoaFisica(
        id: number,
        data: PessoaFisicaUpdate,
        authToken?: string
    ): Promise<
        { kind: "ok"; data: any } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const response: ApiResponse<any> = await api.apisauce.put(
                `/v1/pessoa-fisica/${id}/`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const updatedData = response.data

            if (updatedData) {
                return { kind: "ok", data: updatedData }
            } else {
                return { kind: "unknown", temporary: true }
            }
        } catch (e) {
            return { kind: "unknown", temporary: true }
        }
    },

    /**
     * Get dominio valores
     */
    async getDominioValores(params: {
        mnemonico: string
        search?: string
        ordering?: string
        page?: number
    }): Promise<
        { kind: "ok"; data: PaginatedDominioValorList } | (GeneralApiProblem & { error?: any })
    > {
        try {
            const response: ApiResponse<PaginatedDominioValorList> = await api.apisauce.get(
                "/v1/infos/",
                params
            )

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                return problem || { kind: "unknown", temporary: true }
            }

            const dominioValoresData = response.data

            if (dominioValoresData) {
                return { kind: "ok", data: dominioValoresData }
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

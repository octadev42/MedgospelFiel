import { ApiResponse } from "apisauce"

import { api } from "./api"
import { GeneralApiProblem, getGeneralApiProblem } from "./api/apiProblem"

export interface LoginResponse {
  access_token: string
  fk_pessoa_fisica?: number
}

// Types for pessoa fisica
export interface PessoaFisicaData {
  email: string
  telefone: string
  endereco: {
    tipo_logradouro: string
    logradouro: string
    numero: string
    bairro: string
    cep: string
    fk_cidade: number
  }
  fk_indicador: number
  senha: string
  tipo: string
  nome: string
  cpf: string
  data_nascimento: string
  sexo: string
}

export interface PessoaFisicaResponse {
  success: boolean
  message?: string
  data?: any
}

// Types for indicators
export interface Indicador {
  id: number
  nome: string
  codigo_indicacao: string
  nome_fantasia: string
}

export interface IndicadorResponse extends Array<Indicador> {}

export interface SignupData {
  personalData: {
    fullName: string
    cpf: string
    birthDate: string
    phoneNumber: string
    gender: "masculino" | "feminino"
  }
  addressData: {
    cep: string
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
  }
  accessData: {
    email: string
    password: string
  }
}

export const authService = {
  /**
   * Logs in a user and returns a token.
   */
  async login(
    username: string,
    password: string,
  ): Promise<
    { kind: "ok"; token: string; fk_pessoa_fisica?: number } | (GeneralApiProblem & { error?: any })
  > {
    const payload = {
      grant_type: "password",
      client_id: "bqdKF45eaNNEBiy4bFTJkVpqWfaRC1Vp8uU2J8Au",
      client_secret: "6Doz5E9eQaM9tNacDh8p5oWXOwpuoMxVEkDdyQyAaRCgMi79RAzcfwBsmFnpN2Hj",
      username,
      password,
    }
    
    const response: ApiResponse<LoginResponse> = await api.apisauce.post("/v1/auth/token/", payload, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    
    if (!response.ok) {
      return { kind: "rejected", error: response.data }
    }
    
    try {
      const token = response.data?.access_token
      const fk_pessoa_fisica = response.data?.fk_pessoa_fisica
      
      if (token) {
        return { kind: "ok", token, fk_pessoa_fisica }
      } else {
        return { kind: "bad-data", error: response.data }
      }
    } catch (e) {
      return { kind: "bad-data", error: response.data }
    }
  },

  /**
   * Signs up a new user with complete profile data.
   */
  async signup(pessoaFisicaData: PessoaFisicaData): Promise<
    { kind: "ok"; message: string; data?: any } | (GeneralApiProblem & { error?: any })
  > {
    try {
      const response: ApiResponse<PessoaFisicaResponse> = await api.apisauce.post("/v1/pessoa-fisica/app/", pessoaFisicaData)
      
      if (!response.ok) {
        return { kind: "rejected", error: response.data }
      }
      
      return { kind: "ok", message: "Usuário cadastrado com sucesso!", data: response.data }
    } catch (e) {
      return { kind: "bad-data", error: "Erro ao cadastrar usuário" }
    }
  },

  /**
   * Get indicator by codigo_indicacao
   */
  async getIndicadorByCode(codigoIndicacao: string): Promise<
    { kind: "ok"; data: IndicadorResponse } | (GeneralApiProblem & { error?: any })
  > {
    try {
      const response: ApiResponse<IndicadorResponse> = await api.apisauce.get(`/v1/pessoa-fisica/indicadores/?codigo_indicacao=${codigoIndicacao}`)
      
      if (!response.ok) {
        return { kind: "rejected", error: response.data }
      }
      
      return { kind: "ok", data: response.data! }
    } catch (e) {
      return { kind: "bad-data", error: "Erro ao buscar indicador" }
    }
  },

  /**
   * Get user profile data
   */
  async getUserProfile(pessoaFisicaId: number): Promise<
    { kind: "ok"; data: any } | (GeneralApiProblem & { error?: any })
  > {
    try {
      const response: ApiResponse<any> = await api.apisauce.get(`/v1/pessoa-fisica/${pessoaFisicaId}/`)
      
      if (!response.ok) {
        return { kind: "rejected", error: response.data }
      }
      
      return { kind: "ok", data: response.data! }
    } catch (e) {
      return { kind: "bad-data", error: "Erro ao buscar perfil do usuário" }
    }
  },

  /**
   * Update user profile
   */
  async updateUserProfile(pessoaFisicaId: number, profileData: {
    nome: string
    data_nascimento: string
    cpf: string
    sexo: string
    telefone: string
  }): Promise<
    { kind: "ok"; data: any } | (GeneralApiProblem & { error?: any })
  > {
    try {
      const response: ApiResponse<any> = await api.apisauce.put(`/v1/pessoa-fisica/${pessoaFisicaId}/`, profileData)
      
      if (!response.ok) {
        return { kind: "rejected", error: response.data }
      }
      
      return { kind: "ok", data: response.data! }
    } catch (e) {
      return { kind: "bad-data", error: "Erro ao atualizar perfil" }
    }
  },
}

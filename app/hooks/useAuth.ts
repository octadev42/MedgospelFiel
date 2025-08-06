import { useState } from "react"

import { useStores } from "@/models"
import { api } from "@/services/api"

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<void>
  loading: boolean
  loginError: string
  getValidationError: (value: string) => string
}

export const useLogin = (): UseLoginReturn => {
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const {
    authenticationStore: { setAuthToken, setAuthUsername, setPessoaFisicaId },
  } = useStores()

  // Custom validation: allow either a valid email or a non-empty username
  function getValidationError(value: string): string {
    if (!value || value.length === 0) return "Campo obrigatório"
    // If it looks like an email, validate as email
    if (value.includes("@")) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido"
    }
    return ""
  }

  async function login(email: string, password: string): Promise<void> {
    setLoginError("")
    setLoading(true)

    const validation = getValidationError(email)
    if (validation) {
      setLoginError(validation)
      setLoading(false)
      return
    }

    try {
      // Call the real API
      const result = await api.login(email, password)
      if (result.kind === "ok") {
        setAuthToken(result.token)
        setAuthUsername(email)

        // Set pessoa_fisica_id from login response
        if (result.fk_pessoa_fisica) {
          setPessoaFisicaId(result.fk_pessoa_fisica)
        }

        setLoginError("")
        setLoading(false)
      } else {
        let message = "Erro ao fazer login."
        if (result.error && result.error.error === "invalid_grant") {
          message = "Usuário ou senha inválidos."
        }
        setLoginError(message)
        setLoading(false)
      }
    } catch {
      setLoginError("Erro ao fazer login.")
      setLoading(false)
    }
  }

  return {
    login,
    loading,
    loginError,
    getValidationError,
  }
}

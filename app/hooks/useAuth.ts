import { useState } from "react"

import { useStores } from "@/models"
import { authService, PessoaFisicaData } from "@/services/auth.service"
import { showToast } from "@/components/Toast"
import { showApiErrors } from "@/utils/errorHandler"

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<boolean>
  signup: (signupData: PessoaFisicaData) => Promise<boolean>
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

  async function login(email: string, password: string): Promise<boolean> {
    setLoginError("")
    setLoading(true)

    const validation = getValidationError(email)
    if (validation) {
      setLoginError(validation)
      setLoading(false)
      return false
    }

    try {
      // Call the auth service
      const result = await authService.login(email, password)
      console.log("result", result)
      if (result.kind === "ok") {
        setAuthToken(result.token)
        setAuthUsername(email)

        // Set pessoa_fisica_id from login response
        if (result.fk_pessoa_fisica) {
          setPessoaFisicaId(result.fk_pessoa_fisica)
        }

        setLoginError("")
        setLoading(false)
        return true
      } else {
        let message = "Erro ao fazer login."
        if (result.error && result.error.error === "invalid_grant") {
          message = "Usuário ou senha inválidos."
        }
        setLoginError(message)
        setLoading(false)
        return false
      }
    } catch {
      setLoginError("Erro ao fazer login.")
      setLoading(false)
      return false
    }
  }

  async function signup(signupData: PessoaFisicaData): Promise<boolean> {
    setLoginError("")
    setLoading(true)

    try {
      // First, create the user account
      const signupResult = await authService.signup(signupData)
      
      if (signupResult.kind === "ok") {
        // If signup is successful, automatically login with the new credentials
        const loginResult = await authService.login(signupData.email, signupData.senha)
        
        if (loginResult.kind === "ok") {
          // Set authentication data
          setAuthToken(loginResult.token)
          setAuthUsername(signupData.email)
          
          // Set pessoa_fisica_id from login response
          if (loginResult.fk_pessoa_fisica) {
            setPessoaFisicaId(loginResult.fk_pessoa_fisica)
          }

          showToast.success("Sucesso!", "Conta criada com sucesso!")
          setLoginError("")
          setLoading(false)
          return true
        } else {
          // Signup succeeded but login failed
          showToast.error("Aviso", "Conta criada com sucesso, mas não foi possível fazer login automaticamente.")
          setLoginError("Conta criada, mas erro no login automático")
          setLoading(false)
          return false
        }
      } else {
        // Signup failed
        showApiErrors(signupResult.error, "Erro no Cadastro")
        setLoginError("Erro ao criar conta")
        setLoading(false)
        return false
      }
    } catch (error) {
      showToast.error("Erro", "Erro inesperado ao cadastrar usuário")
      setLoginError("Erro inesperado")
      setLoading(false)
      return false
    }
  }

  return {
    login,
    signup,
    loading,
    loginError,
    getValidationError,
  }
}

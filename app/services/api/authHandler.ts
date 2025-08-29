import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import { resetRoot } from "@/navigators/navigationUtilities"

// Global reference to the root store - will be set by the app
let globalRootStore: any = null

// Import toast for notifications
let showToast: any = null

/**
 * Sets the toast function for notifications
 * This should be called once when the app initializes
 */
export function setToastFunction(toastFunction: any) {
  showToast = toastFunction
}

/**
 * Sets the global root store reference for auth handling
 * This should be called once when the app initializes
 */
export function setGlobalRootStore(rootStore: any) {
  globalRootStore = rootStore
}



/**
 * Handles authentication errors and automatically logs out the user if needed
 * @param problem The API problem from getGeneralApiProblem
 * @returns true if the error was handled (user was logged out), false otherwise
 */
export function handleAuthError(problem: GeneralApiProblem | null): boolean {
  if (problem?.kind === "unauthorized") {
    // Use the global root store reference to logout the user
    if (globalRootStore?.authenticationStore) {
      globalRootStore.authenticationStore.logout()
      console.log("User logged out due to 401 unauthorized response")
      
      // Show toast notification if available
      if (showToast) {
        showToast.error("Sessão Expirada", "Você foi desconectado. Faça login novamente.")
      }
      
      // Navigate to login screen using the navigation utilities
      try {
        // Reset the navigation stack and navigate to login
        resetRoot({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      } catch (error) {
        console.error("Error navigating to login:", error)
      }
      
      return true
    }
  }
  return false
}

/**
 * Enhanced version of getGeneralApiProblem that automatically handles auth errors
 * @param response The API response
 * @returns The API problem or null
 */
export function getGeneralApiProblemWithAuthHandling(response: any): GeneralApiProblem | null {
  try {
    const problem = getGeneralApiProblem(response)
    
    // Handle authentication errors automatically
    handleAuthError(problem)
    
    return problem
  } catch (error) {
    console.error("Error in getGeneralApiProblemWithAuthHandling:", error)
    return { kind: "unknown", temporary: true }
  }
}

/**
 * Utility function to logout user and redirect to login screen
 * Can be called from anywhere in the app
 */
export function logoutAndRedirectToLogin() {
  try {
    // Logout the user
    if (globalRootStore?.authenticationStore) {
      globalRootStore.authenticationStore.logout()
      console.log("User logged out manually")
    }
    
    // Show toast notification if available
    if (showToast) {
      showToast.info("Logout", "Você foi desconectado com sucesso.")
    }
    
    // Navigate to login screen
    resetRoot({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  } catch (error) {
    console.error("Error in logoutAndRedirectToLogin:", error)
  }
}

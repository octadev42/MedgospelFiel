/**
 * Extracts all error messages from an API response
 * Handles different error response formats including:
 * - non_field_errors
 * - field-specific errors
 * - nested object errors
 */
export const extractApiErrors = (errorData: any): string[] => {
  const errors: string[] = []

  if (!errorData || typeof errorData !== 'object') {
    return errors
  }

  // Handle non_field_errors (general errors)
  if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
    errors.push(...errorData.non_field_errors)
  }

  // Handle field-specific errors
  Object.keys(errorData).forEach(key => {
    if (key !== 'non_field_errors') {
      const fieldError = errorData[key]
      
      if (Array.isArray(fieldError)) {
        // If it's an array of error messages
        errors.push(...fieldError)
      } else if (typeof fieldError === 'string') {
        // If it's a single error message
        errors.push(fieldError)
      } else if (typeof fieldError === 'object' && fieldError !== null) {
        // If it's a nested object, recursively extract errors
        const nestedErrors = extractApiErrors(fieldError)
        errors.push(...nestedErrors)
      }
    }
  })

  return errors
}

/**
 * Formats error messages for display
 * Removes duplicates and formats them nicely
 */
export const formatErrorMessages = (errors: string[]): string => {
  const uniqueErrors = [...new Set(errors)]
  return uniqueErrors.join('\n')
}

/**
 * Shows all API errors as toast notifications
 */
export const showApiErrors = (errorData: any, title: string = "Erro") => {
  const errors = extractApiErrors(errorData)
  
  if (errors.length === 0) {
    // Fallback for unknown error format
    return
  }

  const errorMessage = formatErrorMessages(errors)
  
  // Import here to avoid circular dependencies
  const { showToast } = require('@/components/Toast')
  showToast.error(title, errorMessage)
}

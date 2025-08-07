import React from "react"
import Toast, { BaseToast, ErrorToast, InfoToast } from "react-native-toast-message"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ToastConfig {
  success: (props: any) => React.ReactElement
  error: (props: any) => React.ReactElement
  info: (props: any) => React.ReactElement
}

export const ToastComponent: React.FC = () => {
  const { themed, theme } = useAppTheme()

  const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={themed($successToast)}
        contentContainerStyle={themed($toastContent)}
        text1Style={themed($toastTitle)}
        text2Style={themed($toastMessage)}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={themed($errorToast)}
        contentContainerStyle={themed($toastContent)}
        text1Style={themed($toastTitle)}
        text2Style={themed($toastMessage)}
      />
    ),
    info: (props) => (
      <InfoToast
        {...props}
        style={themed($infoToast)}
        contentContainerStyle={themed($toastContent)}
        text1Style={themed($toastTitle)}
        text2Style={themed($toastMessage)}
      />
    ),
  }

  return <Toast config={toastConfig} />
}

// Toast utility functions
export const showToast = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    })
  },
  error: (title: string, message?: string) => {
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
      visibilityTime: 5000,
      autoHide: true,
      topOffset: 50,
    })
  },
  info: (title: string, message?: string) => {
    Toast.show({
      type: "info",
      text1: title,
      text2: message,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    })
  },
}

// Styles
const $successToast: ThemedStyle<any> = ({ colors }) => ({
  borderLeftColor: colors.palette.success500,
  backgroundColor: colors.background,
  borderLeftWidth: 8,
  borderRadius: 8,
  marginHorizontal: 16,
  marginTop: 8,
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
})

const $errorToast: ThemedStyle<any> = ({ colors }) => ({
  borderLeftColor: colors.palette.danger500,
  backgroundColor: colors.background,
  borderLeftWidth: 8,
  borderRadius: 8,
  marginHorizontal: 16,
  marginTop: 8,
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
})

const $infoToast: ThemedStyle<any> = ({ colors }) => ({
  borderLeftColor: colors.palette.primary500,
  backgroundColor: colors.background,
  borderLeftWidth: 8,
  borderRadius: 8,
  marginHorizontal: 16,
  marginTop: 8,
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
})

const $toastContent: ThemedStyle<any> = ({ colors }) => ({
  paddingHorizontal: 16,
  paddingVertical: 12,
})

const $toastTitle: ThemedStyle<any> = ({ colors, spacing }) => ({
  color: colors.text,
  fontSize: spacing.md,
  fontWeight: "600",
  marginBottom: 4,
})

const $toastMessage: ThemedStyle<any> = ({ colors, spacing }) => ({
  color: colors.textDim,
  fontSize: spacing.md,
  fontWeight: "400",
})

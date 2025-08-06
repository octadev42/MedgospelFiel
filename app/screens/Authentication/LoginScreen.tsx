import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  Pressable,
  // eslint-disable-next-line no-restricted-imports
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import * as SystemUI from "expo-system-ui"
import { observer } from "mobx-react-lite"

import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, TextFieldAccessoryProps } from "@/components/TextField"
import { useLogin } from "@/hooks/useAuth"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

// TODO: Add "Login" route to AppStackParamList in AppNavigator.tsx
interface LoginScreenProps {}

const logo = require("../../../assets/images/logo_branca.png")
const bannerImage = require("../../../assets/images/login/banner.png")

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)

  const [authEmail, setAuthEmail] = useState("Joao_silva@gmail.com")
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [rememberMe, setRememberMe] = useState(false)

  const { login, loading, loginError, getValidationError } = useLogin()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.palette.primary600)

    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [colors.palette.primary600])

  const error = isSubmitted ? getValidationError(authEmail) : ""

  async function handleLogin() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    await login(authEmail, authPassword)

    // Clear form on successful login (the hook handles success state)
    if (!loginError) {
      setIsSubmitted(false)
      setAuthPassword("")
      setAuthEmail("")
    } else {
      setIsSubmitted(false)
    }
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )

  return (
    <Screen
      preset="auto"
      backgroundColor={colors.palette.primary600}
      systemBarStyle="light"
      SystemBarsProps={{}}
      style={themed($screenBackground)}
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      {/* Banner Section */}
      <View style={themed($bannerContainer)}>
        <Image source={bannerImage} style={themed($bannerImage)} />
      </View>

      {/* Login Form Section */}
      <View style={themed($formContainer)}>
        <Text text="Faça login no" preset="heading" style={themed($loginTitle)} weight="light" size="xl"/>
        <Text text="medgospel" preset="heading" style={themed($loginTitleBold)} weight="bold" size="xxl"/>
        
        <TextField
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={themed($textField)}
          inputWrapperStyle={themed($inputWrapper)}
          autoCapitalize="none"
          autoComplete="username"
          autoCorrect={false}
          keyboardType="default"
          label="Email"
          LabelTextProps={{ style: themed($fieldLabel) }}
          placeholder="Digite seu e-mail ou usuário"
          helper={error}
          status={error ? "error" : undefined}
          onSubmitEditing={() => authPasswordInput.current?.focus()}
        />
        
        <TextField
          ref={authPasswordInput}
          value={authPassword}
          onChangeText={setAuthPassword}
          containerStyle={themed($textField)}
          inputWrapperStyle={themed($inputWrapper)}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          label="Senha"
          LabelTextProps={{ style: themed($fieldLabel) }}
          placeholder="Digite sua senha"
          onSubmitEditing={handleLogin}
          RightAccessory={PasswordRightAccessory}
        />

        {/* Remember Me and Forgot Password */}
        <View style={themed($optionsContainer)}>
          <Pressable 
            style={themed($rememberMeContainer)} 
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={themed($checkboxContainer)}>
              {rememberMe && <View style={themed($checkboxChecked)} />}
            </View>
            <Text text="Lembrar de mim" style={themed($rememberMeText)} />
          </Pressable>
          
          <Pressable>
            <Text text="Esqueceu sua senha?" style={themed($forgotPasswordText)} />
          </Pressable>
        </View>

        {loginError ? <Text style={themed($loginError)}>{loginError}</Text> : null}
        
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={({ pressed }) => [
            themed($loginButton),
            pressed && { backgroundColor: "#72dd88" },
            loading && { opacity: 0.7 },
          ]}
        >
          <View style={$buttonContent}>
            {loading && <ActivityIndicator color="#fff" style={$loadingIndicator} />}
            <Text style={themed($loginButtonText)}>{loading ? "Entrando..." : "ENTRAR"}</Text>
          </View>
        </Pressable>
      </View>

      {/* Bottom Logo */}
      <View style={themed($bottomLogoContainer)}>
        <Image source={logo} style={themed($bottomLogoImage)} />
      </View>
    </Screen>
  )
})

const $screenBackground: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.primary600,
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.md,
  paddingBottom: spacing.lg,
})

// Banner Styles
const $bannerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
  position: "relative",
})

const $bannerImage: ImageStyle = {
  width: "100%",
  height: 200,
  borderRadius: 16,
  resizeMode: "cover",
}

const $bannerTextOverlay: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  right: 20,
  top: 40,
  alignItems: "flex-end",
})

const $bannerText: ThemedStyle<TextStyle> = () => ({
  color: "#00B4D8",
  fontSize: 18,
  fontWeight: "600",
  lineHeight: 22,
  textAlign: "right",
})

const $bannerIndicators: ViewStyle = {
  position: "absolute",
  bottom: 16,
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
}

const $indicatorActive: ViewStyle = {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "#00B4D8",
}

const $indicatorInactive: ViewStyle = {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "rgba(255, 255, 255, 0.5)",
}

// Form Styles
const $formContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
})

const $loginTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  color: "#fff",
  marginBottom: 0,
  textAlign: "left",
})

const $loginTitleBold: ThemedStyle<TextStyle> = ({ spacing }) => ({
  color: "#fff",
  marginBottom: spacing.xl,
  textAlign: "left",
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $inputWrapper: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#fff",
  borderRadius: 10,
  borderWidth: 0,
})

const $fieldLabel: ThemedStyle<TextStyle> = () => ({
  color: "#fff",
  marginBottom: 4,
  fontSize: 14,
  fontWeight: "500",
})

const $optionsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.lg,
})

const $rememberMeContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $checkboxContainer: ViewStyle = {
  width: 18,
  height: 18,
  borderWidth: 2,
  borderColor: "#fff",
  borderRadius: 3,
  marginRight: 8,
  justifyContent: "center",
  alignItems: "center",
}

const $checkboxChecked: ViewStyle = {
  width: 10,
  height: 10,
  backgroundColor: "#fff",
  borderRadius: 2,
}

const $rememberMeText: ThemedStyle<TextStyle> = () => ({
  color: "#fff",
  fontSize: 14,
  fontWeight: "400",
})

const $forgotPasswordText: ThemedStyle<TextStyle> = () => ({
  color: "#fff",
  fontSize: 14,
  fontWeight: "400",
})

const $loginButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  borderRadius: 12,
  backgroundColor: "#8CF6A0",
  width: "100%",
  alignSelf: "center",
})

const $loginButtonText: ThemedStyle<TextStyle> = () => ({
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
  textAlign: "center",
})

const $loginError: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.error,
  marginBottom: spacing.sm,
  textAlign: "center",
})

// Bottom Logo Styles
const $bottomLogoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.lg,
})

const $bottomLogoImage: ImageStyle = {
  aspectRatio: 2,
  height: 60,
  resizeMode: "contain",
}

const $buttonContent: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 12,
}

const $loadingIndicator: ViewStyle = {
  marginRight: 8,
}

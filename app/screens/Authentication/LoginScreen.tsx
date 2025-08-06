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

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)

  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)

  const { login, loading, loginError, getValidationError } = useLogin()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  useEffect(() => {
    /*     // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("pastozin")
    setAuthPassword("9ALK/1!P4o") */

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
      <View style={themed($logoContainer)}>
        <Image source={logo} style={themed($logoImage)} />
      </View>
      <View style={themed($cardContainer)}>
        <Text text="Faça login no" preset="heading" style={themed($enterDetailsCard)} />
        <Text text="Medgospel" preset="heading" style={themed($enterDetailsCard)} />
        {attemptsCount > 2 && (
          <Text text="Tente novamente" size="sm" weight="light" style={themed($hint)} />
        )}
        <TextField
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={themed($textFieldCard)}
          inputWrapperStyle={themed($inputWrapperCard)}
          autoCapitalize="none"
          autoComplete="username"
          autoCorrect={false}
          keyboardType="default"
          label="E-mail ou usuário"
          LabelTextProps={{ style: { marginBottom: 4 } }}
          placeholder="Digite seu e-mail ou usuário"
          helper={error}
          status={error ? "error" : undefined}
          onSubmitEditing={() => authPasswordInput.current?.focus()}
        />
        <TextField
          ref={authPasswordInput}
          value={authPassword}
          onChangeText={setAuthPassword}
          containerStyle={themed($textFieldCard)}
          inputWrapperStyle={themed($inputWrapperCard)}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          label="Senha"
          LabelTextProps={{ style: { marginBottom: 4 } }}
          placeholder="Digite sua senha"
          onSubmitEditing={handleLogin}
          RightAccessory={PasswordRightAccessory}
        />
        {loginError ? <Text style={themed($loginError)}>{loginError}</Text> : null}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={({ pressed }) => [
            themed($tapButtonCard),
            pressed && { backgroundColor: "#72dd88" },
            loading && { opacity: 0.7 },
          ]}
        >
          <View style={$buttonContent}>
            {loading && <ActivityIndicator color="#1C75BB" style={$loadingIndicator} />}
            <Text style={themed($tapButtonText)}>{loading ? "Entrando..." : "ENTRAR"}</Text>
          </View>
        </Pressable>
      </View>
    </Screen>
  )
})

const $screenBackground: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.primary600,
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.xxl,
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.lg,
})

const $tapButtonText: ThemedStyle<TextStyle> = () => ({
  color: "#1C75BB",
  fontWeight: "bold",
  fontSize: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
})

const $inputWrapperCard: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#fff",
  borderRadius: 10,
})

const $logoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  height: 120,
  marginBottom: spacing.lg,
})

const $logoImage: ImageStyle = {
  aspectRatio: 2,
  height: 80,
  resizeMode: "contain",
}

const $cardContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderRadius: 20,
  padding: spacing.xl,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
  alignItems: "stretch",
  width: "100%",
  maxWidth: 370,
  alignSelf: "center",
})

const $logInCard: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxxs,
  fontSize: 24,
  fontWeight: "400",
  textAlign: "left",
})

const $enterDetailsCard: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  fontSize: 28,
  fontWeight: "700",
  textAlign: "left",
})

const $textFieldCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  borderRadius: 10,
})

const $tapButtonCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  borderRadius: 12,
  backgroundColor: "#8CF6A0",
  width: "100%",
  alignSelf: "center",
})

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.md,
})

const $loginError: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.error,
  marginBottom: spacing.sm,
  textAlign: "center",
})

const $buttonContent: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 12,
}

const $loadingIndicator: ViewStyle = {
  marginRight: 8,
}

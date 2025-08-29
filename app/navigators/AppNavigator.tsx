/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { ComponentProps } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"

import Config from "@/config"
import { LoginScreen } from "@/screens/Authentication/LoginScreen"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { EspecialidadeScreen } from "@/screens/EspecialidadeScreen"
import { EspecialistasScreen } from "@/screens/EspecialistasScreen"
import { EstablishmentsScreen } from "@/screens/EstablishmentsScreen"
import { SelecionarPessoaScreen } from "@/screens/SelecionarPessoaScreen"
import { ExamesImagemScreen } from "@/screens/ExamesImagemScreen"
import { CarrinhoScreen } from "@/screens/CarrinhoScreen"
import { useAppTheme } from "@/theme/context"
import { useStores } from "@/models"

import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { SignupScreen } from "@/screens/Authentication/SignupScreen"
import { EscolherFluxoConsultaScreen } from "@/screens/Agendamento/EscolherFluxoConsulta"
import { BottomTabsNavigator } from "./BottomTabsNavigator"
import { ProcedimentosScreen } from "@/screens/ProcedimentosScreen"
import { EditarPerfilScreen } from "@/screens/EditarPerfilScreen"
import { CirurgiasScreen } from "@/screens/CirurgiasScreen"
import { DependentesScreen } from "@/screens/DependentesScreen"
import { PixPaymentScreen } from "@/screens/PixPaymentScreen"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  MainTabs: undefined
  Login: undefined
  Signup: undefined
  EscolherFluxoConsulta: undefined
  Especialidade: undefined
  Especialistas: undefined
  Establishments: {
    mode: "EI" | "CO"
    selectedExams?: any[]
  }
  SelecionarPessoa: undefined
  Carrinho: undefined
  ExamesImagem: undefined
  Procedimentos: undefined
  EditarPerfil: undefined
  Cirurgias: undefined
  Dependentes: undefined
  PixPayment: {
    paymentData: {
      mensagem: string
      data: {
        id: string | null
        valor: string
        dt_aprovacao: string | null
        dt_criado: string
        parcelas: number
        status: string
        qr_code_base64: string
        qr_code: string
        url: string
      }
    }
  }
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(() => {
  const {
    theme: { colors },
  } = useAppTheme()

  const { authenticationStore } = useStores()
  const isAuthenticated = authenticationStore.isAuthenticated
  console.log("isAuthenticated", isAuthenticated)
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={isAuthenticated ? "MainTabs" : "Login"}
    >
      <Stack.Screen name="MainTabs" component={BottomTabsNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Especialidade" component={EspecialidadeScreen} />
      <Stack.Screen name="Especialistas" component={EspecialistasScreen} />
      <Stack.Screen name="Establishments" component={EstablishmentsScreen} />
      <Stack.Screen name="EscolherFluxoConsulta" component={EscolherFluxoConsultaScreen} />
      <Stack.Screen name="SelecionarPessoa" component={SelecionarPessoaScreen} />
      <Stack.Screen name="Carrinho" component={CarrinhoScreen} />
      <Stack.Screen name="ExamesImagem" component={ExamesImagemScreen} />
      <Stack.Screen name="Procedimentos" component={ProcedimentosScreen} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
      <Stack.Screen name="Cirurgias" component={CirurgiasScreen} />
      <Stack.Screen name="Dependentes" component={DependentesScreen} />
      <Stack.Screen name="PixPayment" component={PixPaymentScreen} />
      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> { }

export const AppNavigator = observer((props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
})

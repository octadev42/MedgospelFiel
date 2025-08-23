import { FC, useEffect, useState } from "react"
import { View, ViewStyle, ScrollView, Alert } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from "react-native-reanimated"
import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { DateField } from "@/components/DateField"
import { Select } from "@/components/Select"
import { Button } from "@/components/Button"
import { Icon, PressableIcon } from "@/components/Icon"
import { showToast } from "@/components/Toast"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useStores } from "@/models"
import { authService } from "@/services/auth.service"

type EditarPerfilScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "MainTabs">
}

// Form validation schema
const profileSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  data_nascimento: z.string().min(10, "Data de nascimento é obrigatória"),
  cpf: z.string().min(14, "CPF deve ter 11 dígitos"),
  sexo: z.string().min(1, "Sexo é obrigatório"),
  telefone: z.string().min(14, "Telefone é obrigatório"),
})

type ProfileFormData = z.infer<typeof profileSchema>

const genderOptions = [
  { label: "Masculino", value: "masculino" },
  { label: "Feminino", value: "feminino" },
]

export const EditarPerfilScreen: FC<EditarPerfilScreenProps> = observer(function EditarPerfilScreen() {
  const { themed, theme } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { authenticationStore, appGeralStore } = useStores()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  
  const buttonScale = useSharedValue(1)
  const formOpacity = useSharedValue(0)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  })

  const watchedValues = watch()

  // Animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }))

  // Load user profile data
  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
          if (!authenticationStore.pessoa_fisica_id) {
        showToast.error("Erro ao carregar dados do usuário")
        return
      }

      try {
        const result = await authService.getUserProfile(authenticationStore.pessoa_fisica_id)
        
        if (result.kind === "ok" && result.data) {
          setUserProfile(result.data)
          
          // Set form values
          setValue("nome", result.data.nome || "")
          setValue("data_nascimento", result.data.data_nascimento ? 
            format(new Date(result.data.data_nascimento), "dd/MM/yyyy") : "")
          setValue("cpf", result.data.cpf || "")
          setValue("sexo", result.data.sexo || "")
          setValue("telefone", result.data.telefone || "")
        } else {
          showToast.error("Erro ao carregar perfil")
        }
      } catch (error) {
        showToast.error("Erro ao carregar perfil")
      } finally {
      setIsLoadingProfile(false)
      formOpacity.value = withTiming(1, { duration: 500 })
    }
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (!authenticationStore.pessoa_fisica_id) {
      showToast.error("Erro: ID do usuário não encontrado")
      return
    }

    setIsLoading(true)
    buttonScale.value = withSpring(0.95)

    try {
      // Parse date from DD/MM/YYYY to YYYY-MM-DD
      const parsedDate = parse(data.data_nascimento, "dd/MM/yyyy", new Date())
      const formattedDate = format(parsedDate, "yyyy-MM-dd")

      const result = await authService.updateUserProfile(authenticationStore.pessoa_fisica_id, {
        ...data,
        data_nascimento: formattedDate,
      })

      if (result.kind === "ok") {
        showToast.success("Perfil atualizado com sucesso!")
        navigation.goBack()
      } else {
        showToast.error("Erro ao atualizar perfil")
      }
    } catch (error) {
      showToast.error("Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
      buttonScale.value = withSpring(1)
    }
  }

  const formatCPF = (text: string) => {
    const numbers = text.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }

  const formatPhone = (text: string) => {
    const numbers = text.replace(/\D/g, "")
    if (numbers.length <= 2) return `(${numbers}`
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  if (isLoadingProfile) {
    return (
      <View style={themed($container)}>
        <Screen
          preset="scroll"
          contentContainerStyle={themed($screenContentContainer)}
          safeAreaEdges={["top"]}
          systemBarStyle="light"
        >
          <View style={themed($loadingContainer)}>
            <Text text="Carregando..." style={themed($loadingText)} />
          </View>
        </Screen>
      </View>
    )
  }

  return (
    <View style={themed($container)}>
      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        safeAreaEdges={["top"]}
        systemBarStyle="light"
      >
        {/* Header */}
        <Animated.View 
          style={[themed($headerContainer)]}
          entering={FadeInDown.duration(600)}
        >
          <PressableIcon 
            icon="back" 
            size={24} 
            color={theme.colors.text} 
            onPress={handleBackPress}
            containerStyle={themed($backButton)}
          />
          <Text text="Editar Perfil" style={themed($headerTitle)} />
          <View style={themed($headerSpacer)} />
        </Animated.View>

        {/* Form */}
        <Animated.View 
          style={[themed($formContainer), formAnimatedStyle]}
          entering={FadeInUp.duration(800).delay(200)}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Name Field */}
            <Animated.View entering={SlideInRight.duration(600).delay(300)}>
              <Controller
                control={control}
                name="nome"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label="Nome Completo"
                    placeholder="Digite seu nome completo"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    status={errors.nome ? "error" : undefined}
                    helper={errors.nome?.message}
                    containerStyle={themed($fieldContainer)}
                  />
                )}
              />
            </Animated.View>

            {/* Birth Date Field */}
            <Animated.View entering={SlideInRight.duration(600).delay(400)}>
              <Controller
                control={control}
                name="data_nascimento"
                                 render={({ field: { onChange, value } }) => (
                   <DateField
                     control={control}
                     name="data_nascimento"
                     label="Data de Nascimento"
                     placeholder="DD/MM/AAAA"
                     onDateChange={onChange}
                     error={errors.data_nascimento}
                     containerStyle={themed($fieldContainer)}
                   />
                 )}
              />
            </Animated.View>

            {/* CPF Field */}
            <Animated.View entering={SlideInRight.duration(600).delay(500)}>
              <Controller
                control={control}
                name="cpf"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label="CPF"
                    placeholder="000.000.000-00"
                    value={value}
                    onChangeText={(text) => {
                      const formatted = formatCPF(text)
                      onChange(formatted)
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    maxLength={14}
                    status={errors.cpf ? "error" : undefined}
                    helper={errors.cpf?.message}
                    containerStyle={themed($fieldContainer)}
                  />
                )}
              />
            </Animated.View>

            {/* Gender Field */}
            <Animated.View entering={SlideInRight.duration(600).delay(600)}>
              <Controller
                control={control}
                name="sexo"
                render={({ field: { onChange, value } }) => (
                  <Select
                    label="Sexo"
                    placeholder="Selecione o sexo"
                    value={value}
                    onValueChange={onChange}
                    items={genderOptions}
                    error={errors.sexo?.message}
                    containerStyle={themed($fieldContainer)}
                  />
                )}
              />
            </Animated.View>

            {/* Phone Field */}
            <Animated.View entering={SlideInRight.duration(600).delay(700)}>
              <Controller
                control={control}
                name="telefone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    value={value}
                    onChangeText={(text) => {
                      const formatted = formatPhone(text)
                      onChange(formatted)
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    maxLength={15}
                    status={errors.telefone ? "error" : undefined}
                    helper={errors.telefone?.message}
                    containerStyle={themed($fieldContainer)}
                  />
                )}
              />
            </Animated.View>

            {/* Submit Button */}
            <Animated.View 
              style={[themed($buttonContainer), buttonAnimatedStyle]}
              entering={FadeInUp.duration(600).delay(800)}
            >
                             <Button
                 text={isLoading ? "Salvando..." : "Salvar Alterações"}
                 onPress={handleSubmit(onSubmit)}
                 disabled={!isValid || isLoading}
                 style={themed($submitButton)}
                 textStyle={themed($submitButtonText)}
               />
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </Screen>
    </View>
  )
})

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
  paddingBottom: 100,
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $loadingText: ThemedStyle<any> = () => ({
  fontSize: 16,
  color: "#666",
})

const $headerContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#E0E0E0",
})

const $backButton: ThemedStyle<ViewStyle> = () => ({
  padding: 8,
})

const $headerTitle: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  fontSize: 20,
  fontWeight: "600",
  textAlign: "center",
  marginLeft: -40, // Compensate for back button
})

const $headerSpacer: ThemedStyle<ViewStyle> = () => ({
  width: 40,
})

const $formContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  paddingHorizontal: 20,
  paddingTop: 20,
})

const $fieldContainer: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 20,
})

const $buttonContainer: ThemedStyle<ViewStyle> = () => ({
  marginTop: 30,
  marginBottom: 40,
})

const $submitButton: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#20B2AA",
  borderRadius: 12,
  paddingVertical: 16,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
})

const $submitButtonText: ThemedStyle<any> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "white",
})
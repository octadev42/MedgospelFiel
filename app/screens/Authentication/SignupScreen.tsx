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
    KeyboardAvoidingView,
    Platform,
} from "react-native"
import * as SystemUI from "expo-system-ui"
import { observer } from "mobx-react-lite"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, TextFieldAccessoryProps } from "@/components/TextField"
import { DateField } from "@/components/DateField"
import { Select, SelectOption } from "@/components/Select"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { cepLib } from "@/lib/cep.lib"
import { locationService, Cidade } from "@/services/location.service"
import { useLogin } from "@/hooks/useAuth"
import { navigate } from "@/navigators/navigationUtilities"

// TODO: Add "Signup" route to AppStackParamList in AppNavigator.tsx
interface SignupScreenProps { }

const logo = require("../../../assets/images/logo_branca.png")

// CPF validation function
const validateCPF = (cpf: string): boolean => {
    // Remove dots and dashes
    const cleanCPF = cpf.replace(/[^\d]/g, "")

    // Check if has 11 digits
    if (cleanCPF.length !== 11) return false

    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false

    // Validate first check digit
    let sum = 0
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false

    // Validate second check digit
    sum = 0
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false

    return true
}

// CEP validation and formatting
const formatCEP = (cep: string): string => {
    const numbers = cep.replace(/\D/g, "")
    if (numbers.length <= 5) {
        return numbers
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
}

const validateCEP = (cep: string): boolean => {
    const cleanCEP = cep.replace(/\D/g, "")
    return cleanCEP.length === 8
}

// Phone validation and formatting
const formatPhone = (phone: string): string => {
    const numbers = phone.replace(/\D/g, "")

    if (numbers.length <= 2) {
        return `(${numbers}`
    } else if (numbers.length <= 6) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    } else {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
}

const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, "")
    return cleanPhone.length >= 10 && cleanPhone.length <= 11
}

// Zod schema for personal data validation
const personalDataSchema = z.object({
    fullName: z.string().min(1, "Nome completo é obrigatório"),
    cpf: z.string().min(1, "CPF é obrigatório").refine((cpf) => validateCPF(cpf), {
        message: "CPF inválido",
    }),
    birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
    phoneNumber: z.string().min(1, "Número de telefone é obrigatório").refine((phone) => validatePhone(phone), {
        message: "Telefone inválido",
    }),
    gender: z.enum(["masculino", "feminino"]).optional().refine((val) => val !== undefined, {
        message: "Sexo é obrigatório",
    }),
})

// Zod schema for address data validation
const addressSchema = z.object({
    cep: z.string().min(1, "CEP é obrigatório").refine((cep) => validateCEP(cep), {
        message: "CEP inválido",
    }),
    logradouro: z.string().min(1, "Logradouro é obrigatório"),
    numero: z.string().min(1, "Número é obrigatório"),
    bairro: z.string().min(1, "Bairro é obrigatório"),
    cidade: z.string().min(1, "Cidade é obrigatória"),
    estado: z.string().min(1, "Estado é obrigatório"),
})

// Zod schema for access data validation
const accessSchema = z.object({
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    password: z.string()
        .min(8, "Senha deve ter no mínimo 8 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve conter ao menos: 1 letra maiúscula, 1 minúscula e 1 número"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
})

type PersonalDataForm = z.infer<typeof personalDataSchema>
type AddressForm = z.infer<typeof addressSchema>
type AccessForm = z.infer<typeof accessSchema>

// Step configuration
const STEPS = [
    {
        id: 1,
        title: "Dados Pessoais",
        description: "Informações pessoais",
    },
    {
        id: 2,
        title: "Região",
        description: "Localização",
    },
    {
        id: 3,
        title: "Acesso",
        description: "Dados de acesso",
    },
] as const

export const SignupScreen: FC<SignupScreenProps> = observer(function SignupScreen(_props) {
    const { signup, loading: authLoading } = useLogin()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCEP, setIsLoadingCEP] = useState(false)
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)
    const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true)
    const [cities, setCities] = useState<Cidade[]>([])
    const [isLoadingCities, setIsLoadingCities] = useState(false)

    const {
        themed,
        theme: { colors },
    } = useAppTheme()

    // State options for select
    const stateOptions = [
        { name: "Acre", sigla: "AC" },
        { name: "Alagoas", sigla: "AL" },
        { name: "Amapá", sigla: "AP" },
        { name: "Amazonas", sigla: "AM" },
        { name: "Bahia", sigla: "BA" },
        { name: "Ceará", sigla: "CE" },
        { name: "Distrito Federal", sigla: "DF" },
        { name: "Espírito Santo", sigla: "ES" },
        { name: "Goiás", sigla: "GO" },
        { name: "Maranhão", sigla: "MA" },
        { name: "Mato Grosso", sigla: "MT" },
        { name: "Mato Grosso do Sul", sigla: "MS" },
        { name: "Minas Gerais", sigla: "MG" },
        { name: "Pará", sigla: "PA" },
        { name: "Paraíba", sigla: "PB" },
        { name: "Paraná", sigla: "PR" },
        { name: "Pernambuco", sigla: "PE" },
        { name: "Piauí", sigla: "PI" },
        { name: "Rio de Janeiro", sigla: "RJ" },
        { name: "Rio Grande do Norte", sigla: "RN" },
        { name: "Rio Grande do Sul", sigla: "RS" },
        { name: "Rondônia", sigla: "RO" },
        { name: "Roraima", sigla: "RR" },
        { name: "Santa Catarina", sigla: "SC" },
        { name: "São Paulo", sigla: "SP" },
        { name: "Sergipe", sigla: "SE" },
        { name: "Tocantins", sigla: "TO" }
    ]

    // Personal data form
    const personalForm = useForm<PersonalDataForm>({
        resolver: zodResolver(personalDataSchema),
        defaultValues: {
            fullName: "",
            cpf: "",
            birthDate: "",
            phoneNumber: "",
            gender: undefined,
        },
        mode: "onChange",
    })

    // Address form
    const addressForm = useForm<AddressForm>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            cep: "",
            logradouro: "",
            numero: "",
            bairro: "",
            cidade: "",
            estado: "",
        },
        mode: "onChange",
    })

    // Access form
    const accessForm = useForm<AccessForm>({
        resolver: zodResolver(accessSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onChange",
    })



    useEffect(() => {
        SystemUI.setBackgroundColorAsync(colors.palette.primary600)
    }, [colors.palette.primary600])



    // Handle CEP lookup
    const handleCEPChange = async (cep: string) => {
        const formattedCEP = formatCEP(cep)
        addressForm.setValue("cep", formattedCEP, { shouldValidate: true })

        if (validateCEP(formattedCEP)) {
            setIsLoadingCEP(true)
            try {
                const result = await cepLib.getCEPInfo(formattedCEP)

                if (result?.kind === "ok" && result.data) {
                    addressForm.setValue("logradouro", result.data.logradouro, { shouldValidate: true })
                    addressForm.setValue("bairro", result.data.bairro, { shouldValidate: true })
                    addressForm.setValue("cidade", result.data.localidade, { shouldValidate: true })
                    addressForm.setValue("estado", result.data.uf, { shouldValidate: true }) // Use UF instead of full state name

                    // Clear errors for auto-filled fields
                    addressForm.clearErrors(["logradouro", "bairro", "cidade", "estado"])

                    // Fetch cities for the found state
                    await fetchCitiesByState(result.data.uf)
                } else {
                    addressForm.setError("cep", {
                        type: "manual",
                        message: "CEP não encontrado"
                    })
                }
            } catch (error) {
                addressForm.setError("cep", {
                    type: "manual",
                    message: "Erro ao consultar CEP"
                })
            } finally {
                setIsLoadingCEP(false)
            }
        }
    }

    // Fetch cities by state
    const fetchCitiesByState = async (uf: string) => {
        setIsLoadingCities(true)
        try {
            const result = await locationService.getCidadesByState(uf)
            if (result?.kind === "ok") {
                setCities(result.data)
            }
        } catch (error) {
            console.error("Error fetching cities:", error)
        } finally {
            setIsLoadingCities(false)
        }
    }

    const onPersonalDataSubmit = async (data: PersonalDataForm) => {
        // Trigger validation for all fields to show errors
        const isValid = await personalForm.trigger()

        if (!isValid) {
            // Form is invalid, errors will be shown automatically
            return
        }

        setIsLoading(true)
        try {
            // Handle form submission logic here
            console.log("Personal data submitted:", data)
            // Move to next step
            setCurrentStep(2)
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const onAddressSubmit = async (data: AddressForm) => {
        // Trigger validation for all fields to show errors
        const isValid = await addressForm.trigger()

        if (!isValid) {
            // Form is invalid, errors will be shown automatically
            return
        }

        setIsLoading(true)
        try {
            // Handle form submission logic here
            console.log("Address data submitted:", data)
            // Move to next step
            setCurrentStep(3)
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsLoading(false)
        }
    }

        const onAccessSubmit = async (data: AccessForm) => {
        // Trigger validation for all fields to show errors
        const isValid = await accessForm.trigger()

        if (!isValid) {
            // Form is invalid, errors will be shown automatically
            return
        }

        try {
            // Combine all three forms data
            const personalData = personalForm.getValues()
            const addressData = addressForm.getValues()
            const accessData = data

            // Format data according to API requirements
            const formattedPayload = {
                email: accessData.email,
                telefone: personalData.phoneNumber.replace(/\D/g, ""), // Remove all non-digits
                endereco: {
                    tipo_logradouro: "Rua", // Default value, could be made dynamic
                    logradouro: addressData.logradouro,
                    numero: addressData.numero,
                    bairro: addressData.bairro,
                    cep: addressData.cep.replace(/\D/g, ""), // Remove dashes
                    fk_cidade: cities.find(city => city.nome === addressData.cidade)?.id || 0
                },
                fk_indicador: 6, // Default value, could be made dynamic
                senha: accessData.password,
                tipo: "T", // Default value, could be made dynamic
                nome: personalData.fullName,
                cpf: personalData.cpf.replace(/\D/g, ""), // Remove dots and dashes
                data_nascimento: formatDateForAPI(personalData.birthDate), // Convert DD/MM/YYYY to YYYY-MM-DD
                sexo: personalData.gender === "masculino" ? "M" : "F"
            }

            console.log("Formatted payload:", formattedPayload)

            // Use the signup function from useLogin hook
            const success = await signup(formattedPayload)
            
            if (success) {
                console.log("Signup and login completed successfully!")
                // Navigate to Home screen after successful signup and login
                navigate("Home")
            }
        } catch (error) {
            console.error("Error submitting form:", error)
        }
    }

    // Helper function to format date from DD/MM/YYYY to YYYY-MM-DD
    const formatDateForAPI = (dateString: string): string => {
        if (!dateString || dateString.length !== 10) return ""
        
        const [day, month, year] = dateString.split("/")
        return `${year}-${month}-${day}`
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const renderStepIndicator = () => (
        <View style={themed($stepIndicatorContainer)}>
            {STEPS.map((step, index) => (
                <View key={step.id} style={themed($stepItem)}>
                    <View
                        style={[
                            themed($stepCircle),
                            currentStep >= step.id ? themed($stepCircleActive) : themed($stepCircleInactive),
                        ]}
                    >
                        <Text
                            text={String(step.id).padStart(2, "0")}
                            style={[
                                themed($stepNumber),
                                currentStep >= step.id ? themed($stepNumberActive) : themed($stepNumberInactive),
                            ]}
                        />
                    </View>
                    <Text
                        text={step.title}
                        style={[
                            themed($stepTitle),
                            currentStep >= step.id ? themed($stepTitleActive) : themed($stepTitleInactive),
                        ]}
                    />
                    {index < STEPS.length - 1 && <View style={themed($stepConnector)} />}
                </View>
            ))}
        </View>
    )

    const renderPersonalDataForm = () => (
        <View style={themed($formContainer)}>
            <Controller
                control={personalForm.control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        key="personal-fullName"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        containerStyle={themed($textField)}
                        inputWrapperStyle={themed($inputWrapper)}
                        autoCapitalize="words"
                        autoComplete="name"
                        autoCorrect={false}
                        keyboardType="default"
                        label="Nome Completo"
                        LabelTextProps={{ style: themed($fieldLabel) }}
                        placeholder="Digite seu nome completo"
                        helper={personalForm.formState.errors.fullName?.message}
                        status={personalForm.formState.errors.fullName ? "error" : undefined}
                    />
                )}
            />

            <Controller
                control={personalForm.control}
                name="cpf"
                render={({ field: { onChange, onBlur, value } }) => {
                    const formatCPF = (text: string) => {
                        // Remove all non-digits
                        const numbers = text.replace(/\D/g, "")

                        // Format as XXX.XXX.XXX-XX
                        if (numbers.length <= 3) {
                            return numbers
                        } else if (numbers.length <= 6) {
                            return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
                        } else if (numbers.length <= 9) {
                            return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
                        } else {
                            return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
                        }
                    }

                    return (
                        <TextField
                            key="personal-cpf"
                            value={value}
                            onChangeText={(text) => {
                                const formatted = formatCPF(text)
                                onChange(formatted)
                            }}
                            onBlur={onBlur}
                            containerStyle={themed($textField)}
                            inputWrapperStyle={themed($inputWrapper)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="numeric"
                            maxLength={14}
                            label="CPF"
                            LabelTextProps={{ style: themed($fieldLabel) }}
                            placeholder="000.000.000-00"
                            helper={personalForm.formState.errors.cpf?.message}
                            status={personalForm.formState.errors.cpf ? "error" : undefined}
                        />
                    )
                }}
            />

            <DateField
                key="personal-birthDate"
                control={personalForm.control}
                name="birthDate"
                label="Data de Nascimento"
                placeholder="DD/MM/AAAA"
                error={personalForm.formState.errors.birthDate}
                containerStyle={themed($textField)}
                labelStyle={themed($fieldLabel)}
                maximumDate={new Date()}
                minimumDate={new Date(new Date().getFullYear() - 120, 0, 1)}
            />

            <Controller
                control={personalForm.control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        key="personal-phoneNumber"
                        value={value}
                        onChangeText={(text) => {
                            const formattedPhone = formatPhone(text)
                            onChange(formattedPhone)
                        }}
                        onBlur={onBlur}
                        containerStyle={themed($textField)}
                        inputWrapperStyle={themed($inputWrapper)}
                        autoCapitalize="none"
                        autoComplete="tel"
                        autoCorrect={false}
                        keyboardType="phone-pad"
                        maxLength={15}
                        label="Número de Telefone"
                        LabelTextProps={{ style: themed($fieldLabel) }}
                        placeholder="(00) 0 0000-0000"
                        helper={personalForm.formState.errors.phoneNumber?.message}
                        status={personalForm.formState.errors.phoneNumber ? "error" : undefined}
                    />
                )}
            />

            {/* Gender Selection */}
            <View style={themed($genderContainer)}>
                <Text text="Sexo" style={themed($fieldLabel)} />
                <Controller
                    control={personalForm.control}
                    name="gender"
                    render={({ field: { onChange, value } }) => (
                        <View style={themed($radioGroup)}>
                            <Pressable
                                style={themed($radioOption)}
                                onPress={() => onChange("masculino")}
                            >
                                <View style={themed($radioCircle)}>
                                    {value === "masculino" && <View style={themed($radioSelected)} />}
                                </View>
                                <Text text="Masculino" style={themed($radioLabel)} />
                            </Pressable>
                            <Pressable
                                style={themed($radioOption)}
                                onPress={() => onChange("feminino")}
                            >
                                <View style={themed($radioCircle)}>
                                    {value === "feminino" && <View style={themed($radioSelected)} />}
                                </View>
                                <Text text="Feminino" style={themed($radioLabel)} />
                            </Pressable>
                        </View>
                    )}
                />
                {personalForm.formState.errors.gender && (
                    <Text text={personalForm.formState.errors.gender.message || ""} style={themed($errorText)} />
                )}
            </View>
        </View>
    )

    const renderAddressForm = () => (
        <View style={themed($formContainer)}>
            <Controller
                control={addressForm.control}
                name="cep"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        key="address-cep"
                        value={value}
                        onChangeText={(text) => {
                            handleCEPChange(text)
                        }}
                        onBlur={onBlur}
                        containerStyle={themed($textField)}
                        inputWrapperStyle={themed($inputWrapper)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="numeric"
                        maxLength={9}
                        label="CEP"
                        LabelTextProps={{ style: themed($fieldLabel) }}
                        placeholder="00000-000"
                        helper={isLoadingCEP ? "Consultando CEP..." : addressForm.formState.errors.cep?.message}
                        status={addressForm.formState.errors.cep ? "error" : undefined}
                    />
                )}
            />

            <Controller
                control={addressForm.control}
                name="logradouro"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        key="address-logradouro"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        containerStyle={themed($textField)}
                        inputWrapperStyle={themed($inputWrapper)}
                        autoCapitalize="words"
                        autoCorrect={false}
                        label="Logradouro"
                        LabelTextProps={{ style: themed($fieldLabel) }}
                        placeholder="Nome da rua"
                        helper={addressForm.formState.errors.logradouro?.message}
                        status={addressForm.formState.errors.logradouro ? "error" : undefined}
                    />
                )}
            />

            <Controller
                control={addressForm.control}
                name="numero"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        key="address-numero"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        containerStyle={themed($textField)}
                        inputWrapperStyle={themed($inputWrapper)}
                        autoCorrect={false}
                        keyboardType="numeric"
                        label="Número"
                        LabelTextProps={{ style: themed($fieldLabel) }}
                        placeholder="123"
                        helper={addressForm.formState.errors.numero?.message}
                        status={addressForm.formState.errors.numero ? "error" : undefined}
                    />
                )}
            />

            <Controller
                control={addressForm.control}
                name="bairro"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        key="address-bairro"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        containerStyle={themed($textField)}
                        inputWrapperStyle={themed($inputWrapper)}
                        autoCapitalize="words"
                        autoCorrect={false}
                        label="Bairro"
                        LabelTextProps={{ style: themed($fieldLabel) }}
                        placeholder="Centro"
                        helper={addressForm.formState.errors.bairro?.message}
                        status={addressForm.formState.errors.bairro ? "error" : undefined}
                    />
                )}
            />

            <Controller
                control={addressForm.control}
                name="estado"
                render={({ field: { onChange, onBlur, value } }) => {
                    const stateItems: SelectOption[] = stateOptions.map(state => ({
                        label: `${state.name} (${state.sigla})`,
                        value: state.sigla
                    }))
                    

                    
                    return (
                        <Select
                            label="Estado"
                            placeholder="Selecione um estado"
                            value={value}
                            onValueChange={(newValue) => {
                                onChange(newValue)
                                // Clear city when state changes
                                addressForm.setValue("cidade", "", { shouldValidate: true })
                                setCities([])
                                // Fetch cities for the selected state
                                if (newValue && typeof newValue === 'string') {
                                    fetchCitiesByState(newValue)
                                }
                            }}
                            items={stateItems}
                            error={addressForm.formState.errors.estado?.message}
                            containerStyle={themed($textField)}
                        />
                    )
                }}
            />

            <Controller
                control={addressForm.control}
                name="cidade"
                render={({ field: { onChange, onBlur, value } }) => {
                    const cityItems: SelectOption[] = cities.map(city => ({
                        label: city.nome,
                        value: city.nome
                    }))
                    
                    return (
                        <Select
                            label="Cidade"
                            placeholder={isLoadingCities ? "Carregando..." : "Selecione uma cidade"}
                            value={value}
                            onValueChange={onChange}
                            items={cityItems}
                            error={addressForm.formState.errors.cidade?.message}
                            disabled={cities.length === 0}
                            containerStyle={themed($textField)}
                        />
                    )
                }}
            />
        </View>
    )



    const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
        () =>
            function PasswordRightAccessory(props: TextFieldAccessoryProps) {
                return (
                    <PressableIcon
                        style={{
                            marginRight: 12,
                            marginTop: 12,
                        }}
                        icon={isPasswordHidden ? "view" : "hidden"}
                        onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                    />
                )
            },
        [isPasswordHidden, themed],
    )

    const ConfirmPasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
        () =>
            function ConfirmPasswordRightAccessory(props: TextFieldAccessoryProps) {
                return (
                    <PressableIcon
                        icon={isConfirmPasswordHidden ? "view" : "hidden"}
                        onPress={() => setIsConfirmPasswordHidden(!isConfirmPasswordHidden)}
                    />
                )
            },
        [isConfirmPasswordHidden, themed],
    )

    const renderAccessForm = () => {

        return (
            <View style={themed($formContainer)}>
                <Controller
                    control={accessForm.control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                            key="access-email"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            containerStyle={themed($textField)}
                            inputWrapperStyle={themed($inputWrapper)}
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                            keyboardType="email-address"
                            label="Email"
                            LabelTextProps={{ style: themed($fieldLabel) }}
                            placeholder="seuemail@exemplo.com"
                            helper={accessForm.formState.errors.email?.message}
                            status={accessForm.formState.errors.email ? "error" : undefined}
                        />
                    )}
                />

                <Controller
                    control={accessForm.control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                            key="access-password"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            containerStyle={themed($textField)}
                            inputWrapperStyle={themed($inputWrapper)}
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect={false}
                            secureTextEntry={isPasswordHidden}
                            label="Senha"
                            LabelTextProps={{ style: themed($fieldLabel) }}
                            placeholder="••••••••"
                            RightAccessory={PasswordRightAccessory}
                            helper={accessForm.formState.errors.password?.message}
                            status={accessForm.formState.errors.password ? "error" : undefined}
                        />
                    )}
                />

                <Controller
                    control={accessForm.control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                            key="access-confirmPassword"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            containerStyle={themed($textField)}
                            inputWrapperStyle={themed($inputWrapper)}
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect={false}
                            secureTextEntry={isConfirmPasswordHidden}
                            label="Confirmar Senha"
                            LabelTextProps={{ style: themed($fieldLabel) }}
                            placeholder="••••••••"
                            RightAccessory={ConfirmPasswordRightAccessory}
                            helper={accessForm.formState.errors.confirmPassword?.message}
                            status={accessForm.formState.errors.confirmPassword ? "error" : undefined}
                        />
                    )}
                />
            </View>
        )
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <View key="personal-form">{renderPersonalDataForm()}</View>
            case 2:
                return <View key="address-form">{renderAddressForm()}</View>
            case 3:
                return <View key="access-form">{renderAccessForm()}</View>
            default:
                return null
        }
    }

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
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                {/* Top Logo */}
                <View style={themed($logoContainer)}>
                    <Image source={logo} style={themed($logoImage)} />
                </View>

                {/* Main Content Card */}
                <View style={themed($mainCard)}>
                {/* Header */}
                <View style={themed($headerContainer)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={themed($headerTopRow)}>
                            <Pressable onPress={handleBack} style={themed($backButton)}>
                                <Text text="←" style={themed($backButtonText)} />
                            </Pressable>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text text="Crie sua conta no " preset="heading" style={themed($title)} />
                            <Text text="medgospel" preset="heading" style={themed($titleBold)} />
                        </View>
                    </View>

                    <Pressable style={themed($loginLinkContainer)}>
                        <Text text="Já possui uma conta? " style={themed($loginLinkText)} />
                        <Text text="Entrar" style={themed($loginLinkHighlight)} />
                    </Pressable>
                </View>

                {/* Step Indicator */}
                {renderStepIndicator()}

                {/* Form Content */}
                {renderCurrentStep()}

                {/* Action Button */}
                {currentStep === 1 && (
                    <Pressable
                        onPress={personalForm.handleSubmit(onPersonalDataSubmit)}
                        disabled={authLoading}
                        style={({ pressed }) => [
                            themed($actionButton),
                            pressed && { backgroundColor: "#72dd88" },
                            authLoading && { opacity: 0.7 },
                        ]}
                    >
                        <View style={$buttonContent}>
                            {authLoading && <ActivityIndicator color="#fff" style={$loadingIndicator} />}
                            <Text style={themed($actionButtonText)}>
                                {authLoading ? "Processando..." : "PRÓXIMO"}
                            </Text>
                        </View>
                    </Pressable>
                )}

                {currentStep === 2 && (
                    <Pressable
                        onPress={addressForm.handleSubmit(onAddressSubmit)}
                        disabled={authLoading}
                        style={({ pressed }) => [
                            themed($actionButton),
                            pressed && { backgroundColor: "#72dd88" },
                            authLoading && { opacity: 0.7 },
                        ]}
                    >
                        <View style={$buttonContent}>
                            {authLoading && <ActivityIndicator color="#fff" style={$loadingIndicator} />}
                            <Text style={themed($actionButtonText)}>
                                {authLoading ? "Processando..." : "PRÓXIMO"}
                            </Text>
                        </View>
                    </Pressable>
                )}

                {currentStep === 3 && (
                    <Pressable
                        onPress={accessForm.handleSubmit(onAccessSubmit)}
                        disabled={authLoading}
                        style={({ pressed }) => [
                            themed($actionButton),
                            pressed && { backgroundColor: "#72dd88" },
                            authLoading && { opacity: 0.7 },
                        ]}
                    >
                        <View style={$buttonContent}>
                            {authLoading && <ActivityIndicator color="#fff" style={$loadingIndicator} />}
                            <Text style={themed($actionButtonText)}>
                                {authLoading ? "Processando..." : "CADASTRAR"}
                            </Text>
                        </View>
                    </Pressable>
                )}

            </View>
            </KeyboardAvoidingView>
        </Screen>
    )
})

// Screen Styles
const $screenBackground: ThemedStyle<ViewStyle> = ({ colors }) => ({
    flex: 1,
    backgroundColor: colors.palette.primary600,
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
})

// Logo Styles
const $logoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxs,
})

const $logoImage: ImageStyle = {
    aspectRatio: 2,
    height: 60,
    resizeMode: "contain",
}

// Main Card Styles
const $mainCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
})

// Header Styles
const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    marginBottom: spacing.lg,
})

const $headerTopRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
})

const $backButton: ThemedStyle<ViewStyle> = () => ({
    marginRight: 12,
})

const $backButtonText: ThemedStyle<TextStyle> = () => ({
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
})

const $titleContainer: ThemedStyle<ViewStyle> = () => ({
    flex: 1,
})

const $title: ThemedStyle<TextStyle> = () => ({
    color: "#333",
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 0,
})

const $titleBold: ThemedStyle<TextStyle> = ({ spacing }) => ({
    color: "#333",
    fontSize: 18,
    fontWeight: "700",
})

const $loginLinkContainer: ThemedStyle<ViewStyle> = () => ({
    flexDirection: "row",
    alignItems: "center",
})

const $loginLinkText: ThemedStyle<TextStyle> = () => ({
    color: "#666",
    fontSize: 14,
})

const $loginLinkHighlight: ThemedStyle<TextStyle> = () => ({
    color: "#00B4D8",
    fontSize: 14,
    fontWeight: "600",
})

// Step Indicator Styles
const $stepIndicatorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
})

const $stepItem: ThemedStyle<ViewStyle> = () => ({
    alignItems: "center",
    flex: 1,
})

const $stepCircle: ThemedStyle<ViewStyle> = () => ({
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
})

const $stepCircleActive: ThemedStyle<ViewStyle> = () => ({
    backgroundColor: "#8CF6A0",
})

const $stepCircleInactive: ThemedStyle<ViewStyle> = () => ({
    backgroundColor: "#E5E5E5",
})

const $stepNumber: ThemedStyle<TextStyle> = () => ({
    fontSize: 11,
    fontWeight: "600",
})

const $stepNumberActive: ThemedStyle<TextStyle> = () => ({
    color: "#333",
})

const $stepNumberInactive: ThemedStyle<TextStyle> = () => ({
    color: "#999",
})

const $stepTitle: ThemedStyle<TextStyle> = () => ({
    fontSize: 9,
    textAlign: "center",
})

const $stepTitleActive: ThemedStyle<TextStyle> = () => ({
    color: "#8CF6A0",
    fontWeight: "600",
})

const $stepTitleInactive: ThemedStyle<TextStyle> = () => ({
    color: "#999",
    fontWeight: "400",
})

const $stepConnector: ThemedStyle<ViewStyle> = () => ({
    position: "absolute",
    top: 16,
    right: -20,
    width: 40,
    height: 2,
    backgroundColor: "#E5E5E5",
    borderStyle: "dashed",
})

// Form Styles
const $formContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flex: 1,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    marginBottom: spacing.lg,
})

const $inputWrapper: ThemedStyle<ViewStyle> = () => ({
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
})

const $fieldLabel: ThemedStyle<TextStyle> = () => ({
    color: "#333",
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
})

const $placeholderText: ThemedStyle<TextStyle> = ({ spacing }) => ({
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing.xl,
})

// Action Button Styles
const $actionButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    marginTop: spacing.lg,
    borderRadius: 12,
    backgroundColor: "#8CF6A0",
    width: "100%",
    alignSelf: "center",
})

const $actionButtonText: ThemedStyle<TextStyle> = () => ({
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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

// Gender Radio Button Styles
const $genderContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    marginBottom: spacing.lg,
})

const $radioGroup: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flexDirection: "row",
    marginTop: spacing.xs,
    gap: spacing.lg,
})

const $radioOption: ThemedStyle<ViewStyle> = () => ({
    flexDirection: "row",
    alignItems: "center",
})

const $radioCircle: ThemedStyle<ViewStyle> = () => ({
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
})

const $radioSelected: ViewStyle = {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#8CF6A0",
}

const $radioLabel: ThemedStyle<TextStyle> = () => ({
    color: "#333",
    fontSize: 14,
    fontWeight: "400",
})

const $errorText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
})

const $passwordToggle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    paddingHorizontal: spacing.sm,
})





import { FC, useState, useEffect } from "react"
import { View, ViewStyle, Modal, TouchableOpacity, ScrollView, TextStyle, Pressable, ActivityIndicator } from "react-native"
import { observer } from "mobx-react-lite"
import { X, User, Calendar, Hash, Users, Edit } from "lucide-react-native"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, subYears, parseISO } from "date-fns"

// Mask functions
const applyDateMask = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
}

const applyCpfMask = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
}

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Button } from "@/components/Button"
import { Select } from "@/components/Select"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { useLogin } from "@/hooks/useAuth"
import { useStores } from "@/models"
import { showToast } from "@/components/Toast"

// Zod schema for dependente form validation
const dependenteSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório").min(2, "Nome deve ter pelo menos 2 caracteres"),
    data_nascimento: z.string()
        .min(1, "Data de nascimento é obrigatória")
        .refine((val) => {
            // Validate date format DD/MM/YYYY
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
            if (!dateRegex.test(val)) return false

            // Validate if it's a valid date
            const [day, month, year] = val.split('/').map(Number)
            const date = new Date(year, month - 1, day)
            return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year
        }, {
            message: "Data de nascimento deve estar no formato DD/MM/AAAA"
        }),
    sexo: z.enum(["masculino", "feminino"]).optional().refine((val) => val !== undefined, {
        message: "Sexo é obrigatório",
    }),
    cpf: z.string().optional(),
    tipo: z.string().optional(),
}).refine((data) => {
    // Check if person is over 18 and CPF is required
    if (!data.data_nascimento) return true

    try {
        const [day, month, year] = data.data_nascimento.split('/').map(Number)
        const birthDate = new Date(year, month - 1, day)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 < 18 || (age - 1 >= 18 && data.cpf && data.cpf.length > 0)
        }
        return age < 18 || (age >= 18 && data.cpf && data.cpf.length > 0)
    } catch {
        return true
    }
}, {
    message: "CPF é obrigatório para dependentes maiores de 18 anos",
    path: ["cpf"]
})

type DependenteFormData = z.infer<typeof dependenteSchema>

interface Dependente {
    id: number
    nome: string
    data_nascimento: string
    sexo: string
    cpf?: string
    tipo?: string
}

interface EditDependenteModalProps {
    visible: boolean
    dependente: Dependente | null
    onClose: () => void
    onSuccess?: () => void
}

export const EditDependenteModal: FC<EditDependenteModalProps> = observer(function EditDependenteModal({
    visible,
    dependente,
    onClose,
    onSuccess,
}) {
    const { themed, theme: { colors } } = useAppTheme()
    const { atualizarDependente, loading } = useLogin()
    const { authenticationStore } = useStores()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<DependenteFormData>({
        resolver: zodResolver(dependenteSchema),
        defaultValues: {
            tipo: "D",
            nome: "",
            data_nascimento: "",
            sexo: "masculino",
            cpf: "",
        },
    })

    // Convert API date format (YYYY-MM-DD) to display format (DD/MM/YYYY)
    const convertApiDateToDisplay = (apiDate: string) => {
        try {
            const date = parseISO(apiDate)
            return format(date, "dd/MM/yyyy")
        } catch {
            return apiDate
        }
    }

    // Set form values when dependente changes
    useEffect(() => {
        if (dependente && visible) {
            setValue("nome", dependente.nome)
            setValue("data_nascimento", convertApiDateToDisplay(dependente.data_nascimento))
            setValue("sexo", dependente.sexo === "M" ? "masculino" : "feminino")
            setValue("cpf", dependente.cpf || "")
            setValue("tipo", dependente.tipo || "D")
        }
    }, [dependente, visible, setValue])

    const watchedDataNascimento = watch("data_nascimento")
    const isMaiorIdade = () => {
        if (!watchedDataNascimento) return false
        
        // Check if the date field is completely filled (DD/MM/YYYY format)
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
        if (!dateRegex.test(watchedDataNascimento)) return false
        
        try {
            const [day, month, year] = watchedDataNascimento.split('/').map(Number)
            const birthDate = new Date(year, month - 1, day)
            const today = new Date()
            const age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                return age - 1 >= 18
            }
            return age >= 18
        } catch {
            return false
        }
    }

    const onSubmit = async (data: DependenteFormData) => {
        if (!dependente) return
        
        setIsSubmitting(true)

        try {
            // Convert masked date to YYYY-MM-DD format for API
            const convertDateToApiFormat = (maskedDate: string) => {
                const [day, month, year] = maskedDate.split('/').map(Number)
                return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
            }

            // Prepare update data
            const updateData = {
                id: dependente.id,
                tipo: data.tipo,
                nome: data.nome,
                data_nascimento: convertDateToApiFormat(data.data_nascimento),
                sexo: data.sexo === "masculino" ? "M" : "F",
                cpf: isMaiorIdade() ? (data.cpf || "") : "",
                titulares: [
                    {
                        fk_titular: authenticationStore.pessoa_fisica_id || 0,
                        grau_parentesco: "OU", // Mocked value as requested
                    },
                ],
            }

            const success = await atualizarDependente(updateData)

            if (success) {
                showToast.success("Sucesso!", "Dependente atualizado com sucesso!")
                reset()
                onSuccess?.()
                onClose()
            }
        } catch (error) {
            showToast.error("Erro", "Erro ao atualizar dependente")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View style={themed($container)}>
                {/* Loading Overlay */}
                {isSubmitting && (
                    <View style={themed($loadingOverlay)}>
                        <View style={themed($loadingContainer)}>
                            <ActivityIndicator size="large" color="#1E40AF" />
                            <Text style={themed($loadingText)} text="Atualizando dependente..." />
                        </View>
                    </View>
                )}
                
                <Screen
                    preset="scroll"
                    contentContainerStyle={themed($screenContentContainer)}
                    safeAreaEdges={["top"]}
                >
                    {/* Header */}
                    <View style={themed($header)}>
                        <View style={themed($headerContent)}>
                            <Edit size={24} color={colors.palette.secondary500} />
                            <Text style={themed($headerTitle)} text="Editar Dependente" />
                        </View>
                        <TouchableOpacity style={themed($closeButton)} onPress={handleClose}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View style={themed($formContainer)}>
                        <Text style={themed($formSubtitle)} text="Edite os dados do dependente" />

                        {/* Nome */}
                        <Controller
                            control={control}
                            name="nome"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                    label="Nome Completo"
                                    placeholder="Digite o nome completo"
                                    value={value}
                                    onChangeText={onChange}
                                    inputWrapperStyle={themed($inputWrapper)}
                                    onBlur={onBlur}
                                    status={errors.nome?.message ? "error" : undefined}
                                />
                            )}
                        />
                        {errors.nome?.message && (
                            <Text style={themed($errorText)} text={errors.nome.message} />
                        )}

                        {/* Data de Nascimento */}
                        <Controller
                            control={control}
                            name="data_nascimento"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                    label="Data de Nascimento"
                                    placeholder="DD/MM/AAAA"
                                    value={value}
                                    onChangeText={(text) => {
                                        const maskedValue = applyDateMask(text)
                                        onChange(maskedValue)
                                    }}
                                    inputWrapperStyle={themed($inputWrapper)}
                                    onBlur={onBlur}
                                    status={errors.data_nascimento?.message ? "error" : undefined}
                                    keyboardType="numeric"
                                    maxLength={10}
                                />
                            )}
                        />
                        {errors.data_nascimento?.message && (
                            <Text style={themed($errorText)} text={errors.data_nascimento.message} />
                        )}

                        {/* Sexo */}
                        <View style={themed($genderContainer)}>
                            <Text text="Sexo" style={themed($fieldLabel)} />
                            <Controller
                                control={control}
                                name="sexo"
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
                            {errors.sexo && (
                                <Text text={errors.sexo.message || ""} style={themed($errorText)} />
                            )}
                        </View>

                        {/* CPF (apenas se maior de idade) */}
                        {isMaiorIdade() && (
                            <Controller
                                control={control}
                                name="cpf"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextField
                                        label="CPF (Obrigatório para maiores de idade)"
                                        placeholder="000.000.000-00"
                                        value={value}
                                        onChangeText={(text) => {
                                            const maskedValue = applyCpfMask(text)
                                            onChange(maskedValue)
                                        }}
                                        onBlur={onBlur}
                                        status={errors.cpf?.message ? "error" : undefined}
                                        LeftAccessory={() => <Hash size={20} color="#6B7280" />}
                                        keyboardType="numeric"
                                        maxLength={14}
                                    />
                                )}
                            />
                        )}
                        {isMaiorIdade() && errors.cpf?.message && (
                            <Text style={themed($errorText)} text={errors.cpf.message} />
                        )}

                        {/* Info about CPF requirement */}
                        {isMaiorIdade() && (
                            <View style={themed($infoContainer)}>
                                <Text style={themed($infoText)} text="CPF é obrigatório para dependentes maiores de 18 anos" />
                            </View>
                        )}

                        {/* Submit Button */}
                        <View style={themed($buttonContainer)}>
                            <Button
                                text={isSubmitting ? "Atualizando..." : "Atualizar Dependente"}
                                onPress={handleSubmit(onSubmit as any)}
                                disabled={loading || isSubmitting}
                                style={themed($submitButton)}
                                textStyle={themed($submitButtonText)}
                                RightAccessory={() => 
                                    isSubmitting ? (
                                        <ActivityIndicator 
                                            size="small" 
                                            color="white" 
                                            style={{ marginLeft: 8 }}
                                        />
                                    ) : null
                                }
                            />
                        </View>
                    </View>
                </Screen>
            </View>
        </Modal>
    )
})

const $container: ThemedStyle<ViewStyle> = () => ({
    flex: 1,
    backgroundColor: "white",
})

const $inputWrapper: ThemedStyle<ViewStyle> = () => ({
    padding: 4,
    marginBottom: 8
})

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
    paddingBottom: 100,
})

const $header: ThemedStyle<ViewStyle> = () => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
})

const $headerContent: ThemedStyle<ViewStyle> = () => ({
    flexDirection: "row",
    alignItems: "center",
})

const $headerTitle: ThemedStyle<TextStyle> = () => ({
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 12,
})

const $closeButton: ThemedStyle<ViewStyle> = () => ({
    padding: 8,
})

const $formContainer: ThemedStyle<ViewStyle> = () => ({
    paddingHorizontal: 16,
    paddingTop: 24,
})

const $formSubtitle: ThemedStyle<TextStyle> = () => ({
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
})

const $infoContainer: ThemedStyle<ViewStyle> = () => ({
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
})

const $infoText: ThemedStyle<TextStyle> = () => ({
    fontSize: 14,
    color: "#92400E",
    textAlign: "center",
})

const $buttonContainer: ThemedStyle<ViewStyle> = () => ({
    marginTop: 32,
    marginBottom: 24,
})

const $submitButton: ThemedStyle<ViewStyle> = () => ({
    backgroundColor: "#1E40AF",
    borderRadius: 12,
    paddingVertical: 16,
})

const $submitButtonText: ThemedStyle<TextStyle> = () => ({
    fontSize: 16,
    fontWeight: "600",
    color: "white",
})

const $errorText: ThemedStyle<TextStyle> = () => ({
    fontSize: 12,
    color: "#FF6B6B",
    marginTop: 4,
    marginBottom: 8,
})

// Gender Radio Button Styles
const $genderContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    marginBottom: spacing.lg,
})

const $fieldLabel: ThemedStyle<TextStyle> = () => ({
    color: "#333",
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
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

const $loadingOverlay: ThemedStyle<ViewStyle> = () => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
})

const $loadingText: ThemedStyle<TextStyle> = () => ({
    marginTop: 12,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
})

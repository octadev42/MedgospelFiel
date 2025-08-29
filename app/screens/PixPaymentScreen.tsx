import { FC, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, Alert, Linking } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { ArrowLeft, Copy, CheckCircle, Clock, AlertCircle } from "lucide-react-native"
import * as Clipboard from "expo-clipboard"
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withSequence,
    interpolate,
    runOnJS
} from "react-native-reanimated"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { Header } from "@/components/Header"
import { showToast } from "@/components/Toast"

type PixPaymentScreenProps = {
    navigation: NativeStackNavigationProp<AppStackParamList, "PixPayment">
}

interface PixPaymentData {
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

interface PixPaymentResponse {
    mensagem: string
    data: PixPaymentData
}

export const PixPaymentScreen: FC<PixPaymentScreenProps> = observer(function PixPaymentScreen() {
    const { themed } = useAppTheme()
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
    const route = useRoute()

    const [paymentData, setPaymentData] = useState<PixPaymentData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [copiedText, setCopiedText] = useState<string | null>(null)

    // Animation values
    const pulseAnimation = useSharedValue(1)
    const checkmarkScale = useSharedValue(0)

    // Get payment data from route params
    useEffect(() => {
        const params = route.params as { paymentData: PixPaymentResponse }
        if (params?.paymentData?.data) {
            setPaymentData(params.paymentData.data)
            setIsLoading(false)

            // Start pulse animation for pending status
            if (params.paymentData.data.status === "pending") {
                pulseAnimation.value = withRepeat(
                    withSequence(
                        withSpring(1.05, { duration: 1000 }),
                        withSpring(1, { duration: 1000 })
                    ),
                    -1,
                    true
                )
            }
        } else {
            setError("Dados de pagamento não encontrados")
            setIsLoading(false)
        }
    }, [route.params])

    const handleBackPress = () => {
        navigation.goBack()
    }

         const handleCopyPixCode = async () => {
         if (!paymentData?.qr_code) return

         try {
             await Clipboard.setStringAsync(paymentData.qr_code)
             setCopiedText(paymentData.qr_code)
             showToast.success("Código PIX copiado!", "Cole o código no seu app de pagamento")
             
             // Reset copied state after 3 seconds
             setTimeout(() => {
                 setCopiedText(null)
             }, 3000)
         } catch (err) {
             showToast.error("Erro ao copiar código", "Tente novamente")
         }
     }



    const getStatusIcon = () => {
        switch (paymentData?.status) {
            case "approved":
                return <CheckCircle size={24} color="#4CAF50" />
            case "pending":
                return <Clock size={24} color="#FF9800" />
            case "rejected":
                return <AlertCircle size={24} color="#F44336" />
            default:
                return <Clock size={24} color="#FF9800" />
        }
    }

    const getStatusText = () => {
        switch (paymentData?.status) {
            case "approved":
                return "Pagamento Aprovado"
            case "pending":
                return "Aguardando Pagamento"
            case "rejected":
                return "Pagamento Rejeitado"
            default:
                return "Aguardando Pagamento"
        }
    }

    const getStatusColor = () => {
        switch (paymentData?.status) {
            case "approved":
                return "#4CAF50"
            case "pending":
                return "#FF9800"
            case "rejected":
                return "#F44336"
            default:
                return "#FF9800"
        }
    }

    const animatedPulseStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulseAnimation.value }]
        }
    })

    const animatedCheckmarkStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: checkmarkScale.value }]
        }
    })

    // Animate checkmark when status changes to approved
    useEffect(() => {
        if (paymentData?.status === "approved") {
            checkmarkScale.value = withSpring(1, { damping: 10, stiffness: 100 })
        }
    }, [paymentData?.status])

    if (isLoading) {
        return (
            <View style={themed($container)}>
                <Header title="Pagamento PIX" titleStyle={{ color: "white" }} leftIcon="back" leftIconColor="white" onLeftPress={handleBackPress} />
                <Screen preset="fixed" contentContainerStyle={themed($loadingContainer)}>
                    <Text style={themed($loadingText)} text="Carregando pagamento..." />
                </Screen>
            </View>
        )
    }

    if (error || !paymentData) {
        return (
            <View style={themed($container)}>
                <Header title="Pagamento PIX" titleStyle={{ color: "white" }} leftIcon="back" leftIconColor="white" onLeftPress={handleBackPress} />
                <Screen preset="fixed" contentContainerStyle={themed($errorContainer)}>
                    <AlertCircle size={48} color="#F44336" />
                    <Text style={themed($errorText)} text={error || "Erro desconhecido"} />
                    <TouchableOpacity style={themed($retryButton)} onPress={handleBackPress}>
                        <Text style={themed($retryButtonText)} text="Voltar" />
                    </TouchableOpacity>
                </Screen>
            </View>
        )
    }

    return (
        <View style={themed($container)}>
            <Header title="Pagamento PIX" titleStyle={{ color: "white" }} leftIcon="back" leftIconColor="white" onLeftPress={handleBackPress} />

            <Screen preset="scroll" contentContainerStyle={themed($screenContentContainer)}>
                {/* Payment Status */}
                <View style={themed($statusContainer)}>
                    <Animated.View style={[themed($statusIconContainer), animatedPulseStyle]}>
                        {getStatusIcon()}
                    </Animated.View>
                    <Text style={[themed($statusText), { color: getStatusColor() }]} text={getStatusText()} />
                </View>

                {/* Payment Amount */}
                <View style={themed($amountContainer)}>
                    <Text style={themed($amountLabel)} text="Valor do Pagamento" />
                    <Text style={themed($amountValue)} text={`R$ ${parseFloat(paymentData.valor).toFixed(2).replace('.', ',')}`} />
                </View>

                                 {/* PIX Code Section */}
                 <View style={themed($pixCodeContainer)}>
                     <Text style={themed($sectionTitle)} text="Código PIX" />
                     <Text style={themed($sectionDescription)} text="Copie o código abaixo e cole no seu app de pagamento" />

                     <View style={themed($pixCodeWrapper)}>
                         <Text style={themed($pixCodeText)} text={paymentData.qr_code} />
                         <TouchableOpacity style={themed($copyButton)} onPress={handleCopyPixCode}>
                             {copiedText ? (
                                 <CheckCircle size={24} color="#4CAF50" />
                             ) : (
                                 <Copy size={24} color="#1E90FF" />
                             )}
                         </TouchableOpacity>
                     </View>

                     <TouchableOpacity style={themed($copyAllButton)} onPress={handleCopyPixCode}>
                         <Copy size={20} color="white" />
                         <Text style={themed($copyAllButtonText)} text={copiedText ? "Código Copiado!" : "Copiar Código PIX"} />
                     </TouchableOpacity>
                 </View>



                {/* Payment Instructions */}
                <View style={themed($instructionsContainer)}>
                    <Text style={themed($sectionTitle)} text="Como Pagar" />
                    <View style={themed($instructionItem)}>
                        <Text style={themed($instructionNumber)} text="1" />
                        <Text style={themed($instructionText)} text="Abra o app do seu banco" />
                    </View>
                    <View style={themed($instructionItem)}>
                        <Text style={themed($instructionNumber)} text="2" />
                        <Text style={themed($instructionText)} text="Toque em 'Copiar Código PIX' acima" />
                    </View>
                    <View style={themed($instructionItem)}>
                        <Text style={themed($instructionNumber)} text="3" />
                        <Text style={themed($instructionText)} text="Cole o código no app do banco" />
                    </View>
                    <View style={themed($instructionItem)}>
                        <Text style={themed($instructionNumber)} text="4" />
                        <Text style={themed($instructionText)} text="Confirme o pagamento" />
                    </View>
                    <View style={themed($instructionItem)}>
                        <Text style={themed($instructionNumber)} text="5" />
                        <Text style={themed($instructionText)} text="Aguarde a confirmação" />
                    </View>
                </View>

                {/* Payment Date */}
                <View style={themed($dateContainer)}>
                    <Text style={themed($dateLabel)} text="Data de Criação" />
                    <Text style={themed($dateValue)} text={new Date(paymentData.dt_criado).toLocaleString('pt-BR')} />
                </View>
            </Screen>
        </View>
    )
})

const $container: ThemedStyle<ViewStyle> = () => ({
    flex: 1,
    backgroundColor: "#1E90FF",
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
})

const $loadingText: ThemedStyle<TextStyle> = () => ({
    fontSize: 16,
    color: "white",
})

const $errorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
})

const $errorText: ThemedStyle<TextStyle> = () => ({
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
})

const $retryButton: ThemedStyle<ViewStyle> = () => ({
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
})

const $retryButtonText: ThemedStyle<TextStyle> = () => ({
    fontSize: 16,
    fontWeight: "600",
    color: "white",
})

const $statusContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
})

const $statusIconContainer: ThemedStyle<ViewStyle> = () => ({
    marginBottom: 12,
})

const $statusText: ThemedStyle<TextStyle> = () => ({
    fontSize: 18,
    fontWeight: "700",
})

const $amountContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    backgroundColor: "white",
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: "center",
})

const $amountLabel: ThemedStyle<TextStyle> = () => ({
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
})

const $amountValue: ThemedStyle<TextStyle> = () => ({
    fontSize: 25,
    fontWeight: "700",
    color: "#4CAF50",
})

const $sectionTitle: ThemedStyle<TextStyle> = () => ({
     fontSize: 18,
     fontWeight: "700",
     color: "#333",
     marginBottom: 8,
     marginHorizontal: 'auto'
 })

 const $sectionDescription: ThemedStyle<TextStyle> = () => ({
     fontSize: 14,
     color: "#666",
     textAlign: "center",
     marginBottom: 16,
 })

const $pixCodeContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    backgroundColor: "white",
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
})

const $pixCodeWrapper: ThemedStyle<ViewStyle> = () => ({
     flexDirection: "row",
     alignItems: "center",
     backgroundColor: "#F8F9FA",
     borderRadius: 12,
     padding: 16,
     borderWidth: 2,
     borderColor: "#E0E0E0",
     marginBottom: 16,
 })

 const $pixCodeText: ThemedStyle<TextStyle> = () => ({
     flex: 1,
     fontSize: 14,
     color: "#333",
     fontFamily: "monospace",
     lineHeight: 20,
 })

const $copyButton: ThemedStyle<ViewStyle> = () => ({
     padding: 12,
     marginLeft: 12,
     backgroundColor: "#E3F2FD",
     borderRadius: 8,
 })

 const $copyAllButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
     backgroundColor: "#1E90FF",
     borderRadius: 12,
     paddingVertical: 16,
     paddingHorizontal: 24,
     flexDirection: "row",
     alignItems: "center",
     justifyContent: "center",
     shadowColor: "#000",
     shadowOffset: {
         width: 0,
         height: 2,
     },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 3,
 })

 const $copyAllButtonText: ThemedStyle<TextStyle> = () => ({
     fontSize: 18,
     fontWeight: "700",
     color: "white",
     marginLeft: 12,
 })



const $instructionsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    backgroundColor: "white",
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
})

const $instructionItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
})

const $instructionNumber: ThemedStyle<TextStyle> = () => ({
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1E90FF",
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 24,
    marginRight: 12,
})

const $instructionText: ThemedStyle<TextStyle> = () => ({
    flex: 1,
    fontSize: 16,
    color: "#333",
})

const $dateContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
    backgroundColor: "white",
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
})

const $dateLabel: ThemedStyle<TextStyle> = () => ({
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
})

const $dateValue: ThemedStyle<TextStyle> = () => ({
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
})

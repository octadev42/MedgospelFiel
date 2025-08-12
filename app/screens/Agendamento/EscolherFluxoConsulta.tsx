import { FC } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  Pressable,
  Image,
} from "react-native"
import { observer } from "mobx-react-lite"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ArrowLeft, User, Stethoscope, Building2 } from "lucide-react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { navigate } from "@/navigators/navigationUtilities"
import { useStores } from "@/models"

interface EscolherFluxoConsultaScreenProps { }

export const EscolherFluxoConsultaScreen: FC<EscolherFluxoConsultaScreenProps> = observer(
  function EscolherFluxoConsultaScreen(_props) {
    const {
      themed,
      theme: { colors },
    } = useAppTheme()

    const insets = useSafeAreaInsets()

    const { schedulingStore } = useStores()

    const handleFindDoctor = () => {
      // Navigate to find doctor screen
      schedulingStore.resetScheduling()
      navigate("Especialistas")
    }

    const handleChooseSpecialty = () => {
      // Navigate to specialty selection screen
      schedulingStore.resetScheduling()
      navigate("Especialidade")
    }

    const handleSearchClinic = () => {
      // Navigate to clinic search screen
      schedulingStore.resetScheduling()
      navigate("Home")
    }

    const handleBack = () => {
      navigate("Home")
    }

    return (
      <Screen
        preset="auto"
        backgroundColor={colors.palette.primary600}
        style={themed($screenBackground)}
        contentContainerStyle={themed($screenContentContainer)}
        safeAreaEdges={["top"]}
      >
        {/* Header */}
        <View style={[themed($header)]}>
          <Pressable onPress={handleBack} style={themed($backButton)}>
            <ArrowLeft size={24} color="#fff" />
          </Pressable>
          <Text text="Como deseja agendar?" style={themed($headerTitle)} />
          <View style={themed($headerSpacer)} />
        </View>

        {/* Content */}
        <View style={themed($contentContainer)}>
          {/* Action Buttons */}
          <View style={themed($buttonsContainer)}>
            {/* Find Doctor Button */}
            <Pressable
              style={({ pressed }) => [
                themed($actionButtonSecondary),
                pressed && themed($buttonPressed),
              ]}
              onPress={handleFindDoctor}
            >
              <View style={themed($buttonContent)}>
                <Image source={require("@assets/images/fluxo/escolher_medico.png")} />
                <View style={themed($buttonTextContainer)}>
                  <Text text="Encontrar Médico" style={themed($buttonText)} />
                  <Text text="Pesquise pelo nome do profissional" style={themed($buttonAction)} />
                </View>
              </View>
            </Pressable>

            {/* Choose Specialty Button */}
            <Pressable
              style={({ pressed }) => [
                themed($actionButtonSecondary),
                pressed && themed($buttonPressed),
              ]}
              onPress={handleChooseSpecialty}
            >
              <View style={themed($buttonContent)}>
                <Image source={require("@assets/images/fluxo/escolher_especialidade.png")} />
                <View style={themed($buttonTextContainer)}>

                  <Text text="Escolher Especialidade" style={themed($buttonText)} />
                  <Text text="Veja todos os especialistas disponíveis" style={themed($buttonAction)} />
                </View>
              </View>
            </Pressable>

            {/* Search Clinic Button */}
            <Pressable
              style={({ pressed }) => [
                themed($actionButtonSecondary),
                pressed && themed($buttonPressed),
              ]}
              onPress={handleSearchClinic}
            >
              <View style={themed($buttonContent)}>
                <Image source={require("@assets/images/fluxo/buscar_clinica.png")} />
                <View style={themed($buttonTextContainer)}>
                  <Text text="Buscar Clínica" style={themed($buttonText)} />
                  <Text text="Selecione por localização e unidade" style={themed($buttonAction)} />
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </Screen>
    )
  },
)

// Screen Styles
const $screenBackground: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.primary600,
})

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

// Header Styles
const $header: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  backgroundColor: colors.palette.primary600,
})

const $backButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
})

const $headerTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  color: "#fff",
  fontWeight: "600",
  textAlign: "center",
})

const $headerSpacer: ThemedStyle<ViewStyle> = () => ({
  width: 40,
})

// Content Styles
const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  backgroundColor: "#fff",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xl,
})

const $buttonsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  gap: spacing.md,
})

// Button Styles
const $actionButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary600,
  borderRadius: 12,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
  borderWidth: 1,
  borderColor: colors.palette.primary600,
})

const $actionButtonGreen: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.success500,
  borderRadius: 12,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
  borderWidth: 1,
  borderColor: colors.palette.success500
})

const $actionButtonSecondary: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderRadius: 12,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
  borderWidth: 1,
  borderColor: colors.palette.primary500,
})

const $buttonPressed: ThemedStyle<ViewStyle> = () => ({
  opacity: 0.9,
})

const $buttonContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "column",
  alignItems: "center",
  gap: spacing.md,
  justifyContent: "center",
})
const $buttonTextContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xxxs,
})
const $buttonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral700,
  fontSize: 16,
  fontWeight: "500",
})

const $buttonAction: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral600,
  fontSize: 12,
  fontWeight: "400",
})

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
import { Header } from "@/components/Header"
import { AppStackParamList } from "@/navigators/AppNavigator"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "@react-navigation/native"

interface EscolherFluxoConsultaScreenProps {
  navigation: NativeStackNavigationProp<AppStackParamList, "EscolherFluxoConsulta">
}

export const EscolherFluxoConsultaScreen: FC<EscolherFluxoConsultaScreenProps> = observer(
  function EscolherFluxoConsultaScreen(_props) {
    const {
      themed,
      theme: { colors },
    } = useAppTheme()

    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

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
    const handleBack = () => {
      navigation.goBack()
    }

    return (
      <View style={themed($container)}>
        <Header title="Como deseja agendar?" titleStyle={{ color: "white" }} leftIcon="back" leftIconColor="white" onLeftPress={handleBack} />
        <Screen
          preset="auto"
          backgroundColor={colors.palette.neutral200}
          style={themed($screenBackground)}
          contentContainerStyle={themed($screenContentContainer)}
        >
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
                onPress={()=>{}}
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
      </View>
    )
  },
)


const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

// Screen Styles
const $screenBackground: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.neutral200,
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
  backgroundColor: colors.palette.neutral200,
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
  backgroundColor: colors.background,
  borderRadius: 12,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
  borderWidth: 1,
  borderColor: colors.background,
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

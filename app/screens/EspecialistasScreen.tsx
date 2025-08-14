import { FC, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, TextInput, ScrollView, Image, ImageStyle } from "react-native"
import { CheckCircle } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"

import { BottomNavigation } from "@/components/BottomNavigation"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useStores } from "@/models"
import { showToast } from "@/components/Toast"
import { useEspecialists } from "@/hooks/useEspecialists"

type EspecialistasScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Especialistas">
}

const SpecialistImage: FC = () => {
  const { themed } = useAppTheme()
  const [isLoading, setIsLoading] = useState(true)

  return (
    <View style={themed($imageContainer)}>
      <Image
        source={{
          uri: 'https://avatar.iran.liara.run/public'
        }}
        style={themed($profilePlaceholder)}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
      {isLoading && (
        <View style={themed($imageLoadingPlaceholder)}>
          <Icon icon="more" size={24} color="#E0E0E0" />
        </View>
      )}
    </View>
  )
}

export const EspecialistasScreen: FC<EspecialistasScreenProps> = observer(function EspecialistasScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { schedulingStore } = useStores()
  const [searchText, setSearchText] = useState("")

  const handleSpecialistPress = (specialistName: string) => {
    schedulingStore.setEspecialist(specialistName)
    console.log(`Selected specialist: ${specialistName}`)

    navigation.navigate("Establishments")
  }

  const { loading, error, especialistas } = useEspecialists()
  const handleBackPress = () => {
    navigation.goBack()
  }

  return (
    <View style={themed($container)}>
      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        safeAreaEdges={["top"]}
        systemBarStyle="light"
      >
        {/* Header Section */}
        <View style={themed($headerContainer)}>
          <View style={themed($headerTop)}>
            <TouchableOpacity style={themed($backButton)} onPress={handleBackPress}>
              <Icon icon="back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={themed($headerTitle)} text={schedulingStore.selectedEspeciality || "Especialistas"} />
            <View style={themed($headerSpacer)} />
          </View>

          {/* Subtitle */}
          {schedulingStore.selectedEspeciality && (
            <View style={themed($subtitleContainer)}>
              <Text style={themed($subtitleText)} text={`Especialistas em ${schedulingStore.selectedEspeciality}`} />
            </View>
          )}

          {/* Search Bar */}
          <View style={themed($searchContainer)}>
            <View style={themed($searchBar)}>
              <Icon icon="view" size={20} color="#666" />
              <TextInput
                style={themed($searchInput)}
                placeholder="Pesquisar"
                placeholderTextColor="#666"
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity style={themed($filterButton)}>
                <Icon icon="more" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Specialists List */}
        <View style={themed($specialistsContainer)}>
          {especialistas.map((specialist) => (
            <TouchableOpacity
              key={specialist.id}
              style={themed($specialistCard)}
              onPress={() => handleSpecialistPress(specialist.nome)}
            >
              <SpecialistImage />
              <View style={themed($specialistInfo)}>
                <Text style={themed($specialistName)} text={specialist.nome} />
                <Text style={themed($specialistDetails)} text={`${specialist.perfil} | ${specialist.observacao}`} />
              </View>
              <TouchableOpacity style={themed($optionsButton)}>
                <CheckCircle size={20} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </Screen>

      {/* Bottom Navigation - Fixed at bottom */}
      <View style={themed($bottomNavigationContainer)}>
        <BottomNavigation />
      </View>
    </View>
  )
})

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
  paddingBottom: 100, // Add padding to account for bottom navigation
})

const $bottomNavigationContainer: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "white",
  borderTopWidth: 1,
  borderTopColor: "#E0E0E0",
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#1E90FF",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xl,
  paddingBottom: spacing.lg,
})

const $headerTop: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: spacing.lg,
})

const $backButton: ThemedStyle<ViewStyle> = () => ({
  padding: 8,
})

const $headerTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
  fontWeight: "700",
  color: "white",
  flex: 1,
  textAlign: "center",
})

const $headerSpacer: ThemedStyle<ViewStyle> = () => ({
  width: 40,
})

const $subtitleContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $subtitleText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "400",
  color: "white",
  textAlign: "center",
  opacity: 0.9,
})

const $searchContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $searchBar: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 12,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $searchInput: ThemedStyle<TextStyle> = ({ spacing }) => ({
  flex: 1,
  fontSize: 16,
  color: "#333",
  marginLeft: spacing.sm,
  marginRight: spacing.sm,
})

const $filterButton: ThemedStyle<ViewStyle> = () => ({
  padding: 4,
})

const $specialistsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
  paddingBottom: spacing.xl,
  flex: 1,
})

const $specialistCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 12,
  padding: spacing.md,
  marginBottom: spacing.md,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $imageContainer: ThemedStyle<ViewStyle> = () => ({
  position: "relative",
  marginRight: 12,
})

const $profilePlaceholder: ThemedStyle<ImageStyle> = () => ({
  width: 60,
  height: 60,
  borderRadius: 8,
})

const $imageLoadingPlaceholder: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#F5F5F5",
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
})

const $specialistInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $specialistName: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "700",
  color: "#333",
  marginBottom: 4,
})

const $specialistDetails: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#666",
  marginBottom: 6,
})

const $ratingContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $ratingText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  color: "#666",
  marginLeft: 4,
})

const $optionsButton: ThemedStyle<ViewStyle> = () => ({
  padding: 8,
}) 
import { FC, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, TextInput, ScrollView, Image, ImageStyle } from "react-native"
import { ChevronRight, Star } from "lucide-react-native"
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
import { useTabelaPreco } from "@/hooks/useTabelaPreco"

type EstablishmentsScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Establishments">
}

const ClinicImage: FC<{ price: string }> = ({ price }) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($imageContainer)}>
      <View style={themed($clinicImagePlaceholder)}>
        <Icon icon="x" size={32} color="#E0E0E0" />
      </View>
      <View style={themed($priceBadge)}>
        <Text style={themed($priceText)} text={price} />
      </View>
    </View>
  )
}

export const EstablishmentsScreen: FC<EstablishmentsScreenProps> = observer(function EstablishmentsScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { schedulingStore } = useStores()
  const [searchText, setSearchText] = useState("")
  const [activeTab, setActiveTab] = useState<"home" | "wallet" | "cart" | "heart" | "profile">("home")

  // Use the tabelaPreco hook
  const { loading, error, data: tabelaPrecoData } = useTabelaPreco({
    app: true,
    fk_especialista: schedulingStore.selectedEspecialist ? parseInt(schedulingStore.selectedEspecialist) : undefined,
    fk_estabelecimento: schedulingStore.selectedEstablishment ? parseInt(schedulingStore.selectedEstablishment) : undefined,
  })

  // Transform the data to match our UI needs
  const establishments = tabelaPrecoData ? [
    {
      id: tabelaPrecoData.fk_pessoa_juridica,
      name: tabelaPrecoData.nome_fantasia,
      address: tabelaPrecoData.endereco,
      rating: 5.0, // Mock rating since it's not in the API response
      reviews: 332, // Mock reviews since it's not in the API response
      price: `R$${tabelaPrecoData.valor_total.toFixed(2)}`,
      onPress: () => handleEstablishmentPress(tabelaPrecoData.nome_fantasia),
    }
  ] : []

  const handleEstablishmentPress = (establishmentName: string) => {
    schedulingStore.setEstablishment(establishmentName)
    showToast.success("Estabelecimento selecionado", `${establishmentName} foi selecionado`)
    console.log(`Selected establishment: ${establishmentName}`)
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleTabPress = (tab: "home" | "wallet" | "cart" | "heart" | "profile") => {
    if (tab === "home") {
      navigation.navigate("Home")
    } else if (tab === "profile") {
      navigation.navigate("Profile")
    } else {
      setActiveTab(tab)
    }
  }

  const handleInfoPress = (establishmentName: string) => {
    showToast.info("Informações", `Mostrando informações de ${establishmentName}`)
    console.log(`Info for: ${establishmentName}`)
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
            <Text style={themed($headerTitle)} text="Locais de Atendimento" />
            <View style={themed($headerSpacer)} />
          </View>

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

        {/* Establishments List */}
        <View style={themed($establishmentsContainer)}>
          {loading ? (
            <View style={themed($loadingContainer)}>
              <Text style={themed($loadingText)} text="Carregando estabelecimentos..." />
            </View>
          ) : error ? (
            <View style={themed($errorContainer)}>
              <Text style={themed($errorText)} text={error} />
            </View>
          ) : establishments.length === 0 ? (
            <View style={themed($emptyContainer)}>
              <Text style={themed($emptyText)} text="Nenhum estabelecimento encontrado" />
            </View>
          ) : (
            establishments.map((establishment) => (
              <TouchableOpacity
                key={establishment.id}
                style={themed($establishmentCard)}
                onPress={establishment.onPress}
              >
                <ClinicImage price={establishment.price} />
                <View style={themed($establishmentInfo)}>
                  <Text style={themed($establishmentName)} text={establishment.name} />
                  <Text style={themed($establishmentAddress)} text={establishment.address} />
                  <View style={themed($ratingContainer)}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <Text style={themed($ratingText)} text={`${establishment.rating} (${establishment.reviews} avaliações)`} />
                  </View>
                </View>
                <TouchableOpacity 
                  style={themed($infoButton)}
                  onPress={() => handleInfoPress(establishment.name)}
                >
                  <Text style={themed($infoText)} text="Informações" />
                  <ChevronRight size={16} color="#1E90FF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      </Screen>

      {/* Bottom Navigation - Fixed at bottom */}
      <View style={themed($bottomNavigationContainer)}>
        <BottomNavigation
          active={activeTab}
          onTabPress={handleTabPress}
        />
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

const $establishmentsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
  paddingBottom: spacing.xl,
  flex: 1,
})

const $establishmentCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "flex-start",
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

const $clinicImagePlaceholder: ThemedStyle<ViewStyle> = () => ({
  width: 80,
  height: 80,
  borderRadius: 8,
  backgroundColor: "#F5F5F5",
  justifyContent: "center",
  alignItems: "center",
})

const $priceBadge: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  bottom: -4,
  right: -4,
  backgroundColor: "#1E90FF",
  borderRadius: 12,
  paddingHorizontal: 8,
  paddingVertical: 4,
})

const $priceText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "700",
  color: "white",
})

const $establishmentInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $establishmentName: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "700",
  color: "#333",
  marginBottom: 4,
})

const $establishmentAddress: ThemedStyle<TextStyle> = () => ({
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

const $infoButton: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  padding: 8,
})

const $infoText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "#1E90FF",
  marginRight: 4,
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 40,
})

const $loadingText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#666",
  textAlign: "center",
})

const $errorContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 40,
})

const $errorText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#FF6B6B",
  textAlign: "center",
})

const $emptyContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 40,
})

const $emptyText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#666",
  textAlign: "center",
}) 
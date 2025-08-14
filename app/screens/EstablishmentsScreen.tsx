import { FC, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, TextInput, ScrollView, Image, ImageStyle } from "react-native"
import { ChevronRight, Star, MapPin, FileText, Calendar, Clock, MessageCircle } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"

import { BottomNavigation } from "@/components/BottomNavigation"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { ScheduleCalendar } from "@/components/ScheduleCalendar"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useStores } from "@/models"
import { showToast } from "@/components/Toast"
import { useTabelaPreco } from "@/hooks/useTabelaPreco"

type EstablishmentsScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Establishments">
}

const EstablishmentCard: FC<{ establishment: any }> = ({ establishment }) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($establishmentCardContainer)}>
      <View style={themed($clinicImageContainer)}>
          <Image
            source={require("@assets/images/estabelecimentos/hvisao.webp")}
            style={themed($clinicImage)}
          />
        </View>
      {/* Header Section */}
      <View style={themed($cardHeaderSection)}>

        <View style={themed($clinicInfoContainer)}>
          <Text style={themed($clinicName)} text={establishment.name} />
          <Text style={themed($clinicAddress)} text={establishment.address} />

          <View style={themed($ratingRow)}>
            <View style={themed($ratingContainer)}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={themed($ratingText)} text="4.75" />

              <Text style={themed($reviewsText)} text="(332 avaliações)" />
            </View>
           
          </View>
        </View>
      </View>

      {/* Pricing Section */}
      <View style={themed($pricingContainer)}>
        <View style={themed($priceDisplay)}>
          <Text style={themed($priceLabel)} text="Valor:" />
          <Text style={themed($priceValue)} text={establishment.price} />
        </View>

        <TouchableOpacity style={themed($infoButton)}>
          <Text style={themed($infoButtonText)} text="Observações" />
          <ChevronRight size={16} color="#1E90FF" />
        </TouchableOpacity>
      </View>

      {/* Schedule Calendar Component */}
      <ScheduleCalendar
        onDateSelect={(date) => console.log('Selected date:', date)}
        onTimeSelect={(time) => console.log('Selected time:', time)}
      />
    </View>
  )
}

export const EstablishmentsScreen: FC<EstablishmentsScreenProps> = observer(function EstablishmentsScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { schedulingStore } = useStores()
  const [searchText, setSearchText] = useState("")

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
              <EstablishmentCard key={establishment.id} establishment={establishment} />
            ))
          )}
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

const $establishmentCardContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  borderRadius: 20,
  marginBottom: spacing.lg,
  borderWidth: 1,
  borderColor: "#E8E8E8",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 6,
  overflow: "hidden",
})

const $cardHeaderSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  padding: spacing.lg,
  paddingBottom: spacing.md,
})

const $clinicImageContainer: ThemedStyle<ViewStyle> = () => ({
})

const $clinicImage: ThemedStyle<ImageStyle> = () => ({
  width: '100%',
  height: 200,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
})



const $clinicInfoContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "space-between",
})

const $clinicName: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "700",
  color: "#1A1A1A",
  marginBottom: 4,
  lineHeight: 22,
})

const $clinicAddress: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#666",
  marginBottom: 8,
  lineHeight: 18,
})

const $ratingRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
})

const $ratingContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 2,
})

const $ratingText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#1A1A1A",
  marginLeft: 4,
  fontWeight: "600",
})

const $reviewsText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  color: "#999",
})

const $pricingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  borderTopWidth: 1,
  borderTopColor: "#F0F0F0",
  backgroundColor: "#F8F9FA",
})

const $priceDisplay: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
})

const $priceLabel: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#666",
})

const $priceValue: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
  fontWeight: "800",
  color: "#1E90FF",
})

const $infoButton: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
})

const $infoButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 13,
  fontWeight: "600",
  color: "#1E90FF",
})

const $helpContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.lg,
})

const $helpButton: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#4CAF50",
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
})

const $helpText: ThemedStyle<TextStyle> = () => ({
  flex: 1,
  fontSize: 14,
  fontWeight: "600",
  color: "white",
  marginLeft: 8,
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
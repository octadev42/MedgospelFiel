import { FC, useState, useCallback } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, TextInput, ScrollView, Image, ImageStyle, RefreshControl } from "react-native"
import { ChevronRight, Star, MapPin, FileText, Calendar, Clock, MessageCircle } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import Animated, { FadeInUp, FadeInDown, FadeIn } from "react-native-reanimated"

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

interface EstablishmentData {
  id: number
  name: string
  address: string
  phone: string
  photo: string
  price: string
  availablePrice: string
  rating: number
  reviews: number
  items: Array<{
    name: string
    price: number
    available: boolean
    observation: string
    information: string
    schedules: Array<{
      id: number
      date: string
      startTime: string
      endTime: string
      totalSlots: number
      availableSlots: number
    }>
  }>
}

const EstablishmentCard: FC<{ 
  establishment: EstablishmentData; 
  establishmentRawData: any;
  index: number;
}> = ({ establishment, establishmentRawData, index }) => {
  const { themed } = useAppTheme()

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).springify()}
      style={themed($establishmentCardContainer)}
    >
      <View style={themed($clinicImageContainer)}>
        <Image
          source={establishment.photo ? { uri: establishment.photo } : require("@assets/images/estabelecimentos/hvisao.webp")}
          style={themed($clinicImage)}
        />
      </View>
      
      {/* Header Section */}
      <View style={themed($cardHeaderSection)}>
        <View style={themed($clinicInfoContainer)}>
          <Text style={themed($clinicName)} text={establishment.name} />
          <Text style={themed($clinicAddress)} text={establishment.address} />
          
          {establishment.phone && (
            <Text style={themed($clinicPhone)} text={establishment.phone} />
          )}

          <View style={themed($ratingRow)}>
            <View style={themed($ratingContainer)}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  color={i < Math.floor(establishment.rating) ? "#FFD700" : "#E0E0E0"} 
                  fill={i < Math.floor(establishment.rating) ? "#FFD700" : "transparent"} 
                />
              ))}
              <Text style={themed($ratingText)} text={establishment.rating.toFixed(1)} />
              <Text style={themed($reviewsText)} text={`(${establishment.reviews} avaliações)`} />
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
        horarios={establishmentRawData?.itens?.[0]?.horarios_tabela_preco || []}
      />
    </Animated.View>
  )
}

export const EstablishmentsScreen: FC<EstablishmentsScreenProps> = observer(function EstablishmentsScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { schedulingStore } = useStores()
  const [searchText, setSearchText] = useState("")

  // Use the tabelaPreco hook with proper parameters
  const { 
    loading, 
    error, 
    data: tabelaPrecoData, 
    refetch 
  } = useTabelaPreco({
    app: true,
    fk_especialista: schedulingStore.selectedEspecialist ? parseInt(schedulingStore.selectedEspecialist) : undefined,
    fk_estabelecimento: schedulingStore.selectedEstablishment ? parseInt(schedulingStore.selectedEstablishment) : undefined,
    fk_especialidade: schedulingStore.selectedEspeciality ? parseInt(schedulingStore.selectedEspeciality) : undefined,
  })

  // Transform the data to match our UI needs
  const transformEstablishmentData = useCallback((data: any): EstablishmentData => {
    return {
      id: data.fk_pessoa_juridica,
      name: data.nome_fantasia,
      address: data.endereco,
      phone: data.telefone,
      photo: data.foto,
      price: `R$ ${data.valor_total.toFixed(2)}`,
      availablePrice: `R$ ${data.valor_total_disponivel.toFixed(2)}`,
      rating: 4.75, // Mock rating since it's not in the API response
      reviews: 332, // Mock reviews since it's not in the API response
      items: data.itens?.map((item: any) => ({
        name: item.nome,
        price: item.valor_item,
        available: item.disponivel,
        observation: item.observacao,
        information: item.informacao,
        schedules: item.horarios_tabela_preco?.map((schedule: any) => ({
          id: schedule.id,
          date: schedule.data,
          startTime: schedule.hora_inicial,
          endTime: schedule.hora_final,
          totalSlots: schedule.vagas_total,
          availableSlots: schedule.vagas_disponiveis,
        })) || [],
      })) || [],
    }
  }, [])

  const establishments = tabelaPrecoData ? tabelaPrecoData.map(transformEstablishmentData) : []

  // Filter establishments based on search text
  const filteredEstablishments = establishments.filter(establishment =>
    establishment.name.toLowerCase().includes(searchText.toLowerCase()) ||
    establishment.address.toLowerCase().includes(searchText.toLowerCase())
  )



  const handleBackPress = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleInfoPress = useCallback((establishmentName: string) => {
    showToast.info("Informações", `Mostrando informações de ${establishmentName}`)
    console.log(`Info for: ${establishmentName}`)
  }, [])

  const handleRefresh = useCallback(async () => {
    try {
      await refetch()
      showToast.success("Atualizado", "Lista de estabelecimentos atualizada")
    } catch (error) {
      showToast.error("Erro", "Erro ao atualizar estabelecimentos")
    }
  }, [refetch])

  return (
    <View style={themed($container)}>
      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        safeAreaEdges={["top"]}
        systemBarStyle="light"
        ScrollViewProps={{
          refreshControl: (
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor="#1E90FF"
              colors={["#1E90FF"]}
            />
          ),
        }}
      >
        {/* Header Section */}
        <Animated.View entering={FadeInDown.springify()} style={themed($headerContainer)}>
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
                placeholder="Pesquisar estabelecimentos..."
                placeholderTextColor="#666"
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity style={themed($filterButton)}>
                <Icon icon="more" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Establishments List */}
        <View style={themed($establishmentsContainer)}>
          {loading && !tabelaPrecoData ? (
            <Animated.View entering={FadeIn.springify()} style={themed($loadingContainer)}>
              <Text style={themed($loadingText)} text="Carregando estabelecimentos..." />
            </Animated.View>
          ) : error ? (
            <Animated.View entering={FadeIn.springify()} style={themed($errorContainer)}>
              <Text style={themed($errorText)} text={error} />
              <TouchableOpacity style={themed($retryButton)} onPress={handleRefresh}>
                <Text style={themed($retryButtonText)} text="Tentar novamente" />
              </TouchableOpacity>
            </Animated.View>
          ) : filteredEstablishments.length === 0 ? (
            <Animated.View entering={FadeIn.springify()} style={themed($emptyContainer)}>
              <Text style={themed($emptyText)} text={
                searchText 
                  ? "Nenhum estabelecimento encontrado para sua pesquisa" 
                  : "Nenhum estabelecimento disponível no momento"
              } />
            </Animated.View>
                      ) : (
            filteredEstablishments.map((establishment, index) => {
              const rawData = tabelaPrecoData?.find(data => data.fk_pessoa_juridica === establishment.id)
              return (
                <EstablishmentCard 
                  key={establishment.id} 
                  establishment={establishment} 
                  establishmentRawData={rawData}
                  index={index} 
                />
              )
            })
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

const $clinicPhone: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#666",
  marginTop: 4,
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

const $availablePriceValue: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#4CAF50",
  marginLeft: 8,
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

const $retryButton: ThemedStyle<ViewStyle> = () => ({
  marginTop: 10,
  paddingVertical: 8,
  paddingHorizontal: 15,
  backgroundColor: "#1E90FF",
  borderRadius: 8,
})

const $retryButtonText: ThemedStyle<TextStyle> = () => ({
  color: "white",
  fontSize: 14,
  fontWeight: "600",
})
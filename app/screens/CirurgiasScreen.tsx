import { FC, useState, useEffect, useRef } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity, Image, TextInput, TextStyle, ImageStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { ArrowLeft, Search, MessageCircle } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useCirurgias } from "@/hooks/useCirurgias"
import { openLinkInBrowser } from "@/utils/openLinkInBrowser"



export const CirurgiasScreen: FC = observer(function CirurgiasScreen() {
  const { themed, theme: { colors } } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { cirurgias, isLoading, error, getCirurgias, searchCirurgias } = useCirurgias()
  const [searchTerm, setSearchTerm] = useState("")
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleBackPress = () => {
    navigation.goBack()
  }

  // Load cirurgias on component mount
  useEffect(() => {
    getCirurgias()
  }, [getCirurgias])

  const handleSearch = (text: string) => {
    setSearchTerm(text)
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchCirurgias(text)
    }, 500) // 500ms delay
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const formatPrice = (price: number) => {
    return `A partir de: R$ ${price.toFixed(2).replace('.', ',')}`
  }

  const openWhatsApp = (message?: string) => {
    const phoneNumber = "5511999999999" // Mocked WhatsApp number
    const defaultMessage = "Olá! Gostaria de solicitar um orçamento para cirurgia."
    const whatsappMessage = message || defaultMessage
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`
    openLinkInBrowser(whatsappUrl)
  }

  return (
    <View style={themed($container)}>
      <Header 
        title="Cirurgias" 
        titleStyle={{ color: "white" }} 
        leftIcon="back" 
        leftIconColor="white" 
        onLeftPress={handleBackPress}
        backgroundColor={colors.palette.secondary500}
      />

      {/* Search Bar */}
      <View style={themed($searchContainer)}>
        <View style={themed($searchBar)}>
          <Search size={20} color={searchTerm ? "#1E40AF" : "#9CA3AF"} style={themed($searchIcon)} />
          <TextInput
            style={themed($searchInput)}
            placeholder="Pesquisar cirurgias"
            placeholderTextColor="#9CA3AF"
            value={searchTerm}
            onChangeText={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity 
              style={themed($clearButton)} 
              onPress={() => {
                setSearchTerm("")
                getCirurgias()
              }}
            >
              <Text style={themed($clearButtonText)} text="✕" />
            </TouchableOpacity>
          )}
        </View>
        {searchTerm.length > 0 && (
          <Text style={themed($searchStatus)} text={`Pesquisando por: "${searchTerm}"`} />
        )}
      </View>

      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        systemBarStyle="light"
      >
        {/* Promotional Banner */}
        <View style={themed($promoBanner)}>
          <View style={themed($promoContent)}>
            <Text style={themed($promoTitle)} text="NÃO ENCONTROU SUA CIRURGIA, FALE CONOSCO PELO WHATSAPP" />
            <TouchableOpacity style={themed($whatsappButton)} onPress={() => openWhatsApp()}>
              <MessageCircle size={16} color="white" />
              <Text style={themed($whatsappButtonText)} text="Falar com atendente" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={themed($loadingContainer)}>
            <Text style={themed($loadingText)} text="Carregando cirurgias..." />
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={themed($errorContainer)}>
            <Text style={themed($errorText)} text={error} />
            <TouchableOpacity style={themed($retryButton)} onPress={() => getCirurgias()}>
              <Text style={themed($retryButtonText)} text="Tentar novamente" />
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && !error && cirurgias.length === 0 && (
          <View style={themed($emptyContainer)}>
            <Text style={themed($emptyText)} text="Nenhuma cirurgia encontrada" />
          </View>
        )}

        {/* Procedures List */}
        {!isLoading && !error && cirurgias.length > 0 && (
          <View style={themed($proceduresContainer)}>
            {cirurgias.map((cirurgia, index) => (
              <View key={`${cirurgia.descricao}-${index}`} style={themed($procedureCard)}>
                <View style={themed($procedureInfo)}>
                  <Text style={themed($procedureTitle)} text={cirurgia.descricao} />
                {/*   <Text style={themed($procedureClinic)} text={cirurgia.pessoa_juridica?.[0]?.nome_fantasia || "Clínica não informada"} />
                  <Text style={themed($procedureAddress)} text={cirurgia.pessoa_juridica?.[0]?.endereco || "Endereço não informado"} /> */}
                  <TouchableOpacity 
                    style={themed($procedureButton)}
                    onPress={() => openWhatsApp(`Olá! Gostaria de solicitar um orçamento para: ${cirurgia.descricao}`)}
                  >
                    <Text style={themed($procedureButtonText)} text="Solicitar orçamento" />
                  </TouchableOpacity>
                </View>
                <View style={themed($procedurePriceContainer)}>
                  <Text style={themed($procedurePrice)} text={formatPrice(cirurgia.valor)} />
                </View>
              </View>
            ))}
          </View>
        )}
      </Screen>
    </View>
  )
})

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $searchContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  paddingHorizontal: 16,
  paddingBottom: 16,
  backgroundColor: colors.palette.secondary500,
})

const $searchBar: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $searchIcon: ThemedStyle<ViewStyle> = () => ({
  marginRight: 12,
})

const $searchInput: ThemedStyle<TextStyle> = () => ({
  flex: 1,
  fontSize: 16,
  color: "#1F2937",
})

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  paddingBottom: 100,
})

const $promoBanner: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#DBEAFE",
  margin: 16,
  borderRadius: 16,
  padding: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $promoContent: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $promoTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#1E40AF",
  marginBottom: 12,
  lineHeight: 22,
})

const $whatsappButton: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#1E40AF",
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  alignSelf: "flex-start",
})

const $whatsappButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "500",
  color: "white",
  marginLeft: 6,
})

const $promoImage: ThemedStyle<ImageStyle> = () => ({
  width: 80,
  height: 80,
  marginLeft: 16,
})

const $proceduresContainer: ThemedStyle<ViewStyle> = () => ({
  paddingHorizontal: 16,
})

const $procedureCard: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  backgroundColor: "white",
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $procedureInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $procedureTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#1F2937",
  marginBottom: 4,
})

const $procedureClinic: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "500",
  color: "#6B7280",
  marginBottom: 2,
})

const $procedureAddress: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  color: "#9CA3AF",
  marginBottom: 12,
})

const $procedureButton: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#1E40AF",
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  marginTop: 10,
  alignSelf: "flex-start",
})

const $procedureButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "500",
  color: "white",
})

const $procedurePriceContainer: ThemedStyle<ViewStyle> = () => ({
  justifyContent: "center",
  alignItems: "flex-end",
  marginLeft: 16,
})

const $procedurePrice: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#10B981",
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  paddingVertical: 32,
})

const $loadingText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#666",
})

const $errorContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  paddingVertical: 32,
})

const $errorText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#FF6B6B",
  textAlign: "center",
  marginBottom: 16,
})

const $retryButton: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#1E90FF",
  paddingHorizontal: 24,
  paddingVertical: 8,
  borderRadius: 8,
})

const $retryButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "white",
})

const $emptyContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  paddingVertical: 32,
})

const $emptyText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#666",
  textAlign: "center",
})

const $clearButton: ThemedStyle<ViewStyle> = () => ({
  padding: 8,
  marginLeft: 8,
})

const $clearButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#9CA3AF",
  fontWeight: "bold",
})

const $searchStatus: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  color: "#1E40AF",
  marginTop: 8,
  marginLeft: 4,
  fontStyle: "italic",
})
import { FC } from "react"
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

// Mocked data for procedures
const mockProcedures = [
  {
    id: 1,
    title: "Absesso de Pálpebra",
    clinic: "Clinica Batista",
    address: "R. Gabriel Ferreira, 630/640 - Centro",
    price: "R$ 1000,00",
  },
  {
    id: 2,
    title: "Biopsia de Conjuntiva",
    clinic: "Clinica Batista",
    address: "R. Gabriel Ferreira, 630/640 - Centro",
    price: "R$ 1000,00",
  },
  {
    id: 3,
    title: "Artroscopia Simples",
    clinic: "Clinica Batista",
    address: "R. Gabriel Ferreira, 630/640 - Centro",
    price: "R$ 1000,00",
  },
  {
    id: 4,
    title: "Cirurgia de Catarata",
    clinic: "Clinica Batista",
    address: "R. Gabriel Ferreira, 630/640 - Centro",
    price: "R$ 1500,00",
  },
  {
    id: 5,
    title: "Retinopexia",
    clinic: "Clinica Batista",
    address: "R. Gabriel Ferreira, 630/640 - Centro",
    price: "R$ 1200,00",
  },
]

export const CirurgiasScreen: FC = observer(function CirurgiasScreen() {
  const { themed, theme: { colors } } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  const handleBackPress = () => {
    navigation.goBack()
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
          <Search size={20} color="#9CA3AF" style={themed($searchIcon)} />
          <TextInput
            style={themed($searchInput)}
            placeholder="Pesquisar"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        systemBarStyle="light"
      >
        {/* Promotional Banner */}
        <View style={themed($promoBanner)}>
          <View style={themed($promoContent)}>
            <Text style={themed($promoTitle)} text="Agende agora mesmo pelo WhatsApp!" />
           {/*  <TouchableOpacity style={themed($whatsappButton)}>
              <MessageCircle size={16} color="white" />
              <Text style={themed($whatsappButtonText)} text="Falar com atendente" />
            </TouchableOpacity> */}
          </View>
         
        </View>

        {/* Procedures List */}
        <View style={themed($proceduresContainer)}>
          {mockProcedures.map((procedure) => (
            <View key={procedure.id} style={themed($procedureCard)}>
              <View style={themed($procedureInfo)}>
                <Text style={themed($procedureTitle)} text={procedure.title} />
                <Text style={themed($procedureClinic)} text={procedure.clinic} />
                <Text style={themed($procedureAddress)} text={procedure.address} />
                <TouchableOpacity style={themed($procedureButton)}>
                  <Text style={themed($procedureButtonText)} text="Falar com atendente" />
                </TouchableOpacity>
              </View>
              <View style={themed($procedurePriceContainer)}>
                <Text style={themed($procedurePrice)} text={procedure.price} />
              </View>
            </View>
          ))}
        </View>
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
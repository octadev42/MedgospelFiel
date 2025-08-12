import { FC, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { BottomNavigation } from "@/components/BottomNavigation"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackScreenProps, AppStackParamList } from "@/navigators/AppNavigator"
import { WColorIcon } from "@/components/WColorIcon"

type HomeScreenProps = AppStackScreenProps<"Home">

export const HomeScreen: FC<HomeScreenProps> = function HomeScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const [activeTab, setActiveTab] = useState<"home" | "wallet" | "cart" | "heart" | "profile">("home")

  const serviceItems = [
    { icon: "homegrid_consultas", title: "Consultas", onPress: () => navigation.navigate("EscolherFluxoConsulta") },
    { icon: "homegrid_exames_imagem", title: "Exames de Imagem", onPress: () => {} },
    { icon: "homegrid_exames_laboratoriais", title: "Exames Laboratoriais", onPress: () => {} },
    { icon: "homegrid_procedimentos", title: "Procedimentos", onPress: () => {} },
    { icon: "homegrid_cirurgias", title: "Cirurgias", onPress: () => {} },
    { icon: "homegrid_nossos_precos", title: "Nossos Preços", onPress: () => {} },
  ]

  const specialtyItems = [
    { icon: "especialidades_neurologia", title: "Neurologia", onPress: () => {} },
    { icon: "especialidades_gastroenterologia", title: "Gastro-enterologia", onPress: () => {} },
    { icon: "especialidades_pneumologia", title: "Pneumologia", onPress: () => {} },
    { icon: "more", title: "Mais", onPress: () => {} },
  ]

  const hospitalCards = [
    { title: "HVTCR - Hospital da Visão Dr. Thiago Castro Ramalho", image: require("@assets/images/estabelecimentos/hvisao.webp") },
    { title: "Clinica Batista", image: require("@assets/images/estabelecimentos/clinica-batista.webp") },
  ]

  const handleViewAllSpecialties = () => {
    navigation.navigate("Especialidade")
  }

  const handleTabPress = (tab: "home" | "wallet" | "cart" | "heart" | "profile") => {
    if (tab === "profile") {
      navigation.navigate("Profile")
    } else if (tab === "home") {
      navigation.navigate("Home")
    } else {
      setActiveTab(tab)
    }
  }

  return (
    <View style={themed($container)}>
      <Screen 
        preset="scroll" 
        contentContainerStyle={themed($screenContentContainer)}
        safeAreaEdges={["top"]}
        systemBarStyle="light"
      >
        {/* Main Blue Container */}
        <View style={themed($mainBlueContainer)}>
          {/* Header Section */}
          <View style={themed($headerContainer)}>
            <View style={themed($headerTop)}>
              <View style={themed($profileSection)}>
                <View style={themed($profileImage)} />
                <View style={themed($profileTextContainer)}>
                  <Text style={themed($welcomeText)} text="Seja bem-vinda, Maria!" />
                  <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Text style={themed($profileLink)} text="Acessar meu perfil" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={themed($headerActions)}>
                <TouchableOpacity style={themed($actionButton)}>
                  <Icon icon="view" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={themed($actionButton)}>
                  <View style={themed($notificationContainer)}>
                    <Icon icon="bell" size={24} color="white" />
                    <View style={themed($notificationBadge)}>
                      <Text style={themed($notificationText)} text="2" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Service Grid */}
          <View style={themed($serviceGridContainer)}>
            <View style={themed($serviceGrid)}>
              {serviceItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={themed($serviceItem)}
                  onPress={item.onPress}
                >
                  <View style={themed($serviceIconContainer)}>
                    <WColorIcon icon={item.icon as any} size={32} color="#20B2AA" />
                  </View>
                  <Text style={themed($serviceTitle)} text={item.title} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Especialidades Section */}
        <View style={themed($especialidadesContainer)}>
          <View style={themed($sectionHeader)}>
            <Text style={themed($sectionTitle)} text="Especialidades mais acessadas" />
            <TouchableOpacity onPress={handleViewAllSpecialties}>
              <Text style={themed($viewAllLink)} text="Todos >" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={themed($especialidadesScrollContainer)}
          >
            {specialtyItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={themed($especialidadeCard)}
                onPress={item.onPress}
              >
                <View style={themed($especialidadeIconContainer)}>
                  <WColorIcon icon={item.icon as any} size={32} color="#20B2AA" />
                </View>
                <Text style={themed($especialidadeTitle)} text={item.title} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Hospital Section */}
        <View style={themed($topHospitalContainer)}>
          <View style={themed($sectionHeader)}>
            <Text style={themed($sectionTitle)} text="Hospital" />
            <TouchableOpacity>
              <Text style={themed($viewAllLink)} text="Todos >" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={themed($hospitalScrollContainer)}
          >
            {hospitalCards.map((hospital, index) => (
              <TouchableOpacity key={index} style={themed($hospitalCard)}>
                <Image source={hospital.image} style={themed($hospitalImagePlaceholder)} />
                <View style={themed($hospitalCardContent)}>
                  <Text style={themed($hospitalTitle)} text={hospital.title} />
                  <View style={themed($hospitalRatingRow)}>
                    <View style={themed($ratingContainer)}>
                      <Icon icon="check" size={16} color="#FFD700" />
                      <Text style={themed($ratingText)} text="5.0" />
                    </View>
                    <Text style={themed($reviewsText)} text="(332 avaliações)" />
                  </View>
                  <TouchableOpacity>
                    <Text style={themed($moreInfoLink)} text="Mais Info →" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
}

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
  paddingBottom: 100, // Increased padding to account for fixed bottom navigation
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

const $mainBlueContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#1E90FF",
  marginTop: -50, // Extend into status bar area
  paddingTop: 70, // Add extra padding to account for status bar
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingBottom: spacing.lg,
})

const $headerTop: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
})

const $profileSection: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
})

const $profileImage: ThemedStyle<ViewStyle> = () => ({
  width: 8,
  height: 50,
  borderRadius: 25,
  backgroundColor: "transparent",
  marginRight: 12,
})

const $profileTextContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $welcomeText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "700",
  color: "white",
  marginBottom: 4,
})

const $profileLink: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#87CEEB",
  textDecorationLine: "underline",
})

const $headerActions: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 16,
})

const $actionButton: ThemedStyle<ViewStyle> = () => ({
  padding: 8,
})

const $notificationContainer: ThemedStyle<ViewStyle> = () => ({
  position: "relative",
})

const $notificationBadge: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: -4,
  right: -4,
  backgroundColor: "#FF4444",
  borderRadius: 10,
  width: 20,
  height: 20,
  justifyContent: "center",
  alignItems: "center",
})

const $notificationText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "600",
  color: "white",
})

const $serviceGridContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.lg,
})

const $serviceGrid: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: 0,
  backgroundColor: "white",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#E0E0E0",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 8,
  overflow: "hidden",
})

const $serviceItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "33.33%",
  aspectRatio: 1,
  backgroundColor: "transparent",
  borderWidth: 0.5,
  borderColor: "#E0E0E0",
  padding: spacing.sm,
  justifyContent: "center",
  alignItems: "center",
})

const $serviceIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $serviceTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "500",
  color: "#333",
  textAlign: "center",
  lineHeight: 16,
}) 

const $topHospitalContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
  paddingBottom: spacing.xl,
  backgroundColor: "white",
})

const $sectionHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.md,
})

const $sectionTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "700",
  color: "#333",
})

const $viewAllLink: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#1E90FF",
  fontWeight: "500",
})

const $hospitalCardsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $hospitalCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 280,
  backgroundColor: "white",
  borderRadius: 12,
  padding: spacing.md,
  marginRight: spacing.md,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $hospitalImagePlaceholder: ThemedStyle<ImageStyle> = () => ({
  width: "100%",
  height: 120,
  backgroundColor: "#E0E0E0",
  borderRadius: 8,
  marginBottom: 12,
  justifyContent: "center",
  alignItems: "center",
})

const $hospitalCardContent: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $hospitalTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
  marginBottom: 8,
})

const $hospitalIconsRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $doctorIconsContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $doctorIcon: ThemedStyle<ViewStyle> = () => ({
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: "#E0E0E0",
  marginRight: 4,
})

const $plusIcon: ThemedStyle<ViewStyle> = () => ({
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: "#1E90FF",
  justifyContent: "center",
  alignItems: "center",
  marginLeft: 4,
})

const $plusText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "white",
})

const $actionIconsContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  gap: 8,
})

const $actionIcon: ThemedStyle<ViewStyle> = () => ({
  padding: 4,
}) 

const $especialidadesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xl,
  paddingBottom: spacing.lg,
  backgroundColor: "#F8F9FA",
})

const $especialidadesScrollContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingRight: spacing.lg,
})

const $especialidadeCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 100,
  height: 110,
  backgroundColor: "white",
  borderRadius: 12,
  marginRight: spacing.md,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.sm,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $especialidadeIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $especialidadeTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 11,
  fontWeight: "500",
  color: "#333",
  textAlign: "center",
  lineHeight: 14,
  flexWrap: "wrap",
}) 

const $hospitalScrollContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingRight: spacing.lg,
})

const $hospitalRatingRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 8,
})

const $ratingContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  marginRight: 8,
})

const $ratingText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "#333",
  marginLeft: 4,
})

const $reviewsText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  color: "#666",
})

const $moreInfoLink: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  color: "#1E90FF",
  fontWeight: "500",
}) 
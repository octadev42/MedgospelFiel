import { FC, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, TouchableOpacity } from "react-native"

import { BottomNavigation } from "@/components/BottomNavigation"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export const HomeScreen: FC = function HomeScreen() {
  const { themed } = useAppTheme()
  const [activeTab, setActiveTab] = useState<"home" | "wallet" | "cart" | "heart" | "profile">("home")

  const serviceItems = [
    { icon: "check", title: "Meus Agendamentos", onPress: () => {} },
    { icon: "settings", title: "Exames e Resultados", onPress: () => {} },
    { icon: "view", title: "Prevenção e Check-up", onPress: () => {} },
    { icon: "lock", title: "Procedimentos", onPress: () => {} },
    { icon: "menu", title: "Cirurgias", onPress: () => {} },
    { icon: "more", title: "Clínicas Parceiras", onPress: () => {} },
  ]

  const hospitalCards = [
    { title: "Clinica Batista", image: null },
    { title: "Hospital São Lucas", image: null },
  ]

  return (
    <Screen 
      preset="fixed" 
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
                <TouchableOpacity>
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
                  <Icon icon={item.icon as any} size={32} color="#20B2AA" />
                </View>
                <Text style={themed($serviceTitle)} text={item.title} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Top Hospital Section */}
      <View style={themed($topHospitalContainer)}>
        <View style={themed($sectionHeader)}>
          <Text style={themed($sectionTitle)} text="Top Hospital" />
          <TouchableOpacity>
            <Text style={themed($viewAllLink)} text="Todos >" />
          </TouchableOpacity>
        </View>
        
        <View style={themed($hospitalCardsContainer)}>
          {hospitalCards.map((hospital, index) => (
            <TouchableOpacity key={index} style={themed($hospitalCard)}>
              <View style={themed($hospitalImagePlaceholder)} />
              <View style={themed($hospitalCardContent)}>
                <Text style={themed($hospitalTitle)} text={hospital.title} />
                <View style={themed($hospitalIconsRow)}>
                  <View style={themed($doctorIconsContainer)}>
                    {[1, 2, 3, 4].map((_, i) => (
                      <View key={i} style={themed($doctorIcon)} />
                    ))}
                    <TouchableOpacity style={themed($plusIcon)}>
                      <Text style={themed($plusText)} text="+" />
                    </TouchableOpacity>
                  </View>
                  <View style={themed($actionIconsContainer)}>
                    <TouchableOpacity style={themed($actionIcon)}>
                      <Icon icon="check" size={16} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={themed($actionIcon)}>
                      <Icon icon="more" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Bottom Navigation */}
      <BottomNavigation
        active={activeTab}
        onTabPress={setActiveTab}
      />
    </Screen>
  )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "flex-start",
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
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: "white",
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
  paddingTop: spacing.xl,
  paddingBottom: spacing.lg,
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
  backgroundColor: "white",
  borderRadius: 12,
  padding: spacing.md,
  flexDirection: "row",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $hospitalImagePlaceholder: ThemedStyle<ViewStyle> = () => ({
  width: 80,
  height: 80,
  backgroundColor: "#E0E0E0",
  borderRadius: 8,
  marginRight: 12,
})

const $hospitalCardContent: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "space-between",
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
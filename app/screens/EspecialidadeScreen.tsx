import { FC, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { BottomNavigation } from "@/components/BottomNavigation"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"

type EspecialidadeScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Especialidade">
}

export const EspecialidadeScreen: FC<EspecialidadeScreenProps> = function EspecialidadeScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const [searchText, setSearchText] = useState("")
  const [activeTab, setActiveTab] = useState<"home" | "wallet" | "cart" | "heart" | "profile">("home")

  const allSpecialties = [
    { icon: "check", title: "Neurologia", onPress: () => {} },
    { icon: "settings", title: "Gastro-enterologia", onPress: () => {} },
    { icon: "view", title: "Pneumologia", onPress: () => {} },
    { icon: "lock", title: "Radiologia", onPress: () => {} },
    { icon: "menu", title: "Cirurgia Bucomaxilofacial", onPress: () => {} },
    { icon: "more", title: "Ortopedia", onPress: () => {} },
    { icon: "check", title: "Reumatologia", onPress: () => {} },
    { icon: "settings", title: "Oftalmologia", onPress: () => {} },
    { icon: "view", title: "Cardiologia", onPress: () => {} },
    { icon: "lock", title: "Endocrinologia", onPress: () => {} },
    { icon: "menu", title: "Otorrino-laringologia", onPress: () => {} },
    { icon: "more", title: "Clínico Geral", onPress: () => {} },
    { icon: "check", title: "Dermatologia", onPress: () => {} },
    { icon: "settings", title: "Ginecologia", onPress: () => {} },
    { icon: "view", title: "Pediatria", onPress: () => {} },
    { icon: "lock", title: "Urologia", onPress: () => {} },
    { icon: "menu", title: "Psiquiatria", onPress: () => {} },
    { icon: "more", title: "Oncologia", onPress: () => {} },
    { icon: "check", title: "Hematologia", onPress: () => {} },
    { icon: "settings", title: "Nefrologia", onPress: () => {} },
    { icon: "view", title: "Gastroenterologia", onPress: () => {} },
    { icon: "lock", title: "Hepatologia", onPress: () => {} },
  ]

  const filteredSpecialties = allSpecialties.filter(specialty =>
    specialty.title.toLowerCase().includes(searchText.toLowerCase())
  )

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
            <Text style={themed($headerTitle)} text="Especialidade" />
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

        {/* Specialties Grid */}
        <View style={themed($specialtiesContainer)}>
          <View style={themed($specialtiesGrid)}>
            {filteredSpecialties.map((specialty, index) => (
              <TouchableOpacity
                key={index}
                style={themed($specialtyCard)}
                onPress={specialty.onPress}
              >
                <View style={themed($specialtyIconContainer)}>
                  <Icon icon={specialty.icon as any} size={32} color="#20B2AA" />
                </View>
                <Text style={themed($specialtyTitle)} text={specialty.title} />
              </TouchableOpacity>
            ))}
          </View>
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

const $specialtiesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
  paddingBottom: spacing.xl,
})

const $specialtiesGrid: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  borderRadius: 16,
  padding: spacing.md,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  gap: spacing.sm,
})

const $specialtyCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "30%",
  aspectRatio: 1,
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: "#E0E0E0",
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.xs,
})

const $specialtyIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $specialtyTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 10,
  fontWeight: "500",
  color: "#333",
  textAlign: "center",
  lineHeight: 12,
  flexWrap: "wrap",
}) 
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

type EspecialistasScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Especialistas">
}

export const EspecialistasScreen: FC<EspecialistasScreenProps> = function EspecialistasScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const [searchText, setSearchText] = useState("")
  const [activeTab, setActiveTab] = useState<"home" | "wallet" | "cart" | "heart" | "profile">("home")

  const specialists = [
    {
      id: 1,
      name: "Dr. Jenny Wilson",
      specialty: "Neurologist",
      clinic: "Vcare Clinic",
      rating: 5.0,
      reviews: 332,
      onPress: () => {},
    },
    {
      id: 2,
      name: "Dr. Maria Santos",
      specialty: "Cardiologist",
      clinic: "Heart Care Center",
      rating: 4.9,
      reviews: 287,
      onPress: () => {},
    },
    {
      id: 3,
      name: "Dr. Carlos Oliveira",
      specialty: "Dermatologist",
      clinic: "Skin Health Clinic",
      rating: 4.8,
      reviews: 156,
      onPress: () => {},
    },
    {
      id: 4,
      name: "Dr. Ana Costa",
      specialty: "Pediatrician",
      clinic: "Children's Medical Center",
      rating: 5.0,
      reviews: 421,
      onPress: () => {},
    },
    {
      id: 5,
      name: "Dr. Roberto Silva",
      specialty: "Orthopedist",
      clinic: "Bone & Joint Clinic",
      rating: 4.7,
      reviews: 198,
      onPress: () => {},
    },
    {
      id: 6,
      name: "Dr. Fernanda Lima",
      specialty: "Gynecologist",
      clinic: "Women's Health Center",
      rating: 4.9,
      reviews: 312,
      onPress: () => {},
    },
    {
      id: 7,
      name: "Dr. Paulo Mendes",
      specialty: "Psychiatrist",
      clinic: "Mental Health Clinic",
      rating: 4.6,
      reviews: 134,
      onPress: () => {},
    },
    {
      id: 8,
      name: "Dr. Lucia Ferreira",
      specialty: "Ophthalmologist",
      clinic: "Eye Care Center",
      rating: 4.8,
      reviews: 245,
      onPress: () => {},
    },
  ]

  const filteredSpecialists = specialists.filter(specialist =>
    specialist.name.toLowerCase().includes(searchText.toLowerCase()) ||
    specialist.specialty.toLowerCase().includes(searchText.toLowerCase()) ||
    specialist.clinic.toLowerCase().includes(searchText.toLowerCase())
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
            <Text style={themed($headerTitle)} text="Especialistas" />
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

        {/* Specialists List */}
        <View style={themed($specialistsContainer)}>
          {filteredSpecialists.map((specialist) => (
            <TouchableOpacity
              key={specialist.id}
              style={themed($specialistCard)}
              onPress={specialist.onPress}
            >
              <View style={themed($profilePlaceholder)} />
              <View style={themed($specialistInfo)}>
                <Text style={themed($specialistName)} text={specialist.name} />
                <Text style={themed($specialistDetails)} text={`${specialist.specialty} | ${specialist.clinic}`} />
                <View style={themed($ratingContainer)}>
                  <Icon icon="check" size={16} color="#FFD700" />
                  <Text style={themed($ratingText)} text={`${specialist.rating} (${specialist.reviews} reviews)`} />
                </View>
              </View>
              <TouchableOpacity style={themed($optionsButton)}>
                <Icon icon="more" size={20} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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

const $profilePlaceholder: ThemedStyle<ViewStyle> = () => ({
  width: 60,
  height: 60,
  backgroundColor: "#E0E0E0",
  borderRadius: 8,
  marginRight: 12,
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
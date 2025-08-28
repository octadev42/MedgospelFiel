import { FC, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, TextInput, ScrollView, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"

import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { SearchBar } from "@/components/SearchBar"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useStores } from "@/models"
import { Header } from "@/components/Header"
import { colors } from "@/theme/colors"

type EspecialidadeScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Especialidade">
}

export const EspecialidadeScreen: FC<EspecialidadeScreenProps> = observer(function EspecialidadeScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { schedulingStore } = useStores()
  const [searchText, setSearchText] = useState("")

  // Specialty mapping with IDs (these should match your API)
  const specialtyMapping = {
    "Oftalmologia": 1,
    "Cardiologia": 2,
    "Ortopedia": 3,
    "Ginecologia": 4,
    "Endocrinologia": 5,
    "Gastroenterologia": 6,
    "Neurologia Clínica": 7,
    "Dermatologia": 8,
    "Angiologia": 9,
    "Urologia": 10,
    "Otorrinolaringologia": 11,
    "Clínico Geral": 12,
  }

  const handleSpecialtyPress = (specialtyTitle: string) => {
    const specialtyId = specialtyMapping[specialtyTitle as keyof typeof specialtyMapping]
    console.log('EspecialidadeScreen Debug:', {
      specialtyTitle,
      specialtyId,
      mapping: specialtyMapping
    })
    schedulingStore.setEspeciality(specialtyTitle, specialtyId)
    console.log('After setEspeciality:', {
      selectedEspeciality: schedulingStore.selectedEspeciality,
      selectedEspecialityId: schedulingStore.selectedEspecialityId
    })
    navigation.navigate("Especialistas")
  }

  const allSpecialties = [
    {
      icon: require("@assets/icons/especialidades/icon_oftalmo.png"),
      title: "Oftalmologia",
      onPress: () => handleSpecialtyPress("Oftalmologia")
    },
    {
      icon: require("@assets/icons/especialidades/Heart Rate.png"),
      title: "Cardiologia",
      onPress: () => handleSpecialtyPress("Cardiologia")
    },
    {
      icon: require("@assets/icons/especialidades/Bone.png"),
      title: "Ortopedia",
      onPress: () => handleSpecialtyPress("Ortopedia")
    },
    {
      icon: require("@assets/icons/especialidades/icon_gineco.png"),
      title: "Ginecologia",
      onPress: () => handleSpecialtyPress("Ginecologia")
    },
    {
      icon: require("@assets/icons/especialidades/DNA.png"),
      title: "Endocrinologia",
      onPress: () => handleSpecialtyPress("Endocrinologia")
    },
    {
      icon: require("@assets/icons/especialidades/icon_gastro.png"),
      title: "Gastroenterologia",
      onPress: () => handleSpecialtyPress("Gastroenterologia")
    },
    {
      icon: require("@assets/icons/especialidades/Brain.png"),
      title: "Neurologia Clínica",
      onPress: () => handleSpecialtyPress("Neurologia Clínica")
    },
    {
      icon: require("@assets/icons/especialidades/icon_dermato.png"),
      title: "Dermatologia",
      onPress: () => handleSpecialtyPress("Dermatologia")
    },
    {
      icon: require("@assets/icons/especialidades/icon_angio.png"),
      title: "Angiologia",
      onPress: () => handleSpecialtyPress("Angiologia")
    },
    {
      icon: require("@assets/icons/especialidades/icon_uro.png"),
      title: "Urologia",
      onPress: () => handleSpecialtyPress("Urologia")
    },
    {
      icon: require("@assets/icons/especialidades/icon_otorrino.png"),
      title: "Otorrinolaringologia",
      onPress: () => handleSpecialtyPress("Otorrinolaringologia")
    },
    {
      icon: require("@assets/icons/especialidades/Body.png"),
      title: "Clínico Geral",
      onPress: () => handleSpecialtyPress("Clínico Geral")
    },
  ]

  const filteredSpecialties = allSpecialties.filter(specialty =>
    specialty.title.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleBackPress = () => {
    navigation.goBack()
  }

  return (
    <View style={themed($container)}>
      <Header 
        title="Especialidade" 
        titleStyle={{ color: "white" }} 
        leftIcon="back" 
        leftIconColor="white" 
        onLeftPress={handleBackPress} 
      />
      
      {/* Search Bar */}
      <View style={themed($searchBarContainer)}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Pesquisar"
          containerStyle={{ backgroundColor: colors.palette.secondary500 }}
        />
      </View>

      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        systemBarStyle="light"
      >
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
                  <Image source={specialty.icon} style={themed($specialtyIcon)} />
                </View>
                <Text style={themed($specialtyTitle)} text={specialty.title} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Screen>
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

const $searchBarContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#1E90FF",
})

const $specialtiesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
  paddingBottom: spacing.xl,
})

const $specialtiesGrid: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: spacing.md,
})

const $specialtyCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "30%",
  aspectRatio: 1,
  backgroundColor: "white",
  borderWidth: 1,
  borderColor: "#E0E0E0",
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.xs,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
})

const $specialtyIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $specialtyIcon: ThemedStyle<any> = () => ({
  width: 40,
  height: 40,
  resizeMode: "contain",
})

const $specialtyTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 10,
  fontWeight: "500",
  color: "#333",
  textAlign: "center",
  lineHeight: 12,
  flexWrap: "wrap",
}) 
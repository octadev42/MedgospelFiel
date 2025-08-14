import { FC, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, TextInput, ScrollView, Image } from "react-native"
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

type EspecialidadeScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Especialidade">
}

export const EspecialidadeScreen: FC<EspecialidadeScreenProps> = observer(function EspecialidadeScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { schedulingStore } = useStores()
  const [searchText, setSearchText] = useState("")

  const handleSpecialtyPress = (specialtyTitle: string) => {
    schedulingStore.setEspeciality(specialtyTitle)
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
                  <Image source={specialty.icon} style={themed($specialtyIcon)} />
                </View>
                <Text style={themed($specialtyTitle)} text={specialty.title} />
              </TouchableOpacity>
            ))}
          </View>
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
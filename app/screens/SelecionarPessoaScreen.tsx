import { FC, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { User, Users, Crown, MoreHorizontal } from "lucide-react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { SearchBar } from "@/components/SearchBar"
import { Header } from "@/components/Header"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useStores } from "@/models"
import { colors } from "@/theme/colors"

type SelecionarPessoaScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "SelecionarPessoa">
}

interface Patient {
  id: string
  name: string
  cpf: string
  gender: string
  birthDate: string
  isHolder: boolean
}

export const SelecionarPessoaScreen: FC<SelecionarPessoaScreenProps> = observer(function SelecionarPessoaScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { schedulingStore } = useStores()
  const [searchText, setSearchText] = useState("")

  // Mock data for patients
  const patients: Patient[] = [
    {
      id: "1",
      name: "Nome do Titular",
      cpf: "123.456.789-00",
      gender: "MASCULINO",
      birthDate: "15/03/1985",
      isHolder: true
    },
    {
      id: "2",
      name: "Dep. 1",
      cpf: "987.654.321-00",
      gender: "MASCULINO",
      birthDate: "22/07/1990",
      isHolder: false
    },
    {
      id: "3",
      name: "Dep. 2",
      cpf: "456.789.123-00",
      gender: "FEMININO",
      birthDate: "10/12/1992",
      isHolder: false
    },
    {
      id: "4",
      name: "Dep. 3",
      cpf: "789.123.456-00",
      gender: "MASCULINO",
      birthDate: "05/09/1988",
      isHolder: false
    }
  ]

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const handlePatientPress = (patient: Patient) => {
    // TODO: Add setSelectedPatient method to schedulingStore
    console.log("Selected patient:", patient)
    navigation.navigate("Carrinho")
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  const PatientCard: FC<{ patient: Patient }> = ({ patient }) => (
    <TouchableOpacity
      style={themed($patientCard)}
      onPress={() => handlePatientPress(patient)}
    >
      <View style={themed($patientIconContainer)}>
        <View style={themed(patient.isHolder ? $holderIcon : $dependentIcon)}>
          {patient.isHolder ? (
            <User size={24} color="white" />
          ) : (
            <Users size={24} color="white" />
          )}
        </View>
      </View>
      
      <View style={themed($patientInfo)}>
        <Text style={themed($patientName)} text={patient.name} />
        <Text style={themed($patientDetail)} text={`CPF: ${patient.cpf}`} />
        <Text style={themed($patientDetail)} text={`SEXO: ${patient.gender}`} />
        <Text style={themed($patientDetail)} text={`NASC: ${patient.birthDate}`} />
      </View>

      <View style={themed($patientActions)}>
        {patient.isHolder && (
          <View style={themed($holderTag)}>
            <Crown size={12} color="white" />
            <Text style={themed($holderTagText)} text="Titular" />
          </View>
        )}
        <TouchableOpacity style={themed($optionsButton)}>
          <MoreHorizontal size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={themed($container)}>
      <Header 
        title="Selecione o paciente" 
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
        {/* Patients List */}
        <View style={themed($patientsContainer)}>
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
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
  paddingBottom: 100,
})

const $searchBarContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#1E90FF",
})

const $patientsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
  paddingBottom: spacing.xl,
  flex: 1,
})

const $patientCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "white",
  borderWidth: 1,
  borderColor: "#E0E0E0",
  borderRadius: 12,
  padding: spacing.md,
  marginBottom: spacing.md,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
})

const $patientIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.md,
})

const $holderIcon: ThemedStyle<ViewStyle> = () => ({
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: "#4CAF50",
  justifyContent: "center",
  alignItems: "center",
})

const $dependentIcon: ThemedStyle<ViewStyle> = () => ({
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: "#2196F3",
  justifyContent: "center",
  alignItems: "center",
})

const $patientInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $patientName: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "700",
  color: "#333",
  marginBottom: 4,
})

const $patientDetail: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#666",
  marginBottom: 2,
})

const $patientActions: ThemedStyle<ViewStyle> = () => ({
  alignItems: "flex-end",
  justifyContent: "space-between",
  height: "auto",
})

const $holderTag: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#4CAF50",
  borderRadius: 12,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  marginBottom: spacing.xs,
})

const $holderTagText: ThemedStyle<TextStyle> = () => ({
  fontSize: 10,
  fontWeight: "600",
  color: "white",
  marginLeft: 4,
})

const $optionsButton: ThemedStyle<ViewStyle> = () => ({
  padding: 4,
})
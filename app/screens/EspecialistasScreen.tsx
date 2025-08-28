import React, { FC, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, TextInput, ScrollView, Image, ImageStyle, Modal, Pressable } from "react-native"
import { CheckCircle, X } from "lucide-react-native"
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate
} from "react-native-reanimated"
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
import { showToast } from "@/components/Toast"
import { useEspecialists } from "@/hooks/useEspecialists"
import { Header } from "@/components/Header"
import { colors } from "@/theme/colors"

type EspecialistasScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Especialistas">
}

const SpecialistImage: FC = () => {
  const { themed } = useAppTheme()
  const [isLoading, setIsLoading] = useState(true)

  return (
    <View style={themed($imageContainer)}>
      <Image
        source={{
          uri: 'https://avatar.iran.liara.run/public'
        }}
        style={themed($profilePlaceholder)}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
      {isLoading && (
        <View style={themed($imageLoadingPlaceholder)}>
          <Icon icon="more" size={24} color="#E0E0E0" />
        </View>
      )}
    </View>
  )
}



interface SpecialtySelectionModalProps {
  visible: boolean
  onClose: () => void
  specialist: any
  onSpecialtySelect: (specialty: { id: number; descricao: string }) => void
}

const SpecialtySelectionModal: FC<SpecialtySelectionModalProps> = ({ 
  visible, 
  onClose, 
  specialist, 
  onSpecialtySelect 
}) => {
  const { themed } = useAppTheme()
  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(50)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
      opacity: opacity.value,
    }
  })

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 })
      opacity.value = withTiming(1, { duration: 200 })
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 })
    } else {
      scale.value = withSpring(0, { damping: 15, stiffness: 150 })
      opacity.value = withTiming(0, { duration: 200 })
      translateY.value = withSpring(50, { damping: 15, stiffness: 150 })
    }
  }, [visible])

  if (!specialist) return null

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[$modalOverlay, overlayStyle]}>
        <Animated.View style={[themed($modalContent), animatedStyle]}>
          <View style={themed($modalHeader)}>
            <Text text="Escolher Especialidade" style={themed($modalTitle)} />
            <TouchableOpacity onPress={onClose} style={themed($closeButton)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={themed($modalBody)}>
            <Text text={`Dr. ${specialist.nome}`} style={themed($specialistNameModal)} />
            <Text text="Selecione a especialidade desejada:" style={themed($modalSubtitle)} />
            
            <ScrollView style={themed($specialtiesList)} showsVerticalScrollIndicator={false}>
              {specialist.especialidades.map((especialidade: any) => (
                <TouchableOpacity
                  key={especialidade.id}
                  style={themed($specialtyOption)}
                  onPress={() => {
                    onSpecialtySelect(especialidade)
                    onClose()
                  }}
                >
                  <Text text={especialidade.descricao} style={themed($specialtyText)} />
                  <CheckCircle size={20} color="#1E90FF" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

export const EspecialistasScreen: FC<EspecialistasScreenProps> = observer(function EspecialistasScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { schedulingStore } = useStores()
  const [searchText, setSearchText] = useState("")
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null)
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false)

  // Debug logging
  console.log('EspecialistasScreen Debug:', {
    selectedEspeciality: schedulingStore.selectedEspeciality,
    selectedEspecialityId: schedulingStore.selectedEspecialityId,
  })

  const handleSpecialistPress = (specialist: any) => {
    if (specialist.especialidades.length === 1) {
      // If only one specialty, proceed directly
      const especialidade = specialist.especialidades[0]
      schedulingStore.setEspecialist(specialist.id.toString())
      schedulingStore.setEspeciality(especialidade.descricao, especialidade.id)
      console.log(`Selected specialist: ${specialist.id} with specialty: ${especialidade.descricao}`)

      // Navigate to Establishments with CO (Consultas) mode
      navigation.navigate("Establishments", { 
        mode: "CO"
      })
    } else {
      // If multiple specialties, show selection modal
      setSelectedSpecialist(specialist)
      setShowSpecialtyModal(true)
    }
  }

  const handleSpecialtySelect = (specialty: { id: number; descricao: string }) => {
    if (selectedSpecialist) {
      schedulingStore.setEspecialist(selectedSpecialist.id.toString())
      schedulingStore.setEspeciality(specialty.descricao, specialty.id)
      console.log(`Selected specialist: ${selectedSpecialist.id} with specialty: ${specialty.descricao}`)

      // Navigate to Establishments with CO (Consultas) mode
      navigation.navigate("Establishments", { 
        mode: "CO"
      })
    }
  }

  const { loading, error, especialistas } = useEspecialists(schedulingStore.selectedEspecialityId)
  
  // Filter specialists based on search text
  const filteredSpecialists = especialistas.filter(specialist =>
    specialist.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    specialist.especialidades.some(especialidade => especialidade.descricao.toLowerCase().includes(searchText.toLowerCase()))
  )

  const handleBackPress = () => {
    navigation.goBack()
  }

  return (
    <View style={themed($container)}>
      <Header 
        title={schedulingStore.selectedEspeciality || "Especialistas"} 
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
          placeholder="Pesquisar especialistas"
          containerStyle={{ backgroundColor: colors.palette.secondary500 }}
        />
      </View>

      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        systemBarStyle="light"
      >
        {/* Specialists List */}
        <View style={themed($specialistsContainer)}>
          {loading ? (
            <View style={themed($loadingContainer)}>
              <Text style={themed($loadingText)} text="Carregando especialistas..." />
            </View>
          ) : error ? (
            <View style={themed($errorContainer)}>
              <Text style={themed($errorText)} text={error} />
            </View>
          ) : filteredSpecialists.length === 0 ? (
            <View style={themed($emptyContainer)}>
              <Text style={themed($emptyText)} text="Nenhum especialista encontrado" />
            </View>
          ) : (
            filteredSpecialists.map((specialist) => (
              <TouchableOpacity
                key={specialist.id}
                style={themed($specialistCard)}
                onPress={() => handleSpecialistPress(specialist)}
              >
                <SpecialistImage />
                <View style={themed($specialistInfo)}>
                  <Text style={themed($specialistName)} text={specialist.nome} />
                  <Text style={themed($specialistDetails)} text={`${specialist.especialidades.map(especialidade => especialidade.descricao).join(", ")}`} />
                </View>
                <TouchableOpacity style={themed($optionsButton)}>
                  <CheckCircle size={20} color="#666" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      </Screen>

      {/* Specialty Selection Modal */}
      <SpecialtySelectionModal
        visible={showSpecialtyModal}
        onClose={() => {
          setShowSpecialtyModal(false)
          setSelectedSpecialist(null)
        }}
        specialist={selectedSpecialist}
        onSpecialtySelect={handleSpecialtySelect}
      />
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

const $subtitleContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $subtitleText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "400",
  color: "white",
  textAlign: "center",
  opacity: 0.9,
})

const $searchContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $searchBarContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#1E90FF",
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

const $imageContainer: ThemedStyle<ViewStyle> = () => ({
  position: "relative",
  marginRight: 12,
})

const $profilePlaceholder: ThemedStyle<ImageStyle> = () => ({
  width: 60,
  height: 60,
  borderRadius: 8,
})

const $imageLoadingPlaceholder: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#F5F5F5",
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
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

const $modalOverlay: ViewStyle = {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
}

const $modalContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  borderRadius: 16,
  margin: spacing.lg,
  maxHeight: "80%",
  width: "90%",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 8,
})

const $modalHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: spacing.lg,
  borderBottomWidth: 1,
  borderBottomColor: "#E0E0E0",
})

const $modalTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "700",
  color: "#333",
})

const $closeButton: ThemedStyle<ViewStyle> = () => ({
  padding: 4,
})

const $modalBody: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
})

const $specialistNameModal: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
  marginBottom: spacing.sm,
})

const $modalSubtitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 14,
  color: "#666",
  marginBottom: spacing.md,
})

const $specialtiesList: ThemedStyle<ViewStyle> = () => ({
  maxHeight: 300,
})

const $specialtyOption: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: "#F0F0F0",
})

const $specialtyText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#333",
  flex: 1,
}) 

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $loadingText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#666",
})

const $errorContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $errorText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#666",
})

const $emptyContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $emptyText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#666",
}) 
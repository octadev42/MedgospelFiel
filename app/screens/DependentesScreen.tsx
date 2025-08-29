import { FC, useEffect, useState } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { ArrowLeft, User, Calendar, Users, Plus, Edit } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useDependentes } from "@/hooks/useDependentes"
import { AddDependenteModal } from "@/components/AddDependenteModal"
import { EditDependenteModal } from "@/components/EditDependenteModal"

export const DependentesScreen: FC = observer(function DependentesScreen() {
  const { themed, theme: { colors } } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { dependentes, isLoading, error, getDependentes } = useDependentes()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [selectedDependente, setSelectedDependente] = useState<any>(null)

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleAddDependente = () => {
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  const handleDependenteAdded = () => {
    // Refresh the dependentes list
    getDependentes()
  }

  const handleEditDependente = (dependente: any) => {
    setSelectedDependente(dependente)
    setIsEditModalVisible(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false)
    setSelectedDependente(null)
  }

  // Load dependentes on component mount
  useEffect(() => {
    getDependentes()
  }, [getDependentes])

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch {
      return dateString
    }
  }

  const getSexoLabel = (sexo: string) => {
    return sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Feminino' : sexo
  }



  return (
    <View style={themed($container)}>
      <Header 
        title="Dependentes" 
        titleStyle={{ color: "white" }} 
        leftIcon="back" 
        leftIconColor="white" 
        onLeftPress={handleBackPress}
        backgroundColor={colors.palette.secondary500}
      />

      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        systemBarStyle="light"
      >
        {/* Header Info */}
        <View style={themed($headerInfo)}>
          <Users size={24} color={colors.palette.secondary500} />
          <Text style={themed($headerTitle)} text="Grupo Familiar" />
          <Text style={themed($headerSubtitle)} text="Lista de dependentes cadastrados" />
          
          {/* Add Dependente Button */}
          <TouchableOpacity style={themed($addButton)} onPress={handleAddDependente}>
            <Plus size={20} color="white" />
            <Text style={themed($addButtonText)} text="Adicionar Dependente" />
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={themed($loadingContainer)}>
            <Text style={themed($loadingText)} text="Carregando dependentes..." />
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={themed($errorContainer)}>
            <Text style={themed($errorText)} text={error} />
            <TouchableOpacity style={themed($retryButton)} onPress={() => getDependentes()}>
              <Text style={themed($retryButtonText)} text="Tentar novamente" />
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && !error && dependentes.length === 0 && (
          <View style={themed($emptyContainer)}>
            <Users size={48} color="#9CA3AF" />
            <Text style={themed($emptyTitle)} text="Nenhum dependente encontrado" />
            <Text style={themed($emptySubtitle)} text="Você ainda não possui dependentes cadastrados" />
          </View>
        )}

        {/* Dependentes List */}
        {!isLoading && !error && dependentes.length > 0 && (
          <View style={themed($dependentesContainer)}>
            {dependentes.map((dependente) => (
              <View key={dependente.id} style={themed($dependenteCard)}>
                <View style={themed($dependenteHeader)}>
                  <View style={themed($dependenteIcon)}>
                    <User size={20} color="white" />
                  </View>
                  <View style={themed($dependenteInfo)}>
                    <Text style={themed($dependenteName)} text={dependente.nome} />
                    <Text style={themed($dependenteGrau)} text="Outro" />
                  </View>
                  <TouchableOpacity 
                    style={themed($editButton)} 
                    onPress={() => handleEditDependente(dependente)}
                  >
                    <Edit size={18} color="#1E40AF" />
                  </TouchableOpacity>
                </View>
                
                <View style={themed($dependenteDetails)}>
                  <View style={themed($detailRow)}>
                    <Calendar size={16} color="#6B7280" />
                    <Text style={themed($detailText)} text={formatDate(dependente.data_nascimento)} />
                  </View>
                  <View style={themed($detailRow)}>
                    <Text style={themed($detailLabel)} text="Sexo: " />
                    <Text style={themed($detailText)} text={getSexoLabel(dependente.sexo)} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Add Dependente Modal */}
        <AddDependenteModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          onSuccess={handleDependenteAdded}
        />

        {/* Edit Dependente Modal */}
        <EditDependenteModal
          visible={isEditModalVisible}
          dependente={selectedDependente}
          onClose={handleCloseEditModal}
          onSuccess={handleDependenteAdded}
        />
      </Screen>
    </View>
  )
})

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  paddingBottom: 100,
})

const $headerInfo: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  paddingVertical: 24,
  paddingHorizontal: 16,
})

const $headerTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
  fontWeight: "600",
  color: "#1F2937",
  marginTop: 12,
  marginBottom: 4,
})

const $headerSubtitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#6B7280",
  textAlign: "center",
  marginBottom: 16,
})

const $addButton: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#1E40AF",
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 25,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $addButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "white",
  marginLeft: 8,
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
  paddingVertical: 48,
})

const $emptyTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "600",
  color: "#374151",
  marginTop: 16,
  marginBottom: 8,
})

const $emptySubtitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#6B7280",
  textAlign: "center",
})

const $dependentesContainer: ThemedStyle<ViewStyle> = () => ({
  paddingHorizontal: 16,
})

const $dependenteCard: ThemedStyle<ViewStyle> = () => ({
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

const $dependenteHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 12,
})

const $dependenteIcon: ThemedStyle<ViewStyle> = () => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#1E40AF",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
})

const $dependenteInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $dependenteName: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#1F2937",
  marginBottom: 2,
})

const $dependenteGrau: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#1E40AF",
  fontWeight: "500",
})

const $dependenteDetails: ThemedStyle<ViewStyle> = () => ({
  borderTopWidth: 1,
  borderTopColor: "#F3F4F6",
  paddingTop: 12,
})

const $detailRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 6,
})

const $detailLabel: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#6B7280",
  fontWeight: "500",
  marginRight: 4,
})

const $detailText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#374151",
  marginLeft: 6,
})

const $editButton: ThemedStyle<ViewStyle> = () => ({
  padding: 8,
  borderRadius: 8,
  backgroundColor: "#F3F4F6",
  justifyContent: "center",
  alignItems: "center",
})
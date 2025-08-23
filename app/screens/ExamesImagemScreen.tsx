import { FC, useEffect, useState } from "react"
import { View, ViewStyle, FlatList, TouchableOpacity, TextStyle, RefreshControl } from "react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { SearchBar } from "@/components/SearchBar"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Header } from "@/components/Header"
import { Button } from "@/components/Button"
import { EmptyState } from "@/components/EmptyState"
import { showToast } from "@/components/Toast"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useStores } from "@/models"
import { useProcedimentosEcommerce } from "@/hooks/useProcedimentos"

type ExamesImagemProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "MainTabs">
}

interface ExamItem {
  id: string
  name: string
  description?: string
  price: number
  selected: boolean
}

export const ExamesImagemScreen: FC<ExamesImagemProps> = observer(function ExamesImagemScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { appGeralStore, examSchedulingStore } = useStores()
  
  const [searchText, setSearchText] = useState("")
  const [examItems, setExamItems] = useState<ExamItem[]>([])

  // Use the procedimentos ecommerce hook
  const {
    procedimentos,
    loading,
    error,
    fetchProcedimentosEcommerce,
  } = useProcedimentosEcommerce()

  useEffect(() => {
    appGeralStore.setActiveTab('heart')
    examSchedulingStore.setExamType("EI")
    // Fetch image exams (EI = Exames de Imagem)
    fetchProcedimentosEcommerce({ tipo_procedimento: "EI" })

    examSchedulingStore.resetExamScheduling()
  }, [])

  // Transform API data to ExamItem format
  useEffect(() => {
    if (procedimentos) {
      const transformedItems: ExamItem[] = procedimentos.map((item) => ({
        id: item.id || `${item.fk_procedimento}.${item.subgrupo_codigo}`,
        name: item.nome,
        description: item.descricao,
        price: item.menor_preco,
        selected: examSchedulingStore.isExamSelected(item.id || `${item.fk_procedimento}.${item.subgrupo_codigo}`),
      }))
      setExamItems(transformedItems)
    }
  }, [procedimentos, examSchedulingStore.selectedExamIds])

  const handleSearch = (text: string) => {
    setSearchText(text)
    if (text.trim() === "") {
      // Reset to all items when search is cleared
      if (procedimentos) {
        const transformedItems: ExamItem[] = procedimentos.map((item) => ({
          id: item.id || `${item.fk_procedimento}.${item.subgrupo_codigo}`,
          name: item.nome,
          description: item.descricao,
          price: item.menor_preco,
          selected: examSchedulingStore.isExamSelected(item.id || `${item.fk_procedimento}.${item.subgrupo_codigo}`),
        }))
        setExamItems(transformedItems)
      }
    } else {
      // Filter based on search text
      if (procedimentos) {
        const filtered = procedimentos
          .filter((item) =>
            item.nome.toLowerCase().includes(text.toLowerCase()) ||
            item.descricao?.toLowerCase().includes(text.toLowerCase())
          )
          .map((item) => ({
            id: item.id || `${item.fk_procedimento}.${item.subgrupo_codigo}`,
            name: item.nome,
            description: item.descricao,
            price: item.menor_preco,
            selected: examSchedulingStore.isExamSelected(item.id || `${item.fk_procedimento}.${item.subgrupo_codigo}`),
          }))
        setExamItems(filtered)
      }
    }
  }

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log("Filter pressed")
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleExamSelection = (id: string) => {
    const exam = examItems.find(item => item.id === id)
    if (exam) {
      examSchedulingStore.toggleExam({
        id: exam.id,
        name: exam.name,
        description: exam.description,
        price: exam.price,
        tipo_procedimento: "EI",
        codigo: id, // Using concatenated id as codigo
        grupo: "IMAGEM"
      })
    }
  }

  const handleProsseguir = () => {
    if (!examSchedulingStore.hasSelectedExams) {
      showToast.error("Seleção obrigatória", "Selecione pelo menos um exame para continuar")
      return
    }
    
    console.log("Selected exams:", examSchedulingStore.selectedExams)
    showToast.success("Exames selecionados", `${examSchedulingStore.selectedCount} exame(s) selecionado(s)`)
    
    // Navigate to Establishments with EI (Exames de Imagem) mode
    navigation.navigate("Establishments", { 
      mode: "EI",
      selectedExams: examSchedulingStore.selectedExams
    })
  }

  const renderExamItem = ({ item, index }: { item: ExamItem; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      exiting={FadeOutDown}
    >
      <View style={themed($examCard)}>
        <View style={themed($examCardContent)}>
          <View style={themed($examLeftSection)}>
            <Checkbox
              value={examSchedulingStore.isExamSelected(item.id)}
              onValueChange={() => handleExamSelection(item.id)}
              containerStyle={themed($checkbox)}
            />
            <View style={themed($examInfo)}>
              <Text text={item.name} style={themed($examName)} />
              {item.description && (
                <Text 
                  text={item.description} 
                  style={themed($examDescription)}
                  numberOfLines={2}
                />
              )}
            </View>
          </View>
          <View style={themed($examPriceSection)}>
            <Text text={`R$ ${item.price.toFixed(2).replace('.', ',')}`} style={themed($examPrice)} />
          </View>
        </View>
      </View>
    </Animated.View>
  )

  return (
    <View style={themed($container)}>
      <Header 
        title="Exame de Imagem" 
        backgroundColor="#1E90FF" 
        titleStyle={{ color: "white" }} 
        leftIcon="back" 
        leftIconColor="white" 
        onLeftPress={handleBackPress} 
      />
      
      {/* Search Bar */}
      <View style={themed($searchBarContainer)}>
        <SearchBar
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Pesquisar"
          onFilterPress={handleFilter}
          containerStyle={{ backgroundColor: "#1E90FF" }}
        />
      </View>

      <Screen
        preset="fixed"
        contentContainerStyle={themed($screenContentContainer)}
        systemBarStyle="light"
      >
        {/* Exam List */}
        <View style={themed($examListContainer)}>
          {error ? (
            <EmptyState
              heading="Erro ao carregar exames"
              content={error}
              buttonOnPress={() => fetchProcedimentosEcommerce({ tipo_procedimento: "EI" })}
              button="Tentar Novamente"
            />
          ) : (
            <FlatList
              data={examItems}
              renderItem={renderExamItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={themed($listContainer)}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => fetchProcedimentosEcommerce({ tipo_procedimento: "EI" })}
                  colors={["#1E90FF"]}
                  tintColor="#1E90FF"
                />
              }
              ListEmptyComponent={
                !loading ? (
                  <EmptyState
                    heading="Nenhum exame encontrado"
                    content="Não foram encontrados exames de imagem disponíveis."
                    buttonOnPress={() => fetchProcedimentosEcommerce({ tipo_procedimento: "EI" })}
                    button="Recarregar"
                  />
                ) : null
              }
            />
          )}
        </View>
      </Screen>

      {/* Continue Button */}
      <View style={themed($buttonContainer)}>
        <Button
          text={`Prosseguir (${examSchedulingStore.selectedCount} selecionado${examSchedulingStore.selectedCount !== 1 ? 's' : ''})`}
          onPress={handleProsseguir}
          style={themed($prosseguirButton)}
          textStyle={themed($prosseguirButtonText)}
        />
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

const $searchBarContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#1E90FF",
})

const $examListContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
  paddingBottom: spacing.xl,
  flex: 1,
})

const $listContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xl,
})

const $examCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  borderRadius: 12,
  marginBottom: spacing.sm,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $examCardContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  padding: spacing.md,
})

const $examLeftSection: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
})

const $checkbox: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.sm,
})

const $examInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $examName: ThemedStyle<ViewStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
  marginBottom: 2,
})

const $examDescription: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#666",
  lineHeight: 18,
})

const $examPriceSection: ThemedStyle<ViewStyle> = () => ({
  alignItems: "flex-end",
})

const $examPrice: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#52B69A", // Green color for price
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "white",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  paddingBottom: spacing.xl,
  borderTopWidth: 1,
  borderTopColor: "#E0E0E0",
})

const $prosseguirButton: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#1E90FF",
  borderRadius: 12,
  paddingVertical: 16,
})

const $prosseguirButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "white",
})
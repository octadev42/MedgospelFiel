import React, { useState, useMemo } from "react"
import { View, ViewStyle, TextStyle, Modal, Pressable, ScrollView, TextInput } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export interface SelectOption {
  label: string
  value: string | number
}

interface SelectProps {
  label?: string
  placeholder?: string
  value?: string | number
  onValueChange: (value: string | number) => void
  items: SelectOption[]
  error?: string
  disabled?: boolean
  containerStyle?: any
  inputWrapperStyle?: any
  labelStyle?: any
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = "Selecione uma opção",
  value,
  onValueChange,
  items,
  error,
  disabled = false,
  containerStyle,
  inputWrapperStyle,
  labelStyle,
}) => {
  const { themed, theme } = useAppTheme()
  const [showModal, setShowModal] = useState(false)
  const [searchText, setSearchText] = useState("")

  const selectedItem = items.find(item => item.value === value)
  const displayText = selectedItem ? selectedItem.label : placeholder

  // Filter items based on search text
  const filteredItems = useMemo(() => {
    if (!searchText) return items
    return items.filter(item => 
      item.label.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [items, searchText])

  return (
    <View style={[themed($container), containerStyle]}>
      {label && (
        <Text text={label} style={[themed($label), labelStyle]} />
      )}
      
      <Pressable
        style={[
          themed($inputWrapper),
          inputWrapperStyle,
          error && themed($inputWrapperError),
          disabled && themed($inputWrapperDisabled)
        ]}
        onPress={() => !disabled && setShowModal(true)}
        disabled={disabled}
      >
        <Text text={displayText} style={themed($pickerInput)} />
        <Text text="▼" style={themed($dropdownIcon)} />
      </Pressable>
      
      {error && (
        <Text text={error} style={themed($errorText)} />
      )}

      {/* Custom Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={$modalOverlay}>
          <View style={$modalContent}>
            <View style={$modalHeader}>
              <Text text={label || "Selecionar"} style={$modalTitle} />
              <Pressable onPress={() => setShowModal(false)} style={$closeButton}>
                <Text text="✕" style={$closeButtonText} />
              </Pressable>
            </View>
            
            {/* Search Input */}
            <View style={$searchContainer}>
              <TextInput
                style={$searchInput}
                placeholder="Buscar..."
                value={searchText}
                onChangeText={setSearchText}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <ScrollView style={$modalBody}>
              {filteredItems.length === 0 ? (
                <Text text="Nenhum resultado encontrado" style={$emptyText} />
              ) : (
                filteredItems.map((item) => (
                  <Pressable
                    key={item.value}
                    style={$optionItem}
                    onPress={() => {
                      onValueChange(item.value)
                      setShowModal(false)
                      setSearchText("") // Clear search when item is selected
                    }}
                  >
                    <Text text={item.label} style={$optionText} />
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $label: ThemedStyle<TextStyle> = () => ({
  color: "#333",
  marginBottom: 4,
  fontSize: 14,
  fontWeight: "500",
})

const $inputWrapper: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#fff",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#E5E5E5",
  minHeight: 48,
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 12,
})

const $inputWrapperError: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.error,
})

const $inputWrapperDisabled: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#F5F5F5",
  opacity: 0.6,
})

const $pickerInput: ThemedStyle<TextStyle> = () => ({
  color: "#333",
  fontSize: 16,
  flex: 1,
})

const $dropdownIcon: ThemedStyle<TextStyle> = () => ({
  color: "#666",
  fontSize: 12,
  marginLeft: 8,
})

const $errorText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.error,
  fontSize: 12,
  marginTop: spacing.xs,
})

// Modal Styles
const $modalOverlay: ViewStyle = {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
}

const $modalContent: ViewStyle = {
  backgroundColor: "#fff",
  borderRadius: 12,
  width: "90%",
  maxHeight: "80%",
  padding: 20,
}

const $modalHeader: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
  paddingBottom: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#E5E5E5",
}

const $modalTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "600",
  color: "#333",
}

const $closeButton: ViewStyle = {
  padding: 5,
}

const $closeButtonText: TextStyle = {
  fontSize: 20,
  color: "#666",
}

const $modalBody: ViewStyle = {
  maxHeight: 400,
}

const $optionItem: ViewStyle = {
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#F0F0F0",
}

const $optionText: TextStyle = {
  fontSize: 16,
  color: "#333",
}

const $searchContainer: ViewStyle = {
  marginBottom: 16,
  paddingHorizontal: 4,
}

const $searchInput: TextStyle = {
  backgroundColor: "#F5F5F5",
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 16,
  color: "#333",
  borderWidth: 1,
  borderColor: "#E5E5E5",
}

const $emptyText: TextStyle = {
  textAlign: "center",
  paddingVertical: 40,
  fontSize: 16,
  color: "#666",
}

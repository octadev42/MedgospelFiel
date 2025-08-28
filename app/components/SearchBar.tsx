import { FC } from "react"
import { TextInput, TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"
import { Search, Filter } from "lucide-react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export interface SearchBarProps {
  /**
   * The current search text value
   */
  value: string
  /**
   * Callback when the search text changes
   */
  onChangeText: (text: string) => void
  /**
   * Placeholder text for the search input
   */
  placeholder?: string
  /**
   * Callback when the filter button is pressed
   */
  onFilterPress?: () => void
  /**
   * Optional style override for the container
   */
  containerStyle?: ViewStyle
  /**
   * Optional style override for the search bar
   */
  style?: ViewStyle
  /**
   * Optional style override for the input
   */
  inputStyle?: TextStyle
}

/**
 * A reusable search bar component with search and filter icons
 */
export const SearchBar: FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Pesquisar",
  onFilterPress,
  containerStyle,
  style,
  inputStyle,
}) => {
  const { themed } = useAppTheme()

  return (
    <View style={[themed($container), containerStyle]}>
      <View style={[themed($searchBar), style]}>
        <Search size={20} color="#666" />
        <TextInput
          style={[themed($searchInput), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity style={themed($filterButton)} onPress={onFilterPress}>
          <Filter size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.lg,
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

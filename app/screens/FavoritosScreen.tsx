import { FC, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, TextInput, ScrollView, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"

import { BottomNavigation } from "@/components/BottomNavigation"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useStores } from "@/models"

type FavoritosScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Carteirinha">
}

export const FavoritosScreen: FC<FavoritosScreenProps> = observer(function FavoritosScreen() {
  const { themed } = useAppTheme()

  const { appGeralStore } = useStores()

  useEffect(() => {
    appGeralStore.setActiveTab('heart')
  }, [])


  return (
    <View style={themed($container)}>
      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        safeAreaEdges={["top"]}
        systemBarStyle="light"
      >
        <Text>Favoritos</Text>
        {/* Bottom Navigation - Fixed at bottom */}
        <View style={themed($bottomNavigationContainer)}>
          <BottomNavigation />
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
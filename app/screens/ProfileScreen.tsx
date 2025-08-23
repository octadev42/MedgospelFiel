import { FC, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useStores } from "@/models/helpers/useStores"

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "MainTabs">
}

export const ProfileScreen: FC<ProfileScreenProps> = function ProfileScreen() {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { authenticationStore, appGeralStore } = useStores()

  const menuItems = [
    {
      icon: "check",
      title: "Editar Perfil",
      onPress: () => navigation.navigate("EditarPerfil")
    },
    
    /* 
    {
      icon: "settings",
      title: "Cartões de Crédito",
      onPress: () => { }
    },
    {
      icon: "view",
      title: "Termos e Condições",
      onPress: () => { }
    },
    {
      icon: "lock",
      title: "Política de Privacidade",
      onPress: () => { }
    },
    {
      icon: "menu",
      title: "Dúvidas Frequentes",
      onPress: () => { }
    },
    {
      icon: "more",
      title: "Fale Conosco",
      onPress: () => { }
    }, */
    {
      icon: "back",
      title: "Sair",
      onPress: () => {
        authenticationStore.logout()
        navigation.navigate("Login")
      }
    },
  ]

  const handleBackPress = () => {
    navigation.goBack()
  }

  useEffect(() => {
    appGeralStore.setActiveTab('profile')
  }, [])

  return (
    <View style={themed($container)}>
      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        safeAreaEdges={["top"]}
        systemBarStyle="dark"
      >
        {/* Header Section */}
        <View style={themed($headerContainer)}>
          <TouchableOpacity style={themed($backButton)} onPress={handleBackPress}>
            <Icon icon="back" size={24} color="#20B2AA" />
          </TouchableOpacity>
          <Text style={themed($headerTitle)} text="Conta" />
          <View style={themed($headerSpacer)} />
        </View>

        {/* Profile Section */}
        <View style={themed($profileSection)}>
          <View style={themed($profileImageContainer)}>
            <View style={themed($profileImage)} />
            <TouchableOpacity style={themed($cameraButton)}>
              <Icon icon="view" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={themed($userName)} text="Maria Silva" />
        </View>

        {/* Menu Options */}
        <View style={themed($menuContainer)}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={themed($menuItem)}
              onPress={item.onPress}
            >
              <View style={themed($menuIconContainer)}>
                <Icon icon={item.icon as any} size={20} color="#20B2AA" />
              </View>
              <Text style={themed($menuTitle)} text={item.title} />
              <Icon icon="caretRight" size={16} color="#20B2AA" />
            </TouchableOpacity>
          ))}
        </View>
      </Screen>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "white",
})

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
  paddingBottom: 100, // Add padding to account for bottom navigation
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
  paddingBottom: spacing.xl,
})

const $backButton: ThemedStyle<ViewStyle> = () => ({
  padding: 8,
})

const $headerTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
  fontWeight: "700",
  color: "#20B2AA",
  flex: 1,
  textAlign: "center",
})

const $headerSpacer: ThemedStyle<ViewStyle> = () => ({
  width: 40,
})

const $profileSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingBottom: spacing.xl,
})

const $profileImageContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "relative",
  marginBottom: spacing.md,
})

const $profileImage: ThemedStyle<ViewStyle> = () => ({
  width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: "#FFB6C1", // Light pink background
  justifyContent: "center",
  alignItems: "center",
})

const $cameraButton: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: "#20B2AA",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 3,
  borderColor: "white",
})

const $userName: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "700",
  color: "#333",
  textAlign: "center",
})

const $menuContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
})

const $menuItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.sm,
  marginBottom: spacing.sm,
  borderRadius: 12,
  backgroundColor: "white",
})

const $menuIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#E0F2F1", // Light teal background
  justifyContent: "center",
  alignItems: "center",
  marginRight: spacing.md,
})

const $menuTitle: ThemedStyle<TextStyle> = () => ({
  flex: 1,
  fontSize: 16,
  fontWeight: "500",
  color: "#333",
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
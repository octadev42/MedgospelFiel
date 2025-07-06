import { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { openLinkInBrowser } from "@/utils/openLinkInBrowser"

const bannerImage = require("@assets/images/brand/banner.png")

export const WelcomeScreen: FC = function WelcomeScreen() {
  const { themed } = useAppTheme()

  const handleWhatsAppPress = () => {
    // You can replace this phone number with the actual WhatsApp number
    const phoneNumber = "5511999999999" // Replace with actual number
    const message = "Olá! Gostaria de solicitar um atendimento."
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    openLinkInBrowser(whatsappUrl)
  }

  return (
    <Screen preset="fixed" contentContainerStyle={themed($screenContentContainer)}>
      <View style={themed($headerContainer)}>
        <Image style={themed($banner)} source={bannerImage} resizeMode="contain" />
      </View>
      
      <View style={themed($contentContainer)}>
        <View style={themed($buttonContainer)}>
          <Text 
            tx="welcomeScreen:whatsappCall" 
            preset="subheading" 
            style={themed($callText)}
          />
          <Button
            text="WhatsApp"
            preset="filled"
            onPress={handleWhatsAppPress}
            style={themed($whatsappButton)}
            textStyle={themed($buttonText)}
            LeftAccessory={(props) => (
              <Icon 
                icon="whatsapp" 
                size={20} 
                color="white" 
                style={{ marginRight: 8 }}
              />
            )}
          />
        </View>
      </View>
    </Screen>
  )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "flex-start", // Override the default flex-end from Screen component
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  height: 200,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.md,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
})

const $banner: ThemedStyle<ImageStyle> = () => ({
  width: "100%",
  height: "100%",
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  gap: spacing.md,
  width: "100%",
})

const $callText: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: "center",
  color: colors.palette.neutral700,
  width: "100%",
})

const $whatsappButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minWidth: 200,
  paddingHorizontal: spacing.xl,
  backgroundColor: "#25D366", // WhatsApp green color
})

const $buttonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "600",
  color: "white",
})

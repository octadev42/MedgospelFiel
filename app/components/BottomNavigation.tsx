import React, { useState } from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { Home, CreditCard, ShoppingCart, Heart, User } from "lucide-react-native"
import { useAppTheme } from "@/theme/context"
import { AppStackParamList } from "@/navigators/AppNavigator"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { BottomTab } from "@/models/AppGeralStore"
import { useStores } from "@/models"
import { observer } from "mobx-react-lite"

interface BottomNavigationProps {
}


export const BottomNavigation: React.FC<BottomNavigationProps> = observer(() => {
  const { theme: { colors } } = useAppTheme()
  const iconColor = colors.palette.neutral600
  const activeIconBg = { backgroundColor: '#E8F5E8' }
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  const { appGeralStore } = useStores()
  const { activeTab } = appGeralStore

  const handleTabPress = (tab: BottomTab) => {
    if (tab === "home") {
      navigation.navigate("Home")
    } else if (tab === "profile") {
      navigation.navigate("Profile")
    } else if (tab === "carteirinha") {
      navigation.navigate("Carteirinha")
    } else if (tab === 'cart') {
      navigation.navigate("Carrinho")
    }else if (tab === 'heart'){
      navigation.navigate('Favoritos')
    } else {
      appGeralStore.setActiveTab(tab)
    }
  }

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[styles.navIcon, activeTab === "home" && activeIconBg]}
        onPress={() => handleTabPress('home')}
      >
        <Home color={activeTab === "home" ? "#20B2AA" : iconColor} size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navIcon, activeTab === "carteirinha" && activeIconBg]}
        onPress={() => handleTabPress('carteirinha')}
      >
        <CreditCard color={activeTab === "carteirinha" ? "#20B2AA" : iconColor} size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navIcon, activeTab === "cart" && activeIconBg]}
        onPress={() => handleTabPress('cart')}
      >
        <ShoppingCart color={activeTab === "cart" ? "#20B2AA" : iconColor} size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navIcon, activeTab === "heart" && activeIconBg]}
        onPress={() => handleTabPress('heart')}
      >
        <Heart color={activeTab === "heart" ? "#20B2AA" : iconColor} size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navIcon, activeTab === "profile" && activeIconBg]}
        onPress={() => handleTabPress('profile')}
      >
        <User color={activeTab === "profile" ? "#20B2AA" : iconColor} size={24} />
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    margin: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 4,
  },
  navIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
}) 
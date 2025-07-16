import React from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { Home, CreditCard, ShoppingCart, Heart, User } from "lucide-react-native"
import { useAppTheme } from "@/theme/context"

interface BottomNavigationProps {
  active: "home" | "wallet" | "cart" | "heart" | "profile"
  onTabPress: (tab: "home" | "wallet" | "cart" | "heart" | "profile") => void
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ active, onTabPress }) => {
  const { theme: { colors } } = useAppTheme()
  const iconColor = colors.palette.neutral600
  const activeIconBg = { backgroundColor: '#E8F5E8' }

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[styles.navIcon, active === "home" && activeIconBg]}
        onPress={() => onTabPress('home')}
      >
        <Home color={active === "home" ? "#20B2AA" : iconColor} size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navIcon, active === "wallet" && activeIconBg]}
        onPress={() => onTabPress('wallet')}
      >
        <CreditCard color={active === "wallet" ? "#20B2AA" : iconColor} size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navIcon, active === "cart" && activeIconBg]}
        onPress={() => onTabPress('cart')}
      >
        <ShoppingCart color={active === "cart" ? "#20B2AA" : iconColor} size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navIcon, active === "heart" && activeIconBg]}
        onPress={() => onTabPress('heart')}
      >
        <Heart color={active === "heart" ? "#20B2AA" : iconColor} size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navIcon, active === "profile" && activeIconBg]}
        onPress={() => onTabPress('profile')}
      >
        <User color={active === "profile" ? "#20B2AA" : iconColor} size={24} />
      </TouchableOpacity>
    </View>
  )
}

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
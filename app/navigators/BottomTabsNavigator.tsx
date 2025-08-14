import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Home, CreditCard, ShoppingCart, Heart, User } from "lucide-react-native"
import { observer } from "mobx-react-lite"

import { HomeScreen } from "@/screens/HomeScreen"
import { CarteirinhaScreen } from "@/screens/CarteirinhaScreen"
import { CarrinhoScreen } from "@/screens/CarrinhoScreen"
import { FavoritosScreen } from "@/screens/FavoritosScreen"
import { ProfileScreen } from "@/screens/ProfileScreen"
import { useAppTheme } from "@/theme/context"

export type BottomTabParamList = {
  Home: undefined
  Carteirinha: undefined
  Carrinho: undefined
  Favoritos: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<BottomTabParamList>()

export const BottomTabsNavigator = observer(() => {
  const { theme: { colors } } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
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
          paddingTop: 18,
          height: 80,
        },
        tabBarActiveTintColor: '#20B2AA',
        tabBarInactiveTintColor: colors.palette.neutral600,
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 20,
        },
        tabBarLabelStyle: {
          display: 'none', // Hide labels, only show icons
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home 
              color={color} 
              size={24} 
              style={{ 
                backgroundColor: focused ? '#E8F5E8' : 'transparent',
                borderRadius: 20,
                padding: 8,
              }} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Carteirinha"
        component={CarteirinhaScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CreditCard 
              color={color} 
              size={24} 
              style={{ 
                backgroundColor: focused ? '#E8F5E8' : 'transparent',
                borderRadius: 20,
                padding: 8,
              }} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Carrinho"
        component={CarrinhoScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ShoppingCart 
              color={color} 
              size={24} 
              style={{ 
                backgroundColor: focused ? '#E8F5E8' : 'transparent',
                borderRadius: 20,
                padding: 8,
              }} 
            />
          ),
        }}
      />
    {/*   <Tab.Screen
        name="Favoritos"
        component={FavoritosScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Heart 
              color={color} 
              size={24} 
              style={{ 
                backgroundColor: focused ? '#E8F5E8' : 'transparent',
                borderRadius: 20,
                padding: 8,
              }} 
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <User 
              color={color} 
              size={24} 
              style={{ 
                backgroundColor: focused ? '#E8F5E8' : 'transparent',
                borderRadius: 20,
                padding: 8,
              }} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
})

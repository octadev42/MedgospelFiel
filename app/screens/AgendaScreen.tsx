import { FC, useState } from "react"
import { View, ViewStyle, TouchableOpacity, ScrollView, Image, TextStyle } from "react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { Star, MoreHorizontal } from "lucide-react-native"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackParamList } from "@/navigators/AppNavigator"
import { useStores } from "@/models"

type AgendaScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "MainTabs">
}

interface Appointment {
  id: string
  doctorName: string
  specialty: string
  clinic: string
  rating: number
  reviews: number
  price: string
  date: string
  time: string
}

export const AgendaScreen: FC<AgendaScreenProps> = observer(function AgendaScreen() {
  const { themed } = useAppTheme()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending")

  // Generate dates for the next 7 days
  const generateDates = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i)
      const dateKey = format(date, "yyyy-MM-dd")
      dates.push({
        key: dateKey,
        day: format(date, "EEE", { locale: ptBR }),
        number: format(date, "dd"),
        isToday: i === 0,
        isSelected: i === 2, // Wednesday is selected by default
      })
    }
    return dates
  }

  const dates = generateDates()

  // Mock appointment data
  const appointments: Appointment[] = [
    {
      id: "1",
      doctorName: "Dr. Jenny Wilson",
      specialty: "Neurologist",
      clinic: "Vcare Clinic",
      rating: 5.0,
      reviews: 332,
      price: "R$ 61,00",
      date: "23/12/2024",
      time: "14:30",
    },
    {
      id: "2",
      doctorName: "Dr. Jenny Wilson",
      specialty: "Neurologist",
      clinic: "Vcare Clinic",
      rating: 5.0,
      reviews: 332,
      price: "R$ 61,00",
      date: "24/12/2024",
      time: "10:00",
    },
    {
      id: "3",
      doctorName: "Dr. Jenny Wilson",
      specialty: "Neurologist",
      clinic: "Vcare Clinic",
      rating: 5.0,
      reviews: 332,
      price: "R$ 61,00",
      date: "25/12/2024",
      time: "16:15",
    },
    {
      id: "4",
      doctorName: "Dr. Jenny Wilson",
      specialty: "Neurologist",
      clinic: "Vcare Clinic",
      rating: 5.0,
      reviews: 332,
      price: "R$ 61,00",
      date: "26/12/2024",
      time: "09:45",
    },
  ]

  const handleBackPress = () => {
    // Handle back navigation
  }

  const DateCard: FC<{ date: any }> = ({ date }) => (
    <TouchableOpacity
      style={[
        themed($dateCard),
        date.isSelected && themed($dateCardSelected)
      ]}
      onPress={() => setSelectedDate(date.key)}
    >
      <Text style={themed($dateDayText)} text={date.day} />
      <Text style={themed($dateNumberText)} text={date.number} />
    </TouchableOpacity>
  )

  const AppointmentCard: FC<{ appointment: Appointment }> = ({ appointment }) => (
    <TouchableOpacity style={themed($appointmentCard)}>
      <View style={themed($doctorImageContainer)}>
        <View style={themed($doctorImagePlaceholder)} />
      </View>
      
      <View style={themed($appointmentInfo)}>
        <View style={themed($appointmentHeader)}>
          <Text style={themed($doctorName)} text={appointment.doctorName} />
          <TouchableOpacity style={themed($optionsButton)}>
            <MoreHorizontal size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <Text style={themed($specialtyText)} text={`${appointment.specialty} | ${appointment.clinic}`} />
        
        <View style={themed($ratingContainer)}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
          <Text style={themed($ratingText)} text={`${appointment.rating}`} />
          <Text style={themed($reviewsText)} text={`(${appointment.reviews} avaliações)`} />
        </View>
      </View>

      <View style={themed($priceContainer)}>
        <Text style={themed($priceLabel)} text="Total" />
        <Text style={themed($priceValue)} text={appointment.price} />
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={themed($container)}>
      <Header 
        title="Agenda" 
        backgroundColor="#1E90FF" 
        titleStyle={{ color: "white" }} 
        leftIcon="back" 
        leftIconColor="white" 
        onLeftPress={handleBackPress} 
      />

      <Screen
        preset="scroll"
        contentContainerStyle={themed($screenContentContainer)}
        systemBarStyle="light"
      >
        {/* Date Selector */}
        <View style={themed($dateSelectorContainer)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((date) => (
              <DateCard key={date.key} date={date} />
            ))}
          </ScrollView>
        </View>

        {/* Tabs */}
        <View style={themed($tabsContainer)}>
          <TouchableOpacity
            style={[
              themed($tab),
              activeTab === "pending" && themed($tabActive)
            ]}
            onPress={() => setActiveTab("pending")}
          >
            <Text 
              style={[
                themed($tabText),
                activeTab === "pending" && themed($tabTextActive)
              ]} 
              text="PENDENTES" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              themed($tab),
              activeTab === "completed" && themed($tabActive)
            ]}
            onPress={() => setActiveTab("completed")}
          >
            <Text 
              style={[
                themed($tabText),
                activeTab === "completed" && themed($tabTextActive)
              ]} 
              text="REALIZADAS" 
            />
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        <View style={themed($appointmentsContainer)}>
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
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
  paddingBottom: 100,
})

const $dateSelectorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
})

const $dateCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  marginRight: spacing.md,
  borderRadius: 12,
  backgroundColor: "#F8F9FA",
  minWidth: 60,
})

const $dateCardSelected: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#20B2AA",
})

const $dateDayText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "600",
  color: "#666",
  marginBottom: 4,
})

const $dateNumberText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "700",
  color: "#333",
})

const $tabsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  backgroundColor: "white",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  gap: spacing.sm,
})

const $tab: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#20B2AA",
  backgroundColor: "white",
  alignItems: "center",
})

const $tabActive: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#20B2AA",
})

const $tabText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "#20B2AA",
})

const $tabTextActive: ThemedStyle<TextStyle> = () => ({
  color: "white",
})

const $appointmentsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
  flex: 1,
})

const $appointmentCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  backgroundColor: "white",
  borderRadius: 12,
  padding: spacing.md,
  marginBottom: spacing.md,
  borderWidth: 1,
  borderColor: "#E0E0E0",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
})

const $doctorImageContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.md,
})

const $doctorImagePlaceholder: ThemedStyle<ViewStyle> = () => ({
  width: 60,
  height: 60,
  borderRadius: 8,
  backgroundColor: "#E0E0E0",
})

const $appointmentInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $appointmentHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 4,
})

const $doctorName: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "700",
  color: "#333",
  flex: 1,
})

const $optionsButton: ThemedStyle<ViewStyle> = () => ({
  padding: 4,
})

const $specialtyText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#666",
  marginBottom: 6,
})

const $ratingContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
})

const $ratingText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "#333",
})

const $reviewsText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  color: "#666",
})

const $priceContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "flex-end",
  justifyContent: "space-between",
})

const $priceLabel: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  color: "#666",
  marginBottom: 2,
})

const $priceValue: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "700",
  color: "#4CAF50",
})
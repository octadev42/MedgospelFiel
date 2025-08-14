import { FC, useState, useRef } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, Dimensions } from "react-native"
import { Calendar, Clock } from "lucide-react-native"
import { observer } from "mobx-react-lite"
import Carousel from "react-native-reanimated-carousel"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ScheduleCalendarProps {
  onDateSelect?: (date: string) => void
  onTimeSelect?: (time: string) => void
}

interface DaySchedule {
  id: string
  day: string
  date: string
  isToday: boolean
  timeSlots: TimeSlot[]
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

const { width: screenWidth } = Dimensions.get('window')

export const ScheduleCalendar: FC<ScheduleCalendarProps> = observer(function ScheduleCalendar({
  onDateSelect,
  onTimeSelect,
}) {
  const { themed } = useAppTheme()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"scheduled" | "guide">("scheduled")
  const [currentIndex, setCurrentIndex] = useState(0)

  const carouselRef = useRef<any>(null)

  // Mock data - in real app this would come from API
  const daySchedules: DaySchedule[] = [
    {
      id: "1",
      day: "Ter",
      date: "12/08",
      isToday: true,
      timeSlots: [
        { id: "1-1", time: "A partir de 9hrs", available: true },
        { id: "1-2", time: "A partir de 15hrs", available: true },
      ]
    },
    {
      id: "2",
      day: "Qua",
      date: "13/08",
      isToday: false,
      timeSlots: [
        { id: "2-1", time: "A partir de 9hrs", available: true },
        { id: "2-2", time: "A partir de 15hrs", available: true },
      ]
    },
    {
      id: "3",
      day: "Qui",
      date: "14/08",
      isToday: false,
      timeSlots: [
        { id: "3-1", time: "A partir de 9hrs", available: true },
        { id: "3-2", time: "A partir de 15hrs", available: true },
      ]
    },
    {
      id: "4",
      day: "Sex",
      date: "15/08",
      isToday: false,
      timeSlots: [
        { id: "4-1", time: "A partir de 9hrs", available: true },
        { id: "4-2", time: "A partir de 15hrs", available: true },
      ]
    },
  ]

  // Group daySchedules into chunks of 2
  const groupedSchedules = daySchedules.reduce((result: DaySchedule[][], current, index) => {
    const chunkIndex = Math.floor(index / 2)
    if (!result[chunkIndex]) {
      result[chunkIndex] = []
    }
    result[chunkIndex].push(current)
    return result
  }, [])

  const handleDateSelect = (dateId: string) => {
    setSelectedDate(dateId)
    const day = daySchedules.find(d => d.id === dateId)
    if (day) {
      onDateSelect?.(day.date)
    }
  }

  const handleTimeSelect = (timeId: string) => {
    setSelectedTime(timeId)
    const time = daySchedules
      .flatMap(day => day.timeSlots)
      .find(t => t.id === timeId)
    if (time) {
      onTimeSelect?.(time.time)
    }
  }

  const renderSingleDayColumn = (item: DaySchedule) => {
    return (
      <View style={themed($dateColumn)}>
        <TouchableOpacity
          style={[
            themed($dateHeader),
            selectedDate === item.id && themed($dateHeaderSelected)
          ]}
          onPress={() => handleDateSelect(item.id)}
        >
          <Text style={themed($dateDayText)} text={item.day} />
          <Text style={themed($dateNumberText)} text={item.date} />
        </TouchableOpacity>

        <View style={themed($timeSlotsColumn)}>
          {item.timeSlots.map((timeSlot) => (
            <TouchableOpacity
              key={timeSlot.id}
              style={[
                themed($timeSlotButton),
                selectedTime === timeSlot.id && themed($timeSlotButtonSelected)
              ]}
              onPress={() => handleTimeSelect(timeSlot.id)}
              disabled={!timeSlot.available}
            >
              <Text style={[
                themed($timeSlotText),
                selectedTime === timeSlot.id && themed($timeSlotTextSelected)
              ]} text={timeSlot.time} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  const renderCarouselItem = ({ item }: { item: DaySchedule[] }) => {
    return (
      <View style={themed($groupContainer)}>
        {item.map((daySchedule) => (
          <View key={daySchedule.id} style={themed($columnWrapper)}>
            {renderSingleDayColumn(daySchedule)}
          </View>
        ))}
      </View>
    )
  }

  const onSnapToItem = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <View style={themed($container)}>
      {/* Date Navigation */}
      <View style={themed($dateNavigationContainer)}>
        <Carousel
          ref={carouselRef}
          data={groupedSchedules}
          renderItem={renderCarouselItem}
          width={screenWidth - 80}
          height={160}
          onSnapToItem={onSnapToItem}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          style={themed($carouselContainer)}
        />

      </View>

      {/* Pagination Dots */}
      <View style={themed($paginationContainer)}>
        {groupedSchedules.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              carouselRef.current?.scrollTo({ index, animated: true })
              setCurrentIndex(index)
            }}
          >
            <View
              style={[
                themed($paginationDot),
                index === currentIndex && themed($paginationDotActive)
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>


    </View>
  )
})

const $container: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "white",
  borderRadius: 20,
  marginBottom: 16,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 6,
  overflow: "hidden",
})

const $dateNavigationContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
  flex: 1,
  borderBottomWidth: 1,
  borderBottomColor: "#F0F0F0",
  minHeight: 250,
})

const $carouselContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $groupContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-evenly",
  alignItems: "flex-start",
  width: "100%",
  paddingHorizontal: 10,
})

const $columnWrapper: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  alignItems: "center",
})

const $dateColumn: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  width: "100%",
  minHeight: 140,
})

const $dateHeader: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 12,
  marginBottom: 16,
  minWidth: 70,
  backgroundColor: "#F8F9FA",
})

const $dateHeaderSelected: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#E0F2F1",
  borderWidth: 2,
  borderColor: "#1E90FF",
})

const $dateDayText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "#1A1A1A",
  marginBottom: 2,
})

const $dateNumberText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "700",
  color: "#1A1A1A",
})

const $timeSlotsColumn: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  gap: 8,
})

const $timeSlotButton: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#E8F5E8",
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 12,
  minWidth: 140,
  minHeight: 40,
  borderWidth: 1,
  borderColor: "#4CAF50",
})

const $timeSlotButtonSelected: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#4CAF50",
  borderColor: "#4CAF50",
})

const $timeSlotText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "600",
  color: "#4CAF50",
})

const $timeSlotTextSelected: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "white",
})

const $paginationContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: spacing.xs,
  paddingVertical: spacing.md,
})

const $paginationDot: ThemedStyle<ViewStyle> = () => ({
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "#E0E0E0",
})

const $paginationDotActive: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#1E90FF",
  width: 24,
})



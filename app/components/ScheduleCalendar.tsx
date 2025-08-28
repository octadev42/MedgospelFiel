import { FC, useState, useRef, useMemo, useEffect } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, Dimensions, Alert } from "react-native"
import { Calendar, Clock } from "lucide-react-native"
import { observer } from "mobx-react-lite"
import Carousel from "react-native-reanimated-carousel"
import { format, isToday, parseISO, addDays, startOfWeek, getDay, isValid, startOfDay, endOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { useCart } from "@/hooks/useCart"
import { useStores } from "@/models"
import { ecommerceService } from "@/services/ecommerce.service"
import { showToast } from "@/components/Toast"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AppStackParamList } from "@/navigators/AppNavigator"

interface ScheduleCalendarProps {
  onTimeSelect?: (time: string) => void
  onTimeSlotPress?: (timeSlot: TimeSlot) => void
  tipo_agenda: 'AGENDA_CLINICA' | 'AGENDA_PROFISSIONAL' | 'LIVRE_LIMITADA' | 'AGENDA_LIVRE'
  horarios?: Array<{
    id?: number
    data?: string
    hora_inicial: string
    hora_final: string
    vagas_disponiveis?: number
    vagas_total?: number
    vagas?: number
    dias_semana?: number[]
    fk_tabela_preco_item_horario?: number
    horario_completo?: boolean
  }>
  // Cart integration props
  tabelaPrecoItemId?: number
  valor?: string
  pacienteId?: number
  enableCartIntegration?: boolean
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
  vagas_disponiveis?: number
  originalData?: any
}

const { width: screenWidth } = Dimensions.get('window')

// Helper function to convert dias_semana to day names
const getDayName = (dayNumber: number): string => {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  return days[dayNumber] || 'Desconhecido'
}

// Helper function to format time range consistently
const formatTimeRange = (horaInicial: string, horaFinal: string): string => {
  return `${horaInicial.slice(0, 5)} - ${horaFinal.slice(0, 5)}`
}

// Helper function to safely parse and validate dates
const parseAndValidateDate = (dateString: string): Date | null => {
  try {
    const parsedDate = parseISO(dateString)
    return isValid(parsedDate) ? parsedDate : null
  } catch (error) {
    console.error('Error parsing date:', dateString, error)
    return null
  }
}



export const ScheduleCalendar: FC<ScheduleCalendarProps> = observer(function ScheduleCalendar({
  onTimeSelect,
  onTimeSlotPress,
  tipo_agenda,
  horarios = [],
  tabelaPrecoItemId,
  valor,
  pacienteId,
  enableCartIntegration = false,
}) {
  const { themed } = useAppTheme()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const { 
    setSelectedTimeSlot, 
    setSelectedDate, 
    setSelectedTabelaPrecoItem, 
    setSelectedValor, 
    setSelectedPacienteId,
    selectedTimeSlot,
    selectedDate,
    clearSelectedTimeSlot
  } = useCart()
  const { authenticationStore } = useStores()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  const carouselRef = useRef<any>(null)

  // Clear time selection when component mounts
  useEffect(() => {
    clearSelectedTimeSlot()
  }, [clearSelectedTimeSlot])

  // Function to add item to cart and navigate
  const handleAddToCartAndNavigate = async (timeSlot: any) => {
    if (!authenticationStore.pessoa_fisica_id) {
      showToast.error("Erro", "Usuário não autenticado")
      return
    }

    const fk_tabela_preco_item_horario = timeSlot?.originalData?.fk_tabela_preco_item_horario

    const cartItem = {
      fk_paciente: authenticationStore.pessoa_fisica_id,
      itens: [{
        fk_tabela_preco_item: tabelaPrecoItemId!,
        fk_tabela_preco_item_horario: fk_tabela_preco_item_horario,
        quantidade: 1,
        data_agendada: timeSlot?.originalData?.data || selectedDate,
        valor: valor!,
      }]
    }

    try {
      const response = await ecommerceService.addAoCarrinho(cartItem, authenticationStore.authToken)
      
      if (response.kind === "ok") {
        showToast.success("Sucesso", "Item adicionado ao carrinho!")
        navigation.navigate("Carrinho")
      } else {
        const errorMessage = response.error?.message || "Erro ao adicionar ao carrinho"
        showToast.error("Erro", errorMessage)
      }
    } catch (error) {
      showToast.error("Erro", "Erro inesperado ao adicionar ao carrinho")
    }
  }

  // Helper functions for data transformation
  const transformClinicSchedule = (): DaySchedule[] => {
    // Generate next 14 days starting from today
    const days: DaySchedule[] = []
    const today = startOfDay(new Date()) // Use startOfDay for consistency
    
    for (let i = 0; i < 14; i++) {
      const currentDate = addDays(today, i)
      const dayOfWeek = getDay(currentDate) // 0 = Sunday, 1 = Monday, etc.
      
      // Find horarios that match this day of the week
      const matchingHorarios = horarios.filter(horario => 
        horario.dias_semana?.includes(dayOfWeek)
      )

      if (matchingHorarios.length > 0) {
        const timeSlots: TimeSlot[] = matchingHorarios.map(horario => {
          // Ensure fk_tabela_preco_item_horario is available
          if (!horario.fk_tabela_preco_item_horario) {
            console.error('fk_tabela_preco_item_horario is missing from horario:', horario)
            return null
          }
          
          return {
            id: `${format(currentDate, 'yyyy-MM-dd')}_${horario.fk_tabela_preco_item_horario}`,
            time: formatTimeRange(horario.hora_inicial, horario.hora_final),
            available: true,
            vagas_disponiveis: undefined, // No vagas limit for AGENDA_CLINICA
            originalData: horario,
          }
        }).filter(Boolean) as TimeSlot[]

        days.push({
          id: format(currentDate, 'yyyy-MM-dd'),
          day: format(currentDate, 'EEE', { locale: ptBR }),
          date: format(currentDate, 'dd/MM', { locale: ptBR }),
          isToday: isToday(currentDate),
          timeSlots,
        })
      }
    }
    return days
  }

  const transformLivreLimitadaSchedule = (): DaySchedule[] => {
    
    // For LIVRE_LIMITADA, horarios come with specific dates from API (not dias_semana)
    // Each horario has a 'data' field with the specific date
    // Group horarios by date
    const horariosByDate = horarios.reduce((acc, horario) => {
      const date = horario.data
      if (!date) return acc
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(horario)
      return acc
    }, {} as Record<string, typeof horarios>)
    
    // Convert to DaySchedule format
    const daySchedules: DaySchedule[] = Object.entries(horariosByDate).map(([date, horarios]) => {
      const dateObj = parseAndValidateDate(date)
      
      if (!dateObj) {
        return null
      }
      
      const timeSlots: TimeSlot[] = horarios.map(horario => {
    
        
        return {
          id: `${date}_${horario.fk_tabela_preco_item_horario}`,
          time: formatTimeRange(horario.hora_inicial, horario.hora_final),
          available: (horario.vagas_disponiveis || 0) > 0,
          vagas_disponiveis: horario.vagas_disponiveis || 0,
          originalData: horario,
        }
      }).filter(Boolean) as TimeSlot[]

      return {
        id: date,
        day: format(dateObj, 'EEE', { locale: ptBR }),
        date: format(dateObj, 'dd/MM', { locale: ptBR }),
        isToday: isToday(dateObj),
        timeSlots,
      }
    }).filter(Boolean) as DaySchedule[]

    // Sort by date
    const sortedDaySchedules = daySchedules.sort((a, b) => parseISO(a.id).getTime() - parseISO(b.id).getTime())
    return sortedDaySchedules
  }

  const transformAgendaLivreSchedule = (): DaySchedule[] => {
    // Generate next 14 days starting from today (similar to AGENDA_CLINICA but with different availability logic)
    const days: DaySchedule[] = []
    const today = startOfDay(new Date()) // Use startOfDay for consistency
    
    for (let i = 0; i < 14; i++) {
      const currentDate = addDays(today, i)
      const dayOfWeek = getDay(currentDate) // 0 = Sunday, 1 = Monday, etc.
      
      // Find horarios that match this day of the week
      const matchingHorarios = horarios.filter(horario => 
        horario.dias_semana?.includes(dayOfWeek)
      )

      if (matchingHorarios.length > 0) {
        const timeSlots: TimeSlot[] = matchingHorarios.map(horario => {
          // Ensure fk_tabela_preco_item_horario is available
          if (!horario.fk_tabela_preco_item_horario) {
            console.error('fk_tabela_preco_item_horario is missing from horario:', horario)
            return null
          }
          
          return {
            id: `${format(currentDate, 'yyyy-MM-dd')}_${horario.fk_tabela_preco_item_horario}`,
            time: formatTimeRange(horario.hora_inicial, horario.hora_final),
            available: true,
            vagas_disponiveis: undefined, // No vagas display for AGENDA_LIVRE
            originalData: horario,
          }
        }).filter(Boolean) as TimeSlot[]

        days.push({
          id: format(currentDate, 'yyyy-MM-dd'),
          day: format(currentDate, 'EEE', { locale: ptBR }),
          date: format(currentDate, 'dd/MM', { locale: ptBR }),
          isToday: isToday(currentDate),
          timeSlots,
        })
      }
    }
    return days
  }
  // Transform horarios data into day schedules based on tipo_agenda
  const transformHorariosToDaySchedules = useMemo((): DaySchedule[] => {
    
    if (!horarios || horarios.length === 0) {
      console.log('No horarios data available')
      return []
    }

    if (tipo_agenda === 'AGENDA_CLINICA') {
      // Handle AGENDA_CLINICA format with dias_semana (unlimited slots)
      return transformClinicSchedule()
    } else if (tipo_agenda === 'LIVRE_LIMITADA') {
      // Handle LIVRE_LIMITADA format with specific dates and vagas_disponiveis (limited slots)
      return transformLivreLimitadaSchedule()
    } else if (tipo_agenda === 'AGENDA_LIVRE') {
      // Handle AGENDA_LIVRE format with dias_semana (no vagas limit, only horario_completo check)
      return transformAgendaLivreSchedule()
    } else {
      // Handle AGENDA_CLINICA as default
      return transformClinicSchedule()
    }
  }, [horarios, tipo_agenda])

  const daySchedules = transformHorariosToDaySchedules
  
  console.log('Final daySchedules:', daySchedules)

  // Group daySchedules into chunks of 2
  const groupedSchedules = daySchedules.reduce((result: DaySchedule[][], current, index) => {
    const chunkIndex = Math.floor(index / 2)
    if (!result[chunkIndex]) {
      result[chunkIndex] = []
    }
    result[chunkIndex].push(current)
    return result
  }, [])

  const handleTimeSelect = (timeId: string) => {
    setSelectedTime(timeId)
    const time = daySchedules
      .flatMap(day => day.timeSlots)
      .find(t => t.id === timeId)
    if (time) {
      onTimeSelect?.(time.time)
      // Call the navigation callback when a time slot is pressed
      onTimeSlotPress?.(time)
      
      // Cart integration
      if (enableCartIntegration) {
        // Set the selected time slot in cart store
        setSelectedTimeSlot(time)
        
        // Set the date from the time slot's original data
        if (time.originalData?.data) {
          setSelectedDate(time.originalData.data) // Use the date from the time slot
        } else {
          // Fallback to day schedule date if time slot doesn't have data
          const daySchedule = daySchedules.find(day => 
            day.timeSlots.some(slot => slot.id === timeId)
          )
          if (daySchedule) {
            setSelectedDate(daySchedule.id) // This is the date in 'yyyy-MM-dd' format
          }
        }
        
        // Set other required fields if provided
        if (tabelaPrecoItemId) {
          setSelectedTabelaPrecoItem(tabelaPrecoItemId)
        }
        if (valor) {
          setSelectedValor(String(valor))
        }
        
        // Set the current user's ID as pacienteId
        if (authenticationStore.pessoa_fisica_id) {
          setSelectedPacienteId(authenticationStore.pessoa_fisica_id)
        }
        
        // Call the add to cart and navigate function
        handleAddToCartAndNavigate(time)
      } else {
        // Show alert with fk_tabela_preco_item_horario (original behavior)
        const fk_tabela_preco_item_horario = time.originalData?.fk_tabela_preco_item_horario
        if (fk_tabela_preco_item_horario) {
          Alert.alert(
            "Horário Selecionado",
            `fk_tabela_preco_item_horario: ${fk_tabela_preco_item_horario}\nfk_tabela_preco_id: ${tabelaPrecoItemId}\nvalor: ${valor}\npacienteId: ${pacienteId}`,
            [{ text: "OK" }]
          )
        }
      }
    }
  }

  const renderSingleDayColumn = (item: DaySchedule) => {
    return (
      <View style={themed($dateColumn)}>
        <View style={themed($dateHeader)}>
          <Text style={themed($dateDayText)} text={item.day} />
          <Text style={themed($dateNumberText)} text={item.date} />
        </View>

        <View style={themed($timeSlotsColumn)}>
          {item.timeSlots.map((timeSlot) => (
            <TouchableOpacity
              key={timeSlot.id}
              style={[
                themed($timeSlotButton),
                selectedTime === timeSlot.id && themed($timeSlotButtonSelected),
                !timeSlot.available && themed($timeSlotButtonDisabled)
              ]}
              onPress={() => handleTimeSelect(timeSlot.id)}
              disabled={!timeSlot.available}
            >
              <Text style={[
                themed($timeSlotText),
                selectedTime === timeSlot.id && themed($timeSlotTextSelected),
                !timeSlot.available && themed($timeSlotTextDisabled)
              ]} text={timeSlot.time} />
              {timeSlot.vagas_disponiveis !== undefined && timeSlot.vagas_disponiveis > 0 && (
                <Text style={themed($vagasText)} text={`${timeSlot.vagas_disponiveis} vaga${timeSlot.vagas_disponiveis > 1 ? 's' : ''}`} />
              )}
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

  console.log('ScheduleCalendar rendering with:', {
    daySchedulesLength: daySchedules.length,
    groupedSchedulesLength: groupedSchedules.length,
    tipo_agenda,
  })

  return (
    <View style={themed($container)}>
      {/* No Schedule Available Message */}
      {daySchedules.length === 0 && (
        <View style={themed($noScheduleContainer)}>
          <View style={themed($noScheduleIconContainer)}>
            <Calendar size={48} color="#9CA3AF" />
          </View>
          <Text style={themed($noScheduleTitle)} text="Nenhum horário disponível" />
          <Text style={themed($noScheduleMessage)} text="Não há horários disponíveis para agendamento no momento." />
          <Text style={themed($noScheduleSubMessage)} text="Tente novamente mais tarde ou entre em contato conosco." />
        </View>
      )}
      
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
  paddingVertical: 2,
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

const $timeSlotButtonDisabled: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#F5F5F5",
  borderColor: "#E0E0E0",
  opacity: 0.6,
})

const $timeSlotTextDisabled: ThemedStyle<TextStyle> = () => ({
  color: "#999999",
})

const $vagasText: ThemedStyle<TextStyle> = () => ({
  fontSize: 10,
  fontWeight: "500",
  color: "#666666",
  marginTop: 2,
})

const $noScheduleContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xl,
  minHeight: 300,
})

const $noScheduleIconContainer: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 16,
  padding: 16,
  borderRadius: 50,
  backgroundColor: "#F3F4F6",
})

const $noScheduleTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "600",
  color: "#374151",
  marginBottom: 8,
  textAlign: "center",
})

const $noScheduleMessage: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "400",
  color: "#6B7280",
  marginBottom: 4,
  textAlign: "center",
  lineHeight: 20,
})

const $noScheduleSubMessage: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "400",
  color: "#9CA3AF",
  textAlign: "center",
  lineHeight: 16,
})
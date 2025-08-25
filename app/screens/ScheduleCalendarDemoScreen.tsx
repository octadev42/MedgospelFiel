import { FC } from "react"
import { View, ViewStyle, ScrollView } from "react-native"
import { observer } from "mobx-react-lite"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { ScheduleCalendar } from "@/components/ScheduleCalendar"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export const ScheduleCalendarDemoScreen: FC = observer(function ScheduleCalendarDemoScreen() {
  const { themed } = useAppTheme()

  // Example AGENDA_CLINICA data (unlimited slots)
  const clinicScheduleData = [
    {
      "hora_inicial": "07:00:00",
      "hora_final": "12:00:00",
      "dias_semana": [1, 3, 5], // Monday, Wednesday, Friday
      "vagas": 5,
      "fk_tabela_preco_item_horario": 2,
      "horario_completo": false
    },
    {
      "hora_inicial": "13:00:00",
      "hora_final": "16:00:00",
      "dias_semana": [1], // Monday only
      "vagas": 0,
      "fk_tabela_preco_item_horario": 3,
      "horario_completo": true
    },
    {
      "hora_inicial": "13:00:00",
      "hora_final": "19:00:00",
      "dias_semana": [2, 4], // Tuesday, Thursday
      "vagas": 3,
      "fk_tabela_preco_item_horario": 4,
      "horario_completo": false
    }
  ]

  // Example AGENDA_PROFISSIONAL data (specific dates)
  const professionalScheduleData = [
    {
      "id": 2001,
      "data": "2025-01-15",
      "hora_inicial": "09:00:00",
      "hora_final": "09:30:00",
      "vagas_disponiveis": 1
    },
    {
      "id": 2002,
      "data": "2025-01-15",
      "hora_inicial": "14:00:00",
      "hora_final": "14:30:00",
      "vagas_disponiveis": 0
    },
    {
      "id": 2003,
      "data": "2025-01-16",
      "hora_inicial": "10:00:00",
      "hora_final": "10:30:00",
      "vagas_disponiveis": 1
    }
  ]

  // Example AGENDA_LIVRE data (your provided structure)
  const agendaLivreData = [
    {
      "hora_inicial": "07:00:00",
      "hora_final": "18:00:00",
      "dias_semana": [3], // Wednesday only
      "vagas": 0,
      "fk_tabela_preco_item_horario": 5,
      "horario_completo": true
    }
  ]

  // Example LIVRE_LIMITADA data
  const livreLimitadaData = [
    {
      "hora_inicial": "08:00:00",
      "hora_final": "17:00:00",
      "dias_semana": [1, 2, 4, 5], // Monday, Tuesday, Thursday, Friday
      "vagas": 2,
      "fk_tabela_preco_item_horario": 6,
      "horario_completo": false
    },
    {
      "hora_inicial": "09:00:00",
      "hora_final": "16:00:00",
      "dias_semana": [6], // Saturday
      "vagas": 0,
      "fk_tabela_preco_item_horario": 7,
      "horario_completo": true
    }
  ]

  const handleDateSelect = (date: string) => {
    console.log('Selected date:', date)
  }

  const handleTimeSelect = (time: string) => {
    console.log('Selected time:', time)
  }

  const handleTimeSlotPress = (timeSlot: any) => {
    console.log('Time slot pressed:', timeSlot)
  }

  return (
    <Screen
      contentContainerStyle={themed($container)}
      safeAreaEdges={["top"]}
    >
      <Header
        title="ScheduleCalendar Demo"
        titleStyle={themed($headerTitle)}
      />

      <ScrollView style={themed($scrollContainer)} showsVerticalScrollIndicator={false}>
        
        {/* AGENDA_CLINICA Example */}
        <View style={themed($sectionContainer)}>
          <Text style={themed($sectionTitle)} text="AGENDA_CLINICA - Horários Semanais" />
          <Text style={themed($sectionDescription)} text="Mostra horários baseados em dias da semana (dias_semana) - Sem limite de vagas" />
          
          <ScheduleCalendar
            tipo_agenda="AGENDA_CLINICA"
            horarios={clinicScheduleData}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            onTimeSlotPress={handleTimeSlotPress}
          />
        </View>

        {/* AGENDA_LIVRE Example */}
        <View style={themed($sectionContainer)}>
          <Text style={themed($sectionTitle)} text="AGENDA_LIVRE - Horários Livres" />
          <Text style={themed($sectionDescription)} text="Mostra horários baseados em dias da semana - Sem limite de vagas, apenas verifica horario_completo" />
          
          <ScheduleCalendar
            tipo_agenda="AGENDA_LIVRE"
            horarios={agendaLivreData}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            onTimeSlotPress={handleTimeSlotPress}
          />
        </View>

        {/* LIVRE_LIMITADA Example */}
        <View style={themed($sectionContainer)}>
          <Text style={themed($sectionTitle)} text="LIVRE_LIMITADA - Horários Limitados" />
          <Text style={themed($sectionDescription)} text="Mostra horários baseados em dias da semana - Com limite de vagas" />
          
          <ScheduleCalendar
            tipo_agenda="LIVRE_LIMITADA"
            horarios={livreLimitadaData}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            onTimeSlotPress={handleTimeSlotPress}
          />
        </View>

        {/* AGENDA_PROFISSIONAL Example */}
        <View style={themed($sectionContainer)}>
          <Text style={themed($sectionTitle)} text="AGENDA_PROFISSIONAL - Horários Específicos" />
          <Text style={themed($sectionDescription)} text="Mostra horários baseados em datas específicas" />
          
          <ScheduleCalendar
            tipo_agenda="AGENDA_PROFISSIONAL"
            horarios={professionalScheduleData}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            onTimeSlotPress={handleTimeSlotPress}
          />
        </View>

        {/* Explanation */}
        <View style={themed($explanationContainer)}>
          <Text style={themed($explanationTitle)} text="Como funciona cada tipo:" />
          <Text style={themed($explanationText)} text="• AGENDA_CLINICA: Usa dias_semana, sem limite de vagas" />
          <Text style={themed($explanationText)} text="• AGENDA_LIVRE: Usa dias_semana, sem limite de vagas, apenas verifica horario_completo" />
          <Text style={themed($explanationText)} text="• LIVRE_LIMITADA: Usa dias_semana, com limite de vagas" />
          <Text style={themed($explanationText)} text="• AGENDA_PROFISSIONAL: Usa datas específicas" />
          <Text style={themed($explanationText)} text="• Vagas disponíveis são mostradas quando > 0" />
          <Text style={themed($explanationText)} text="• Horários completos (horario_completo: true) ficam desabilitados" />
        </View>

      </ScrollView>
    </Screen>
  )
})

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "#F8F9FA",
})

const $scrollContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  paddingHorizontal: 16,
})

const $headerTitle: ThemedStyle<ViewStyle> = () => ({
  fontSize: 20,
  fontWeight: "700",
})

const $sectionContainer: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 24,
})

const $sectionTitle: ThemedStyle<ViewStyle> = () => ({
  fontSize: 18,
  fontWeight: "600",
  color: "#1A1A1A",
  marginBottom: 8,
})

const $sectionDescription: ThemedStyle<ViewStyle> = () => ({
  fontSize: 14,
  color: "#666666",
  marginBottom: 16,
})

const $explanationContainer: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "white",
  borderRadius: 12,
  padding: 16,
  marginBottom: 24,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})

const $explanationTitle: ThemedStyle<ViewStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#1A1A1A",
  marginBottom: 12,
})

const $explanationText: ThemedStyle<ViewStyle> = () => ({
  fontSize: 14,
  color: "#666666",
  marginBottom: 6,
  lineHeight: 20,
})

import React, { useState, useRef } from "react"
import { View, ViewStyle, TextStyle, Platform, Modal, Pressable } from "react-native"
import { Controller, Control, FieldError } from "react-hook-form"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Calendar } from "lucide-react-native"

import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { PressableIcon } from "@/components/Icon"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface DateFieldProps {
  control: Control<any>
  name: string
  label: string
  placeholder?: string
  error?: FieldError
  containerStyle?: any
  inputWrapperStyle?: any
  labelStyle?: any
  onDateChange?: (date: string) => void
  maximumDate?: Date
  minimumDate?: Date
}

export const DateField: React.FC<DateFieldProps> = ({
  control,
  name,
  label,
  placeholder = "DD/MM/AAAA",
  error,
  containerStyle,
  inputWrapperStyle,
  labelStyle,
  onDateChange,
  maximumDate,
  minimumDate,
}) => {
  const { themed, theme } = useAppTheme()
  const [isFocused, setIsFocused] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const onChangeRef = useRef<((value: string) => void) | null>(null)

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Format date input with mask DD/MM/AAAA
  const formatDateInput = (text: string): string => {
    // Remove all non-digits
    const numbers = text.replace(/\D/g, "")
    
    // Apply mask progressively
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`
    } else {
      // Limit to 8 digits (DDMMAAAA)
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
    }
  }

  const parseDate = (dateString: string): Date | null => {
    if (!dateString || dateString.length !== 10) return null
    
    const [day, month, year] = dateString.split("/").map(Number)
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null
    
    const date = new Date(year, month - 1, day)
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null
    }
    
    return date
  }

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false)
      if (event.type === "set" && date) {
        const formattedDate = formatDate(date)
        // Update the form field using the stored onChange function
        if (onChangeRef.current) {
          onChangeRef.current(formattedDate)
        }
        onDateChange?.(formattedDate)
      }
    } else if (Platform.OS === "ios") {
      // On iOS, store the selected date but don't update form yet
      if (date) {
        setSelectedDate(date)
      }
    }
  }

  const handleConfirmDate = () => {
    setShowPicker(false)
    if (selectedDate && onChangeRef.current) {
      const formattedDate = formatDate(selectedDate)
      // Update the form field using the stored onChange function
      onChangeRef.current(formattedDate)
      onDateChange?.(formattedDate)
    }
  }

  const openDatePicker = () => {
    // Initialize selectedDate with current form value when opening
    const currentValue = control._formValues[name]
    if (currentValue) {
      const parsed = parseDate(currentValue)
      if (parsed) {
        setSelectedDate(parsed)
      }
    }
    setShowPicker(!showPicker)
  }

    return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          // Store the onChange function to use in confirm handler
          onChangeRef.current = onChange

          return (
            <TextField
              value={value}
              onChangeText={(text) => {
                const formattedText = formatDateInput(text)
                onChange(formattedText)
              }}
              onBlur={() => {
                onBlur()
                setIsFocused(false)
              }}
              onFocus={() => setIsFocused(true)}
              containerStyle={containerStyle}
              inputWrapperStyle={[
                themed($inputWrapper),
                inputWrapperStyle,
                isFocused && themed($inputWrapperFocused),
              ]}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
              maxLength={10}
              label={label}
              LabelTextProps={{ style: [themed($fieldLabel), labelStyle || {}] }}
              placeholder={placeholder}
              helper={error?.message}
              status={error ? "error" : undefined}
              RightAccessory={() => (
                <Pressable onPress={openDatePicker} style={{ marginRight: 10, marginTop: 10 }} >
                  <Calendar size={20} color={theme.colors.palette.neutral800} />
                </Pressable>
              )}
            />
          )
        }}
      />
       
       {Platform.OS === "ios" ? (
         <Modal
           visible={showPicker}
           transparent={true}
           animationType="fade"
           onRequestClose={() => setShowPicker(false)}
         >
           <View style={$modalOverlay}>
             <View style={$modalContent}>
               <DateTimePicker
                 value={selectedDate || parseDate(control._formValues[name]) || new Date()}
                 mode="date"
                 display="spinner"
                 onChange={handleDateChange}
                 maximumDate={maximumDate}
                 minimumDate={minimumDate}
               />
               <View style={$buttonContainer}>
                 <Pressable style={$cancelButton} onPress={() => setShowPicker(false)}>
                   <Text text="Cancelar" style={$cancelButtonText} />
                 </Pressable>
                 <Pressable style={$confirmButton} onPress={handleConfirmDate}>
                   <Text text="Confirmar" style={$confirmButtonText} />
                 </Pressable>
               </View>
             </View>
           </View>
         </Modal>
       ) : (
         showPicker && (
           <DateTimePicker
             value={selectedDate || parseDate(control._formValues[name]) || new Date()}
             mode="date"
             display="default"
             onChange={handleDateChange}
             maximumDate={maximumDate}
             minimumDate={minimumDate}
           />
         )
       )}
    </>
  )
}

const $inputWrapper: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#fff",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#E5E5E5",
})

const $inputWrapperFocused: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.palette.primary600,
})

const $fieldLabel: ThemedStyle<TextStyle> = () => ({
  color: "#333",
  marginBottom: 4,
  fontSize: 14,
  fontWeight: "500",
})

const $modalOverlay: ViewStyle = {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
}

const $modalContent: ViewStyle = {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 20,
  margin: 20,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
}

const $closeButton: ViewStyle = {
  marginTop: 16,
  paddingVertical: 8,
  paddingHorizontal: 16,
  backgroundColor: "#8CF6A0",
  borderRadius: 8,
}

const $closeButtonText: TextStyle = {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
}

const $buttonContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  marginTop: 16,
  gap: 12,
}

const $cancelButton: ViewStyle = {
  flex: 1,
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: "#E5E5E5",
  borderRadius: 8,
}

const $cancelButtonText: TextStyle = {
  color: "#666",
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
}

const $confirmButton: ViewStyle = {
  flex: 1,
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: "#8CF6A0",
  borderRadius: 8,
}

const $confirmButtonText: TextStyle = {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
} 
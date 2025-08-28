import { Instance, SnapshotOut, types } from "mobx-state-tree"

// Exam item model
const ExamItemModel = types.model("ExamItem", {
  id: types.string,
  name: types.string,
  description: types.maybe(types.string),
  price: types.number,
  tipo_procedimento: types.string,
  codigo: types.string,
  grupo: types.maybe(types.string),
})

export const ExamSchedulingStoreModel = types
  .model("ExamSchedulingStore")
  .props({
    selectedExamIds: types.array(types.string),
    selectedExams: types.array(ExamItemModel),
    examType: types.maybe(types.string), // "EL", "EI", "PP"
    totalPrice: types.optional(types.number, 0),
  })
  .views((store) => ({
    get hasSelectedExams() {
      return store.selectedExamIds.length > 0
    },
    get selectedCount() {
      return store.selectedExamIds.length
    },
    get formattedTotalPrice() {
      return `R$ ${store.totalPrice.toFixed(2).replace('.', ',')}`
    },
    isExamSelected(examId: string) {
      return store.selectedExamIds.includes(examId)
    },
    getSelectedExam(examId: string) {
      return store.selectedExams.find(exam => exam.id === examId)
    }
  }))
  .actions((store) => ({
    setExamType(type: "EL" | "EI" | "PP") {
      store.examType = type
    },
    
    addExam(exam: {
      id: string
      name: string
      description?: string
      price: number
      tipo_procedimento: string
      codigo: string
      grupo?: string
    }) {
      if (!store.selectedExamIds.includes(exam.id)) {
        store.selectedExamIds.push(exam.id)
        store.selectedExams.push(exam)
        store.totalPrice += exam.price
      }
    },
    
    removeExam(examId: string) {
      const examIndex = store.selectedExamIds.indexOf(examId)
      if (examIndex > -1) {
        const exam = store.selectedExams.find(e => e.id === examId)
        if (exam) {
          store.totalPrice -= exam.price
        }
        store.selectedExamIds.splice(examIndex, 1)
        store.selectedExams.replace(store.selectedExams.filter(e => e.id !== examId))
      }
    },
    
    toggleExam(exam: {
      id: string
      name: string
      description?: string
      price: number
      tipo_procedimento: string
      codigo: string
      grupo?: string
    }) {
      if (store.selectedExamIds.includes(exam.id)) {
        // Remove exam
        const examIndex = store.selectedExamIds.indexOf(exam.id)
        if (examIndex > -1) {
          const existingExam = store.selectedExams.find(e => e.id === exam.id)
          if (existingExam) {
            store.totalPrice -= existingExam.price
          }
          store.selectedExamIds.splice(examIndex, 1)
          store.selectedExams.replace(store.selectedExams.filter(e => e.id !== exam.id))
        }
      } else {
        // Add exam
        if (!store.selectedExamIds.includes(exam.id)) {
          store.selectedExamIds.push(exam.id)
          store.selectedExams.push(exam)
          store.totalPrice += exam.price
        }
      }
    },
    
    clearSelectedExams() {
      store.selectedExamIds.clear()
      store.selectedExams.clear()
      store.totalPrice = 0
    },
    
    resetExamScheduling() {
      store.selectedExamIds.clear()
      store.selectedExams.clear()
      store.examType = undefined
      store.totalPrice = 0
    }
  }))

export interface ExamSchedulingStore extends Instance<typeof ExamSchedulingStoreModel> {}
export interface ExamSchedulingStoreSnapshot extends SnapshotOut<typeof ExamSchedulingStoreModel> {}

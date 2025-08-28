import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const SchedulingStoreModel = types
  .model("SchedulingStore")
  .props({
    selectedEspecialist: types.maybe(types.string),
    selectedEspeciality: types.maybe(types.string),
    selectedEspecialityId: types.maybe(types.number),
    selectedEstablishment: types.maybe(types.string)
  })
  .views((store) => ({

  }))
  .actions((store) => ({
    setEspeciality(especiality: string, especialityId?: number) {
      store.selectedEspeciality = especiality
      store.selectedEspecialityId = especialityId
    },
    setEspecialist(especialist: string) {
      store.selectedEspecialist = especialist
    },
    setEstablishment(establishment: string) {
      store.selectedEstablishment = establishment
    },
    resetScheduling(){
      store.selectedEspecialist = undefined
      store.selectedEspeciality = undefined
      store.selectedEspecialityId = undefined
      store.selectedEstablishment = undefined
    }
  }))

export interface SchedulingStore extends Instance<typeof SchedulingStoreModel> {}
export interface SchedulingStoreSnapshot extends SnapshotOut<typeof SchedulingStoreModel> {}

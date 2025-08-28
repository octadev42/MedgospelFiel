import { Instance, SnapshotOut, types } from "mobx-state-tree"

export type BottomTab = "home" | "carteirinha" | "cart" | "heart" | "profile"
export const AppGeralStoreModel = types
  .model("AppGeralStore")
  .props({
    activeTab: types.maybe(types.string)
  })
  .actions((store) => ({
    setActiveTab(activeTab: BottomTab) {
      store.activeTab = activeTab
    },
  }))

export interface SchedulingStore extends Instance<typeof AppGeralStoreModel> { }
export interface SchedulingStoreSnapshot extends SnapshotOut<typeof AppGeralStoreModel> { }

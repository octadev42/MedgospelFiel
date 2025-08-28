import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { AuthenticationStoreModel } from "./AuthenticationStore"
import { SchedulingStoreModel } from "./SchedulingStore"
import { AppGeralStoreModel } from "./AppGeralStore"
import { ExamSchedulingStoreModel } from "./ExamSchedulingStore"
import { CartStoreModel } from "./CartStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  schedulingStore: types.optional(SchedulingStoreModel, {}),
  appGeralStore: types.optional(AppGeralStoreModel, {}),
  examSchedulingStore: types.optional(ExamSchedulingStoreModel, {}),
  cartStore: types.optional(CartStoreModel, {})
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> { }
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }

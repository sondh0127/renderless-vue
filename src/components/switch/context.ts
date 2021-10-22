import { Ref, InjectionKey } from 'vue'

export type StateDefinition = {
  // State
  switchRef: Ref<HTMLButtonElement | null>
  labelledby: Ref<string | undefined>
  describedby: Ref<string | undefined>
}

export const GroupContext: InjectionKey<StateDefinition> = Symbol('GroupContext')

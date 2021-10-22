import { InjectionKey } from 'vue'

interface Tab {
  id: string
  active: boolean
  disabled: boolean
  setState: (state: boolean) => void
  select: () => void
  props: Record<string, any>
}

interface TabContext {
  add: (tab: Tab) => void
  set: (id: string) => void
  enable: (id: string) => void
  disable: (id: string) => void
}

const tabKey: InjectionKey<TabContext> = Symbol('TabContext')

export const useTabContext = () => {
  const tabs = ref<Tab[]>([])

  const add: TabContext['add'] = (tab) => (tabs.value = [...tabs.value, tab])

  const set: TabContext['set'] = (id) => {
    tabs.value = tabs.value.map((tab) => {
      if (tab.id == id) {
        tab.setState(true)
        return { ...tab, active: true }
      } else {
        tab.active && tab.setState(false)
        return { ...tab, active: false }
      }
    })
  }
  const disable: TabContext['disable'] = (id) => {
    tabs.value = tabs.value.map((t) => ({
      ...t,
      disabled: t.id == id ? true : t.disabled,
    }))
  }

  const enable: TabContext['enable'] = (id) => {
    tabs.value = tabs.value.map((t) => ({
      ...t,
      disabled: t.id == id ? false : t.disabled,
    }))
  }

  return {
    tabs,
    add,
    set,
    disable,
    enable,
    provide: () =>
      provide(tabKey, {
        add,
        set,
        enable,
        disable,
      }),
    inject: () => inject(tabKey)!,
  }
}

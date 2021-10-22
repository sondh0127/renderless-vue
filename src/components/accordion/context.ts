import { InjectionKey } from 'vue'

interface AccordionContext {
  setCurrent: (fn: () => void) => void
}

const accordionKey: InjectionKey<AccordionContext> = Symbol('Accordion')

export const useAccordionContext = () => {
  const current = ref<() => void>()
  return {
    provide: () =>
      provide(accordionKey, {
        setCurrent: (fn) => {
          current.value && current.value !== fn && current.value()
          current.value = fn
        },
      }),
    inject: () => inject(accordionKey)!,
  }
}

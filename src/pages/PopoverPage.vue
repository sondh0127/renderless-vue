<script lang="ts" setup>
import {
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
  PopoverGroup,
} from '../components/popover'

const solutions = ref([
  {
    name: 'Insights',
    description: 'Measure actions your users take',
    href: '##',
    icon: `
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden='true'
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="8" fill="#FFEDD5" />
              <path
                d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
                stroke="#FB923C"
                stroke-width="2"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
                stroke="#FDBA74"
                stroke-width="2"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
                stroke="#FDBA74"
                stroke-width="2"
              />
            </svg>
          `,
  },
  {
    name: 'Automations',
    description: 'Create your own targeted content',
    href: '##',
    icon: `
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="8" fill="#FFEDD5" />
              <path
                d="M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27"
                stroke="#FB923C"
                stroke-width="2"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.804 30H29.1963L24.0001 21L18.804 30Z"
                stroke="#FDBA74"
                stroke-width="2"
              />
            </svg>
          `,
  },
  {
    name: 'Reports',
    description: 'Keep track of your growth',
    href: '##',
    icon: `
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="8" fill="#FFEDD5" />
              <rect x="13" y="32" width="2" height="4" fill="#FDBA74" />
              <rect x="17" y="28" width="2" height="8" fill="#FDBA74" />
              <rect x="21" y="24" width="2" height="12" fill="#FDBA74" />
              <rect x="25" y="20" width="2" height="16" fill="#FDBA74" />
              <rect x="29" y="16" width="2" height="20" fill="#FB923C" />
              <rect x="33" y="12" width="2" height="24" fill="#FB923C" />
            </svg>
          `,
  },
])
</script>

<template>
  <div class="max-w-sm w-full px-4 top-16 left-1/2 fixed">
    <PopoverGroup class="flex space-x-2">
      <Popover v-slot="{ open }" class="relative">
        <PopoverButton
          :class="open ? '' : 'text-opacity-90'"
          class="
            rounded-md
            font-medium
            bg-orange-700
            text-base text-white
            py-2
            px-3
            inline-flex
            items-center
            group
            hover:text-opacity-100
            focus:outline-none
            focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-opacity-75
          "
        >
          <span>Solutions</span>
          <ChevronDownIcon
            :class="open ? '' : 'text-opacity-70'"
            class="
              h-5
              ml-2
              transition
              ease-in-out
              text-orange-300
              w-5
              duration-150
              group-hover:text-opacity-80
            "
            aria-hidden="true"
          />
        </PopoverButton>
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-1 opacity-0"
        >
          <PopoverPanel
            focus
            class="
              max-w-sm
              mt-3
              w-screen
              px-4
              transform
              left-1/2
              z-10
              -translate-x-1/2
              absolute
              sm:px-0
              lg:max-w-3xl
            "
          >
            <div class="rounded-lg shadow-lg ring-black ring-1 ring-opacity-5 overflow-hidden">
              <div class="bg-white grid p-7 gap-8 relative lg:grid-cols-2">
                <a
                  v-for="item in solutions"
                  :key="item.name"
                  :href="item.href"
                  class="
                    rounded-lg
                    flex
                    -m-3
                    p-2
                    transition
                    ease-in-out
                    duration-150
                    items-center
                    hover:bg-gray-50
                    focus:outline-none
                    focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50
                  "
                >
                  <div
                    class="
                      flex flex-shrink-0
                      h-10
                      text-white
                      w-10
                      items-center
                      justify-center
                      sm:h-12 sm:w-12
                    "
                  >
                    <div v-html="item.icon"></div>
                  </div>
                  <div class="ml-4">
                    <p class="font-medium text-sm text-gray-900">
                      {{ item.name }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ item.description }}
                    </p>
                  </div>
                </a>
              </div>
              <div class="bg-gray-50 p-4">
                <a
                  href="##"
                  class="
                    rounded-md
                    py-2
                    px-2
                    transition
                    ease-in-out
                    duration-150
                    flow-root
                    hover:bg-gray-100
                    focus:outline-none
                    focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50
                  "
                >
                  <span class="flex items-center">
                    <span class="font-medium text-sm text-gray-900"> Documentation </span>
                  </span>
                  <span class="text-sm text-gray-500 block">
                    Start integrating products and tools
                  </span>
                </a>
              </div>
            </div>
          </PopoverPanel>
        </transition>
        <PopoverOverlay class="bg-black" :class="open ? 'opacity-30 fixed inset-0' : 'opacity-0'" />
      </Popover>
      <Popover v-slot="{ open }" class="relative">
        <PopoverButton
          :class="open ? '' : 'text-opacity-90'"
          class="
            rounded-md
            font-medium
            bg-orange-700
            text-base text-white
            py-2
            px-3
            inline-flex
            items-center
            group
            hover:text-opacity-100
            focus:outline-none
            focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-opacity-75
          "
        >
          <span>Solutions</span>
          <ChevronDownIcon
            :class="open ? '' : 'text-opacity-70'"
            class="
              h-5
              ml-2
              transition
              ease-in-out
              text-orange-300
              w-5
              duration-150
              group-hover:text-opacity-80
            "
            aria-hidden="true"
          />
        </PopoverButton>
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-1 opacity-0"
        >
          <PopoverPanel
            focus
            class="
              max-w-sm
              mt-3
              w-screen
              px-4
              transform
              left-1/2
              z-10
              -translate-x-1/2
              absolute
              sm:px-0
              lg:max-w-3xl
            "
          >
            <div class="rounded-lg shadow-lg ring-black ring-1 ring-opacity-5 overflow-hidden">
              <div class="bg-white grid p-7 gap-8 relative lg:grid-cols-2">
                <a
                  v-for="item in solutions"
                  :key="item.name"
                  :href="item.href"
                  class="
                    rounded-lg
                    flex
                    -m-3
                    p-2
                    transition
                    ease-in-out
                    duration-150
                    items-center
                    hover:bg-gray-50
                    focus:outline-none
                    focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50
                  "
                >
                  <div
                    class="
                      flex flex-shrink-0
                      h-10
                      text-white
                      w-10
                      items-center
                      justify-center
                      sm:h-12 sm:w-12
                    "
                  >
                    <div v-html="item.icon"></div>
                  </div>
                  <div class="ml-4">
                    <p class="font-medium text-sm text-gray-900">
                      {{ item.name }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ item.description }}
                    </p>
                  </div>
                </a>
              </div>
              <div class="bg-gray-50 p-4">
                <a
                  href="##"
                  class="
                    rounded-md
                    py-2
                    px-2
                    transition
                    ease-in-out
                    duration-150
                    flow-root
                    hover:bg-gray-100
                    focus:outline-none
                    focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50
                  "
                >
                  <span class="flex items-center">
                    <span class="font-medium text-sm text-gray-900"> Documentation </span>
                  </span>
                  <span class="text-sm text-gray-500 block">
                    Start integrating products and tools
                  </span>
                </a>
              </div>
            </div>
          </PopoverPanel>
        </transition>
      </Popover>
    </PopoverGroup>
  </div>
</template>

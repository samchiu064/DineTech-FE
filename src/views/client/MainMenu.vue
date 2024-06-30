<template>
  <div class="bg-primary-bg h-screen w-screen overflow-hidden">
    <Loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="true"
      :height="128"
      :width="128"
      loader="spinner"
      color="#FF9900"
      background-color="#000"
      :opacity="0.5"
    />
    <MenuHeader @changeCategory="setMenu" />
    <div class="flex justify-between h-[calc(100%-80px)]">
      <fade-transition>
        <main v-show="menu.length > 1" class="px-12 py-4 overflow-auto">
          <div class="flex flex-wrap items-center gap-6">
            <MealCard
              v-for="meal in menu"
              :key="meal._id"
              :meal="meal"
              @click:card="openMealModal('add', meal._id)"
            />
          </div>
        </main>
      </fade-transition>
      <MenuSidebar
        class="w-[340px]"
        @click:list="(cartItemId) => openMealModal('edit', cartItemId)"
      />
    </div>
  </div>
  <fade-transition>
    <CheckInForm v-if="!isCheckIn" />
  </fade-transition>
  <MealModal ref="mealModal" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapWritableState, mapActions } from 'pinia'
import { useClientStore } from '@/stores/clientStore'
import { useStatusStore } from '@/stores/statusStore'
import CheckInForm from '@/components/client/mainMenu/CheckInForm.vue'
import MenuHeader from '@/components/client/mainMenu/MenuHeader.vue'
import MenuSidebar from '@/components/client/mainMenu/MenuSidebar.vue'
import MealCard from '@/components/client/mainMenu/MealCard.vue'
import { apiGetMenu, apiGetTopping } from '@/apis/client'
import type { IMeal } from '@/interfaces'
import MealModal from '@/components/client/mainMenu/MealModal.vue'
import FadeTransition from '@/components/client/FadeTransition.vue'
import Loading from 'vue-loading-overlay'

export default defineComponent({
  components: {
    CheckInForm,
    MenuHeader,
    MenuSidebar,
    MealCard,
    MealModal,
    FadeTransition,
    Loading
  },
  data() {
    return {
      origin: [] as IMeal[],
      menu: [] as IMeal[]
    }
  },
  computed: {
    ...mapState(useClientStore, ['isCheckIn', 'tempCart']),
    ...mapWritableState(useStatusStore, ['isLoading'])
  },
  methods: {
    ...mapActions(useClientStore, ['setTempMeal', 'setTempToppings']),
    setMenu(category: string) {
      const categoryMap: Record<string, string[]> = {
        主餐: ['rice', 'pasta'],
        甜點: ['dessert'],
        飲料: ['beverage']
      }

      if (category in categoryMap) {
        this.menu = this.origin.filter((item) => categoryMap[category].includes(item.category))
      } else {
        this.menu = this.origin
      }
    },
    async getMenu() {
      try {
        const { data } = await apiGetMenu()
        this.origin = [...data.data]
        this.setMenu('主餐')
      } catch (err) {
        console.error(err)
      }
    },
    async getTopping(category: string) {
      try {
        const { data } = await apiGetTopping(category)
        return data.data
      } catch (err) {
        console.error(err)
      }
    },
    async openMealModal(type: string, id?: string) {
      this.isLoading = true

      try {
        let meal
        if (type === 'edit') {
          meal = this.tempCart.find((item) => item._id === id)
        } else if (type === 'add') {
          const { data } = await apiGetMenu({ id })
          meal = data.data
        }

        if (!meal) return

        await this.prepareMealModal(meal, type)
      } catch (error) {
        console.error('Failed to open meal modal:', error)
      } finally {
        this.isLoading = false
      }
    },
    async prepareMealModal(meal: IMeal, type: string) {
      this.setTempMeal(meal)

      const toppings = await this.getTopping(meal.category)
      this.setTempToppings(toppings)

      this.openModal(type)
    },
    openModal(type: string) {
      ;(this.$refs.mealModal as typeof MealModal).open(type)
    }
  },
  created() {
    this.getMenu()
  }
})
</script>

<template>
  <header class="h-20 w-full bg-gray-33 px-12 py-2.5 flex items-center">
    <div class="flex items-start gap-x-4">
      <button
        v-for="{ key, name } in meal.categories"
        :key="key"
        type="button"
        class="w-[133px] py-4 px-12 text-secondary-white text-lg text-center rounded-md"
        :class="{
          'bg-primary-orange': meal.activeTab === name,
          'bg-gray-66': meal.activeTab !== name
        }"
        @click="changeCategory(name)"
      >
        {{ name }}
      </button>
    </div>
    <div
      class="flex items-center justify-center gap-x-2 bg-secondary-white rounded-l-xl rounded-t-xl ms-auto py-2 px-6"
    >
      <span class="material-icons-outlined text-secondary-black text-xl">forum</span>
      <span>{{ menuOrderMessage }}</span>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import { useClientStore } from '@/stores/clientStore'

export default defineComponent({
  data() {
    return {
      meal: {
        categories: [
          {
            key: 'mainCourse',
            name: '主餐'
          },
          {
            key: 'dessert',
            name: '甜點'
          },
          {
            key: 'drink',
            name: '飲料'
          }
        ],
        activeTab: '主餐'
      }
    }
  },
  computed: {
    ...mapState(useClientStore, ['orderStatus']),
    menuOrderMessage() {
      switch (this.orderStatus) {
        case 'notYetOrdered':
          return '您尚未點餐'
        case 'preparing':
          return '餐點製作中'
        case 'canceled':
          return '餐點已取消'
        case 'delivered':
          return '餐點已送達'
        case 'checkout':
          return '訂單結帳中'
        case 'completed':
          return '訂單已完成'
        default:
          return '營業中'
      }
    }
  },
  methods: {
    changeCategory(category: string) {
      this.meal.activeTab = category
      this.$emit('changeCategory', category)
    }
  }
})
</script>

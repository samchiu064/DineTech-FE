<template>
  <div class="bg-primary-bg h-screen w-screen">
    <header class="h-20 w-full bg-gray-33 px-12 py-2.5 flex items-center">
      <button type="button" class="flex items-center gap-x-2 py-2 pe-2" @click="backToMainMenu">
        <span class="material-icons-outlined text-secondary-white text-xl">chevron_left</span>
        <span class="text-secondary-white">返回</span>
      </button>
    </header>
    <div class="flex justify-between h-[calc(100%-80px)]">
      <main class="px-12 py-4 w-full overflow-auto">
        <table class="table-auto w-full text-center">
          <thead>
            <tr class="text-lg text-gray-9f">
              <th class="text-start">餐點項目</th>
              <th>數量</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            <tr class="align-top border-b" v-for="item in flattenedOrderList" :key="item._id">
              <td class="text-start py-2">
                <p>{{ item.menuId?.name }}</p>
                <p class="text-gray-9f text-sm">
                  {{ item.toppings.map((topping) => topping.name).join('/') }}
                </p>
              </td>
              <td class="py-2">X {{ item.quantity }}</td>
              <td class="py-2">$ {{ handlePrice(item.total_price) }}</td>
            </tr>
          </tbody>
        </table>
      </main>
      <div
        class="flex flex-col gap-y-4 bg-[url('@/assets/images/client/client-bg-sidebar.png')] bg-contain pt-4 px-5 min-w-[360px]"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { apiGetOrder } from '@/apis/client'
import { mapState } from 'pinia'
import { useClientStore } from '@/stores/clientStore'
import { formatPriceToTWD } from '@/utils'
import type { ITodayOrder } from '@/interfaces'

export default defineComponent({
  data() {
    return {
      orderList: [] as ITodayOrder[]
    }
  },
  computed: {
    ...mapState(useClientStore, ['guestId']),
    flattenedOrderList() {
      return this.orderList.flatMap((order) =>
        order.items.map((item) => ({
          ...item
        }))
      )
    }
  },
  methods: {
    async getTodayOrders() {
      try {
        const { data: origin } = await apiGetOrder(this.guestId)
        const { data } = origin
        this.orderList = data
      } catch (err) {
        console.error(err)
      }
    },
    backToMainMenu() {
      this.$router.push({ path: '/client/main-menu' })
    },
    handlePrice(price: number): string {
      return formatPriceToTWD(price)
    }
  },
  created() {
    this.getTodayOrders()
  }
})
</script>

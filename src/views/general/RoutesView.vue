<template>
  <div class="container mx-auto my-4">
    <h1 class="text-2xl font-bold my-3">DineTech 餐飲 POS 系統 頁面路由</h1>
    <table class="divide-y divide-gray-200 dark:divide-gray-700 border">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-6 py-3 text-left">頁面名稱</th>
          <th class="px-6 py-3 text-left">角色</th>
          <th class="px-6 py-3 text-left">路由</th>
          <th class="px-6 py-3 text-left">網址</th>
          <th class="px-6 py-3 text-left">是否需要登入</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="item in general"
          :key="item.path"
          class="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <td class="px-6 py-3">
            <router-link
              class="font-medium text-cyan-700 dark:text-blue-500 hover:underline"
              :to="item.path"
            >
              {{ item.name }}
            </router-link>
          </td>
          <td class="px-6 py-3">
            <span class="bg-amber-200 p-1 whitespace-nowrap rounded-md">{{ item.role }}</span>
          </td>
          <td class="px-6 py-3">{{ item.path }}</td>
          <td class="px-6 py-3">
            <a
              :href="item.url"
              target="_blank"
              class="font-medium text-cyan-700 dark:text-blue-500 hover:underline"
            >
              {{ item.url }}
            </a>
          </td>
          <td class="px-6 py-3"><span class="bg-gray-200 p-1 rounded-md">否</span></td>
        </tr>
        <tr
          v-for="item in client"
          :key="item.path"
          class="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <td class="px-6 py-3">
            <router-link
              class="font-medium text-cyan-700 dark:text-blue-500 hover:underline"
              :to="item.path"
            >
              {{ item.name }}
            </router-link>
          </td>
          <td class="px-6 py-3">
            <span class="bg-violet-200 p-1 whitespace-nowrap rounded-md">{{ item.role }}</span>
          </td>
          <td class="px-6 py-3">{{ item.path }}</td>
          <td class="px-6 py-3">
            <a
              :href="item.url"
              target="_blank"
              class="font-medium text-cyan-700 dark:text-blue-500 hover:underline"
            >
              {{ item.url }}
            </a>
          </td>
          <td class="px-6 py-3"><span class="bg-gray-200 p-1 rounded-md">否</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const baseUrl = import.meta.env.VITE_APP_URL

export default defineComponent({
  data() {
    return {
      general: [
        { name: '首頁', role: '共用', path: '/', url: baseUrl },
        {
          name: '錯誤頁面',
          role: '共用',
          path: '/:pathMatch(.*)*',
          url: `${baseUrl}/error/404'`
        }
      ],
      client: [
        {
          name: '系統展示 - 進入頁',
          role: '顧客端',
          path: '/client',
          url: `${baseUrl}/client'`
        },
        {
          name: '系統展示 - 主選單',
          role: '顧客端',
          path: '/client/main-menu',
          url: `${baseUrl}/client/main-menu'`
        },
        {
          name: '系統展示 - 今日訂單明細',
          role: '顧客端',
          path: '/client/today-orders',
          url: `${baseUrl}/client/today-orders'`
        },
        {
          name: '系統展示 - 意見回饋',
          role: '顧客端',
          path: '/client/feedback',
          url: `${baseUrl}/client/feedback'`
        }
      ]
    }
  }
})
</script>

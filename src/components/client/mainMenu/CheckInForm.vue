<template>
  <div class="flex items-center justify-center absolute inset-0 bg-primary-bg">
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
    <VForm
      v-bind="$attrs"
      class="flex flex-col gap-y-4 bg-secondary-white p-12 max-w-[730px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] rounded-3xl"
      @submit="submitForm"
    >
      <h3 class="text-xl">請協助填寫今日用餐資訊</h3>
      <div class="flex gap-x-6">
        <label class="w-1/2">
          <h4
            class="block mb-1 text-gray-33 after:content-['*'] after:ml-0.5 after:text-primary-orange"
          >
            桌次
          </h4>
          <VField
            v-model="form.table"
            name="table"
            label="桌次"
            as="select"
            size="5"
            :rules="{ required: true }"
            class="w-full border border-gray-d4 py-2 px-4 rounded-md focus:outline-none focus:border-secondary-yellow focus:ring-secondary-yellow text-gray-66"
          >
            <option
              v-for="option in 20"
              :key="option"
              :value="option"
              class="checked:bg-secondary-yellow"
            >
              第 {{ option }} 桌
            </option>
          </VField>
        </label>
        <label class="w-1/2">
          <h4
            class="block mb-1 text-gray-33 after:content-['*'] after:ml-0.5 after:text-primary-orange"
          >
            人數/位
          </h4>
          <VField
            v-model="form.people"
            name="people"
            label="人數/位"
            as="select"
            size="5"
            :rules="{ required: true }"
            class="w-full border border-gray-d4 py-2 px-4 rounded-md focus:outline-none focus:border-secondary-yellow focus:ring-secondary-yellow text-gray-66"
          >
            <option
              v-for="option in 20"
              :key="option"
              :value="option"
              class="checked:bg-secondary-yellow"
            >
              {{ option }}
            </option>
          </VField>
        </label>
      </div>
      <div class="flex">
        <div class="flex flex-col w-1/2">
          <h4
            class="block mb-1 text-gray-33 after:content-['*'] after:ml-0.5 after:text-primary-orange"
          >
            今日用餐時間
          </h4>
          <p class="text-3.5xl font-black ps-4">{{ getMealtime() }}</p>
        </div>
        <div class="flex flex-col w-1/2">
          <h4
            class="block mb-1 text-gray-33 after:content-['*'] after:ml-0.5 after:text-primary-orange"
          >
            最後加點時間
          </h4>
          <p class="text-3.5xl font-black text-primary-blue ps-4">{{ getTime(1, 30) }}</p>
        </div>
      </div>
      <div class="flex gap-x-6">
        <button
          type="button"
          class="block w-[30%] py-3 bg-gray-9f text-secondary-white rounded font-bold"
          @click="backToLanding"
        >
          取消用餐
        </button>
        <client-button
          :isLoading="buttonIsLoading"
          type="submit"
          class="block w-[70%] py-3 bg-primary-orange text-secondary-white rounded font-bold"
        >
          送出
        </client-button>
      </div>
      <div class="flex flex-col">
        <h4>🎯 用餐須知</h4>
        <div class="text-sm text-gray-9f mt-2 leading-5">
          <p>
            親愛的顧客您好，歡迎光臨莉莉貝拉維塔義式餐廳！為確保您和其他顧客獲得最佳的用餐體驗，煩請遵守以下用餐須知：
          </p>
          <p>
            1. 尊重廚師：我們的廚師是非常專業的，請您尊重他們的工作，不要過度要求或干涉廚師的工作。
          </p>
          <p>2. 時間安排：請您合理安排用餐時間，不要過度停留，以免影響其他客人的用餐體驗。</p>
          <p>3. 禁止抽菸：我們的餐廳是禁菸場所，請您遵守相關規定。</p>
          <p>4. 帶走服務：我們也提供帶走服務，如果您想帶走一些美食回家，歡迎詢問我們的工作人員。</p>
          <br />
          <p>祝您今日用餐愉快！</p>
        </div>
      </div>
    </VForm>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useClientStore } from '@/stores/clientStore'
import { useStatusStore } from '@/stores/statusStore'
import Loading from 'vue-loading-overlay'
import ClientButton from '@/components/client/ClientButton.vue'
import 'vue-loading-overlay/dist/css/index.css'
import { mapWritableState, mapActions } from 'pinia'

export default defineComponent({
  inheritAttrs: false,
  components: {
    Loading,
    ClientButton
  },
  data() {
    return {
      form: {
        table: 1,
        people: 1
      },
      buttonIsLoading: false
    }
  },
  computed: {
    ...mapWritableState(useStatusStore, ['isLoading'])
  },
  methods: {
    ...mapActions(useClientStore, ['checkIn']),
    // 送出表單
    async submitForm() {
      this.buttonIsLoading = true
      await this.checkIn(this.form)
      this.buttonIsLoading = false
    },
    // 回到進入頁
    backToLanding() {
      this.$router.push({ path: '/client' })
    },
    // 取得用餐時間
    getMealtime() {
      return `${this.getTime()} – ${this.getTime(2)}`
    },
    // 取得時間
    getTime(h: number = 0, m: number = 0) {
      const now = new Date()
      const totalMinutes = now.getMinutes() + m
      const extraHours = Math.floor(totalMinutes / 60)
      const adjustedMinute = totalMinutes % 60

      const totalHours = now.getHours() + h + extraHours
      const adjustedHour = totalHours % 24

      // Format the time with leading zeros if necessary
      const formattedHour = String(adjustedHour < 0 ? 24 + adjustedHour : adjustedHour).padStart(
        2,
        '0'
      )
      const formattedMinute = String(
        adjustedMinute < 0 ? 60 + adjustedMinute : adjustedMinute
      ).padStart(2, '0')

      return `${formattedHour}:${formattedMinute}`
    }
  }
})
</script>

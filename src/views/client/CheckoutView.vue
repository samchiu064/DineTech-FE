<template>
  <div class="fixed inset-0 bg-primary-bg z-40">
    <div class="flex justify-center items-center h-full w-full">
      <div
        class="flex flex-col items-center gap-y-4 p-12 w-[730px] bg-secondary-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
      >
        <template v-if="$route.name === 'clientCheckoutSuccess'">
          <p class="text-2xl font-bold">付款完成！</p>
          <p class="flex items-center gap-x-4">
            <span class="text-xl">今日消費金額為</span>
            <span class="text-3.5xl font-black text-primary-blue">$ {{ totalPrice }}</span>
          </p>
          <p class="text-gray-9f text-base text-center">再次感謝您的蒞臨，期待您的下次光臨！</p>
          <div class="flex gap-x-4 w-full mt-3">
            <button
              type="button"
              class="w-full py-3 bg-primary-orange text-secondary-white rounded-md"
              @click="redirectToFeedback"
            >
              填寫意見回饋
            </button>
          </div>
        </template>
        <template v-else>
          <p class="text-2xl font-bold">結帳請至櫃台，或點擊下方自助繳費按鈕</p>
          <p class="flex items-center gap-x-4">
            <span class="text-xl">今日消費金額為</span>
            <span class="text-3.5xl font-black text-primary-blue">$ {{ totalPrice }}</span>
          </p>
          <p class="text-gray-9f text-base text-center">
            我們的服務人員將會協助您完成結帳程序。
            <br />
            再次感謝您的蒞臨，期待您的下次光臨！
          </p>
          <p class="flex items-center gap-x-2 mt-2">
            <span>本店提供：</span>
            <span class="bg-primary-blue text-white py-1 px-2 text-sm rounded-full">現金支付</span>
            <span class="bg-primary-blue text-white py-1 px-2 text-sm rounded-full"
              >信用卡支付</span
            >
          </p>
          <div class="flex gap-x-4 w-full mt-3">
            <form
              ref="paymentForm"
              action="https://ccore.newebpay.com/MPG/mpg_gateway"
              method="post"
              class="w-1/2"
              @submit.prevent="checkoutOrder"
            >
              <input type="hidden" name="MerchantID" :value="paymentForm.MerchantID" />
              <input type="hidden" name="TradeInfo" :value="paymentForm.TradeInfo" />
              <input type="hidden" name="TradeSha" :value="paymentForm.TradeSha" />
              <input type="hidden" name="Version" :value="paymentForm.Version" />
              <client-button
                type="submit"
                class="w-full h-full bg-primary-blue text-white rounded-md"
                :isLoading="isLoading"
              >
                開啟自助繳費視窗
              </client-button>
            </form>
            <button
              type="button"
              class="w-1/2 py-3 bg-primary-orange text-secondary-white rounded-md"
              @click="redirectToFeedback"
            >
              填寫意見回饋
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useClientStore } from '@/stores/clientStore'
import { formatPriceToTWD } from '@/utils'
import { apiGenerateTradeInfo } from '@/apis/client'
import ClientButton from '@/components/client/ClientButton.vue'

export default defineComponent({
  components: {
    ClientButton
  },
  data() {
    return {
      clientStore: useClientStore(),
      paymentForm: {
        MerchantID: '',
        TradeInfo: '',
        TradeSha: '',
        Version: ''
      },
      isLoading: false
    }
  },
  computed: {
    guestId() {
      return this.clientStore.guestId
    },
    orderTotal() {
      return this.clientStore.orderTotal
    },
    totalPrice() {
      return formatPriceToTWD(this.orderTotal)
    }
  },
  methods: {
    /**
     * 產生交易資訊
     */
    async getTradeInfo() {
      this.isLoading = true

      try {
        const {
          data: { data }
        } = await apiGenerateTradeInfo({
          guestId: this.guestId,
          total: this.orderTotal
        })
        const { MerchantID, TradeInfo, TradeSha, Version } = data

        this.paymentForm.MerchantID = MerchantID
        this.paymentForm.TradeInfo = TradeInfo
        this.paymentForm.TradeSha = TradeSha
        this.paymentForm.Version = Version
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    /**
     * 送出訂單
     */
    async checkoutOrder() {
      await this.getTradeInfo()
      this.$nextTick(() => {
        ;(this.$refs.paymentForm as HTMLFormElement).submit()
      })
    },
    /**
     * 跳轉至意見回饋頁面
     */
    redirectToFeedback() {
      this.$router.push({ path: '/client/feedback' })
    }
  }
})
</script>

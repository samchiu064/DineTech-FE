<template>
  <div>
    <div class="bg-primary-bg min-h-screen flex items-center">
      <div
        class="w-7/12 p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] mx-auto bg-secondary-white relative before:w-full before:h-2 before:absolute before:top-0 before:start-0 before:bg-primary-orange before:rounded-t-xl"
      >
        <h3 class="text-center font-semibold text-2xl mb-6">今日用餐滿意程度</h3>
        <div class="flex flex-row justify-end text-gray-66 py-2 border-b-2 border-b-gray-e9 mb-5">
          <p v-for="option in satisfaction" :key="option" class="w-1/6 text-center">{{ option }}</p>
        </div>
        <form action="submitForm" id="feedbackForm" class="flex flex-col gap-y-1.5">
          <div v-for="radio in radioFields" :key="radio.label" class="flex flex-row items-center">
            <span class="text-base w-1/6">{{ radio.label }}</span>
            <div class="flex items-center justify-around w-5/6">
              <label
                v-for="value in 5"
                :key="value"
                :name="radio.field"
                class="py-3 px-8 bg-gray-f7"
              >
                <input
                  v-model="form[radio.field]"
                  type="radio"
                  :value="6 - value"
                  :name="radio.field"
                  class="w-4 h-4 border border-gray-d4 rounded-full checked:bg-primary-orange checked:text-primary-orange checked:ring-transparent focus:ring-transparent focus:border-gray-9f"
                />
              </label>
            </div>
          </div>
          <div class="text-base mb-5 items-center">
            <div class="mb-3 mt-2">意見回饋</div>
            <textarea
              v-model="form.comment"
              rows="3"
              class="block px-4 py-2 w-full placeholder:text-gray-d4 border border-gray-d4 rounded-md focus:ring-primary-orange focus:border-primary-orange"
            >
            </textarea>
          </div>
          <div class="flex justify-center">
            <button
              @click="openModal"
              class="w-1/2 py-2.5 bg-primary-orange text-secondary-white rounded-md hover:opacity-90 ease-in duration-50"
              type="button"
            >
              送出
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Main modal -->
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div>
          <h2 class="text-center text-2xl font-bold mb-4">今日用餐滿意程度</h2>
          <p class="text-center text-primary-orange text-xl">
            感謝您的回饋，期待下次再相遇。<br />
            祝您有美好的一天。
          </p>
        </div>
        <div class="mt-6 flex justify-center">
          <client-button
            :isLoading="isLoading"
            @click="submitForm"
            class="block w-full justify-center text-white bg-primary-orange hover:opacity-90 font-medium rounded-lg text-lg py-2.5"
          >
            確定
          </client-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { apiCreateFeedback } from '@/apis/client'
import { useClientStore } from '@/stores/clientStore'
import { mapState, mapActions } from 'pinia'
import ClientButton from '@/components/client/ClientButton.vue'

export default defineComponent({
  components: {
    ClientButton
  },
  data() {
    return {
      isLoading: false,
      isOpen: false,
      form: {
        guestId: '',
        service: null,
        flow: null,
        speed: null,
        flavor: null,
        price: null,
        sanitation: null,
        impression: null,
        comment: ''
      } as any,
      satisfaction: ['非常滿意', '滿意', '普通', '不滿意', '非常不滿意'],
      radioFields: [
        {
          label: '服務品質',
          field: 'service'
        },
        {
          label: '點餐流程',
          field: 'flow'
        },
        {
          label: '出餐速度',
          field: 'speed'
        },
        {
          label: '餐點口味',
          field: 'flavor'
        },
        {
          label: '餐點價格',
          field: 'price'
        },
        {
          label: '環境衛生',
          field: 'sanitation'
        },
        {
          label: '整體印象',
          field: 'impression'
        }
      ]
    }
  },
  computed: {
    ...mapState(useClientStore, ['guestId'])
  },
  watch: {
    guestId: {
      immediate: true,
      handler() {
        this.form.guestId = this.guestId
      }
    }
  },
  methods: {
    ...mapActions(useClientStore, ['resetState']),
    openModal() {
      this.isOpen = true
    },
    closeModal() {
      this.isOpen = false
    },
    async submitForm() {
      this.isLoading = true

      try {
        await apiCreateFeedback(this.form)
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }

      this.resetState()
      this.closeModal()
      this.$router.push({ path: '/client' })
    }
  }
})
</script>

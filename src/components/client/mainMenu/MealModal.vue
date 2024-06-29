<template>
  <fade-transition>
    <div v-if="showModal" class="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40">
      <div class="flex justify-center items-center h-full w-full" @click.self="close">
        <div
          class="flex flex-col h-full gap-y-2 justify-center items-start max-w-[542px] rounded-lg relative"
        >
          <VForm
            @submit="buttonView.event(form)"
            class="flex flex-col max-h-[92%] items-start gap-y-4 p-8 rounded-xl bg-secondary-white relative"
          >
            <div
              class="w-full min-h-[246px] rounded-md bg-center bg-cover"
              :style="{ backgroundImage: `url(${form.image})` }"
            ></div>
            <div class="flex flex-col items-start gap-y-4 overflow-y-scroll xl:overflow-y-auto">
              <h2 class="text-2.5xl font-bold">{{ form.name }}</h2>
              <p class="max-w-[98%] text-base text-gray-1d">
                {{ form.description }}
              </p>
              <MealFlavour
                v-if="
                  form.category === 'rice' ||
                  form.category === 'pasta' ||
                  form.category === 'beverage'
                "
                v-model="form.flavour"
                :value="form.flavour"
                :category="form.category"
              />
              <div v-if="tempToppings?.length > 0">
                <p class="block mb-3.5 text-gray-66">加購配料</p>
                <div class="flex flex-wrap ps-2 gap-x-8 gap-y-3.5">
                  <VField
                    v-for="option in tempToppings"
                    :key="option.name"
                    v-model="form.toppings"
                    type="checkbox"
                    :name="option.name"
                    :value="{ name: option.name, price: option.price }"
                    :label="option.name"
                    v-slot="{ field }"
                  >
                    <label class="flex items-center">
                      <input
                        v-model="form.toppings"
                        v-bind="field"
                        type="checkbox"
                        :name="option.name"
                        :value="{ name: option.name, price: option.price }"
                        :label="option.name"
                        class="w-4 h-4 border border-gray-d4 checked:bg-primary-orange checked:text-primary-orange checked:ring-transparent focus:ring-transparent focus:border-gray-9f"
                      />
                      <span class="ps-2 text-sm">{{ option.name }} +${{ option.price }}</span>
                    </label>
                  </VField>
                </div>
              </div>
              <div>
                <p class="block mb-1 text-gray-66">數量</p>
                <div
                  class="flex justify-start items-center gap-x-2 mt-2 border border-gray-d4 rounded-md"
                >
                  <span
                    class="material-icons-outlined text-gray-66 text-xl py-1.5 px-2 cursor-pointer"
                    @click="minusQuantity"
                  >
                    remove
                  </span>
                  <span class="px-2">{{ form.quantity }}</span>
                  <span
                    class="material-icons-outlined text-gray-66 text-xl py-1.5 px-2 cursor-pointer"
                    @click="addQuantity"
                  >
                    add
                  </span>
                </div>
              </div>
            </div>
            <client-button
              :is-loading="buttonIsLoading"
              class="w-full py-3 px-6 rounded-md bg-primary-orange text-secondary-white flex justify-center items-center gap-x-2"
            >
              <span class="material-icons-outlined text-2xl leading-none">
                {{ buttonView.icon }}
              </span>
              <span class="text-lg font-bold">{{ buttonView.text }}</span>
            </client-button>
            <button type="button" class="absolute top-2 end-2 leading-none" @click="close">
              <span class="material-icons-outlined text-secondary-black">close</span>
            </button>
          </VForm>
        </div>
      </div>
    </div>
  </fade-transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapActions } from 'pinia'
import { useClientStore } from '@/stores/clientStore'
import ClientButton from '../ClientButton.vue'
import FadeTransition from '@/components/client/FadeTransition.vue'
import MealFlavour from '@/components/client/mainMenu/MealFlavour.vue'
import { v4 as uuidv4 } from 'uuid'
import type { ICartMeal } from '@/interfaces'

type ModalType = 'add' | 'edit'

interface ButtonView {
  icon: string
  text: string
  event: Function
}

const defaultForm = (): ICartMeal => ({
  _id: '',
  menuId: '',
  name: '',
  price: 0,
  description: '',
  image: '',
  category: '',
  stock: 0,
  flavour: '',
  toppings: [],
  quantity: 1,
  total_price: 0
})

export default defineComponent({
  components: {
    ClientButton,
    FadeTransition,
    MealFlavour
  },
  data() {
    return {
      form: defaultForm(),
      modalType: '' as ModalType,
      showModal: false,
      buttonIsLoading: false
    }
  },
  computed: {
    ...mapState(useClientStore, ['tempMeal', 'tempToppings']),
    // 按鈕樣式
    buttonView(): ButtonView {
      return this.modalType === 'add'
        ? {
            icon: 'shopping_cart',
            text: `加入購物車 ($ ${this.form.total_price} 元)`,
            event: (form: ICartMeal) => {
              this.form._id = uuidv4()
              this.addToCart(form)
              this.close()
            }
          }
        : {
            icon: 'edit',
            text: `完成修改 ($ ${this.form.total_price} 元)`,
            event: (form: ICartMeal) => {
              this.updateCart(this.form._id, form)
              this.close()
            }
          }
    }
  },
  watch: {
    tempMeal: {
      handler() {
        const menuId = 'menuId' in this.tempMeal ? this.tempMeal.menuId : this.tempMeal._id;
        this.form = { ...this.form, ...this.tempMeal, menuId }
        this.calcTotalPrice()
      }
    },
    'form.toppings': {
      deep: true,
      handler() {
        this.calcTotalPrice()
      }
    },
    'form.quantity': {
      immediate: true,
      handler() {
        this.calcTotalPrice()
      }
    }
  },
  methods: {
    ...mapActions(useClientStore, [
      'resetTempMeal',
      'resetTempToppings',
      'addToCart',
      'updateCart'
    ]),
    // 開啟燈箱
    open(type: string) {
      this.modalType = type as ModalType
      this.showModal = true
    },
    // 關閉燈箱
    close() {
      this.resetForm()
      this.resetTempMeal()
      this.resetTempToppings()
      this.showModal = false
    },
    // 增加數量
    addQuantity() {
      this.form.quantity++
    },
    // 減少數量
    minusQuantity() {
      if (this.form.quantity > 1) this.form.quantity--
    },
    // 計算總價
    calcTotalPrice() {
      const toppingPrice = this.form.toppings.reduce((acc, cur) => acc + cur.price, 0)
      this.form.total_price = (this.tempMeal.price + toppingPrice) * this.form.quantity
    },
    // 重置表單
    resetForm() {
      this.form = defaultForm()
    }
  }
})
</script>

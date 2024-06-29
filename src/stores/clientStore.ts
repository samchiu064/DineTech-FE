import { defineStore } from 'pinia'
import { apiCreateGuest } from '@/apis/client'
import type { IMeal, IGuest, ICartMeal, ITopping } from '@/interfaces'

export const useClientStore = defineStore('client', {
  state: () => {
    return {
      guestId: '',
      sidebarExpanded: false,
      isCheckIn: false,
      tempMeal: {} as IMeal | ICartMeal,
      tempToppings: [] as ITopping[],
      tempCart: [] as ICartMeal[],
      orderStatus: '',
      orderTotal: 0
    }
  },
  persist: {
    storage: sessionStorage,
    paths: [
      'guestId',
      'sidebarExpanded',
      'isCheckIn',
      'tempMeal',
      'tempCart',
      'orderStatus',
      'orderTotal'
    ]
  },
  getters: {
    isEmptyCart(): boolean {
      return this.tempCart.length === 0
    }
  },
  actions: {
    toggleSidebar() {
      this.sidebarExpanded = !this.sidebarExpanded
    },
    async checkIn(form: IGuest) {
      try {
        const { data: origin } = await apiCreateGuest(form)
        const { data } = origin
        this.guestId = data.id
      } catch (error) {
        console.error(error)
      }

      this.isCheckIn = true
    },
    resetTempMeal() {
      this.tempMeal = {} as IMeal
    },
    addToCart(form: ICartMeal) {
      this.tempCart.push(form)
      if (!this.sidebarExpanded) this.sidebarExpanded = true
    },
    updateCart(id: string, form: ICartMeal) {
      const index = this.tempCart.findIndex((item) => item._id === id)
      this.tempCart[index] = form
    },
    removeCartItem(id: string) {
      const index = this.tempCart.findIndex((item) => item._id === id)
      this.tempCart.splice(index, 1)
    },
    clearCart() {
      this.tempCart = [] as ICartMeal[]
    },
    setTempMeal(meal: IMeal | ICartMeal) {
      this.tempMeal = meal
    },
    setOrderStatus(status: string) {
      this.orderStatus = status
    },
    resetTempData() {
      this.tempMeal = {} as IMeal
      this.tempCart = [] as ICartMeal[]
      this.tempToppings = [] as ITopping[]
      this.orderStatus = ''
    },
    setOrderTotal(total: number) {
      this.orderTotal = total
    },
    setTempToppings(toppings: ITopping[]) {
      this.tempToppings = toppings
    },
    resetTempToppings() {
      this.tempToppings = [] as ITopping[]
    },
    resetState() {
      this.guestId = ''
      this.sidebarExpanded = false
      this.isCheckIn = false
      this.orderTotal = 0
      this.resetTempData()
    }
  }
})

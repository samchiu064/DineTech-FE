import type { IMeal } from '../interfaces'

interface ICartMeal extends IMeal {
  menuId: string
  flavour: string
  toppings: { name: string, price: number}[]
  quantity: number
  total_price: number
}

export type { ICartMeal }
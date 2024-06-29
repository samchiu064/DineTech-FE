interface IOrderItem {
  menuId: string | { _id: string; name: string; price: number };
  quantity: number
  flavour: string
  toppings: { name: string, price: number}[]
  total_price: number
}

interface IOrder {
  guestId: string
  items: IOrderItem[]
  total: number
}

interface ITodayOrderItem extends IOrderItem {
  _id: string
  menuId: {
    _id: string
    name: string
    price: number
  }
}

interface ITodayOrder extends IOrder {
  _id: string
  items: ITodayOrderItem[]
  createdAt: string
}

export type { IOrder, IOrderItem, ITodayOrder, ITodayOrderItem }

import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { IGuest, IOrder, IFeedback } from '@/interfaces'

const clientRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_API
})

export const apiGetMenu = async ({
  category,
  id
}: { category?: string; id?: string } = {}): Promise<AxiosResponse> => {
  const endpoint = id ? `menus/${id}` : 'menus/'
  const params = category ? { category } : undefined

  return await clientRequest.get(endpoint, { params })
}
export const apiCreateGuest = (payload: IGuest): Promise<AxiosResponse> =>
  clientRequest.post('guests', payload)

export const apiGetTopping = (category?: string): Promise<AxiosResponse> => {
  const params = category ? { category } : undefined
  return clientRequest.get('toppings', { params })
}

export const apiGetOrder = (guestId?: string): Promise<AxiosResponse> => {
  const params = guestId ? { guestId } : undefined
  return clientRequest.get('orders', { params })
}

export const apiCreateOrder = (payload: IOrder): Promise<AxiosResponse> =>
  clientRequest.post('orders', payload)

export const apiCreateFeedback = (payload: IFeedback): Promise<AxiosResponse> =>
  clientRequest.post('feedbacks', payload)

export const apiGenerateTradeInfo = (payload: {
  guestId: string
  total: number
}): Promise<AxiosResponse> => clientRequest.post('checkout', payload)

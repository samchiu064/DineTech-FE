interface IFeedback {
  guestId: string
  service: number
  flow: number
  speed: number
  flavor: number
  price: number
  sanitation: number
  impression: number
  comment: string
  createdAt: string
}

export type { IFeedback }

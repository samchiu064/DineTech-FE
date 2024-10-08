import type { RouteRecordRaw } from 'vue-router'
import { useClientStore } from '@/stores/clientStore'

/**
 * 顧客端路由
 *
 * @type {RouteRecordRaw}
 * @property {string} path - 路由路徑
 * @property {string} name - 路由名稱
 * @property {Function} component - 視圖元件
 * @property {Array.<RouteRecordRaw>} children - 子路由
 * @property {object} meta - 路由資訊
 * @property {title} meta.title - 頁面標題
 */
const clientRoutes: RouteRecordRaw = {
  path: '/client',
  name: 'clientApp',
  children: [
    {
      path: '',
      name: 'clientLandingView',
      component: () => import('@/views/client/LandingView.vue'),
      meta: {
        title: '莉莉貝拉維塔義式餐廳'
      },
      beforeEnter: () => {
        sessionStorage.clear()
      }
    },
    {
      path: 'main-menu',
      name: 'clientMainMenu',
      component: () => import('@/views/client/MainMenu.vue'),
      meta: {
        title: '主選單'
      }
    },
    {
      path: 'today-orders',
      name: 'clientTodayOrders',
      component: () => import('@/views/client/TodayOrders.vue'),
      meta: {
        title: '今日訂單明細'
      }
    },
    {
      path: 'checkout',
      name: 'clientCheckout',
      component: () => import('@/views/client/CheckoutView.vue'),
      children: [
        {
          path: 'success',
          name: 'clientCheckoutSuccess',
          component: () => import('@/views/client/CheckoutView.vue'),
        }
      ],
      meta: {
        title: '結帳頁面'
      }
    },
    {
      path: 'feedback',
      name: 'clientFeedback',
      component: () => import('@/views/client/FeedbackView.vue'),
      meta: {
        title: '意見回饋'
      },
      beforeEnter: (to, from, next) => {
        const store = useClientStore()

        if (!store.guestId) {
          next('/client')
        } else {
          next()
        }
      }
    }
  ]
}

export { clientRoutes }

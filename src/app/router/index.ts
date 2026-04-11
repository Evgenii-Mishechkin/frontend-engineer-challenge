import { setPendingAuthHeroExpand } from '@/app/router/authHeroTransition'
import { useSessionStore } from '@/entities/session'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      meta: { authShowHero: true },
      component: () => import('@/pages/LoginPage.vue'),
    },
    {
      path: '/register',
      name: 'register',
      meta: { authShowHero: true },
      component: () => import('@/pages/RegisterPage.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      meta: { authShowHero: false },
      component: () => import('@/pages/ForgotPasswordPage.vue'),
    },
    {
      path: '/forgot-password/sent',
      name: 'forgot-password-sent',
      meta: { authShowHero: false },
      component: () => import('@/pages/ForgotPasswordSentPage.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      meta: { authShowHero: false },
      component: () => import('@/pages/ResetPasswordPage.vue'),
    },
    {
      path: '/terms',
      name: 'terms',
      meta: { legalTitle: 'Условия использования' },
      component: () => import('@/pages/LegalPage.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      meta: { legalTitle: 'Политика конфиденциальности' },
      component: () => import('@/pages/LegalPage.vue'),
    },
  ],
})

router.afterEach((to, from) => {
  const fromNoHero = from.meta.authShowHero === false
  const toWithHero = to.meta.authShowHero === true
  if (fromNoHero && toWithHero) {
    setPendingAuthHeroExpand()
  }
})

router.beforeEach((to) => {
  const session = useSessionStore()

  if (to.meta.requiresAuth && !session.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.name === 'login' && session.isAuthenticated) {
    return { name: 'home' }
  }

  return true
})

export default router

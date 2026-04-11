/**
 * Глобальный setup для Vitest.
 * Импортируется через vite.config.ts → test.setupFiles.
 */
import { config } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * Заглушка роутера — достаточно для тестов composables и компонентов,
 * которым нужен inject RouterLink / useRoute / useRouter.
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
})

config.global.plugins = [router]

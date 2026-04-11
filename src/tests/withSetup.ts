/**
 * Запускает composable внутри полноценного Vue-приложения с Pinia и Router.
 * Необходим для composables, использующих useRoute / useRouter / useStore.
 *
 * @example
 * const { result, router } = withSetup(() => useLoginForm())
 * result.email.value = 'test@example.com'
 */
import { createApp, defineComponent, h } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

interface WithSetupOptions {
  routes?: { path: string; name?: string; component?: object }[]
}

export function withSetup<T>(
  composable: () => T,
  options: WithSetupOptions = {},
): { result: T; router: ReturnType<typeof createRouter>; unmount: () => void } {
  let result!: T

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      ...(options.routes ?? []).map((r) => ({
        ...r,
        component: r.component ?? { template: '<div />' },
      })),
      { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
    ],
  })

  const app = createApp(
    defineComponent({
      setup() {
        result = composable()
        return () => h('div')
      },
    }),
  )

  app.use(createPinia())
  app.use(router)

  const el = document.createElement('div')
  document.body.appendChild(el)
  app.mount(el)

  return {
    result,
    router,
    unmount: () => {
      app.unmount()
      el.remove()
    },
  }
}

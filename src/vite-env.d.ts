/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vue-router' {
  interface RouteMeta {
    /** Маршрут доступен только авторизованным пользователям. */
    requiresAuth?: boolean
    /** Маршрут доступен только гостям; авторизованный редиректится на home. */
    guestOnly?: boolean
    /** Показывать hero-иллюстрацию в AuthSplitLayout. */
    authShowHero?: boolean
    /** Заголовок страницы для LegalPage. */
    legalTitle?: string
  }
}

import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

/** Только внутренние пути; защита от open redirect. */
export function resolvePostLoginRedirect(route: RouteLocationNormalized): RouteLocationRaw {
  const raw = route.query.redirect
  const path = typeof raw === 'string' ? raw : null
  if (path && path.startsWith('/') && !path.startsWith('//')) {
    return path
  }
  return { name: 'home' }
}

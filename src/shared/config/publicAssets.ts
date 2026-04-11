/**
 * Статические файлы из `public/` — путь от корня приложения (см. Vite publicDir).
 */
const base = import.meta.env.BASE_URL

const publicAsset = (path: string) => `${base}${path.replace(/^\//, '')}`

export const AUTH_LOGO = publicAsset('img/logo.svg')

export const AUTH_EYE_ICON = publicAsset('img/eye.svg')
export const AUTH_EYE_CLOSED_ICON = publicAsset('img/eye-closed.svg')

/** Декоративная иллюстрация в правой колонке auth (PNG с альфой). */
export const AUTH_HERO_IMAGE = publicAsset('img/glass-bolls.png')

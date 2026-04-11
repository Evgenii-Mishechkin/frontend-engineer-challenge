/**
 * Один раз при mount `AuthSplitLayout` с showHero: после перехода с экрана без иллюстрации
 * (forgot-password) стартуем свёрнуто и плавно разворачиваем hero.
 */
let pendingAuthHeroExpand = false

export function setPendingAuthHeroExpand(): void {
  pendingAuthHeroExpand = true
}

export function consumeAuthHeroExpandPending(): boolean {
  const v = pendingAuthHeroExpand
  pendingAuthHeroExpand = false
  return v
}

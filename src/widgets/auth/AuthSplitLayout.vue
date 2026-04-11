<script setup lang="ts">
import { consumeAuthHeroExpandPending } from '@/app/router/authHeroTransition'
import { AUTH_HERO_IMAGE, AUTH_LOGO } from '@/shared/config/publicAssets'
import { onMounted, ref, useSlots } from 'vue'

function prefersReducedMotion(): boolean {
  if (typeof matchMedia === 'undefined') return false
  return matchMedia('(prefers-reduced-motion: reduce)').matches
}

const props = withDefaults(
  defineProps<{
    /** Правая колонка с иллюстрацией (напр. forgot-password — левая колонка расширяется и перекрывает hero). */
    showHero?: boolean
  }>(),
  { showHero: true },
)

const slots = useSlots()

/** Класс `auth-split--no-hero`: широкая левая колонка (expand/collapse только слева). */
const applyNoHeroLayout = ref(false)

onMounted(() => {
  const reduce = prefersReducedMotion()

  if (!props.showHero) {
    if (reduce) {
      applyNoHeroLayout.value = true
      return
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        applyNoHeroLayout.value = true
      })
    })
    return
  }

  const expandFromForgot = consumeAuthHeroExpandPending()
  if (expandFromForgot) {
    if (reduce) {
      applyNoHeroLayout.value = false
      return
    }
    applyNoHeroLayout.value = true
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        applyNoHeroLayout.value = false
      })
    })
  }
})
</script>

<template>
  <div
    class="auth-split"
    :class="{ 'auth-split--no-hero': applyNoHeroLayout }"
  >
    <div class="auth-split__left">
      <header class="auth-split__header">
        <RouterLink class="auth-split__logo" to="/">
          <img :src="AUTH_LOGO" width="200" height="40" alt="Orbitto" />
        </RouterLink>
      </header>
      <div class="auth-split__main">
        <slot />
      </div>
      <div v-if="slots.footer" class="auth-split__footer">
        <slot name="footer" />
      </div>
    </div>

    <div class="auth-split__right" aria-hidden="true">
      <img class="auth-split__hero-img" :src="AUTH_HERO_IMAGE" alt="" />
    </div>
  </div>
</template>

<style scoped>
.auth-split {
  display: flex;
  min-height: max(var(--min-height-viewport), var(--min-height-auth-split));
  background: var(--color-surface);
  font-family: var(--font-family-sans);
}

.auth-split__left {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  width: var(--size-full);
  max-width: var(--size-auth-column-max);
  flex-shrink: 0;
  min-height: max(var(--min-height-viewport), var(--min-height-auth-split));
  box-sizing: border-box;
  background: var(--color-surface);
  transition: max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-split--no-hero .auth-split__left {
  max-width: 100%;
}

.auth-split__header {
  flex-shrink: 0;
  padding: var(--space-auth-logo-top) var(--space-auth-main-padding-x) var(--space-none)
    var(--space-auth-logo-left);
}

.auth-split__logo {
  display: inline-block;
  line-height: var(--line-height-zero);
}

.auth-split__logo img {
  display: block;
  height: var(--size-logo-height);
  width: auto;
  max-width: var(--size-logo-max-width);
  object-fit: contain;
}

.auth-split__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-auth-form-gap) var(--space-auth-main-padding-x)
    var(--space-auth-main-padding-bottom);
  box-sizing: border-box;
}

.auth-split--no-hero .auth-split__main {
  align-items: center;
}

.auth-split__footer {
  border-top: var(--border-width-hairline) solid var(--color-border-subtle);
  padding: var(--space-auth-footer-y);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-auth-footer-gap);
  flex-wrap: wrap;
  font-family: var(--font-family-sans);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-snug);
}

.auth-split__right {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: var(--min-width-flex);
  min-height: var(--min-height-auth-right);
  padding: var(--space-auth-form-gap);
  box-sizing: border-box;
  background: linear-gradient(
    var(--auth-gradient-angle),
    var(--color-auth-gradient-start) 0%,
    var(--color-auth-gradient-end) 100%
  );
  overflow: hidden;
}

.auth-split--no-hero .auth-split__right {
  flex: 0 1 0;
  min-width: 0;
  min-height: 0;
  padding: var(--space-none);
  margin: var(--space-none);
}

.auth-split__hero-img {
  width: min(var(--size-hero-img-max-width), var(--size-hero-img-vw));
  height: auto;
  max-height: var(--size-hero-img-max-height);
  object-fit: contain;
}

@media (prefers-reduced-motion: reduce) {
  .auth-split__left {
    transition-duration: 0.01ms;
  }
}
</style>

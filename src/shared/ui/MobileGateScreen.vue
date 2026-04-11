<script setup lang="ts">
import { AUTH_HERO_IMAGE, AUTH_LOGO } from '@/shared/config/publicAssets'
</script>

<template>
  <!--
    Мобильная заглушка: перекрывает приложение фиксированным слоем на viewport ≤ 834px.
    Брейкпоинт задан токеном --breakpoint-mobile-gate в style.css — значение здесь синхронизировано вручную.
    На десктопе: display: none → не рендерится в дереве доступности.
  -->
  <div class="mobile-gate" role="region" aria-label="Мобильная версия">
    <header class="mobile-gate__header">
      <img
        class="mobile-gate__logo"
        :src="AUTH_LOGO"
        width="200"
        height="40"
        alt="Orbitto"
      />
    </header>

    <div class="mobile-gate__hero" aria-hidden="true">
      <img
        class="mobile-gate__hero-img"
        :src="AUTH_HERO_IMAGE"
        alt=""
        draggable="false"
      />
    </div>

    <footer class="mobile-gate__content">
      <p class="mobile-gate__title">Сервис доступен только в десктопной версии</p>
      <p class="mobile-gate__sub">
        В ближайшее время сервис станет доступен для планшетов и смартфонов
      </p>
    </footer>
  </div>
</template>

<style scoped>

.mobile-gate {
  display: none;
}

@media (max-width: 834px) {
  .mobile-gate {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    /* Единый градиент на весь экран — как в макете */
    background: linear-gradient(
      var(--auth-gradient-angle),
      var(--color-auth-gradient-start) 0%,
      var(--color-auth-gradient-end) 100%
    );
    font-family: var(--font-family-sans);
    overflow: hidden;
  }

  /* ——— Шапка с логотипом ——— */
  .mobile-gate__header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 36px var(--space-auth-main-padding-x);
  }

  .mobile-gate__logo {
    display: block;
    height: var(--size-logo-height);
    width: auto;
    max-width: var(--size-logo-max-width);
    object-fit: contain;
  }

  /* ——— Секция с иллюстрацией ——— */
  .mobile-gate__hero {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .mobile-gate__hero-img {
    width: 72%;
    max-width: 340px;
    height: auto;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
  }

  /* ——— Текстовый блок снизу ——— */
  .mobile-gate__content {
    flex-shrink: 0;
    padding: 40px 32px 52px;
    text-align: center;
  }

  .mobile-gate__title {
    margin: 0;
    font-size: var(--font-size-mobile-gate-title);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-tight);
    color: var(--color-text-primary);
  }

  .mobile-gate__sub {
    margin: 12px 0 0;
    font-size: var(--font-size-body-sm);
    font-weight: var(--font-weight-normal);
    line-height: var(--line-height-snug);
    color: var(--color-text-tertiary);
  }
}
</style>

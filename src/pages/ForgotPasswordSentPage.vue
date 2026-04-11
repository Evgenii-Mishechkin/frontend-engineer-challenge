<script setup lang="ts">
import { AuthResultPanel, AuthSplitLayout } from '@/widgets/auth'
import AuthPrimaryButton from '@/shared/ui/AuthPrimaryButton.vue'
import AuthScreenTitle from '@/shared/ui/AuthScreenTitle.vue'
import { DEV_PW_RESET_STORAGE } from '@/features/auth/model/forgotPassword'
import { pickFirstQueryParam } from '@/shared/lib/router/pickFirstQueryParam'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const rawEmail = computed(() => pickFirstQueryParam(route.query.email).trim())

const devHint = ref<{ email: string; token: string } | null>(null)

onMounted(() => {
  if (!import.meta.env.DEV) return
  try {
    const raw = sessionStorage.getItem(DEV_PW_RESET_STORAGE)
    if (!raw) return
    const parsed = JSON.parse(raw) as { email?: string; token?: string }
    if (parsed.email?.trim() && parsed.token?.trim()) {
      devHint.value = { email: parsed.email.trim(), token: parsed.token.trim() }
    }
  } catch {
    sessionStorage.removeItem(DEV_PW_RESET_STORAGE)
  }
})

const showDevLink = computed(() => {
  if (!import.meta.env.DEV || !devHint.value || !rawEmail.value) return false
  return devHint.value.email.toLowerCase() === rawEmail.value.toLowerCase()
})
</script>

<template>
  <AuthSplitLayout :show-hero="false">
    <div class="forgot-sent-wrap">
      <AuthResultPanel>
        <AuthScreenTitle text="Проверьте свою почту" />
        <p class="auth-hint forgot-sent-wrap__lead" role="status">
          Мы отправили на почту письмо с ссылкой для восстановления пароля
        </p>
        <AuthPrimaryButton
          class="forgot-sent-wrap__back-btn"
          to="/login"
          variant="neutral"
          label="Назад в авторизацию"
          loose-top
        />

        <div v-if="showDevLink && devHint" class="forgot-sent-dev" role="region" aria-label="Отладка">
          <p class="forgot-sent-dev__label">Dev: токен из ответа API</p>
          <code class="auth-code">{{ devHint.token }}</code>
          <p>
            <RouterLink
              class="ui-text-link"
              :to="{ name: 'reset-password', query: { email: devHint.email, token: devHint.token } }"
            >
              Открыть форму нового пароля
            </RouterLink>
          </p>
        </div>
      </AuthResultPanel>
    </div>
  </AuthSplitLayout>
</template>

<style scoped>
.forgot-sent-wrap :deep(.auth-result) {
  max-width: 480px;
  margin-inline: auto;
  text-align: left;
}

.forgot-sent-wrap :deep(.forgot-sent-wrap__lead) {
  margin-top: 16px;
  color: var(--color-text-muted);
  line-height: 1.5;
  max-width: 340px;
}

.forgot-sent-wrap :deep(.forgot-sent-wrap__back-btn) {
  margin-top: 40px;
  color: #5b9ae8;
}

.forgot-sent-dev {
  margin-top: 32px;
  padding: 16px;
  border-radius: var(--radius-md);
  text-align: left;
  background: rgba(31, 31, 39, 0.04);
  border: 1px solid var(--color-border-subtle);
}

.forgot-sent-dev__label {
  margin: 0 0 8px;
  font-size: var(--font-size-body-xs);
  color: var(--color-text-secondary);
}

.forgot-sent-dev :deep(.auth-code) {
  display: block;
  margin-bottom: 12px;
}
</style>

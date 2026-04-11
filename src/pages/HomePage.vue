<script setup lang="ts">
import { useSessionStore } from '@/entities/session'
import { graphqlRequest } from '@/shared/api/graphql'
import { presentAuthApiError } from '@/shared/lib/api/presentAuthApiError'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const session = useSessionStore()
const router = useRouter()
const loggingOut = ref(false)
const deletingAccount = ref(false)
const deleteAccountError = ref('')

const ping = ref<'idle' | 'loading' | 'ok' | 'err'>('idle')
const pingDetail = ref('')

async function checkBackend() {
  ping.value = 'loading'
  pingDetail.value = ''
  try {
    const r = await graphqlRequest<{ __typename: string }>('{ __typename }')
    if (r.errors?.length) {
      ping.value = 'err'
      pingDetail.value = r.errors.map((e) => e.message).join('; ')
      return
    }
    ping.value = 'ok'
    pingDetail.value = r.data?.__typename ?? ''
  } catch (e) {
    ping.value = 'err'
    pingDetail.value = e instanceof Error ? e.message : String(e)
  }
}

onMounted(() => {
  void checkBackend()
})

async function handleLogout() {
  loggingOut.value = true
  try {
    await session.logout()
    await router.push({ name: 'login' })
  } finally {
    loggingOut.value = false
  }
}

async function handleDeleteAccount() {
  deleteAccountError.value = ''
  const ok = window.confirm(
    'Удалить учётную запись безвозвратно? Профиль и сессии будут удалены с сервера.',
  )
  if (!ok) return
  deletingAccount.value = true
  try {
    await session.deleteAccount()
    await router.push({ name: 'login' })
  } catch (e) {
    const raw = e instanceof Error ? e.message : String(e)
    const low = raw.toLowerCase()
    deleteAccountError.value = low.includes('unauthorized')
      ? 'Сессия недействительна. Выйдите и войдите снова.'
      : presentAuthApiError(raw).message
  } finally {
    deletingAccount.value = false
  }
}
</script>

<template>
  <main class="home">
    <h1>Orbitto — каркас</h1>
    <p class="muted">
      Проверка связи с бэкендом (GraphQL <code>__typename</code> при загрузке страницы).
    </p>
    <p>
      Статус:
      <strong v-if="ping === 'idle'">ожидание</strong>
      <strong v-else-if="ping === 'loading'">запрос…</strong>
      <strong v-else-if="ping === 'ok'">ok</strong>
      <strong v-else>error</strong>
    </p>
    <p v-if="pingDetail" class="detail">{{ pingDetail }}</p>
    <button type="button" @click="checkBackend">Повторить запрос</button>
    <nav class="nav" aria-label="Auth">
      <RouterLink to="/login">Sign in</RouterLink>
      ·
      <RouterLink to="/register">Register</RouterLink>
      ·
      <RouterLink to="/forgot-password">Forgot password</RouterLink>
      ·
      <RouterLink to="/reset-password">Reset password</RouterLink>
      ·
      <button
        type="button"
        class="nav-logout"
        :disabled="loggingOut || deletingAccount"
        @click="handleLogout"
      >
        {{ loggingOut ? 'Выход…' : 'Выйти' }}
      </button>
      ·
      <button
        type="button"
        class="nav-delete-account"
        :disabled="deletingAccount || loggingOut"
        @click="handleDeleteAccount"
      >
        {{ deletingAccount ? 'Удаление…' : 'Удалить пользователя' }}
      </button>
    </nav>
    <p v-if="deleteAccountError" class="delete-account-error" role="alert">
      {{ deleteAccountError }}
    </p>
  </main>
</template>

<style scoped>
.home {
  max-width: var(--size-home-max-width);
  padding: var(--space-page-padding);
  font-family: var(--font-family-sans);
}

.home h1 {
  margin: 0 0 var(--space-page-block);
  font-size: var(--font-size-page-title);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.muted {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lead);
  line-height: var(--line-height-relaxed);
}

.detail {
  font-size: var(--font-size-detail);
  line-height: var(--line-height-snug);
  color: var(--color-text-body);
}

button {
  margin-top: var(--space-button-top);
  padding: var(--space-button-y) var(--space-button-x);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--font-size-base);
}

.nav {
  margin-top: var(--space-nav-top);
  font-size: var(--font-size-lead);
  line-height: var(--line-height-snug);
}

.nav a {
  color: var(--color-link);
}

.nav-logout {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font: inherit;
  font-size: inherit;
  line-height: inherit;
  color: var(--color-link);
  text-decoration: underline;
}

.nav-logout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.nav-delete-account {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font: inherit;
  font-size: inherit;
  line-height: inherit;
  color: var(--color-invalid);
  text-decoration: underline;
}

.nav-delete-account:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-account-error {
  margin: var(--space-nav-top) 0 0;
  font-size: var(--font-size-detail);
  color: var(--color-invalid);
}
</style>

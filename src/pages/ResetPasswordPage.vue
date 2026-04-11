<script setup lang="ts">
import { useResetPasswordForm } from '@/features/auth/model/resetPassword'
import { AuthFormWidget, AuthSplitLayout } from '@/widgets/auth'
import AuthPasswordField from '@/shared/ui/AuthPasswordField.vue'
import AuthPrimaryButton from '@/shared/ui/AuthPrimaryButton.vue'
import AuthScreenTitle from '@/shared/ui/AuthScreenTitle.vue'

const {
  newPassword,
  newPasswordConfirm,
  loading,
  errorMessage,
  apiErrorFieldScope,
  done,
  queryValid,
  submit,
  clearError,
  passwordConfirmFieldError,
} = useResetPasswordForm()
</script>

<template>
  <AuthSplitLayout :show-hero="false">

    <!-- Успех -->
    <div v-if="done" class="reset-result">
      <AuthScreenTitle text="Пароль был восстановлен" />
      <p class="reset-result__lead">
        Перейдите на страницу авторизации, чтобы войти в свою учетную запись
      </p>
      <AuthPrimaryButton
        to="/login"
        variant="neutral"
        label="Назад в авторизацию"
        loose-top
      />
    </div>

    <!-- Ошибка: нет валидной ссылки -->
    <div v-else-if="!queryValid" class="reset-result">
      <AuthScreenTitle text="Пароль не был восстановлен" />
      <p class="reset-result__lead">
        По какой-то причине вам не удалось изменить ваш пароль.
        Попробуйте ещё раз или запросите письмо повторно.
      </p>
      <AuthPrimaryButton
        to="/login"
        variant="neutral"
        label="Назад в авторизацию"
        loose-top
      />
      <RouterLink class="reset-result__retry" to="/forgot-password">
        Попробовать снова
      </RouterLink>
    </div>

    <!-- Форма -->
    <div v-else class="reset-form-wrap">
      <AuthFormWidget
        title="Задайте пароль"
        description="Напишите новый пароль, который будете использовать для входа"
        :loading="loading"
        :error-message="errorMessage"
        :api-error-field-scope="apiErrorFieldScope"
        submit-label="Изменить пароль"
        submit-label-loading="Изменение…"
        max-width="480px"
        @submit="submit"
        @clear-error="clearError"
      >
        <div class="reset-form-fields">
          <AuthPasswordField
            id="reset-new"
            v-model="newPassword"
            autocomplete="new-password"
            placeholder="Введите пароль"
            ariaLabel="Новый пароль"
            :invalid-border="Boolean(passwordConfirmFieldError)"
            paired-error-id="reset-new2-error"
            @clear-field-error="passwordConfirmFieldError = ''"
          />
          <AuthPasswordField
            id="reset-new2"
            v-model="newPasswordConfirm"
            autocomplete="new-password"
            placeholder="Повторите пароль"
            ariaLabel="Подтвердите пароль"
            :field-error="passwordConfirmFieldError"
            @clear-field-error="passwordConfirmFieldError = ''"
          />
        </div>
      </AuthFormWidget>
    </div>

  </AuthSplitLayout>
</template>

<style scoped>
/* ——— Общий блок результата (success / error) ——— */
.reset-result {
  width: 100%;
  max-width: 480px;
  font-family: var(--font-family-sans);
}

.reset-result__lead {
  margin: 16px 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
  max-width: 420px;
}

.reset-result__retry {
  display: block;
  margin-top: 16px;
  text-align: center;
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  text-decoration: none;
}

.reset-result__retry:hover {
  text-decoration: underline;
}

/* ——— Форма ——— */
.reset-form-wrap :deep(.auth-intro) {
  color: var(--color-text-tertiary);
  line-height: 1.6;
  max-width: 448px;
}

.reset-form-fields {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
</style>

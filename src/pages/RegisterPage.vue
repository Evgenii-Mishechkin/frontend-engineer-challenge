<script setup lang="ts">
import { useRegisterForm } from '@/features/auth'
import AuthPasswordField from '@/shared/ui/AuthPasswordField.vue'
import AuthTextField from '@/shared/ui/AuthTextField.vue'
import { AuthFormWidget, AuthSplitFooter, AuthSplitLayout } from '@/widgets/auth'

const {
  email,
  password,
  passwordConfirm,
  loading,
  errorMessage,
  apiErrorFieldScope,
  submit,
  clearError,
  emailFieldError,
  passwordConfirmFieldError,
} = useRegisterForm()
</script>

<template>
  <AuthSplitLayout>
    <AuthFormWidget
      title="Регистрация в системе"
      :loading="loading"
      :error-message="errorMessage"
      :api-error-field-scope="apiErrorFieldScope"
      :submit-disabled="Boolean(emailFieldError)"
      submit-label="Зарегистрироваться"
      submit-label-loading="Отправка…"
      @submit="submit"
      @clear-error="clearError"
    >
      <AuthTextField
        id="reg-email"
        v-model="email"
        type="email"
        autocomplete="email"
        float-label="E-mail"
        placeholder="Введите e-mail"
        ariaLabel="Email"
        :field-error="emailFieldError"
        @clear-field-error="emailFieldError = ''"
      />
      <AuthPasswordField
        id="reg-password"
        v-model="password"
        autocomplete="new-password"
        float-label="Пароль"
        placeholder="Введите пароль"
        ariaLabel="Password"
        :invalid-border="Boolean(passwordConfirmFieldError)"
        paired-error-id="reg-password2-error"
        @clear-field-error="passwordConfirmFieldError = ''"
      />
      <AuthPasswordField
        id="reg-password2"
        v-model="passwordConfirm"
        autocomplete="new-password"
        float-label="Повторите пароль"
        placeholder="Подтвердите пароль"
        ariaLabel="Confirm password"
        :field-error="passwordConfirmFieldError"
        @clear-field-error="passwordConfirmFieldError = ''"
      />
      <template #belowButton>
        <p class="auth-legal">
          Нажимая «Зарегистрироваться», вы соглашаетесь с
          <RouterLink to="/terms">Условиями использования</RouterLink>
          и
          <RouterLink to="/privacy">Политикой конфиденциальности</RouterLink>.
        </p>
      </template>
    </AuthFormWidget>
    <template #footer>
      <AuthSplitFooter
        hint="Уже есть аккаунт?"
        link-text="Войти"
        link-to="/login"
      />
    </template>
  </AuthSplitLayout>
</template>

<style scoped>
.auth-legal {
  margin: var(--space-none);
  font-size: var(--font-size-legal);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-legal);
}

.auth-legal a {
  color: var(--color-text-legal);
  text-decoration: underline;
}
</style>

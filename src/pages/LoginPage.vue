<script setup lang="ts">
import { useLoginForm } from '@/features/auth/model/loginForm'
import AuthPasswordField from '@/shared/ui/AuthPasswordField.vue'
import AuthTextField from '@/shared/ui/AuthTextField.vue'
import { AuthFormWidget, AuthSplitFooter, AuthSplitLayout } from '@/widgets/auth'

const {
  email,
  password,
  loading,
  errorMessage,
  apiErrorFieldScope,
  statusHint,
  submit,
  clearError,
  emailFieldError,
  passwordFieldError,
} = useLoginForm()
</script>

<template>
  <AuthSplitLayout>
    <AuthFormWidget
      title="Войти в систему"
      :loading="loading"
      :error-message="errorMessage"
      :api-error-field-scope="apiErrorFieldScope"
      :hint="statusHint"
      :submit-disabled="Boolean(emailFieldError || passwordFieldError)"
      submit-label="Войти"
      submit-label-loading="Вход…"
      tertiary-to="/forgot-password"
      tertiary-text="Забыли пароль?"
      @submit="submit"
      @clear-error="clearError"
      max-width="400px"
    >
      <AuthTextField
        id="login-email"
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
        id="login-password"
        v-model="password"
        autocomplete="current-password"
        float-label="Пароль"
        placeholder="Введите пароль"
        ariaLabel="Password"
        :field-error="passwordFieldError"
        @clear-field-error="passwordFieldError = ''"
      />
    </AuthFormWidget>
    <template #footer>
      <AuthSplitFooter
        hint="Еще не зарегистрированы?"
        link-text="Регистрация"
        link-to="/register"
      />
    </template>
  </AuthSplitLayout>
</template>

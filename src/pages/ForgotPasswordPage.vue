<script setup lang="ts">
import { useForgotPasswordRequest } from '@/features/auth'
import { isValidEmail } from '@/shared/lib/validation/isValidEmail'
import { AuthFormWidget, AuthSplitLayout } from '@/widgets/auth'
import AuthTextField from '@/shared/ui/AuthTextField.vue'
import { computed } from 'vue'

const { email, loading, errorMessage, apiErrorFieldScope, submit, clearError, emailFieldError } =
  useForgotPasswordRequest()

const canSubmitForgot = computed(() => isValidEmail(email.value) && !emailFieldError.value)
</script>

<template>
  <AuthSplitLayout :show-hero="false">
    <AuthFormWidget
      title="Восстановление пароля"
      title-back-to="/login"
      title-back-aria-label="Назад к входу"
      :loading="loading"
      :error-message="errorMessage"
      :api-error-field-scope="apiErrorFieldScope"
      :submit-disabled="!canSubmitForgot"
      description="Укажите адрес почты, на который был зарегистрирован аккаунт"
      submit-label="Восстановить пароль"
      submit-label-loading="Отправка…"
      @submit="submit"
      @clear-error="clearError"
      max-width="480px"
    >
      <AuthTextField
        id="forgot-email"
        v-model="email"
        type="email"
        autocomplete="email"
        float-label="E-mail"
        placeholder="Введите e-mail"
        ariaLabel="Email"
        :field-error="emailFieldError"
        @clear-field-error="emailFieldError = ''"
      />
    </AuthFormWidget>
  </AuthSplitLayout>
</template>

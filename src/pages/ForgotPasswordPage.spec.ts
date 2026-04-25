import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { AUTH_FIELD_ERROR_INVALID_EMAIL } from '@/shared/config/authFieldErrors'
import ForgotPasswordPage from './ForgotPasswordPage.vue'

describe('ForgotPasswordPage', () => {
  it('показывает inline-ошибку при отправке пустого email', async () => {
    const wrapper = mount(ForgotPasswordPage)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain(AUTH_FIELD_ERROR_INVALID_EMAIL)
    expect(wrapper.find('#forgot-email-error').exists()).toBe(true)
  })
})

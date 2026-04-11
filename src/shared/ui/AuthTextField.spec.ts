import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthTextField from './AuthTextField.vue'

function mountField(props: Record<string, unknown> = {}) {
  return mount(AuthTextField, {
    props: {
      id: 'test-field',
      modelValue: '',
      ariaLabel: 'Test field',
      ...props,
    },
  })
}

describe('AuthTextField', () => {
  describe('базовый рендер', () => {
    it('рендерит <input>', () => {
      const wrapper = mountField()
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('передаёт type в input', () => {
      const wrapper = mountField({ type: 'email' })
      expect(wrapper.find('input').attributes('type')).toBe('email')
    })

    it('передаёт autocomplete', () => {
      const wrapper = mountField({ autocomplete: 'email' })
      expect(wrapper.find('input').attributes('autocomplete')).toBe('email')
    })
  })

  describe('fieldError', () => {
    it('показывает текст ошибки при fieldError', () => {
      const wrapper = mountField({ fieldError: 'Ошибка теста' })
      expect(wrapper.text()).toContain('Ошибка теста')
    })

    it('не показывает ошибку без fieldError', () => {
      const wrapper = mountField({ fieldError: '' })
      // AuthFieldInlineError скрывает сообщение при пустой строке
      expect(wrapper.text()).not.toContain('Ошибка')
    })

    it('aria-invalid="true" при наличии ошибки', () => {
      const wrapper = mountField({ fieldError: 'Ошибка' })
      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    })

    it('aria-invalid отсутствует без ошибки', () => {
      const wrapper = mountField()
      expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()
    })
  })

  describe('события', () => {
    it('эмитит update:modelValue при вводе', async () => {
      const wrapper = mountField()
      await wrapper.find('input').setValue('hello')
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted![emitted!.length - 1]).toEqual(['hello'])
    })

    it('эмитит clear-field-error при вводе если есть fieldError', async () => {
      const wrapper = mountField({ fieldError: 'Ошибка' })
      await wrapper.find('input').trigger('input')
      expect(wrapper.emitted('clear-field-error')).toBeTruthy()
    })

    it('НЕ эмитит clear-field-error если fieldError пустой', async () => {
      const wrapper = mountField({ fieldError: '' })
      await wrapper.find('input').trigger('input')
      expect(wrapper.emitted('clear-field-error')).toBeFalsy()
    })
  })

  describe('float-label', () => {
    it('рендерит floatLabel в шаблоне', () => {
      const wrapper = mountField({ floatLabel: 'E-mail' })
      expect(wrapper.text()).toContain('E-mail')
    })
  })
})

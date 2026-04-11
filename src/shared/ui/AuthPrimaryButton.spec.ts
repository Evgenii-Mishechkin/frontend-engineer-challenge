import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthPrimaryButton from './AuthPrimaryButton.vue'

describe('AuthPrimaryButton', () => {
  describe('рендер без `to` → <button>', () => {
    it('рендерит тег <button>', () => {
      const wrapper = mount(AuthPrimaryButton, { props: { label: 'Submit' } })
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('a').exists()).toBe(false)
    })

    it('отображает label', () => {
      const wrapper = mount(AuthPrimaryButton, { props: { label: 'Войти' } })
      expect(wrapper.find('button').text()).toBe('Войти')
    })

    it('отображает loadingLabel при loading=true', () => {
      const wrapper = mount(AuthPrimaryButton, {
        props: { label: 'Войти', loadingLabel: 'Загрузка…', loading: true },
      })
      expect(wrapper.find('button').text()).toBe('Загрузка…')
      expect(wrapper.find('button').attributes('aria-busy')).toBe('true')
    })

    it('disabled при loading=true', () => {
      const wrapper = mount(AuthPrimaryButton, {
        props: { label: 'Войти', loading: true },
      })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('disabled при disabled=true', () => {
      const wrapper = mount(AuthPrimaryButton, {
        props: { label: 'Войти', disabled: true },
      })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })
  })

  describe('варианты классов', () => {
    it('вариант primary → класс auth-btn--primary', () => {
      const wrapper = mount(AuthPrimaryButton, {
        props: { label: 'Click', variant: 'primary' },
      })
      expect(wrapper.find('button').classes()).toContain('auth-btn--primary')
    })

    it('вариант neutral → класс auth-btn--neutral', () => {
      const wrapper = mount(AuthPrimaryButton, {
        props: { label: 'Click', variant: 'neutral' },
      })
      expect(wrapper.find('button').classes()).toContain('auth-btn--neutral')
    })

    it('looseTop=true → класс auth-btn--loose-top', () => {
      const wrapper = mount(AuthPrimaryButton, {
        props: { label: 'Click', looseTop: true },
      })
      expect(wrapper.find('button').classes()).toContain('auth-btn--loose-top')
    })

    it('looseTop=false → нет класса auth-btn--loose-top', () => {
      const wrapper = mount(AuthPrimaryButton, {
        props: { label: 'Click', looseTop: false },
      })
      expect(wrapper.find('button').classes()).not.toContain('auth-btn--loose-top')
    })
  })

  describe('рендер с `to` → <a> (RouterLink)', () => {
    it('при to="/login" рендерит <a>, а не <button>', () => {
      const wrapper = mount(AuthPrimaryButton, {
        props: { label: 'Назад', to: '/login', variant: 'neutral' },
      })
      expect(wrapper.find('a').exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('при to="/login" + disabled=true рендерит <button> (заблокирован)', () => {
      const wrapper = mount(AuthPrimaryButton, {
        props: { label: 'Назад', to: '/login', disabled: true },
      })
      // isBlocked=true → RouterLink не рендерится, падаем в <button>
      expect(wrapper.find('button').exists()).toBe(true)
    })
  })
})

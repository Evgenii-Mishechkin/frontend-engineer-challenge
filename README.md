# Orbitto — Frontend Engineer Challenge

Реализация frontend для auth-флоу сервиса Orbitto.  
Выполнено как ответ на [Advanced Frontend Engineer Challenge](https://github.com/atls-academy/frontend-engineer-challenge).

---

## Быстрый старт

### Требования

- Node.js ≥ 18
- Docker + Docker Compose (для бэкенда)

### 1. Запустить бэкенд

```bash
cd backend
docker compose up -d
```

GraphQL API будет доступен на `http://localhost:8080/graphql`.

### 2. Запустить frontend

```bash
cd frontend
npm ci
npm run dev    # http://localhost:5173
```

### Переменные окружения

По умолчанию frontend обращается к `http://localhost:8080/graphql`.  
Чтобы переопределить — создайте `.env.local`:

```
VITE_GRAPHQL_URL=http://your-host/graphql
```

### Тесты

```bash
npm run test            # один прогон (CI-режим)
npm run test:watch      # watch-режим (разработка)
npm run test:coverage   # с отчётом по покрытию
```

---

## Ссылки

| | |
|---|---|
| **Backend fork** | https://github.com/telman03/engineer-challenge |
| **Figma** | [Orbitto Service](https://www.figma.com/design/xXXnfRpt4wRN0qzy2LJaHR/Orbitto-_-Service--Copy-) |

---

## Архитектура frontend

### Стек

| Инструмент | Версия | Роль |
|---|---|---|
| Vue 3.5 | `^3.5` | UI-фреймворк |
| TypeScript | `~5.9` | Строгая типизация |
| Vite 8 | `^8.0` | Сборка и dev-сервер |
| Pinia 3 | `^3.0` | Глобальное состояние (сессия) |
| Vue Router 4 | `4` | Роутинг, навигационные гарды |
| Vitest 4 | `^4.1` | Юнит и компонентные тесты |
| @vue/test-utils | `^2.4` | Тестирование компонентов |

### Почему Vue 3.5, а не React

Рассматривалось два варианта: **Vue 3.5** и **React**. Выбор в пользу Vue был осознанным, а не по умолчанию.

Посмотрев на масштаб задачи — auth-флоу и проект в целом — решил: не городить JSX/TSX, настраивать styled-components или CSS-модули, выбирать между Redux/Zustand/ не имеет смысла. Vue закрывает эту задачу чище и с меньшим количеством движущихся частей.

**Конкретные причины:**

- **SFC (Single File Component)** — шаблон, логика и скоуп-стили в одном `.vue` файле. При ревью или поддержке открываешь один файл и видишь полную картину. В React для того же эффекта нужны дополнительные соглашения.
- **Реактивность без правил хуков.** `ref`, `computed`, `watch` — встроены и предсказуемы. Нет deps-массивов, нет `useCallback`/`useMemo` для предотвращения лишних ре-рендеров. Меньше ментальной нагрузки при написании composables.
- **Pinia** — TypeScript-first стейт-менеджер без бойлерплейта. Вся логика сессии в одном store, без экшнов, редьюсеров и диспатча.
- **Scoped styles из коробки.** CSS компонента не утекает наружу — не нужны CSS Modules или `styled-components`.
- **Естественная пара с FSD.** Vue Composition API позволяет выносить бизнес-логику слоя в чистые composable-функции без привязки к DOM или компоненту — это идеально ложится в `features/auth/model/`.

**Почему не React:** React — правильный выбор для большой команды с устоявшейся React-экспертизой и сложным UI с серверным рендерингом. В нашем случае JSX и инфраструктура React добавили бы шума без реальной выгоды. Auth-флоу не нуждается в Server Components или сложной оркестрации.

### Структура слоёв (Feature-Sliced Design)

```
src/
├── app/                   # Инициализация: router, плагины, навигационные гарды
│   └── router/            # Гард requiresAuth, hero-анимации между страницами
│
├── pages/                 # Страницы (тонкий слой, только композиция)
│   ├── LoginPage.vue
│   ├── RegisterPage.vue
│   ├── ForgotPasswordPage.vue
│   ├── ForgotPasswordSentPage.vue
│   └── ResetPasswordPage.vue
│
├── widgets/auth/          # Крупные составные блоки
│   ├── AuthSplitLayout    # Двухколоночный layout с hero-иллюстрацией
│   ├── AuthFormWidget     # Форма с заголовком, ошибками, кнопкой, футером
│   └── AuthResultPanel    # Блок результата (успех/ошибка)
│
├── features/auth/model/   # Бизнес-логика каждого сценария
│   ├── loginForm.ts
│   ├── registerForm.ts
│   ├── forgotPassword.ts
│   └── resetPassword.ts
│
├── entities/session/      # Модель сессии: хранилище, API, хранение токенов
│   ├── session.store.ts   # Pinia store: login / logout / refresh / deleteAccount
│   ├── auth.api.ts        # GraphQL-запросы (сырой уровень)
│   └── storage.ts         # localStorage persist сессии
│
└── shared/                # Переиспользуемые примитивы без бизнес-знаний
    ├── api/               # graphqlRequest, firstGraphQLErrorMessage
    ├── config/            # Env, публичные ассеты, константы ошибок полей
    ├── lib/               # useAsyncFormSubmit, presentAuthApiError, isValidEmail
    └── ui/                # AuthPrimaryButton, AuthTextField, AuthPasswordField,
                           # AuthFieldInlineError, AuthScreenTitle, MobileGateScreen
```

FSD выбран потому что auth-флоу уже сейчас состоит из 4 сценариев с пересекающейся логикой — слои дают чёткие границы импортов и делают видимым, кто о чём знает.

### Ключевые инженерные решения

#### Известные компромиссы безопасности

**Регистрация — user enumeration.** При попытке зарегистрировать уже занятый email бэкенд возвращает ошибку `email already registered`, и фронт показывает inline-сообщение «Этот адрес уже зарегистрирован». Это позволяет определить, зарегистрирован ли конкретный адрес, простым перебором.

Устранение: либо возвращать нейтральное сообщение («Если адрес свободен, аккаунт будет создан») с последующим подтверждением по email, либо вводить rate limiting и CAPTCHA на уровне API для снижения практической применимости атаки. Текущее поведение типично для большинства сервисов и осознанно оставлено ради UX.

---

#### Маршрутизация ошибок бэкенда

`presentAuthApiError` — единственное место, где строки ошибок Go-бэкенда переводятся в русский текст и в `fieldScope` (какое поле подсветить). Все composables получают готовый `{ message, fieldScope }` через `useAsyncFormSubmit`.

Для специфичных сценариев (неверные credentials при логине, занятый email при регистрации, email не найден при forgot password) ошибка перехватывается **до** попадания в баннер и кладётся прямо в `fieldError` нужного поля.

#### Anti-enumeration в forgot password

Бэкенд всегда возвращает `{ success: true }` независимо от того, существует ли email — это намеренная защита от перебора адресов (user enumeration) на уровне Go (см. `request_password_reset.go`).

Фронт **также не раскрывает эту информацию**: при любом ответе (пустой или непустой `token`) пользователь всегда попадает на страницу «Проверьте свою почту». Показывать inline-ошибку «email не найден» было бы равнозначно обходу серверной защиты — атакующий мог бы перебирать адреса, наблюдая за реакцией UI.

В dev-режиме токен сохраняется в `sessionStorage` (только если непустой), чтобы не открывать форму сброса вручную.

Подробный комментарий оставлен прямо в коде `forgotPassword.ts`.

#### Дизайн-система через CSS custom properties

Все значения (цвета, шрифты, отступы, радиусы, брейкпоинты) объявлены один раз в `:root` в `style.css`. Компоненты используют только `var(--*)`. Если дизайн изменится — правится одно место.

#### Адаптивность без JS

Мобильная заглушка (`MobileGateScreen`) — CSS-оверлей `position: fixed` с `display: none` на десктопе. Никаких `window.innerWidth` в коде, никакого FOUC. Брейкпоинт `834px` объявлен токеном `--breakpoint-mobile-gate` в `style.css`.

#### Защита от race conditions

- Кнопка блокируется (`disabled`) на время запроса — повторная отправка невозможна
- `session.store` дедуплицирует конкурентные вызовы `refreshAccessToken` через `refreshPromise`
- После успешной формы кнопка остаётся заблокированной (поле ошибки очищается только при взаимодействии пользователя с полем)

#### Hero-анимация между страницами

При переходе `forgot-password → login` правая колонка с иллюстрацией «раскрывается» через CSS transition на `max-width`. Логика управляется флагом в `authHeroTransition.ts` и читается в `AuthSplitLayout.vue` через `onMounted`. `prefers-reduced-motion` уважается.

---

## Trade-offs

| Решение | Причина | Последствие |
|---|---|---|
| npm как единый package manager | Один lock-файл делает установку воспроизводимой через `npm ci` | Для разработки и CI используются только npm-команды |
| Нет codegen для GraphQL | Бэкенд не отдаёт introspection в prod-режиме | Типы GraphQL-ответов написаны вручную в `auth.api.ts`; при изменении контракта нужно обновлять руками |
| `presentAuthApiError` — строковый матчинг | Go-бэкенд не возвращает typed error codes | Хрупко при рефакторинге бэкенда; следующий шаг — ввести коды ошибок на уровне GraphQL extensions |
| Нет HTTP-интерсептора для 401 | В текущих сценариях (auth-флоу) токены всегда свежие | `refreshAccessToken` в store готов, но не подключён к fetch-клиенту; при появлении защищённых API-вызовов нужно добавить интерсептор |
| Мобильная заглушка вместо адаптивных форм | Дизайн Figma не предусматривает мобильную форму | Приемлемо для MVP; в prod нужен полноценный мобильный UX |

---

## Следующий шаг в production

1. ~~**HTTP-интерсептор**~~ — реализован: `graphqlRequestWithAuth` в `entities/session/graphqlWithAuth.ts` перехватывает `HttpError(401)`, вызывает `refreshAccessToken` и повторяет запрос. Все защищённые операции используют эту обёртку вместо `graphqlRequest`.
2. **GraphQL error codes** — договориться с бэком о `extensions.code` вместо парсинга строк
3. **Codegen** — `graphql-codegen` для типобезопасных операций без ручных типов
4. **E2E-тесты** — Playwright со сценариями полного auth-флоу против реального (или mock) бэкенда
5. **Error tracking** — Sentry с `beforeSend` фильтрацией PII; добавить `sessionId` в контекст
6. **CSP + безопасность** — Content-Security-Policy заголовки, `httpOnly` cookies для refresh token вместо localStorage
7. **Мобильный UX** — полноценные адаптивные формы вместо заглушки

---

## Тестирование

51 тест, 6 файлов, ~30 сек.

```
src/shared/lib/api/presentAuthApiError.spec.ts   — маппинг всех ошибок бэкенда
src/features/auth/model/forgotPassword.spec.ts   — forgot password: пустой токен, успех, DEV-storage
src/features/auth/model/loginForm.spec.ts        — login: invalid credentials, clearError, редирект
src/features/auth/model/registerForm.spec.ts     — register: занятый email, мисматч паролей, успех
src/shared/ui/AuthPrimaryButton.spec.ts          — button/RouterLink, варианты, disabled
src/shared/ui/AuthTextField.spec.ts              — fieldError, aria-invalid, события
```

Запуск:

```bash
npm run test
```

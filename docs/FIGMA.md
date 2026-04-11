# Макет Orbitto (Figma)

**Рабочая копия (доступна для чтения из Cursor / Figma MCP):**  
[Orbitto | Service — Copy](https://www.figma.com/design/xXXnfRpt4wRN0qzy2LJaHR/Orbitto-_-Service--Copy-?node-id=102-12338&t=JbJ7WC5W18qmK4Fx-1) — `fileKey`: `xXXnfRpt4wRN0qzy2LJaHR`.

**Узел `31-19179` (`31:19179`):** целый **canvas** «Dashboard / Desktop» — внутри и дашборд, и блок авторизации; для кода такой узел слишком большой. Лучше ссылки на **отдельные фреймы** (тот же файл `xXXnfRpt4wRN0qzy2LJaHR`):

| Сценарий | Фрейм в Figma | `node-id` для ссылки |
|----------|----------------|----------------------|
| Регистрация (дефолт) | Sign up / Default | `99-12568` |
| Вход (дефолт) | Sign in / Default | `101-12104` |
| Восстановление, шаг 1 | Password recovery (Step 1) / Default | `101-12126` |
| Новый пароль (шаг 3) | Password recovery (Step 3) / Default | `102-12095` |

Пример: [Sign in / Default](https://www.figma.com/design/xXXnfRpt4wRN0qzy2LJaHR/Orbitto-_-Service--Copy-?node-id=101-12104).

**Реализация:** split-layout и токены цветов/типографики по узлу [`99-12568`](https://www.figma.com/design/xXXnfRpt4wRN0qzy2LJaHR/Orbitto-_-Service--Copy-?node-id=99-12568) — `widgets/auth/AuthSplitLayout.vue`, `widgets/auth/authForm.css`, глобальные токены в `style.css`, пути к картинкам в `shared/config/publicAssets.ts` и `public/img/`.

**Узел `102-12338`:** слой **Image** — только иллюстрация справа, не форма.

**Старая ссылка (другой `fileKey`):**  
[31KetUbya482vMSGgyiNIf …](https://www.figma.com/design/31KetUbya482vMSGgyiNIf/Orbitto-%7C-Service--Copy-?node-id=102-12806&t=TMlkJ3c3j3vJF5fb-4) — в MCP могла не открываться из‑за прав.

## Область по условию челленджа

Нужны **только** пользовательские сценарии auth:

| Сценарий | Что в интерфейсе | Маршрут в приложении |
|----------|------------------|----------------------|
| Регистрация | Форма создания аккаунта | `/register` |
| Авторизация | Вход по email/паролю | `/login` |
| Восстановление пароля | Запрос сброса + ввод нового пароля по токену | `/forgot-password`, `/reset-password?email=&token=` |

Остальные разделы макета (дашборд, настройки сервиса и т.д.) **в рамках этого задания не берём**, если только не нужны как общий layout — фокус на перечисленных экранах и их состояниях (loading / error / success).

## Сопоставление с бэкендом

Контракт GraphQL: `../backend/docs/API.md` (мутации `register`, `login`, `requestPasswordReset`, `resetPassword`).

## Примечание для вёрстки

Чтобы подогнать пиксели 1:1, откройте в Figma кадры именно для **auth** и при необходимости приложите экспорт или уточните имена фреймов — тогда можно сопоставить классы и токены по слоям.

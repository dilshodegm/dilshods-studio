# Dilshod's Studio — рабочий инструмент для бренд-дизайна

Этот файл — полный контекст проекта для Claude Code. Положи его в корень нового репозитория вместе с `template.json`.

Общение с владельцем проекта — на русском. Код, имена файлов, коммиты и интерфейс — на английском.

---

## 1. Кто и зачем

**Владелец:** Dilshod Egamnazarov, UI/UX и бренд-дизайнер из Ташкента, идёт к фрилансу и собственной студии. Знает Figma, React, TypeScript, GSAP; работает с Claude Code и Figma MCP. Объяснять базовые вещи React не нужно, но про бэкенд, базы данных и Cloudflare лучше объяснять простыми словами: это новая для него область.

**Задача:** личный веб-инструмент, который ведёт дизайнера по процессу создания бренда на каждом клиентском проекте. Раньше этот процесс был шаблоном в Figma; теперь он должен жить на сайте, где у каждого проекта свои сохранённые ответы, чек-листы и мудборды.

**Пользователь:** один человек (сам Dilshod). Клиенты получают только ссылки «только просмотр» на отдельные материалы.

---

## 2. Принятые решения

| Вопрос | Решение | Почему |
|---|---|---|
| Где живёт | Поддомен `studio.dilshodegm.com` | Портфолио `dilshodegm.com` остаётся публичным и статическим; инструмент закрытый и деплоится независимо |
| Репозиторий | Новый, отдельный от сайта (например `dilshodegm/dilshods-studio`) | Сайт и инструмент не ломают друг друга |
| Платформа | Cloudflare (домен уже там) | Всё в одном аккаунте, бесплатные лимиты подходят |
| База данных | Cloudflare **D1** (SQLite) | Проекты, ответы, чек-листы, порядок элементов мудборда |
| Файлы | Cloudflare **R2** | Картинки мудбордов и слотов; 10 ГБ бесплатно, исходящий трафик бесплатный |
| API | Cloudflare Workers (или Pages Functions) с привязками к D1 и R2 | Своего бэкенда у сайта нет, пишем небольшой |
| Вход | **Cloudflare Access** на весь поддомен (почта или Google), без своего кода авторизации | Бесплатно до 50 пользователей; пользователь один |
| Ссылки клиенту | Публичный маршрут `/share/:token` и `/api/share/*`, исключённый из Access | Клиент видит только конкретный мудборд или страницу |
| Мудборд | **Сетка (masonry)** внутри каждой территории, а не свободный холст | Быстро, аккуратно, в стиле владельца. Свободный холст (tldraw) — возможное расширение позже, данные при этом не меняются |
| Стили | Обычный CSS с токенами, как на сайте. **Без Tailwind** | Инструмент должен выглядеть частью dilshodegm.com |
| Структура шаблона | Живёт в коде (`template.json`), в базе хранятся только ответы по стабильным ключам | Шаблон можно улучшать, не мигрируя данные |
| Бюджет | $0 на бесплатных тарифах, кроме продления домена | |

Лимиты бесплатного Workers: 100 000 запросов в день и **10 мс CPU на запрос**. Поэтому всё тяжёлое (сжатие картинок, извлечение палитры) делаем в браузере, а сервер только сохраняет и отдаёт данные.

---

## 3. Стек (по образцу сайта)

Сайт-портфолио: репозиторий `github.com/dilshodegm/dilshods-blog` (публичный). Он статический, судя по всему деплоится через Cloudflare Pages из GitHub; `wrangler`-конфига и серверных функций там нет.

Стек сайта, который повторяем:

- Vite 8, React 19, TypeScript 6, react-router-dom 7
- Обычный CSS: `src/styles/tokens.css` (токены), `src/index.css` (reset), `src/styles/layout.css` (общий каркас страницы)
- GSAP есть на сайте; в инструменте использовать умеренно или не использовать
- ESLint (typescript-eslint, react-hooks)

Добавляется для инструмента:

- `wrangler` для локальной разработки и деплоя
- D1 и R2 привязки
- Возможно, лёгкие библиотеки: drag-and-drop для сортировки (например `@dnd-kit`), извлечение палитры в браузере. Перед добавлением зависимости спросить владельца.

---

## 4. Визуальный стиль

Минимализм: белый фон, один тёмный цвет, моноширинный шрифт, тонкие линии-разделители сверху блоков, никаких скруглений и теней, много воздуха.

Токены сайта (`tokens.css`, выгружены из Figma-файла блога). Копировать их в инструмент как основу:

```css
--dark-gray: #393939;
--white: #ffffff;
--light-gray: #e7e7e7;
--black: #000000;
--font-family-base: "Space Mono", ui-monospace, "Cascadia Mono", monospace;
/* h1: 32px / 400 / line-height 1 / letter-spacing -0.02em */
/* h3: 24px / 400 / line-height 1 / letter-spacing -0.02em */
/* body: 16px / 400;  body-bold: 16px / 700 */
--radius-none: 0;
--bp-tablet: 1024px; --bp-mobile: 600px;
```

Паттерны из Figma-шаблона процесса, которые переносим в интерфейс:

- **Шапка страницы:** слева название фазы жирным (`01 discovery`), справа код и название страницы (`01.1 client brief`).
- **Левая колонка ~520px:** заголовок h1, описание серым (тёмный цвет с прозрачностью 50%), внизу блок-подсказка с линией сверху (`how to`, `test`, `source`, `skip if`, `next`).
- **Правая часть:** поля в две колонки. Поле = линия сверху, подпись жирным, под ней текст ответа; пока ответа нет, показывается подсказка серым.
- **Подвал:** `brand design process` и номер страницы.
- **Обложка фазы:** огромный номер и название (в Figma 196px, номер regular, название bold), снизу строка-описание h1 и список этапов справа.
- Текстовые стили в Figma-шаблоне `body` и `body-bold` переводят текст в нижний регистр (`textCase: LOWER`). В интерфейсе можно повторить через `text-transform: lowercase` для подписей.

**Открытый вопрос:** в Figma-шаблоне основной тёмный — `#1a1a1a`, на сайте — `#393939`. По умолчанию брать `#393939` (токены сайта), подтвердить у владельца.

**Кириллица:** насколько известно, Space Mono не содержит кириллицы. Интерфейс и шаблон сейчас на английском. Если владелец захочет вводить ответы на русском или узбекском (кириллица), нужен fallback-шрифт с кириллицей — проверить и обсудить.

---

## 5. Содержимое шаблона: `template.json`

Полное содержимое процесса лежит в `template.json` рядом с этим файлом. Не придумывать поля заново — строить интерфейс из этого файла.

Структура: `phases[] → pages[] → blocks[]`.

4 фазы, 31 страница:

| Фаза | Страницы |
|---|---|
| 01 Discovery | 01.0 overview, 01.1 client brief, 01.2 business, 01.3 audience, 01.4 competitors and category, 01.5 brand audit *(optional)*, 01.6 discovery summary |
| 02 Strategy | 02.1 purpose/vision/mission/values, 02.2 audience focus, 02.3 positioning, 02.4 brand idea, 02.5 personality, 02.6 tone of voice and messaging, 02.7 creative brief, 02.8 naming *(optional)*, 02.9 brand architecture *(optional)* |
| 03 Identity | 03.1 visual territories, 03.2 concepts, 03.3 logo, 03.4 colour, 03.5 typography, 03.6 imagery and graphic language, 03.7 applications, 03.8 review and sign-off |
| 04 Guidelines | 04.1 guideline structure, 04.2 brand guidelines, 04.3 asset library, 04.4 templates, 04.5 quality check, 04.6 handover and launch, 04.7 project close *(private)* |

Флаги страниц:

- `optional: true` — страницу можно отметить «пропущено» (brand audit, naming, architecture); она не считается в прогрессе.
- `exportable: true` — страницы, которые клиент подписывает (01.6 summary, 02.7 creative brief); нужен экспорт в PDF.
- `private: true` — страница только для дизайнера (04.7 project close); никогда не попадает в ссылки клиенту.

Типы блоков (`block.type`):

| Тип | Что это | Что хранится |
|---|---|---|
| `info` | Справочный текст, не редактируется | ничего |
| `field` | Многострочное текстовое поле: `label`, `hint` (плейсхолдер). `wide: true` — на всю ширину | текст |
| `signoff` | Подпись клиента | имя, дата, отметка «approved» |
| `table` | Таблица конкурентов: `columns`, `rows`, `allowAddRows` | значение ячейки по `rowKey.columnKey`; добавленные строки |
| `checklist` | Группа пунктов `items[]` | отмечен / не отмечен по каждому пункту |
| `slot` | Место под одну или несколько картинок (логотип, носитель, специмен) | картинки в R2 |
| `swatch` | Цветовой образец; поля в `page.swatchFields`: name, hex, rgb, cmyk, pantone | значения полей; превью цвета по hex |
| `territory` | Территория 03.1: поля `name`, `keywords` + **мудборд-сетка** | поля + элементы мудборда |
| `concept` | Концепция 03.2: слот-картинка + поля `idea`, `against_brief` | поля + картинки |

Ключи (`phase.key`, `page.key`, `block.key`, `item.key`) стабильные: на них ссылаются данные в базе. Если меняешь шаблон — не переименовывай существующие ключи, только добавляй новые. Поднимай `version` в `template.json`.

---

## 6. Модель данных (черновик, D1)

```sql
CREATE TABLE projects (
  id            TEXT PRIMARY KEY,          -- uuid
  name          TEXT NOT NULL,             -- название бренда / проекта
  client        TEXT,
  status        TEXT NOT NULL DEFAULT 'active',  -- active | done | archived
  figma_url     TEXT,                      -- ссылка на Figma-файл проекта (этап 03)
  template_version INTEGER NOT NULL,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

-- Ответы на field / signoff / swatch / table / поля territory и concept.
-- value — текст или JSON (signoff, swatch, table).
CREATE TABLE answers (
  project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  page_key      TEXT NOT NULL,             -- 'discovery.client_brief'
  block_key     TEXT NOT NULL,             -- 'why_now' или 'a.name' для территорий
  value         TEXT,
  updated_at    TEXT NOT NULL,
  PRIMARY KEY (project_id, page_key, block_key)
);

CREATE TABLE checks (
  project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  page_key      TEXT NOT NULL,
  item_key      TEXT NOT NULL,             -- 'logo.misuse'
  done          INTEGER NOT NULL DEFAULT 0,
  updated_at    TEXT NOT NULL,
  PRIMARY KEY (project_id, page_key, item_key)
);

-- Состояние страницы: пропущена (optional) / завершена.
CREATE TABLE page_state (
  project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  page_key      TEXT NOT NULL,
  skipped       INTEGER NOT NULL DEFAULT 0,
  completed_at  TEXT,
  PRIMARY KEY (project_id, page_key)
);

-- Картинки, заметки и цвета: мудборды территорий и слоты.
CREATE TABLE media_items (
  id            TEXT PRIMARY KEY,
  project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  page_key      TEXT NOT NULL,             -- 'identity.territories'
  block_key     TEXT NOT NULL,             -- 'a' | 'primary_logo' ...
  kind          TEXT NOT NULL,             -- image | note | color
  r2_key        TEXT,                      -- для image
  text          TEXT,                      -- для note / подпись
  color_hex     TEXT,                      -- для color
  width         INTEGER,                   -- размеры картинки, нужны для masonry
  height        INTEGER,
  position      REAL NOT NULL,             -- порядок; REAL, чтобы вставлять между
  created_at    TEXT NOT NULL
);
CREATE INDEX media_by_block ON media_items(project_id, page_key, block_key, position);

-- Ссылки «только просмотр» для клиента.
CREATE TABLE share_links (
  token         TEXT PRIMARY KEY,          -- длинный случайный токен
  project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  scope         TEXT NOT NULL,             -- 'page:identity.territories' | 'block:identity.territories.a'
  expires_at    TEXT,
  revoked       INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL
);
```

Ключ страницы в базе: `{phase.key}.{page.key}`, например `discovery.client_brief`.

**R2:** приватный бакет, ключи вида `projects/{projectId}/{pageKey}/{blockKey}/{mediaId}.webp`. Картинки отдаются через Worker (`/api/media/:id`), а не по публичному адресу бакета. Для ссылок клиенту — через `/api/share/:token/media/:id` с проверкой, что картинка входит в scope ссылки.

Перед загрузкой картинка сжимается в браузере (например до 2400px по длинной стороне, WebP), чтобы экономить 10 ГБ бесплатного R2. Палитра из картинки тоже извлекается в браузере.

---

## 7. API (черновик)

Все `/api/*`, кроме `/api/share/*`, закрыты Cloudflare Access. Worker дополнительно проверяет заголовок Access (`Cf-Access-Jwt-Assertion`), чтобы API нельзя было вызвать в обход.

```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id

GET    /api/projects/:id/pages/:pageKey          -> answers + checks + media + state
PUT    /api/projects/:id/answers                 -> { pageKey, blockKey, value }   (автосохранение)
PUT    /api/projects/:id/checks                  -> { pageKey, itemKey, done }
PUT    /api/projects/:id/pages/:pageKey/state    -> { skipped?, completed? }

POST   /api/projects/:id/media                   -> загрузка (multipart) или note/color
PATCH  /api/media/:mediaId                       -> position, text, color
DELETE /api/media/:mediaId                       -> удаляет и строку, и объект в R2
GET    /api/media/:mediaId                       -> отдаёт файл из R2

POST   /api/projects/:id/share                   -> создать ссылку { scope, expiresAt? }
DELETE /api/share/:token                         -> отозвать (закрыт Access)

GET    /api/share/:token                         -> публично: данные в пределах scope
GET    /api/share/:token/media/:mediaId          -> публично: картинка в пределах scope
```

---

## 8. Экраны

1. **Projects** — список проектов (название, клиент, текущая фаза, прогресс), кнопка нового проекта.
2. **Project overview** — четыре фазы с прогрессом, ссылки на страницы, ссылка на Figma-файл проекта.
3. **Phase cover** — обложка фазы в стиле Figma-шаблона.
4. **Page** — левая колонка (заголовок, описание, подсказка) + блоки страницы. Автосохранение с индикатором «saved». Навигация «предыдущая / следующая страница». Для optional — кнопка «skip».
5. **Moodboard (03.1)** — три территории; в каждой поля name/keywords и masonry-сетка. Загрузка перетаскиванием файлов и вставкой из буфера, сортировка перетаскиванием, заметки, цветовые образцы, извлечение палитры из картинки. Кнопка «share» создаёт ссылку.
6. **Share view** — публичная страница только для чтения, без навигации по инструменту.
7. **Print / export** — версия страниц для печати (`@media print`), чтобы сохранить 01.6 и 02.7 в PDF средствами браузера.

---

## 9. План работ (MVP по шагам)

Делать по порядку, каждый шаг — рабочий результат, который можно задеплоить.

1. **Каркас:** Vite + React + TS + react-router, токены и стили сайта, рендер всех фаз и страниц из `template.json` без сохранения. Проверить, что все 31 страница и все типы блоков отображаются.
2. **Инфраструктура:** `wrangler`, D1 база и миграции, R2 бакет, Worker API, локальная разработка (`wrangler dev`).
3. **Проекты и ответы:** список проектов, создание, автосохранение полей, чек-листы, состояние страниц, прогресс.
4. **Мудборд и слоты:** загрузка в R2 со сжатием, masonry-сетка, сортировка, заметки, цвета, палитра.
5. **Деплой:** проект в Cloudflare, поддомен `studio.dilshodegm.com`, Cloudflare Access на поддомен.
6. **Ссылки клиенту:** share-токены, публичный просмотр, исключение `/share/*` и `/api/share/*` из Access.
7. **Экспорт:** print-стили для подписываемых страниц.

Позже, не в MVP: свободный холст (tldraw), шаблоны проектов, поиск по проектам, публичная страница «my process» на основном сайте `dilshodegm.com/process`.

---

## 10. Что настраивает владелец вручную (в панели Cloudflare)

Claude Code готовит конфиги и команды, но некоторые шаги требуют входа в аккаунт Cloudflare:

- `wrangler login` (авторизация CLI в его аккаунте)
- создание D1 базы и R2 бакета (можно через `wrangler`, после логина)
- подключение репозитория к Cloudflare и привязка поддомена `studio.dilshodegm.com`
- настройка Cloudflare Access: приложение на поддомен, политика «только мой email», исключение (bypass) для `/share/*` и `/api/share/*`

Для каждого такого шага давать короткую пошаговую инструкцию по-русски. Не угадывать пути в меню панели Cloudflare — они меняются; сверяться с актуальной документацией `developers.cloudflare.com`.

Перед выбором между «Workers со статикой» и «Pages + Functions» проверить текущие рекомендации Cloudflare для новых проектов.

---

## 11. Связанные материалы

- **Figma-файл шаблона:** «Dilshods Brand Design Process», fileKey `d8ELIg7i91xf9p7Bmkaom5`. Страница `Page 1`: обложка, цитата Paula Scher, затем фреймы 1920×1080 по фазам (`01 discovery / …`, `02 strategy / …`, `03 visual identity / …`), фрейм `components` с компонентами `field` (свойства `label`, `answer`) и `placeholder` (свойство `label`). Text Styles: `h1`, `h3`, `body`, `body-bold` (Space Mono). Переменные: `white` `#ffffff`, `black` `#1a1a1a`.
- **Известные недоделки в Figma (раздел 04):** заголовок обложки раздела 04 всё ещё «03 Identity», а восемь фреймов раздела 04 и вложенные `field` называются по-старому (`03 visual identity / review` и т. п.). Чек-листы в разделе 04 сделаны текстом `[ ]` внутри `field`. Figma MCP на тарифе Starter упирается в лимит вызовов, поэтому правки в Figma лучше делать вручную или когда лимит обновится.
- **Сайт-портфолио:** `github.com/dilshodegm/dilshods-blog`, источник токенов и стиля.

# Лабораторная работа №3 — Sass

## Автор
**Улискин Даниил Евгеньевич**  
Группа: **ФИТ-241**


## Структура
```text
portfolio/
├─ scss/
│  ├─ utils/
│  ├─ base/
│  ├─ layout/
│  ├─ components/
│  ├─ themes/
│  └─ main.scss
├─ js/
├─ data/
├─ images/
├─ dist/              
├─ index.html
├─ package.json
├─ package-lock.json
├─ .gitignore
└─ README.md
```

## Запуск с нуля
Требуется Node.js LTS и npm.

```bash
npm install
npm run build
```

После сборки запустите проект через Live Server в VS Code или другой локальный HTTP-сервер. AJAX-запросы к JSON не рассчитаны на открытие `index.html` напрямую через `file://`.

Для разработки Sass:
```bash
npm run sass:dev
```


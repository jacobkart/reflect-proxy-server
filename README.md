# Reflect Proxy Server

Прокси-сервер для обхода региональных ограничений и безопасной работы с API.

## Зачем нужен прокси?

1. **Работа без VPN:** AssemblyAI и Claude API могут быть недоступны в некоторых регионах
2. **Безопасность:** API ключи хранятся на сервере, а не в приложении
3. **Гибкость:** Легко переключиться на альтернативные API если нужно

## Структура

```
proxy-server/
├── server.js           # Основной сервер
├── package.json        # Зависимости Node.js
├── .env.example        # Пример переменных окружения
├── DEPLOYMENT.md       # Инструкция по развертыванию
└── README.md          # Этот файл
```

## Локальный запуск (для разработки)

1. Установи Node.js 18+ (https://nodejs.org/)

2. Установи зависимости:
```bash
cd proxy-server
npm install
```

3. Создай `.env` файл (скопируй из `.env.example`):
```bash
cp .env.example .env
```

4. Добавь свои API ключи в `.env`:
```
ASSEMBLYAI_API_KEY=твой_ключ
CLAUDE_API_KEY=твой_ключ
```

5. Запусти сервер:
```bash
npm start
```

6. Проверь что работает:
```
http://localhost:3000/health
```

## Endpoints

### Health Check
```
GET /health
```

### AssemblyAI

**Upload audio:**
```
POST /api/assemblyai/upload
Body: { "audioBase64": "..." }
```

**Create transcript:**
```
POST /api/assemblyai/transcript
Body: { "audio_url": "...", "speaker_labels": true }
```

**Get transcript status:**
```
GET /api/assemblyai/transcript/:id
```

### Claude API

**Send message:**
```
POST /api/claude/messages
Body: { "model": "...", "messages": [...], "max_tokens": 1000 }
```

## Развертывание

См. [DEPLOYMENT.md](DEPLOYMENT.md) для инструкций по развертыванию на Railway или Vercel.

## Безопасность

- ✅ API ключи хранятся только на сервере (переменные окружения)
- ✅ CORS настроен для работы с мобильным приложением
- ✅ Логирование ошибок
- ⚠️ Добавь rate limiting для production
- ⚠️ Добавь authentication для защиты endpoints

## Мониторинг

Railway предоставляет:
- Логи в реальном времени
- Метрики использования
- Автоматические рестарты при сбоях

## Стоимость

**Railway Free Tier:**
- $5 кредитов в месяц
- ~500 часов работы бесплатно
- Достаточно для тестирования и небольшого числа пользователей

Для production рекомендуется платный план (~$5-10/месяц).

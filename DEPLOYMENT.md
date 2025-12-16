# Развертывание прокси-сервера на Railway

## Шаг 1: Подготовка

1. **Зарегистрируйся на Railway:**
   - Перейди на https://railway.app/
   - Войди через GitHub
   - Бесплатный план: $5 кредитов в месяц (достаточно для начала)

2. **Создай репозиторий на GitHub:**
   - Создай новый приватный репозиторий `reflect-proxy-server`
   - Загрузи туда папку `proxy-server/`

---

## Шаг 2: Развертывание на Railway

1. **Создай новый проект:**
   - В Railway нажми "New Project"
   - Выбери "Deploy from GitHub repo"
   - Выбери репозиторий `reflect-proxy-server`

2. **Настрой переменные окружения:**
   - В Railway открой свой проект
   - Перейди в "Variables"
   - Добавь:
     ```
     ASSEMBLYAI_API_KEY = твой_ключ_assemblyai
     CLAUDE_API_KEY = твой_ключ_claude
     ```

3. **Дождись деплоя:**
   - Railway автоматически обнаружит Node.js приложение
   - Выполнит `npm install`
   - Запустит `npm start`
   - Даст тебе публичный URL типа: `https://reflect-proxy-production.up.railway.app`

---

## Шаг 3: Проверка

Открой в браузере:
```
https://твой-домен.up.railway.app/health
```

Должен вернуться:
```json
{
  "status": "ok",
  "service": "Reflect Proxy Server"
}
```

---

## Шаг 4: Обновление Flutter приложения

Теперь нужно изменить Flutter код, чтобы использовать твой прокси вместо прямых запросов к API.

### 4.1 Создай файл `lib/core/config/api_config.dart`:

```dart
class ApiConfig {
  // URL твоего прокси-сервера на Railway
  static const String proxyBaseUrl = 'https://твой-домен.up.railway.app';
  
  // Endpoints
  static const String assemblyaiUpload = '$proxyBaseUrl/api/assemblyai/upload';
  static const String assemblyaiTranscript = '$proxyBaseUrl/api/assemblyai/transcript';
  static String assemblyaiStatus(String id) => '$proxyBaseUrl/api/assemblyai/transcript/$id';
  static const String claudeMessages = '$proxyBaseUrl/api/claude/messages';
}
```

### 4.2 Обнови код транскрибации

В файле где ты вызываешь AssemblyAI (например `transcription_service.dart`):

**Было:**
```dart
final response = await http.post(
  Uri.parse('https://api.assemblyai.com/v2/upload'),
  headers: {'authorization': apiKey},
  body: audioBytes,
);
```

**Стало:**
```dart
import 'dart:convert';
import 'package:your_app/core/config/api_config.dart';

final response = await http.post(
  Uri.parse(ApiConfig.assemblyaiUpload),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'audioBase64': base64Encode(audioBytes),
  }),
);
```

### 4.3 Обнови код для Claude API

**Было:**
```dart
final response = await http.post(
  Uri.parse('https://api.anthropic.com/v1/messages'),
  headers: {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  },
  body: jsonEncode(requestBody),
);
```

**Стало:**
```dart
final response = await http.post(
  Uri.parse(ApiConfig.claudeMessages),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode(requestBody),
);
```

---

## Альтернатива: Vercel

Если Railway не подходит, можно использовать Vercel:

1. Установи Vercel CLI: `npm i -g vercel`
2. В папке `proxy-server/` выполни: `vercel`
3. Следуй инструкциям
4. Настрой переменные окружения в дашборде Vercel

---

## Безопасность

**Важно:** API ключи хранятся только на сервере, не в приложении!

Дополнительно можно добавить:
- Rate limiting (ограничение запросов)
- API ключ для самого прокси (чтобы только твоё приложение могло его использовать)
- Логирование запросов

---

## Следующие шаги

После развертывания:
1. Получи URL от Railway
2. Обнови Flutter код для использования прокси
3. Протестируй на устройстве без VPN
4. Profit! 🎉

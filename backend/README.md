# Email Client Backend (FastAPI)

FastAPI сервер, который раздаёт API и статические файлы React приложения.

## API Endpoints (объявлены, не реализованы)

- `GET /api/emails` - Получить список писем
- `GET /api/emails/{email_id}` - Получить письмо по ID
- `POST /api/emails/send` - Отправить письмо
- `POST /api/emails/auto-reply` - Генерировать автоответ
- `POST /api/emails/{email_id}/mark-read` - Пометить как прочитанное

## Документация

Swagger UI доступен по адресу: http://localhost:8000/docs

## Как работает

После сборки frontend (npm run build), FastAPI:
1. Раздаёт API на `/api/*`
2. Раздаёт React приложение на всех остальных маршрутах

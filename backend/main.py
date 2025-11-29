from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path
import json

from query import *

app = FastAPI(title="Email Client API")

# CORS настройки для подключения React фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Vite dev server
        "http://localhost:5173",      # Vite альтернативный порт
        "http://localhost:8000",      # Production (собранный React на том же сервере)
        "http://127.0.0.1:8000",      # То же самое, но через 127.0.0.1
        "http://127.0.0.1:3000",      # Vite dev server через 127.0.0.1
        "http://127.0.0.1:5173"       # Vite альтернативный порт через 127.0.0.1
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Пути к статическим файлам React
FRONTEND_DIR = Path(__file__).parent.parent / "frontend" / "dist"

# Модели данных
class EmailMessage(BaseModel):
    id: int
    sender: str
    sender_email: str
    subject: str
    preview: str
    body: str
    timestamp: str
    is_read: bool = False
    has_attachment: bool = False
    tags: Optional[List[str]] = []

class SendEmailRequest(BaseModel):
    to: str
    subject: str
    body: str
    reply_to_id: Optional[int] = None

class AutoReplyRequest(BaseModel):
    email_id: int
    original_message: str

class SimilarEmail(BaseModel):
    id: int
    subject: str
    preview: str
    body: str
    sender: str
    timestamp: str

class AutoReplyResponse(BaseModel):
    generated_reply: str
    confidence: float
    similar_emails: List[SimilarEmail] = []


@app.get("/api/emails", response_model=List[EmailMessage])
async def get_emails():
    """
    Получить список всех писем из sample_emails.json
    """
    try:
        # Путь к файлу sample_emails.json
        json_path = Path(__file__).parent.parent / "sample_emails.json"

        # Читаем JSON файл
        with open(json_path, 'r', encoding='utf-8') as f:
            emails_data = json.load(f)

        return emails_data
    except FileNotFoundError:
        print(f"Файл sample_emails.json не найден по пути: {json_path}")
        return []
    except json.JSONDecodeError as e:
        print(f"Ошибка при чтении JSON: {e}")
        return []
    except Exception as e:
        print(f"Неожиданная ошибка: {e}")
        return []

@app.get("/api/emails/{email_id}", response_model=EmailMessage)
async def get_email(email_id: int):
    """
    Получить конкретное письмо по ID из sample_emails.json
    """
    try:
        # Путь к файлу sample_emails.json
        json_path = Path(__file__).parent.parent / "sample_emails.json"

        # Читаем JSON файл
        with open(json_path, 'r', encoding='utf-8') as f:
            emails_data = json.load(f)

        # Ищем письмо по ID
        for email in emails_data:
            if email.get('id') == email_id:
                return email

        # Если письмо не найдено
        return {}
    except Exception as e:
        print(f"Ошибка при получении письма: {e}")
        return {}

@app.post("/api/emails/send")
async def send_email(request: SendEmailRequest):
    """
    Отправить письмо
    TODO: Реализовать отправку письма через SMTP или почтовый сервис
    """
    print(request)
    return {
        "status": "success",
        "message": "Email sending not implemented yet",
        "data": request.dict()
    }

@app.post("/api/emails/auto-reply", response_model=AutoReplyResponse)
async def generate_auto_reply(request: AutoReplyRequest):
    """
    Генерировать автоматический ответ на письмо
    TODO: Реализовать бизнес-логику генерации ответа (AI/ML модель)
    """
    print(request)

    # Заглушка для похожих писем - в реальном приложении здесь будет поиск в базе
    similar_emails = [
        {
            "id": 101,
            "subject": "Обновление дизайна интерфейса",
            "preview": "Добрый день! Отправляю новые макеты для обзора...",
            "body": "Добрый день! Отправляю новые макеты для обзора. Прошу посмотреть и дать фидбек.",
            "sender": "Иван Петров",
            "timestamp": "2 дня назад"
        },
        {
            "id": 102,
            "subject": "Финальная версия UI компонентов",
            "preview": "Привет! Завершил работу над компонентами...",
            "body": "Привет! Завершил работу над компонентами для новой версии приложения.",
            "sender": "Мария Сидорова",
            "timestamp": "Неделю назад"
        },
        {
            "id": 103,
            "subject": "Вопросы по дизайн-системе",
            "preview": "Здравствуйте! Есть несколько вопросов по новой дизайн-системе...",
            "body": "Здравствуйте! Есть несколько вопросов по новой дизайн-системе. Можем созвониться?",
            "sender": "Алексей Новиков",
            "timestamp": "Месяц назад"
        }
    ]
    generated_reply = get_answer(request.original_message)
    return {
        "generated_reply": generated_reply,
        "confidence": 1.0,
        "similar_emails": similar_emails
    }

@app.post("/api/emails/{email_id}/mark-read")
async def mark_as_read(email_id: int):
    """
    Пометить письмо как прочитанное
    TODO: Реализовать обновление статуса в базе данных
    """
    return {"status": "success", "email_id": email_id}


# Раздача статических файлов React (только если собран frontend)
if FRONTEND_DIR.exists():
    # Монтируем статические файлы (JS, CSS, изображения)
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")

    # Главная страница - для всех не-API маршрутов отдаём index.html
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        """
        Раздаёт React приложение для всех не-API маршрутов
        """
        # Отдаём index.html для всех маршрутов (включая корневой /)
        index_file = FRONTEND_DIR / "index.html"
        if index_file.exists():
            return FileResponse(index_file)

        return {"error": "Frontend not built. Run 'npm run build' in frontend directory."}
else:
    # Если frontend не собран, показываем информационное сообщение на главной странице
    @app.get("/")
    async def root():
        return {
            "message": "Email Client API",
            "error": "Frontend not built",
            "instructions": "Run 'npm run build' in frontend directory, then restart the server"
        }

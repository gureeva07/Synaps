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

class RatingRequest(BaseModel):
    email_id: int
    email_subject: str
    email_body: str
    generated_reply: str
    rating: int


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

        with open(json_path, 'r', encoding='utf-8') as f:
            emails_data = json.load(f)
        for email in emails_data:
            if email.get('id') == email_id:
                return email
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

    # Получаем полный объект письма из JSON
    try:
        json_path = Path(__file__).parent.parent / "sample_emails.json"
        with open(json_path, 'r', encoding='utf-8') as f:
            emails_data = json.load(f)

        # Находим письмо по ID
        email_obj = None
        for email in emails_data:
            if email.get('id') == request.email_id:
                email_obj = email
                break

    except Exception as e:
        print(f"Ошибка при получении письма: {e}")
        email_obj = {
            "id": request.email_id,
            "body": request.original_message,
            "subject": "",
            "sender": "",
            "sender_email": ""
        }

    # Заглушка для похожих писем - в реальном приложении здесь будет поиск в базе
    similar_emails = []

    # Передаем весь объект письма в get_answer
    generated_reply = '''
Настоящим уведомляем о грубом нарушении условий договора №БС-1456 от 15.03.2023: средства с нашего счёта были списаны без предварительного уведомления. Требуем немедленного разъяснения и возврата средств в течение 3 рабочих дней.
'''
    

    return {
        "generated_reply": generated_reply,
        "confidence": 1.0,
        "similar_emails": similar_emails
    }

@app.post("/api/emails/{email_id}/mark-read")
async def mark_as_read(email_id: int):
    """
    Пометить письмо как прочитанное в sample_emails.json
    """
    try:
        json_path = Path(__file__).parent.parent / "sample_emails.json"

        # Читаем текущие письма
        with open(json_path, 'r', encoding='utf-8') as f:
            emails_data = json.load(f)

        # Находим письмо и помечаем как прочитанное
        email_found = False
        for email in emails_data:
            if email.get('id') == email_id:
                email['is_read'] = True
                email_found = True
                break

        if email_found:
            # Сохраняем обновленные данные
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(emails_data, f, ensure_ascii=False, indent=2)

            return {"status": "success", "email_id": email_id}
        else:
            return {"status": "error", "message": "Email not found", "email_id": email_id}

    except Exception as e:
        print(f"Ошибка при пометке письма как прочитанного: {e}")
        return {"status": "error", "message": str(e), "email_id": email_id}

@app.post("/api/ratings/save")
async def save_rating(request: RatingRequest):
    """
    Сохранить оценку сгенерированного ответа в stats.json
    """
    try:
        stats_path = Path(__file__).parent.parent / "stats.json"

        # Читаем существующие данные или создаем новый список
        if stats_path.exists():
            with open(stats_path, 'r', encoding='utf-8') as f:
                stats_data = json.load(f)
        else:
            stats_data = []

        # Добавляем новую оценку
        from datetime import datetime
        new_rating = {
            "email_id": request.email_id,
            "email_subject": request.email_subject,
            "email_body": request.email_body,
            "generated_reply": request.generated_reply,
            "rating": request.rating,
            "timestamp": datetime.now().isoformat()
        }
        stats_data.append(new_rating)

        # Сохраняем обновленные данные
        with open(stats_path, 'w', encoding='utf-8') as f:
            json.dump(stats_data, f, ensure_ascii=False, indent=2)

        return {"status": "success", "message": "Rating saved successfully"}

    except Exception as e:
        print(f"Ошибка при сохранении оценки: {e}")
        return {"status": "error", "message": str(e)}


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

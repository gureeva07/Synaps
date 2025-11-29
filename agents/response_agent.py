from langchain_core.prompts import PromptTemplate
from config import OPENAI_API_KEY  # Import the key from your config
from langchain_openai import ChatOpenAI

from utils.formatter import clean_text, format_email


from email.utils import parseaddr


def generate_response(email: dict, summary: str, recipient_name: str, your_name: str) -> str:
    prompt_template = PromptTemplate(
        input_variables=["sender", "subject", "content", "summary", "user_name","recipient_name"],
        template=(
            "Ты ассистент электронной почты. Не используй заполнителей на подобии [Имя Пользователя]"
            "Ты ассистент электронной почты. Не используй приветствий и подписей в своём ответе.\n\n"
            "Данные о письме:\n"
            "От: {sender}\n"
            "Тема: {subject}\n"
            "Содержание: {content}\n"
            "Сводка: {summary}\n\n"
            
            "Ответ должен быть в формальном тоне."
        )
    )
    
    prompt = prompt_template.format(
        sender=recipient_name,  # Use the recipient's name (supplied manually)
        subject=email.get("subject", ""),
        content=email.get("body", ""),
        summary=summary,
        user_name=your_name
    )
    
    model = ChatOpenAI(temperature=0, openai_api_base="http://localhost:8080/v1", openai_api_key="sk-xxxx", model_name="gemma-3-12b-it")
    
    response = model.invoke(prompt)
    response_text = response.content if hasattr(response, "content") else str(response)
    
    # Pass recipient_name (for greeting) and your_name (for signature)
    formatted_response = format_email(email.get("subject", ""), recipient_name, response_text, your_name)
    return formatted_response.strip()

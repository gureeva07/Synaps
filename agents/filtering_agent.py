from langchain_core.prompts import PromptTemplate
from config import OPENAI_API_KEY  # Import your API key from config
from langchain_openai import ChatOpenAI
from utils.logger import get_logger

from utils.formatter import clean_text, format_email

logger = get_logger(__name__)


def filter_email(email: dict) -> str:
    """
    Uses an LLM to analyze the email and classify its type.
    
    The email is classified as one of:
      - "spam"
      - "urgent"
      - "needs_review"
      - "informational"
    
    Arguments:
        email (dict): The email to be analyzed. Expected keys: "subject", "body".
    
    Returns:
        str: The classification result.
    """
    prompt_template = PromptTemplate(
        input_variables=["subject", "content"],
        template=(
            "Проанализируй данное письмо с темой: {subject} и темой: {content} "
            "и определи его класс. "
            "Классифицирую его как 'спам', 'запрос информации или документов', 'официальная жалоба или претензия', 'регуляторный запрос', 'партнёрское предлжение', 'запрос на согласование' или 'уведомление или информирование'."
        )
    )
    
    prompt = prompt_template.format(
        subject=email.get("subject", ""),
        content=email.get("body", "")
    )
    
    # init the model with Deepseek's configurations.
    model = ChatOpenAI(temperature=0, openai_api_base="http://localhost:8080/v1", openai_api_key="sk-xxxx", model_name="gemma-3-12b-it")

    classification_result = model.invoke(prompt) 
    
    classification_text = clean_text(str(classification_result))    


        # logss the raw model output for debugging.
    logger.debug("Raw model output: %s", classification_text)
    
    
    # Check for 'needs review' first
    if "запрос информации или документов" in classification_text:
        return "запрос информации или документов"
    elif "официальная жалоба или претензия" in classification_text:
        return "официальная жалоба или претензия"
    elif "регуляторный запрос" in classification_text:
        return "регуляторный запрос"
    elif "партнёрское предлжение" in classification_text:
        return "партнёрское предложение"
    elif "запрос на согласование" in classification_text:
        return "запрос на согласование"
    elif "уведомление или информирование" in classification_text:
        return "уведомление или информирование"
    elif "спам" in classification_text:
        return "спам"
    else:
        return "informational"
from langchain_core.prompts import PromptTemplate
from config import OPENAI_API_KEY  # Import the key from your config
from langchain_openai import ChatOpenAI
from utils.formatter import clean_text



def summarize_email(email: dict) -> str:
    """
    Uses an LLM to generate a concise summary of the email content.
    """
    prompt_template = PromptTemplate(
        input_var=["content"],
        template="Подведи итог по данному письму в 3 предложениях.: {content}"
    )
    
    prompt = prompt_template.format(content=email.get("body", ""))
    
    # Initialize the model with Deepseek's configurations
    model = ChatOpenAI(temperature=0, openai_api_base="http://localhost:8080/v1", openai_api_key="sk-xxxx", model_name="gemma-3-12b-it")
    
    summary = model.invoke(prompt)
    summary_text = summary.content if hasattr(summary, "content") else str(summary)
    
    
    return clean_text(summary_text)
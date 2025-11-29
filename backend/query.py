#!/usr/bin/env python3
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.embeddings import LocalAIEmbeddings
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.vectorstores import Chroma
from langchain.llms import GPT4All, LlamaCpp
from langchain.chat_models import ChatOpenAI

import chromadb
import os
import argparse
import time

if not load_dotenv():
    print("Не удалось загрузить .env")
    exit(1)

embeddings_model_name = os.environ.get("EMBEDDINGS_MODEL_NAME")
persist_directory = os.environ.get('PERSIST_DIRECTORY')

model_type = os.environ.get('MODEL_TYPE')
model_path = os.environ.get('MODEL_PATH')
model_n_ctx = os.environ.get('MODEL_N_CTX')

base_path = os.environ.get('OPENAI_API_BASE', 'http://localhost:8080/v1')
key = os.environ.get('OPENAI_API_KEY', '-')
model_name = os.environ.get('MODEL_NAME', 'gemma-3-12b-it')
model_n_batch = int(os.environ.get('MODEL_N_BATCH',8))
target_source_chunks = int(os.environ.get('TARGET_SOURCE_CHUNKS',4))

from config import CHROMA_SETTINGS

def get_answer(query):
    args = parse_arguments()
    embeddings = LocalAIEmbeddings(openai_api_base="http://localhost:8080", model="qwen3-embedding-4b")
    chroma_client = chromadb.PersistentClient(settings=CHROMA_SETTINGS , path=persist_directory)
    db = Chroma(persist_directory=persist_directory, embedding_function=embeddings, client_settings=CHROMA_SETTINGS, client=chroma_client)
    retriever = db.as_retriever(search_kwargs={"k": target_source_chunks})
    callbacks = [] if args.mute_stream else [StreamingStdOutCallbackHandler()]
    match model_type:
        case "OpenAI":
            llm = ChatOpenAI(temperature=0, openai_api_base=base_path, openai_api_key=key, model_name=model_name)
        case _default:
            raise Exception(f"Модель {model_type} не поддерживается")

    qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever, return_source_documents= not args.hide_source)
    # Запуск цепочки
    while True:
        query = "Найди похожее письмо: " + query + '\nИ сгенерируй для этого письма ответ в таком же стиле'
        #query = "Кто обращался в банк по обновлению?"
        if query == "exit":
            break
        if query.strip() == "":
            continue

        # Получение ответа от цепочки
        start = time.time()
        res = qa(query)
        answer, docs = res['result'], [] if args.hide_source else res['source_documents']
        end = time.time()

        # Выдача
        print("\n\n> Запрос:")
        print(query)
        print(f"\n> Ответ (занял {round(end - start, 2)} s.):")
        print(answer)

        # Указание источников
        for document in docs:
            print("\n> " + document.metadata["source"] + ":")
            print(document.page_content)

        
        return answer

def parse_arguments():
    parser = argparse.ArgumentParser(description='psb v1')
    parser.add_argument("--hide-source", "-S", action='store_true',
                        help='Используйте данный флаг для скрытия источников')

    parser.add_argument("--mute-stream", "-M",
                        action='store_true',
                        help='Используйте данный флаг для отключения стриминга ответа')

    return parser.parse_args()

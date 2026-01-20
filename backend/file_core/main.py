import getpass
import os
from jigsawstack import JigsawStack
from langchain_groq import ChatGroq


validation_llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2
)
url = "https://raw.githubusercontent.com/SingHacks-2025/juliusbaer/d2a2bb1bd7900e84032032434220702b3b437d09/Swiss_Home_Purchase_Agreement_Scanned_Noise_forparticipants.pdf"
def ocr(url):
    if "JIGSAW_API_KEY" not in os.environ:
        raise ValueError("API key for JigsawStack not found")
    print("starting ocr")
    response = jigsaw.vision.vocr({
        "prompt": [""],
        "url": url
    })
    print("done with ocr")
    return response

def get_text(response):
    text = ""
    data = response["sections"]
    for i in data:
        text +=i["text"]
    return text

def generate_report(text):
    if "GROQ_API_KEY" not in os.environ:
        raise "API Key for Groq not found"
    messages = [
        (
            "system",
            "You are a strict banking legal agent validator that checks documents for suspicious areas like irregular spell-checking. "
            "Generate a report from the input, penalising for unprofessional formatting."
        ),
        (
            "user",
            text
        )
    ]
    print("starting generation")
    return validation_llm.invoke(messages)

def agent():
    print("starting agent")
    return generate_report(get_text(ocr(url))).content


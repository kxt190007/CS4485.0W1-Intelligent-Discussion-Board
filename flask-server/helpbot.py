import os
import openai
from pdfminer.high_level import extract_text
from dotenv import load_dotenv

#user posts question -> syllabus turned into text -> feed syllabus to chatbot -> if chatbot can answer -> update database, (comment) under the post


# load values from the .env file if it exists
load_dotenv()

# configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

INSTRUCTIONS = """You are an AI assistant who is an expert in the course syllabus.
Students will ask questions on a discussion board using a title and a body.
You can provide information on the class.
If you're unable to provide the answer to a question, please respond with the phrase "I do not think that is on the syllabus."
Do not use any external URLs in your answer. Do not refer to any blogs in your answer."""


TEMPERATURE = 0.5
MAX_TOKENS = 500
FREQUENCY_PENALTY = 0
PRESENCE_PENALTY = 0.6



def get_response(prompt):
    """
    Get a response from the model using the prompt

    Parameters:
        prompt (str): The prompt to use to generate the response

    Returns the response from the model
    """
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=TEMPERATURE,
        max_tokens=MAX_TOKENS,
        top_p=1,
        frequency_penalty=FREQUENCY_PENALTY,
        presence_penalty=PRESENCE_PENALTY,
    )
    return response.choices[0].text


def ask_question(postTitle, postBody, classID, pdfName):
    syllabus = "files/" + str(classID) + ".pdf"
    #syllabus = "files/" + classID + "/" + "pdfName"
    #/ flask - server / files / classID / pdfname
    try:
        syllabusText = extract_text(syllabus)
        new_question = "A student has made a new question on a discussion board. \n given this syllabus: " + syllabusText + "\n end of syllabus \n" + \
                       "answer the following question. Post Title: " + postTitle + "\n end Post Title \n Post Body: " + postBody + " ?"
        response = get_response(INSTRUCTIONS + new_question)
        response = response.lstrip()
        print(response)
        if response == "I do not think that is on the syllabus.":
            return "error"
        else:
            return response
    except FileNotFoundError:
        print("fail")
    else:
        pass
    return "error"


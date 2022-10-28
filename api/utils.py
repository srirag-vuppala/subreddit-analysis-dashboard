from datetime import datetime
import spacy
nlp = spacy.load('en_core_web_sm')

def extract_day(timestamp):
    dt_obj = datetime.fromtimestamp(timestamp)
    return dt_obj.strftime('%A')

def extract_time(timestamp):
    dt_obj = datetime.fromtimestamp(timestamp)
    return dt_obj.time().hour

def extract_title_string(title):
    doc = nlp(title)
    # all tokens that arent stop words or punctuations
    words = [token.text
            for token in doc
            if not token.is_stop and not token.is_punct]
    return " ".join(words)


def extract_noun_title_string(title):
    doc = nlp(title)

    # noun tokens that arent stop words or punctuations
    nouns = [token.text for token in doc if (not token.is_stop and not token.is_punct and token.pos_ == "NOUN")]
    return " ".join(nouns)
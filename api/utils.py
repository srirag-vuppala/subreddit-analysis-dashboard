from datetime import datetime
import re
import heapq
import spacy
from collections import Counter
nlp = spacy.load('en_core_web_sm')

def extract_day(timestamp):
    dt_obj = datetime.fromtimestamp(timestamp)
    return dt_obj.strftime('%A')

def extract_time(timestamp):
    dt_obj = datetime.fromtimestamp(timestamp)
    return dt_obj.time().hour

def count_posts(submissions):
    tally1= {'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0, 'Sunday': 0}
    tally2 = [0]*24 
    title_string = ''
    tally_title_len = {}
    for s in submissions:
        tally1[extract_day(s.created_utc)] += 1
        tally2[extract_time(s.created_utc)] += 1
        title_string = title_string + " " + s.title 
        title_len = len(re.findall(r'\w+', s.title))
        if title_len in tally_title_len.keys():
            tally_title_len[title_len] += 1
        else:
            tally_title_len[title_len] = 1

    #1
    final1 = []
    for k, v in tally1.items():
        final1.append({'day': k, 'count': v})
    #2
    final2 = []
    for i in range(12):
        final2.append({'time': i+1, 'AM': tally2[i], 'PM': tally2[i+12], 'fullMark': max(tally2)})

    doc = nlp(title_string)
    # all tokens that arent stop words or punctuations
    words = [token.text
            for token in doc
            if not token.is_stop and not token.is_punct]

    # noun tokens that arent stop words or punctuations
    nouns = [token.text for token in doc if (not token.is_stop and not token.is_punct and token.pos_ == "NOUN")]

    # 10 most common tokens
    word_freq = Counter(words)
    common_toks = word_freq.most_common(10)
    common_words = [{'name': ele[0], 'size': ele[1] } for ele in common_toks]

    # # five most common noun tokens
    # noun_freq = Counter(nouns)
    # common_nouns = noun_freq.most_common(5)

    # five most common lengths
    counter_len = Counter(tally_title_len).most_common(5)
    common_len= [{'title_length': ele[0], 'count': ele[1] } for ele in counter_len]
 
    return {'PostsByDayOfWeek': final1, 'PostsByHourOfDay': final2, 'CommonWordsInTitles': common_words, 'CommonLengthInTitles': common_len}
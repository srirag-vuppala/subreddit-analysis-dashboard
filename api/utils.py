from datetime import datetime

def extract_day(timestamp):
    dt_obj = datetime.fromtimestamp(timestamp)
    return dt_obj.strftime('%A')

def extract_time(timestamp):
    dt_obj = datetime.fromtimestamp(timestamp)
    return dt_obj.time().hour
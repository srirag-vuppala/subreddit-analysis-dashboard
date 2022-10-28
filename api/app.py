import os
import utils
from flask import Flask, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
import praw

reddit = praw.Reddit(
    client_id=os.environ.get('CLIENT_ID'),
    client_secret=os.environ.get('SECRET_KEY'),
    username=os.environ.get('REDDIT_USERNAME'),
    password=os.environ.get('REDDIT_PASSWORD'),
    user_agent="user-agent",
)

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/get-subreddit-info')
def get_info():
    subreddit = request.args.get('subreddit', None)
    limit = request.args.get('limit', None)
    if subreddit is None or limit is None:
        return "Inputs improper", 400
    
    top_entries = reddit.subreddit(subreddit).top(limit=int(limit), time_filter="year")
    clean_list = [{'title': sub.title, 'created_utc': sub.created_utc, 'hour': utils.extract_time(sub.created_utc), 'day': utils.extract_day(sub.created_utc)} for sub in list(top_entries)]
    return clean_list

if __name__ == '__main__':
    app.run(debug=True)
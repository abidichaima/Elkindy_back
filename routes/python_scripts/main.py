from textblob import TextBlob
from pymongo import MongoClient
from dataclasses import dataclass 

@dataclass
class Mood:
    sentiment: float

def get_mood(input_text: str, *, threshold: float) -> Mood:
    sentiment: float = TextBlob(input_text).sentiment.polarity
    friendly_threshold: float = threshold
    hostile_threshold: float = -threshold

    if sentiment >= friendly_threshold:
        return Mood(sentiment)
    elif sentiment <= hostile_threshold:
        return Mood(sentiment) 
    else:
        return Mood(sentiment) 
    
# Connect to MongoDB Atlas

try:
    client = MongoClient("mongodb+srv://artweb:elkindy@elkindy.awubkgs.mongodb.net/")
    db = client.get_database("test")
    comments_collection = db.get_collection("comments")  
    print("Connection to MongoDB Atlas successful.")

except Exception as e:
    print("An error occurred:", e)



def update_comments():
    comments = comments_collection.find()

    print("Retrieved Comments:")
    for comment in comments:
        print(comment)

    comments.rewind()
    
    for comment in comments:
        mood = get_mood(comment['comment'], threshold=0.3)
        
        # Update the comment document with the satisfaction score
        comments_collection.update_one(
            {'_id': comment['_id']},
            {'$set': {'satisfaction': mood.sentiment}}
        )

        # Update satisfaction scores for replies
        for reply in comment['replies']:
            mood = get_mood(reply['reply'], threshold=0.3)
            comments_collection.update_one(
                {'_id': comment['_id'], 'replies.commentId': reply['commentId']},
                {'$set': {'replies.$.satisfaction': mood.sentiment}}
            )
    
    print("All comments and their replies analyzed and satisfaction scores updated successfully.")

if __name__ == '__main__':
    update_comments()
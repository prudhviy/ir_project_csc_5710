from datetime import datetime
from elasticsearch import Elasticsearch
es = Elasticsearch()

INDEX_NAME = 'tweets_new'

cnt = 1

with open('/Users/prudhvi/Dropbox/raw.txt') as f:
    for line in f:

        if cnt%2 != 0:
            
            parsed_tweet = line.split("\t")

            doc = {
                'created_time': parsed_tweet[3],
                'creator_name': parsed_tweet[1],
                'location': parsed_tweet[2],
                'tweet_text': parsed_tweet[4]
            }

            res = es.index(index=INDEX_NAME, doc_type='tweet', id=None, body=doc)
            #print(res['created'])

        cnt += 1


es.indices.refresh(index=INDEX_NAME)

print 'DONE'
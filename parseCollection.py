from datetime import datetime
from elasticsearch import Elasticsearch
es = Elasticsearch()

INDEX_NAME = 'tweets'

cnt = 1

with open('/Users/prudhvi/Dropbox/raw.txt') as f:
    for line in f:
        parsed_tweet = line.split("\t")

        print parsed_tweet[4]

        if cnt == 20:
        	break;

        cnt += 1

curl -XPUT 'http://localhost:9200/tweets_new' -d '{
    "settings" : {
        "index" : {
            "number_of_shards" : 1,
            "number_of_replicas" : 1
        },  
        "analysis" : {
            "filter" : {
                "tweet_filter" : {
                    "type" : "word_delimiter",
                    "type_table": ["# => ALPHA", "@ => ALPHA"]
                }   
            },
            "analyzer" : {
                "tweet_analyzer" : {
                    "type" : "custom",
                    "tokenizer" : "whitespace",
                    "filter" : ["lowercase", "tweet_filter"]
                }
            }
        }
    },
    "mappings" : {
        "tweet" : {
            "properties" : {
                "tweet_text" : {
                    "type" : "string",
                    "analyzer" : "tweet_analyzer"
                }
            }
        }
    }
}'
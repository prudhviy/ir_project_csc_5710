import os
from flask import Flask, request, jsonify
from pyes import *

INDEX_NAME = 'tweets_new'

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

def search_all_terms(conn, query_string):
    query = {
        "filtered": {
            "filter": {
                 "limit": {"value" : 50}
            },
            "query": {
                "match": {
                    "tweet_text": {
                        "query": query_string,
                        "operator": "and"
                    }
                }
            }
        }
    }

    result = conn.search(query, indices=[INDEX_NAME], doc_types=["tweet"])
    return [p for p in result]


def search_exact_phrase(conn, query_string):
    query = {
        "filtered": {
            "filter": {
                 "limit": {"value" : 50}
            },
            "query": {
                "match_phrase": {
                    "tweet_text": query_string
                }
            }
        }
    }

    result = conn.search(query, indices=[INDEX_NAME], doc_types=["tweet"])
    return [p for p in result]


def search_any_terms(conn, query_string):
    query = {
        "filtered": {
            "filter": {
                 "limit": {"value" : 50}
            },
            "query": {
                "match": {
                    "tweet_text": {
                        "query": query_string,
                        "operator": "or"
                    }
                }
            }
        }
    }
    result = conn.search(query, indices=[INDEX_NAME], doc_types=["tweet"])
    return [p for p in result]

def search_hash_tags(conn, query_string):
    results = []
    tags = query_string.split()
    
    for tag in tags:
        query = {
            "filtered": {
                "filter": {
                     "limit": {"value" : 50}
                },
                "query": {
                    "match_phrase": {
                        "tweet_text": "#" + tag
                    }
                }
            }
        }
        result = conn.search(query, indices=[INDEX_NAME], doc_types=["tweet"])
        results = results + [p for p in result]
    
    return results
 
def search_none_terms(conn, query_string, query_mandatory):
    must_terms = query_mandatory.split()

    should = []

    for term in must_terms:
        should.append({"term": {"tweet_text": term} })

    query = {
        "bool": {
            "should": should,
            "must_not": {
                "term": {"tweet_text": query_string }
            }
        }
    }

    result = conn.search(query, indices=[INDEX_NAME], doc_types=["tweet"])
    return [p for p in result]


@app.route("/search/", methods=['POST'])
def search_api():
    """ To search """
    conn = ES('127.0.0.1:9200')
    
    if request.method == 'POST' and request.form['query_type'] == 'adv':
        query_term = request.form['query']
        query_field = request.form['query_field']
        result = {'tweets': []}

        if query_field == 'all_terms':
            result['tweets'] = search_all_terms(conn, query_term)
        elif query_field == 'exact_phrase':
            result['tweets'] = search_exact_phrase(conn, query_term)
        elif query_field == 'any_terms':
            result['tweets'] = search_any_terms(conn, query_term)
        elif query_field == 'none_terms':
            query_mandatory = request.form['query_mandatory_terms']
            result['tweets'] = search_none_terms(conn, query_term, query_mandatory)
        elif query_field == 'hash_tags':
            result['tweets'] = search_hash_tags(conn, query_term)

    return jsonify(**result)

@app.route('/static/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(os.path.join('static', path))


if __name__ == "__main__":
    #app.run(debug=True)
    app.run(host='0.0.0.0')

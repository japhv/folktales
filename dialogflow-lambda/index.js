/*
 * Focktale app for Google Assistant
 * 
 * 
 */

 'use strict';

const ESClient = require("elasticsearch").Client({
    hosts: [process.env.ELASTICSEARCH_HOST],
    connectionClass: require('http-aws-es')
});

exports.handler = function(event, context, callback) {
    let storyType = event.result.parameters['storyType'] || "random";
    let esParams = getESParams(storyType);

    ESClient
        .search(esParams)
        .then((resp) => {
            if (resp.hits.total > 0) {
                const storyId = resp.hits.hits[0]._id;
                const story = resp.hits.hits[0]._source;
                const speechOutput = "The title of the story is " + story.title + ". " + story.story;
                callback(null, {"speech": speechOutput});
            } else {
                callback(null, {"speech": "Sorry, I don't know that story!"});
            }
        })
        .catch((err) => {
            callback(null, {"speech": "Sorry, I don't know that story!"});
            console.trace(err.message);
        });
 };

/**
 * Constructor for the Elasticsearch parameters
 * @param {String} storyType
 * @param {Array} storyIds
 */
function getESParams(storyType, storyIds) {
    const query = {
        "bool": {}
    }
    const searchParams = {
        "index": "stories",
        "type": "story",
        "body": {
            "size": 1,
            "query": query
        }
    };

    if (storyType !== "random") {
        query.bool.must = [
            {
                "match": {
                    "title": {
                        "query": storyType,
                        "boost": 2
                    }
                }
            },
            {
                "match": {
                    "story": storyType
                }
            }
        ]
    }

    if (storyIds) {
        query.bool.filter = {
            "bool": {
                "must_not": [
                    { "ids": { "values": storyIds } }
                ]
            }
        }
    }

    return searchParams;
}
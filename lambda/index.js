/**
 * An intelligent story narrator skill for Alexa.
 * 
 * @author Japheth Adhavan
 * @author Amit Jaisinghani
 *
 * @skill_name: Folktales
 */

"use strict";

const Alexa = require('alexa-sdk');

const ESClient = require("elasticsearch").Client({
    hosts: [process.env.ELASTICSEARCH_HOST],
    connectionClass: require('http-aws-es')
});

const HELP_MESSAGE = `Folktales can tell you any kind of story. 
  For example, if you want to listen to a fox story, just say "Tell me a fox story". 
  Now try asking Folktales a story you would like to hear.`;
const HELP_REPROMPT = "Try saying, tell me a fox story.";
const STOP_MESSAGE = 'Goodbye!';

const folkTaleHandlers = {
    'LaunchRequest': function () {
        this.emit(":ask", "Welcome to folktales! What story would you like to hear?", "Sorry, could you repeat that?");
    },
    'AMAZON.HelpIntent': function () {
        this.emit(":ask", HELP_MESSAGE, HELP_REPROMPT);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'QueryIntent': function () {
        // Get the type of story from the user
        const storyType = this.event.request.intent.slots.storyType.value || "random";

        // Set up attributes for new user
        if (Object.keys(this.attributes).length === 0) {
            this.attributes['noOfTimesUsed'] = 0;
            this.attributes['storiesHeard'] = [];
            this.attributes['requestHistory'] = [];
        }

        // Counter for app usage for any user
        this.attributes['noOfTimesUsed'] += 1;
        const userRequest = {
            date: Date.now(),
            query: storyType
        };

        // Query constructor for ElasticSearch
        const esParams = getESParams(storyType, this.attributes.storiesHeard);
        // Call to Elasticsearch
        ESClient
            .search(esParams)
            .then((resp) => {
                if (resp.hits.total > 0) {
                    const storyId = resp.hits.hits[0]._id;
                    const story = resp.hits.hits[0]._source;
                    const speechOutput = "The title of the story is " + story.title + ". " + story.story;
                    userRequest['storyId'] = storyId;
                    this.attributes['requestHistory'].push(userRequest);
                    this.attributes['storiesHeard'].push(storyId);
                    this.emit(":tell", speechOutput);
                } else {
                    this.attributes['requestHistory'].push(userRequest);
                    this.emit(":tell", "Sorry, I don't know that story!");
                }
            })
            .catch((err) => {
                this.emit(":tell", "Sorry, I don't know that story!");
                console.trace(err.message);
            });
    }
};

// Handler for AWS lambda
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APP_ID;
    alexa.dynamoDBTableName = process.env.DYNAMODB_TABLE;
    alexa.registerHandlers(folkTaleHandlers);
    alexa.execute();
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


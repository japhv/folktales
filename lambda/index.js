/**
 * An intelligent story narrator skill for Alexa.
 * 
 * @author Japheth Adhavan
 * @author Amit Jaisinghani
 */

"use strict";

const Alexa = require('alexa-sdk');
const appConstants = require('./constants.js');

const SKILL_NAME = 'Mavis';
const HELP_MESSAGE = `Mavis tells you the story you want to hear. 
  Suppose you want to listen to a fox story, just say "Tell me a fox story". 
  Now try asking Mavis a story you would like to hear.`;
const HELP_REPROMPT = "Try saying, tell me a fox story.";
const STOP_MESSAGE = 'Goodbye!';

const folkTaleHandlers = {
    'AMAZON.HelpIntent': function () {
        this.emit(":ask", HELP_MESSAGE, HELP_REPROMPT);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};

// Handler for AWS lambda
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = appConstants.APP_ID;
    alexa.dynamoDBTableName = appConstants.DYNAMODB_TABLE;
    alexa.registerHandlers(folkTaleHandlers);
    alexa.execute();
};


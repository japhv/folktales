/**
 * An intelligent story narrator skill for Alexa.
 * 
 * @author Japheth Adhavan
 * @author Amit Jaisinghani
 */

"use strict";

const Alexa = require('alexa-sdk');
const appConstants = require('./constants.js');

const folkTaleHandlers = {};

// Handler for AWS lambda
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = appConstants.APP_ID;
    alexa.dynamoDBTableName = appConstants.DYNAMODB_TABLE;
    alexa.registerHandlers(folkTaleHandlers);
    alexa.execute();
  };
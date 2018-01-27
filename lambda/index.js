/**
 * An intelligent story narrator skill for Alexa.
 * 
 * @author Japheth Adhavan
 * @author Amit Jaisinghani
 */

"use strict";

const Alexa = require('alexa-sdk');

const twixHandlers = {};

// Handler for AWS lambda
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context);
    // alexa.appId = APP_ID;
    alexa.dynamoDBTableName = "twixTable";
    alexa.registerHandlers(twixHandlers);
    alexa.execute();
  };
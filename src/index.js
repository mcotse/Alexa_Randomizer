var config = require('./config');

/**
 * App ID for the skill
 */
var APP_ID = config.APP_ID; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var Chooser = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Chooser.prototype = Object.create(AlexaSkill.prototype);
Chooser.prototype.constructor = Chooser;

Chooser.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Chooser onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Chooser.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Chooser onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to Randomizer, Give me a few names to choose from and i will choose one at random";
    var repromptText = "Give me some names";
    response.ask(speechOutput, repromptText);
};

Chooser.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Chooser onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Chooser.prototype.intentHandlers = {
    // register custom intent handlers
    "ChooseName": function (intent, session, response) {
        var names = [];
        for (var name in intent.slots){
            if("value" in intent.slots[name]){
                names.push(intent.slots[name].value);
            }
        }
        if (names.length == 0){
            response.ask("There were no names given, ask again","Ask again")
        }
        var randomIndex = Math.floor(Math.random() * names.length)
        response.tellWithCard(names[randomIndex]);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Give me some names and I'll decide who wins!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Chooser skill.
    var chooser = new Chooser();
    chooser.execute(event, context);
};

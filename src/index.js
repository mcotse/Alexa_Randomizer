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
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
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
        var winnerRes;
        if("value" in intent.slots.Name_one && "value" in intent.slots.Name_two){
            var name1 = intent.slots.Name_one.value,
                name2 = intent.slots.Name_two.value
        } else {
            var name1 = 'anthony',
                name2 = 'matthew'
        }

        if (Math.random() > 0.5){
            winnerRes = name1;
        }
        else{
            winnerRes = name2;
        }
        response.tellWithCard(winnerRes);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Chooser skill.
    var chooser = new Chooser();
    chooser.execute(event, context);
};

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
    "ChooseNumber": function (intent, session, response) {
        var min, max;
        if("value" in intent.slots.Num_one && "value" in intent.slots.Num_two){
            min = Math.min(intent.slots.Num_one.value,intent.slots.Num_two.value);
            max = Math.max(intent.slots.Num_one.value,intent.slots.Num_two.value);
        }else{
            response.ask("I cant work with what you just gave me, try asking again with another range","Ask again")
        }
        //generate random number in the given range
        var randomNum = Math.floor(Math.random()*(max-min+1))+min;
        response.tellWithCard(randomNum.toString());
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Give me some names or a range of numbers and I will choose one at random");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Chooser skill.
    var chooser = new Chooser();
    chooser.execute(event, context);
};

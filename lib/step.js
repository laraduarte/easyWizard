/* ___________________________________________________________________________

    Module: step.js   Version: v0.1
    Author: Guillermo Peña (guillermo.pena.cardano@gmail.com)
    Last update: 16 abril 2013 (martes)
    
        Step of wizard

   ___________________________________________________________________________*/

function Step(json) {
    
    // ___ Modules _________________________________________________________________

    var events   = require('events')
    var util     = require('util')
    var readline = require('readline')

    // __ Properties _______________________________________________________________

    var id            = json.id                 // Step id
    var question  	  = json.question 			// Question
    var allowNulls    = json.allowNulls         // Null answer allowed
    var defaultAnswer = json.defaultAnswer		// Default answer to question
    var type 	  	  = json.type 				// Type of value expected
    var options   	  = json.options 			// Array of option if type is 'options'
    var nextStep      = json.nextStep           // Next step id
    var property      = json.property           // Property name in resultant object
    var pause         = json.pause              // Pause wizard after this step
    var answer     	  = null 					// Answer inserted by user (or default user)
    var emitter   	  = new events.EventEmitter // Event emitter
    var valid     	  = true 					// Is a valid step?
    //var rl 			  = new Object()			// Interface with user

    // __ Private Methods __________________________________________________________

    var checkAnswer = function(userAnswer) {

        // Assigning default value if userAnswer is empty
        if ( userAnswer.length == 0 && allowNulls != true ) {
            if ( type == 'options' ) answer = options[defaultAnswer]
            else                     answer = defaultAnswer
        }

        // If deafult answer was not defined and user answer is empty
        if ( allowNulls != true && userAnswer.length == 0 && defaultAnswer === undefined ) valid = false
        
        // If choosen option doesnt exist
        if ( type == 'options' && options[userAnswer] == undefined) valid = false

        return valid
    }

    // __ Public Methods ___________________________________________________________

    var getId       = function() { return id }
    var getProperty = function() { return property }
    var getNextStep = function() { if ( valid == true ) return nextStep
                                   else return id 
                                 }
    var getAnswer   = function() { return answer }
    var getPause    = function() { return pause === true }

    var run = function() {

        // Creating interface
		var rl = readline.createInterface({
		  input: process.stdin,
		  output: process.stdout
		})

        // Reseting values
        valid  = true 
        answer = null

        // Making question
		rl.question(question, function(userAnswer) {
		  if ( checkAnswer(userAnswer) == true ) {
            if (type == 'options') {
                answer = options[userAnswer]
                nextStep = options[userAnswer].nextStep
            } else {
                answer = userAnswer
            }
          }
          rl.close()
          emitter.emit('next')
		})
    }

    // __ Return ___________________________________________________________________
    
    return { "getId"      : getId
           , "getProperty": getProperty
           , "getNextStep": getNextStep
           , "getAnswer"  : getAnswer
           , "getPause"   : getPause
           , "question"   : question 
    	   , "emitter"    : emitter
    	   , "run"        : run
    	   }

}

module.exports = Step
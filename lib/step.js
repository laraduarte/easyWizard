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

    var question  	  = json.question 			// Question
    var defaultAnswer = json.defaultAnswer		// Default answer to question
    var type 	  	  = json.type 				// Type of value expected
    var options   	  = json.options 			// Array of option if type is 'options'
    var answer     	  = null 					// Answer inserted by user (or default user)
    var emitter   	  = new events.EventEmitter // Event emitter for 'isValid' event
    var valid     	  = true 					// Is a valid step?
    var rl 			  = new Object()			// Interface with user

    // __ Private Methods __________________________________________________________

    var checkAnswer = function(userAnswer) {

    	if (type !== undefined && type !== null && userAnswer.length == 0 && defaultAnswer === undefined) return false
    	return true
    }

    // __ Public Methods ___________________________________________________________

    var getAnswer = function() { return answer }

    var run = function() {

		rl = readline.createInterface({
		  input: process.stdin,
		  output: process.stdout
		})

		rl.question(question, function(userAnswer) {
		  if ( checkAnswer(userAnswer) == true ) answer = userAnswer
		  if ( answer.length == 0) answer = defaultAnswer
		  emitter.emit('next')
		  rl.close()
		})
    }

    // __ Return ___________________________________________________________________
    
    return { "getAnswer": getAnswer
    	   , "question": question 
    	   , "emitter": emitter
    	   , "run": run
    	   }

}

module.exports = Step
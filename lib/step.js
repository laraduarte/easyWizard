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

    // __ Constants ________________________________________________________________

    var clearScreenCode = "\u001B[2J\u001B[0;0f"


    // __ Properties _______________________________________________________________

    var id            = json.id                 // Step id
    var prequestion   = json.prequestion        // Workaround to fix node bug about prompt position and escape codes
    var question  	  = json.question 			// Question
    var allowNulls    = json.allowNulls         // Null answer allowed
    var defaultAnswer = json.defaultAnswer		// Default answer to question
    var type 	  	  = json.type 				// Type of value expected
    var options   	  = json.options 			// Array of option if type is 'options'
    var nextStep      = json.nextStep           // Next step id
    var property      = json.property           // Property name in resultant object
    var pause         = json.pause              // Pause wizard after this step
    var clearScreen   = json.clearScreen        // Clear screen before make question
    var limits        = json.limits             // numeric limits for numeric values
    var answer     	  = null 					// Answer inserted by user (or default user)
    var emitter   	  = new events.EventEmitter // Event emitter
    var valid     	  = true 					// Is a valid step?

    // __ Exceptions _________________________________________________________

    var numericLimitHasWrongTypeFileError = new Error("Error s001: Numeric limit has wrong type in wizard file")

    // __ Private Methods __________________________________________________________

    var checkAnswer = function(userAnswer) {

        // Assigning default value if userAnswer is empty
        if ( userAnswer.length == 0 && allowNulls != true ) {
            if ( type == 'options' ) answer = options[defaultAnswer]
            else                     answer = defaultAnswer
        }

        // If deafult answer was not defined and user answer is empty
        if ( allowNulls != true && userAnswer.length == 0 && defaultAnswer === undefined ) {
            console.log('  Null values not allowed')
            valid = false
        }
        
        // If choosen option doesnt exist
        if ( type == 'options' && options[userAnswer] == undefined ) {
            console.log('  Unknown option')
            valid = false
        }

        // If expected answer is numeric
        if (type == 'numeric') {
            if ( allowNulls == true && userAnswer.length == 0 && defaultAnswer === undefined ) answer = 0 
            else answer = userAnswer
            if ( isNaN(answer) ) {
                console.log('  Only numeric values please')
                valid = false  
            }  

            // Checking min limit     
            if ( limits != undefined && limits.min != undefined &&  limits.min != null) {
                if ( isNaN(limits.min) ) {
                    throw numericLimitHasWrongTypeFileError 
                } else {
                    if ( answer < limits.min ) {
                        console.log('  Value out of range. Min limit: ' + limits.min )
                        valid = false 
                    }
                }
            }

            // Checking max limit     
            if ( limits != undefined && limits.max != undefined &&  limits.max != null) {
                if ( isNaN(limits.max) ) {
                    throw numericLimitHasWrongTypeFileError    
                } else {
                    if ( answer > limits.max ) {
                        console.log('  Value out of range. Max limit: ' + limits.max )
                        valid = false 
                    }
                }
            }
        }

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
        if ( clearScreen == true ) console.log(clearScreenCode)
        if ( prequestion != null ) console.log(prequestion)
		rl.question(question, function(userAnswer) {
		  if ( checkAnswer(userAnswer) == true ) {
            if ( type == 'options' ) { //&& nextStep == undefined ) {
                answer = options[userAnswer]
                if ( options[userAnswer].value != undefined ) {
                    answer = options[userAnswer].value
                }
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
/* ___________________________________________________________________________

    Module: easyWizard.js   Version: v0.1
    Author: Guillermo Peña (guillermo.pena.cardano@gmail.com)
    Last update: 16 abril 2013 (martes)
    
        Wizard constructor based in json files

   ___________________________________________________________________________*/

function EasyWizard() {
    
    // ___ Modules ___________________________________________________________

    var fs     = require('fs')
    var util   = require('util')
    var events = require('events')
    var Step   = require('./step.js')

    // __ Properties _________________________________________________________

    var object  = new Object()	          // Resulting object of wizard
    var steps   = new Object()  	      // Array of steps
    var emitter = new events.EventEmitter // Event emitter for 'isValid' event
    var pause   = false                   // Pause wizard
    var currentStepIndex                  // Current step index

    // __ Exceptions _________________________________________________________

    var wizardFileNotFoundError = new Error("Error 001: Wizard file not found")
    var corruptWizardFileError  = new Error("Error 002: Wizard file is corrupt")
    var repeatedStepIdError		= new Error("Error 003: Wizard contains two steps with the same id")
    var unknownStepError        = new Error("Error 004: Unknown step")

    // __ Private Methods ____________________________________________________

    var getObject = function getObject() { return object }

    // Loading Wizard File
    var loadWizard = function(filename) {

    	// Getting configuration
        console.log("Wizard file: " + filename)
    	try {
    		var cfgFileContent = fs.readFileSync(filename)
    	} catch (error) {
    		throw wizardFileNotFoundError // TODO: anexar 'error' al tuyo...
    	}
    	try {
    		var config = JSON.parse(cfgFileContent)
    	} catch (error) {
    		throw corruptWizardFileError
    	}

    	// Validating wizard file
    	if ( config.type == 'options' && (Object.isObject(config.steps) == false || config.steps == {}) )
            throw corruptWizardFileError

    	// Converting each step in Step object
        var firstStep = true
    	config.steps.forEach(function(step){

            // Setting first step if firstStep property is NOT defined
            if ( firstStep == true ) {
                firstStep = false
                currentStepIndex = step.id
            }

            // Setting first step if firstStep property is defined
            if ( step.firstStep == true ) currentStepIndex = step.id

            // Adding step to steps array
    		if ( steps[step.id] === undefined ) steps[step.id] = new Step(step)
    		else throw repeatedStepIdError

            // Emmiting 'loaded' event
            if (config.steps.length == Object.keys(steps).length) {
                console.log("Wizard loaded!" )
                emitter.emit('loaded')
            }
    	})
    }

    // Go Wizard
    var go = function() {

    	// Getting current step
        var currentStep = steps[currentStepIndex]
        if ( currentStepIndex === null || currentStepIndex === undefined ) {
            emitter.emit('end')
            return
        }
        if (currentStep == undefined) throw unknownStepError
        //console.log("\nGo! Current Step " + currentStep.getId())   

        // Saving answer, updating current Step function, pausing wizard if it is required... after step execution
        var nextStep = function() {

            // Saving answer
            var property = currentStep.getProperty()
            if ( property != null && nextStep != undefined ) object[property] = currentStep.getAnswer()

            // Updating current step
            currentStepIndex = currentStep.getNextStep()

            // Pausing wizard
            if ( currentStep.getPause() != true ) emitter.emit('continue')
            else emitter.emit('paused')   
        }

        currentStep.emitter.once('next', nextStep)
        currentStep.run()
    }

    // __ Public Methods _____________________________________________________

    var run = function(filename) {

        if ( filename == null || filename == undefined ) filename = process.argv[2]
        emitter.on('continue', go)
        emitter.once('loaded', go)
    	loadWizard(filename)
    }

    // __ Return _____________________________________________________________

    return { "run": run 
           , "emitter": emitter
		   , "getObject": getObject 
		   , "steps": steps
		   }

}

module.exports = EasyWizard
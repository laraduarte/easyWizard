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
    var async  = require('async')
    var events = require('events')
    var Step   = require('./step.js')

    // __ Properties _________________________________________________________

    var object = new Object()	// Resulting object of wizard
    var steps  = []				// Array of steps

    var wizardFileNotFoundError = new Error("Error 001: Wizard file not found")
    var corruptWizardFileError  = new Error("Error 002: Wizard file is corrupt")
    var repeatedStepIdError		= new Error("Error 003: Wizard contains two steps with the same id")

    // __ Private Methods ____________________________________________________

    // Loading Wizard File
    var loadWizard = function(filename) {

    	// Getting configuration
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
    	if ( Array.isArray(config.steps) == false || config.steps == [] ) throw corruptWizardFileError

    	// Converting each step in Step object
    	config.steps.forEach(function(step){
    		if ( steps[step.id] === undefined ) steps[step.id] = new Step(step)
    		else throw repeatedStepIdError
    	})

    	// Emmiting 'loaded' event
    	emitter.emit('loaded')
    }

    // Starting Wizard
    var start = function() {
    	// TODO whilst sincrono para ejecutar steps
    }

    // __ Public Methods _____________________________________________________

    var run = function(filename) {

    	loadWizard(filename)
    	emitter.once('loaded', start)
    }

    // __ Return _____________________________________________________________

    return { "run": run 
		   , "object": object 
		   , "steps": steps
		   }

}

module.exports = EasyWizard

// --Test--
var util   = require('util')
var ew = new EasyWizard()
ew.run("../examples/basic.wizarda")
console.log("Step 1: " + util.inspect(ew.steps["1"]))
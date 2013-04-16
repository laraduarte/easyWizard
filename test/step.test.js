/* ___________________________________________________________________________

    Module: step.test.js   Version: v0.1
    Author: Guillermo Peña (guillermo.pena.cardano@gmail.com)
    Last update: 16 abril 2013 (martes)
    
        Step wizard unit test

   ___________________________________________________________________________*/


// __ Modules _____________________________________________________________

var util = require("util")


// __ Main Object _________________________________________________________

var Step = require("../lib/step.js")

// __ Common things _______________________________________________________

// __ Test 01 _____________________________________________________________o

var step1 = {	"id": "1"
			,	"question" : "Your name: "	
			,	"defaultAnswer": "popo"
			,	"type": "value"
			,	"key": "name"
			,	"nextStep": "2"
			}

var s = new Step(step1)
s.run()
s.emitter.once('next', function() { console.log("Answer: " +  s.getAnswer()) })
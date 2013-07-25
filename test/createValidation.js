/* ___________________________________________________________________________

    Module: createValidation.js   Version: v0.1
    Author: Guillermo Peña (guillermo.pena.cardano@gmail.com)
    Last update: 25/07/2013
    
        Create and save a new validation

______________________________________________________________________________*/



// __ Modules _____________________________________________________________

var util = require("util")

// __ Main Object _________________________________________________________

var EasyWizard = require("../lib/easyWizard.js")
var ew = new EasyWizard()

// __ Test 01 _____________________________________________________________o

var wizardFile = "../examples/createValidation.wizard"
ew.emitter.once('end', function() { console.log("\nResult:\n" +  util.inspect(ew.getObject())) })
ew.emitter.once('paused', function() {
	var o = ew.getObject()
	console.log("Pausing")
	ew.emitter.emit('continue')
})
ew.run(wizardFile)
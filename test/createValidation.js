/* ___________________________________________________________________________

    Module: createValidation.js   Version: v0.1
    Author: Guillermo Peña (guillermo.pena.cardano@gmail.com)
    Last update: 25/07/2013
    
        Create and save a new validation

______________________________________________________________________________*/



// __ Modules _____________________________________________________________

var util = require("util")
//var uuid = require("node-uuid")

// __ Main Object _________________________________________________________

var EasyWizard = require("../lib/easyWizard.js")
var ew = new EasyWizard()

// __ Test 01 _____________________________________________________________o

var wizardFile = "../examples/createValidation.wizard"
ew.emitter.once('end', function() { 
	var o = ew.getObject()
	if ( o.valid == true ) {
		console.log("\nSaving new validation...")
		console.log("Remember your new validation Id: " + o.id)
	} else {
		console.log("\nYour new validation wont be saved...")
	}
	console.log("\nThanks for use ValidationCreator v1.0\n")
})
ew.emitter.once('paused', function() {
	var o = ew.getObject()
	if ( o.id == undefined ) { 
		console.log("\nObject:\n" +  util.inspect(o))
		o.id = 1234 
	}//uuid.v4() }

	ew.emitter.emit('continue')
})

ew.run(wizardFile)
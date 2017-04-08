/* IMPORT METEOR PACKAGES */
	import { ReactiveVar } from 'meteor/reactive-var';

/* IMPORT PAGE COMPONENTS */
	import './logo.html';
	import './list.html';
	import './line.js';

/* IMPORT SHARED TEMPLATES + COMPONENTS */
	import '/imports/ui/components/lists/listFilter.js';


/* IMPORT PROJECT OBJECTS */
	import { kb } from "/imports/startup/both/sharedConstants.js";


/* PARAMETERS*/
	var thisCollection = "inventory";


/* ONCREATED */
Template.inventoryList.created = function(){
};

/* HELPERS */
Template.inventoryList.helpers({
	// EMPTY
});
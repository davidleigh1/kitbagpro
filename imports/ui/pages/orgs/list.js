/* IMPORT METEOR PACKAGES */
	import { ReactiveVar } from 'meteor/reactive-var';


/* IMPORT PAGE COMPONENTS */
	import './logo.html';
	import './list.html';
	import './line.js';
	import '/imports/ui/components/lists/listFilter.js';


/* IMPORT PROJECT OBJECTS */
	import { kb } from "/imports/startup/both/sharedConstants.js";


/* PARAMETERS*/
	var thisCollection = "Orgs";


/* ONCREATED */
// on create, initialize our filter as a ReactiveVar
// need to meteor add reactive-var to use this
Template.orgList.created = function(){
	// EMPTY
};


/* TEMPLATE HELPERS */
Template.orgList.helpers({
	// EMPTY
	// MOVED TO GLOBAL HELPERS
});
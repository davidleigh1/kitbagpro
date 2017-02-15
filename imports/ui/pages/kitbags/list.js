/* IMPORT METEOR PACKAGES */
	import { ReactiveVar } from 'meteor/reactive-var';


/* IMPORT PAGE COMPONENTS */
	import './logo.html';
	import './list.html';
	import './line.js';
	import '/imports/ui/components/lists/listFilter.js';


/* IMPORT PROJECT OBJECTS */
	import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";
	import { Items } from '/imports/startup/both/item-schema.js';


/* PARAMETERS*/
	var thisCollection = "Kitbags";


/* ONCREATED */
Template.kitbagList.created = function(){
	// EMPTY
};


/* HELPERS */
Template.kitbagList.helpers({
	// EMPTY
	// MOVED TO GLOBAL HELPERS
});
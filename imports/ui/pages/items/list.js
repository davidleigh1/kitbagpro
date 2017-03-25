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
	var thisCollection = "Items";


/* ONCREATED */
	// on create, initialize our filter as a ReactiveVar
	// need to meteor add reactive-var to use this
	Template.itemList.created = function(){
		localOrgs = kb.collections.Orgs;
		localKitbags = kb.collections.Kitbags;
		localItems = kb.collections.Items;
	};

/* HELPERS */
Template.itemList.helpers({
		// EMPTY
		// MOVED TO GLOBAL HELPERS
});
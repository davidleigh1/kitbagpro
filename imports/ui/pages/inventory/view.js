/* IMPORT METEOR PACKAGES */
	// import { Session } from 'meteor/session'


/* IMPORT PAGE COMPONENTS */
	import './view.html';
	import './view.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	// import '/imports/ui/pages/kitbags/line.js';
	import '/imports/ui/pages/notFound/noListObjectsFound.js';
	import '/imports/ui/components/urlImagePreviewRollover.html';


/* IMPORT PROJECT OBJECTS */
	import { kb } from "/imports/startup/both/sharedConstants.js";


/* PARAMETERS*/
	var thisCollectionName = "inventory";
	var thisAction = "view";
	var thisUrlId = "_inventoryId";

/* ONCREATED */
	Template.inventoryView.onCreated(function() {
		// EMPTY
	});


/* ONRENDERED */
	Template.inventoryView.onRendered(function(){
	});


/* TEMPLATE HELPERS */
	Template.inventoryView.helpers({
	});


/* EVENTS */
	Template.inventoryView.events({
	});
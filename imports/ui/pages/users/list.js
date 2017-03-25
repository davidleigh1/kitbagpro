/* IMPORT METEOR PACKAGES */
	import { Meteor } from 'meteor/meteor';
	// import { ReactiveVar } from 'meteor/reactive-var';
	// import { ReactiveDict } from 'meteor/reactive-dict';
	// import { Lists } from '../../api/lists/lists.js';
	// import { Template } from 'meteor/templating';
	// import { ActiveRoute } from 'meteor/zimme:active-route';
	// import { FlowRouter } from 'meteor/kadira:flow-router';
	// import { TAPi18n } from 'meteor/tap:i18n';


/* IMPORT PAGE COMPONENTS */
	import './logo.html';
	import './list.html';
	import './list.css';
	import './line.js';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	// import '/imports/ui/components/lists/listFilter.js';


/* IMPORT PROJECT OBJECTS */
	import { kb } from "/imports/startup/both/sharedConstants.js";


/* PARAMETERS*/
	var thisCollection = "Users";


/* ONCREATED */
Template.userList.onCreated(function(){
	// EMPTY
});


/* ONRENDERED */
Template.userList.onRendered(function(){
	jQuery(".userFilterRow").hide();
});


/* HELPERS */
Template.userList.helpers({
});


/* EVENTS */
Template.userList.events({
	'click #toggleUserFilter': function(event) {
		event.preventDefault();
		jQuery(".userFilterRow").toggle();
		jQuery("#userListFilter").focus();
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	}
});



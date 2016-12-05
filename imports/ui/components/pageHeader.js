import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
// import { Lists } from '../../api/lists/lists.js';
// import { Template } from 'meteor/templating';
// import { ActiveRoute } from 'meteor/zimme:active-route';
// import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';


import './pageHeader.html';
// import './menus/menu.js';
// import './pageTitle.js';


Template.pageHeader.helpers({
	pageTitle2: function (attr) {
		return "I am  a page title";
		// "User/Account Details"
	},
	pageSubtitle2: function (attr) {
		return "I am  a subtitle";
	},
	faIcon2: function (attr) {
		return "fa-user-md";
	}
});
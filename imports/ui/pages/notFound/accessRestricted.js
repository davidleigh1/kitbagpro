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
	import './accessRestricted.html';
	import './accessRestricted.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	import '../../../ui/components/pageHeader.js';



/* IMPORT PROJECT OBJECTS */
	// import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';


/* PARAMETERS */
	// var thisCollectionName = "Orgs";
	// var thisAction = "view";
	// var thisUrlId = "_orgId";


/* ONCREATED */
Template.accessRestricted.onCreated(function() {
	// EMPTY 
});

/* ONRENDERED */
Template.accessRestricted.onRendered(function(){
	// EMPTY
});


/* UTIL FUNCTIONS */
Template.accessRestricted.helpers({
	titleText: function (attr) {
		var t = "<span class='blockText'>Access Denied</span>";
		// https://forums.meteor.com/t/how-to-return-html-tag-from-template-helper/2791/2
		return Spacebars.SafeString(t);
	},
	subTitleText: function (attr) {
		var blockedUrl = ( FlowRouter.getQueryParam("blockedUrl") ) ? FlowRouter.getQueryParam("blockedUrl") : FlowRouter.current().path;
		var s = "<br>You do not have permission to access <code><a href='"+blockedUrl+"' target='_blank' id='blockedUrl'>" + unescape(blockedUrl) + "</a></code>";
		// https://forums.meteor.com/t/how-to-return-html-tag-from-template-helper/2791/2
		return Spacebars.SafeString(s);
	},
	blockedUrl: function () {
		/* TODO - There must be a better way than GlobalHelper to allow subTitleText() to get the value from requestedUrl() rather than duplicating */
		return ( FlowRouter.getQueryParam("blockedUrl") ) ? FlowRouter.getQueryParam("blockedUrl") : FlowRouter.current().path;
	},
	referrerUrl: function () {
		return unescape( document.referrer );
	},
	userAgent: function () {
		var ua = (!navigator.userAgent) ? "Unknown Browser" : navigator.userAgent;
		var uv = (!navigator.vendor) ? "Unknown Vendor" : navigator.vendor;
		return ua + " by " + uv;
	}
});
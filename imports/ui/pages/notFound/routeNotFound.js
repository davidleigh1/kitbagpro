
import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
// import { Lists } from '../../api/lists/lists.js';
// import { Template } from 'meteor/templating';
// import { ActiveRoute } from 'meteor/zimme:active-route';
// import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';


import './routeNotFound.html';
import './routeNotFound.css';
// import './components/pageHeader.js';
import '../../../ui/components/pageHeader.js';

Template.routeNotFound.helpers({
	titleText: function (attr) {
		var t = "<span class='blockText'>404 - Page Not Found</span>";
		// https://forums.meteor.com/t/how-to-return-html-tag-from-template-helper/2791/2
		return Spacebars.SafeString(t);
	},
	subTitleText: function (attr) {
		// alert(FlowRouter.getQueryParam("requestedUrl"));
		var failedUrl = ( FlowRouter.getQueryParam("requestedUrl") ) ? FlowRouter.getQueryParam("requestedUrl") : FlowRouter.current().path;
		var forceSuffix = "?force=true" // Allows an non-redirected attempt to access the original page from the 404 page

		var s = "<br>We couldn't find <code><a href='"+failedUrl+forceSuffix+"' target='_blank' id='failedUrl'>" + unescape(failedUrl) + "</a></code>";
		// https://forums.meteor.com/t/how-to-return-html-tag-from-template-helper/2791/2
		return Spacebars.SafeString(s);
	},
	requestedUrl: function () {
		/* TODO - There must be a better way than GlobalHelper to allow subTitleText() to get the value from requestedUrl() rather than duplicating */
		return ( FlowRouter.getQueryParam("requestedUrl") ) ? FlowRouter.getQueryParam("requestedUrl") : FlowRouter.current().path;
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
import './mainLayout.html';

import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';
import { Items } from '/imports/startup/both/item-schema.js';
import { UserList } from '/imports/startup/both/user-schema.js';
// import { Items } from '/imports/api/items/items.js';
// import { Items } from '/both/newItems.js';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';
import { appSettings } from '/imports/startup/both/sharedConstants.js';

// import { insert } from '../../api/orgs/methods.js';

import '/imports/ui/components/loading/loading.js';

import '/imports/ui/pages/startScreen/startScreen.html';
import '/imports/ui/components/globalFooter.html';
import '/imports/ui/components/navigation.js';
// import '/imports/ui/components/headerMenuItems.html';
// import '/imports/ui/components/navbarHeader.html';
// import '/imports/ui/components/sidebarMenuItems.html';
// import '/imports/ui/components/menus/menu.html';
// import '/imports/ui/components/menus/userMenu.html';
// import '../../ui/components/mainLayout/headerMenuItems.html';


Template.mainLayout.onCreated(function(){
  	var that = this;
  		that.subscribe('kitbags');
  		that.subscribe('orgs');
  		that.subscribe('items');
  		// that.subscribe('workjournals');
  	that.autorun(function(){
    		if (/*libProfilesHandle.ready() &&*/ that.subscriptionsReady()) {
      //init data structures
      console.log(" =========== READY NOW ================== ");
    }
  });


	/* REDIRECT USER WHEN PASSWORD IS CHANGED BY ADMIN */
	// https://medium.com/@satyavh/using-flow-router-for-authentication-ba7bb2644f42#.tcxldclg2
	// Tracker.autorun(() => {
	// var lastUser = null;
	// Tracker.autorun(function(){
	// 	var userId = Meteor.userId();
	// 	if ( !userId ){
	// 		// if Session.get("loggedIn")
	// 		// alert("logged out!");
	// 		sAlert.warning("No Meteor.userId() found!");
	// 		console.log("No Meteor.userId() found!");
	//  	} else if (lastUser) {
	// 		// FlowRouter.go('/sign-in');
	//  		FlowRouter.redirect("/sign-in");
	//  		console.log("Tracker.autorun detected change in Meteor.userId()",userId,lastUser);
	//  		sAlert.warning('<samp>Tracker.autorun</samp> detected change in <samp>Meteor.userId()</samp>',{html:true});
	//  	}
	//  	lastUser = Meteor.user();

	//  });

});

// /* ================================================== */
// /*
// 	http://s-alert.meteorapp.com/
// 	http://s-alert-demo.meteorapp.com/
// */
// /* ================================================== */


// Meteor.startup(function () {

// 	console.log("sAlert.config() in mainLayout.js");

//     sAlert.config({
//         effect: 'stackslide',
//         position: 'bottom',
//         timeout: 5000,
//         html: false,
//         onRouteClose: true,
//         stack: true,
//         // or you can pass an object:
//         // stack: {
//         //     spacing: 10 // in px
//         //     limit: 3 // when fourth alert appears all previous ones are cleared
//         // }
//         offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
//         beep: false,
//         // examples:
//         // beep: '/beep.mp3'  // or you can pass an object:
//         // beep: {
//         //     info: '/beep-info.mp3',
//         //     error: '/beep-error.mp3',
//         //     success: '/beep-success.mp3',
//         //     warning: '/beep-warning.mp3'
//         // }
//         onClose: _.noop //
//         // examples:
//         // onClose: function() {
//         //     /* Code here will be executed once the alert closes. */
//         // }
//     });

// });


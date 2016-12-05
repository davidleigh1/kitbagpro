console.log("RUNNING /imports/startup/client/index.js");
/* Imports are included in all new Meteor Projects... since 1.3? */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

/* import './main.html'; */

// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';
import { Items } from '/imports/startup/both/item-schema.js';
import { UserList } from '/imports/startup/both/user-schema.js';
// import { Items } from '/imports/api/items/items.js';
// import { Items } from '/both/newItems.js';
// import { listOrgStatuses } from '/imports/api/orgs/orgs.js';

import { Admin } from '/imports/api/admin/admin.js';

import '/imports/startup/both/schema-kitbags.js';
// import '/imports/startup/both/schema-orgs.js';
// import '/imports/startup/both/schema-items.js';

import './routes.js';
import './globalHelpers.js';
import './globalFunctions.js';
import './globalReactiveVars.js';

// window.myItems = Items;

Meteor.startup(function() {
	//console.log("Loading Google fonts");
	WebFontConfig = {
		google: { families: [ 'Open+Sans:400,300,600,700:latin' ] }
	};
	(function() {
		var wf = document.createElement('script');
		wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
		wf.type = 'text/javascript';
		wf.async = 'true';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(wf, s);
	})();

	/* ================================================== */
	/*
		http://s-alert.meteorapp.com/
		http://s-alert-demo.meteorapp.com/
	*/
	/* ================================================== */


	console.log("sAlert.config() in mainLayout.js");

	sAlert.config({
		effect: 'stackslide',
		position: 'top',
		timeout: 5000,
		html: true,
		onRouteClose: true,
		stack: true,
		// or you can pass an object:
		// stack: {
		//     spacing: 10 // in px
		//     limit: 3 // when fourth alert appears all previous ones are cleared
		// }
		offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
		beep: false,
		// examples:
		// beep: '/beep.mp3'  // or you can pass an object:
		// beep: {
		//     info: '/beep-info.mp3',
		//     error: '/beep-error.mp3',
		//     success: '/beep-success.mp3',
		//     warning: '/beep-warning.mp3'
		// }
		onClose: _.noop //
		// examples:
		// onClose: function() {
		//     /* Code here will be executed once the alert closes. */
		// }
	});


Accounts.onLogin(function() {
  // sAlert.success('Login complete 1!');
  console.log('$ ********** Login complete 1! (client)');
});

// Accounts.onLogout(function() {
//   sAlert.success('Logout complete 1!');
//   console.log('********** Logout complete 1! (client)');
// });



// http://stackoverflow.com/questions/17923290/picking-up-meteor-js-user-logout
// var lastUser=null;

// Meteor.startup(function(){
    // Deps.autorun(function(){
    //     var userId = Meteor.userId();
    //     if(userId){
    //         console.log("________ "+userId+" connected");
    //         // do something with Meteor.user()
    //     }
    //     else if(lastUser){
    //         console.log("________ "+lastUser._id+" disconnected");
    //         // can't use Meteor.user() anymore
    //         // do something with lastUser (read-only !)
    //         Meteor.call("userDisconnected",lastUser._id);
    //     }
    //     lastUser=Meteor.user();
    // });
// });




});


Template.body.onRendered(function() {


	/* REDIRECT USER WHEN PASSWORD IS CHANGED BY ADMIN */
	// https://forums.meteor.com/t/how-to-redirect-a-user-after-server-side-logout-with-accounts-setpassword/30976
	// http://stackoverflow.com/questions/17923290/picking-up-meteor-js-user-logout#answer-17924695

	Tracker.autorun(() => {
		/* Probably overkill to check for all of these but it works... */
		if ( !Meteor.loggingIn() && (!Meteor || !Meteor.user() || Meteor.user() == null || !Meteor.userId()) ) {
			console.log("$ === TRIGGERED DURING LOG OUT PROCESS ===");
		} else if ( Meteor.loggingIn() ) {
			console.log("$ === TRIGGERED DURING LOGGING IN PROCESS ===");
		} else {
			console.log("$ === TRIGGERED DURING STANDARD USAGE ===");
				// console.log('$ User id 3', Meteor.userId() ); // will return the user id
				var sResponse;
				Meteor.call("checkUserIsLoggedIn", Meteor.userId(), function(result1,result2){
					// console.log("$ checkUserIsLoggedIn() Callback", result2, typeof result2 );
					sResponse = result2;
				});
				setTimeout(() => {
					serverResponseFollowUp("timeout", sResponse);
				}, 2000);

				serverResponseFollowUp = function (context, response) {
					// console.log("$ serverResponseFollowUp: ", context, response);
					var msg;
					if (response == "userFound") {
						msg = "<strong>SUCCESS: </strong>Server confirms user is logged in ("+context+"/"+response+")";
						// console.log("$ "+msg);
						sAlert.success(msg);
					} else {
						msg = "<strong>ERROR: </strong>Server indicates <strong>remote logout</strong> ("+context+"/"+response+")";
						// console.log("$ "+msg);
						sAlert.error(msg, {html:true});
						/* Force a page reload as Meteor server-side logout does *not* do this prior to killing session  */
						window.location.reload();
					}
				}
		}
		// console.log("$ Tracker.autorun detected change in Meteor.user()");
		// console.log("$ End of autorun -----------------");
	});

	Accounts.onLogout(() => {
		// console.log('$ ONLOGOUT ', Meteor.userId()); // will return the user id
		setTimeout(() => {
			console.log('$ ONLOGOUT ', Meteor.userId()); // will return undefined
		}, 0);
	});

	// var _logout = Meteor.logout;
	// Meteor.logout = function customLogout() {
	//   // Do your thing here
	//   console.log("$ CUSTOM LOGOUT!");
	//   _logout.apply(Meteor, arguments);
	// }


	const orgHandle = Meteor.subscribe('orgs');
	Tracker.autorun(() => {
		const isReady = orgHandle.ready();
		var status =  isReady ? 'ready' : 'not ready';
		console.log("**** Handle for orgs is " + status + "");
		if (status == "ready") {
			console.log("Setting window.Orgs : ",window.Orgs);
			window.Orgs = Orgs;
			// allSubscriptionsReady("kbHandle");
		}
	});

	const kbHandle = Meteor.subscribe('kitbags');
	Tracker.autorun(() => {
		const isReady = kbHandle.ready();
		var status =  isReady ? 'ready' : 'not ready';
		//console.log("**** Handle for kitbags is " + status + "");
		// if (status == "ready") {
		// 	allSubscriptionsReady("kbHandle");
		// }
	});

	const itemHandle = Meteor.subscribe('items');
	Tracker.autorun(() => {
		const isReady = itemHandle.ready();
		var status =  isReady ? 'ready' : 'not ready';
		console.log("**** Handle for items is " + status + "");
		if (status == "ready") {
			console.log("Setting window.Items : ",window.Items);
			window.Items = Items;
			// allSubscriptionsReady("kbHandle");
		}
	});

	const adminHandle = Meteor.subscribe('admin');
	Tracker.autorun(() => {
		const isReady = adminHandle.ready();
		var status =  isReady ? 'ready' : 'not ready';
		console.log("**** Handle for kitbags is " + status + "");
		// if (status == "ready") {
		// 	allSubscriptionsReady("adminHandle");
		// }
	});

	const userlistHandle = Meteor.subscribe('userlist');
	Tracker.autorun(() => {
		const isReady = userlistHandle.ready();
		var status =  isReady ? 'ready' : 'not ready';
		console.log("**** Handle for userlist is " + status + "");
		// if (status == "ready") {
		// 	allSubscriptionsReady("adminHandle");
		// }
	});
});

Template.body.helpers({
	hideFinished: function () {
		/* https://www.youtube.com/watch?v=7xl-U71_CpA&list=PLLnpHn493BHECNl9I8gwos-hEfFrer7TV&index=9 */
		/* As he says in the video at around 9 minutes, adding the helper for hideFinished doesn't actually add any visible functionality beyond what you already see. In-fact, you can remove the handlebar for hideFinished from the checkbox and it will still work. He is simply adding the helper so the checked state of the checkbox is actually kept in sync. The filtering actually happens with the Session, so adding the helper doesn't accomplish anything extra functionality wise for this video, it's just a good practice.﻿ */
		return Session.get('hideFinished');
	},
	userId: function () {
		return Meteor.userId();
	},
	itemsCollection() {
		console.log("calling itemsCollection()");
		return Items;
	}
}); //ends Template.body.helpers

Template.body.events({
	'change .hide-finished': function(event) {
		Session.set('hideFinished', event.target.checked);
	} //ends 'submit .hide-finished';
}); //ends Template.body.events

Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
	// One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
});
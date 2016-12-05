// console.log("Route: RUNNING clients.routes.js");


// # set up all routes in the app

// Start with requirements
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
// import meteor add zimme:active-route (https://github.com/zimme/meteor-active-route)
/*  TODO: is this the package we use??
import { AccountsTemplates } from 'meteor/useraccounts:core';
*/



/* CONTENT PROTECTION - DISABLE THE FOLLOWING LINE TO REMOVE USER ACCOUNT / PASSWORD PROTECTION */
FlowRouter.triggers.enter([AccountsTemplates.ensureSignedIn]);

// Import to load these templates
// import '../../ui/';
import '../../ui/layouts/mainLayout.js';
FlowRouter.route("/", {
	name:"root",
	action: function(params, queryParams) {
		//console.log("Route: Root", params, queryParams);
		BlazeLayout.render("mainLayout", {
			main: "dashboard",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});


// Import Loading component
import '/imports/ui/components/loading/loading.js';
FlowRouter.route("/loading", {
	name:"loading",
	action: function(params, queryParams) {
		//console.log("Route: Loading... (Test 'Loading' template)", params, queryParams);
		BlazeLayout.render("mainLayout", {
			main: "loading",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});



// Import Pages
import '../../ui/pages/dashboard/dashboard.js';
FlowRouter.route("/dashboard", {
	name:"dashboard",
	action: function(params, queryParams) {
		/*console.log("Route: Admin (dashboard)", params, queryParams);*/
		BlazeLayout.render("mainLayout", {
			main: "dashboard",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});

import '../../ui/pages/settings/settings.js';
FlowRouter.route("/settings", {
	name:"mySettings",
	action: function(params, queryParams) {
		/*console.log("Route: Profile > Settings (My Settings)", params, queryParams);*/
		BlazeLayout.render("mainLayout",{
			main: "settings",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});

import '../../ui/pages/about/about.js';
FlowRouter.route("/about", {
	name:"about",
	// triggersEnter: [AccountsTemplates.ensureSignedIn],  // ROUTE LEVEL PROTECTION
	action: function(params, queryParams) {
		/*console.log("Route: Profile > about (About KitbagPro", params, queryParams);*/
		BlazeLayout.render("mainLayout",{
			main: "about",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});

import '../../ui/pages/debug/debug.js';
FlowRouter.route("/debug", {
	name:"debug",
	// triggersEnter: [AccountsTemplates.ensureSignedIn],  // ROUTE LEVEL PROTECTION
	action: function(params, queryParams) {
		BlazeLayout.render("mainLayout",{
			main: "debug",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});




/* ORGS */


	/* GROUP - ORGS */
	var orgsRoutes = FlowRouter.group({
		prefix: '/orgs',
		name: 'orgs',
		triggersEnter: [function(context, redirect) {
			//console.log('Route: Running /orgs GROUP triggers');
		}]
	});


			// import '../../ui/pages/orgs/orgAddEdit.js';
			// /* ORGS ADD */
			// orgsRoutes.route("/create", {
			// 	name:"orgAdd",
			// 	action: function(params, queryParams) {
			// 		//console.log("Route: Orgs > Create Org (Create New Org)", params, queryParams);
			// 		BlazeLayout.render("mainLayout", {
			// 			main: "orgAddEdit",
			// 			nav: "navigation",
			// 			footer: "globalFooter"
			// 		});
			// 	}
			// });

			import '../../ui/pages/orgs/orgAdd.js';
			/* ORGS ADD */
			FlowRouter.route("/orgs/create/", {
				name: "orgAdd",
				action: function(params, queryParams) {
					BlazeLayout.render("mainLayout", {
						main: "orgAdd",
						nav: "navigation",
						footer: "globalFooter"
					});
				}
			});



			import '../../ui/pages/orgs/orgList.js';
			/* ORGS LIST */
			orgsRoutes.route("/list", {
				name:"orgList",
				action: function(params, queryParams) {
					//console.log("Route: Organizations > Org List (Org List)", params, queryParams);
					BlazeLayout.render("mainLayout", {
						main: "orgList",
						nav: "navigation",
						footer: "globalFooter"
					});
				}
			});




			/* ORGS HOME */
			orgsRoutes.route('/:_command', {
				name:"orgMissingCommand",
				action: function(params) {
					// console.log("REDIRECT",params)

					// if ( params._command == "/create" ){
					// 	var newUrl = "/orgs/" + params._command + "/view";
					// 	FlowRouter.go(newUrl);
					// }

					/* Check to see if valid Org ID before redirecting to VIEW page */
					/* NOTE - This doesn't check if ID is FOUND in DB, it only checks if ID has valid pattern */
					if ( GlobalHelpers.isValidId( params._command ,"org") || FlowRouter.getQueryParam("force") == "true" ) {
						var newUrl = "/orgs/" + params._command + "/view";
						FlowRouter.go(newUrl);
					} else {
						/* Go to 404 */
						// FlowRouter.go('/404?reqUrl='+FlowRouter.current().path+"&referrer="+document.referrer);
						FlowRouter.go('/404');
					}
				},
				triggersEnter: [function(context, redirect) {
					// console.log('Route: Running /orgs **orgMissingCommand** trigger -- REDIRECTING!');
				}]
			});



	/* GROUP - ORGS + ORGID */
	var orgsWithId = orgsRoutes.group({
		// prefix: '/:_orgId([0-9]*)?',
		//prefix: '/:_orgId(^(?=\\d{16}$)(1221)\\d+)',
		prefix: '/:_orgId',
		name: 'NEW2_orgsWithId',
		triggersEnter: [function(context, redirect) {
			//console.log('Route: Running /orgs/:_id GROUP triggers <<--------------------');
		}]
	});


		/* ORGS VIEW */
		import '/imports/ui/pages/orgs/orgView.js';
		orgsWithId.route("/view", {
			name:"orgView",
			action: function(params, queryParams) {
				//console.log("Route: Orgs > View (Org Profile View)", params, queryParams);
				BlazeLayout.render("mainLayout", {
					main: "orgView",
					nav: "navigation",
					footer: "globalFooter"
				});
			}
		});

		/* ORGS EDIT */
		// orgsWithId.route("/edit", {
		// 	name:"orgEdit",
		// 	action: function(params, queryParams) {
		// 		// console.log("Route: Organizations > Edit (Org Profile Edit)", params, queryParams);
		// 		BlazeLayout.render("mainLayout", {
		// 			main: "orgAddEdit",
		// 			nav: "navigation",
		// 			footer: "globalFooter"
		// 		});
		// 	}
		// });
		import '../../ui/pages/orgs/orgEdit.js';
		FlowRouter.route("/orgs/:_orgId/edit", {
			name: "orgEdit",
			action: function(params, queryParams) {
				/*console.log("Route: Equipment > N/A (Item Edit)", params, queryParams);*/
				BlazeLayout.render("mainLayout", {
					main: "orgEdit",
					nav: "navigation",
					footer: "globalFooter"
				});
			}
		});
		import '../../ui/pages/orgs/orgDuplicate.js';
		FlowRouter.route("/orgs/:_orgId/duplicate", {
			name: "orgDuplicate",
			action: function(params, queryParams) {
				/*console.log("Route: Equipment > N/A (Item Edit)", params, queryParams);*/
				BlazeLayout.render("mainLayout", {
					main: "orgDuplicate",
					nav: "navigation",
					footer: "globalFooter"
				});
			}
		});




/* PHASE ONE */
import '../../ui/pages/kitbags/kitbagList.js';
FlowRouter.route("/bags/list", {
	name:"kitbagList",
	action: function(params, queryParams) {
		// console.log("Route: Kitbags > Kitbag List (Kitbag List)", params, queryParams);
		BlazeLayout.render("mainLayout", {
			main: "kitbagList",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});
import '../../ui/pages/kitbags/kitbagAddEdit.js';
FlowRouter.route("/bags/create/:_orgId", {
	name:"kitbagAdd",
	action: function(params, queryParams) {
		// console.log("Route: Kitbags > Create New Kitbag (Create New Kitbag )", params, queryParams);
		BlazeLayout.render("mainLayout", {
			main: "kitbagAddEdit",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});




/*----------------------------------------*/
/*-------------  I T E M S   -------------*/
/*----------------------------------------*/




import '../../ui/pages/items/itemList.js';
FlowRouter.route("/items/list", {
	name: "itemList",
	action: function(params, queryParams) {
		/*console.log("Route: Equipment > List of Items (Item List)", params, queryParams);*/
		BlazeLayout.render("mainLayout", {
			main: "itemList",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});
import '../../ui/pages/items/itemView.js';
FlowRouter.route("/items/:_itemId/view", {
	name: "itemView",
	action: function(params, queryParams) {
		/*console.log("Route: Equipment > N/A (Item View)", params, queryParams);*/
		BlazeLayout.render("mainLayout", {
			main: "itemView",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});
import '../../ui/pages/items/itemEdit.js';
FlowRouter.route("/items/:_itemId/edit", {
	name: "itemEdit",
	action: function(params, queryParams) {
		/*console.log("Route: Equipment > N/A (Item Edit)", params, queryParams);*/
		BlazeLayout.render("mainLayout", {
			main: "itemEdit",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});
import '../../ui/pages/items/itemAdd.js';
FlowRouter.route("/items/create/:_kitbagId", { // NOTE - We have the kitbag ID here in the URL to enable us to assign this new item automatically to a predefined kitbag
	name: "itemAdd",
	action: function(params, queryParams) {
		/*console.log("Route: Equipment > N/A (Create New Item)", params, queryParams);*/
		BlazeLayout.render("mainLayout", {
			main: "itemAdd",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});







// the routeNotFound template is used for unknown routes and missing lists

import '../../ui/pages/notFound/routeNotFound.js';

FlowRouter.route("/404", {
	name:"404",
	action: function(params, queryParams) {
		// console.log("Route: Page not known / not found!", params, queryParams);
		BlazeLayout.render("mainLayout", {
			main: "routeNotFound",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});



FlowRouter.notFound = {
	name: "notFound",
	action(params, queryParams) {
		// BlazeLayout.render('mainLayout', {
		// 	main: 'routeNotFound',
		// 	nav: "navigation",
		// 	footer: "globalFooter"
		// });
		// console.log("REDIRECTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
		// FlowRouter.redirect('/404?reqUrl='+FlowRouter.current().path+"&referrer="+document.referrer);
		// FlowRouter.setQueryParams();
		FlowRouter.go('/404',{},{
			requestedUrl: FlowRouter.current().path,
			referrerUrl: document.referrer
		});

	}
};




/*
// Import to override accounts templates
import '../../ui/accounts/accounts-templates.js';

*/
// Below here are the route definitions



/*Router.configure({
	// Defining here application-wide layouts.
	// Here we can define a header and a footer that will appear on every page of the application
	// without manually including any templates
	// http://meteortips.com/second-meteor-tutorial/iron-router-part-1/
	layoutTemplate: 'mainLayout'
});*/

/* Register the homepage template that will appear within the {{>yield}} of our layout template
// Note '/' = Homepage
Router.route('/', {
	name: 'home',
	template: 'startScreen',
//	loadingTemplate: 'loading', // Optional loading template.
//	subscriptions: function() {
// 		// We can return a single subscription, or an array of subscriptions here.
//		return [
//			/* Meteor.subscribe( 'inbox', chatUserStatus ), */
// 			Meteor.subscribe("orgs"),
// 			Meteor.subscribe("kitbags"),
// 			Meteor.subscribe("userList")
//		];
//	} }); */


// FlowRouter.route('/', {
// 	name: 'home',
// 	action: function(params, queryParams) {
// 		//console.log("Route: This is the home page!", params, queryParams);
// 		BlazeLayout.render("mainLayout", {
// 			main: "startScreen",
// 			nav: "navigation",
// 			/* footer: "globalFooter" */
// 		});
// 	}
// });

/* USER MANAGEMENT + USER PROFILE */

import '/imports/ui/pages/users/userList.js';
FlowRouter.route("/users/list", {
	name:"userList",
	action: function(params, queryParams) {
		/*console.log("Route: Users > User List (User List)", params, queryParams);*/
		BlazeLayout.render("mainLayout", {
			main: "userList",
			nav: "navigation",
			footer: "globalFooter"
		});
	}
});

import '/imports/ui/pages/users/userView.js';
FlowRouter.route("/users/:_userId/view", {
	name:"userView",
	action: function(params, queryParams) {
		/*console.log("Route: Users > N/A (User Profile View)", params, queryParams);*/
		BlazeLayout.render("mainLayout", {
		main: "userView",
		nav: "navigation",
		footer: "globalFooter"
		});
	}
});

import '/imports/ui/pages/users/userEdit.js';
FlowRouter.route("/users/:_userId/edit", {
	name:"userEdit",
	action: function(params, queryParams) {
		/*console.log("Route: Users > N/A (User Profile Edit)", params, queryParams);*/
		BlazeLayout.render("mainLayout", {
		main: "userEdit",
		nav: "navigation",
		footer: "globalFooter"
		});
	}
});
import '/imports/ui/pages/users/userAdd.js';
FlowRouter.route("/users/create/:_orgId", {
	name:"userAdd",
	action: function(params, queryParams) {
		/*console.log("Route: Users > Create User (Create New Org User)", params, queryParams);*/
		BlazeLayout.render("mainLayout", {
		main: "userAdd",
		nav: "navigation",
		footer: "globalFooter"
		});
	}
});
// FlowRouter.route("/users/create/new", {
// 	name:"Request New User Login",
// 	action: function(params, queryParams) {
// 		/*console.log("Route: Users > Create Non-Org User (Request New User Login)", params, queryParams);*/
// 		BlazeLayout.render("mainLayout", {
// 		main: "startScreen",
// 		nav: "navigation",
// 		footer: "globalFooter"
// 		});
// 	}
// });
// FlowRouter.route("/users/list/edit", {
// 	name:"User Bulk Edit",
// 	action: function(params, queryParams) {
// 		/*console.log("Route: Users > N/A (User Bulk Edit)", params, queryParams);*/
// 		BlazeLayout.render("mainLayout", {
// 		main: "startScreen",
// 		nav: "navigation",
// 		footer: "globalFooter"
// 		});
// 	}
// });

/* PHASE TWO */

// FlowRouter.route("/", {name:"home",action: function(params, queryParams) { /*console.log("Route: Home > Start (Splash Screen)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/bags/:_bagId", {name:"Kitbag Profile View",action: function(params, queryParams) { /*console.log("Route: Kitbags > N/A (Kitbag Profile View)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/bags/:_bagId/edit", {name:"Kitbag Profile Edit",action: function(params, queryParams) { /*console.log("Route: Kitbags > N/A (Kitbag Profile Edit)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/cart/in", {name:"Checkin",action: function(params, queryParams) { /*console.log("Route: My Gear > Checkin (Checkin)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/cart/out", {name:"Checkout",action: function(params, queryParams) { /*console.log("Route: My Gear > Checkout (Checkout)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/inbox", {name:"Notifications / Inbox",action: function(params, queryParams) { /*console.log("Route: Notifications > Inbox (Notifications / Inbox)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/quick/in", {name:"Quick Checkin",action: function(params, queryParams) { /*console.log("Route: My Gear > Quick Checkin (Quick Checkin)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/quick/out", {name:"Quick Checkout",action: function(params, queryParams) { /*console.log("Route: My Gear > Quick Checkout (Quick Checkout)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/review", {name:"Bag Check",action: function(params, queryParams) { /*console.log("Route: Actions > Check Kitbag (Bag Check)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/review/history", {name:"Bag Check History",action: function(params, queryParams) { /*console.log("Route: Kitbag > Bag History (Bag Check History)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/share", {name:"Share Bag Status",action: function(params, queryParams) { /*console.log("Route: Actions > Share Bag Status (Share Bag Status)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/status/(me)", {name:"My Status",action: function(params, queryParams) { /*console.log("Route: Home > User Status (My Status)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/status/orgs/(myprimary)", {name:"Org Status",action: function(params, queryParams) { /*console.log("Route: Home > Org Status (Org Status)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route("/status/system", {name:"System Status",action: function(params, queryParams) { /*console.log("Route: Home > System Status (System Status)", params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "startScreen", nav: "navigation",/* footer: "globalFooter" */});}});

/* THEME CONTENT */

FlowRouter.route('/charts', 			{name:"charts",				action: function(params, queryParams) { /*console.log("Route: charts", 			params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "charts", 			nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route('/tables', 			{name:"tables",				action: function(params, queryParams) { /*console.log("Route: tables", 			params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "tables", 			nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route('/forms', 				{name:"forms",				action: function(params, queryParams) { /*console.log("Route: forms", 			params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "forms", 			nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route('/bootstrapElements', 	{name:"bootstrapElements",	action: function(params, queryParams) { /*console.log("Route: bootstrapElements",params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "bootstrapElements",nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route('/bootstrapGrid', 		{name:"bootstrapGrid",		action: function(params, queryParams) { /*console.log("Route: bootstrapGrid", 	params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "bootstrapGrid", 	nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route('/blankPage', 			{name:"blankPage",			action: function(params, queryParams) { /*console.log("Route: blankPage", 		params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "blankPage", 		nav: "navigation",/* footer: "globalFooter" */});}});
FlowRouter.route('/indexRTL', 			{name:"indexRTL",			action: function(params, queryParams) { /*console.log("Route: indexRTL", 		params, queryParams);*/ BlazeLayout.render("mainLayout", {main: "indexRTL", 		nav: "navigation",/* footer: "globalFooter" */});}});


/*

// Kitbag Routes
Router.route('/kitbagList');
Router.route('/kitbagAddEdit');
Router.route('/orgList');

Router.route('/newOrg', function () {
	this.render('orgAddEdit', {
		name: 'newOrg',
		data: function () {
			addOrEdit = "add";
			thisOrg = {};
		}
	});
});
Router.route('/orgs/:orgId', function () {
	this.render('orgAddEdit', {
		name: 'editOrg',
		data: function () {
			addOrEdit = "edit";
			thisOrg = MyCollections["Orgs"].findOne({orgId: ""+this.params.orgId});
		}
	});
});





Router.route('/users', {
	name: 'users',
	template: 'userList'
});
Router.route('/settings');
// SB-Admin Routes
Router.route('/admin', {
	name: 'dashboard',
	template: 'dashboard'
});


Router.route('/kitbag/:someParameter', {
	data: function(){
		//console.log("Route: This is an kitbag page.",this.params.someParameter);
	}
});
// Router.route('/orgView/:orgId', {
// 	data: function(){
// 		//console.log("Route: This is an organisation page.",this.params.someParameter);
// 	}
// });
Router.route('/orgView/:orgId', function () {
	//console.log("Route: This is an organisation page.",this.params);
	this.render('orgView', {
		data: function () {
			//return Posts.findOne({orgId: this.params.orgId});
			return MyCollections["Orgs"].findOne({orgId: ""+this.params.orgId});
		}
	});
});

*/

import '/imports/ui/layouts/fullPage.js';
import '/imports/ui/pages/account/myCustomFullPageAtForm.js';
import '/imports/ui/pages/account/customAtForm.js';

// import '/imports/ui/pages/account/login.js';
// FlowRouter.route("/login", {
// 	name:"login",
// 	action: function(params, queryParams) {
// 		//console.log("Route: Root", params, queryParams);
// 		BlazeLayout.render("fullPage", {
// 			main: "login"
// 		});
// 	}
// });

FlowRouter.route("/logout", {
	name:"logout",
	action: function(params, queryParams) {
		console.log("Route: logout", params, queryParams);
		BlazeLayout.render("fullPage", {
			main: "myCustomFullPageAtForm"
		});
	}
});

FlowRouter.triggers.exit( [ exitSignInFunction ], {
	only: [
		'atSignIn'
		]
});

function exitSignInFunction() {
	// console.log( "Exiting route: " + FlowRouter.getRouteName() );
	cyclebackgrounds_abortTimer();
}



FlowRouter.route('/sign-out', {
  name: 'sign-out',
	triggersEnter: [function(context, redirect) {
		AccountsTemplates.logout();
		FlowRouter.go('/');
	}]
  // 	onBeforeAction: function () {
  //   AccountsTemplates.logout();
  //   FlowRouter.go('/');
  //   //this.next(); //this line causes 'sign-out template not found error
  // }
});



// //Routes
// AccountsTemplates.configureRoute('changePwd');
// AccountsTemplates.configureRoute('forgotPwd');
// AccountsTemplates.configureRoute('resetPwd');
// AccountsTemplates.configureRoute('signIn');
// AccountsTemplates.configureRoute('signUp');
// AccountsTemplates.configureRoute('verifyEmail');
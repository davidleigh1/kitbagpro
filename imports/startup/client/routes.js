// Start with requirements
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';




/* CONTENT PROTECTION - DISABLE THE FOLLOWING LINE TO REMOVE USER ACCOUNT / PASSWORD PROTECTION */
// FlowRouter.triggers.enter([AccountsTemplates.ensureSignedIn]);


/*----------------------------------------*/
/*-------------  TEMPLATES   -------------*/
/*----------------------------------------*/

	// Import to load these templates
	// import '/imports/ui/';
	import '/imports/ui/layouts/mainLayout.js';
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



/*---------------------------------------------------*/
/*-------------  Misc Top-Level Pages   -------------*/
/*---------------------------------------------------*/

	import '/imports/ui/pages/dashboard/dashboard.js';
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

	import '/imports/ui/pages/settings/settings.js';
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

	import '/imports/ui/pages/about/about.js';
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

	import '/imports/ui/pages/debug/debug.js';
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


/*--------------------------------------*/
/*-------------  O R G S   -------------*/
/*--------------------------------------*/


	/* GROUP - ORGS */
	var orgsRoutes = FlowRouter.group({
		prefix: '/orgs',
		name: 'orgs',
		triggersEnter: [function(context, redirect) {
			//console.log('Route: Running /orgs GROUP triggers');
		}]
	});

		import '/imports/ui/pages/orgs/add.js';
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

		import '/imports/ui/pages/orgs/list.js';
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
		name: 'orgs',
		triggersEnter: [function(context, redirect) {
			//console.log('Route: Running /orgs/:_id GROUP triggers <<--------------------');
		}]
	});


		/* ORGS VIEW */
		import '/imports/ui/pages/orgs/view.js';
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

		import '/imports/ui/pages/orgs/edit.js';
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
		import '/imports/ui/pages/orgs/duplicate.js';
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




/*--------------------------------------------*/
/*-------------  K I T B A G S   -------------*/
/*--------------------------------------------*/

	import '/imports/ui/pages/kitbags/list.js';
	FlowRouter.route("/kitbags/list", {
		name: "kitbagList",
		action: function(params, queryParams) {
			BlazeLayout.render("mainLayout", {
				main: "kitbagList",
				nav: "navigation",
				footer: "globalFooter"
			});
		}
	});
	import '/imports/ui/pages/kitbags/view.js';
	FlowRouter.route("/kitbags/:_kitbagId/view", {
		name: "kitbagView",
		action: function(params, queryParams) {
			BlazeLayout.render("mainLayout", {
				main: "kitbagView",
				nav: "navigation",
				footer: "globalFooter"
			});
		}
	});
	import '/imports/ui/pages/kitbags/edit.js';
	FlowRouter.route("/kitbags/:_kitbagId/edit", {
		name: "kitbagEdit",
		action: function(params, queryParams) {
			BlazeLayout.render("mainLayout", {
				main: "kitbagEdit",
				nav: "navigation",
				footer: "globalFooter"
			});
		}
	});
	import '/imports/ui/pages/kitbags/add.js';
	FlowRouter.route("/kitbags/create/:_orgId", {
		name: "kitbagAdd",
		action: function(params, queryParams) {
			BlazeLayout.render("mainLayout", {
				main: "kitbagAdd",
				nav: "navigation",
				footer: "globalFooter"
			});
		}
	});
	import '/imports/ui/pages/kitbags/duplicate.js';
	FlowRouter.route("/kitbags/:_kitbagId/duplicate", {
		name: "kitbagDuplicate",
		action: function(params, queryParams) {
			BlazeLayout.render("mainLayout", {
				main: "kitbagDuplicate",
				nav: "navigation",
				footer: "globalFooter"
			});
		}
	});



/*----------------------------------------*/
/*-------------  I T E M S   -------------*/
/*----------------------------------------*/

	import '/imports/ui/pages/items/itemList.js';
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
	import '/imports/ui/pages/items/itemView.js';
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
	import '/imports/ui/pages/items/itemEdit.js';
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
	import '/imports/ui/pages/items/itemAdd.js';
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





/*-----------------------------------*/
/*-------------  4 0 4  -------------*/
/*-----------------------------------*/

	// the routeNotFound template is used for unknown routes and missing lists

	import '/imports/ui/pages/notFound/routeNotFound.js';
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
			FlowRouter.go('/404',{},{
				requestedUrl: FlowRouter.current().path,
				referrerUrl: document.referrer
			});

		}
	};



/*---------------------------------------*/
/*-------------  U S E R S  -------------*/
/*---------------------------------------*/

	/* USER MANAGEMENT + USER PROFILES */

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


/*---------------------------------------*/
/*-------------  PHASE TWO  -------------*/
/*---------------------------------------*/

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




/*-----------------------------------*/
/*-------------  FORMS  -------------*/
/*-----------------------------------*/

	import '/imports/ui/layouts/fullPage.js';
	import '/imports/ui/pages/account/myCustomFullPageAtForm.js';
	import '/imports/ui/pages/account/customAtForm.js';



/*------------------------------------*/
/*-------------  LOGOUT  -------------*/
/*------------------------------------*/

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
	});
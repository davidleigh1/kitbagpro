// # set up all routes in the app
// Official advice is a single route.js but have split into two instead
// https://guide.meteor.com/structure.html

/* GLOBAL ROUTE RULES */

// FlowRouter.triggers.enter( [ enterFunction ] );
// FlowRouter.triggers.exit( [ exitFunction ] );

/* GLOBAL ROUTE RULES WITH FILTERS */

// Using only, this means to *only* call this function on these routes.
FlowRouter.triggers.enter( [ enterFunction ], {
	// Note using the names of routes so requires passing a name property when defining route
	except: [ 
		'somePage', 
		'anotherPage', 
		'thisPage'
		]
});

// Using except, this means to call this function on all routes *except* these.
FlowRouter.triggers.exit( [ exitFunction ], { 
	except: [ 
		'page', 
		'notThisPage', 
		'thatPage'
		]
});

// FlowRouter.triggers.exit( [ exitFunction ] );

function enterFunction() {
	console.log( "---> Entering route: " + FlowRouter.getRouteName() );
}

function exitFunction() {
	console.log( "<--- Exiting route: " + FlowRouter.getRouteName() );
}


/* ENDS -- GLOBAL ROUTE RULES WITH FILTERS */
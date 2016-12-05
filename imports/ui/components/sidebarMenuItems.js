import './sidebarMenuItems.html';

Template.sidebarMenuItems.helpers({
	activeIfTemplateIs: function (template) {
		/*var gCurrentRoute = FlowRouter.current();*/
		var gCurrentRoute = FlowRouter.getRouteName();
		//console.log("gCurrentRoute: ",template,gCurrentRoute.lookupTemplate());
		return gCurrentRoute &&
			template.toLowerCase() === gCurrentRoute.toLowerCase() ? 'active' : '';
	}
});

Template.sidebarMenuItems.events({
	'click .navbar-collapse.in': function(e) {
		console.log('Click!',$(this));
		/*
			TODO: Ensure this isnt because jquery or bootstrap is being loaded twice! see: http://stackoverflow.com/questions/21203111/
		*/
		if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
			// console.log('Hide!',$(this));
			$('.collapse').collapse('hide');
		}
	}
});
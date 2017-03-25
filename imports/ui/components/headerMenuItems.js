import './headerMenuItems.html';
import './menus/userMenu.js';

Template.headerMenuItems.helpers({
	userString: function () {
		if ( Meteor.user() ) {
			if ( Meteor.user().username && Meteor.user().username != "" ) {
				return Meteor.user().username;
			} else {
				return "UserId: " + Meteor.userId();
			}
		} else {
			return "Guest User";
		}
	},
	userType: function () {
		if ( Meteor.user() ) {
			if ( jQuery.isPlainObject(Meteor.user()) && Meteor.user().type && Meteor.user().type != "" ) {
				return Meteor.user().type;
			}
		} else {
			return "Unknown";
		}
	}
});


Template.headerMenuItems.onRendered(function(){

	$(document).on('click','.navbar-collapse.in',function(e) {
		if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
			$(this).collapse('hide');
		}
	});

});


Template.headerMenuItems.events({
	// 'click button.submit': function(event) {
	// 	event.preventDefault();
	// 	AccountsTemplates.logout();
	// },
	// 'click button.cancel': function(event) {
	// 	event.preventDefault();
	// 	alert('cancel button!');
	// }
});




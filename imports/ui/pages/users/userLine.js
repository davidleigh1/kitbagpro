import './userLine.html';

// Template.userLine.helpers

trashUser = function (clickObj) {
	// console.log('deleteKb: ',clickObj);
	Meteor.call("setUserStatus",clickObj.userObj._id, "Trashed");
};

Template.userLine.helpers({
	log: function() {
		// console.log(this);
	},
	isCurrentUser: function() {
		if (Meteor.userId() == this._id) {
			return true;
		} else {
			return false;
		}
	}
});

Template.userLine.events({
	'click button.view': function(event) {
		console.log("$(event.target)",$(event.target),"event.target.dataset.user",event.target.dataset.user);
		var o = $(event.target).data("user");
		FlowRouter.go("/users/"+o+"/view");
	},
	'click button.edit': function(event) {
		console.log("$(event.target)",$(event.target),"event.target.dataset.user",event.target.dataset.user);
		FlowRouter.go("/users/"+event.target.dataset.user+"/edit");
	}
});

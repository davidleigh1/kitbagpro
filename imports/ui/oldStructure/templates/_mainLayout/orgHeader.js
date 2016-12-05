if (Meteor.isClient) {

	editOrgDetails = function (obj) {
		console.log('editOrgDetails: ',obj.orgObj.orgId);
		console.log("/orgs/"+obj.orgObj.orgId+"/view");
		FlowRouter.go("/orgs/"+obj.orgObj.orgId+"/view");
	};

// Template.orgHeader.helpers


// Template.orgHeader.events
	Template.orgHeader.events({
		'click .dropdown-menu a': function(event) {
				// console.log('a click: ',this,$(event.target).data('action'));
				var clickObj = {
					action: $(event.target).data('action'),
					orgId: $(event.target).data('org'),
					orgObj: this
				};
				if (typeof clickObj.action == "string" && typeof window[clickObj.action] == "function" ){
					window[$(event.target).data('action')](clickObj);
					return false;
				} else {
					console.log("Error: 'action' function was not found (code: 0104)");
				};
		}
	});

};
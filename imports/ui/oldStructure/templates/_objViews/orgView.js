if (Meteor.isClient) {

// Template.orgView.helpers

	Template.orgView.helpers({
		lookup: function(arrayObjValue, arrayObjName) {
			if (arrayObjName != "owner"){
				return arrayObjValue;
			} else {
				var un = GlobalHelpers.lookupNameFromUser( arrayObjValue , "name" );
				var result = un + " (" + arrayObjValue + ")";
				return result;
			}
		}
	});

// Template.orgView.events


};
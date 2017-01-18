import { ReactiveVar } from 'meteor/reactive-var';

import './logo.html';
import './list.html';
import './line.js';

import { Orgs } 		from '/imports/startup/both/schema-org.js';
import { Kitbags } 		from '/imports/startup/both/kitbag-schema.js';
import { Items } 		from '/imports/startup/both/item-schema.js';
// import { UserList } 	from '/imports/startup/both/schema-user.js';
// import { appSettings } 	from '/imports/startup/both/sharedConstants.js';

import '/imports/ui/components/lists/listFilter.js';

// on create, initialize our filter as a ReactiveVar
// need to meteor add reactive-var to use this
Template.kitbagList.created = function(){
	// console.log("Template.kitbagList.created");
	//this.filter = new ReactiveVar();
	//console.log("this.filter: "+this.filter);
	localOrgs = Orgs;
	localKitbags = Kitbags;
	localItems = Items;
};

// Template.kitbagList.helpers

Template.kitbagList.helpers({
// 	// value of the filter to initialize the HTML input
// 	filter:function(){
// 		console.log("filter helper in kitbagList.js - DUPLICATE?");
// 		return Template.instance().filter.get();
// 	}
	// thisKitbag: function () {
	// 	//return Template.parentData();
	// 	return Template.currentData().thisKitbag;
	// 	// console.log("listType",argument,Template.currentData() );
	// }
});
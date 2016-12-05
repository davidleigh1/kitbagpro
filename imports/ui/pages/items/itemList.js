import { ReactiveVar } from 'meteor/reactive-var';

import './itemLogo.html';
import './itemList.html';
import './itemLine.js';

// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';
import { Items } from '/imports/startup/both/item-schema.js';
// import { Items } from '/imports/api/items/items.js';
// import { Items } from '/both/newItems.js';

import '/imports/ui/components/lists/listFilter.js';

// on create, initialize our filter as a ReactiveVar
// need to meteor add reactive-var to use this
Template.itemList.created = function(){
	// console.log("Template.itemList.created");
	//this.filter = new ReactiveVar();
	//console.log("this.filter: "+this.filter);
	localOrgs = Orgs;
	localKitbags = Kitbags;
	localItems = Items;
};

// Template.itemList.helpers

Template.itemList.helpers({
// 	// value of the filter to initialize the HTML input
// 	filter:function(){
// 		console.log("filter helper in itemList.js - DUPLICATE?");
// 		return Template.instance().filter.get();
// 	}
	// thisItem: function () {
	// 	//return Template.parentData();
	// 	return Template.currentData().thisItem;
	// 	// console.log("listType",argument,Template.currentData() );
	// }
});
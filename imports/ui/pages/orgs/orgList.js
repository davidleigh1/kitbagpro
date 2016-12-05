import { ReactiveVar } from 'meteor/reactive-var';

import './orgList.html';
import './orgLine.js';

import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';

import '/imports/ui/components/lists/listFilter.js';

// on create, initialize our filter as a ReactiveVar
// need to meteor add reactive-var to use this
Template.orgList.created = function(){
	// console.log("Template.orgList.created");
	//this.filter = new ReactiveVar();
	//console.log("this.filter: "+this.filter);
};

// Template.orgList.helpers

Template.orgList.helpers({
// 	// value of the filter to initialize the HTML input
// 	filter:function(){
// 		console.log("filter helper in orgList.js - DUPLICATE?");
// 		return Template.instance().filter.get();
// 	}
});
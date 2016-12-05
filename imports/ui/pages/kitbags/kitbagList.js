import { ReactiveVar } from 'meteor/reactive-var';

import './kitbagList.html';
import './kitbagLine.js';

import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';

import '/imports/ui/components/lists/listFilter.js';

// on create, initialize our filter as a ReactiveVar
// need to meteor add reactive-var to use this
Template.kitbagList.created = function(){
};

// Template.kitbagList.helpers

Template.kitbagList.helpers({
});

// Template.kitbagList.events

	// bind the value of the input to the underlying filter
// 	Template.kitbagList.events({
// 		"input .filterInput": function(event,template){
// 			var currentValue = template.find(".filterInput").value;
// 			template.filter.set(currentValue);
// 		},
// 		"change .listSorter": function(event,template){
// 			// // Adding a check to only reorder if the new sort order != existing sort order
// 			// var newValue = $(event.target).val();
// 			// var oldValue = Session.get("sortOrder");
// 			// if (newValue != oldValue) {


// // thisObj = ""; sortElem = "td.kbTitleCol"; sortField = "orgtitle"; sortOrder = "asc"

// 				// var thisObj = "ul.listOfObjects";
// 				// var sortElem = "li";
// 				var thisObj = "table>tbody";
// 				var sortElem = "tr";
// 				var sortField = $(event.target).val().split("_")[0];
// 				var sortOrder = $(event.target).val().split("_")[1];

// 				// console.log("listSorter: ",sortField, sortOrder);

// 				listSorter(thisObj,sortElem,sortField,sortOrder);

// 				// $("ul.listOfObjects li").sort(sortList).appendTo('ul.listOfObjects');
// 			// }
// 			// Session.set("sortOrder", newValue);
// 		},
// 		filter:function(){
// 			return Template.instance().filter.get();
// 		}
// 	});
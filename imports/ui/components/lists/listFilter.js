import { ReactiveVar } from 'meteor/reactive-var';

// import './listFilterVars.js';
import './listFilter.html';
import './listSorter.html';
import './listFilter.css';

// on create, initialize our filter as a ReactiveVar
// need to meteor add reactive-var to use this

Template.listFilter.created = function(){

	/* Listener for ESCAPE key which will clear any text in Filter Input  */
	/* http://stackoverflow.com/questions/27972873/ */
    jQuery(document).on('keyup', (e) => {
    	if (e.keyCode == 27) { // ESCAPE
    		console.log("ESCAPE KEY!");
			clearFilter("escape");
    	}
    });

};
/* http://stackoverflow.com/questions/27972873/ */
Template.listFilter.onDestroyed(() => {
	jQuery(document).off('keyup');
});

clearFilter = function (requestor) {
	console.log("clearFilter()",requestor);
	/* Reset the filter to show all */
	listFilterString.set("");
	/* Clear filter input value */
	jQuery("input.filterInput").val("");
	/* Hide the CLEAR button */
	jQuery("button.listFilterClear").hide();
	/* Restore focus for next search */
	jQuery("#userListFilter").focus();
};



Template.listFilter.onRendered(function(){
	jQuery("button.listFilterClear").hide();
	jQuery("#userListFilter").focus();
});


listFilter = function () {
	/* Nothing here */
};

listSorter = function (thisObj,sortElem,sortField,sortOrder) {

	// Internal function to do the compare
	var textSorter = function (a, b){
			if (sortOrder == "asc"){
				return ($(b).data(sortField)) < ($(a).data(sortField)) ? 1 : -1;
			} else {
				return ($(b).data(sortField)) > ($(a).data(sortField)) ? 1 : -1;
			}
	}

	// Internal function to do the compare
	var numberSorter = function (a, b){
			if (sortOrder == "asc"){
				// return a - b;
				// console.log( $(a), sortField , "aData:", $(a).data(sortField), "aInt:", parseInt($(a).data(sortField)) , "bInt:", parseInt($(a).data(sortField)) );
				return ( parseInt($(b).data(sortField)) ) - ( parseInt($(a).data(sortField)) );
			} else {
				// console.log( "bData:", $(b).data(sortField), "bInt:", parseInt($(b).data(sortField)) , "aInt:", parseInt($(a).data(sortField)) );
				return ( parseInt($(a).data(sortField)) ) - ( parseInt($(b).data(sortField)) );
			}
	}

	// Internal date function to do the compare
	var dateSorter = function (a, b){
			if (sortOrder == "asc"){
				return ( new Date($(b).data(sortField)).getTime() ) < ( new Date($(a).data(sortField)).getTime() ) ? 1 : -1;
			} else {
				return ( new Date($(b).data(sortField)).getTime() ) > ( new Date($(a).data(sortField)).getTime() ) ? 1 : -1;
			}
	}

	// All the magic happens here with no return as the DOM update is already done!

	/* List of Data Items */
	// sorttitle
	// sortcreated
	// sortkbcount
	// sortupdated
	// sortassocorgtitle


	if (sortField == "sortupdated" || sortField == "sortcreated"){
		//console.log("Using dateSorter");
		$(sortElem,thisObj).sort(dateSorter).appendTo(thisObj);
		return;
	}

	if (sortField == "sortkbcount"){
		//console.log("Using numberSorter");
		$(sortElem,thisObj).sort(numberSorter).appendTo(thisObj);
		return;
	}

	// Else - use standard lexicon/text sorting
	//console.log("Using textSorter");
	$(sortElem,thisObj).sort(textSorter).appendTo(thisObj);
};

Template.listFilter.helpers({
	thisObj: function (obj, result) {

		if (obj.toLowerCase() == result.toLowerCase()){
			return true;
		} else {
			return false;
		}

		// switch(obj.toLowerCase()) {
		// 	case "org":
		// 		return true;
		// 	case "item":
		// 		return true;
		// 	case "kitbag":
		// 		return true;
		// 	case "user":
		// 		return true;
		// 	default:
		// 		return false;
		// }
		// get_orgsFound
		// get_orgBagsFound
		// get_itemBagsFound
		// get_itemsFound
		// get_usersFound
		// get_orgUsersFound
	}
});

Template.listFilter.events({

	"input .filterInput": function(event,template){
		var currentValue = template.find(".filterInput").value;
		// template.listFilterString.set(currentValue);

		/* Show / Hide the [CLEAR] button in the Filter Input field */
		if (template.find(".filterInput").value){
			jQuery("button.listFilterClear").show();
		}else{
			jQuery("button.listFilterClear").hide();
		}

		listFilterString.set(currentValue);
		// console.log(listFilterString.get());
	},
	"click button.listFilterClear": function(event,template){
		clearFilter("click");
	},
	"change .listSorter": function(event,template){

			var thisObj = "table>tbody";
			var sortElem = "tr";
			var sortField = $(event.target).val().split("_")[0];
			var sortOrder = $(event.target).val().split("_")[1];

			listSorter(thisObj,sortElem,sortField,sortOrder);

	}
});
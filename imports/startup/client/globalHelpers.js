/* IMPORT PROJECT OBJECTS */

// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } 	from '/imports/api/kitbags/kitbags.js';
// import { Items } 	from '/imports/api/items/items.js';
import { Items } 	from '/imports/startup/both/item-schema.js';
import { UserList } from '/imports/startup/both/user-schema.js';
import { appSettings } from '/imports/startup/both/sharedConstants.js';

Template.registerHelper('totalSum', function(num1, num2, num3) {
	//console.log("totalSum: \n",num1, typeof num1, "\n",num2, typeof num2,"\n", num3, typeof num3);
	num1 = isNaN(+(num1))?0:+(num1);
	num2 = isNaN(+(num2))?0:+(num2);
	num3 = isNaN(+(num3))?0:+(num3);
	var total = num1 + num2 + num3;
	//console.log("total: "+total);
	return total;
});

Template.registerHelper('discrepancy', function(num1, num2) {
	num1 = isNaN(+(num1))?0:+(num1);
	num2 = isNaN(+(num2))?0:+(num2);
	var total = num1 - num2;
	if (total>0) {
		total = "+"+total;
	}
	// console.log("total: "+total);
	return total;
});


/* TODO - Shouldn't this now be UI.registerHelper?? */

Template.registerHelper('plural', function(count, singular, plural) {
	//console.log("plural: ",count, singular, plural);
	return window.pluralize(count, singular, plural);
});

Template.registerHelper('toLower', function(str) {
	if (typeof str != "string") { return str }
		return str.toLowerCase();
});

Template.registerHelper('gCurrentRoute', function(routeToTest) {
	if (!routeToTest) {
		return FlowRouter.current().route.name;
	}
	return FlowRouter.current().route.name == routeToTest;
});

Template.registerHelper('formatDate', function(timestamp, defaultText) {
	//console.log("formatDate() "+timestamp, defaultText);
	if (!timestamp || timestamp == "Unknown"){
		if (!defaultText) {
			return timestamp;
		}
		return defaultText;
	}
	var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	// TODO:
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
	// https://msdn.microsoft.com/en-us/library/dn342822(v=vs.94).aspx
	try {

		var isCurrentYear = new Date().getFullYear() == new Date(timestamp).getFullYear();

		// xdate = "Fri Jan 09 2016 22:51:09 GMT+0300 (Eastern Europe Daylight Time)";
		// new Date(xdate).toLocaleDateString('en-GB',{ year: ( ? undefined : "numeric") , month: "short", day: "2-digit" })

		var options = {
			year: isCurrentYear ? undefined : "numeric",
			month: isCurrentYear ? "long" : "short",
			day: "2-digit"
		};

		var dateString = timestamp.toLocaleDateString('en-GB',options);
		var timeString = timestamp.toLocaleTimeString();
		var dateHTML = "<span class='time-date' title='" + timestamp + "'>" + dateString + "</span>";
		return Spacebars.SafeString(dateHTML);
	} catch (err) {
		// TODO: Replace with translatable string
		//console.log("Date error!\nReceived: "+timestamp+"\nError: "+err);
		return Spacebars.SafeString("<div class='alert-danger'>Date Error</div>");
	}
	//return new Date(timestamp).toString('yyyy-MM-dd')
});



Template.registerHelper('lookupFieldFromKb',function(kitbagId,requiredField){
	// Takes a kitbag ID and responds with the value of the requested field for that kitbag e.g. {{lookupFieldFromKb orgAssocKitbags 'kitbagTitle'}}

	//console.log(kitbagId,requiredField);
	var localKb = Kitbags.findOne({kitbagId: ""+kitbagId});
	if (typeof localKb == "object"){
		return localKb[requiredField];
	} else {
		return "Unknown Kitbag ("+kitbagId+")";
	}

});

Template.registerHelper('lookupFieldFromOrg',function(orgId,requiredField){
	// Takes an OrgID and responds with the value of the requested field for that Org e.g. {{lookupFieldFromOrg profile.userAssocOrg 'orgTitle'}}

	var localOrg = Orgs.findOne({orgId: ""+orgId});
	if (typeof localOrg == "object"){
		return localOrg[requiredField];
	} else {
		return "Unknown Org ("+orgId+")";
	}

});

Template.registerHelper('lookupNameFromUserId',function(userId,requiredField){
	// Takes a UserID and responds with the value of the requested field for that User e.g. {{lookupNameFromUserId profile.userId 'username'}}
	// if 'requiredField' is omitted - will return profile.displayName

	var requiredField = requiredField || "profile.displayName";

	var thisUser = Meteor.users.findOne({"profile.userId": userId});
	if (jQuery.isPlainObject(thisUser)){
		returnName = thisUser[requiredField] || thisUser["username"] || thisUser["emails"][0]["address"];
		return returnName;
	} else {
		// return "("+userId+")";
		return false;
	}

});

/* ITEM HELPERS */

Template.registerHelper('getOrgDataForThisItem',function(itemId,orgFieldRequired){
		orgFieldRequired = orgFieldRequired || "kitbagAssocOrgTitle";
		var myItem = localItems.findOne({"itemId":itemId});
		if (typeof myItem.assocKitbags != "object" || typeof myItem.assocKitbags[0] != "string"){
			return "No Org";
		}
		var itemKitbag = myItem.assocKitbags[0];
		var myKitbag = localKitbags.findOne({"kitbagId":itemKitbag});
		if (typeof myKitbag != "object"){
			return "Org ("+itemKitbag+") not found!";
		}
		var kitbagOrgData = myKitbag[orgFieldRequired];
		return kitbagOrgData;
});

// Takes a User ID and responds with the value of the requested field for that user e.g. {{lookupNameFromUser GGDL7mCzXeaqFkroQ 'username'}}
	// lookupNameFromUser: function(userId,requiredField){
	// 	console.log("lookupNameFromUser",userId,requiredField);
	// 	if (!userId || userId == "") {
	// 		// console.log("lookupNameFromUser() - userId not provided");
	// 		return false;
	// 	}
	// 	if (requiredField == "name" || !requiredField) {
	// 		var userObj = Meteor.users.find().collection._docs._map[userId];
	// 		//console.log(userId,userObj);
	// 		// User not found!
	// 		if ( jQuery.isEmptyObject(userObj) ){
	// 			var message = "Error: User '" + userId + "' not found";
	// 			console.log(message);
	// 			return message;
	// 		}
	// 		var uname = jQuery.isEmptyObject(userObj.profile) ? (typeof userObj.username == "string" ? userObj.username : "Unknown") : (typeof userObj.profile.name == "string" ? userObj.profile.name : "Unknown");
	// 		return uname;
	// 	}
	// 	// TODO - RETURN SERVICE TOO!
	// },



Template.registerHelper('arrayFromObj',function(obj){
	// http://stackoverflow.com/questions/15035363
	result = [];
	//console.log(obj);
	for (var key in obj){
		// Map kitbag IDs to names
		if (typeof obj[key] == "object" && key == "orgAssocKitbagIds"){
			var newkey = [];
			$.each( obj[key] , function( key, value ) {
				//console.log( key + ": " + value );
				var kbt = GlobalHelpers.lookupFieldFromKb( value ,"kitbagTitle");
				newkey.push(kbt);
			});
			// var newKey = GlobalHelpers.lookupFieldFromKb(obj[key],"kitbagTitle");
			//console.log("newKey: "+newkey);
			result.push({
				arrayObjName: key,
				arrayObjValue: newkey
			});
		}else{
			result.push({
				arrayObjName: key,
				arrayObjValue: obj[key]
			});
		}
	}
	//console.log(result);
	return result;
});

Template.registerHelper('log',function(logTxt,showThis){
	if (showThis == true){
		//console.log(logTxt,this);
	}else{
		//console.log(logTxt);
	}
});

Template.registerHelper('highlight',function(foundThis,filterVar,suppressHightlight){
	//console.log("highlight",foundThis,filterVar,suppressHightlight);
	if (typeof filterVar == "undefined"){
		filterVar = ".*";
	};
	var re = new RegExp(filterVar, "i");
	// http://stackoverflow.com/questions/2647867/
	if ( foundThis == undefined || foundThis == "" || filterVar == null || filterVar == "" || filterVar == ".*"  ) {
		return foundThis;
	} else {
		var htmlString = "<span class='"+ (suppressHightlight==true?"":"filterHighlight") +"'>$&</span>";
		var highlighted = foundThis.replace(re, htmlString)
		// Spacebars.SafeString() tells Handlebars that this string is presumed to be safe, and to use
		// the riskier method of inserting the returned vales as HTML directly into the DOM rather than
		// more safely (and by default) limiting the inserted values to be text only.
		// http://stackoverflow.com/questions/23415182/
		return Spacebars.SafeString(highlighted);
	}
});

// Template.registerHelper('shouldShowLine',function(queryString){
// 	return "showHideLine";
// });



Template.registerHelper('suppressHightlight',function(queryString){
	if (!queryString) queryString = "hl";
	//console.log("suppressHightlight: ",queryString, typeof queryString);
	// The URL query param indicates if the hightlight should be suppressed so if the value is "highlight=false" then we return true
	return ( FlowRouter.current().queryParams[queryString] == "false" || FlowRouter.current().queryParams[queryString] == "0" );
});

Template.registerHelper('filterVar',function(){
	return listFilterString.get();
});

Template.registerHelper('get_defineDataset',function(){
	return JSON.stringify(obj_defineDataset.get());
});

/* RESULTS TRACKERS */

Template.registerHelper('get_orgsFound',function(){
	return int_orgsFound.get();
});

Template.registerHelper('get_orgBagsFound',function(){
	return int_orgBagsFound.get();
});

Template.registerHelper('get_itemBagsFound',function(){
	return int_itemBagsFound.get();
});

Template.registerHelper('get_itemsFound',function(){
	return int_itemsFound.get();
});

Template.registerHelper('get_usersFound',function(){
	return int_usersFound.get();
});

Template.registerHelper('get_orgUsersFound',function(){
	return int_orgUsersFound.get();
});



// Template.registerHelper('get_resultsCountObj',function(childAttribute){
// 	console.log("get_resultsCountObj()", childAttribute, typeof childAttribute);
// 	var o = obj_resultsCount.get();
// 	if(!childAttribute) {
// 		console.log("get_resultsCountObj() - Returning object: ",o);
// 		return o;
// 	} else {
// 		var result = o[childAttribute];
// 		console.log("get_resultsCountObj() - with childAttribute: '"+childAttribute+"' - returning: ", result);
// 		return result;
// 	}
// });

// Template.registerHelper('countResults',function(results){
// 	console.log("countResults()",results);
// 	return results.count();
// });




// appendToResultsObj = function (key, value) {
// 	console.log("appendToResultsObj()", key, value);
// 	var newobj = obj_resultsCount.get();
// 	newobj[key] = value;
// 	console.log( JSON.stringify(newobj,null,2) );
// }


/* USER HELPERS */

Template.registerHelper('getMyOrgId',function(userObject){
	var thisOrg = Meteor.user().userAssocOrg;
	return (typeof thisOrg != "undefined") ? thisOrg : "unknown_org";
});

// fn_userIsSuperAdmin = function(userObject){
// 	/* Shuld be moved to globalFunctions.js */
// 	var thisUser = jQuery.isPlainObject(userObject) ? userObject : Meteor.user();
// 	if ( !jQuery.isPlainObject(thisUser) ) { return false }
// 	// console.log("glb_userIsSuperAdmin() ", thisUser );
// 	if ( thisUser && jQuery.isPlainObject(thisUser.profile) && typeof thisUser.profile.userType == "string" && thisUser.profile.userType.toLowerCase() == "superadmin" ){
// 		// console.log("glb_userIsSuperAdmin() --- USER IS A SUPERADMIN!!!!!!!!!!!!!!!!!!!!!!!!!!!");
// 		return true;
// 	}
// 	return false;
// };

Template.registerHelper('glb_userIsSuperAdmin',function(userObject){

	/* Using the common Function in order to avoid duplication */
	return fn_userIsSuperAdmin(userObject);

	// var thisUser = jQuery.isPlainObject(userObject) ? userObject : Meteor.user();
	// if ( !jQuery.isPlainObject(thisUser) ) { return false }
	// if ( thisUser && jQuery.isPlainObject(thisUser.profile) && typeof thisUser.profile.userType == "string" && thisUser.profile.userType.toLowerCase() == "superadmin" ){
	// 	return true;
	// }
	// return false;
});

Template.registerHelper('glb_userIsAnAdmin',function(userObject){
	var thisUser = jQuery.isPlainObject(userObject) ? userObject : Meteor.user();
	if ( !jQuery.isPlainObject(thisUser) ) { return false }
	var userType = (thisUser && jQuery.isPlainObject(thisUser.profile) && typeof thisUser.profile.userType == "string" && thisUser.profile.userType) ? thisUser.profile.userType.toLowerCase() : "";
	userAdminTypesLc = appSettings.users.userAdminTypes.map(function(elem) { return elem.toLowerCase(); });
	//console.log("glb_userIsAnAdmin() ", userType, userAdminTypesLc, jQuery.inArray(userType, userAdminTypesLc) );
	if ( jQuery.inArray(userType, userAdminTypesLc) > -1 ){
		return true;
	}
	return false;
});

Template.registerHelper('glb_userIsOrgAdmin',function(){
	console.log("TODO -- Apply user profile detection!!");
	return true;
});

Template.registerHelper('glb_userIsStoreManager',function(){
	console.log("TODO -- Apply user profile detection!!");
	return true;
});

/* USER HELPERS */

Template.registerHelper('getUserStatusTag',function(){

	var labelClass, labelText;

	var checkMe = (typeof this.profile == "object" && typeof this.profile.userStatus == "string") ? this.profile.userStatus.toLowerCase() : "";

	switch(checkMe) {
		case "active":
			labelClass = "label-success";
			labelText = "Active";
			break;
		case "hidden":
			labelClass = "label-warning";
			labelText = "Hidden";
			break;
		case "trashed":
			labelClass = "label-default";
			labelText = "Trashed";
			break;
		default:
			labelClass = "label-danger";
			labelText = "Unknown";
		break;
	}
	//var tag = '<span class="label '+labelClass+'">'+labelText+'</span>';
	return { 'labelClass': labelClass, 'labelText': labelText };
});


Template.registerHelper('gOrgStatusTag',function(){

	var labelClass, labelText;

	switch(this.orgStatus.toLowerCase()) {
		case "active":
			labelClass = "label-success";
			labelText = "Active";
			break;
		case "hidden":
			labelClass = "label-warning";
			labelText = "Hidden";
			break;
		case "trashed":
			labelClass = "label-default";
			labelText = "Trashed";
			break;
		default:
			labelClass = "label-danger";
			labelText = "Unknown";
		break;
	}
	//var tag = '<span class="label '+labelClass+'">'+labelText+'</span>';
	return { 'labelClass': labelClass, 'labelText': labelText };
});

Template.registerHelper('gKitbagStatusTag',function(textStatus){
	var kbstatus = (typeof textStatus != "undefined" && textStatus != "") ? textStatus : this.kitbagStatus;
	if (!kbstatus) return;
	var labelClass, labelText;
	// console.log("kbstatus: ",textStatus,kbstatus);
	switch( kbstatus.toLowerCase() ) {
		case "active":
			labelClass = "label-success";
			labelText = "Active";
			break;
		case "hidden":
			labelClass = "label-warning";
			labelText = "Hidden";
			break;
		case "retired":
			labelClass = "label-retired";
			labelText = "Retired";
			break;
		case "deleted":
		case "trashed":
			labelClass = "label-default";
			labelText = "Trashed";
			break;
		default:
			labelClass = "label-danger";
			labelText = "Unknown";
		break;
	}
	//var tag = '<span class="label '+labelClass+'">'+labelText+'</span>';
	return { 'labelClass': labelClass, 'labelText': labelText };
});

Template.registerHelper('gItemStatusTag',function(){

	var labelClass, labelText;

	switch(this.itemStatus.toLowerCase()) {
		case "active":
			labelClass = "label-success";
			labelText = "Active";
			break;
		case "hidden":
			labelClass = "label-warning";
			labelText = "Hidden";
			break;
		case "retired":
			labelClass = "label-retired";
			labelText = "Retired";
			break;
		case "deleted":
		case "trashed":
			labelClass = "label-default";
			labelText = "Trashed";
			break;
		default:
			labelClass = "label-danger";
			labelText = "Unknown";
		break;
	}
	//var tag = '<span class="label '+labelClass+'">'+labelText+'</span>';
	return { 'labelClass': labelClass, 'labelText': labelText };
});


/* ============================================================================================*/

Template.registerHelper('objectsFiltered',function( str_CollectionName , str_userFilter , obj_listFilter ){
	// console.log("objectsFiltered(arg1) str_CollectionName: ", str_CollectionName);
	// console.log("objectsFiltered(arg2) str_userFilter: ", str_userFilter);
	// console.log("objectsFiltered(arg3) obj_listFilter: ", obj_listFilter , JSON.stringify(obj_listFilter) , typeof obj_listFilter );
	// console.log("objectsFiltered(var) obj_defineDataset: ", JSON.stringify(obj_defineDataset) , typeof obj_defineDataset );

	/* str_CollectionName is required - will determine what we listing! */
	if ( typeof str_CollectionName == 'undefined' ) return;

	/* Use a global 'select all' - or nothing - regex i.e. .* if user doesn't enter a filter string */
	if ( typeof str_userFilter !== 'undefined') {
		var userFilter = str_userFilter;
	}

	/* The data shown in each list is defined independently of the user-entered filter and will take account of user permissions via the publication */
	/* What we are doing here is defining the SELECT e.g. ALL ACTIVE ORGS, ALL BAGS RELATING TO ORG X - within which, the user can filter  */
	/* The most common use for this SELECT will be drilldown from the dashboard, selecting related objects (e.g. users and bags) to be shown in minilists within associated profile page */
	/* We want to be able to support filters via template parameters too (which would be passes as an object argument) but in most case we will SELECT the data via the obj_defineDataset which can also originate from the URL query string parameters  */
	listSelect = ( jQuery.isPlainObject(obj_listFilter) && !jQuery.isEmptyObject(obj_listFilter) ) ? obj_listFilter : FlowRouter.current().queryParams;

	// TODO: I don't think we actually use 'obj_defineDataset' except for debugging/printing the current select criteria
	obj_defineDataset.set(listSelect);

	//console.log(">>>> ",obj_defineDataset,obj_defineDataset.get(),listSelect);

	/* List all parameters we are willing to accept.  These will be checked against the keys in listSelect shortly. */
	var validList = [
		"orgstatus",
		"orgtitle",
		"orgid",
		"kitbagtitle",
		"kitbagid",
		"kitbagstatus",
		"kitbagsku",
		"kitbagassocorg",
		"kitbagassocorgtitle",
		"itemstatus",
		"itemtitle",
		"itemassockitbagid",
		"itemassockitbagtitle",
		"itemassocorgid",
		"itemassocorgtitle",
		"owner",
		"_id",
		"username",
		"emails"
	];




	/*

	NOTES ON FILTERING:
	* For OR use | e.g. ?kitbagstatus=active|hidden&...
	* For NOT use regex e.g. ?kitbagstatus=^(?!.*active).*$&...	// TODO - Create a URL-safe way to do this



	[ ] Create a listSelect template (instance?) parameter wherever a filter parameter is passed in the objectsFiltered request or URL
	[ ] Ensure that parameter does not persist to another list where the parameter is not present
	[ ] Make use of appSettings.org.statusesIncludedInActiveCount and appSettings.kitbags.statusesIncludedInHiddenCount to allow URLs to be and of:
		[ ] status = Filter by Status / created = Filter by Created / org = Filter by Org etc / q =  Filter by String (predefined custom search)
		[X] hl = false  -> disable highlighting (hl also used by Google but for something else entirely!)
		[ ] &status=alist -> Active List (i.e. statusesIncludedInActiveCount)
		[ ] &status=active -> Where "Status" is "Active" (case insensitive / does NOT use statusesIncludedInActiveCount)
		[ ] &status=unlisted -> Where "Status" is "Unlisted" (case insensitive / does NOT use statusesIncludedInActiveCount / text match)
		[ ] &status=active,unlisted -> Where "Status" is "Unlisted" OR "Active" (case insensitive / does NOT use statusesIncludedInActiveCount / text match)
		[ ] + = <space>
		[ ] , = AND
		[ ] _ = OR
		[ ] ! = NOT (all excluding)
		[ ] Support multiple and different selects
	*/


	/* Iterate query string parameters */
	$.each( listSelect , function( key, value ) {

		/* Convert each key to lowercase to ease comparison (cos jQuery.inArray doesn't do case insensitivity) - and then delete the original */
		listSelect[ key.toLowerCase() ] = listSelect[key]
		//console.log("Each listSelect ",key, value, key.toLowerCase() ,listSelect[key]);
		// delete listSelect[key];

		/* Check that key is valid */
		if( jQuery.inArray(key.toLowerCase(), validList) !== -1 ){
			//console.log("key: '"+key.toLowerCase()+"' found! value: "+listSelect[key.toLowerCase()]);
			/* Create new or Overwrite existing key and value to ensure a lowerCase version exists in the listSelect object */
			/* That's it for now */
		} else {
			//console.log("key: '"+key.toLowerCase()+"' not found in validList - "+JSON.stringify(validList));
			/* If not a valid key, then remove from listSelect object! */
			delete listSelect[key];
		}
	});

	/* Iterate over validList and add a global select value if something else hasn't be provided by the user*/
	$.each( validList , function( key, value ) {
		if (typeof listSelect[value.toLowerCase()] == "undefined" && typeof listSelect[value] == "undefined") {
			// listSelect[value] = ".*";
		}
	});

	// console.log("listSelect: ",listSelect);

	if (str_CollectionName == "Orgs"){
		//console.log("Orgs",listSelect,userFilter);

		var orgsFound = Orgs.find(
			{
				$and: [
					/* Match listSelect */
					{orgTitle: 	{ $regex: new RegExp(listSelect.orgtitle, "i") }},
					{orgId: 	{ $regex: new RegExp(listSelect.orgid, "i") }},
					{orgStatus:	{ $regex: new RegExp(listSelect.orgstatus, "i") }},
					/*{owner: 	{ $regex: new RegExp(listSelect.owner, "i") }},*/
					/* AND match the User's Filter String */
					{
						$or: [
								{orgTitle: 	{ $regex: new RegExp(userFilter, "i") }},
								{orgId: 	{ $regex: new RegExp(userFilter, "i") }}
						]
					}
				]
			}
		).fetch();
		//console.log("orgsFound: ",orgsFound.length,orgsFound);
		if( typeof int_orgsFound != "undefined" ){
			int_orgsFound.set(orgsFound.length);
			//appendToResultsObj("orgsFound",orgsFound.length);
		}else{
			console.log("ERROR - var 'int_orgsFound' was not found!");
		}
		return orgsFound;
	};

	if (str_CollectionName == "Kitbags"){

		//console.log("Kitbags",listSelect,userFilter,listSelect.kitbagstatus, typeof listSelect.kitbagstatus);

		var queryObject = {
			$and: [
				/* Match listSelect */
				{kitbagTitle: 			{ $regex: new RegExp(listSelect.kitbagtitle, "i") }},
				{kitbagId: 				{ $regex: new RegExp(listSelect.kitbagid, "i") }},
				{kitbagStatus:			{ $regex: new RegExp(listSelect.kitbagstatus, "i") }},
				{kitbagAssocOrg: 		{ $regex: new RegExp(listSelect.kitbagassocorg, "i") }},
				{kitbagAssocOrgTitle: 	{ $regex: new RegExp(listSelect.kitbagassocorgtitle, "i") }},
				// {owner: 				{ $regex: new RegExp(listSelect.owner, "i") }},
				/* AND match the User's Filter String */
				{
					$or: [
							{kitbagTitle: 			{ $regex: new RegExp(userFilter, "i") }},
							{kitbagId: 				{ $regex: new RegExp(userFilter, "i") }},
							{kitbagSku: 			{ $regex: new RegExp(userFilter, "i") }},
							{kitbagAssocOrg: 		{ $regex: new RegExp(userFilter, "i") }},
							{kitbagAssocOrgTitle: 	{ $regex: new RegExp(userFilter, "i") }}
					]
				}
			]
		};

		var bagsFound = Kitbags.find( queryObject ).fetch();

		// console.log("queryObject: ",queryObject);
		// console.log("bagsFound: ",bagsFound.length);
		if( typeof int_orgBagsFound != "undefined" ){
			int_orgBagsFound.set(bagsFound.length);
			// appendToResultsObj("bagsFound",bagsFound.length);
		}else{
			console.log("ERROR - var 'int_orgBagsFound' was not found!");
		}
		return bagsFound;
	};

	if (str_CollectionName == "kitbagsContainingThisItem"){

		//console.log("AssocKitbagsFromArray",listSelect,userFilter,listSelect.kitbagstatus, typeof listSelect.kitbagstatus);

		var queryObject = {kitbagId: listSelect.kitbagid};

		var bagsFound = Kitbags.find( queryObject ).fetch();

		//console.log("queryObject: ",queryObject);
		//console.log("bagsFound: ",bagsFound.length,bagsFound);
		if( typeof int_itemBagsFound != "undefined" ){
			int_itemBagsFound.set(bagsFound.length);
			// appendToResultsObj("bagsFound",bagsFound.length);
		}else{
			console.log("ERROR - var 'int_itemBagsFound' was not found!");
		}
		return bagsFound;
	};

	if (str_CollectionName == "Items"){

		//console.log("Items",listSelect,userFilter);

		var itemsFound = Items.find(
			{
				$and: [
					/* Match listSelect */
					{itemTitle: 	{ $regex: new RegExp(listSelect.itemtitle, "i") }},
					{itemId: 		{ $regex: new RegExp(listSelect.itemid, "i") }},
					{itemStatus:	{ $regex: new RegExp(listSelect.itemstatus, "i") }},
					/* TODO: Restore limit view - but for now, does not need to be filtered by owner */
					/* {owner: 		{ $regex: new RegExp(listSelect.owner, "i") }}, */
					/* AND match the User's Filter String */
					{
						$or: [
								{itemTitle: 	{ $regex: new RegExp(userFilter, "i") }},
								{itemId: 		{ $regex: new RegExp(userFilter, "i") }}
						]
					}
				]
			}
		).fetch();
		// console.log("itemsFound: ",itemsFound.length,itemsFound);
		if( typeof int_itemsFound != "undefined" ){
			int_itemsFound.set(itemsFound.length);
			// appendToResultsObj("itemsFound",itemsFound.length);
		}else{
			console.log("ERROR - var 'int_itemsFound' was not found!");
		}
		return itemsFound;
	};

	if (str_CollectionName == "UserList"){

		// console.log("objectsFiltered() --- Users",listSelect,userFilter);

		var queryObject = {
			$and: [
				/* Match listSelect */
				// {username: 		{ $regex: new RegExp(listSelect.username, "i") }},
				// {_id: 			{ $regex: new RegExp(listSelect._id, "i") }},
				// TODO: Add support for email and new fields
				// {itemStatus:	{ $regex: new RegExp(listSelect.itemstatus, "i") }},
				{
					$or: [
							{"_id":						{ $regex: new RegExp(userFilter, "i") }}, // This line ensures we get ALL users
							{"profile.userId":			{ $regex: new RegExp(userFilter, "i") }},
							{"username": 				{ $regex: new RegExp(userFilter, "i") }},
							{"emails.address":			{ $regex: new RegExp(userFilter, "i") }},
							{"profile.displayName": 	{ $regex: new RegExp(userFilter, "i") }},
							{"profile.userCallsign": 	{ $regex: new RegExp(userFilter, "i") }},
							{"profile.userAssocOrg": 	{ $regex: new RegExp(userFilter, "i") }},
							{"profile.userDivision": 	{ $regex: new RegExp(userFilter, "i") }},
							{"profile.userTeam": 		{ $regex: new RegExp(userFilter, "i") }},
							{"getType.value": 			{ $regex: new RegExp(userFilter, "i") }},
							{"getType.label": 			{ $regex: new RegExp(userFilter, "i") }},
					]
				}
			]
		};

		// var bagsFound = Kitbags.find( queryObject ).fetch();

		// console.log("queryObject: ",queryObject);
		// console.log("bagsFound: ",bagsFound.length,bagsFound);
		// if( typeof int_resultsCount != "undefined" ){
		// 	int_resultsCount.set(bagsFound.length);


		var usersFound = Meteor.users.find( queryObject ).fetch();

		console.log("queryObject: ",queryObject);
		console.log("usersFound: ", usersFound.length, usersFound);

		if( typeof int_usersFound != "undefined" ){
			int_usersFound.set(usersFound.length);
			// appendToResultsObj("usersFound",usersFound.length);
		}else{
			console.log("ERROR - var 'int_usersFound' was not found!");
		}
		return usersFound;
	};

	if (str_CollectionName == "UsersInThisOrg"){

		console.log("objectsFiltered('UsersInThisOrg') --- Users",listSelect,userFilter);
		//console.log("AssocKitbagsFromArray",listSelect,userFilter,listSelect.kitbagstatus, typeof listSelect.kitbagstatus);

		var queryObject = { "profile.userAssocOrg" : FlowRouter.getParam('_orgId') };

		var usersFound = Meteor.users.find( queryObject ).fetch();

		console.log("queryObject: ",queryObject);
		console.log("usersFound: ",usersFound.length,usersFound);
		if( typeof int_orgUsersFound != "undefined" ){
			int_orgUsersFound.set(usersFound.length);
			// appendToResultsObj("usersFound",usersFound.length)
		}else{
			console.log("ERROR - var 'int_orgUsersFound' was not found!");
		}
		return usersFound;
	};


});

// Template.registerHelper('V2_OLD_objectsFiltered',function(CollectionName,filterDataset,defineDatasetByObject){
// 	// reactively return objects that meet the filter requirements
// 	//console.log("objectsFiltered()", typeof filterVar );

// 	var filterVar = filterKey = filterValue = docsFound = undefined;

// 	if (typeof filterDataset == "object") {
// 		/* An object will originate from a field value filter */
// 		filterKey = Object.keys(filterDataset)[0]
// 		filterValue = filterDataset[filterKey];
// 	} else if (typeof filterDataset == "string") {
// 		/* A string will originate from a user-entered search/filter string */
// 		filterVar = filterDataset;
// 	} else if (typeof filterVar == "undefined"){
// 		/* Default is to show it all ! */
// 		filterVar = ".*";
// 	};

// 	//console.log("filter:",CollectionName,filterVar);

// 	if (CollectionName == "Orgs"){
// 		var docsFound = Orgs.find({
// 			$or: [
// 				{orgTitle: 	{ $regex: new RegExp(filterVar, "i") }},
// 				{orgId: 	{ $regex: new RegExp(filterVar, "i") }}
// 			]
// 		});
// 		return docsFound;
// 	};

// 	if (CollectionName == "Kitbags"){
// 		if (filterKey && filterValue) {
// 			// docsFound = Kitbags.find({
// 			// 	{filterKey: { $regex: new RegExp(filterValue, "i") }},
// 			// });
// 			// return docsFound;
// 		} else {
// 			docsFound = Kitbags.find({
// 				$or: [
// 					// {expires: {$gte: new Date()}},
// 					// {expires: null}
// 					{kitbagTitle: 	{ $regex: new RegExp(filterVar, "i") }},
// 					{kitbagId: 		{ $regex: new RegExp(filterVar, "i") }},
// 					{kitbagSku: 	{ $regex: new RegExp(filterVar, "i") }},
// 					{kitbagAssocOrgTitle: 	{ $regex: new RegExp(filterVar, "i") }}
// 				]
// 			});
// 			return docsFound;
// 		}
// 	};
// });

// Template.registerHelper('OLD_objectsFiltered',function(CollectionName,filterVar){
// 	// reactively return the objects who are older than the input value
// 	//console.log("objectsFiltered()", typeof filterVar );
// 	// filterVar = Template.instance().filter.get();
// 	//console.log("filter:",CollectionName,filterVar);
// 	// TODO: Make a better validation than this!
// 	// See: http://stackoverflow.com/questions/30314447 in place of .isNaN!
// 	if (typeof filterVar == "undefined"){
// 	// Return all!
// 		filterVar = ".*";
// 	// return Persons.find({sort: {"name": "asc"}});
// 	};

// 	if (CollectionName == "Orgs"){
// 		var docsFound = Orgs.find({
// 			$or: [
// 				{orgTitle: 	{ $regex: new RegExp(filterVar, "i") }},
// 				{orgId: 	{ $regex: new RegExp(filterVar, "i") }}
// 			]
// 		});
// 		return docsFound;
// 	};

// 	if (CollectionName == "Kitbags"){
// 		var docsFound = Kitbags.find({
// 			$or: [
// 				// {expires: {$gte: new Date()}},
// 				// {expires: null}
// 				{kitbagTitle: 	{ $regex: new RegExp(filterVar, "i") }},
// 				{kitbagId: 		{ $regex: new RegExp(filterVar, "i") }},
// 				{kitbagSku: 	{ $regex: new RegExp(filterVar, "i") }},
// 				{kitbagAssocOrgTitle: 	{ $regex: new RegExp(filterVar, "i") }}
// 			]
// 		});
// 		return docsFound;
// 	};
// });


/* ============================================================================================*/


GlobalHelpers = {
	// Random number generator for object IDs (to avoid using the Mongo doc Id)
	// http://stackoverflow.com/questions/105034/
	// See: http://stackoverflow.com/questions/894860/ for ES6/ES2015, default parameters
	idGenerator: function(prefix="", suffix="", reqLength=uniqueIds.uniqueIdLength){
		//console.log('Global idGenerator ' , prefix , suffix , reqLength);
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		// return prefix+(S4()+S4()+S4());
		var guid = "";
		for (var i = Number( Math.ceil(reqLength/4) ) - 1; i >= 0; i--) {
			guid += "" + S4();
		}
		// Count the characters in headers/footers and truncate random string to total length is met
		var randomCharsNeeded = Number(reqLength) - prefix.length - suffix.length;
		guid = prefix + guid.substring(0,randomCharsNeeded) + suffix;
		return guid;
	},
	isValidId: function (id,typeOfId) {

			// alert("Remove this function if not required!\nShould allow more flexible Org IDs")

		if ( FlowRouter.getQueryParam("force") == "true" ) {
			//console.log("isValidId('"+id+"','"+typeOfId+"') - Alert: Overridden");
			return true;
		}

		if (!id || id == "" || !typeOfId || typeOfId == "") {
			//console.log("isValidId('"+id+"','"+typeOfId+"') - Error: Insufficient arguments provided");
			return false;
		}
		// uniqueIds.orgPrefix      : "1221"
		// uniqueIds.kbPrefix       : "2470"
		// uniqueIds.userPrefix     : "5530"
		// uniqueIds.uniqueIdLength : "16"

		/* Check if string of ID is required length */
		if ( id.toString().length != uniqueIds.uniqueIdLength ) {
			//console.log("isValidId('"+id+"','"+typeOfId+"') - Error: Value is incorrect length. - expected '"+uniqueIds.uniqueIdLength+"' chars but got '"+id.toString().length+"'");
			return false;
		}

		/* Check if ID is a valid integer */
		if ( /^\+?[0-9]+$/.test(id) == false ) {
			//console.log("isValidId('"+id+"','"+typeOfId+"') - Warning: Value might not a valid '"+uniqueIds.uniqueIdLength+" ID'.  May contain letters or spaces");
			// return false;
		}

		/* Check if ID has correct prefix and suffix */
		var prefixToCheck = (typeOfId == "org") ? uniqueIds.orgPrefix :  (typeOfId == "kb" || typeOfId == "kitbag") ? uniqueIds.kbPrefix : (typeOfId == "user") ? uniqueIds.userPrefix : false;			// uniqueIds.orgPrefix      : "1221"
		if ( prefixToCheck != id.substr( 0 , prefixToCheck.length ) ) {
			//console.log("isValidId('"+id+"','"+typeOfId+"') - Error: Value does not have a valid prefix - expected '"+prefixToCheck+"' but found '"+id.substr( 0 , prefixToCheck.length )+"'");
			return false;
		}

		/* Otherwise - Mazal tov! */
		return true;

	},
	// Takes an Organisation ID and responds with the value of the requested field for that organisation e.g. {{lookupOrg kitbagAssocOrg 'orgTitle'}}
	lookupFieldFromOrg: function(orgId,requiredField){
		//console.log(">>> lookupFieldFromOrg("+orgId+","+requiredField+")");
		//console.log(orgId,requiredField);
		// var fieldObj = {};
		// fieldObj[requiredField] = 1;
		// var localOrg = MyCollections["Orgs"].findOne({orgId: ""+orgId});
		var localOrg = Orgs.findOne({orgId: ""+orgId});
		// console.log("returned org: ",localOrg);
		try {
			return localOrg[requiredField];
		} catch(err) {
			return false;
		}
	},
	// Takes a User ID and responds with the value of the requested field for that user e.g. {{lookupNameFromUser GGDL7mCzXeaqFkroQ 'username'}}
	lookupNameFromUser: function(userId,requiredField){
		//console.log("lookupNameFromUser",userId,requiredField);
		if (!userId || userId == "") {
			// console.log("lookupNameFromUser() - userId not provided");
			return false;
		}
		if (requiredField == "name" || !requiredField) {
			var userObj = Meteor.users.find().collection._docs._map[userId];
			//console.log(userId,userObj);
			// User not found!
			if ( jQuery.isEmptyObject(userObj) ){
				var message = "Error: User '" + userId + "' not found";
				console.log(message);
				return message;
			}
			var uname = jQuery.isEmptyObject(userObj.profile) ? (typeof userObj.username == "string" ? userObj.username : "Unknown") : (typeof userObj.profile.name == "string" ? userObj.profile.name : "Unknown");
			return uname;
		}
		// TODO - RETURN SERVICE TOO!
	},
	// Takes a kitbag ID and responds with the value of the requested field for that kitbag e.g. {{lookupKb orgAssocKitbags 'kitbagTitle'}}
	lookupFieldFromKb: function(kitbagId,requiredField){
		//console.log(kitbagId,requiredField);
		// var localKb = MyCollections["Kitbags"].findOne({kitbagId: ""+kitbagId});
		var localKb = Kitbags.findOne({kitbagId: ""+kitbagId});
		//console.log("returned kitbag: ",localKb);
		if (typeof localKb == "object"){
			return localKb[requiredField];
		} else {
			return "Unknown Kitbag ("+kitbagId+")";
		}
	},
	get_urlParam: function(paramName){
		if (!paramName) {
			return FlowRouter.current().params;
		}else{
			return FlowRouter.current().params[paramName];
		}
	},
	getListDivisions: function () {
		console.log("getListDivisions() -- TODO: Add custom Divisions");
		return appSettings.orgs.divisions;
	},
	getListTeams: function () {
		console.log("getListTeams() -- TODO: Add custom Teams");
		return appSettings.orgs.teams;
	},
	getOrgSelectList: function (contxt,showStatus,includeHidden,includeTrashed) {
		showStatus = showStatus || true;
		includeHidden = includeHidden || true;
		includeTrashed = includeTrashed || true;

		var notGetStatuses = [];
		/* We pull the arrays from appSettings so we can manage and update the various statuses centrally without referencing them explicitly deep in the code */
		if (!includeHidden) {
			notGetStatuses = notGetStatuses.concat(appSettings.orgs.statusesIncludedInHiddenCount);
		}
		if (!includeTrashed) {
			notGetStatuses = notGetStatuses.concat(appSettings.orgs.statusesIncludedInTrashedCount);
		}

		var queryObj = { "orgStatus": { $nin: notGetStatuses } };

		var listOfOrgsFetch = Orgs.find( queryObj , {fields: { orgId: 1, orgTitle: 1, orgStatus: 1 }}).fetch();

		// TODO - Can we make this bagArray a global counter (in adminCollection?) so that we dont need to find each time?
		// TODO - Exclude "Trashed"
		// TODO - Mark "Hidden" as such
		var orgObj = {}, orgArray = [], generatedTitle = "", suffix = "";
		$.each(listOfOrgsFetch, function( index, obj ) {

			if (showStatus && obj.orgStatus !== "Active"){
				prefix = "[" +obj.orgStatus+ "] ";
				suffix = "";
			} else {
				prefix = "";
				suffix = "";
			}
			generatedTitle = prefix + obj.orgTitle + suffix;

			orgObj = {
				label: generatedTitle,
				value: obj.orgId
			};
			orgArray.push(orgObj);
		});

		function localeCompare(a,b) {
			aa = a.label;
			bb = b.label;
			return aa.localeCompare(bb);
		}
		orgArray.sort(localeCompare);

		// console.log(orgArray);
		return orgArray;
	},
	getFilteredListKitbags: function (contxt) {
		// console.log("filterKitbags() ", contxt);
		var listOfBagsFetch = Kitbags.find({}, {fields: {kitbagId: 1, kitbagTitle: 1, kitbagAssocOrgTitle: 1 }}).fetch();

		// TODO - Can we make this bagArray a global counter (in adminCollection?) so that we dont need to find each time?
		bagObj = {}, bagArray = [];
		$.each(listOfBagsFetch, function( index, obj ) {

			/* SuperAdmins see orgs too as they see lists with all kitbags from all orgs! */
			var orgLabel = ((obj.kitbagAssocOrgTitle)?obj.kitbagAssocOrgTitle:" <unknown org>") + ": " + obj.kitbagTitle;
			var bagLabel = obj.kitbagTitle;

			bagObj = {
				label: ( fn_userIsSuperAdmin() ) ? orgLabel : bagLabel,
				value: obj.kitbagId
			};
			bagArray.push(bagObj);

		});

		/* Sort into alphabetical order - we need to do this after the query as we prefix for superadmins */
		function compare(a,b) {
			if (a.label < b.label){
				return -1;
			}
			if (a.label > b.label){
				return 1;
			}
			return 0;
		}
		function localeCompare(a,b) {
			aa = a.label;
			bb = b.label;
			return aa.localeCompare(bb);
		}
		bagArray.sort(localeCompare);

		// console.log(bagArray);
		return bagArray;
	}
};



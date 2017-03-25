/* IMPORT PROJECT OBJECTS */
import { appSettings } 	from '/imports/startup/both/sharedConstants.js';


/* GLOBAL GENERICS */

globalOnSuccess = function(thisCollectionName, thisAction = 'created', resultObj = {id:'unknown'},	formType = 'unknown', alertMsgPrefix = '') {
	console.log("FN: globalOnSuccess()", arguments);

	var thisCollectionName = thisCollectionName || 'unknown';

	var alertMsgPrefix = "<i class='fa "+appSettings[thisCollectionName.toLowerCase()].fontAwesomeIcon+" fa-lg'></i>&nbsp;&nbsp;";
	var alertMessage = alertMsgPrefix + "<strong>SUCCESS: </strong> "+appSettings[thisCollectionName.toLowerCase()].labelCapsSingular+": '<i>"+resultObj.title+"</i>' was successfully "+thisAction+".";

	sAlert.success(alertMessage, {
		html: true,
		onRouteClose: false
	});
	console.log("globalOnSuccess()","resultObj",resultObj);
	var goToUrl = "/"+thisCollectionName.toLowerCase()+"/"+resultObj.id+"/view";

	console.log("globalOnSuccess()","Redirect: "+goToUrl);

	FlowRouter.go(goToUrl);
};

globalOnError = function(thisCollectionName, thisAction = null, error = 'Unknown Error', arg3, arg4) {
	console.log("globalOnError()",arguments);

	var thisCollectionName = thisCollectionName || 'unknown';

	var alertMsgPrefix = "<i class='fa "+appSettings[thisCollectionName.toLowerCase()].fontAwesomeIcon+" fa-lg'></i>&nbsp;&nbsp;";

	var alertText = error.reason || error.message || error.details || "Undefined Error";

	var msg = alertMsgPrefix + "<strong>Error: </strong><code>"+alertText+"</code>";
	sAlert.error(msg, {
		html: true,
		timeout: appSettings.sAlert.longTimeout
	});
};

globalDelete = function (origin = 'unknown', thisCollectionName, assocObj, userId, goUrl, skipUserConfirmation = false) {
	/* TODO: Based on globalfn_deleteOrg() - below - which should be deprecated  */
	// event.preventDefault();
	var objTitle = assocObj.title || assocObj.displayName || assocObj.username || assocObj["emails"] && assocObj["emails"][0]["address"] || "No title found";

	console.log("FN globalDelete() - Deletion request for " + appSettings[thisCollectionName.toLowerCase()].labelSingular + " record: '" + objTitle + "' ("+assocObj._id+") by user '" + userId +"'");

	/* Check User has permission to delete */
	if ( !fn_userHasPermission('canDeleteOrgUsers') ){
		console.log("LOG: Deletion request from unauthorized user (" + userId +")");
		return false;
	}

	var alertMsgPrefix = "<i class='fa "+appSettings[thisCollectionName.toLowerCase()].fontAwesomeIcon+" fa-lg'></i>&nbsp;&nbsp;";
	var areYouSure = "Permanently delete "+ appSettings[thisCollectionName.toLowerCase()].labelSingular + " '"+objTitle+"'?\n\nThere is no undo!\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n";
	if ( skipUserConfirmation == true || confirm(areYouSure) ) {

		if (skipUserConfirmation == true) {
			console.log("INF: Skipped User Confirmation as <SHIFT> key was down!");
		}

		console.log("\n\nTODO: BLOCK DELETION TO AVOID ORPHAN KITBAGS OR ITEMS!");

		Meteor.call("deleteDoc", origin, thisCollectionName, assocObj, userId, function(error, result) {
			console.log("error: " + error + "\n" + "result: " + result);
			// TODO: Get message prefix from appSettings!
			if (!error && true === result){
				sAlert.success(alertMsgPrefix + "<strong>SUCCESS: </strong>"+appSettings[thisCollectionName.toLowerCase()].labelCapsSingular+": <i>'"+objTitle+"'</i> was successfully deleted.",
					{
						html: true
					}
				);
				console.log("FN globalDelete() - Deletion completed successfully");
			} else {
				sAlert.error(alertMsgPrefix + "<strong>ERROR: </strong>Failed to delete "+appSettings[thisCollectionName.toLowerCase()].labelSingular+": '<strong>"+objTitle+"</strong>' with error: <code>"+error+"</code>",
					{
						html: true,
						timeout: appSettings.sAlert.longTimeout
					}
				);
			}
		});
		if (typeof goUrl == "string" && goUrl != "") {
			FlowRouter.go(goUrl);
		}
	} else {
		console.log("FN globalDelete() - Deletion request aborted by user (" + userId +")");
		return false;
	}
};

// globalTrashed("TrashedByUser", "Kitbags", this, Meteor.userId(), "#");

globalTrash = function (origin = 'unknown', collectionName, assocObj, userId, goUrl) {
	console.log("globalTrash()", arguments);

	var areYouSure = "Trash "+appSettings[collectionName.toLowerCase()].labelSingular+" '"+assocObj.title+"'?\n(ID: "+assocObj._id+")";
	if ( confirm(areYouSure) ) {
		Meteor.call("setDocStatus", collectionName, assocObj._id, "Trashed");
	} else {
		return false;
	}
};

globalDuplicate = function(collectionName,objPrefix) {
	console.log("globalDuplicate()",arguments);

	var oldId = $("input[name='_id']").val();
	var oldTitle = $("input[name='title']").val();
	var oldDesc = $("input[name='desc']").val();
	/* New ID - the old ID is still visible in the URL */
	$("input[name='_id']").val( GlobalHelpers.idGenerator(uniqueIds[objPrefix]) );
	/* Prepend to title */
	$("input[name='title']").val( appSettings.global.duplicatedPrefix + oldTitle );
	/* Prepend leading whitespace if there is an existing value */
	var leadingSpace = (oldDesc.length > 0) ? "\n " : "";
	$("input[name='desc']").val( oldDesc + leadingSpace + "[Duplicated from "+oldTitle+" (ID: "+oldId+")]" );
	/* Auto-select createdvia dropdown field as manual duplicate */
	$("select[name='createdVia']").find('option').each(function() {
		if ( $(this).val().match("ManualDuplicate") ){
			$(this).attr('selected','true');
		}
	});
};

getUsername = function (userId, showMe) {
	var userFound = Meteor.users.findOne(userId);

	if (!userFound) {
		return "Unknown User ("+userId+")";
	}

	if (userId === Meteor.userId() && showMe){
		return "me";
	} else {
		return userFound.displayName || userFound.username;
	}
};

fn_userHasPermission = function (permissionRequired, userObject = Meteor.user()) {
	// console.log(' ----> fn_userHasPermission', permissionRequired, JSON.stringify(userObject));
	var thisUser = jQuery.isPlainObject(userObject) ? userObject : Meteor.user();
	if ( !permissionRequired ) { return false }
	if ( !jQuery.isPlainObject(thisUser) ) { return false }
	var userType = (thisUser && typeof thisUser.type == "string") ? thisUser.type.toLowerCase() : "";
	var permittedUserTypesLc = appSettings.permissions[permissionRequired] && appSettings.permissions[permissionRequired].map(function(elem) { return elem.toLowerCase(); });
	if ( !permittedUserTypesLc ) {
		console.log("ALERT: permissionRequired '"+permissionRequired+"' not found in appSettings.permissions[] so returning 'approved' ");
		return true;
	}
	if ( jQuery.inArray(userType, permittedUserTypesLc) > -1 ){
		return true;
	} else {
		console.log("ALERT: Page/Element/Action blocked! Required permission '"+permissionRequired+"'. User '"+thisUser.username+"' has type '"+userType+"' ");
		return false;
	}
};

fn_userIsSuperAdmin = function(userObject){
	/* Should be deprecated in favour of userHasPermission() e.g.
	{{#if userHasPermission 'isSuperAdmin'}}
	would have the same functionality as...
	{{#if glb_userIsSuperAdmin}}
	*/
	var thisUser = jQuery.isPlainObject(userObject) ? userObject : Meteor.user();
	if ( !jQuery.isPlainObject(thisUser) ) { return false }
	if ( thisUser && jQuery.isPlainObject(thisUser) && typeof thisUser.type == "string" && thisUser.type.toLowerCase() == "superadmin" ){
		return true;
	}
	return false;
};
// fn_userIsAnAdmin = function(userObject){
// 	var thisUser = jQuery.isPlainObject(userObject) ? userObject : Meteor.user();
// 	if ( !jQuery.isPlainObject(thisUser) ) { return false }
// 	var userType = (thisUser && typeof thisUser.type == "string") ? thisUser.type.toLowerCase() : "";
// 	userAdminTypesLc = appSettings.users.adminTypes.map(function(elem) { return elem.toLowerCase(); });
// 	if ( jQuery.inArray(userType, userAdminTypesLc) > -1 ){
// 		return true;
// 	} else {
// 		return false;
// 	}
// };
// fn_userIsOrgManager = function(userObject){
// 	var thisUser = jQuery.isPlainObject(userObject) ? userObject : Meteor.user();
// 	if ( !jQuery.isPlainObject(thisUser) ) { return false }
// 	var userType = (thisUser && typeof thisUser.type == "string") ? thisUser.type.toLowerCase() : "";
// 	userAdminTypesLc = appSettings.users.managerTypes.map(function(elem) { return elem.toLowerCase(); });
// 	if ( jQuery.inArray(userType, userAdminTypesLc) > -1 ){
// 		return true;
// 	} else {
// 		return false;
// 	}
// };
// fn_userIsStandardUser = function(userObject){
// 	var thisUser = jQuery.isPlainObject(userObject) ? userObject : Meteor.user();
// 	if ( !jQuery.isPlainObject(thisUser) ) { return false }
// 	var userType = (thisUser && typeof thisUser.type == "string") ? thisUser.type.toLowerCase() : "";
// 	userAdminTypesLc = appSettings.users.nonAdminTypes.map(function(elem) { return elem.toLowerCase(); });
// 	if ( jQuery.inArray(userType, userAdminTypesLc) > -1 ){
// 		return true;
// 	} else {
// 		return false;
// 	}
// };



/* END - GLOBAL GENERICS */

pluralize = function(count, singular, plural) {
	switch (count) {
	case 0:
	case "":
		return "No " + plural;
	case 1:
		return count + ' ' + singular;
	default:
		return count + ' ' + plural;
	}
};

generatePassword = function(len) {
    var length = len || 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ123456789!@#_",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};

lookupFieldFromEitherId = function(userId,requiredField){
	// Takes a UserID and returns the value of the requested field for that User e.g. lookupNameFromUserId(userId,'username');
	// if 'requiredField' is omitted - will return displayName

	// console.log("lookupFieldFromEitherId()",userId,requiredField);

	var requiredField = requiredField || "displayName";

	/* First query with UserId*/
	var thisUser = Meteor.users.findOne({"_id": userId});

	// console.log(thisUser, jQuery.isPlainObject(thisUser));

	/* If fails to return an object - we try with DB ID instead*/
	if ( jQuery.isPlainObject(thisUser) == false ){
		thisUser = Meteor.users.findOne({"_id": userId});
	}

	/* Return on second failure */
	if ( jQuery.isPlainObject(thisUser) == false ){
		// console.log("Error: userId did not match '_id'", userId);
		return false;
	};

	/* Assuming we now have a Meteor.user object - set the parameter required */
	if (jQuery.isPlainObject(thisUser)){
		returnName = thisUser[requiredField] || thisUser["username"] || thisUser["emails"][0]["address"];
		return returnName;
	} else {
		return false;
	}
};

showPasswordInputMouseover = function (trigger) {
	if ( trigger == "click" ) {
		jQuery("#changePasswordInput").data("trigger","click");
		$("#changePasswordInput").focus();
	}
	var obj = document.getElementById('changePasswordInput');
	obj.type = "text";
};
showPasswordInputMouseout = function (obj) {
	if ( jQuery("#changePasswordInput").data("trigger") == "click" ) {
		/* Supress mouseout if show was set by click - rather than by mouseover */
		return;
	}
	var obj = document.getElementById('changePasswordInput');
	obj.type = "password";
};

myPostLogout = function(){
    //example redirect after logout
    console.log("Goodbyeeee from globalFunctions.js!");
    // TODO: Add logging!
    FlowRouter.go('/sign-in');
};

forceUserPasswordChange = function (db_id,newpassword) {

	/* mizzao:bootboxjs */
	/* See: http://bootboxjs.com/examples.html#bb-alert-dialog */

	var uDisplayName = lookupFieldFromEitherId(db_id, "displayName");
	var uUsername = lookupFieldFromEitherId(db_id, "username");

	var box = bootbox.confirm({
		// size: "small",
		title: "New password for: <b>" + uDisplayName + "</b> (" + uUsername + ")",
		inputType: 'password',
		message: '<input class="bootbox-input bootbox-input-password form-control changePasswordInput" data-user_db_id="'+db_id+'" id="changePasswordInput" name="changePasswordInput" autocomplete="off" type="password"></input> <img src="/img/view_icon.gif" class="showPasswordIcon cursor-pointer" onclick="showPasswordInputMouseover(\'click\');" onmouseover="showPasswordInputMouseover(\'mouse\');" onmouseout="showPasswordInputMouseout();" /><div class="form-group"><div class="checkbox"><label><input type="checkbox" id="logout-checkbox" value="" checked="checked">Logout user from all current session</label></div></div>',
		backdrop: true,
		onEscape: true,
		buttons: {
			confirm: {
				label: 'Submit',
				className: 'btn-primary btn-submit'
			},
			cancel: {
				label: 'Cancel',
				className: 'btn-default'
			}
		},
		callback: function (result, db_id, forceLogout) {
				var newpass = jQuery("#changePasswordInput").val();
				var db_id = jQuery("#changePasswordInput").data('user_db_id');
				var forceLogout = jQuery("#logout-checkbox").is(':checked');
				//console.log(db_id,newpass,typeof result,result);
				if (result) {
					//console.log("bootbox.prompt.callback() - OK!", result );

					/* -------------------------------------------------------- */
					/*   TODO: This is where PW validation should be added!!!   */
					/* -------------------------------------------------------- */

					if (newpass && newpass!="" ){
						serverCall(db_id, newpass, forceLogout);
					} else {
						sAlert.error('Invalid password provided. No change was made.',{});
						bootbox.hideAll();
						return false;
					}

				} else {
					sAlert.warning('Password update was cancelled.',{});
					bootbox.hideAll();
					return false;
				}
		}
	});

	box.on('shown.bs.modal',function(){
		/* SET FOCUS */
		$("#changePasswordInput").focus();
		/* SUBMIT FORM ON ENTER - CUSTOM BOOTBOX FORM/MODAL SO WE NEED TO DO THIS MANUALLY */
		jQuery(document).on('keyup', (e) => {
			if (e.keyCode == 27) { // ESCAPE
				// ALERT("ESCAPE KEY!");
				// DO NOTHING - THIS IS HANDLED BY BOOTBOX
			}
			if (e.keyCode == 13) { // ESCAPE
				// ALERT("ENTER");
				//console.log("Enter key detected from changePassword diaglog - simulating submit click");
				$('button.btn-submit').click();
			}
    	});
	});

	/* TODO - Add logging! */

	// Add autofocus!

	var serverCall = function( db_id, newpassword, forceLogout ) {
		console.log("serverCall()", db_id, newpassword, forceLogout)

		var response;
		var showname = uDisplayName || uUsername;
		var forceLogout = (typeof forceLogout == "boolean") ? forceLogout : true;

		Meteor.call("forceUserPasswordChangeServer", db_id, newpassword, forceLogout ,function(err,result,doc){
			console.log("forceUserPasswordChangeServer()",err,result,doc);
			if( !err ){
				response = "<strong>SUCCESS: </strong>Password updated successfully for user '"+showname+"'";
				sAlert.success(response);
				// console.log(response);
				return response;
			} else {
				response = "<strong>ERROR: </strong>Error setting password for '"+showname+"': " + err.reason;
				sAlert.error(response);
				// console.log(response);
				return response;
			}
		});
	}
};

// globalfn_deleteOrg = function (orgObj, userId, goUrl) {
// 	// event.preventDefault();
// 	var areYouSure = "_Are you sure you want to permanently delete org '"+orgObj.title+"'?\n\n>> There is no way back! <<\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n"
// 	if ( confirm(areYouSure) ) {
// 		Meteor.call("deleteOrg", orgObj._id, userId, function(error, result) {
// 			console.log("error: " + error + "\n" + "result: " + result);
// 			var alertMsgPrefix = "<i class='fa fa-building fa-lg'></i>&nbsp;&nbsp;";
// 			if (!error && true === result){
// 				sAlert.success(alertMsgPrefix + "<strong>SUCCESS: </strong>Org: <i>'"+orgObj.title+"'</i> was successfully deleted.",
// 					{
// 						html: true
// 					}
// 				);
// 			} else {
// 				sAlert.error(alertMsgPrefix + "<strong>ERROR: </strong>Failed to delete org: '<strong>"+orgObj.title+"</strong>' with error: <code>"+error+"</code>",
// 					{
// 						html: true,
// 						timeout: appSettings.sAlert.longTimeout
// 					}
// 				);
// 			}
// 		});
// 		if (typeof goUrl == "string" && goUrl != "") {
// 			FlowRouter.go(goUrl);
// 		}
// 	} else {
// 		return false;
// 	}
// };
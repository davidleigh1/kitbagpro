/* IMPORT PROJECT OBJECTS */
import { appSettings } 	from '/imports/startup/both/sharedConstants.js';


/* GLOBAL GENERICS */

globalOnSuccess = function(thisCollectionName, thisAction = 'created', resultObj = {id:'unknown'},	formType = 'unknown', alertMsgPrefix = '') {
	console.log("globalOnSuccess()",arguments);

	// TODO: Remove all instances of thisObj (where string is used) in favour of thisCollectionName
	thisCollectionName = thisCollectionName || thisObj || 'unknown';

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

	// TODO: Remove all instances of thisObj (where string is used) in favour of thisCollectionName
	thisCollectionName = thisCollectionName || thisObj || 'unknown';

	var alertMsgPrefix = "<i class='fa "+appSettings[thisCollectionName.toLowerCase()].fontAwesomeIcon+" fa-lg'></i>&nbsp;&nbsp;";

	var msg = alertMsgPrefix + "<strong>Error: </strong><code>"+error.message+"</code>";
	sAlert.error(msg, {
		html: true,
		timeout: appSettings.sAlert.longTimeout
	});
};

globalDelete = function (origin = 'unknown', thisCollectionName, assocObj, userId, goUrl) {
	/* TODO: Based on globalfn_deleteOrg() - below - which should be deprecated  */
	// event.preventDefault();
	console.log("globalDelete()");

	var alertMsgPrefix = "<i class='fa "+appSettings[thisCollectionName.toLowerCase()].fontAwesomeIcon+" fa-lg'></i>&nbsp;&nbsp;";
	var areYouSure = "Permanently delete "+ appSettings[thisCollectionName.toLowerCase()].labelSingular + " '"+assocObj.title+"'?\n\nThere is no undo!\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n"
	if ( confirm(areYouSure) ) {

		console.log("\n\nTODO: BLOCK DELETION TO AVOID ORPHAN KITBAGS OR ITEMS!");

		Meteor.call("deleteDoc", origin, thisCollectionName, assocObj, userId, function(error, result) {
			console.log("error: " + error + "\n" + "result: " + result);
			// TODO: Get message prefix from appSettings!
			if (!error && true === result){
				sAlert.success(alertMsgPrefix + "<strong>SUCCESS: </strong>"+appSettings[thisCollectionName.toLowerCase()].labelCapsSingular+": <i>'"+assocObj.title+"'</i> was successfully deleted.",
					{
						html: true
					}
				);
			} else {
				sAlert.error(alertMsgPrefix + "<strong>ERROR: </strong>Failed to delete "+appSettings[thisCollectionName.toLowerCase()].labelSingular+": '<strong>"+assocObj.title+"</strong>' with error: <code>"+error+"</code>",
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
		return false;
	}
};

// globalTrashed("TrashedByUser", "Kitbags", this, Meteor.userId(), "#");

globalTrash = function (origin = 'unknown', thisObj, assocObj, userId, goUrl) {
	console.log("globalTrash()", arguments);

	var areYouSure = "Trash "+appSettings[thisObj.toLowerCase()].labelSingular+" '"+assocObj.title+"'?\n(ID: "+assocObj._id+")";
	if ( confirm(areYouSure) ) {
		Meteor.call("setDocStatus", thisObj, assocObj._id, "Trashed");
	} else {
		return false;
	}
};

globalDuplicate = function(thisObj,objPrefix) {
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
		return userFound.profile.displayName || userFound.username;
	}
};


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
	// Takes a UserID and returns the value of the requested field for that User e.g. lookupNameFromUserId(profile.userId,'username');
	// if 'requiredField' is omitted - will return profile.displayName

	// console.log("lookupFieldFromEitherId()",userId,requiredField);

	var requiredField = requiredField || "profile.displayName";

	/* First query with UserId*/
	var thisUser = Meteor.users.findOne({"profile.userId": userId});

	// console.log(thisUser, jQuery.isPlainObject(thisUser));

	/* If fails to return an object - we try with DB ID instead*/
	if ( jQuery.isPlainObject(thisUser) == false ){
		thisUser = Meteor.users.findOne({"_id": userId});
	}

	/* Return on second failure */
	if ( jQuery.isPlainObject(thisUser) == false ){
		// console.log("Error: userId did not match '_id' or 'profile.userId'", userId);
		return false;
	};

	/* Assuming we now have a Meteor.user object - set the parameter required */
	if (jQuery.isPlainObject(thisUser)){
		returnName = thisUser[requiredField] || thisUser["profile"][requiredField.replace("profile.","")] || thisUser["username"] || thisUser["emails"][0]["address"];
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

	var uDisplayName = lookupFieldFromEitherId(db_id, "profile.displayName");
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

globalfn_deleteOrg = function (orgObj, userId, goUrl) {
	// event.preventDefault();
	var areYouSure = "_Are you sure you want to permanently delete org '"+orgObj.title+"'?\n\n>> There is no way back! <<\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n"
	if ( confirm(areYouSure) ) {
		Meteor.call("deleteOrg", orgObj._id, userId, function(error, result) {
			console.log("error: " + error + "\n" + "result: " + result);
			var alertMsgPrefix = "<i class='fa fa-building fa-lg'></i>&nbsp;&nbsp;";
			if (!error && true === result){
				sAlert.success(alertMsgPrefix + "<strong>SUCCESS: </strong>Org: <i>'"+orgObj.title+"'</i> was successfully deleted.",
					{
						html: true
					}
				);
			} else {
				sAlert.error(alertMsgPrefix + "<strong>ERROR: </strong>Failed to delete org: '<strong>"+orgObj.title+"</strong>' with error: <code>"+error+"</code>",
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
		return false;
	}
};
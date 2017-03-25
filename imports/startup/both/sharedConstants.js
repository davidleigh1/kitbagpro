// Truely global variables available in BOTH CLIENT and SERVER scopes

// IN MOST CASES - NOT ACTUALLY CONSTANTS!!!!!!!

console.log("RUN: 'sharedConstants.js' at '/imports/startup/both/sharedConstants.js'");

export const kb = {
	collections: {
		something: "here"
	},
	schemas: {
	}
};

/* Prefixes used by the unique keys generators e.g. GlobalHelper.idGenerator() */
/* These Prefixes used for validating user-exposed content, routing etc  */

uniqueIds = {
	orgPrefix      : "1221",
	kbPrefix       : "2470",
	itemPrefix     : "4465",
	userPrefix     : "5530",
	uniqueIdLength : "16"
};

/* Will be used as the main config namespace */
export const appSettings = {
	global: {
		appName          				: "JumpbagApp",
		appUrl           				: "http://kitbagpro.com",
		createdVia       				: ["Unknown","ManualFormEntry","ManualDataImport","ManualDuplicate","AdminDataImport","FixtureData"],
		createdViaDefault				: "ManualFormEntry",
		duplicatedPrefix 				: "Duplicate of ",
		validObjects     				: ["Orgs","Kitbags","Items","Users"],
		omitFields       				: "createdVia, createdAt, createdBy, updatedAt, updatedBy, "
	},
	sAlert: {
		defaultTimeout					: 1000,
		shortTimeout					: 1000,
		longTimeout						: 10000
	},
	userInventory: {
		itemInventoryStatus 			: ["Available","Deficient/Unavailable","On Loan","In Repair"]
	},
	fontAwesomeIcon: {
		orgs   : "fa-hospital-o",
		kitbags: "fa-medkit",
		items  : "fa-stethoscope",
		users  : "fa-users",		// Plural
		user   : "fa-user",			// Single
		trash  : "fa-trash",
		edit   : "fa-pencil",
		view   : "fa-eye",
		delete : "fa-ban",
		addUser: "fa-user-plus"
	},
	orgs: {
		labelSingular                 : "org",
		labelPlural                   : "orgs",
		labelCapsSingular             : "Org",
		labelCapsPlural               : "Orgs",
		fontAwesomeIcon               : "fa-hospital-o",
		statuses                      : ["Active","Hidden","Trashed"],
		statusesIncludedInAllCount    : ["Active","Hidden"],
		statusesIncludedInActiveCount : ["Active"],
		statusesIncludedInHiddenCount : ["Hidden"],
		statusesIncludedInTrashedCount: ["Trashed"],
		divisions                     : ["North", "Central", "South", "East", "West", "Regional", "HQ", "Mobile", "Flight"],
		teams                         : ["BLS", "ALS", "Doctor", "Motorcycle", "Technical", "Logisitics", "Management", "Training"],
		get omitFields () {
			return appSettings.global.omitFields + "assocKitbagCount, assocKitbagIds";
		}
	},
	kitbags: {
		labelSingular                 : "kitbag",
		labelPlural                   : "kitbags",
		labelCapsSingular             : "Kitbag",
		labelCapsPlural               : "Kitbags",
		fontAwesomeIcon               : "fa-medkit",
		statuses                      : ["Active","Hidden","Retired","Trashed"],
		statusesIncludedInAllCount    : ["Active","Hidden","Retired"],
		statusesIncludedInActiveCount : ["Active","Retired"],
		statusesIncludedInHiddenCount : ["Hidden"],
		statusesIncludedInTrashedCount: ["Trashed"],
		get omitFields () {
			return appSettings.global.omitFields + "kitbagAssocKitbagCount";
		}		
	},
	items: {
		labelSingular                 : "item",
		labelPlural                   : "items",
		labelCapsSingular             : "Item",
		labelCapsPlural               : "Items",
		fontAwesomeIcon               : "fa-stethoscope",
		statuses                      : ["Active","Hidden","Retired","Trashed"],
		statusesIncludedInAllCount    : ["Active","Hidden","Retired"],
		statusesIncludedInActiveCount : ["Active","Retired"],
		statusesIncludedInHiddenCount : ["Hidden"],
		statusesIncludedInTrashedCount: ["Trashed"],
		standardSizes                 : ["One Size","Extra Small","Small","Medium","Large","Extra Large"],
		patientAgeGroups              : ["One Size","New Born","Infant","Child","Adult","Geriatric"], /* http://www.medscape.com/viewarticle/495441 */
		get omitFields () {
			return appSettings.global.omitFields + "assocKitbagCount";
		}		
	},
	users: {
		labelSingular    : "user",
		labelPlural      : "users",
		labelCapsSingular: "User",
		labelCapsPlural  : "Users",
		fontAwesomeIcon  : "fa-users",
		allUserTypes     : [	// Suspected to be obsolete
							{
								label: "System Admin",
								value: "SuperAdmin"
							},
							{
								label: "Organisational Administrator",
								value: "OrgAdmin"
							},
							{
								label: "Organisational Manager",
								value: "OrgManager"
							},
							{
								label: "Organisational User",
								value: "User"
							}
						  ],
		allUserTypes2	: {
							"SuperAdmin": {
								label: "System Admin",
								value: "SuperAdmin"
							},
							"OrgAdmin": {
								label: "Organisational Administrator",
								value: "OrgAdmin"
							},
							"OrgManager": {
								label: "Organisational Manager",
								value: "OrgManager"
							},
							"User": {
								label: "Organisational User",
								value: "User"
							}
						  },
		adminTypes	: ["SuperAdmin", "OrgAdmin"],	// Suspected to be obsolete
		managerTypes: ["OrgManager"],				// Suspected to be obsolete
		nonAdminTypes: ["User"],					// Suspected to be obsolete
		statuses 		: ["Active","Hidden","Retired","Trashed"],
		get omitFields () {
			return appSettings.global.omitFields + "itemAssocKitbagCount, services";
		}		
	},
	permissions: {
		/* Use with userHasPermission (helper) / fn_userHasPermission() */
		/* SuperAdmin */
		isSuperAdmin: 			["SuperAdmin"],
		/* Pages */
		canViewOrgList: 		["SuperAdmin"],
		canViewKitbagList: 		["SuperAdmin", "OrgAdmin", "OrgManager"],
		canViewItemList: 		["SuperAdmin", "OrgAdmin", "OrgManager"],
		canViewUserList: 		["SuperAdmin", "OrgAdmin", "OrgManager"],
		/* Global Data */
		canViewAllOrgs: 		["SuperAdmin"],
		canViewAllKitbags: 		["SuperAdmin"],
		canViewAllItems: 		["SuperAdmin"],
		canViewAllUsers:		["SuperAdmin"],
		/* VIEW Org Data */
		canViewOrgDetails: 		["SuperAdmin", "OrgAdmin"],
		canViewAllOrgKitbags: 	["SuperAdmin", "OrgAdmin", "OrgManager"],
		canViewAllOrgItems: 	["SuperAdmin", "OrgAdmin", "OrgManager"],
		canViewAllOrgUsers:		["SuperAdmin", "OrgAdmin"],
		/* EDIT Org Data */
		canEditOrgDetails: 		["SuperAdmin", "OrgAdmin"],
		canEditOrgKitbags: 		["SuperAdmin", "OrgAdmin", "OrgManager"],
		canEditOrgItems: 		["SuperAdmin", "OrgAdmin", "OrgManager"],
		canEditOrgUsers:		["SuperAdmin", "OrgAdmin"],
		/* DELETE Data */
		canDeleteAllUsers:		["SuperAdmin"],
		canDeleteOrgUsers:		["SuperAdmin", "OrgAdmin"],
	},
	uniqueIds: {
		orgPrefix      : "1221",
		kbPrefix       : "2470",
		userPrefix     : "5530",
		uniqueIdLength : 16
	},
	categories: [
		{	catName:  "AIRWAY",			catLabel: "Airway Management",														catStatus: "Active" },
		{	catName:  "OXYGEN",			catLabel: "Breathing / Oxygen / O2 Therapy",										catStatus: "Active" },
		{	catName:  "BSIPPE",			catLabel: "BSI (Body Substance Isolation) / PPE (Personal Protection Equipment)",	catStatus: "Active" },
		{	catName:  "COMMS",			catLabel: "Communications",															catStatus: "Active" },
		{	catName:  "CPR",			catLabel: "CPR / Resuscitation ",													catStatus: "Active" },
		{	catName:  "EXTRIC",			catLabel: "Extrication Tools",														catStatus: "Active" },
		{	catName:  "FLUIDS",			catLabel: "IV Therapy",																catStatus: "Active" },
		{	catName:  "MCIMGT",			catLabel: "MCI Management / Triage",												catStatus: "Active" },
		{	catName:  "DRUGS",			catLabel: "Medicine",																catStatus: "Active" },
		{	catName:  "MISC",			catLabel: "Miscellaneous, Special, and Optional Items",								catStatus: "Active" },
		{	catName:  "MBIKE",			catLabel: "Motorcycle",																catStatus: "Active" },
		{	catName:  "ORGDOC",			catLabel: "Organisational Equipment / Documentation",								catStatus: "Active" },
		{	catName:  "POV",			catLabel: "Private Vehicle",														catStatus: "Active" },
		{	catName:  "VITALS",			catLabel: "Vital Signs / Diagnostic Tools (BP / Glucose)",							catStatus: "Active" },
		{	catName:  "TRAUMA",			catLabel: "Wound / Trauma Management",												catStatus: "Active"	}
	],
	consoleCSS: {
		code: "padding: 2px 4px; font-size: 90%; color: #c7254e; background-color: #f9f2f4; border-radius: 4px; font-family: Menlo,Monaco,Consolas,'Courier New',monospace;"
	}
};

console.log("NEW:"+"%ckb"+"%c and "+"%cappSettings"+"%c at '/imports/startup/both/sharedConstants.js'",appSettings.consoleCSS.code,'',appSettings.consoleCSS.code,'');


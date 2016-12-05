// Truely global variables available in BOTH CLIENT and SERVER scopes

// IN MOST CASES - NOT ACTUALLY CONSTANTS!!!!!!!

console.log("RUNNING /imports/startup/both/sharedConstants.js");


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
		createdVia	 					: ["Unknown","ManualFormEntry","ManualDataImport","ManualDuplicate","AdminDataImport"],
		createdViaDefault				: "ManualFormEntry",
	},
	sAlert: {
		defaultTimeout					: 5000,
		longTimeout						: 10000,
	},
	userInventory: {
		itemInventoryStatus 			: ["Available","Deficient/Unavailable","On Loan","In Repair"]
	},
	orgs: {
		statuses 						: ["Active","Hidden","Trashed"],
		statusesIncludedInAllCount 		: ["Active","Hidden"],
		statusesIncludedInActiveCount 	: ["Active"],
		statusesIncludedInHiddenCount 	: ["Hidden"],
		statusesIncludedInTrashedCount 	: ["Trashed"],
		divisions						: ["North", "Central", "South", "East", "West", "Regional", "HQ", "Mobile", "Flight"],
		teams							: ["BLS", "ALS", "Doctor", "Motorcycle", "Technical", "Logisitics", "Management", "Training"],
	},
	kitbags: {
		statuses 						: ["Active","Hidden","Retired","Trashed"],
		statusesIncludedInAllCount 		: ["Active","Hidden","Retired"],
		statusesIncludedInActiveCount 	: ["Active","Retired"],
		statusesIncludedInHiddenCount 	: ["Hidden"],
		statusesIncludedInTrashedCount 	: ["Trashed"]
	},
	items: {
		statuses 						: ["Active","Hidden","Retired","Trashed"],
		statusesIncludedInAllCount 		: ["Active","Hidden","Retired"],
		statusesIncludedInActiveCount 	: ["Active","Retired"],
		statusesIncludedInHiddenCount 	: ["Hidden"],
		statusesIncludedInTrashedCount 	: ["Trashed"],
		standardSizes					: ["One Size","Extra Small","Small","Medium","Large","Extra Large"],
		patientAgeGroups				: ["One Size","New Born","Infant","Child","Adult","Geriatric"], /* http://www.medscape.com/viewarticle/495441 */
	},
	users: {
		allUserTypes					: [
											{
												label: "System Admin",
												value: "SuperAdmin"
											},
											{
												label: "Organizational Administrator",
												value: "OrgAdmin"
											},
											{
												label: "Organizational Manager",
												value: "OrgManager"
											},
											{
												label: "Organizational User",
												value: "User"
											}
										  ],
		allUserTypes2					: {
											"SuperAdmin": {
												label: "System Admin",
												value: "SuperAdmin"
											},
											"OrgAdmin": {
												label: "Organizational Administrator",
												value: "OrgAdmin"
											},
											"OrgManager": {
												label: "Organizational Manager",
												value: "OrgManager"
											},
											"User": {
												label: "Organizational User",
												value: "User"
											}
										  },
		userAdminTypes					: ["SuperAdmin", "OrgAdmin", "OrgManager"],
		statuses 						: ["Active","Hidden","Retired","Trashed"],
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
		{	catName:  "ORGDOC",			catLabel: "Organizational Equipment / Documentation",								catStatus: "Active" },
		{	catName:  "POV",			catLabel: "Private Vehicle",														catStatus: "Active" },
		{	catName:  "VITALS",			catLabel: "Vital Signs / Diagnostic Tools (BP / Glucose)",							catStatus: "Active" },
		{	catName:  "TRAUMA",			catLabel: "Wound / Trauma Management",												catStatus: "Active"	}
	]
};

console.log(">>> SHAREDCONSTANTS.JS - appSettings:\n",appSettings);



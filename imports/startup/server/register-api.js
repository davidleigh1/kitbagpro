console.log("RUN: register-api.js");

console.log("\nTODO:ARE THESE IMPORTS REQUIRED??? (2131) \n");

import { Orgs } from '/imports/startup/both/schema-org.js';
import { Kitbags } from '/imports/startup/both/schema-kitbag.js';
import { Items } from '/imports/startup/both/schema-item.js';

/* ADMIN */
	import '/imports/api/admin/methods.js';
	import '/imports/api/admin/server/publications.js';
/* ORGS */
	import '/imports/api/orgs/methods.js';
	import '/imports/api/orgs/server/publications.js';
/* KITBAGS */
	import '/imports/api/kitbags/methods.js';
	import '/imports/api/kitbags/server/publications.js';
/* ITEMS */
	import '/imports/api/items/methods.js';
	import '/imports/api/items/server/publications.js';
/* USERS */
	import '/imports/api/users/methods.js';
	import '/imports/api/users/server/publications.js';
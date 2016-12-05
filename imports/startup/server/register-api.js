console.log("RUNNING register-api.js");

// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';
import { Items } from '/imports/startup/both/item-schema.js';
// import { UserList } from '/imports/api/users/users.js';
// import { Items } from '/both/newItems.js';

/* ADMIN */
	import '../../api/admin/methods.js';
	import '../../api/admin/server/publications.js';
/* ORGS */
	import '../../api/orgs/methods.js';
	import '../../api/orgs/server/publications.js';
/* KITBAGS */
	import '../../api/kitbags/methods.js';
	import '../../api/kitbags/server/publications.js';
/* ITEMS */
	import '../../api/items/methods.js';
	import '../../api/items/server/publications.js';
/* USERS */
	import '../../api/users/methods.js';
	import '../../api/users/server/publications.js';
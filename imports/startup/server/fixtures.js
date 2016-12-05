// # fill the DB with example data on startup
console.log("RUNNING server.fixtures.js");

import { Meteor } from 'meteor/meteor';


// See schema-orgs.js
// See schema-kitbags.js

// import { Lists } from '../../api/lists/lists.js';
// import { Todos } from '../../api/todos/todos.js';
import { Kitbags } from '../../api/kitbags/kitbags.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';

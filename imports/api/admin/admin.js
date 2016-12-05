// # definition of this collection

import { Mongo } from 'meteor/mongo';

// import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';

console.log("'Admin' Collection is defined here!");

export const Admin = new Mongo.Collection("admin");
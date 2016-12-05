// # definition of this collection

import { Mongo } from 'meteor/mongo';
// import { Factory } from 'meteor/factory';
// import faker from 'faker';

// import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Kitbags } from '../kitbags/kitbags.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
// import { Orgs } from '../orgs/orgs.js';

// console.log(">>>>> 'MyCollections.Kitbags' is defined here!");
console.log(">>>>> 'Kitbags' is defined here!");

// MyCollections = ( typeof MyCollections != "undefined" && typeof MyCollections == "object" ) ? MyCollections : {};

// export const MyCollections.Kitbags = new Mongo.Collection("kitbags");
// MyCollections.listKitbagStatuses = ["Active","Hidden","Trashed"];

export const Kitbags            = new Mongo.Collection("kitbags");
export const listKitbagStatuses = ["Active","Hidden","Trashed"];

// Kitbags.before.insert(function (userId, doc) {
//   doc.newCreatedAt = Date.now();
// });


import './mainLayout.html';

import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
// import { Orgs } from '/imports/api/orgs/orgs.js';

import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";

// import { Orgs } from '/imports/startup/both/schema-org.js';
// import { Kitbags } from '/imports/startup/both/schema-kitbag.js';
import { Items } from '/imports/startup/both/item-schema.js';
import { UserList } from '/imports/startup/both/schema-user.js';
// import { Items } from '/imports/api/items/items.js';
// import { Items } from '/both/newItems.js';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';

import '/imports/ui/components/loading/loading.js';

import '/imports/ui/pages/startScreen/startScreen.html';
import '/imports/ui/components/globalFooter.html';
import '/imports/ui/components/navigation.js';
// import '/imports/ui/components/headerMenuItems.html';
// import '/imports/ui/components/navbarHeader.html';
// import '/imports/ui/components/sidebarMenuItems.html';
// import '/imports/ui/components/menus/menu.html';
// import '/imports/ui/components/menus/userMenu.html';
// import '../../ui/components/mainLayout/headerMenuItems.html';


Template.mainLayout.onCreated(function(){
  	var that = this;
  		that.subscribe('kitbags');
  		that.subscribe('orgs');
  		that.subscribe('items');
  		// that.subscribe('workjournals');
  	that.autorun(function(){
    		if (/*libProfilesHandle.ready() &&*/ that.subscriptionsReady()) {
      //init data structures
      console.log(" =========== READY NOW ================== ");
    }
  });
});
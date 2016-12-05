/* Defines the reactive vars used for lists and minilists */

listFilterString = new ReactiveVar();
obj_defineDataset = new ReactiveVar();

/* RESULTS - SHOULD REALLY BE USING A REACTIVE OBJECT :(   */
int_resultsCount = new ReactiveVar(0);	// Superceded by obj_resultsCount
obj_resultsCount = new ReactiveVar({}); 	// Supercedes int_resultsCount

int_orgsFound = new ReactiveVar(0);
int_orgBagsFound = new ReactiveVar(0);
int_itemBagsFound = new ReactiveVar(0);
int_itemsFound = new ReactiveVar(0);
int_usersFound = new ReactiveVar(0);
int_orgUsersFound = new ReactiveVar(0);


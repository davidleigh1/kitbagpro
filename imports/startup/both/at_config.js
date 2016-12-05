console.log("RUNNING /imports/startup/both/at_config.js");

// # configure login templates

// REFERENCES:
// https://atmospherejs.com/useraccounts/flow-routing
// https://github.com/meteor-useraccounts/core/blob/master/Guide.md


// https://github.com/meteor-useraccounts/core/blob/master/Guide.md#logout
myPostLogout = function(){
    //example redirect after logout
    console.log("$ Goodbye! TODO: Add logging!");
    // TODO: Add logging!
    FlowRouter.go('/sign-in');
};

mySubmitFunc = function(){
    console.log("$ mySubmitFunc() - What is passed?");
};

AccountsTemplates.configure({
	// atform settings
    defaultLayoutType: 'blaze', // Optional, the default is 'blaze'
    defaultLayout: 'fullPage',
	defaultTemplate: 'myCustomFullPageAtForm',
    defaultLayoutRegions: {},
    defaultContentRegion: 'main',
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: true,		// TODO: Set true for production app!
    overrideLoginErrors: false,				// TODO: Set true for production app!
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: true,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 2000,

    // Hooks
    onLogoutHook: myPostLogout,
    onSubmitHook: mySubmitFunc,
    // preSignUpHook: myPreSubmitFunc,
    // postSignUpHook: myPostSubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
    },
});

// AccountsTemplates.addFields([
//   {
//       _id: "username",
//       type: "text",
//       displayName: "username",
//       required: true,
//       minLength: 5,
//   }
// ]);


/* Routes */
// https://atmospherejs.com/useraccounts/flow-routing

AccountsTemplates.configureRoute('changePwd');
// AccountsTemplates.configureRoute('forgotPwd');
// AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
// AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
/*
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('resendVerificationEmail');
*/
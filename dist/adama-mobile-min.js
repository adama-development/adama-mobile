"use strict";angular.module("adama-mobile",["ionic","ionic.service.core","ionic.service.auth","ionic.service.deploy","ionic.service.push","pascalprecht.translate","ngCookies","ngResource","LocalStorageModule","ngCordova","angular-jwt","ngMessages"]),angular.module("adama-mobile").run(["$ionicPlatform",function(e){e.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()})}]),angular.module("adama-mobile").config(["$urlRouterProvider",function(e){e.otherwise(function(e){var n=e.get("$state");n.go("app.main")})}]),angular.module("adama-mobile").config(["$translateProvider",function(e){e.useSanitizeValueStrategy("escapeParameters"),e.useLocalStorage(),e.registerAvailableLanguageKeys(["en","fr"],{"en_*":"en","fr_*":"fr"}),e.determinePreferredLanguage().fallbackLanguage("en")}]),angular.module("adama-mobile").config(["$stateProvider","adamaConstant",function(e,n){e.state("app",{"abstract":!0,url:"/app",templateUrl:function(){return n.adamaMobileToolkitTemplateUrl.app}})}]),angular.module("adama-mobile").run(["$rootScope","pageTitle",function(e,n){e.$on("$stateChangeSuccess",function(e,t){t&&t.data&&t.data.pageTitle&&n.set(t.data.pageTitle)})}]),angular.module("adama-mobile").config(["$httpProvider",function(e){e.interceptors.push("authExpiredInterceptor"),e.interceptors.push("authInterceptor")}]),angular.module("adama-mobile").run(["$rootScope","$state","principalService",function(e,n,t){e.$on("$stateChangeStart",function(e,a){a.data&&a.data.authorities&&a.data.authorities.length>0&&(t.isAuthenticated()?t.hasAnyAuthority(a.data.authorities)||n.go("auth.accessDenied"):n.go("auth.signin"))})}]),angular.module("adama-mobile").run(["$rootScope",function(e){e.$on("$stateChangeError",function(e,n,t,a,r,o){throw o})}]),angular.module("adama-mobile").run(["$rootScope","$injector","adamaConstant",function(e,n,t){var a,r;t.enableBadge&&(a=n.get("$ionicPlatform"),r=n.get("$cordovaBadge"),a.on("resume",function(){r.clear()}),a.ready(function(){r.clear()}))}]),angular.module("adama-mobile").run(["$rootScope","$injector","adamaConstant",function(e,n,t){var a,r,o;t.enablePush&&(a=n.get("$ionicPlatform"),r=n.get("$ionicPush"),o=n.get("$ionicUser"),a.ready(function(){r.init({debug:!1,onNotification:function(n){e.$apply(function(){var t=r.getPayload(n);console.log("notification, payload",n,t),e.notification=n,e.payload=t,(n.app.asleep||n.app.closed)&&console.log("application was asleep or closed")})},onRegister:function(e){console.log("Device token",e.token)},canShowAlert:!1,canSetBadge:!0,canPlaySound:!0,canRunActionsOnWake:!0}),o.current().isAuthenticated()?r.register(function(e){console.log("register at startup ok",e),r.saveToken(e)}):r.unregister()}),e.$on("ionicuser-new",function(){r.register(function(e){console.log("register after signing in ok",e)})}),e.$on("principal-remove",function(){r.unregister()}))}]),angular.module("adama-mobile").controller("AccessDeniedCtrl",function(){}),angular.module("adama-mobile").config(["$stateProvider","adamaConstant",function(e,n){e.state("auth",{"abstract":!0,url:"/auth",template:"<ui-view></ui-view>"}),e.state("auth.signin",{url:"/",templateUrl:function(){return n.adamaMobileToolkitTemplateUrl.authSignin},controller:"SigninCtrl",controllerAs:"$ctrl",data:{pageTitle:"SIGNIN",authorities:[]}}),e.state("auth.recoverPassword",{url:"/recoverPassword",templateUrl:function(){return n.adamaMobileToolkitTemplateUrl.authRecover},controller:"RecoverPasswordCtrl",controllerAs:"$ctrl",data:{pageTitle:"RECOVER",authorities:[]}}),e.state("auth.accessDenied",{url:"/accessDenied",templateUrl:function(){return n.adamaMobileToolkitTemplateUrl.authAccessDenied},controller:"AccessDeniedCtrl",controllerAs:"$ctrl",data:{pageTitle:"ACCESS_DENIED",authorities:[]}})}]),angular.module("adama-mobile").config(["$translateProvider",function(e){e.translations("fr",{SIGNIN:"Identification",SIGNIN_INTRO:"Identifiez-vous pour démarrer votre session",SIGNIN_FORGET_PASSWORD:"J'ai oublié mon mot de passe ...",SIGNIN_USERNAME:"Identifiant",SIGNIN_USERNAME_REQUIRED:"L'identifiant est obligatoire",SIGNIN_PASSWORD:"Mot de passe",SIGNIN_PASSWORD_REQUIRED:"Le mot de passe est obligatoire",SIGNIN_SUBMIT:"Démarrer la session",SIGNIN_LOADING:"Données en cours de chargement",SIGNIN_ERROR_TITLE:"Erreur d'authentification",SIGNIN_ERROR_MESSAGE:"Identifiant ou mot de passe incorrect.",RECOVER:"Récupération de mot de passe",RECOVER_INTRO:"Saisissez votre email pour récupérer votre mot de passe",RECOVER_MAIL:"Email",RECOVER_MAIL_REQUIRED:"L'email est obligatoire",RECOVER_MAIL_EMAIL:"L'email n'est pas au bon format",RECOVER_SUBMIT:"Récupérer mon mot de passe",RECOVER_BACK_TO_LOGIN:"Retour à l'identificaition",RECOVER_SUCCESS:"Consultez votre email pour connaître comment réinitialiser votre mot de passe.",RECOVER_ERROR_TITLE:"Erreur",RECOVER_ERROR_GENERIC:"Erreur lors de la récupération du mot de passe.",RECOVER_ERROR_EMAIL_NOT_EXIST:"L'email n'existe pas",ACCESS_DENIED_BACK_TO_HOME:"Retour à l'accueil",ACCESS_DENIED:"Accès interdit",ACCESS_DENIED_INTRO:"Vous n'avez pas suffisamment de droits d'accéder à cette page."}),e.translations("en",{SIGNIN:"Signin",SIGNIN_INTRO:"Sign in to start your session",SIGNIN_FORGET_PASSWORD:"I forgot my password ...",SIGNIN_USERNAME:"Username",SIGNIN_USERNAME_REQUIRED:"Username is required",SIGNIN_PASSWORD:"Password",SIGNIN_PASSWORD_REQUIRED:"Password is required",SIGNIN_SUBMIT:"Start session",SIGNIN_LOADING:"Loading user informations",SIGNIN_ERROR_TITLE:"Authentication error",SIGNIN_ERROR_MESSAGE:"Username or password are incorrect.",RECOVER:"Recover password",RECOVER_INTRO:"Set your email to recover your password",RECOVER_MAIL:"Email",RECOVER_MAIL_REQUIRED:"Email is required",RECOVER_MAIL_EMAIL:"Email does not respect the right format",RECOVER_SUBMIT:"Retrieve my password",RECOVER_BACK_TO_LOGIN:"Back to signin",RECOVER_SUCCESS:"Check your e-mails for details on how to reset your password.",RECOVER_ERROR_TITLE:"Error",RECOVER_ERROR_GENERIC:"Recovering error.",RECOVER_ERROR_EMAIL_NOT_EXIST:"E-Mail address isn't registered! Please check and try again",ACCESS_DENIED_BACK_TO_HOME:"Back to home",ACCESS_DENIED:"Access denied",ACCESS_DENIED_INTRO:"You do not have enough privileges to access this page."})}]),angular.module("adama-mobile").controller("RecoverPasswordCtrl",["$filter","$ionicPopup","principalService",function(e,n,t){var a=this;a.recover=function(r){a.recoverSuccess=!1,a.recoverError=!1,a.errorEmailNotExists=!1,a.loading=!0,t.resetPasswordInit(r).then(function(){a.recoverSuccess=!0})["catch"](function(t){var a="RECOVER_ERROR_GENERIC";400===t.status&&"e-mail address not registered"===t.data&&(a="RECOVER_ERROR_EMAIL_NOT_EXIST");var r=e("translate");n.alert({title:r("RECOVER_ERROR_TITLE"),template:r(a)})})["finally"](function(){a.loading=!1})}}]),angular.module("adama-mobile").controller("SigninCtrl",["$rootScope","$state","authService","$filter","$ionicPopup",function(e,n,t,a,r){var o=this;o.loading=!1,o.signin=function(e,i){o.loading=!0,t.login(e,i).then(function(){console.log("user is logged, rediret to app.main"),n.go("app.main"),o.loading=!1})["catch"](function(e){console.error("error while signing in",e),o.rejection=e;var n=a("translate");r.alert({title:n("SIGNIN_ERROR_TITLE"),template:n("SIGNIN_ERROR_MESSAGE")}),o.loading=!1})}}]),angular.module("adama-mobile").config(["$translateProvider",function(e){e.translations("fr",{BTN_SIGNOUT:"Déconnexion"}),e.translations("en",{BTN_SIGNOUT:"Sign out"})}]),angular.module("adama-mobile").component("btnSignout",{templateUrl:"adama-mobile/btn-signout/btn-signout.html",controller:["authService","$state",function(e,n){var t=this;t.signout=function(){e.logout(),n.go("auth.signin")}}]}),angular.module("adama-mobile").directive("dsBinaryFileUrl",["$parse","binaryFileService",function(e,n){return{scope:!1,link:function(t,a,r){var o=function(a){r.output&&(a=angular.copy(a)),angular.isArray(a)||(a=[a]),n.initUrlForBinaryFiles(a).then(function(){r.output&&e(r.output).assign(t,a)})};t.$watch(r.input,function(){var n=e(r.input)(t);n&&o(n)})}}}]),angular.module("adama-mobile").directive("dsLanguage",["$parse","language",function(e,n){return{scope:!1,link:function(t,a,r){n.getAll().then(function(n){e(r.data).assign(t,n)})}}}]),angular.module("adama-mobile").directive("dsPrincipalIdentity",["$rootScope","$parse","principalService",function(e,n,t){return{scope:!1,link:function(a,r,o){e.$on("principal-new",function(e,t){n(o.data).assign(a,t.principal)}),e.$on("principal-remove",function(){n(o.data).assign(a,void 0)}),t.getPrincipal().then(function(e){n(o.data).assign(a,e)})}}}]),angular.module("adama-mobile").factory("authExpiredInterceptor",["$injector","$q","adamaConstant",function(e,n,t){var a=function(){var n;return function(){return n||(n=e.get("$http"))}}(),r=function(){var n;return function(){return n||(n=e.get("adamaTokenService"))}}(),o=function(){var n;return function(){return n||(n=e.get("$state"))}}();return{responseError:function(e){var i=e.config;return 401===e.status&&0===i.url.indexOf(t.apiBase)?(console.log("authExpiredInterceptor error 401, refresh token",i.url),r().refreshAndGetToken().then(function(){return console.log("authExpiredInterceptor token is refresh, reset Authorization header"),i.headers.Authorization=void 0,a()(i)},function(e){return o().go("auth.signin").then(function(){return console.log("authExpiredInterceptor error while getting user token",e),n.reject(e)})})):n.reject(e)}}}]),angular.module("adama-mobile").factory("authInterceptor",["$injector","$q","adamaConstant",function(e,n,t){var a=function(){var n;return function(){return n||(n=e.get("adamaTokenService"))}}(),r=function(){var n;return function(){return n||(n=e.get("$state"))}}();return{request:function(e){return console.log("authInterceptor",e.url),e.headers=e.headers||{},e.headers.Authorization||0!==e.url.indexOf(t.apiBase)?e:(console.log("authInterceptor need authorization, getting token"),a().getToken().then(function(n){return console.log("authInterceptor adding Authorization header",n),n&&(e.headers.Authorization="Bearer "+n),e},function(e){return r().go("auth.signin").then(function(){return console.log("authInterceptor error while getting user token",e),n.reject(e)})}))}}}]),angular.module("adama-mobile").factory("User",["$resource","adamaConstant","adamaResourceConfig",function(e,n,t){var a=angular.extend({},t,{"delete":{method:"DELETE",params:{id:"@id"}}});return e(n.apiBase+"users/:id",{},a)}]),angular.module("adama-mobile").factory("adamaResourceConfig",["ParseLinks",function(e){return{query:{method:"GET",isArray:!0,transformResponse:function(n,t,a){return n=angular.fromJson(n),200===a&&(n.$metadata={links:e.parse(t("link")),totalItems:t("X-Total-Count")}),n},interceptor:{response:function(e){return e.resource.$metadata=e.data.$metadata,e.resource}}},get:{method:"GET"},save:{method:"POST"},update:{method:"PUT"},"delete":{method:"DELETE",params:{id:"@id"}}}}]),angular.module("adama-mobile").factory("adamaTokenService",["$rootScope","$http","$q","$state","$ionicUser","jwtHelper","adamaConstant",function(e,n,t,a,r,o,i){var s={},u=r.current();return e.$on("ionicuser-new",function(){console.log("adamaTokenService update ionicUser"),u=r.current()}),s.getToken=function(){console.log("adamaTokenService.getToken");var e;return u.isAuthenticated()&&(console.log("adamaTokenService.getToken user is authenticated"),e=u.get("access_token"),e&&o.isTokenExpired(e))?(console.log("adamaTokenService.getToken token is expired"),s.refreshAndGetToken()):t.when(e)},s.refreshAndGetToken=function(){console.log("adamaTokenService.refreshAndGetToken");var e=u.get("access_token");if(!e)return console.error("no token, redirect to signin"),console.log("for debugging purpose, here is the ionic current user",u),console.log("for debugging purpose, here is the ionic current user.isAuthenticated",u.isAuthenticated()),console.log("for debugging purpose, here is a JSON.stringify version of ionic current user",JSON.stringify(u)),t.reject("refreshAndGetToken : no token !!!!");console.log("adamaTokenService.refreshAndGetToken token",e);var a=u.get("refresh_token");return console.log("adamaTokenService.refreshAndGetToken refreshToken",a),n({method:"POST",url:i.apiBase+"login/refresh",headers:{Authorization:"Bearer "+e},data:{refresh_token:a}}).then(function(e){var n=e.data.access_token;return console.log("adamaTokenService.refreshAndGetToken newToken",n),u.set("access_token",n),u.save().then(function(){return n})},function(e){return console.error("error while refreshing user token, redirect to signin",e),t.reject(e)})},s}]),angular.module("adama-mobile").constant("adamaConstant",{apiBase:"http://localhost:13337/",adamaMobileToolkitTemplateUrl:{app:"adama-mobile/app.html",authAccessDenied:"adama-mobile/auth/accessDenied.html",authSignin:"adama-mobile/auth/signin.html",authRecover:"adama-mobile/auth/recoverPassword.html"},enableBadge:!1,enablePush:!1,urlResetPassword:"path/to/reset/password?origin=mobile"}),angular.module("adama-mobile").factory("authService",["$rootScope","$http","$ionicAuth","adamaConstant","principalService",function(e,n,t,a,r){var o={};return o.login=function(o,i){console.log("login",o);var s={remember:!0},u={username:o,password:i};return t.login("custom",s,u).then(function(){return console.log("login is ok, ask custom auth server to refresh the user data"),n({method:"POST",url:a.apiBase+"externalLogin/refreshUserExternal",data:{externalId:o}})}).then(function(){return console.log("refreshing custom auth server is ok, ask the backend for the updated user info"),e.$broadcast("ionicuser-new"),r.resetPrincipal()}).then(function(){console.log("user is logged in in both ionic and backend")})},o.logout=function(){console.log("logout"),t.logout(),r.deletePrincipal()},o}]),angular.module("adama-mobile").factory("binaryFileService",["$http","$q","adamaConstant",function(e,n,t){var a={};return a.initUrlForBinaryFiles=function(a){var r=[],o=[];return angular.forEach(a,function(e){e&&e.id&&!e.url&&(r.push(e),o.push(e.id))}),o.length?e({method:"PUT",url:t.apiBase+"files",data:angular.toJson(o)}).then(function(e){angular.forEach(r,function(n){n.url=e.data.urlList[n.id]})}):n.when()},a}]),angular.module("adama-mobile").provider("language",function(){var e=["en","fr"],n=[{code:"en",labelKey:"FLAG_EN",cssCLass:"us"},{code:"fr",labelKey:"FLAG_FR",cssCLass:"fr"}];this.setLanguages=function(n){e=n},this.setSelectorData=function(e){n=e},this.$get=["$q","$http","$translate",function(t,a,r){var o={};return o.getCurrent=function(){var e=r.storage().get("NG_TRANSLATE_LANG_KEY");return angular.isUndefined(e)&&(e="en"),t.when(e)},o.getAll=function(){return t.when(e)},o.getSelectorData=function(){return t.when(n)},o}]}),angular.module("adama-mobile").factory("pageTitle",["$rootScope","$filter",function(e,n){var t=n("translate"),a={};return a.set=function(n,a){var r=t(n,a);e.pageTitle=r},a}]),angular.module("adama-mobile").service("ParseLinks",function(){this.parse=function(e){if(0===e.length)throw new Error("input must not be of zero length");var n=e.split(","),t={};return angular.forEach(n,function(e){var n=e.split(";");if(2!==n.length)throw new Error('section could not be split on ";"');var a=n[0].replace(/<(.*)>/,"$1").trim(),r={};a.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"),function(e,n,t,a){r[n]=a});var o=r.page;angular.isString(o)&&(o=parseInt(o));var i=n[1].replace(/rel='(.*)'/,"$1").trim();t[i]=o}),t}}),angular.module("adama-mobile").factory("principalService",["$rootScope","$q","$http","$resource","$state","$ionicUser","adamaConstant",function(e,n,t,a,r,o,i){var s,u={},c=o.current(),l=c.isAuthenticated(),d=a(i.apiBase+"account",{},{}),g=a(i.apiBase+"account/change_password",{},{}),m=a(i.apiBase+"account/reset_password/init",{},{});return u.isAuthenticated=function(){return l},u.resetPrincipal=function(){var a;if(c=o.current(),l=c.isAuthenticated(),console.log("resetPrincipal"),console.log("resetPrincipal ionicUser",c),console.log("resetPrincipal isAuthenticated",l),l){var u=c.details.external_id;u?(s=t({method:"GET",url:i.apiBase+"users/byLogin/"+u}).then(function(n){var t=n.data;return l=!0,e.$broadcast("principal-new",{principal:t}),t}),a=s):(console.error("no external_id, redirect to signin"),a=n.reject("resetPrincipal : no external_id"))}else console.error("user is not authenticated"),a=n.reject("resetPrincipal : not authenticated");return a["catch"](function(e){return console.log("there was a problem while reseting user info, redirect to signin"),l=!1,s=void 0,r.go("auth.signin"),n.reject(e)})},u.getPrincipal=function(){return s?s:u.resetPrincipal()},u.deletePrincipal=function(){l=!1,s=void 0,e.$broadcast("principal-remove")},u.hasAnyAuthority=function(e){return console.log("hasAnyAuthority",e),!0},u.resetPasswordInit=function(e){return console.log("resetPasswordInit",e),m.save({mail:e,urlResetPassword:i.urlResetPassword}).$promise},u.updateAccount=function(t){return console.log("updateAccount",t),d.save(t,function(){e.$emit("principal-update",{principal:t}),s=n.when(t)}).$promise},u.changePassword=function(e){return console.log("changePassword"),g.save({password:e}).$promise},u}]);
//# sourceMappingURL=adama-mobile-min.js.map

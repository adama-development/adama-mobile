"use strict";angular.module("adama-mobile",["ionic","ionic.service.core","ionic.service.auth","ionic.service.deploy","ionic.service.push","pascalprecht.translate","ngCookies","ngResource","LocalStorageModule","ngCordova","angular-jwt","angular-logger","ngMessages"]),angular.module("adama-mobile").run(["$ionicPlatform",function(e){e.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()})}]),angular.module("adama-mobile").config(["$urlRouterProvider",function(e){e.otherwise(function(e){var a=e.get("$state");a.go("app.main")})}]),angular.module("adama-mobile").config(["$translateProvider",function(e){e.useSanitizeValueStrategy("escapeParameters"),e.useLocalStorage(),e.registerAvailableLanguageKeys(["en","fr"],{"en_*":"en","fr_*":"fr"}),e.determinePreferredLanguage().fallbackLanguage("en")}]),angular.module("adama-mobile").config(["$stateProvider","adamaConstant",function(e,a){e.state("app",{abstract:!0,url:"/app",templateUrl:function(){return a.adamaMobileToolkitTemplateUrl.app}})}]),angular.module("adama-mobile").run(["$rootScope","pageTitle",function(e,a){e.$on("$stateChangeSuccess",function(e,t){t&&t.data&&t.data.pageTitle&&a.set(t.data.pageTitle)})}]),angular.module("adama-mobile").config(["$httpProvider",function(e){e.interceptors.push("authExpiredInterceptor"),e.interceptors.push("authInterceptor")}]),angular.module("adama-mobile").run(["$rootScope","$state","principalService",function(e,a,t){e.$on("$stateChangeStart",function(e,r){r.data&&r.data.authorities&&r.data.authorities.length>0&&(t.isAuthenticated()?t.hasAnyAuthority(r.data.authorities)||a.go("auth.accessDenied"):a.go("auth.signin"))})}]),angular.module("adama-mobile").run(["$rootScope",function(e){e.$on("$stateChangeError",function(e,a,t,r,n,o){throw o})}]),angular.module("adama-mobile").run(["$rootScope","$injector","adamaConstant",function(e,a,t){var r,n;t.enableBadge&&(r=a.get("$ionicPlatform"),n=a.get("$cordovaBadge"),r.on("resume",function(){n.clear()}),r.ready(function(){n.clear()}))}]),angular.module("adama-mobile").config(["logEnhancerProvider",function(e){e.prefixPattern="%s::[%s]>",e.datetimePattern="DD/MM/YYYY HH:mm:ss",e.logLevels={"*":e.LEVEL.OFF}}]),angular.module("adama-mobile").controller("AccessDeniedCtrl",function(){}),angular.module("adama-mobile").config(["$stateProvider","adamaConstant",function(e,a){e.state("auth",{abstract:!0,url:"/auth",template:"<ui-view></ui-view>"}),e.state("auth.signin",{url:"/",templateUrl:function(){return a.adamaMobileToolkitTemplateUrl.authSignin},controller:"SigninCtrl",controllerAs:"$ctrl",data:{pageTitle:"SIGNIN",authorities:[]}}),e.state("auth.recoverPassword",{url:"/recoverPassword",templateUrl:function(){return a.adamaMobileToolkitTemplateUrl.authRecover},controller:"RecoverPasswordCtrl",controllerAs:"$ctrl",data:{pageTitle:"RECOVER",authorities:[]}}),e.state("auth.accessDenied",{url:"/accessDenied",templateUrl:function(){return a.adamaMobileToolkitTemplateUrl.authAccessDenied},controller:"AccessDeniedCtrl",controllerAs:"$ctrl",data:{pageTitle:"ACCESS_DENIED",authorities:[]}})}]),angular.module("adama-mobile").config(["$translateProvider",function(e){e.translations("fr",{SIGNIN:"Identification",SIGNIN_INTRO:"Identifiez-vous pour démarrer votre session",SIGNIN_FORGET_PASSWORD:"J'ai oublié mon mot de passe ...",SIGNIN_USERNAME:"Identifiant",SIGNIN_USERNAME_REQUIRED:"L'identifiant est obligatoire",SIGNIN_PASSWORD:"Mot de passe",SIGNIN_PASSWORD_REQUIRED:"Le mot de passe est obligatoire",SIGNIN_SUBMIT:"Démarrer la session",SIGNIN_LOADING:"Données en cours de chargement",SIGNIN_ERROR_TITLE:"Erreur d'authentification",SIGNIN_ERROR_MESSAGE:"Identifiant ou mot de passe incorrect.",RECOVER:"Récupération de mot de passe",RECOVER_INTRO:"Saisissez votre email pour récupérer votre mot de passe",RECOVER_MAIL:"Email",RECOVER_MAIL_REQUIRED:"L'email est obligatoire",RECOVER_MAIL_EMAIL:"L'email n'est pas au bon format",RECOVER_SUBMIT:"Récupérer mon mot de passe",RECOVER_BACK_TO_LOGIN:"Retour à l'identificaition",RECOVER_SUCCESS:"Consultez votre email pour connaître comment réinitialiser votre mot de passe.",RECOVER_ERROR_TITLE:"Erreur",RECOVER_ERROR_GENERIC:"Erreur lors de la récupération du mot de passe.",RECOVER_ERROR_EMAIL_NOT_EXIST:"L'email n'existe pas",ACCESS_DENIED_BACK_TO_HOME:"Retour à l'accueil",ACCESS_DENIED:"Accès interdit",ACCESS_DENIED_INTRO:"Vous n'avez pas suffisamment de droits d'accéder à cette page."}),e.translations("en",{SIGNIN:"Signin",SIGNIN_INTRO:"Sign in to start your session",SIGNIN_FORGET_PASSWORD:"I forgot my password ...",SIGNIN_USERNAME:"Username",SIGNIN_USERNAME_REQUIRED:"Username is required",SIGNIN_PASSWORD:"Password",SIGNIN_PASSWORD_REQUIRED:"Password is required",SIGNIN_SUBMIT:"Start session",SIGNIN_LOADING:"Loading user informations",SIGNIN_ERROR_TITLE:"Authentication error",SIGNIN_ERROR_MESSAGE:"Username or password are incorrect.",RECOVER:"Recover password",RECOVER_INTRO:"Set your email to recover your password",RECOVER_MAIL:"Email",RECOVER_MAIL_REQUIRED:"Email is required",RECOVER_MAIL_EMAIL:"Email does not respect the right format",RECOVER_SUBMIT:"Retrieve my password",RECOVER_BACK_TO_LOGIN:"Back to signin",RECOVER_SUCCESS:"Check your e-mails for details on how to reset your password.",RECOVER_ERROR_TITLE:"Error",RECOVER_ERROR_GENERIC:"Recovering error.",RECOVER_ERROR_EMAIL_NOT_EXIST:"E-Mail address isn't registered! Please check and try again",ACCESS_DENIED_BACK_TO_HOME:"Back to home",ACCESS_DENIED:"Access denied",ACCESS_DENIED_INTRO:"You do not have enough privileges to access this page."})}]),angular.module("adama-mobile").controller("RecoverPasswordCtrl",["$filter","$ionicPopup","principalService",function(e,a,t){var r=this;r.recover=function(n){r.recoverSuccess=!1,r.recoverError=!1,r.errorEmailNotExists=!1,r.loading=!0,t.resetPasswordInit(n).then(function(){r.recoverSuccess=!0}).catch(function(t){var r="RECOVER_ERROR_GENERIC";400===t.status&&"e-mail address not registered"===t.data&&(r="RECOVER_ERROR_EMAIL_NOT_EXIST");var n=e("translate");a.alert({title:n("RECOVER_ERROR_TITLE"),template:n(r)})}).finally(function(){r.loading=!1})}}]),angular.module("adama-mobile").controller("SigninCtrl",["$rootScope","$state","$log","authService","$filter","$ionicPopup",function(e,a,t,r,n,o){var i=t.getInstance("adama-mobile.auth.signin"),s=this;s.loading=!1,s.signin=function(e,t){s.loading=!0,r.login(e,t).then(function(){i.debug("user is logged, rediret to app.main"),a.go("app.main"),s.loading=!1}).catch(function(e){i.info("error while signing in",e),s.rejection=e;var a=n("translate");o.alert({title:a("SIGNIN_ERROR_TITLE"),template:a("SIGNIN_ERROR_MESSAGE")}),s.loading=!1})}}]),angular.module("adama-mobile").factory("authExpiredInterceptor",["$injector","$q","$log","adamaConstant",function(e,a,t,r){var n=function(){var a;return function(){return a||(a=e.get("$http"))}}(),o=function(){var a;return function(){return a||(a=e.get("adamaTokenService"))}}(),i=function(){var a;return function(){return a||(a=e.get("$state"))}}();return{responseError:function(e){var s=e.config;if(401===e.status&&0===s.url.indexOf(r.apiBase)){var u=t.getInstance("adama-mobile.interceptors.authExpiredInterceptor");return u.debug("error 401, refresh token",s.url),o().refreshAndGetToken().then(function(){return u.debug("token is refresh, reset Authorization header"),s.headers.Authorization=void 0,n()(s)},function(e){return i().go("auth.signin").then(function(){return u.debug("error while getting user token",e),a.reject(e)})})}return a.reject(e)}}}]),angular.module("adama-mobile").factory("authInterceptor",["$injector","$q","$log","adamaConstant",function(e,a,t,r){var n=function(){var a;return function(){return a||(a=e.get("adamaTokenService"))}}(),o=function(){var a;return function(){return a||(a=e.get("$state"))}}();return{request:function(e){var i=t.getInstance("adama-mobile.interceptors.authInterceptor");return i.debug("url",e.url),e.headers=e.headers||{},e.headers.Authorization||0!==e.url.indexOf(r.apiBase)?e:(i.debug("need authorization, getting token"),n().getToken().then(function(a){return i.debug("adding Authorization header",a),a&&(e.headers.Authorization="Bearer "+a),e},function(e){return o().go("auth.signin").then(function(){return i.debug("error while getting user token",e),a.reject(e)})}))}}}]),angular.module("adama-mobile").directive("dsBinaryFileUrl",["$parse","binaryFileService",function(e,a){return{scope:!1,link:function(t,r,n){var o=function(r){n.output&&(r=angular.copy(r)),angular.isArray(r)||(r=[r]),a.initUrlForBinaryFiles(r).then(function(){n.output&&e(n.output).assign(t,r)})};t.$watch(n.input,function(){var a=e(n.input)(t);a&&o(a)})}}}]),angular.module("adama-mobile").directive("dsLanguage",["$parse","language",function(e,a){return{scope:!1,link:function(t,r,n){a.getAll().then(function(a){e(n.data).assign(t,a)})}}}]),angular.module("adama-mobile").directive("dsPrincipalIdentity",["$rootScope","$parse","principalService",function(e,a,t){return{scope:!1,link:function(r,n,o){e.$on("principal-new",function(e,t){a(o.data).assign(r,t.principal)}),e.$on("principal-remove",function(){a(o.data).assign(r,void 0)}),t.getPrincipal().then(function(e){a(o.data).assign(r,e)})}}}]),angular.module("adama-mobile").config(["$translateProvider",function(e){e.translations("fr",{BTN_SIGNOUT:"Déconnexion"}),e.translations("en",{BTN_SIGNOUT:"Sign out"})}]),angular.module("adama-mobile").component("btnSignout",{templateUrl:"adama-mobile/btn-signout/btn-signout.html",bindings:{additionalClass:"@"},controller:["authService","$state",function(e,a){var t=this;t.signout=function(){e.logout(),a.go("auth.signin")}}]}),angular.module("adama-mobile").factory("User",["$resource","adamaConstant","adamaResourceConfig",function(e,a,t){var r=angular.extend({},t,{delete:{method:"DELETE",params:{id:"@id"}}});return e(a.apiBase+"users/:id",{},r)}]),angular.module("adama-mobile").factory("adamaResourceConfig",["ParseLinks",function(e){return{query:{method:"GET",isArray:!0,transformResponse:function(a,t,r){return a=angular.fromJson(a),200===r&&(a.$metadata={links:e.parse(t("link")),totalItems:t("X-Total-Count")}),a},interceptor:{response:function(e){return e.resource.$metadata=e.data.$metadata,e.resource}}},get:{method:"GET"},save:{method:"POST"},update:{method:"PUT"},delete:{method:"DELETE",params:{id:"@id"}}}}]),angular.module("adama-mobile").factory("adamaTokenService",["$rootScope","$http","$q","$state","localStorageService","$log","jwtHelper","adamaConstant",function(e,a,t,r,n,o,i,s){var u=o.getInstance("adama-mobile.services.adamaTokenService"),c={};return c.getToken=function(){u.debug("getToken");var e=n.get("access_token");return e&&(u.debug("adamaTokenService.getToken user is authenticated"),e&&i.isTokenExpired(e))?(u.debug("adamaTokenService.getToken token is expired"),c.refreshAndGetToken()):t.when(e)},c.refreshAndGetToken=function(){u.debug("adamaTokenService.refreshAndGetToken");var e=n.get("access_token");if(!e)return u.info("no token, redirect to signin"),t.reject("refreshAndGetToken : no token !!!!");u.debug("adamaTokenService.refreshAndGetToken token",e);var r=n.get("refresh_token");return u.debug("adamaTokenService.refreshAndGetToken refreshToken",r),a({method:"POST",url:s.apiBase+"login/refresh",headers:{Authorization:"Bearer "+e},data:{refresh_token:r}}).then(function(e){var a=e.data.access_token;return u.debug("adamaTokenService.refreshAndGetToken newToken",a),n.set("access_token",a),a},function(e){return u.info("error while refreshing user token, redirect to signin",e),t.reject(e)})},c}]),angular.module("adama-mobile").constant("adamaConstant",{apiBase:"http://localhost:13337/",adamaMobileToolkitTemplateUrl:{app:"adama-mobile/app.html",authAccessDenied:"adama-mobile/auth/accessDenied.html",authSignin:"adama-mobile/auth/signin.html",authRecover:"adama-mobile/auth/recoverPassword.html"},enableBadge:!1,enablePush:!1,urlResetPassword:"path/to/reset/password?origin=mobile"}),angular.module("adama-mobile").factory("authService",["$rootScope","$http","localStorageService","$log","adamaConstant","principalService",function(e,a,t,r,n,o){var i=r.getInstance("adama-mobile.services.authService"),s={};return s.login=function(e,r){i.debug("login",e);var o={username:e,password:r};return a({method:"POST",url:n.apiBase+"login/authenticate",data:o}).then(function(a){i.debug("User is authenticated"),t.set("access_token",a.data.access_token),t.set("refresh_token",a.data.refresh_token),t.set("external_id",e)})},s.logout=function(){i.debug("logout"),t.set("access_token",void 0),t.set("refresh_token",void 0),t.set("external_id",void 0),o.deletePrincipal()},s}]),angular.module("adama-mobile").factory("binaryFileService",["$http","$q","adamaConstant",function(e,a,t){var r={};return r.initUrlForBinaryFiles=function(r){var n=[],o=[];return angular.forEach(r,function(e){e&&e.id&&!e.url&&(n.push(e),o.push(e.id))}),o.length?e({method:"PUT",url:t.apiBase+"files",data:angular.toJson(o)}).then(function(e){angular.forEach(n,function(a){a.url=e.data.urlList[a.id]})}):a.when()},r}]),angular.module("adama-mobile").provider("language",function(){var e=["en","fr"],a=[{code:"en",labelKey:"FLAG_EN",cssCLass:"us"},{code:"fr",labelKey:"FLAG_FR",cssCLass:"fr"}];this.setLanguages=function(a){e=a},this.setSelectorData=function(e){a=e},this.$get=["$q","$http","$translate",function(t,r,n){var o={};return o.getCurrent=function(){var e=n.storage().get("NG_TRANSLATE_LANG_KEY");return angular.isUndefined(e)&&(e="en"),t.when(e)},o.getAll=function(){return t.when(e)},o.getSelectorData=function(){return t.when(a)},o}]}),angular.module("adama-mobile").factory("loadingService",["$filter","$ionicLoading",function(e,a){var t={},r=e("translate");return t.blockUiWhileResolving=function(e,t){return 0===t.$$state.status&&a.show({template:r(e)}),t.finally(function(){a.hide()})},t}]),angular.module("adama-mobile").factory("notificationsService",["$filter","$cordovaToast","$log",function(e,a,t){var r=t.getInstance("adama-mobile.services.notificationsService"),n={},o=e("translate");return n.show=function(e){return r.debug("show",e),a.show(o(e),"short","bottom")},n}]),angular.module("adama-mobile").factory("pageTitle",["$rootScope","$filter",function(e,a){var t=a("translate"),r={};return r.set=function(a,r){var n=t(a,r);e.pageTitle=n},r}]),angular.module("adama-mobile").service("ParseLinks",function(){this.parse=function(e){if(0===e.length)throw new Error("input must not be of zero length");var a=e.split(","),t={};return angular.forEach(a,function(e){var a=e.split(";");if(2!==a.length)throw new Error('section could not be split on ";"');var r=a[0].replace(/<(.*)>/,"$1").trim(),n={};r.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"),function(e,a,t,r){n[a]=r});var o=n.page;angular.isString(o)&&(o=parseInt(o));var i=a[1].replace(/rel='(.*)'/,"$1").trim();t[i]=o}),t}}),angular.module("adama-mobile").factory("principalService",["$rootScope","$q","$http","$resource","$state","localStorageService","$log","adamaConstant",function(e,a,t,r,n,o,i,s){var u,c=i.getInstance("adama-mobile.services.principalService"),l={},d=!!o.get("access_token"),g=r(s.apiBase+"account",{},{}),m=r(s.apiBase+"account/change_password",{},{}),f=r(s.apiBase+"account/reset_password/init",{},{});return l.isAuthenticated=function(){return d},l.resetPrincipal=function(){var r;if(d=!!o.get("access_token"),c.debug("resetPrincipal"),c.debug("resetPrincipal isAuthenticated",d),d){var i=o.get("external_id");i?(u=t({method:"GET",url:s.apiBase+"users/byLogin/"+i}).then(function(a){var t=a.data;return d=!0,e.$broadcast("principal-new",{principal:t}),t}),r=u):(c.info("no external_id, redirect to signin"),r=a.reject("resetPrincipal : no external_id"))}else c.info("user is not authenticated"),r=a.reject("resetPrincipal : not authenticated");return r.catch(function(e){return c.debug("there was a problem while reseting user info, redirect to signin"),d=!1,u=void 0,n.go("auth.signin"),a.reject(e)})},l.getPrincipal=function(){return u?u:l.resetPrincipal()},l.deletePrincipal=function(){d=!1,u=void 0,e.$broadcast("principal-remove")},l.hasAnyAuthority=function(e){return c.debug("hasAnyAuthority",e),!0},l.resetPasswordInit=function(e){return c.debug("resetPasswordInit",e),f.save({mail:e,urlResetPassword:s.urlResetPassword}).$promise},l.updateAccount=function(t){return c.debug("updateAccount",t),g.save(t,function(){e.$emit("principal-update",{principal:t}),u=a.when(t)}).$promise},l.changePassword=function(e){return c.debug("changePassword"),m.save({password:e}).$promise},l}]);
//# sourceMappingURL=adama-mobile-min.js.map

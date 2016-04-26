"use strict";angular.module("adama-mobile",["ionic","ionic.service.core","ionic.service.auth","ionic.service.deploy","ionic.service.push","pascalprecht.translate","ngCookies","ngResource","LocalStorageModule","ngCordova","ngMessages"]),angular.module("adama-mobile").run(["$ionicPlatform",function(e){e.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()})}]),angular.module("adama-mobile").config(["$urlRouterProvider",function(e){e.otherwise("/app/")}]),angular.module("adama-mobile").config(["$translateProvider",function(e){e.useSanitizeValueStrategy("escapeParameters"),e.useLocalStorage(),e.registerAvailableLanguageKeys(["en","fr"],{"en_*":"en","fr_*":"fr"}),e.determinePreferredLanguage().fallbackLanguage("en")}]),angular.module("adama-mobile").config(["$stateProvider","jHipsterConstant",function(e,t){e.state("app",{"abstract":!0,url:"/app",templateUrl:function(){return t.adamaMobileToolkitTemplateUrl.app},resolve:{authorize:["Auth",function(e){return e.authorize()}]}})}]),angular.module("adama-mobile").run(["$rootScope","pageTitle",function(e,t){e.$on("$stateChangeSuccess",function(e,a){a&&a.data&&a.data.pageTitle&&t.set(a.data.pageTitle)})}]),angular.module("adama-mobile").run(["$rootScope",function(e){e.$on("$stateChangeError",function(e,t,a,r,n,o){throw o})}]),angular.module("adama-mobile").controller("AccessDeniedCtrl",function(){}),angular.module("adama-mobile").config(["$stateProvider","jHipsterConstant",function(e,t){e.state("auth",{"abstract":!0,url:"/auth",template:"<ui-view></ui-view>"}),e.state("auth.signin",{url:"/",templateUrl:function(){return t.adamaMobileToolkitTemplateUrl.authSignin},controller:"SigninCtrl",controllerAs:"ctrl",data:{pageTitle:"SIGNIN",authorities:[]}}),e.state("auth.recoverPassword",{url:"/recoverPassword",templateUrl:function(){return t.adamaMobileToolkitTemplateUrl.authRecover},controller:"RecoverPasswordCtrl",controllerAs:"ctrl",data:{pageTitle:"RECOVER",authorities:[]}}),e.state("auth.accessDenied",{url:"/accessDenied",templateUrl:function(){return t.adamaMobileToolkitTemplateUrl.authAccessDenied},controller:"AccessDeniedCtrl",controllerAs:"ctrl",data:{pageTitle:"ACCESS_DENIED",authorities:[]}})}]),angular.module("adama-mobile").config(["$translateProvider",function(e){e.translations("fr",{SIGNIN:"Identification",SIGNIN_INTRO:"Identifiez-vous pour démarrer votre session",SIGNIN_FORGET_PASSWORD:"J'ai oublié mon mot de passe ...",SIGNIN_USERNAME:"Identifiant",SIGNIN_USERNAME_REQUIRED:"L'identifiant est obligatoire",SIGNIN_PASSWORD:"Mot de passe",SIGNIN_PASSWORD_REQUIRED:"Le mot de passe est obligatoire",SIGNIN_SUBMIT:"Démarrer la session",SIGNIN_ERROR_TITLE:"Erreur d'authentification",SIGNIN_ERROR_MESSAGE:"Identifiant ou mot de passe incorrect.",RECOVER:"Récupération de mot de passe",RECOVER_INTRO:"Saisissez votre email pour récupérer votre mot de passe",RECOVER_MAIL:"Email",RECOVER_MAIL_REQUIRED:"L'email est obligatoire",RECOVER_MAIL_EMAIL:"L'email n'est pas au bon format",RECOVER_SUBMIT:"Récupérer mon mot de passe",RECOVER_BACK_TO_LOGIN:"Retour à l'identificaition",RECOVER_SUCCESS:"Consultez votre email pour connaître comment réinitialiser votre mot de passe.",RECOVER_ERROR_TITLE:"Erreur",RECOVER_ERROR_GENERIC:"Erreur lors de la récupération du mot de passe.",RECOVER_ERROR_EMAIL_NOT_EXIST:"L'email n'existe pas",ACCESS_DENIED_BACK_TO_HOME:"Retour à l'accueil",ACCESS_DENIED:"Accès interdit",ACCESS_DENIED_INTRO:"Vous n'avez pas suffisamment de droits d'accéder à cette page."}),e.translations("en",{SIGNIN:"Signin",SIGNIN_INTRO:"Sign in to start your session",SIGNIN_FORGET_PASSWORD:"I forgot my password ...",SIGNIN_USERNAME:"Username",SIGNIN_USERNAME_REQUIRED:"Username is required",SIGNIN_PASSWORD:"Password",SIGNIN_PASSWORD_REQUIRED:"Password is required",SIGNIN_SUBMIT:"Start session",SIGNIN_ERROR_TITLE:"Authentication error",SIGNIN_ERROR_MESSAGE:"Username or password are incorrect.",RECOVER:"Recover password",RECOVER_INTRO:"Set your email to recover your password",RECOVER_MAIL:"Email",RECOVER_MAIL_REQUIRED:"Email is required",RECOVER_MAIL_EMAIL:"Email does not respect the right format",RECOVER_SUBMIT:"Retrieve my password",RECOVER_BACK_TO_LOGIN:"Back to signin",RECOVER_SUCCESS:"Check your e-mails for details on how to reset your password.",RECOVER_ERROR_TITLE:"Error",RECOVER_ERROR_GENERIC:"Recovering error.",RECOVER_ERROR_EMAIL_NOT_EXIST:"E-Mail address isn't registered! Please check and try again",ACCESS_DENIED_BACK_TO_HOME:"Back to home",ACCESS_DENIED:"Access denied",ACCESS_DENIED_INTRO:"You do not have enough privileges to access this page."})}]),angular.module("adama-mobile").controller("RecoverPasswordCtrl",["$filter","$ionicPopup","Auth",function(e,t,a){var r=this;r.recover=function(n){r.recoverSuccess=!1,r.recoverError=!1,r.errorEmailNotExists=!1,r.loading=!0,a.resetPasswordInit(n).then(function(){r.recoverSuccess=!0})["catch"](function(a){var r="RECOVER_ERROR_GENERIC";400===a.status&&"e-mail address not registered"===a.data&&(r="RECOVER_ERROR_EMAIL_NOT_EXIST");var n=e("translate");t.alert({title:n("RECOVER_ERROR_TITLE"),template:n(r)})})["finally"](function(){r.loading=!1})}}]),angular.module("adama-mobile").controller("SigninCtrl",["$rootScope","$state","Auth","$filter","$ionicPopup",function(e,t,a,r,n){var o=this;o.signin=function(e,o){a.login({username:e,password:o}).then(function(){t.go("app.main")})["catch"](function(){var e=r("translate");n.alert({title:e("SIGNIN_ERROR_TITLE"),template:e("SIGNIN_ERROR_MESSAGE")})})}}]),angular.module("adama-mobile").config(["$translateProvider",function(e){e.translations("fr",{BTN_SIGNOUT:"Déconnexion"}),e.translations("en",{BTN_SIGNOUT:"Sign out"})}]),angular.module("adama-mobile").component("btnSignout",{templateUrl:"adama-mobile/btn-signout/btn-signout.html",controller:["Auth","$state",function(e,t){var a=this;a.signout=function(){e.logout(),t.go("auth.signin")}}]}),angular.module("adama-mobile").directive("dsBinaryFileUrl",["$parse","binaryFileService",function(e,t){return{scope:!1,link:function(a,r,n){var o=function(r){n.output&&(r=angular.copy(r)),angular.isArray(r)||(r=[r]),t.initUrlForBinaryFiles(r).then(function(){n.output&&e(n.output).assign(a,r)})};a.$watch(n.input,function(){var t=e(n.input)(a);t&&o(t)})}}}]),angular.module("adama-mobile").directive("dsLanguage",["$parse","language",function(e,t){return{scope:!1,link:function(a,r,n){t.getAll().then(function(t){e(n.data).assign(a,t)})}}}]),angular.module("adama-mobile").directive("dsPrincipalIdentity",["$parse","Principal",function(e,t){return{scope:!1,link:function(a,r,n){t.identity().then(function(t){e(n.data).assign(a,t)})}}}]),angular.module("adama-mobile").run(["$rootScope","$state","Principal","Auth",function(e,t,a,r){e.$on("$stateChangeStart",function(t,n,o){e.toState=n,e.toStateParams=o,a.isIdentityResolved()&&r.authorize()})}]),angular.module("adama-mobile").config(["$httpProvider",function(e){e.interceptors.push("authExpiredInterceptor"),e.interceptors.push("authInterceptor")}]),angular.module("adama-mobile").constant("jHipsterConstant",{apiBase:"http://localhost:13337/",appModule:"mySuperApp",adamaMobileToolkitTemplateUrl:{app:"adama-mobile/app.html",authAccessDenied:"adama-mobile/auth/accessDenied.html",authSignin:"adama-mobile/auth/signin.html",authRecover:"adama-mobile/auth/recoverPassword.html"}}),angular.module("adama-mobile").factory("jHipsterResourceConfig",["ParseLinks",function(e){return{query:{method:"GET",isArray:!0,transformResponse:function(t,a,r){return t=angular.fromJson(t),200===r&&(t.$metadata={links:e.parse(a("link")),totalItems:a("X-Total-Count")}),t},interceptor:{response:function(e){return e.resource.$metadata=e.data.$metadata,e.resource}}},get:{method:"GET"},save:{method:"POST"},update:{method:"PUT"},"delete":{method:"DELETE",params:{id:"@id"}}}}]),angular.module("adama-mobile").factory("User",["$resource","jHipsterConstant","jHipsterResourceConfig",function(e,t,a){var r=angular.extend({},a,{"delete":{method:"DELETE",params:{login:"@login"}}});return e(t.apiBase+"api/users/:login",{},r)}]),angular.module("adama-mobile").factory("binaryFileService",["$http","$q","jHipsterConstant",function(e,t,a){var r={};return r.initUrlForBinaryFiles=function(r){var n=[],o=[];return angular.forEach(r,function(e){e&&e.id&&!e.url&&(n.push(e),o.push(e.id))}),o.length?e({method:"GET",url:a.apiBase+"api/binaryFiles",data:{ids:o}}).then(function(e){angular.forEach(n,function(t){t.url=e.data[t.id]})}):t.when()},r}]),angular.module("adama-mobile").provider("language",function(){var e=["en","fr"],t=[{code:"en",labelKey:"FLAG_EN",cssCLass:"us"},{code:"fr",labelKey:"FLAG_FR",cssCLass:"fr"}];this.setLanguages=function(t){e=t},this.setSelectorData=function(e){t=e},this.$get=["$q","$http","$translate",function(a,r,n){var o={};return o.getCurrent=function(){var e=n.storage().get("NG_TRANSLATE_LANG_KEY");return angular.isUndefined(e)&&(e="en"),a.when(e)},o.getAll=function(){return a.when(e)},o.getSelectorData=function(){return a.when(t)},o}]}),angular.module("adama-mobile").factory("pageTitle",["$rootScope","$filter",function(e,t){var a=t("translate"),r={};return r.set=function(t){var r=a(t);e.pageTitle=r},r}]),angular.module("adama-mobile").directive("jhAlert",["AlertService",function(e){return{restrict:"E",template:'<div class="content-wrapper" ng-cloak ng-if="alerts && alerts.length"><div class="box-body"><div ng-repeat="alert in alerts" class="alert alert-dismissible" ng-class="\'alert-\' + alert.type"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>{{ alert.msg }}</div></div></div>',controller:["$scope",function(t){t.alerts=e.get(),t.$on("$destroy",function(){t.alerts=[]})}]}}]).directive("jhAlertError",["AlertService","$rootScope","$translate",function(e,t,a){return{restrict:"E",template:'<div class="alerts" ng-if="alerts && alerts.length"><div ng-repeat="alert in alerts" class="alert alert-dismissible" ng-class="\'alert-\' + alert.type"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>{{ alert.msg }}</div></div>',controller:["$scope","jHipsterConstant",function(r,n){r.alerts=[];var o=function(t,a,n){a=a&&null!==a?a:t,r.alerts.push(e.add({type:"danger",msg:a,params:n,timeout:5e3,toast:e.isToast(),scoped:!0},r.alerts))},i=t.$on(n.appModule+".httpError",function(e,t){var r;switch(e.stopPropagation(),t.status){case 0:o("Server not reachable","error.server.not.reachable");break;case 400:var i=t.headers("X-"+n.appModule+"-error"),s=t.headers("X-"+n.appModule+"-params");if(i){var u=a.instant("global.menu.entities."+s);o(i,i,{entityName:u})}else if(t.data&&t.data.fieldErrors)for(r=0;r<t.data.fieldErrors.length;r++){var l=t.data.fieldErrors[r],c=l.field.replace(/\[\d*\]/g,"[]"),d=a.instant(n.appModule+"."+l.objectName+"."+c);o("Field "+d+" cannot be empty","error."+l.message,{fieldName:d})}else t.data&&t.data.message?o(t.data.message,t.data.message,t.data):o(t.data);break;default:o(t.data&&t.data.message?t.data.message:JSON.stringify(t))}});r.$on("$destroy",function(){void 0!==i&&null!==i&&(i(),r.alerts=[])})}]}}]),angular.module("adama-mobile").provider("AlertService",function(){var e=!1;this.$get=["$timeout","$sce","$translate",function(t,a,r){var n=0,o=[],i=5e3,s=function(){return e},u=function(){o=[]},l=function(){return o},c=function(e,t){return t.splice(e,1)},d=function(e,t){var a=t?t:o;return c(a.map(function(e){return e.id}).indexOf(e),a)},m=function(e){var t={type:e.type,msg:a.trustAsHtml(e.msg),id:e.alertId,timeout:e.timeout,toast:e.toast,position:e.position?e.position:"top right",scoped:e.scoped,close:function(e){return d(this.id,e)}};return t.scoped||o.push(t),t},p=function(e,a){e.alertId=n++,e.msg=r.instant(e.msg,e.params);var o=m(e);return e.timeout&&e.timeout>0&&t(function(){d(e.alertId,a)},e.timeout),o},f=function(t,a,r){return p({type:"success",msg:t,params:a,timeout:i,toast:e,position:r})},g=function(t,a,r){return p({type:"danger",msg:t,params:a,timeout:i,toast:e,position:r})},h=function(t,a,r){return p({type:"warning",msg:t,params:a,timeout:i,toast:e,position:r})},E=function(t,a,r){return p({type:"info",msg:t,params:a,timeout:i,toast:e,position:r})};return{factory:m,isToast:s,add:p,closeAlert:d,closeAlertByIndex:c,clear:u,get:l,success:f,error:g,info:E,warning:h}}],this.showAsToast=function(t){e=t}}),angular.module("adama-mobile").factory("Auth",["$rootScope","$state","$q","$translate","Principal","AuthServerProvider","Account","Password","PasswordResetInit","PasswordResetFinish",function(e,t,a,r,n,o,i,s,u,l){return{login:function(e,t){var i=t||angular.noop,s=a.defer();return o.login(e).then(function(e){return n.identity(!0).then(function(t){r.use(t.langKey),s.resolve(e)}),i()})["catch"](function(e){return this.logout(),s.reject(e),i(e)}.bind(this)),s.promise},logout:function(){o.logout(),n.authenticate(null)},authorize:function(a){return n.identity(a).then(function(){var a=n.isAuthenticated();a&&e.toState.name&&"auth.signin"===e.toState.name&&t.go("app.main"),e.toState.data&&e.toState.data.authorities||a?e.toState.data&&e.toState.data.authorities&&e.toState.data.authorities.length>0&&!n.hasAnyAuthority(e.toState.data.authorities)&&(a?t.go("auth.accessDenied"):t.go("auth.signin")):t.go("auth.signin")})},updateAccount:function(t,a){var r=a||angular.noop;return i.save(t,function(){return e.$emit("auth.updateAccount",{account:t}),r(t)},function(e){return r(e)}.bind(this)).$promise},changePassword:function(e,t){var a=t||angular.noop;return s.save(e,function(){return a()},function(e){return a(e)}).$promise},resetPasswordInit:function(e,t){var a=t||angular.noop;return u.save(e,function(){return a()},function(e){return a(e)}).$promise},resetPasswordFinish:function(e,t){var a=t||angular.noop;return l.save(e,function(){return a()},function(e){return a(e)}).$promise}}}]),angular.module("adama-mobile").directive("hasAnyAuthority",["Principal",function(e){return{restrict:"A",link:function(t,a,r){var n=function(){a.removeClass("hidden")},o=function(){a.addClass("hidden")},i=r.hasAnyAuthority.replace(/\s+/g,"").split(","),s=function(t){var a;t&&n(),a=e.hasAnyAuthority(i),a?n():o()};i.length>0&&(s(!0),t.$watch(function(){return e.isAuthenticated()},function(){s(!0)}))}}}]).directive("hasAuthority",["Principal",function(e){return{restrict:"A",link:function(t,a,r){var n=function(){a.removeClass("hidden")},o=function(){a.addClass("hidden")},i=r.hasAuthority.replace(/\s+/g,""),s=function(t){t&&n(),e.hasAuthority(i).then(function(e){e?n():o()})};i.length>0&&(s(!0),t.$watch(function(){return e.isAuthenticated()},function(){s(!0)}))}}}]),angular.module("adama-mobile").factory("Principal",["$q","Account",function(e,t){var a,r=!1;return{isIdentityResolved:function(){return angular.isDefined(a)},isAuthenticated:function(){return r},hasAuthority:function(t){return r?this.identity().then(function(e){return e.authorities&&-1!==e.authorities.indexOf(t)},function(){return!1}):e.when(!1)},hasAnyAuthority:function(e){if(!r||!a||!a.authorities)return!1;for(var t=0;t<e.length;t++)if(-1!==a.authorities.indexOf(e[t]))return!0;return!1},authenticate:function(e){a=e,r=null!==e},identity:function(n){var o=e.defer();return n===!0&&(a=void 0),angular.isDefined(a)?(o.resolve(a),o.promise):(t.get().$promise.then(function(e){a=e.data,r=!0,o.resolve(a)})["catch"](function(){a=null,r=!1,o.resolve(a)}),o.promise)}}}]),angular.module("adama-mobile").factory("authInterceptor",["$rootScope","$q","$location","localStorageService",function(e,t,a,r){return{request:function(e){e.headers=e.headers||{};var t=r.get("token");return t&&t.expires&&t.expires>(new Date).getTime()&&(e.headers["x-auth-token"]=t.token),e}}}]).factory("authExpiredInterceptor",["$rootScope","$q","$injector","localStorageService",function(e,t,a,r){return{responseError:function(e){if(401===e.status&&("invalid_token"===e.data.error||"Unauthorized"===e.data.error)){r.remove("token");var n=a.get("Principal");if(n.isAuthenticated()){var o=a.get("Auth");o.authorize(!0)}}return t.reject(e)}}}]),angular.module("adama-mobile").factory("errorHandlerInterceptor",["$q","$rootScope","jHipsterConstant",function(e,t,a){return{responseError:function(r){return 401===r.status&&0===r.data.path.indexOf("/api/account")||t.$emit(a.appModule+".httpError",r),e.reject(r)}}}]),angular.module("adama-mobile").factory("notificationInterceptor",["$q","AlertService","jHipsterConstant",function(e,t,a){return{response:function(e){var r=e.headers("X-"+a.appModule+"-alert");return angular.isString(r)&&t.success(r,{param:e.headers("X-"+a.appModule+"-params")}),e}}}]),angular.module("adama-mobile").service("Base64",function(){var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";this.encode=function(t){for(var a,r,n,o,i,s="",u="",l="",c=0;c<t.length;)a=t.charCodeAt(c++),r=t.charCodeAt(c++),u=t.charCodeAt(c++),n=a>>2,o=(3&a)<<4|r>>4,i=(15&r)<<2|u>>6,l=63&u,isNaN(r)?i=l=64:isNaN(u)&&(l=64),s=s+e.charAt(n)+e.charAt(o)+e.charAt(i)+e.charAt(l),a=r=u="",n=o=i=l="";return s},this.decode=function(t){var a,r,n,o,i,s="",u="",l="",c=0;for(t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"");c<t.length;)n=e.indexOf(t.charAt(c++)),o=e.indexOf(t.charAt(c++)),i=e.indexOf(t.charAt(c++)),l=e.indexOf(t.charAt(c++)),a=n<<2|o>>4,r=(15&o)<<4|i>>2,u=(3&i)<<6|l,s+=String.fromCharCode(a),64!==i&&(s+=String.fromCharCode(r)),64!==l&&(s+=String.fromCharCode(u)),a=r=u="",n=o=i=l=""}}).factory("StorageService",["$window",function(e){return{get:function(t){return JSON.parse(e.localStorage.getItem(t))},save:function(t,a){e.localStorage.setItem(t,JSON.stringify(a))},remove:function(t){e.localStorage.removeItem(t)},clearAll:function(){e.localStorage.clear()}}}]),angular.module("adama-mobile").service("ParseLinks",function(){this.parse=function(e){if(0===e.length)throw new Error("input must not be of zero length");var t=e.split(","),a={};return angular.forEach(t,function(e){var t=e.split(";");if(2!==t.length)throw new Error('section could not be split on ";"');var r=t[0].replace(/<(.*)>/,"$1").trim(),n={};r.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"),function(e,t,a,r){n[t]=r});var o=n.page;angular.isString(o)&&(o=parseInt(o));var i=t[1].replace(/rel='(.*)'/,"$1").trim();a[i]=o}),a}}),angular.module("adama-mobile").factory("AuthServerProvider",["$http","localStorageService","Base64","jHipsterConstant",function(e,t,a,r){return{login:function(a){var n="username="+encodeURIComponent(a.username)+"&password="+encodeURIComponent(a.password);return e.post(r.apiBase+"api/authenticate",n,{headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"}}).success(function(e){return t.set("token",e),e})},logout:function(){t.clearAll()},getToken:function(){return t.get("token")},hasValidToken:function(){var e=this.getToken();return e&&e.expires&&e.expires>(new Date).getTime()}}}]),angular.module("adama-mobile").factory("Account",["$resource","jHipsterConstant",function(e,t){return e(t.apiBase+"api/account",{},{get:{method:"GET",params:{},isArray:!1,interceptor:{response:function(e){return e}}}})}]),angular.module("adama-mobile").factory("Password",["$resource","jHipsterConstant",function(e,t){return e(t.apiBase+"api/account/change_password",{},{})}]),angular.module("adama-mobile").factory("PasswordResetInit",["$resource","jHipsterConstant",function(e,t){return e(t.apiBase+"api/account/reset_password/init",{},{})}]),angular.module("adama-mobile").factory("PasswordResetFinish",["$resource","jHipsterConstant",function(e,t){return e(t.apiBase+"api/account/reset_password/finish",{},{})}]);
//# sourceMappingURL=adama-mobile-min.js.map

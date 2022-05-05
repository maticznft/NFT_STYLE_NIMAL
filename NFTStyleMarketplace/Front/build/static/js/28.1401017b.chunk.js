(this.webpackJsonpnftstyle=this.webpackJsonpnftstyle||[]).push([[28],{1325:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return u})),n.d(t,"c",(function(){return s})),n.d(t,"d",(function(){return d}));var r={},o={},i=function(e,t){o[e]=t},a=function(e){var t=function(t,n){Object.assign(this,n),this.name=e,this.message=t||e,this.stack=(new Error).stack};return t.prototype=new Error,r[e]=t,t};a("AccountNameRequired"),a("AccountNotSupported"),a("AmountRequired"),a("BluetoothRequired"),a("BtcUnmatchedApp"),a("CantOpenDevice"),a("CashAddrNotSupported"),a("CurrencyNotSupported"),a("DeviceAppVerifyNotSupported"),a("DeviceGenuineSocketEarlyClose"),a("DeviceNotGenuine"),a("DeviceOnDashboardExpected"),a("DeviceOnDashboardUnexpected"),a("DeviceInOSUExpected"),a("DeviceHalted"),a("DeviceNameInvalid"),a("DeviceSocketFail"),a("DeviceSocketNoBulkStatus"),a("DisconnectedDevice"),a("DisconnectedDeviceDuringOperation"),a("EnpointConfig"),a("EthAppPleaseEnableContractData"),a("FeeEstimationFailed"),a("FirmwareNotRecognized"),a("HardResetFail"),a("InvalidXRPTag"),a("InvalidAddress"),a("InvalidAddressBecauseDestinationIsAlsoSource"),a("LatestMCUInstalledError"),a("UnknownMCU"),a("LedgerAPIError"),a("LedgerAPIErrorWithMessage"),a("LedgerAPINotAvailable"),a("ManagerAppAlreadyInstalled"),a("ManagerAppRelyOnBTC"),a("ManagerAppDepInstallRequired"),a("ManagerAppDepUninstallRequired"),a("ManagerDeviceLocked"),a("ManagerFirmwareNotEnoughSpace"),a("ManagerNotEnoughSpace"),a("ManagerUninstallBTCDep"),a("NetworkDown"),a("NoAddressesFound"),a("NotEnoughBalance"),a("NotEnoughBalanceToDelegate"),a("NotEnoughBalanceInParentAccount"),a("NotEnoughSpendableBalance"),a("NotEnoughBalanceBecauseDestinationNotCreated"),a("NoAccessToCamera"),a("NotEnoughGas"),a("NotSupportedLegacyAddress"),a("GasLessThanEstimate"),a("PasswordsDontMatch"),a("PasswordIncorrect"),a("RecommendSubAccountsToEmpty"),a("RecommendUndelegation"),a("TimeoutTagged"),a("UnexpectedBootloader"),a("MCUNotGenuineToDashboard"),a("RecipientRequired"),a("UnavailableTezosOriginatedAccountReceive"),a("UnavailableTezosOriginatedAccountSend"),a("UpdateFetchFileFail"),a("UpdateIncorrectHash"),a("UpdateIncorrectSig"),a("UpdateYourApp"),a("UserRefusedDeviceNameChange"),a("UserRefusedAddress"),a("UserRefusedFirmwareUpdate"),a("UserRefusedAllowManager"),a("UserRefusedOnDevice"),a("TransportOpenUserCancelled"),a("TransportInterfaceNotAvailable");var s=a("TransportRaceCondition");a("TransportWebUSBGestureRequired"),a("DeviceShouldStayInApp"),a("WebsocketConnectionError"),a("WebsocketConnectionFailed"),a("WrongDeviceForAccount"),a("WrongAppForCurrency"),a("ETHAddressNonEIP"),a("CantScanQRCode"),a("FeeNotLoaded"),a("FeeRequired"),a("FeeTooHigh"),a("SyncError"),a("PairingFailed"),a("GenuineCheckFailed"),a("LedgerAPI4xx"),a("LedgerAPI5xx"),a("FirmwareOrAppUpdateRequired"),a("NoDBPathGiven"),a("DBWrongPassword"),a("DBNotReset");function u(e,t){this.name="TransportError",this.message=e,this.stack=(new Error).stack,this.id=t}u.prototype=new Error,i("TransportError",(function(e){return new u(e.message,e.id)}));var c={PIN_REMAINING_ATTEMPTS:25536,INCORRECT_LENGTH:26368,MISSING_CRITICAL_PARAMETER:26624,COMMAND_INCOMPATIBLE_FILE_STRUCTURE:27009,SECURITY_STATUS_NOT_SATISFIED:27010,CONDITIONS_OF_USE_NOT_SATISFIED:27013,INCORRECT_DATA:27264,NOT_ENOUGH_MEMORY_SPACE:27268,REFERENCED_DATA_NOT_FOUND:27272,FILE_ALREADY_EXISTS:27273,INCORRECT_P1_P2:27392,INS_NOT_SUPPORTED:27904,CLA_NOT_SUPPORTED:28160,TECHNICAL_PROBLEM:28416,OK:36864,MEMORY_PROBLEM:37440,NO_EF_SELECTED:37888,INVALID_OFFSET:37890,FILE_NOT_FOUND:37892,INCONSISTENT_FILE:37896,ALGORITHM_NOT_SUPPORTED:38020,INVALID_KCV:38021,CODE_NOT_INITIALIZED:38914,ACCESS_CONDITION_NOT_FULFILLED:38916,CONTRADICTION_SECRET_CODE_STATUS:38920,CONTRADICTION_INVALIDATION:38928,CODE_BLOCKED:38976,MAX_VALUE_REACHED:38992,GP_AUTH_FAILED:25344,LICENSING:28482,HALTED:28586};function d(e){this.name="TransportStatusError";var t=Object.keys(c).find((function(t){return c[t]===e}))||"UNKNOWN_ERROR",n=function(e){switch(e){case 26368:return"Incorrect length";case 26624:return"Missing critical parameter";case 27010:return"Security not satisfied (dongle locked or have invalid access rights)";case 27013:return"Condition of use not satisfied (denied by the user?)";case 27264:return"Invalid data received";case 27392:return"Invalid parameter received"}if(28416<=e&&e<=28671)return"Internal error, please report"}(e)||t,r=e.toString(16);this.message="Ledger device: "+n+" (0x"+r+")",this.stack=(new Error).stack,this.statusCode=e,this.statusText=t}d.prototype=new Error,i("TransportStatusError",(function(e){return new d(e.statusCode)}))},1373:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(156);function o(e){if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(e=Object(r.a)(e))){var t=0,n=function(){};return{s:n,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i,a=!0,s=!1;return{s:function(){o=e[Symbol.iterator]()},n:function(){var e=o.next();return a=e.done,e},e:function(e){s=!0,i=e},f:function(){try{a||null==o.return||o.return()}finally{if(s)throw i}}}}},1998:function(e,t,n){"use strict";n.r(t),function(e){n.d(t,"default",(function(){return _}));var r=n(1),o=n.n(r),i=n(3),a=n(6),s=n(5),u=n(168),c=n(12),d=n(13),p=n(1999),l=n(2002),f=n(2003),g=n(1325);function h(e,t,n){var r=new g.b(t,n);return r.originalError=e,r}var E=function(e){return e.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")};function v(t,n,r,o){var i=function(t,n){for(var r=e.alloc(t.length),o=0;o<t.length;o++)r[o]=t[o]^n[o%n.length];return r}(t,r),a=e.from("0000000000000000000000000000000000000000000000000000000000000000","hex"),s={version:"U2F_V2",keyHandle:E(i.toString("base64")),challenge:E(a.toString("base64")),appId:location.origin};return Object(f.a)("apdu","=> "+t.toString("hex")),Object(p.sign)(s,n/1e3).then((function(t){var n,r=t.signatureData;if("string"===typeof r){var i,a=e.from((n=r).replace(/-/g,"+").replace(/_/g,"/")+"==".substring(0,3*n.length%4),"base64");return i=o?a.slice(5):a,Object(f.a)("apdu","<= "+i.toString("hex")),i}throw t}))}var m=[];var _=function(t){Object(c.a)(r,t);var n=Object(d.a)(r);function r(){var e;return Object(a.a)(this,r),(e=n.call(this)).scrambleKey=void 0,e.unwrap=!0,m.push(Object(u.a)(e)),e}return Object(s.a)(r,[{key:"exchange",value:function(){var e=Object(i.a)(o.a.mark((function e(t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,v(t,this.exchangeTimeout,this.scrambleKey,this.unwrap);case 3:return e.abrupt("return",e.sent);case 6:if(e.prev=6,e.t0=e.catch(0),!("object"===typeof e.t0.metaData)){e.next=14;break}throw 5===e.t0.metaData.code&&(m.forEach((function(e){return e.emit("disconnect")})),m=[]),h(e.t0,"Failed to sign with Ledger device: U2F "+e.t0.metaData.type,"U2F_"+e.t0.metaData.code);case 14:throw e.t0;case 15:case"end":return e.stop()}}),e,this,[[0,6]])})));return function(t){return e.apply(this,arguments)}}()},{key:"setScrambleKey",value:function(t){this.scrambleKey=e.from(t,"ascii")}},{key:"setUnwrap",value:function(e){this.unwrap=e}},{key:"close",value:function(){return Promise.resolve()}}],[{key:"open",value:function(){var e=Object(i.a)(o.a.mark((function e(t){var n=arguments;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.length>1&&void 0!==n[1]?n[1]:5e3,e.abrupt("return",new r);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}]),r}(l.a);_.isSupported=p.isSupported,_.list=function(){return Object(p.isSupported)().then((function(e){return e?[null]:[]}))},_.listen=function(e){var t=!1;return Object(p.isSupported)().then((function(n){t||(n?(e.next({type:"add",descriptor:null}),e.complete()):e.error(new g.b("U2F browser support is needed for Ledger. Please use Chrome, Opera or Firefox with a U2F extension. Also make sure you're on an HTTPS connection","U2FNotSupported")))})),{unsubscribe:function(){t=!0}}}}.call(this,n(9).Buffer)},1999:function(e,t,n){"use strict";e.exports=n(2e3)},2e3:function(e,t,n){"use strict";(function(t){e.exports=c;var r=n(2001),o="undefined"!==typeof navigator&&!!navigator.userAgent,i=o&&navigator.userAgent.match(/Safari\//)&&!navigator.userAgent.match(/Chrome\//),a=o&&navigator.userAgent.match(/Edge\/1[2345]/),s=null;function u(e){return s||(s=new e((function(e,t){function n(){e({u2f:null,native:!0})}return o?i?n():("undefined"!==typeof window.u2f&&"function"===typeof window.u2f.sign&&e({u2f:window.u2f,native:!0}),a||"http:"===location.protocol||"undefined"===typeof MessageChannel?n():void r.isSupported((function(t){t?e({u2f:r,native:!1}):n()}))):n()}))),s}function c(e){return{isSupported:l.bind(e),ensureSupport:g.bind(e),register:h.bind(e),sign:E.bind(e),ErrorCodes:c.ErrorCodes,ErrorNames:c.ErrorNames}}function d(e,t){var n=null!=t?t.errorCode:1,r=c.ErrorNames[""+n],o=new Error(e);return o.metaData={type:r,code:n},o}function p(e,t){var n={};return n.promise=new e((function(e,r){n.resolve=e,n.reject=r,t.then(e,r)})),n.promise.cancel=function(t,r){u(e).then((function(e){r&&!e.native&&e.u2f.disconnect(),n.reject(d(t,{errorCode:-1}))}))},n}function l(){return u(this).then((function(e){return!!e.u2f}))}function f(e){if(!e.u2f){if("http:"===location.protocol)throw new Error("U2F isn't supported over http, only https");throw new Error("U2F not supported")}}function g(){return u(this).then(f)}function h(e,t,n){var r=this;return Array.isArray(e)||(e=[e]),"number"===typeof t&&"undefined"===typeof n&&(n=t,t=null),t||(t=[]),p(r,u(r).then((function(o){f(o);var i=o.native,a=o.u2f;return new r((function(r,o){if(i){var s=e[0].appId;a.register(s,e,t,(function(e){e.errorCode?o(d("Registration failed",e)):(delete e.errorCode,r(e))}),n)}else a.register(e,t,(function(e,t){e?o(e):t.errorCode?o(d("Registration failed",t)):r(t)}),n)}))}))).promise}function E(e,t){var n=this;return Array.isArray(e)||(e=[e]),p(n,u(n).then((function(r){f(r);var o=r.native,i=r.u2f;return new n((function(n,r){if(o){var a=e[0].appId,s=e[0].challenge;i.sign(a,s,e,(function(e){e.errorCode?r(d("Sign failed",e)):(delete e.errorCode,n(e))}),t)}else i.sign(e,(function(e,t){e?r(e):t.errorCode?r(d("Sign failed",t)):n(t)}),t)}))}))).promise}function v(e){c[e]=function(){if(!t.Promise)throw new Error("The platform doesn't natively support promises");var n=[].slice.call(arguments);return c(t.Promise)[e].apply(null,n)}}c.ErrorCodes={CANCELLED:-1,OK:0,OTHER_ERROR:1,BAD_REQUEST:2,CONFIGURATION_UNSUPPORTED:3,DEVICE_INELIGIBLE:4,TIMEOUT:5},c.ErrorNames={"-1":"CANCELLED",0:"OK",1:"OTHER_ERROR",2:"BAD_REQUEST",3:"CONFIGURATION_UNSUPPORTED",4:"DEVICE_INELIGIBLE",5:"TIMEOUT"},v("isSupported"),v("ensureSupport"),v("register"),v("sign")}).call(this,n(30))},2001:function(e,t,n){"use strict";var r=r||{};e.exports=r,r.EXTENSION_ID="kmendfapggjehodndflmmgagdbamhnfd",r.MessageTypes={U2F_REGISTER_REQUEST:"u2f_register_request",U2F_SIGN_REQUEST:"u2f_sign_request",U2F_REGISTER_RESPONSE:"u2f_register_response",U2F_SIGN_RESPONSE:"u2f_sign_response"},r.ErrorCodes={OK:0,OTHER_ERROR:1,BAD_REQUEST:2,CONFIGURATION_UNSUPPORTED:3,DEVICE_INELIGIBLE:4,TIMEOUT:5},r.Request,r.Response,r.Error,r.SignRequest,r.SignResponse,r.RegisterRequest,r.RegisterResponse,r.disconnect=function(){r.port_&&r.port_.port_&&(r.port_.port_.disconnect(),r.port_=null)},r.getMessagePort=function(e){if("undefined"!=typeof chrome&&chrome.runtime){var t={type:r.MessageTypes.U2F_SIGN_REQUEST,signRequests:[]};chrome.runtime.sendMessage(r.EXTENSION_ID,t,(function(){chrome.runtime.lastError?r.getIframePort_(e):r.getChromeRuntimePort_(e)}))}else r.getIframePort_(e)},r.getChromeRuntimePort_=function(e){var t=chrome.runtime.connect(r.EXTENSION_ID,{includeTlsChannelId:!0});setTimeout((function(){e(null,new r.WrappedChromeRuntimePort_(t))}),0)},r.WrappedChromeRuntimePort_=function(e){this.port_=e},r.WrappedChromeRuntimePort_.prototype.postMessage=function(e){this.port_.postMessage(e)},r.WrappedChromeRuntimePort_.prototype.addEventListener=function(e,t){var n=e.toLowerCase();"message"==n||"onmessage"==n?this.port_.onMessage.addListener((function(e){t({data:e})})):console.error("WrappedChromeRuntimePort only supports onMessage")},r.getIframePort_=function(e){var t="chrome-extension://"+r.EXTENSION_ID,n=document.createElement("iframe");n.src=t+"/u2f-comms.html",n.setAttribute("style","display:none"),document.body.appendChild(n);var o=!1,i=new MessageChannel;i.port1.addEventListener("message",(function t(n){"ready"==n.data?(i.port1.removeEventListener("message",t),o||(o=!0,e(null,i.port1))):console.error('First event on iframe port was not "ready"')})),i.port1.start(),n.addEventListener("load",(function(){n.contentWindow.postMessage("init",t,[i.port2])})),setTimeout((function(){o||(o=!0,e(new Error("IFrame extension not supported")))}),200)},r.EXTENSION_TIMEOUT_SEC=30,r.port_=null,r.waitingForPort_=[],r.reqCounter_=0,r.callbackMap_={},r.getPortSingleton_=function(e){r.port_?e(null,r.port_):(0==r.waitingForPort_.length&&r.getMessagePort((function(e,t){for(e||(r.port_=t,r.port_.addEventListener("message",r.responseHandler_));r.waitingForPort_.length;)r.waitingForPort_.shift()(e,t)})),r.waitingForPort_.push(e))},r.responseHandler_=function(e){var t=e.data,n=t.requestId;if(n&&r.callbackMap_[n]){var o=r.callbackMap_[n];delete r.callbackMap_[n],o(null,t.responseData)}else console.error("Unknown or missing requestId in response.")},r.isSupported=function(e){r.getPortSingleton_((function(t,n){e(!t)}))},r.sign=function(e,t,n){r.getPortSingleton_((function(o,i){if(o)return t(o);var a=++r.reqCounter_;r.callbackMap_[a]=t;var s={type:r.MessageTypes.U2F_SIGN_REQUEST,signRequests:e,timeoutSeconds:"undefined"!==typeof n?n:r.EXTENSION_TIMEOUT_SEC,requestId:a};i.postMessage(s)}))},r.register=function(e,t,n,o){r.getPortSingleton_((function(i,a){if(i)return n(i);var s=++r.reqCounter_;r.callbackMap_[s]=n;var u={type:r.MessageTypes.U2F_REGISTER_REQUEST,signRequests:t,registerRequests:e,timeoutSeconds:"undefined"!==typeof o?o:r.EXTENSION_TIMEOUT_SEC,requestId:s};a.postMessage(u)}))}},2002:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){return l}));var r=n(1373),o=n(1),i=n.n(o),a=n(3),s=n(6),u=n(5),c=n(63),d=n.n(c),p=n(1325),l=function(){function t(){var n=this;Object(s.a)(this,t),this.exchangeTimeout=3e4,this.unresponsiveTimeout=15e3,this.deviceModel=null,this._events=new d.a,this.send=function(){var t=Object(a.a)(i.a.mark((function t(r,o,a,s){var u,c,d,l,f=arguments;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(u=f.length>4&&void 0!==f[4]?f[4]:e.alloc(0),c=f.length>5&&void 0!==f[5]?f[5]:[p.a.OK],!(u.length>=256)){t.next=4;break}throw new p.b("data.length exceed 256 bytes limit. Got: "+u.length,"DataLengthTooBig");case 4:return t.next=6,n.exchange(e.concat([e.from([r,o,a,s]),e.from([u.length]),u]));case 6:if(d=t.sent,l=d.readUInt16BE(d.length-2),c.some((function(e){return e===l}))){t.next=10;break}throw new p.d(l);case 10:return t.abrupt("return",d);case 11:case"end":return t.stop()}}),t)})));return function(e,n,r,o){return t.apply(this,arguments)}}(),this.exchangeBusyPromise=void 0,this.exchangeAtomicImpl=function(){var e=Object(a.a)(i.a.mark((function e(t){var r,o,a,s,u;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!n.exchangeBusyPromise){e.next=2;break}throw new p.c("An action was already pending on the Ledger device. Please deny or reconnect.");case 2:return o=new Promise((function(e){r=e})),n.exchangeBusyPromise=o,a=!1,s=setTimeout((function(){a=!0,n.emit("unresponsive")}),n.unresponsiveTimeout),e.prev=6,e.next=9,t();case 9:return u=e.sent,a&&n.emit("responsive"),e.abrupt("return",u);case 12:return e.prev=12,clearTimeout(s),r&&r(),n.exchangeBusyPromise=null,e.finish(12);case 17:case"end":return e.stop()}}),e,null,[[6,,12,17]])})));return function(t){return e.apply(this,arguments)}}(),this._appAPIlock=null}return Object(u.a)(t,[{key:"exchange",value:function(e){throw new Error("exchange not implemented")}},{key:"setScrambleKey",value:function(e){}},{key:"close",value:function(){return Promise.resolve()}},{key:"on",value:function(e,t){this._events.on(e,t)}},{key:"off",value:function(e,t){this._events.removeListener(e,t)}},{key:"emit",value:function(e){for(var t,n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];(t=this._events).emit.apply(t,[e].concat(r))}},{key:"setDebugMode",value:function(){console.warn("setDebugMode is deprecated. use @ledgerhq/logs instead. No logs are emitted in this anymore.")}},{key:"setExchangeTimeout",value:function(e){this.exchangeTimeout=e}},{key:"setExchangeUnresponsiveTimeout",value:function(e){this.unresponsiveTimeout=e}},{key:"decorateAppAPIMethods",value:function(e,t,n){var o,i=Object(r.a)(t);try{for(i.s();!(o=i.n()).done;){var a=o.value;e[a]=this.decorateAppAPIMethod(a,e[a],e,n)}}catch(s){i.e(s)}finally{i.f()}}},{key:"decorateAppAPIMethod",value:function(e,t,n,r){var o=this;return Object(a.a)(i.a.mark((function a(){var s,u,c,d,l=arguments;return i.a.wrap((function(i){for(;;)switch(i.prev=i.next){case 0:if(!(s=o._appAPIlock)){i.next=3;break}return i.abrupt("return",Promise.reject(new p.b("Ledger Device is busy (lock "+s+")","TransportLocked")));case 3:for(i.prev=3,o._appAPIlock=e,o.setScrambleKey(r),u=l.length,c=new Array(u),d=0;d<u;d++)c[d]=l[d];return i.next=9,t.apply(n,c);case 9:return i.abrupt("return",i.sent);case 10:return i.prev=10,o._appAPIlock=null,i.finish(10);case 13:case"end":return i.stop()}}),a,null,[[3,,10,13]])})))}}],[{key:"create",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e3,n=arguments.length>1?arguments[1]:void 0;return new Promise((function(r,o){var i=!1,a=e.listen({next:function(n){i=!0,a&&a.unsubscribe(),s&&clearTimeout(s),e.open(n.descriptor,t).then(r,o)},error:function(e){s&&clearTimeout(s),o(e)},complete:function(){s&&clearTimeout(s),i||o(new p.b(e.ErrorMessage_NoDeviceFound,"NoDeviceFound"))}}),s=n?setTimeout((function(){a.unsubscribe(),o(new p.b(e.ErrorMessage_ListenTimeout,"ListenTimeout"))}),n):null}))}}]),t}();l.isSupported=void 0,l.list=void 0,l.listen=void 0,l.open=void 0,l.ErrorMessage_ListenTimeout="No Ledger device found (timeout)",l.ErrorMessage_NoDeviceFound="No Ledger device found"}).call(this,n(9).Buffer)},2003:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=0,o=[],i=function(e,t,n){var i={type:e,id:String(++r),date:new Date};t&&(i.message=t),n&&(i.data=n),function(e){for(var t=0;t<o.length;t++)try{o[t](e)}catch(n){console.error(n)}}(i)};"undefined"!==typeof window&&(window.__ledgerLogsListen=function(e){return o.push(e),function(){var t=o.indexOf(e);-1!==t&&(o[t]=o[o.length-1],o.pop())}})}}]);
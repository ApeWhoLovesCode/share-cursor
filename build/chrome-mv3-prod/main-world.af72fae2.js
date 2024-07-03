var e,r;"function"==typeof(e=globalThis.define)&&(r=e,e=null),function(r,t,n,o,a){var s="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},i="function"==typeof s[o]&&s[o],l=i.cache||{},d="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(e,t){if(!l[e]){if(!r[e]){var n="function"==typeof s[o]&&s[o];if(!t&&n)return n(e,!0);if(i)return i(e,!0);if(d&&"string"==typeof e)return d(e);var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}f.resolve=function(t){var n=r[e][1][t];return null!=n?n:t},f.cache={};var c=l[e]=new u.Module(e);r[e][0].call(c.exports,f,c,c.exports,this)}return l[e].exports;function f(e){var r=f.resolve(e);return!1===r?{}:u(r)}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=r,u.cache=l,u.parent=i,u.register=function(e,t){r[e]=[function(e,r){r.exports=t},{}]},Object.defineProperty(u,"root",{get:function(){return s[o]}}),s[o]=u;for(var c=0;c<t.length;c++)u(t[c]);if(n){var f=u(n);"object"==typeof exports&&"undefined"!=typeof module?module.exports=f:"function"==typeof e&&e.amd?e(function(){return f}):a&&(this[a]=f)}}({jEaYB:[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"config",()=>a);var o=e("@plasmohq/messaging");let a={matches:["<all_urls>"],run_at:"document_start",world:"MAIN"};window.relay={description:"Message from content script in main world",tryRelay:async()=>await (0,o.sendToBackgroundViaRelay)({name:"open-extension"})}},{"@plasmohq/messaging":"bq7mF","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],bq7mF:[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"relay",()=>m),n.export(t,"relayMessage",()=>g),n.export(t,"sendToActiveContentScript",()=>p),n.export(t,"sendToBackground",()=>c),n.export(t,"sendToBackgroundViaRelay",()=>y),n.export(t,"sendToContentScript",()=>f),n.export(t,"sendViaRelay",()=>b);var o=e("nanoid"),a=globalThis.browser?.tabs||globalThis.chrome?.tabs,s=()=>{let e=globalThis.browser?.runtime||globalThis.chrome?.runtime;if(!e)throw Error("Extension runtime is not available");return e},i=()=>{if(!a)throw Error("Extension tabs API is not available");return a},l=async()=>{let e=i(),[r]=await e.query({active:!0,currentWindow:!0});return r},d=(e,r)=>!r.__internal&&e.source===globalThis.window&&e.data.name===r.name&&(void 0===r.relayId||e.data.relayId===r.relayId),u=(e,r,t=globalThis.window)=>{let n=async n=>{if(d(n,e)&&!n.data.relayed){let o={name:e.name,relayId:e.relayId,body:n.data.body},a=await r?.(o);t.postMessage({name:e.name,relayId:e.relayId,instanceId:n.data.instanceId,body:a,relayed:!0},{targetOrigin:e.targetOrigin||"/"})}};return t.addEventListener("message",n),()=>t.removeEventListener("message",n)},c=async e=>s().sendMessage(e.extensionId??null,e),f=async e=>{let r="number"==typeof e.tabId?e.tabId:(await l())?.id;if(!r)throw Error("No active tab found to send message to.");return i().sendMessage(r,e)},p=f,g=e=>u(e,c),m=g,y=(e,r=globalThis.window)=>new Promise((t,n)=>{let a=(0,o.nanoid)(),s=new AbortController;r.addEventListener("message",r=>{d(r,e)&&r.data.relayed&&r.data.instanceId===a&&(t(r.data.body),s.abort())},{signal:s.signal}),r.postMessage({...e,instanceId:a},{targetOrigin:e.targetOrigin||"/"})}),b=y},{nanoid:"WGs0a","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],WGs0a:[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"urlAlphabet",()=>o.urlAlphabet),n.export(t,"random",()=>a),n.export(t,"customRandom",()=>s),n.export(t,"customAlphabet",()=>i),n.export(t,"nanoid",()=>l);var o=e("./url-alphabet/index.js");let a=e=>crypto.getRandomValues(new Uint8Array(e)),s=(e,r,t)=>{let n=(2<<Math.log(e.length-1)/Math.LN2)-1,o=-~(1.6*n*r/e.length);return (a=r)=>{let s="";for(;;){let r=t(o),i=o;for(;i--;)if((s+=e[r[i]&n]||"").length===a)return s}}},i=(e,r=21)=>s(e,r,a),l=(e=21)=>crypto.getRandomValues(new Uint8Array(e)).reduce((e,r)=>((r&=63)<36?e+=r.toString(36):r<62?e+=(r-26).toString(36).toUpperCase():r>62?e+="-":e+="_",e),"")},{"./url-alphabet/index.js":!1,"@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],hbR2Q:[function(e,r,t){t.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},t.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},t.exportAll=function(e,r){return Object.keys(e).forEach(function(t){"default"===t||"__esModule"===t||r.hasOwnProperty(t)||Object.defineProperty(r,t,{enumerable:!0,get:function(){return e[t]}})}),r},t.export=function(e,r,t){Object.defineProperty(e,r,{enumerable:!0,get:t})}},{}]},["jEaYB"],"jEaYB","parcelRequire2a08"),globalThis.define=r;
import{r as g,o as i,c as v,a as y,b,d as L,e as k,f as u,g as E,h as O}from"./vendor.25411c09.js";const P=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll("link[rel=\"modulepreload\"]"))n(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s);}).observe(document,{childList:!0,subtree:!0});function c(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o;}function n(e){if(e.ep)return;e.ep=!0;const o=c(e);fetch(e.href,o);}};P();var S=(t,r)=>{for(const[c,n]of r)t[c]=n;return t;};const x={};function T(t,r){const c=g("router-view");return i(),v(c);}var j=S(x,[["render",T]]);const w="modulepreload",d={},A="./",f=function(r,c){return!c||c.length===0?r():Promise.all(c.map(n=>{if(n=`${A}${n}`,n in d)return;d[n]=!0;const e=n.endsWith(".css"),o=e?"[rel=\"stylesheet\"]":"";if(document.querySelector(`link[href="${n}"]${o}`))return;const s=document.createElement("link");if(s.rel=e?"stylesheet":w,e||(s.as="script",s.crossOrigin=""),s.href=n,document.head.appendChild(s),e)return new Promise((h,p)=>{s.addEventListener("load",h),s.addEventListener("error",p);});})).then(()=>r());},C=[{path:"/home",name:"home",component:()=>f(()=>import("./home.f94ef4c0.js"),["assets/home.f94ef4c0.js","assets/home.70a7b0aa.css","assets/ur.base.b80eeb01.js","assets/ur.base.322fd13d.css","assets/vendor.25411c09.js"])}];var z=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:C});const M=[{path:"/list/:id",name:"list",component:()=>f(()=>import("./list.19faef68.js"),["assets/list.19faef68.js","assets/list.5279dcc4.css","assets/ur.base.b80eeb01.js","assets/ur.base.322fd13d.css","assets/vendor.25411c09.js"])}];var R=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:M});const m={"./modules/home.ts":z,"./modules/list.ts":R};let l=[];Object.keys(m).forEach(t=>{l=l.concat(m[t].default);});const _=[{path:"/",name:"Root",redirect:"/home"},...l,{path:"/:pathMatch(.*)*",name:"redirect",redirect:"/home"}];console.log(_);const $=y({history:b(),routes:_}),B={docTypeList:[]},D={setDocTypeList(t,r){t.docTypeList=r;}},I={state:B,mutations:D},N=[],V=L({plugins:N,modules:{doc:I}});const q={class:"icon"},H=["width","height","fill"],W=["xlink:href"],F=k({props:{size:{default:14},height:{default:14},fillColor:null,src:null},setup(t){return(r,c)=>(i(),u("i",q,[(i(),u("svg",{"aria-hidden":"true",width:t.size,height:t.size,fill:t.fillColor},[E("use",{"xlink:href":t.src},null,8,W)],8,H))]));}});var K=t=>{t.component("svg-icon",F);};const a=O(j);a.use($).use(V);K(a);a.mount("#app");export{S as _};

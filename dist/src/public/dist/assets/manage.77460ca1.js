import{_ as I,a as S,b as L,E as V}from"./plugin-vue_export-helper.74ec7946.js";import{x as M,y as A,z as O,A as z,B as J,H as G,D as P,F as R,N as q,L as H,M as K}from"./el-table.97906e9d.js";import{d as D,j as C,G as Q,o as c,b as k,w as t,h as B,k as e,m as n,g as p,D as W,a9 as X,n as b,P as v,R as F,a2 as Y}from"./vendor.15922771.js";import"./index.8a9dd342.js";const Z={key:0,class:"editDoc"},ee=["src"],oe={class:"dialog-footer"},te=b("\u53D6\u6D88"),le=b("\u786E\u5B9A"),ae=D({props:{dialogVisible:null,rowData:null},emits:["closeModal"],setup(y,{emit:m}){const s=y,f="https://wanting615.com.cn/",h=C({ACCESS_TOKEN:localStorage.getItem("token")}),a=C({id:0,type:1,name:"",iconUrl:"",contentTypes:[]}),u=o=>{m("closeModal",null)},d=o=>{m("closeModal",a)},i=o=>{o.status&&(s.rowData.iconUrl=f+o.url)},g=o=>{o.type!=="image/jpg"&&o.type!=="image/jpeg"&&o.type!=="image/png"&&R({message:"\u56FE\u7247\u683C\u5F0F\u4EC5\u4E3Ajpg/jpeg/png",type:"error"})};return Q(()=>s.rowData,o=>{!o||(a.id=o.id,a.type=o.type,a.contentTypes=JSON.parse(JSON.stringify(o.contentTypes)),a.name=o.name,a.iconUrl=o.iconUrl)}),(o,l)=>{const r=M,w=S,x=A,T=O,U=z,N=J,$=L,E=V,j=G;return c(),k(j,{modelValue:y.dialogVisible,"onUpdate:modelValue":l[2]||(l[2]=_=>X(dialogVisible)?dialogVisible.value=_:null),title:"\u7F16\u8F91\u6587\u6863",width:"500px","before-close":u},{footer:t(()=>[B("span",oe,[e(E,{onClick:u},{default:t(()=>[te]),_:1}),e(E,{type:"primary",onClick:d},{default:t(()=>[le]),_:1})])]),default:t(()=>[n(a)?(c(),p("div",Z,[e($,{model:n(a)},{default:t(()=>[e(w,{label:"\u6587\u6863\u7C7B\u578B","label-width":"80px"},{default:t(()=>[e(r,{modelValue:n(a).name,"onUpdate:modelValue":l[0]||(l[0]=_=>n(a).name=_),autocomplete:"off",placeholder:"\u8BF7\u8F93\u5165\u6587\u6863\u7C7B\u578B"},null,8,["modelValue"])]),_:1}),e(w,{label:"\u5185\u5BB9\u7C7B\u578B","label-width":"80px"},{default:t(()=>[e(T,{modelValue:n(a).contentTypes,"onUpdate:modelValue":l[1]||(l[1]=_=>n(a).contentTypes=_)},{default:t(()=>[e(x,{label:"\u77E5\u8BC6\u70B9",border:"",value:"info"}),e(x,{label:"\u95EE\u7B54\u9898",border:"",value:"quetion"})]),_:1},8,["modelValue"])]),_:1}),e(w,{label:"\u7C7B\u578B\u56FE\u6807","label-width":"80px"},{default:t(()=>[e(N,{class:"avatar-uploader",action:n(f)+"uploadTypeImg",headers:n(h),"show-file-list":!1,"on-success":i,"before-upload":g},{default:t(()=>[n(a).iconUrl?(c(),p("img",{key:0,src:n(a).iconUrl,class:"avatar",style:{height:"100%"}},null,8,ee)):(c(),k(U,{key:1,class:"avatar-uploader-icon",size:30,color:"#ccc"},{default:t(()=>[e(n(P))]),_:1}))]),_:1},8,["action","headers"])]),_:1})]),_:1},8,["model"])])):W("",!0)]),_:1},8,["modelValue"])}}});var ne=I(ae,[["__scopeId","data-v-5031dc58"]]);const se=["src"],ue={style:{"margin-left":"10px"}},ce={style:{"margin-left":"10px"}},ie=b("\u7F16\u8F91"),de=b("\u5220\u9664"),fe=D({setup(y){const m="https://wanting615.com.cn/",s=C({docTypeList:[],rowData:null,rowIndex:0,dialogVisible:!1}),f=(u,d)=>{s.dialogVisible=!0,s.rowData=d,s.rowIndex=u},h=(u,d)=>{s.docTypeList.splice(u,1)};q().then(u=>{s.docTypeList=u.data});const a=u=>{u&&(s.docTypeList[s.rowIndex]=JSON.parse(JSON.stringify(u))),s.dialogVisible=!1};return(u,d)=>{const i=H,g=V,o=K;return c(),p(v,null,[e(o,{data:n(s).docTypeList,style:{width:"100%"},"row-class-name":"table"},{default:t(()=>[e(i,{label:"\u6587\u6863\u7C7B\u578B\u56FE\u6807"},{default:t(l=>[B("img",{src:n(m)+l.row.iconUrl,width:"30"},null,8,se)]),_:1}),e(i,{label:"\u6587\u6863\u7C7B\u578B"},{default:t(l=>[B("span",ue,F(l.row.name),1)]),_:1}),e(i,{label:"\u6587\u6863\u5B50\u7C7B\u578B"},{default:t(l=>[(c(!0),p(v,null,Y(l.row.contentTypes,r=>(c(),p("span",ce,F(r),1))),256))]),_:1}),e(i,{label:"\u64CD\u4F5C"},{default:t(l=>[e(g,{size:"small",onClick:r=>f(l.$index,l.row)},{default:t(()=>[ie]),_:2},1032,["onClick"]),e(g,{size:"small",type:"danger",onClick:r=>h(l.$index,l.row)},{default:t(()=>[de]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"]),e(ne,{dialogVisible:n(s).dialogVisible,rowData:n(s).rowData,onCloseModal:a},null,8,["dialogVisible","rowData"])],64)}}});export{fe as default};
(this["webpackJsonpaddress-hash"]=this["webpackJsonpaddress-hash"]||[]).push([[0],{299:function(e,t,s){},315:function(e,t){},318:function(e,t){},321:function(e,t){},325:function(e,t){},350:function(e,t){},352:function(e,t){},361:function(e,t){},363:function(e,t){},373:function(e,t){},375:function(e,t){},419:function(e,t){},420:function(e,t){},493:function(e,t){},495:function(e,t){},502:function(e,t){},503:function(e,t){},605:function(e,t){},677:function(e,t,s){"use strict";s.r(t);var a=s(0),n=s.n(a),c=s(30),r=s.n(c),i=(s(298),s(299),s(689)),o=s(37),u=s(693),l=s(690),d=s(286),j=s(289),b=s(695),h=s(691),f=s(692),O=s(65),x=s(63),p=s(278),m=s(26),v=s.n(m),g=s(287),P=s.n(g),L=s(281),w=s.n(L),y="0x0000000000000000000000000000000000000000000000000000000000000000";var N=s(34),C=s(133),k=s(178),S=s(179),D=s.n(S),T=s(282),A=s.n(T);function I(e,t){var s,a=v.a.utils.hexToNumberString(function(e){return q(H(e),32)}(e)),n=new v.a.utils.BN(a),c=v.a.utils.hexToNumberString((s=t,q(H(v.a.utils.toHex(s),12),32))),r=new v.a.utils.BN(c);return"0x"+n.or(r.shrn(160)).toString(16)}function H(e,t){var s=v.a.utils.hexToBytes(e);if(!t||t===s.length)return s.concat([]);if(t<s.length)throw"Data will be lost";for(;t!=s.length;)s.unshift(0);return v.a.utils.bytesToHex(s)}function q(e,t){Array.isArray(e)||(e=v.a.utils.hexToBytes(e));var s=t-e.length;if(s<0)throw new Error("Data loss");if(0===s)return e.concat([]);var a="0".repeat(s).split("").map((function(e){return parseInt(e)})),n=e.concat(a);return v.a.utils.bytesToHex(n)}var J=s(1),R=n.a.createContext({}),B=1;console.log("counter init: ",B);var F=function(e){var t=e.children,s=Object(a.useState)([{index:B,accessList:[],startDate:new Date}]),n=Object(o.a)(s,2),c=n[0],r=n[1],i=Object(a.useState)({}),u=Object(o.a)(i,2),l=u[0],d=u[1],j=Object(a.useCallback)((function(){console.log("-counter: ",B),B++,r((function(e){return[].concat(Object(C.a)(e),[{index:B,accessList:[],startDate:new Date}])})),console.log("+counter: ",B)}),[r]),b=Object(a.useCallback)((function(e){r((function(t){return t.filter((function(t){return t!==e}))}))}),[r]),h=Object(a.useCallback)((function(e){return c.find((function(t){return t.index===e}))}),[c]),f=Object(a.useCallback)((function(e,t){var s=c.findIndex((function(t){return t.index===e}));t.price&&(t.priceInWei=v.a.utils.toWei(t.price)),c[s]=Object(N.a)(Object(N.a)({},c[s]),t),console.log("Phase update",c[s]),r(Object(C.a)(c))}),[c]),O=Object(a.useCallback)((function(e,t){var s=h(e);s.accessList=s.accessList||[],s.accessList.push(t),f(e,{accessList:s.accessList})}),[c,h,f]),x=Object(a.useCallback)((function(e,t){var s=h(e);s.accessList=t||[],f(e,{accessList:s.accessList})}),[c,h,f]),p=Object(a.useCallback)((function(e,t){var s=h(e);s.accessList=s.accessList||[],s.accessList=s.accessList.filter((function(e){return e.id!==t})),f(e,{accessList:s.accessList})}),[c,h,f]),m=Object(a.useCallback)((function(e){var t=h(e);if(!t.price)return f(e,{warning:"Please enther the price!"}),!1;if(!t.startDate)return f(e,{warning:"Please enther correct start date!"}),!1;if(!t.isPublic){if(t.accessList.filter((function(e){return!e.address||!e.quantity})).length)return f(e,{warning:"Fill in all fields!"}),!1;var s="";if(t.accessList.forEach((function(e,t){e.warn=!1,v.a.utils.isAddress(e.address)||(s+="".concat(t+1,","),e.warn=!0)})),s.length)return f(e,{warning:"The address in row ".concat(s," is not correct.")}),!1}var a=[y],n=y,c=t.accessList,r=a;if(!t.isPublic){var i=function(e){var t=e.map((function(e){var t=e.quantity,s=e.address;return Object(N.a)(Object(N.a)({},e),{},{leafValue:I(s,t)})})),s=new A.a(t.map((function(e){return e.leafValue})),D.a,{sortPairs:!0}),a={root:"0x"+s.getRoot().toString("hex"),data:t.map((function(e,t){return Object(N.a)(Object(N.a)({},e),{},{proof:s.getHexProof(e.leafValue),proofPositional:s.getPositionalHexProof(e.leafValue,t)})}))};return console.log("results",s.toString()),console.log("results",a),a}(Object(C.a)(t.accessList));r=(c=i.data).map((function(e){return{address:e.address,quantity:e.quantity,proof:e.proof}})),n=i.root}var o=parseInt(t.startDate.getTime()/1e3);return f(e,{warning:"",accessList:c,rootHash:n,startTimestamp:o,phaseDrop:{isPublic:t.isPublic,startTimestamp:o,price:t.priceInWei,accessList:r},phaseDropStr:"[".concat(o,", ").concat(t.priceInWei,', "').concat(n,'"]')}),c}),[c,f,h]),g=Object(a.useCallback)((function(){if(c.find((function(e){return!1===m(e.index)})))alert("Invalid phase exist. Please correct it and try again.");else{var e=[],t=c.sort((function(e,t){return e.startDate.getTime()-t.startDate.getTime()})).reduce((function(t,s){return t+=s.phaseDropStr+",",e.push(s.phaseDrop),t}),"[");e=e.sort((function(e,t){return e.startTimestamp-t.startTimestamp})),t=t.substring(0,t.length-1)+"]",d({dropPhasesRemixStr:t,dropPhases:e});var s=(new TextEncoder).encode(JSON.stringify(e)),a=new Blob([s],{type:"application/json;charset=utf-8"});Object(k.saveAs)(a,"access-list.json")}}),[c,h,m]),P=Object(a.useCallback)((function(e){var t=h(e);if(t.accessList&&t.accessList.length){var s=(new TextEncoder).encode(JSON.stringify(t.accessList)),a=new Blob([s],{type:"application/json;charset=utf-8"});Object(k.saveAs)(a,"access-list.json")}}),[c,h]),L=Object(a.useCallback)((function(e,t,s){var a=h(e);a.accessList=a.accessList.concat();var n=a.accessList.findIndex((function(e){return e.id==t}));a.accessList[n]=Object(N.a)(Object(N.a)({},a.accessList[n]),s);var c=a.accessList.map((function(e){return Object(N.a)(Object(N.a)({},e),{},{leafValue:"",warn:!1,proof:!1})}));f(e,{accessList:c,rootHash:""})}),[c,h]);return Object(J.jsx)(R.Provider,{value:{phases:c,onAddPhase:j,savePhasesJSON:P,updatePhaseAccessListItem:L,onRemovePhase:b,addAddressToPhase:O,generateMercleTreeForPhase:m,setAddressesToPhase:x,updatePhase:f,phasesData:l,generateAndSaveJSON:g,removeAddressFromPhase:p},children:t})},E=function(){return n.a.useContext(R)},W={header:!1,dynamicTyping:!0,skipEmptyLines:!0},V=function(e){var t=e.phase;window.web3=v.a;var s=E(),n=s.addAddressToPhase,c=s.removeAddressFromPhase,r=s.setAddressesToPhase,m=s.updatePhaseAccessListItem,g=s.generateMercleTreeForPhase,L=s.updatePhase,y=Object(a.useState)(t.users||[]),N=Object(o.a)(y,2),C=N[0],k=N[1],S=Object(a.useState)([]),D=Object(o.a)(S,2),T=(D[0],D[1],Object(a.useState)(new Date)),A=Object(o.a)(T,2),I=(A[0],A[1],Object(a.useState)(new Date)),H=Object(o.a)(I,2),q=(H[0],H[1],Object(a.useCallback)((function(){n(t.index,{address:"",quantity:"",hash:"",id:Object(p.a)()})}),[t,n])),R=Object(a.useCallback)((function(e){c(t.index,e)}),[t,t.accessList,c]),B=Object(a.useCallback)((function(e,s){m(t.index,e,{address:s})}),[t,t.accessList,m]),F=Object(a.useCallback)((function(e,s){m(t.index,e,{quantity:s})}),[t,t.accessList,m]),V=Object(a.useCallback)((function(){g(t.index)}),[C,g]),M=Object(a.useCallback)((function(e,s,a){var n=function(e){var t=e.map((function(e,t){return{address:e[0],quantity:e[1],id:t}}));return isNaN(parseInt(t[0].quantity))&&t.shift(),t}(e);r(t.index,n)}),[k,t,r]);return Object(J.jsxs)(i.a,{children:[Object(J.jsx)("div",{className:"pt-5",children:!!t.warning&&Object(J.jsx)(u.a,{variant:"warning",className:"text-center pointer",children:t.warning})}),Object(J.jsxs)(l.a,{children:[Object(J.jsxs)(d.a,{children:[Object(J.jsxs)("p",{children:["Drop Phase Start Date / ",t.startDate.toLocaleString()]}),Object(J.jsx)(P.a,{selected:t.startDate,showTimeSelect:!0,timeFormat:"HH:mm",onChange:function(e){return L(t.index,{startDate:e})},inline:!0})]}),Object(J.jsxs)(d.a,{children:[Object(J.jsx)("p",{children:"Price in eth"}),Object(J.jsx)(j.a,{type:"number",step:.1,value:t.price,onChange:function(e){var s=e.target;return L(t.index,{price:s.value})}}),t.priceInWei&&Object(J.jsxs)("p",{className:"small",children:["Wei: ",t.priceInWei]})]}),Object(J.jsxs)(d.a,{children:[Object(J.jsx)("p",{children:"Is Public"}),Object(J.jsx)(b.a.Check,{type:"switch",value:t.isPublic,onChange:function(){return L(t.index,{isPublic:!t.isPublic})}})]})]}),!t.isPublic&&Object(J.jsxs)(J.Fragment,{children:[Object(J.jsx)(w.a,{onFileLoaded:M,parserOptions:W}),Object(J.jsxs)(h.a,{striped:!0,bordered:!0,hover:!0,size:"md",children:[Object(J.jsx)("thead",{className:"address-table-header",children:Object(J.jsxs)("tr",{children:[Object(J.jsx)("th",{children:"#"}),Object(J.jsx)("th",{children:"Address"}),Object(J.jsx)("th",{children:"Access Quantity"}),Object(J.jsx)("th",{children:"Leaf"}),Object(J.jsx)("th",{children:"Hash"})]})}),Object(J.jsx)("tbody",{children:t.accessList.map((function(e,t){var s="";return e.warn&&(s="warning"),Object(J.jsxs)("tr",{children:[Object(J.jsx)("td",{children:t+1}),Object(J.jsx)("td",{className:s,children:Object(J.jsx)("input",{className:"address-input",type:"text",value:e.address,onChange:function(t){return B(e.id,t.target.value)}})}),Object(J.jsx)("td",{children:Object(J.jsx)("input",{type:"number",className:"quantity-input",value:e.quantity,onChange:function(t){return F(e.id,t.target.value)}})}),Object(J.jsx)("td",{className:"break",children:e.leafValue||"-"}),Object(J.jsx)("td",{className:"break",children:e.proof?JSON.stringify(e.proof):"-"}),Object(J.jsx)("td",{className:"text-center",children:Object(J.jsx)(O.a,{icon:x.a,onClick:function(){return R(e.id)},className:"clr pointer"})})]},e.id)}))})]}),Object(J.jsx)("div",{children:Object(J.jsxs)(f.a,{className:"text-center",onClick:q,children:["Add Address",Object(J.jsx)(O.a,{icon:x.b,className:"clr pointer"})]})})]}),Object(J.jsxs)("div",{children:[Object(J.jsxs)("p",{children:["Hash: ",t.rootHash]}),Object(J.jsxs)("p",{children:["Drop Data: ",t.phaseDropStr]})]}),Object(J.jsx)("hr",{className:"clr"}),Object(J.jsx)("div",{className:"text-center",children:Object(J.jsx)(f.a,{onClick:V,className:"generate-btn",children:"Generate"})})]})},M=(s(675),s(694));function z(e){var t=e.phase,s=e.onRemovePhase,n=Object(a.useCallback)((function(){s&&s(t)}),[t,t.index,s]);return Object(J.jsxs)(M.a.Item,{eventKey:t.index,children:[Object(J.jsxs)(M.a.Header,{children:["Drop Phase ",t.index,": ",t.price&&"price: ".concat(t.price),"  ",t.date&&"date: ".concat(t.date),Object(J.jsx)("div",{className:"header-button-group",children:Object(J.jsxs)(f.a,{className:"text-center",variant:"danger",onClick:n,children:["Remove Phase",Object(J.jsx)(O.a,{icon:x.a,className:"mr-4 clr pointer"})]})})]}),Object(J.jsx)(M.a.Body,{children:Object(J.jsx)(V,{phase:t})})]})}function G(){var e=E(),t=e.phases,s=e.phasesData,n=e.onAddPhase,c=e.onRemovePhase,r=e.generateAndSaveJSON,i=Object(a.useCallback)((function(){r()}),[r]);return Object(J.jsxs)(M.a,{children:[t.map((function(e){return Object(J.jsx)(z,{phase:e,onRemovePhase:c})})),Object(J.jsxs)("div",{children:[Object(J.jsxs)(f.a,{className:"text-center",onClick:n,children:["Add Phase",Object(J.jsx)(O.a,{icon:x.b,className:"clr pointer"})]}),Object(J.jsx)(f.a,{onClick:i,className:"save-btn",children:"Save As Json"}),Object(J.jsxs)("p",{children:["Remix data: ",s.dropPhasesRemixStr]})]})]})}var K=s(126);function Q(){var e=Object(a.useState)(""),t=Object(o.a)(e,2),s=t[0],n=t[1],c=Object(a.useState)(""),r=Object(o.a)(c,2),i=r[0],u=r[1];return Object(a.useEffect)((function(){u(function(e){if(!e)return"";var t=new v.a,s=t.utils.asciiToHex(e),a=t.eth.abi.encodeParameters(["bytes"],[s]);return t.utils.toHex(D()(a))}(s))}),[s,u]),Object(J.jsxs)(K.a,{children:[Object(J.jsx)("p",{children:"Please input password: "}),Object(J.jsx)(j.a,{onChange:function(e){var t=e.target;return n(t.value)}}),Object(J.jsx)("p",{children:i})]})}var U=function(){return Object(J.jsx)(i.a,{className:"big-container",children:Object(J.jsxs)(F,{children:[Object(J.jsx)(G,{}),Object(J.jsx)(Q,{})]})})};r.a.render(Object(J.jsx)(n.a.StrictMode,{children:Object(J.jsx)(U,{})}),document.getElementById("root"))}},[[677,1,2]]]);
//# sourceMappingURL=main.2ebd1c33.chunk.js.map
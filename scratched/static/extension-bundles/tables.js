var tables=function(e,t){"use strict";function n(){}function r(e){return e()}function a(){return Object.create(null)}function o(e){e.forEach(r)}function l(e){return"function"==typeof e}function i(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function s(e,t){e.appendChild(t)}function c(e,t,n){const r=function(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;if(t&&t.host)return t;return e.ownerDocument}(e);if(!r.getElementById(t)){const e=h("style");e.id=t,e.textContent=n,function(e,t){s(e.head||e,t),t.sheet}(r,e)}}function u(e,t,n){e.insertBefore(t,n||null)}function d(e){e.parentNode&&e.parentNode.removeChild(e)}function p(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function h(e){return document.createElement(e)}function m(e){return document.createTextNode(e)}function f(){return m(" ")}function b(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function g(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function y(e){return""===e?null:+e}function v(e,t){e.value=null==t?"":t}function x(e,t,n,r){null===n?e.style.removeProperty(t):e.style.setProperty(t,n,r?"important":"")}function $(e,t,n){for(let n=0;n<e.options.length;n+=1){const r=e.options[n];if(r.__value===t)return void(r.selected=!0)}n&&void 0===t||(e.selectedIndex=-1)}function w(e,t,n){e.classList[n?"add":"remove"](t)}let k;function T(e){k=e}function N(e,t){const n=e.$$.callbacks[t.type];n&&n.slice().forEach((e=>e.call(this,t)))}const A=[],_=[];let C=[];const O=[],B=Promise.resolve();let E=!1;function I(e){C.push(e)}const j=new Set;let R=0;function V(){if(0!==R)return;const e=k;do{try{for(;R<A.length;){const e=A[R];R++,T(e),z(e.$$)}}catch(e){throw A.length=0,R=0,e}for(T(null),A.length=0,R=0;_.length;)_.pop()();for(let e=0;e<C.length;e+=1){const t=C[e];j.has(t)||(j.add(t),t())}C.length=0}while(A.length);for(;O.length;)O.pop()();E=!1,j.clear(),T(e)}function z(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(I)}}const D=new Set;let M;function P(e,t){e&&e.i&&(D.delete(e),e.i(t))}function S(e,t,n,r){if(e&&e.o){if(D.has(e))return;D.add(e),M.c.push((()=>{D.delete(e),r&&(n&&e.d(1),r())})),e.o(t)}else r&&r()}function L(e){e&&e.c()}function q(e,t,n,a){const{fragment:i,after_update:s}=e.$$;i&&i.m(t,n),a||I((()=>{const t=e.$$.on_mount.map(r).filter(l);e.$$.on_destroy?e.$$.on_destroy.push(...t):o(t),e.$$.on_mount=[]})),s.forEach(I)}function H(e,t){const n=e.$$;null!==n.fragment&&(!function(e){const t=[],n=[];C.forEach((r=>-1===e.indexOf(r)?t.push(r):n.push(r))),n.forEach((e=>e())),C=t}(n.after_update),o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function F(e,t){-1===e.$$.dirty[0]&&(A.push(e),E||(E=!0,B.then(V)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function U(e,t,r,l,i,s,c,u=[-1]){const p=k;T(e);const h=e.$$={fragment:null,ctx:[],props:s,update:n,not_equal:i,bound:a(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(p?p.$$.context:[])),callbacks:a(),dirty:u,skip_bound:!1,root:t.target||p.$$.root};c&&c(h.root);let m=!1;if(h.ctx=r?r(e,t.props||{},((t,n,...r)=>{const a=r.length?r[0]:n;return h.ctx&&i(h.ctx[t],h.ctx[t]=a)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](a),m&&F(e,t)),n})):[],h.update(),m=!0,o(h.before_update),h.fragment=!!l&&l(h.ctx),t.target){if(t.hydrate){const e=function(e){return Array.from(e.childNodes)}(t.target);h.fragment&&h.fragment.l(e),e.forEach(d)}else h.fragment&&h.fragment.c();t.intro&&P(e.$$.fragment),q(e,t.target,t.anchor,t.customElement),V()}T(p)}class G{$destroy(){H(this,1),this.$destroy=n}$on(e,t){if(!l(t))return n;const r=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return r.push(t),()=>{const e=r.indexOf(t);-1!==e&&r.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}class K{constructor(e){this.root=e}get(...e){return`var(--${this.root}-${e.join("-")})`}primary(...e){return this.get("primary",...e)}secondary(...e){return this.get("secondary",...e)}tertiary(...e){return this.get("tertiary",...e)}transparent(...e){return this.get("transparent",...e)}light(...e){return this.get("light",...e)}}const J=new K("ui"),Q=new K("text"),W=new K("motion"),X=new K("red"),Y=new K("sound"),Z=new K("control"),ee=new K("data"),te=new K("pen"),ne=new K("error"),re=new K("extensions"),ae=new K("extensions"),oe={ui:{primary:J.primary(),secondary:J.secondary(),tertiary:J.tertiary(),modalOverlay:J.get("modal","overlay"),white:J.get("white"),whiteDim:J.get("white","dim"),whiteTransparent:J.get("white","transparent"),transparent:J.transparent(),blackTransparent:J.get("black","transparent")},text:{primary:Q.primary(),primaryTransparent:Q.transparent()},motion:{primary:W.primary(),tertiary:W.tertiary(),transparent:W.get("transparent"),lightTansparent:W.light("transparent")},red:{primary:X.primary(),tertiary:X.tertiary()},sound:{primary:Y.primary(),tertiary:Y.tertiary()},control:{primary:Z.primary()},data:{primary:ee.primary()},pen:{primary:te.primary(),transparent:te.transparent()},error:{primary:ne.primary(),light:ne.light(),transparent:ne.transparent()},extensions:{primary:re.primary(),tertiary:re.tertiary(),light:re.light(),transparent:re.transparent()},drop:{highlight:ae.get("highlight")}};function le(e){c(e,"svelte-2pm55u","button.svelte-2pm55u:disabled{background:var(--drop-highlight);border:var(--drop-highlight)}button.svelte-2pm55u{padding:0.75rem 1rem;border-radius:0.25rem;border-width:1px;border-style:solid;font-weight:600;font-size:0.85rem;transition:background-color 0.25s, border-color 0.25s}")}function ie(e){let t,r,a,o;return{c(){t=h("button"),r=m("OK"),t.disabled=e[0],g(t,"data-testid","ok"),g(t,"class","svelte-2pm55u"),x(t,"border-color",e[2]),x(t,"background-color",e[2]),x(t,"color",e[1])},m(n,l){u(n,t,l),s(t,r),a||(o=b(t,"click",e[3]),a=!0)},p(e,[n]){1&n&&(t.disabled=e[0])},i:n,o:n,d(e){e&&d(t),a=!1,o()}}}function se(e,t,n){let{disabled:r=!1}=t;const a=oe.ui.white,o=oe.motion.primary;return e.$$set=e=>{"disabled"in e&&n(0,r=e.disabled)},[r,a,o,function(t){N.call(this,e,t)}]}class ce extends G{constructor(e){super(),U(this,e,se,ie,i,{disabled:0},le)}}function ue(e){c(e,"svelte-1lnk5kq","button.svelte-1lnk5kq{padding:0.75rem 1rem;border-radius:0.25rem;border-width:1px;border-style:solid;font-weight:600;font-size:0.85rem}")}function de(e){let t,r,a;return{c(){t=h("button"),t.textContent="Cancel",g(t,"class","svelte-1lnk5kq"),x(t,"border-color",e[0]),x(t,"background-color",e[0]),x(t,"color",e[0])},m(n,o){u(n,t,o),r||(a=b(t,"click",e[1]),r=!0)},p:n,i:n,o:n,d(e){e&&d(t),r=!1,a()}}}function pe(e){return[oe.ui.blackTransparent,function(t){N.call(this,e,t)}]}class he extends G{constructor(e){super(),U(this,e,pe,de,i,{},ue)}}function me(e){c(e,"svelte-3p09kw",".container.svelte-3p09kw{width:360px;background-color:var(--ui-white);padding:30px;padding:1.5rem 2.25rem}.label.svelte-3p09kw{font-weight:500;margin:0 0 0.75rem}.numberInputContainer.svelte-3p09kw{display:flex;justify-content:space-between;align-items:center}input.svelte-3p09kw{border:1px solid var(--ui-black-transparent);border-radius:5px}.numberInput.svelte-3p09kw{margin-bottom:1.5rem;border:1px solid var(--ui-black-transparent);border-radius:5px;padding:0 1rem;height:3rem;color:var(--text-primary-transparent);font-size:.875rem;vertical-align:middle;margin-top:20px}.nameInput.svelte-3p09kw{margin-bottom:1.5rem;width:100%;border:1px solid var(--ui-black-transparent);border-radius:5px;padding:0 1rem;height:3rem;color:var(--text-primary-transparent);font-size:.875rem}.error.svelte-3p09kw{margin:0px;font-weight:bold}")}function fe(e){let n,r,a,i,c,p,m,$,k,T,N,A,_,C,O,B,E,I,j,R,V,z,D,M,F;return I=new ce({props:{disabled:e[4]||e[5]}}),I.$on("click",e[6]),R=new he({}),R.$on("click",(function(){l(e[0])&&e[0].apply(this,arguments)})),{c(){n=h("div"),r=h("div"),a=h("div"),a.textContent="Table Name",i=f(),c=h("input"),p=f(),m=h("div"),$=h("div"),$.textContent="Number of Rows",k=f(),T=h("input"),N=f(),A=h("div"),_=h("div"),_.textContent="Number of Columns",C=f(),O=h("input"),B=f(),E=h("div"),L(I.$$.fragment),j=f(),L(R.$$.fragment),V=f(),z=h("p"),z.textContent="That table name already exists",g(a,"class","svelte-3p09kw"),w(a,"label",ge),c.autofocus=!0,g(c,"data-testid","makeNameInput"),g(c,"class","svelte-3p09kw"),w(c,"nameInput",xe),g($,"class","svelte-3p09kw"),w($,"label",ge),g(T,"type","number"),g(T,"min",we),g(T,"max",ke),g(T,"class","svelte-3p09kw"),w(T,"numberInput",ve),g(m,"class","svelte-3p09kw"),w(m,"numberInputContainer",ye),g(_,"class","svelte-3p09kw"),w(_,"label",ge),g(O,"type","number"),g(O,"min",we),g(O,"max",ke),g(O,"class","svelte-3p09kw"),w(O,"numberInput",ve),g(A,"class","svelte-3p09kw"),w(A,"numberInputContainer",ye),g(z,"class","svelte-3p09kw"),w(z,"error",$e),x(z,"visibility",e[5]?"visible":"hidden"),x(z,"color",t.color.error.primary),g(n,"class","svelte-3p09kw"),w(n,"container",be)},m(t,o){u(t,n,o),s(n,r),s(r,a),s(r,i),s(r,c),v(c,e[1]),s(n,p),s(n,m),s(m,$),s(m,k),s(m,T),v(T,e[2]),s(n,N),s(n,A),s(A,_),s(A,C),s(A,O),v(O,e[3]),s(n,B),s(n,E),q(I,E,null),s(E,j),q(R,E,null),s(n,V),s(n,z),D=!0,c.focus(),M||(F=[b(c,"input",e[8]),b(T,"input",e[9]),b(O,"input",e[10])],M=!0)},p(t,[n]){e=t,2&n&&c.value!==e[1]&&v(c,e[1]),4&n&&y(T.value)!==e[2]&&v(T,e[2]),8&n&&y(O.value)!==e[3]&&v(O,e[3]);const r={};48&n&&(r.disabled=e[4]||e[5]),I.$set(r),32&n&&x(z,"visibility",e[5]?"visible":"hidden")},i(e){D||(P(I.$$.fragment,e),P(R.$$.fragment,e),D=!0)},o(e){S(I.$$.fragment,e),S(R.$$.fragment,e),D=!1},d(e){e&&d(n),H(I),H(R),M=!1,o(F)}}}const be=!0,ge=!0,ye=!0,ve=!0,xe=!0,$e=!0,we=1,ke=100;function Te(e,n,r){let{extension:a}=n,{close:o}=n;let l,i,s="",c=1,u=1;return e.$$set=e=>{"extension"in e&&r(7,a=e.extension),"close"in e&&r(0,o=e.close)},e.$$.update=()=>{2&e.$$.dirty&&r(4,l=0===s.length),130&e.$$.dirty&&r(5,i=s in a.tables)},[o,s,c,u,l,i,()=>{((e,...n)=>{t.reactiveInvoke(r(7,a),e,n)})("newTable",{name:s,rows:c,columns:u}),o()},a,function(){s=this.value,r(1,s)},function(){c=y(this.value),r(2,c)},function(){u=y(this.value),r(3,u)}]}function Ne(e){c(e,"svelte-1di56al",".container.svelte-1di56al{width:480px;padding:1.5rem 2.25rem}.tableListDropdown.svelte-1di56al{margin-bottom:1.5rem;width:100%;border:1px solid var(--ui-black-transparent);border-radius:5px;padding:0 1rem;height:3rem;color:var(--text-primary-transparent);font-size:1rem}.tableBox.svelte-1di56al{border:1px solid var(--ui-black-transparent);border-radius:5px;margin-bottom:1rem;padding:1rem;color:var(--text-primary-transparent);font-size:1rem;overflow:scroll;max-height:22.5rem}.tableValueInput.svelte-1di56al{width:3rem;padding:.25rem;color:var(--text-primary-transparent);font-size:1rem}")}function Ae(e,t,n){const r=e.slice();return r[13]=t[n],r[15]=n,r}function _e(e,t,n){const r=e.slice();return r[16]=t[n],r[18]=n,r}function Ce(e,t,n){const r=e.slice();return r[19]=t[n],r[15]=n,r}function Oe(e,t,n){const r=e.slice();return r[21]=t[n],r}function Be(e){let t,n,r,a,o=e[21]+"";return{c(){t=h("option"),n=m(o),r=f(),t.__value=a=e[21],t.value=t.__value},m(e,a){u(e,t,a),s(t,n),s(t,r)},p(e,r){1&r&&o!==(o=e[21]+"")&&function(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}(n,o),1&r&&a!==(a=e[21])&&(t.__value=a,t.value=t.__value)},d(e){e&&d(t)}}}function Ee(e){let t,r,a=e[15]+1+"";return{c(){t=h("th"),r=m(a)},m(e,n){u(e,t,n),s(t,r)},p:n,d(e){e&&d(t)}}}function Ie(e){let t,n,r,a,o;function l(...t){return e[9](e[15],e[18],...t)}return{c(){t=h("th"),n=h("input"),g(n,"type","number"),n.value=r=e[16],g(n,"data-testid","tableCell"),g(n,"class","svelte-1di56al"),w(n,"tableValueInput",e[6])},m(e,r){u(e,t,r),s(t,n),a||(o=b(n,"change",l),a=!0)},p(t,a){e=t,5&a&&r!==(r=e[16])&&n.value!==r&&(n.value=r)},d(e){e&&d(t),a=!1,o()}}}function je(e){let t,n,r,a,o,l=e[15]+1+"",i=e[13],c=[];for(let t=0;t<i.length;t+=1)c[t]=Ie(_e(e,i,t));return{c(){t=h("tr"),n=h("th"),r=m(l),a=f();for(let e=0;e<c.length;e+=1)c[e].c();o=f()},m(e,l){u(e,t,l),s(t,n),s(n,r),s(t,a);for(let e=0;e<c.length;e+=1)c[e]&&c[e].m(t,null);s(t,o)},p(e,n){if(197&n){let r;for(i=e[13],r=0;r<i.length;r+=1){const a=_e(e,i,r);c[r]?c[r].p(a,n):(c[r]=Ie(a),c[r].c(),c[r].m(t,o))}for(;r<c.length;r+=1)c[r].d(1);c.length=i.length}},d(e){e&&d(t),p(c,e)}}}function Re(e){let n,r,a,o,i,c,m,y,v,k,T,N,A,_,C,O,B,E,j=Object.keys(e[0].tables),R=[];for(let t=0;t<j.length;t+=1)R[t]=Be(Oe(e,j,t));let V=[...Array(e[0].tables[e[2]][0].length)],z=[];for(let t=0;t<V.length;t+=1)z[t]=Ee(Ce(e,V,t));let D=e[0].tables[e[2]],M=[];for(let t=0;t<D.length;t+=1)M[t]=je(Ae(e,D,t));return C=new ce({}),C.$on("click",(function(){l(e[1])&&e[1].apply(this,arguments)})),{c(){n=h("div"),r=h("div"),a=h("select");for(let e=0;e<R.length;e+=1)R[e].c();o=f(),i=h("div"),c=h("table"),m=h("thead"),y=h("tr"),v=h("th"),k=f();for(let e=0;e<z.length;e+=1)z[e].c();T=f(),N=h("tbody");for(let e=0;e<M.length;e+=1)M[e].c();A=f(),_=h("center"),L(C.$$.fragment),g(a,"data-testid","tableSelect"),g(a,"class","svelte-1di56al"),void 0===e[2]&&I((()=>e[8].call(a))),w(a,"tableListDropdown",e[4]),g(i,"class","svelte-1di56al"),w(i,"tableBox",e[5]),g(n,"class","svelte-1di56al"),w(n,"container",e[3]),x(n,"width","360px"),x(n,"background-color",t.color.ui.white),x(n,"color",t.color.text.primary)},m(t,l){u(t,n,l),s(n,r),s(r,a);for(let e=0;e<R.length;e+=1)R[e]&&R[e].m(a,null);$(a,e[2],!0),s(n,o),s(n,i),s(i,c),s(c,m),s(m,y),s(y,v),s(y,k);for(let e=0;e<z.length;e+=1)z[e]&&z[e].m(y,null);s(c,T),s(c,N);for(let e=0;e<M.length;e+=1)M[e]&&M[e].m(N,null);s(n,A),s(n,_),q(C,_,null),O=!0,B||(E=b(a,"change",e[8]),B=!0)},p(t,[n]){if(e=t,1&n){let t;for(j=Object.keys(e[0].tables),t=0;t<j.length;t+=1){const r=Oe(e,j,t);R[t]?R[t].p(r,n):(R[t]=Be(r),R[t].c(),R[t].m(a,null))}for(;t<R.length;t+=1)R[t].d(1);R.length=j.length}if(5&n&&$(a,e[2]),5&n){let t;for(V=[...Array(e[0].tables[e[2]][0].length)],t=0;t<V.length;t+=1){const r=Ce(e,V,t);z[t]?z[t].p(r,n):(z[t]=Ee(r),z[t].c(),z[t].m(y,null))}for(;t<z.length;t+=1)z[t].d(1);z.length=V.length}if(197&n){let t;for(D=e[0].tables[e[2]],t=0;t<D.length;t+=1){const r=Ae(e,D,t);M[t]?M[t].p(r,n):(M[t]=je(r),M[t].c(),M[t].m(N,null))}for(;t<M.length;t+=1)M[t].d(1);M.length=D.length}},i(e){O||(P(C.$$.fragment,e),O=!0)},o(e){S(C.$$.fragment,e),O=!1},d(e){e&&d(n),p(R,e),p(z,e),p(M,e),H(C),B=!1,E()}}}function Ve(e,n,r){let{extension:a}=n,{close:o}=n;const l=t.activeClass,i=t.activeClass,s=t.activeClass,c=t.activeClass,u=Object.keys(a.tables);let d=u.length>0?u[0]:"";const p=(e,n,o)=>((e,...n)=>t.reactiveInvoke(r(0,a),e,n))("changeTableValue",{name:d,row:n,column:o,value:parseInt(e.currentTarget.value)});return e.$$set=e=>{"extension"in e&&r(0,a=e.extension),"close"in e&&r(1,o=e.close)},[a,o,d,l,i,s,c,p,function(){d=function(e){const t=e.querySelector(":checked");return t&&t.__value}(this),r(2,d),r(0,a)},(e,t,n)=>p(n,e,t)]}var ze=(()=>{let e,n,r=[t.validGenericExtension()],a=[];var o,l,i,s=n=class extends t.Extension{constructor(){super(...arguments),this.saveDataHandler=new t.SaveDataHandler({Extension:s,onSave:e=>e.tables,onLoad:(e,t)=>{e.tables=t}})}init(e){this.tables||(this.tables={},this.tables.myTable=[],this.tables.myTable.push([0])),this.tableNamesArg={type:t.ArgumentType.String,options:{getItems:this.getTableNames.bind(this),acceptsReporters:!0,handler:e=>void 0===this.getTableNames().indexOf(e)?(alert(`no table with name ${e} exists`),"myTable"):e}},this.defaultNumberArg={type:t.ArgumentType.Number,defaultValue:1}}getTableNames(){return Object.keys(this.tables).map((e=>({text:e,value:e})))}newTable(e){const{name:t,rows:n,columns:r}=e;this.tables[t]=[];for(let e=0;e<n;e++){let e=[];for(let t=0;t<r;t++)e.push(0);this.tables[t].push(e)}}changeTableValue(e){const{name:t,row:n,column:r,value:a}=e;this.tables[t][n][r]=a}defineBlocks(){return{createTable:()=>({type:t.BlockType.Button,text:"new table",operation:()=>this.openUI("Make","Add a table")}),addTable:e=>({type:t.BlockType.Command,args:[e.tableNamesArg,e.defaultNumberArg,e.defaultNumberArg],text:(e,t,n)=>`add table called ${e} with ${t} rows and ${n} columns`,operation:(t,n,r)=>{if(t in e.tables)return void alert("that table already exists");const a={name:t,rows:n,columns:r};e.newTable(a)}}),removeTable:e=>({type:t.BlockType.Command,arg:e.tableNamesArg,text:e=>`remove ${e}`,operation:e=>this.tables[e]?void delete this.tables[e]:void alert("that table doesn't exist")}),insertColumn:e=>({type:t.BlockType.Command,arg:e.tableNamesArg,text:e=>`add column to ${e}`,operation:t=>{if(t in e.tables)for(let e=0;e<this.tables[t].length;e++)this.tables[t][e].push(0);else alert("that table does not exist.")}}),insertRow:e=>({type:t.BlockType.Command,arg:e.tableNamesArg,text:e=>`add row to ${e}`,operation:t=>{if(!(t in e.tables))return void alert("that table does not exist.");let n=[];for(let e=0;e<this.tables[t][0].length;e++)n.push(0);this.tables[t].push(n)}}),insertValueAt:e=>({type:t.BlockType.Command,args:[e.tableNamesArg,t.ArgumentType.Number,e.defaultNumberArg,e.defaultNumberArg],text:(e,t,n,r)=>`insert ${t} at row ${n} and column ${r} of ${e}`,operation:(t,n,r,a)=>{t in e.tables?this.tables[t].length<r?alert("That row value is too high!"):this.tables[t][0].length<a?alert("That column value is too high!"):this.tables[t][r-1][a-1]=n:alert("that table does not exist.")}}),getValueAt:e=>({type:t.BlockType.Reporter,args:[e.tableNamesArg,e.defaultNumberArg,e.defaultNumberArg],text:(e,t,n)=>`item at row ${t} and column ${n} of ${e}`,operation:(t,n,r)=>t in e.tables?this.tables[t].length<n?(alert("That row value is too high!"),-1):this.tables[t][0].length<r?(alert("That column value is too high!"),-1):this.tables[t][n-1][r-1]:(alert("that table does not exist."),-1)}),numberOfRows:e=>({type:t.BlockType.Reporter,arg:e.tableNamesArg,text:e=>`number of rows in ${e}`,operation:t=>t in e.tables?this.tables[t].length:(alert("that table does not exist."),-1)}),numberOfColumns:e=>({type:t.BlockType.Reporter,arg:e.tableNamesArg,text:e=>`number of columns in ${e}`,operation:t=>t in e.tables?this.tables[t][0].length:(alert("that table does not exist."),-1)}),highestValueOfColumn:e=>({type:t.BlockType.Reporter,args:[e.tableNamesArg,e.defaultNumberArg],text:(e,t)=>`highest value of column ${t} in ${e}`,operation:(t,n)=>t in e.tables?this.tables[t].reduce(((e,t)=>Math.max(e,t[n-1])),-1/0):(alert("that table does not exist."),-1)}),highestValueOfRow:e=>({type:t.BlockType.Reporter,args:[e.tableNamesArg,e.defaultNumberArg],text:(e,t)=>`highest value of row ${t} in ${e}`,operation:(t,n)=>t in e.tables?Math.max(...this.tables[t][n-1]):(alert("that table does not exist."),-1)}),indexOfHighestColumnValue:e=>({type:t.BlockType.Reporter,args:[e.tableNamesArg,e.defaultNumberArg],text:(e,t)=>`row # of highest value in column ${t} of ${e}`,operation:(t,n)=>{if(!(t in e.tables))return alert("that table does not exist."),-1;let r=this.tables[t].reduce(((e,t,r)=>e[1]>=t[n-1]?e:[r,t[n-1]]),[-1,-1/0]);return r[0]+1}}),indexOfHighestRowValue:e=>({type:t.BlockType.Reporter,args:[e.tableNamesArg,e.defaultNumberArg],text:(e,t)=>`column # of highest value in row ${t} of ${e}`,operation:(e,t)=>{if(!(e in this.tables))return alert("that table does not exist."),-1;let n=Math.max(...this.tables[e][t-1]);return this.tables[e][t-1].indexOf(n)+1}}),showTable:()=>({type:t.BlockType.Button,text:"view tables",operation:()=>this.openUI("View","View / Edit Table Values")})}}};return o=n,"symbol"==typeof(l="Tables")&&(l=l.description?"[".concat(l.description,"]"):""),Object.defineProperty(o,"name",{configurable:!0,value:i?"".concat(i," ",l):l}),function(e,t,n,r,a,o){function l(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var i,s=r.kind,c="getter"===s?"get":"setter"===s?"set":"value",u=!t&&e?r.static?e:e.prototype:null,d=t||(u?Object.getOwnPropertyDescriptor(u,r.name):{}),p=!1,h=n.length-1;h>=0;h--){var m={};for(var f in r)m[f]="access"===f?{}:r[f];for(var f in r.access)m.access[f]=r.access[f];m.addInitializer=function(e){if(p)throw new TypeError("Cannot add initializers after decoration has completed");o.push(l(e||null))};var b=(0,n[h])("accessor"===s?{get:d.get,set:d.set}:d[c],m);if("accessor"===s){if(void 0===b)continue;if(null===b||"object"!=typeof b)throw new TypeError("Object expected");(i=l(b.get))&&(d.get=i),(i=l(b.set))&&(d.set=i),(i=l(b.init))&&a.push(i)}else(i=l(b))&&("field"===s?a.push(i):d[c]=i)}u&&Object.defineProperty(u,r.name,d),p=!0}(null,e={value:n},r,{kind:"class",name:n.name},null,a),s=n=e.value,function(e,t,n){for(var r=arguments.length>2,a=0;a<t.length;a++)n=r?t[a].call(e,n):t[a].call(e)}(n,a),s=n})();return e.Extension=ze,e.Make=class extends G{constructor(e){super(),U(this,e,Te,fe,i,{extension:7,close:0},me)}},e.View=class extends G{constructor(e){super(),U(this,e,Ve,Re,i,{extension:0,close:1},Ne)}},Object.defineProperty(e,"__esModule",{value:!0}),e}({},ExtensionFramework);//# sourceMappingURL=tables.js.map
// Home Assistant frontend#53890: wait for the final custom element registry.
while (!customElements.get('home-assistant')) {
  await customElements.whenDefined('home-assistant');
}
"use strict";(()=>{var Ae=globalThis,Me=Ae.ShadowRoot&&(Ae.ShadyCSS===void 0||Ae.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ve=Symbol(),mn=new WeakMap,ce=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==Ve)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(Me&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=mn.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&mn.set(e,s))}return s}toString(){return this.cssText}},pe=a=>new ce(typeof a=="string"?a:a+"",void 0,Ve),De=(a,...s)=>{let e=a.length===1?a[0]:s.reduce((t,n,r)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+a[r+1],a[0]);return new ce(e,a,Ve)},gn=(a,s)=>{if(Me)a.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),n=Ae.litNonce;n!==void 0&&t.setAttribute("nonce",n),t.textContent=e.cssText,a.appendChild(t)}},Ue=Me?a=>a:a=>a instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return pe(e)})(a):a;var{is:rt,defineProperty:it,getOwnPropertyDescriptor:at,getOwnPropertyNames:ot,getOwnPropertySymbols:lt,getPrototypeOf:ut}=Object,Se=globalThis,fn=Se.trustedTypes,ct=fn?fn.emptyScript:"",pt=Se.reactiveElementPolyfillSupport,de=(a,s)=>a,Oe={toAttribute(a,s){switch(s){case Boolean:a=a?ct:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,s){let e=a;switch(s){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch{e=null}}return e}},bn=(a,s)=>!rt(a,s),wn={attribute:!0,type:String,converter:Oe,reflect:!1,useDefault:!1,hasChanged:bn};Symbol.metadata??=Symbol("metadata"),Se.litPropertyMetadata??=new WeakMap;var U=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=wn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),n=this.getPropertyDescriptor(s,t,e);n!==void 0&&it(this.prototype,s,n)}}static getPropertyDescriptor(s,e,t){let{get:n,set:r}=at(this.prototype,s)??{get(){return this[e]},set(o){this[e]=o}};return{get:n,set(o){let u=n?.call(this);r?.call(this,o),this.requestUpdate(s,u,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??wn}static _$Ei(){if(this.hasOwnProperty(de("elementProperties")))return;let s=ut(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(de("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(de("properties"))){let e=this.properties,t=[...ot(e),...lt(e)];for(let n of t)this.createProperty(n,e[n])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,n]of e)this.elementProperties.set(t,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let n of t)e.unshift(Ue(n))}else s!==void 0&&e.push(Ue(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return gn(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),n=this.constructor._$Eu(s,t);if(n!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:Oe).toAttribute(e,t.type);this._$Em=s,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(s,e){let t=this.constructor,n=t._$Eh.get(s);if(n!==void 0&&this._$Em!==n){let r=t.getPropertyOptions(n),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Oe;this._$Em=n;let u=o.fromAttribute(e,r.type);this[n]=u??this._$Ej?.get(n)??u,this._$Em=null}}requestUpdate(s,e,t,n=!1,r){if(s!==void 0){let o=this.constructor;if(n===!1&&(r=this[s]),t??=o.getPropertyOptions(s),!((t.hasChanged??bn)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(s)&&!this.hasAttribute(o._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:n,wrapped:r},o){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,o??e??this[s]),r!==!0||o!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),n===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[n,r]of t){let{wrapped:o}=r,u=this[n];o!==!0||this._$AL.has(n)||u===void 0||this.C(n,void 0,r,u)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};U.elementStyles=[],U.shadowRootOptions={mode:"open"},U[de("elementProperties")]=new Map,U[de("finalized")]=new Map,pt?.({ReactiveElement:U}),(Se.reactiveElementVersions??=[]).push("2.1.2");var Ge=globalThis,vn=a=>a,Ce=Ge.trustedTypes,xn=Ce?Ce.createPolicy("lit-html",{createHTML:a=>a}):void 0,An="$lit$",F=`lit$${Math.random().toFixed(9).slice(2)}$`,Mn="?"+F,dt=`<${Mn}>`,Y=document,me=()=>Y.createComment(""),ge=a=>a===null||typeof a!="object"&&typeof a!="function",Xe=Array.isArray,ht=a=>Xe(a)||typeof a?.[Symbol.iterator]=="function",Be=`[ 	
\f\r]`,he=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$n=/-->/g,_n=/>/g,G=RegExp(`>|${Be}(?:([^\\s"'>=/]+)(${Be}*=${Be}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),kn=/'/g,yn=/"/g,Sn=/^(?:script|style|textarea|title)$/i,Ye=a=>(s,...e)=>({_$litType$:a,strings:s,values:e}),i=Ye(1),L=Ye(2),Rt=Ye(3),O=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),jn=new WeakMap,X=Y.createTreeWalker(Y,129);function Cn(a,s){if(!Xe(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return xn!==void 0?xn.createHTML(s):s}var mt=(a,s)=>{let e=a.length-1,t=[],n,r=s===2?"<svg>":s===3?"<math>":"",o=he;for(let u=0;u<e;u++){let l=a[u],p,g,d=-1,m=0;for(;m<l.length&&(o.lastIndex=m,g=o.exec(l),g!==null);)m=o.lastIndex,o===he?g[1]==="!--"?o=$n:g[1]!==void 0?o=_n:g[2]!==void 0?(Sn.test(g[2])&&(n=RegExp("</"+g[2],"g")),o=G):g[3]!==void 0&&(o=G):o===G?g[0]===">"?(o=n??he,d=-1):g[1]===void 0?d=-2:(d=o.lastIndex-g[2].length,p=g[1],o=g[3]===void 0?G:g[3]==='"'?yn:kn):o===yn||o===kn?o=G:o===$n||o===_n?o=he:(o=G,n=void 0);let h=o===G&&a[u+1].startsWith("/>")?" ":"";r+=o===he?l+dt:d>=0?(t.push(p),l.slice(0,d)+An+l.slice(d)+F+h):l+F+(d===-2?u:h)}return[Cn(a,r+(a[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},fe=class a{constructor({strings:s,_$litType$:e},t){let n;this.parts=[];let r=0,o=0,u=s.length-1,l=this.parts,[p,g]=mt(s,e);if(this.el=a.createElement(p,t),X.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=X.nextNode())!==null&&l.length<u;){if(n.nodeType===1){if(n.hasAttributes())for(let d of n.getAttributeNames())if(d.endsWith(An)){let m=g[o++],h=n.getAttribute(d).split(F),w=/([.?@])?(.*)/.exec(m);l.push({type:1,index:r,name:w[2],strings:h,ctor:w[1]==="."?Ie:w[1]==="?"?Fe:w[1]==="@"?Ke:re}),n.removeAttribute(d)}else d.startsWith(F)&&(l.push({type:6,index:r}),n.removeAttribute(d));if(Sn.test(n.tagName)){let d=n.textContent.split(F),m=d.length-1;if(m>0){n.textContent=Ce?Ce.emptyScript:"";for(let h=0;h<m;h++)n.append(d[h],me()),X.nextNode(),l.push({type:2,index:++r});n.append(d[m],me())}}}else if(n.nodeType===8)if(n.data===Mn)l.push({type:2,index:r});else{let d=-1;for(;(d=n.data.indexOf(F,d+1))!==-1;)l.push({type:7,index:r}),d+=F.length-1}r++}}static createElement(s,e){let t=Y.createElement("template");return t.innerHTML=s,t}};function se(a,s,e=a,t){if(s===O)return s;let n=t!==void 0?e._$Co?.[t]:e._$Cl,r=ge(s)?void 0:s._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(a),n._$AT(a,e,t)),t!==void 0?(e._$Co??=[])[t]=n:e._$Cl=n),n!==void 0&&(s=se(a,n._$AS(a,s.values),n,t)),s}var Ne=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,n=(s?.creationScope??Y).importNode(e,!0);X.currentNode=n;let r=X.nextNode(),o=0,u=0,l=t[0];for(;l!==void 0;){if(o===l.index){let p;l.type===2?p=new we(r,r.nextSibling,this,s):l.type===1?p=new l.ctor(r,l.name,l.strings,this,s):l.type===6&&(p=new Je(r,this,s)),this._$AV.push(p),l=t[++u]}o!==l?.index&&(r=X.nextNode(),o++)}return X.currentNode=Y,n}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},we=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,n){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=se(this,s,e),ge(s)?s===c||s==null||s===""?(this._$AH!==c&&this._$AR(),this._$AH=c):s!==this._$AH&&s!==O&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):ht(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==c&&ge(this._$AH)?this._$AA.nextSibling.data=s:this.T(Y.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,n=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=fe.createElement(Cn(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===n)this._$AH.p(e);else{let r=new Ne(n,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(s){let e=jn.get(s.strings);return e===void 0&&jn.set(s.strings,e=new fe(s)),e}k(s){Xe(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,n=0;for(let r of s)n===e.length?e.push(t=new a(this.O(me()),this.O(me()),this,this.options)):t=e[n],t._$AI(r),n++;n<e.length&&(this._$AR(t&&t._$AB.nextSibling,n),e.length=n)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=vn(s).nextSibling;vn(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},re=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,n,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=s,this.name=e,this._$AM=n,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=c}_$AI(s,e=this,t,n){let r=this.strings,o=!1;if(r===void 0)s=se(this,s,e,0),o=!ge(s)||s!==this._$AH&&s!==O,o&&(this._$AH=s);else{let u=s,l,p;for(s=r[0],l=0;l<r.length-1;l++)p=se(this,u[t+l],e,l),p===O&&(p=this._$AH[l]),o||=!ge(p)||p!==this._$AH[l],p===c?s=c:s!==c&&(s+=(p??"")+r[l+1]),this._$AH[l]=p}o&&!n&&this.j(s)}j(s){s===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},Ie=class extends re{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===c?void 0:s}},Fe=class extends re{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==c)}},Ke=class extends re{constructor(s,e,t,n,r){super(s,e,t,n,r),this.type=5}_$AI(s,e=this){if((s=se(this,s,e,0)??c)===O)return;let t=this._$AH,n=s===c&&t!==c||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,r=s!==c&&(t===c||n);n&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},Je=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){se(this,s)}};var gt=Ge.litHtmlPolyfillSupport;gt?.(fe,we),(Ge.litHtmlVersions??=[]).push("3.3.3");var En=(a,s,e)=>{let t=e?.renderBefore??s,n=t._$litPart$;if(n===void 0){let r=e?.renderBefore??null;t._$litPart$=n=new we(s.insertBefore(me(),r),r,void 0,e??{})}return n._$AI(a),n};var Qe=globalThis,V=class extends U{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=En(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return O}};V._$litElement$=!0,V.finalized=!0,Qe.litElementHydrateSupport?.({LitElement:V});var ft=Qe.litElementPolyfillSupport;ft?.({LitElement:V});(Qe.litElementVersions??=[]).push("4.2.2");var zn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ln=a=>(...s)=>({_$litDirective$:a,values:s}),Ee=class{constructor(s){}get _$AU(){return this._$AM._$AU}_$AT(s,e,t){this._$Ct=s,this._$AM=e,this._$Ci=t}_$AS(s,e){return this.update(s,e)}update(s,e){return this.render(...e)}};var be=class extends Ee{constructor(s){if(super(s),this.it=c,s.type!==zn.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(s){if(s===c||s==null)return this._t=void 0,this.it=s;if(s===O)return s;if(typeof s!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(s===this.it)return this._t;this.it=s;let e=[s];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};be.directiveName="unsafeHTML",be.resultType=1;var qn=Ln(be);var Rn=`/* CHARTE COMMUNE HESTIA \u2014 jetons et pi\xE8ces partag\xE9s par toutes les cartes Hestia.
   Valeurs reprises de la carte Hestia Weather (card/src/ui/charter.ts), qui fait r\xE9f\xE9rence.
   Modifier ICI, puis recopier avec charte/copier.sh dans chaque carte : jamais directement dans une brique. */
:host {
  /* Couleurs du th\xE8me Home Assistant, avec replis. */
  --nw-fg: var(--primary-text-color, #212121);
  --nw-fg2: var(--secondary-text-color, #727272);
  --nw-bg: var(--ha-card-background, var(--card-background-color, #fff));
  --nw-accent: var(--primary-color, #03a9f4);
  /* Contours et arrondis : un seul arrondi pour toutes les bo\xEEtes, un pour les pastilles. */
  --nw-line: color-mix(in srgb, var(--nw-fg) 13%, transparent);
  --nw-line-soft: color-mix(in srgb, var(--nw-fg) 8%, transparent);
  --nw-radius-card: var(--ha-card-border-radius, 12px);
  --nw-radius: 14px;
  --nw-radius-pill: 999px;
  --nw-glass-strong: color-mix(in srgb, var(--nw-bg) 84%, transparent);
  --nw-blur: blur(6px) saturate(1.2);
  /* Verre d\xE9poli pos\xE9 sur le fond color\xE9 (frise de Weather, \xE9chelle de Confort) : plus clair, plus flou. */
  --nw-glass-clear: color-mix(in srgb, var(--nw-bg) 45%, transparent);
  --nw-frost: blur(14px) saturate(1.6);
  --nw-frame-line: color-mix(in srgb, var(--nw-fg) 16%, transparent);
  --nw-pad-panel: 18px 20px;
  /* Sept tailles de texte, rien d'autre (\xE9chelle C, 3 novembre) : \xE9tiquette 11 \xB7 secondaire 12 \xB7 texte et titre de case 14 \xB7
     titre de carte et de section 17 \xB7 valeur de case 21 \xB7 conseil et valeur vedette 34 \xB7 temp\xE9rature 58. */
  --nw-fs-label: 11px; --nw-fs-small: 12px; --nw-fs-text: 14px; --nw-fs-title: 17px; --nw-fs-case: 21px; --nw-fs-value: 34px; --nw-fs-temp: 58px;
  --nw-label-spacing: .6px;
  /* Couleurs de sens, palette \xAB Aube \xBB (OKLCH, m\xEAme clart\xE9 et m\xEAme saturation). Un th\xE8me peut les remplacer. */
  --nw-rain: var(--hestia-rain-color, oklch(.8 .07 190));
  --nw-wind: var(--hestia-wind-color, oklch(.79 .075 280));
  --nw-heat: var(--hestia-heat-color, oklch(.83 .085 42));
  --nw-cold: var(--hestia-cold-color, oklch(.85 .05 220));
  --nw-calm: var(--hestia-calm-color, oklch(.83 .075 150));
  --nw-pressure: var(--hestia-pressure-color, oklch(.78 .07 315));
  --nw-level1: var(--hestia-level1-color, oklch(.88 .1 96));
  --nw-level2: var(--hestia-level2-color, oklch(.81 .105 64));
  --nw-level3: var(--hestia-level3-color, oklch(.74 .115 18));
  /* Couleurs d'\xE9tat, communes \xE0 toutes les cartes : elles disent s'il y a quelque chose \xE0 FAIRE, pas o\xF9 tombe une mesure.
     Bleu tout va bien \xB7 vert b\xE9n\xE9fice \xE0 saisir ou en cours \xB7 orange geste utile maintenant \xB7 rouge urgent \xB7
     ambre mesure hors de votre plage, sans geste demand\xE9 \xB7 gris (texte secondaire) \xE0 v\xE9rifier.
     La vigilance m\xE9t\xE9o garde sa propre \xE9chelle jaune / orange / rouge (--nw-level1 \xE0 3). */
  --nw-ok: var(--hestia-ok-color, var(--nw-cold));
  --nw-benefit: var(--hestia-benefit-color, var(--nw-calm));
  --nw-act: var(--hestia-act-color, var(--nw-level2));
  --nw-alert: var(--hestia-alert-color, var(--nw-level3));
  --nw-watch: var(--hestia-watch-color, oklch(.84 .13 86));
  /* Part de couleur dans un texte color\xE9 : 34 % reste lisible (contraste 4,5:1). */
  --nw-ink: 34%;
  --nw-ease: cubic-bezier(.2, .8, .2, 1);
  --nw-expand: .45s;
}
button { font:inherit; color:inherit; }
button:focus-visible { outline:2px solid var(--nw-accent); outline-offset:2px; }
.sr { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; }
/* \xC9tiquette en petites capitales, une seule taille partout (style Trait, 3 novembre). */
.nw-label { font-size:var(--nw-fs-label); line-height:14px; font-weight:650; letter-spacing:.08em; text-transform:uppercase; color:var(--nw-fg2); white-space:nowrap; }
/* Texte color\xE9 toujours lisible : la couleur de sens m\xE9lang\xE9e au texte. */
.nw-ink { font-size:var(--nw-fs-small); font-weight:600; color:color-mix(in oklab, var(--c) var(--nw-ink), var(--nw-fg)); }
/* Pastille de source : une seule r\xE8gle. */
.nw-badge { display:inline-flex; align-items:center; font-size:var(--nw-fs-small); line-height:18px; font-weight:500; white-space:nowrap; padding:3px 10px;
  border-radius:var(--nw-radius-pill); border:1px solid var(--nw-line); background:color-mix(in srgb, var(--nw-bg) 70%, transparent); color:var(--nw-fg);
  max-width:100%; overflow:hidden; text-overflow:ellipsis; box-sizing:border-box; }
/* Pastille d'info teint\xE9e. */
.nw-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:var(--nw-radius-pill); font-size:var(--nw-fs-small); line-height:18px; font-weight:600;
  white-space:nowrap; border:1px solid transparent; background:color-mix(in oklab, var(--c) 24%, transparent); color:color-mix(in oklab, var(--c) var(--nw-ink), var(--nw-fg)); }
.nw-chips { display:flex; flex-wrap:wrap; gap:8px; }
/* ---------- Structure commune des cartes (style Trait, 3 novembre) : la m\xEAme dans Weather, Confort et les prochaines briques. ---------- */
/* La carte : Manrope, angles de 22 px ; la surface teint\xE9e des panneaux. */
ha-card { font-family:Manrope, var(--ha-font-family-body, Roboto), system-ui, sans-serif; line-height:1.5; border-radius:22px;
  --nw-surface:color-mix(in srgb, var(--nw-fg) 3.5%, var(--nw-bg)); }
/* Le titre de la carte (\xAB Synth\xE8se \xBB, le nom de la pi\xE8ce) et la grande temp\xE9rature fine. */
.nw-title { margin:0; font-size:var(--nw-fs-title); line-height:1.25; font-weight:700; letter-spacing:-.02em; }
/* La lecture (3 novembre) : la grande temp\xE9rature, son unit\xE9 en exposant hors du bloc des chiffres, le mini\u2013maxi align\xE9 \xE0 droite
   sur la fin des chiffres (apr\xE8s la virgule, avant \xAB \xB0C \xBB). La m\xEAme dans Weather et Confort (hestia-lecture.ts). */
.nw-reading { display:inline-grid; justify-items:end; padding-right:26px; }
.nw-reading .nw-temp { position:relative; }
.nw-reading .nw-temp sup { position:absolute; left:100%; top:.3em; margin-left:3px; font-size:var(--nw-fs-text); line-height:1; font-weight:500; letter-spacing:0; color:var(--nw-fg2); }
.nw-reading-tap { all:unset; cursor:pointer; border-radius:8px; }
.nw-reading-tap:focus-visible { outline:2px solid var(--nw-accent); outline-offset:2px; }
.nw-reading-more { margin-top:4px; font-size:var(--nw-fs-small); color:var(--nw-fg2); white-space:nowrap; }
.nw-range { margin-top:4px; font-size:var(--nw-fs-small); font-weight:500; color:var(--nw-fg2); font-variant-numeric:tabular-nums; white-space:nowrap; }
/* 58 px au plus, plus petite dans une carte \xE9troite (15 % de sa largeur) : le titre et son \xAB i \xBB gardent leur ligne. */
.nw-temp { font-size:min(var(--nw-fs-temp), 15cqi); font-weight:300; letter-spacing:-.05em; line-height:1; font-variant-numeric:tabular-nums; }
/* Le titre d'une section (\xAB Aujourd'hui \xBB, \xAB Maintenant \xBB) : en clair, son r\xE9sum\xE9 \xE0 c\xF4t\xE9, le chevron rond \xE0 droite s'il se replie. */
.nw-section-head { display:flex; align-items:center; gap:10px; min-width:0; }
.nw-section-head h2 { margin:0; font-size:var(--nw-fs-title); line-height:1.3; font-weight:700; letter-spacing:-.2px; }
.nw-section-head .nw-sum { flex:1; min-width:0; font-size:var(--nw-fs-text); color:var(--nw-fg2); }
/* Le panneau : une surface teint\xE9e, sans contour, arrondie dans l'arrondi de la carte. */
.nw-panel { min-width:0; box-sizing:border-box; padding:14px 16px; border:0; border-radius:16px; background:var(--nw-surface); }
/* Son en-t\xEAte : un pictogramme au trait, le titre et son \xAB i \xBB, un mot ou des onglets \xE0 droite. */
.nw-panel-head { display:flex; flex-wrap:wrap; align-items:center; gap:8px; min-width:0; }
.nw-panel-icon { display:grid; place-items:center; flex:none; color:var(--nw-fg2); }
.nw-panel-icon ha-icon { --mdc-icon-size:18px; display:flex; } .nw-panel-icon svg { width:18px; height:18px; }
.nw-panel-head h3 { display:flex; align-items:center; gap:8px; margin:0; min-width:0; font-size:var(--nw-fs-text); line-height:1.3; font-weight:650; letter-spacing:0; white-space:nowrap; }
.nw-panel-head h3 > span { overflow:hidden; text-overflow:ellipsis; }
.nw-panel-head .aside { margin-left:auto; font-size:var(--nw-fs-small); line-height:1.4; font-weight:500; color:var(--nw-fg2); }
.nw-panel-head .seg { margin-left:auto; }
/* La grande valeur fine et son unit\xE9 ; la phrase grise qui la suit. */
.nw-value { display:flex; align-items:baseline; gap:5px; }
.nw-value b { font-size:var(--nw-fs-value); font-weight:300; letter-spacing:-.04em; line-height:1.1; font-variant-numeric:tabular-nums; }
.nw-value > span, .nw-value b small { font-size:var(--nw-fs-text); line-height:1.1; font-weight:500; letter-spacing:0; color:var(--nw-fg2); }
/* Dans une grille de petites cases (.nw-cases), la valeur passe \xE0 21 demi-gras : la grande valeur fine reste \xE0 la case pleine largeur. */
.nw-cases .nw-value b { font-size:var(--nw-fs-case); font-weight:600; letter-spacing:-.015em; line-height:1.2; }
.nw-say { font-size:var(--nw-fs-small); color:var(--nw-fg2); }
/* Les chiffres sous un panneau : leur nom en petits mots simples, jamais coup\xE9s, la valeur en gras. */
.nw-stats { display:grid; grid-template-columns:repeat(var(--n, 3), minmax(0,1fr)); gap:8px; margin-top:auto; padding-top:10px; border-top:1px solid color-mix(in srgb, var(--nw-fg) 6%, transparent); }
.nw-stats > * { display:flex; flex-direction:column; gap:2px; min-width:0; }
.nw-stats > * > :first-child { font-size:var(--nw-fs-label); line-height:1.35; font-weight:500; letter-spacing:0; text-transform:none; color:var(--nw-fg2); white-space:normal; }
.nw-stats b { font-size:var(--nw-fs-text); line-height:1.35; font-weight:650; font-variant-numeric:tabular-nums; }
/* L\xE9gende : toujours centr\xE9e sous son graphique. */
.nw-legend { display:flex; justify-content:center; flex-wrap:wrap; gap:6px 16px; font-size:var(--nw-fs-small); color:var(--nw-fg2); }
.nw-legend span { display:inline-flex; align-items:center; gap:6px; }
/* Une valeur pos\xE9e sur un graphique. */
.nw-pill { position:absolute; transform:translate(-50%, -130%); font-size:var(--nw-fs-small); font-weight:700; padding:2px 8px; border-radius:var(--nw-radius-pill);
  background:var(--nw-bg); border:1px solid var(--nw-line); box-shadow:0 2px 6px #0001; white-space:nowrap; }
/* Bouton \xAB i \xBB (3 novembre) : un petit disque gris, sans contour ; la lettre est dessin\xE9e ici, la m\xEAme dans toutes les cartes.
   Le bouton reste vide (son aria-label dit ce qu'il explique). */
.nw-info { display:inline-grid; place-items:center; width:18px; height:18px; min-height:0; margin:0; padding:0; flex:none; border-radius:50%; border:0;
  background:color-mix(in srgb, var(--nw-fg) 6%, transparent); color:var(--nw-fg2); cursor:pointer; font:700 var(--nw-fs-label)/1 Manrope, system-ui, sans-serif; }
.nw-info::before { content:'i'; }
.nw-info > * { display:none; }
.nw-info:hover { color:var(--nw-fg); background:color-mix(in srgb, var(--nw-fg) 10%, transparent); }
/* Section repliable : \xE9tiquette, r\xE9sum\xE9, chevron rond (vers le bas repli\xE9, vers le haut ouvert). */
.nw-fold-head { display:flex; align-items:center; gap:10px; width:100%; border:0; background:none; padding:0; cursor:pointer; text-align:left; }
.nw-fold-head .nw-sum { flex:1; min-width:0; font-size:var(--nw-fs-small); color:var(--nw-fg2); }
.nw-chevron { display:grid; place-items:center; width:30px; height:30px; flex:none; border-radius:50%; border:1px solid var(--nw-line); transition:transform var(--nw-expand) var(--nw-ease); }
.nw-fold-head[aria-expanded="true"] .nw-chevron { transform:rotate(180deg); }
/* Survol d'une section : pas de bandeau gris, c'est le chevron qui s'allume et le titre qui se renforce. */
.nw-fold-head:hover { background:none; }
.nw-chevron { transition:transform var(--nw-expand) var(--nw-ease), background .2s, border-color .2s; }
.nw-fold-head:hover .nw-chevron { background:color-mix(in srgb, var(--nw-fg) 8%, transparent); border-color:color-mix(in srgb, var(--nw-fg) 32%, transparent); }
.nw-fold-head:hover .nw-label { color:var(--nw-fg); }
@media (prefers-reduced-motion:reduce) { .nw-chevron { transition:none; } }
/* Cadre de verre d\xE9poli (le fil de Weather, le bandeau de Confort) : verre clair, liser\xE9 net, angles de 16 px, jamais d'ombre.
   Le r\xE9glage \xAB Effet de verre \xBB d\xE9coch\xE9 (:host([flat])) le rend opaque et sans flou. */
.nw-glass { background:var(--nw-glass-clear); backdrop-filter:var(--nw-frost); -webkit-backdrop-filter:var(--nw-frost);
  border:1px solid var(--nw-frame-line, color-mix(in srgb, var(--nw-fg) 16%, transparent)); border-radius:16px; box-shadow:none; }
/* Le m\xEAme cadre, plus opaque, quand il porte les chiffres cl\xE9s sur un ciel clair (\xAB En ce moment \xBB) : ils restent lisibles. */
.nw-glass.nw-glass-solid { background:color-mix(in srgb, var(--nw-bg) 68%, transparent); }
:host([flat]) { --nw-blur:none; --nw-frost:none; --nw-glass-clear:var(--nw-bg); --nw-glass-strong:var(--nw-bg); }

/* ---------- Le bandeau (5 novembre, carte \xAB Mon logement \xBB) : le geste du moment, le m\xEAme dans toutes les cartes. ----------
   Le cadre (.nw-band, pos\xE9 avec .nw-glass) prend la couleur de son \xE9tat par data-level ; dedans, une rang\xE9e (.nw-band-row) :
   la sc\xE8ne ou le pictogramme \xE0 gauche (.nw-band-pic), puis le texte (.nw-band-text) : au-dessus, la pi\xE8ce ou le moment
   (.nw-band-kicker) ; le geste en 34 (.nw-band-title), color\xE9 quand il y a un geste \xE0 faire ; pourquoi (.nw-band-line) ;
   une note grise (.nw-band-note : \xAB Puis refermez \xBB, la preuve). Plusieurs conseils : des barres en bas du cadre (.nw-band-bars). */
.nw-band { --c:var(--nw-ok); position:relative; box-sizing:border-box; min-width:0; padding:16px; }
.nw-band[data-level="benefit"] { --c:var(--nw-benefit); } .nw-band[data-level="action"] { --c:var(--nw-act); } .nw-band[data-level="urgent"] { --c:var(--nw-alert); }
.nw-band[data-level="neutral"] { --c:color-mix(in srgb, var(--nw-fg) 25%, transparent); }
.nw-band:has(.nw-band-bars) { padding-bottom:26px; }
.nw-band-row { display:flex; align-items:center; gap:16px; min-width:0; }
.nw-band-pic { display:grid; place-items:center; flex:none; order:-1; }
/* Sans sc\xE8ne (mesures en chargement, capteurs muets) : le pictogramme dans un carr\xE9 teint\xE9. */
.nw-band-pic.box { width:60px; height:72px; border-radius:10px; background:color-mix(in srgb, var(--c) 34%, transparent); color:var(--nw-fg); }
.nw-band-pic.box svg, .nw-band-pic.box ha-icon { width:34px; height:34px; --mdc-icon-size:34px; }
.nw-band-text { flex:1; min-width:0; }
.nw-band-text p { margin:0; }
.nw-band-kicker { display:flex; align-items:center; flex-wrap:wrap; gap:4px 8px; margin-bottom:4px; font-size:var(--nw-fs-label); line-height:14px; font-weight:650;
  letter-spacing:.08em; text-transform:uppercase; color:var(--nw-fg); }
.nw-band-kicker i { font-style:normal; font-weight:600; letter-spacing:0; text-transform:none; color:var(--nw-fg2); }
.nw-band-title { font-size:var(--nw-fs-value); font-weight:650; letter-spacing:-.03em; line-height:1.1; text-wrap:balance; }
/* Color\xE9 pour un geste seulement : un \xAB Rien \xE0 faire \xBB qui garde quelque chose \xAB \xE0 saisir \xBB ne s'\xE9crit jamais en vert (5 novembre). */
.nw-band:is([data-level="action"], [data-level="urgent"]) .nw-band-title { color:color-mix(in oklab, var(--c) 45%, var(--nw-fg)); }
.nw-band-line { margin-top:6px !important; font-size:var(--nw-fs-text); line-height:1.5; color:var(--nw-fg2); }
.nw-band-line b { color:var(--nw-fg); font-weight:650; }
.nw-band-note { display:flex; align-items:center; gap:6px; margin-top:6px !important; font-size:var(--nw-fs-small); color:var(--nw-fg2); }
.nw-band-note svg, .nw-band-note ha-icon { width:13px; height:13px; flex:none; --mdc-icon-size:13px; }
.nw-band-bars { position:absolute; left:16px; right:16px; bottom:6px; display:flex; gap:6px; }
.nw-band-bars button { flex:1; min-height:0; margin:0; padding:6px 0; border:0; background:none; cursor:pointer; }
.nw-band-bars span { display:block; height:3px; border-radius:2px; background:color-mix(in srgb, var(--nw-fg) 16%, transparent); }
.nw-band-bars button[aria-current="true"] span { background:color-mix(in oklab, var(--c) 70%, var(--nw-fg)); }

/* ---------- Le petit rond de valeur (3 novembre) : la valeur sur une piste (\xE9chelles) et la bulle affich\xE9e du fil. ---------- */
.nw-dot { position:absolute; z-index:3; width:8px; height:8px; margin-left:-4px; border-radius:50%; background:var(--nw-fg); box-shadow:0 0 0 1.5px var(--nw-bg); }
.nw-dot::after { content:''; position:absolute; inset:-2px; border-radius:50%; border:1.5px solid var(--nw-fg);
  animation:nw-ripple 2.4s var(--nw-ease) infinite; animation-play-state:var(--nw-motion, running); }
@keyframes nw-ripple { from { transform:scale(.6); opacity:.9; } to { transform:scale(2.2); opacity:0; } }

/* ---------- L'\xE9chelle fa\xE7on fil (3 novembre, maquettes/planche-echelles.html) : Ressenti de Weather, temp\xE9rature de Confort. ----------
   Une piste en relief d\xE9coup\xE9e en tron\xE7ons nomm\xE9s ; la valeur dans une bulle teint\xE9e de son tron\xE7on (--tone), un trait fin jusqu'\xE0 la piste,
   le petit rond sur la piste ; les rep\xE8res dessous (ligne basse) ou dessus (ligne haute) ; le min\u2013max en fin trait ; un rep\xE8re creux (dehors). */
.nw-scale { position:relative; height:84px; margin:0 6px; }
.nw-scale-lane { position:absolute; left:0; right:0; top:44px; height:18px; display:flex; gap:3px; }
.nw-scale-part { display:grid; place-items:center; min-width:0; overflow:hidden; border-radius:6px; font-style:normal; transform-origin:left; container-type:inline-size;
  background:linear-gradient(180deg, color-mix(in oklab, var(--tone) 85%, #fff), color-mix(in oklab, var(--tone) 78%, transparent));
  box-shadow:inset 0 1px 0 rgb(255 255 255 / .35), inset 0 -1px 0 rgb(0 0 0 / .08); animation:nw-grow .52s var(--nw-ease) both; animation-delay:calc(var(--n, 0) * 90ms); }
.nw-scale-part:first-child { border-radius:9px 6px 6px 9px; } .nw-scale-part:last-child { border-radius:6px 9px 9px 6px; } .nw-scale-part:only-child { border-radius:9px; }
.nw-scale-part span { font-size:var(--nw-fs-label); line-height:1; font-weight:700; letter-spacing:.02em; color:rgb(20 26 45 / .72); white-space:nowrap; }
@container (max-width:62px) { .nw-scale-part span { display:none; } }
.nw-scale-part.wl { place-items:center start; padding-left:10px; } .nw-scale-part.wr { place-items:center end; padding-right:10px; }
@keyframes nw-grow { from { transform:scaleX(0); } }
/* La bulle peut \xEAtre un bouton (un appui ouvre le d\xE9tail) : la r\xE8gle passe devant celles des boutons d'une brique.
   Son fond prend 40 % de la teinte au plus : le texte garde un contraste de 4,5 en th\xE8me sombre, quelle que soit la teinte. */
.nw-scale .nw-scale-pin { --tx:-50%; position:absolute; min-height:0; margin:0; font-family:inherit; top:8px; z-index:2; display:inline-flex; align-items:center; padding:3px 9px; border:0; border-radius:var(--nw-radius-pill);
  white-space:nowrap; font-size:var(--nw-fs-small); font-weight:700; line-height:18px; font-variant-numeric:tabular-nums; color:var(--nw-fg); transform:translateX(var(--tx)) translateY(-2px) scale(1.04);
  background:color-mix(in oklab, var(--tone) 40%, var(--nw-bg)); box-shadow:0 0 0 1px var(--nw-line), 0 4px 10px -4px rgb(0 0 0 / .35); animation:nw-pop .3s var(--nw-ease) .2s both; }
.nw-scale .nw-scale-pin.edge-l { --tx:-14px; } .nw-scale .nw-scale-pin.edge-r { --tx:calc(-100% + 14px); }
@keyframes nw-pop { from { opacity:0; transform:translateX(var(--tx)) translateY(6px) scale(.92); } }
.nw-scale-stem { position:absolute; top:31px; z-index:1; width:1.5px; height:13px; margin-left:-.75px; background:color-mix(in oklab, var(--tone) 70%, var(--nw-fg)); }
.nw-scale .nw-dot { top:49px; }
.nw-scale-span { position:absolute; top:37px; height:3px; border-radius:2px; background:color-mix(in srgb, var(--nw-fg) 45%, transparent); }
.nw-scale-span::before, .nw-scale-span::after { content:''; position:absolute; top:-2px; width:1.5px; height:7px; border-radius:1px; background:inherit; }
.nw-scale-span::before { left:0; } .nw-scale-span::after { right:0; }
/* La temp\xE9rature r\xE9elle \xE0 c\xF4t\xE9 du ressenti (Weather) ou dehors (Confort) : un trait fin en travers de l'\xE9chelle (3 novembre, \xAB partout sur le trait \xBB). */
.nw-scale .nw-scale-mk { position:absolute; top:40px; z-index:2; width:2px; height:26px; min-height:0; margin:0 0 0 -1px; padding:0; box-sizing:border-box; border:0; border-radius:1px;
  background:color-mix(in srgb, var(--nw-fg) 85%, transparent); box-shadow:0 0 0 1px color-mix(in srgb, var(--nw-bg) 60%, transparent); }
/* Le doigt le trouve : la zone d'appui est plus large que le trait. */
button.nw-scale-mk::before { content:''; position:absolute; inset:-6px -10px; }
.nw-scale-lb { position:absolute; top:66px; translate:-50% 0; font-size:var(--nw-fs-label); line-height:16px; color:var(--nw-fg2); white-space:nowrap; font-variant-numeric:tabular-nums; }
.nw-scale-lb.up { top:22px; } .nw-scale-lb.first { translate:0 0; } .nw-scale-lb.last { translate:-100% 0; } .nw-scale-lb b { color:var(--nw-fg); font-weight:650; }
@media (prefers-reduced-motion:reduce) { .nw-scale-part, .nw-scale-pin, .nw-dot::after { animation:none; } }
/* La frise compacte (4 novembre, maquettes/planche-ressenti-condense.html, variante D) : la m\xEAme piste et ses mots, une bulle plus petite,
   sans ligne de rep\xE8res ; la plage et le dehors se disent ailleurs. Le Ressenti de la carte compl\xE8te de Confort. */
.nw-scale.compact { height:46px; margin:0 2px; }
.nw-scale.compact .nw-scale-lane { top:26px; height:16px; }
.nw-scale.compact .nw-scale-pin { top:0; padding:0 7px; font-size:var(--nw-fs-label); line-height:16px; transform:translateX(var(--tx)); box-shadow:0 0 0 1px var(--nw-line); }
.nw-scale.compact .nw-scale-stem { top:16px; height:10px; }
.nw-scale.compact .nw-dot { top:30px; }

/* ---------- Fl\xE8ches et chevrons (3 novembre, maquettes/planche-fleches.html) : un seul dessin au trait, pos\xE9 par la charte. ----------
   La tendance (.nw-trend) ne s'affiche que si la mesure monte ou baisse vraiment ; \xAB stable \xBB garde sa place sans rien montrer.
   Sa couleur : vert, elle revient vers votre plage ; orange, elle s'en \xE9loigne ; gris sinon. Elle glisse d'un cran en apparaissant, jamais en boucle.
   Le vent prend la m\xEAme fl\xE8che, tourn\xE9e vers o\xF9 il va (--r). Le chevron (.nw-chev) ouvre et replie ; il tourne d'un quart en s'ouvrant. */
.nw-trend, .nw-chev { display:inline-block; flex:none; background:currentColor; vertical-align:-1px; transform:rotate(var(--r, 0deg));
  -webkit-mask:var(--nw-glyph) center / contain no-repeat; mask:var(--nw-glyph) center / contain no-repeat; }
.nw-trend { width:12px; height:12px; color:var(--nw-fg2);
  --nw-glyph:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 10.5V1.8M2.4 5.2 6 1.6l3.6 3.6'/%3E%3C/svg%3E");
  animation:nw-nudge .5s var(--nw-ease) both; }
.nw-trend[data-way="down"] { --r:180deg; }
.nw-trend[data-way="stable"] { visibility:hidden; animation:none; }
/* Apr\xE8s une grande valeur, \xAB stable \xBB ne laisse pas m\xEAme de place ; dans une liste, il la garde pour l'alignement. */
.nw-value .nw-trend[data-way="stable"] { display:none; }
.nw-trend[data-tone="better"] { color:color-mix(in oklab, var(--nw-calm) 75%, var(--nw-fg)); }
.nw-trend[data-tone="worse"] { color:color-mix(in oklab, var(--nw-level2) 80%, var(--nw-fg)); }
@keyframes nw-nudge { from { opacity:0; translate:0 3px; } }
.nw-trend[data-way="down"] { animation-name:nw-nudge-down; } @keyframes nw-nudge-down { from { opacity:0; translate:0 -3px; } }
.nw-chev { width:14px; height:14px; color:var(--nw-fg2); transition:transform .22s var(--nw-ease);
  --nw-glyph:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 6l6 6-6 6'/%3E%3C/svg%3E"); }
.nw-chev.open, [aria-expanded="true"] > .nw-chev, details[open] > summary .nw-chev { --r:90deg; }
/* Le vent : la m\xEAme fl\xE8che, tourn\xE9e vers o\xF9 il va, \xE0 sa couleur, sans entr\xE9e anim\xE9e. */
.nw-trend.wind { width:10px; height:10px; color:color-mix(in oklab, var(--nw-wind) 70%, var(--nw-fg)); animation:none; }
/* Une fl\xE8che suivie de mots ou d'un chiffre gris (\xAB +4,4 \xB0C/h \xBB, \xAB s'approchent \xBB) : sur une ligne, un petit \xE9cart. */
.nw-say:has(> .nw-trend) { display:inline-flex; align-items:center; gap:5px; }
/* Dans le bouton rond d'une section, le chevron pointe vers le bas ; c'est le bouton qui tourne en s'ouvrant. */
.nw-chevron .nw-chev { --r:90deg; }
@media (prefers-reduced-motion:reduce) { .nw-trend { animation:none; } .nw-chev { transition:none; } }


/* ---------- Le Ressenti (3 novembre, maquettes/maquette-ressenti-piece.html) : celui de Weather dehors, celui d'une pi\xE8ce de Confort. ----------
   La valeur et son mot, l'\xE9chelle, puis ce qui joue en cases d\xE9limit\xE9es : leur titre, leur effet en un mot teint\xE9, la valeur, une note.
   Quatre cases par ligne dans une carte large, ou --nw-ff-cols. */
.nw-feel-row { display:flex; align-items:baseline; flex-wrap:wrap; gap:4px 12px; }
.nw-feel-word { font-size:var(--nw-fs-text); font-weight:650; }
.nw-feel-say { font-size:var(--nw-fs-small); color:var(--nw-fg2); }
.nw-feel-ends { display:flex; justify-content:space-between; margin:2px 6px 0; font-size:var(--nw-fs-label); color:var(--nw-fg2); font-variant-numeric:tabular-nums; }
.nw-feel-factors { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:8px; }
@container (min-width:600px) { .nw-feel-factors { grid-template-columns:repeat(var(--nw-ff-cols, 4), minmax(0,1fr)); } }
.nw-feel-factors > * { container-type:inline-size; display:grid; gap:2px; align-content:start; padding:10px 12px; border-radius:12px; min-width:0;
  background:var(--nw-bg); border:1px solid color-mix(in srgb, var(--nw-fg) 14%, transparent); }
.nw-ff-head { display:flex; justify-content:space-between; align-items:center; gap:6px; font-size:var(--nw-fs-small); color:var(--nw-fg2); min-width:0; }
.nw-ff-t { display:flex; align-items:center; gap:6px; min-width:0; line-height:1.3; }
.nw-ff-t ha-icon, .nw-ff-t svg { flex:none; } .nw-ff-head ha-icon { --mdc-icon-size:15px; } .nw-ff-t svg { width:15px; height:15px; }
/* Une case \xE9troite : l'effet sous le titre, dans toutes les cases pareil. */
@container (max-width:150px) { .nw-ff-head { flex-direction:column; align-items:flex-start; gap:4px; } }
.nw-ff-eff { flex:none; padding:0 6px; border-radius:var(--nw-radius-pill); font-size:var(--nw-fs-label); font-weight:700; white-space:nowrap;
  background:color-mix(in oklab, var(--c) 28%, transparent); color:color-mix(in oklab, var(--c) 40%, var(--nw-fg)); }
.nw-feel-factors b { font-size:var(--nw-fs-title); font-weight:500; letter-spacing:-.02em; font-variant-numeric:tabular-nums; }
.nw-feel-factors small { font-size:var(--nw-fs-small); color:var(--nw-fg2); }
.nw-feel-why { padding:10px 12px; border-radius:12px; background:var(--nw-bg); border:1px solid var(--nw-line); font-size:var(--nw-fs-text); }
.nw-feel-why p { margin:4px 0; } .nw-feel-why .ex { color:var(--nw-fg2); }
`;var Pn=`/* Hestia \xC9nergie : seulement ses exceptions. Toute la structure (carte, bandeau, panneaux, sections, \xE9tiquettes) vient de
   hestia-charte.css. Ici, d'apr\xE8s la maquette des cartes 2 (docs/maquette-cartes-2.html, valid\xE9e le 8 nov. 2026), a\xE9r\xE9e
   le 17 nov. comme les cartes Hestia Weather (maquette des cartes 4) : le chiffre en grand, les mots en petit, de l'espace.
   Couleurs de sens propres \xE0 l'\xE9nergie, prises dans la palette Aube : jamais d'autres. */
:host { --nw-peak:var(--nw-level3); --nw-sun:var(--nw-level1); --nw-grid:var(--nw-wind); --nw-home:var(--nw-heat); --nw-water:var(--nw-rain); display:block; }
ha-card { display:flex; flex-direction:column; gap:16px; padding:18px 20px 20px; background:var(--nw-bg); color:var(--nw-fg); container-type:inline-size; box-sizing:border-box; }
.ico { display:grid; place-items:center; width:30px; height:30px; flex:none; border-radius:9px; background:color-mix(in oklab, var(--c) 30%, transparent); color:color-mix(in oklab, var(--c) 55%, var(--nw-fg)); }
.ico svg { width:17px; height:17px; }

/* L'en-t\xEAte, le m\xEAme pour toutes les cartes (comme le titre d'une carte Weather) : le sujet en titre, sa p\xE9riode en gris \xE0 c\xF4t\xE9 ;
   puis le chiffre en grand et ses mots en petit (comme la temp\xE9rature de Weather) ; puis pourquoi, en gris. */
.ans-k { display:flex; align-items:center; gap:10px; min-width:0; }
.ans-k .nw-title { white-space:nowrap; }
.ans-k .per { flex:1; min-width:0; font-size:var(--nw-fs-small); color:var(--nw-fg2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ans-k .pastille { margin-left:0; }
.ans { display:flex; flex-direction:column; gap:6px; }
.hero { display:flex; align-items:baseline; flex-wrap:wrap; gap:2px 10px; margin:0; }
.hero b { font-size:var(--nw-fs-value); font-weight:300; letter-spacing:-.04em; line-height:1.05; font-variant-numeric:tabular-nums; white-space:nowrap; }
.hero b small { margin-left:4px; font-size:var(--nw-fs-text); font-weight:500; letter-spacing:0; color:var(--nw-fg2); }
.hero > span { font-size:var(--nw-fs-text); color:var(--nw-fg2); }
.hero > span b { font-size:inherit; font-weight:650; letter-spacing:0; color:var(--nw-fg); }
.ans-m { margin:0; font-size:var(--nw-fs-title); font-weight:650; line-height:1.3; }
.ans-w { margin:0; font-size:var(--nw-fs-text); line-height:1.5; color:var(--nw-fg2); text-wrap:pretty; max-width:62ch; }
.ans-w b { color:var(--nw-fg); font-weight:650; }

/* Les encarts : un titre en mots simples, une phrase avec un chiffre, puis le dessin. */
.encs { display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px; }
.encs > .wide { grid-column:1 / -1; }
.nw-panel { display:flex; flex-direction:column; gap:12px; }
.nw-panel-head h3 { font-size:var(--nw-fs-text); }
/* La phrase d'un encart : petite et grise, son chiffre en gras (comme les notes des panneaux de Weather). */
.say { margin:0; font-size:var(--nw-fs-small); line-height:1.5; color:var(--nw-fg2); text-wrap:pretty; }
.say b { font-weight:650; color:var(--nw-fg); }
.foot { font-size:var(--nw-fs-small); color:var(--nw-fg2); border-top:1px solid var(--nw-line-soft); padding-top:8px; }
.foot b { color:var(--nw-fg); font-weight:650; }

/* Barres couch\xE9es : un nom, une barre, une valeur (comme le bilan fait main). */
.hb { display:grid; grid-template-columns:minmax(84px, max-content) 1fr auto; gap:10px 12px; align-items:center; font-size:var(--nw-fs-text); }
.hb.list { grid-template-columns:1fr auto; }
.hb .n { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; gap:6px; min-width:0; }
.hb .n > span:first-child { overflow:hidden; text-overflow:ellipsis; }
.hb .n.muted, .hb .v.muted { color:var(--nw-fg2); }
.hb .t { height:8px; border-radius:4px; background:color-mix(in srgb, var(--nw-fg) 7%, transparent); overflow:hidden; }
.hb .t i { display:block; height:100%; border-radius:4px; background:var(--c, var(--nw-home)); }
.hb .t i.soft { opacity:.45; }
.hb .t.dash i { background:repeating-linear-gradient(90deg, color-mix(in srgb, var(--nw-fg) 28%, transparent) 0 6px, transparent 6px 9px); }
.hb .v { text-align:right; font-weight:650; font-variant-numeric:tabular-nums; white-space:nowrap; }
.hb .v small { font-weight:500; color:var(--nw-fg2); margin-left:6px; }
.live { display:inline-flex; align-items:center; gap:5px; font-size:var(--nw-fs-label); font-weight:650; color:var(--nw-fg2); white-space:nowrap; }
.live::before { content:''; width:7px; height:7px; border-radius:50%; background:var(--nw-fg); animation:pulse 1.8s var(--nw-ease) infinite; }
@keyframes pulse { 50% { opacity:.25; } }

/* Barres debout : heures, jours, nuits. En CSS, pour garder un texte lisible \xE0 toutes les largeurs. */
.cols { position:relative; display:flex; align-items:flex-end; gap:2px; height:96px; padding-top:18px; }
.cols.tall { height:120px; }
.cols .c { position:relative; flex:1; height:100%; display:flex; align-items:flex-end; border-radius:4px; }
.cols .c.band { background:color-mix(in oklab, var(--nw-cold) 22%, transparent); }
.cols .c i { display:block; width:100%; min-height:2px; border-radius:3px 3px 1px 1px; background:var(--c); }
.cols .c i.part { opacity:.4; }
.cols .c i.none { background:color-mix(in srgb, var(--nw-fg) 10%, transparent); }
.cols .c .pin { position:absolute; left:50%; transform:translate(-50%, -4px); font-size:var(--nw-fs-small); font-weight:700; padding:1px 7px; border-radius:999px;
  background:var(--nw-bg); border:1px solid var(--nw-line); white-space:nowrap; z-index:2; font-variant-numeric:tabular-nums; }
.cols .c .pin.l { left:0; transform:translate(0, -4px); } .cols .c .pin.r { left:auto; right:0; transform:translate(0, -4px); }
.cols .limit { position:absolute; left:0; right:0; border-top:2px dashed color-mix(in oklab, var(--nw-act) 70%, var(--nw-fg)); z-index:1; }
.cols .limit span { position:absolute; right:0; top:-20px; font-size:var(--nw-fs-small); font-weight:650; color:var(--nw-fg2); background:var(--nw-bg); padding:0 4px; }
.ticks { display:flex; justify-content:space-between; font-size:var(--nw-fs-small); color:var(--nw-fg2); margin-top:4px; font-variant-numeric:tabular-nums; }
.ticks.days span { flex:1; text-align:center; white-space:nowrap; }
.nw-legend i { width:9px; height:9px; border-radius:3px; background:var(--c); flex:none; display:inline-block; }

/* Une barre partag\xE9e : deux parts d'un tout, chacune nomm\xE9e. */
.split { display:flex; height:12px; border-radius:6px; overflow:hidden; gap:2px; }
.split i { display:block; height:100%; background:var(--c); }
.split-l { display:flex; justify-content:space-between; gap:10px; font-size:var(--nw-fs-small); color:var(--nw-fg2); margin-top:6px; }
.split-l b { color:var(--nw-fg); font-weight:650; }

/* La journ\xE9e sur 24 h : heures creuses et pleines, et l'heure qu'il est. */
.day { position:relative; height:26px; border-radius:8px; background:color-mix(in oklab, var(--nw-heat) 34%, transparent); overflow:hidden; }
.day i { position:absolute; top:0; bottom:0; background:var(--nw-cold); }
.day .now { position:absolute; top:0; bottom:0; width:2px; background:var(--nw-fg); }

/* Une piste : une part d'un total, un rep\xE8re. */
.track { position:relative; height:10px; border-radius:5px; background:color-mix(in srgb, var(--nw-fg) 7%, transparent); }
.track i { position:absolute; left:0; top:0; bottom:0; border-radius:5px; background:var(--c); }
.track .mark { position:absolute; top:-5px; bottom:-5px; width:2px; background:var(--nw-fg2); }
.track-l { display:flex; justify-content:space-between; gap:8px; margin-top:6px; font-size:var(--nw-fs-small); color:var(--nw-fg2); }
.track-l b { color:var(--nw-fg); font-weight:650; }

/* La pastille d'\xE9tat (tuile, eau, pointe). */
.pastille { margin-left:auto; display:inline-flex; align-items:center; gap:6px; font-size:var(--nw-fs-small); font-weight:650; color:color-mix(in oklab, var(--c) var(--nw-ink), var(--nw-fg)); white-space:nowrap; }
.pastille::before { content:''; width:8px; height:8px; border-radius:50%; background:var(--c); box-shadow:0 0 0 3px color-mix(in oklab, var(--c) 30%, transparent); }

/* La tuile. */
ha-card.tile { gap:12px; }

/* La carte compl\xE8te : ses sections, une p\xE9riode chacune, \xE9crite dans le titre. */
.head { display:flex; align-items:baseline; gap:10px; min-width:0; }
.head .nw-title { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.head .when { margin-left:auto; font-size:var(--nw-fs-small); color:var(--nw-fg2); white-space:nowrap; }
.sec { border-top:1px solid var(--nw-line-soft); padding-top:16px; display:flex; flex-direction:column; gap:12px; min-width:0; }
/* Sur un grand \xE9cran, les trois p\xE9riodes c\xF4te \xE0 c\xF4te, chacune dans son panneau. */
.periods { display:flex; flex-direction:column; gap:16px; }
@container (min-width:680px) {
 .periods { display:grid; grid-template-columns:1.25fr 1fr 1fr; gap:12px; align-items:stretch; }
 .periods.two { grid-template-columns:1fr 1fr; }
 .periods .sec { border-top:0; padding:16px 18px; border-radius:16px; background:var(--nw-surface); }
 .periods .nw-fold-head .nw-chevron { display:none; } .periods .nw-fold-head { cursor:default; pointer-events:none; }
 .more { grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); }
 .pistes { grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); }
}
.lines { display:grid; gap:8px; }
.line { display:flex; gap:10px; align-items:flex-start; font-size:var(--nw-fs-text); line-height:1.5; }
.line .ico { width:26px; height:26px; border-radius:8px; } .line .ico svg { width:15px; height:15px; }
.line b { font-weight:650; }
/* \xAB En ce moment \xBB (le mod\xE8le de Frank, 20 nov. 2026) : un l\xE9ger halo autour de chaque cercle, des bulles qui grossissent au milieu du trait. */
:host { --nw-prod:color-mix(in oklab, var(--nw-level1) 45%, var(--nw-level2)); }
.flow2 { display:grid; grid-template-columns:48px minmax(0,1fr) 48px minmax(0,1fr) 48px; align-items:start; gap:0 10px; padding:6px 34px 2px; }
.flow2.two { grid-template-columns:48px minmax(0,1fr) 48px; }
.fnode { display:flex; flex-direction:column; align-items:center; gap:1px; text-align:center; width:48px; }
.fnode > .fl, .fnode > .fv, .fnode > .fw { width:max-content; }
@container (max-width:420px) { .fl { font-size:11px; } .fv { font-size:14px; } .flow2 { padding:6px 30px 2px; gap:0 6px; } }
.fdot { width:48px; height:48px; border-radius:50%; display:grid; place-items:center; margin-bottom:5px;
 background:color-mix(in oklab, var(--c) 30%, var(--nw-bg)); border:2px solid color-mix(in oklab, var(--c) 70%, transparent);
 box-shadow:0 0 0 4px color-mix(in oklab, var(--c) calc(var(--a) * 14%), transparent), 0 0 18px color-mix(in oklab, var(--c) calc(var(--a) * 40%), transparent); }
.fdot svg { width:22px; height:22px; color:color-mix(in oklab, var(--c) 55%, var(--nw-fg)); }
.fl { font-size:var(--nw-fs-small); color:var(--nw-fg2); font-weight:600; white-space:nowrap; }
.fv { font-size:15px; font-weight:750; color:color-mix(in oklab, var(--c) 75%, var(--nw-fg)); font-variant-numeric:tabular-nums; white-space:nowrap; }
.fnode.dim .fdot { box-shadow:none; opacity:.55; } .fnode.dim .fv { color:var(--nw-fg2); }
.fw { display:inline-flex; align-items:center; gap:3px; margin-top:3px; font-size:11px; font-weight:600; color:color-mix(in oklab, var(--nw-water) 70%, var(--nw-fg)); white-space:nowrap; }
.fw svg { width:11px; height:11px; }
.flink { display:flex; flex-direction:column; align-items:stretch; gap:4px; min-width:0; }
.fsay { min-height:28px; font-size:11px; line-height:1.25; color:color-mix(in oklab, var(--c) 75%, var(--nw-fg)); text-align:center; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; white-space:nowrap; }
.fsay b { font-weight:750; } .fsay span { font-weight:600; opacity:.85; }
.fline { position:relative; height:2px; margin-top:4px; border-radius:1px; background:color-mix(in oklab, var(--c) 28%, transparent); }
.flink.off .fline { background:color-mix(in srgb, var(--nw-fg) 9%, transparent); }
.fline i { position:absolute; top:50%; left:0; width:8px; height:8px; border-radius:50%; background:var(--c); box-shadow:0 0 10px var(--c);
 animation:bubble var(--dur) linear infinite; }
.fline i:nth-child(2) { animation-delay:calc(var(--dur) / -3); } .fline i:nth-child(3) { animation-delay:calc(var(--dur) / -1.5); }
.flink.back .fline i { animation-direction:reverse; }
@keyframes bubble {
 0% { left:0; transform:translate(-50%, -50%) scale(.45); opacity:0; }
 15% { opacity:.6; }
 50% { left:50%; transform:translate(-50%, -50%) scale(1.7); opacity:1; }
 85% { opacity:.6; }
 100% { left:100%; transform:translate(-50%, -50%) scale(.45); opacity:0; } }
@media (prefers-reduced-motion:reduce) { .fline i { animation:none; left:50%; transform:translate(-50%, -50%) scale(1.3); } .fline i + i { display:none; } }
.big { display:flex; align-items:baseline; gap:8px; flex-wrap:wrap; }
.big b { font-size:var(--nw-fs-value); font-weight:300; letter-spacing:-.04em; line-height:1; font-variant-numeric:tabular-nums; }
.big span { font-size:var(--nw-fs-text); color:var(--nw-fg2); font-weight:500; }
/* \xAB En d\xE9tail \xBB : chaque encart touchable dit son sujet ET sa p\xE9riode. */
.more { display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:10px; }
.go { all:unset; box-sizing:border-box; display:flex; flex-direction:column; gap:6px; padding:14px 16px; border-radius:var(--nw-radius); cursor:pointer;
  background:linear-gradient(160deg, color-mix(in oklab, var(--c) 16%, var(--nw-bg)), var(--nw-surface) 75%); border:1px solid var(--nw-line-soft); min-width:0; }
.go:hover { border-color:color-mix(in oklab, var(--c) 70%, var(--nw-line)); }
.go:focus-visible { outline:2px solid var(--nw-accent); outline-offset:2px; }
.go .g-h { display:flex; align-items:center; gap:10px; }
.go .g-t { display:flex; flex-direction:column; min-width:0; font-size:var(--nw-fs-text); font-weight:650; line-height:1.25; }
.go .g-t small { font-size:var(--nw-fs-small); font-weight:500; color:var(--nw-fg2); } .go .g-h .ar { margin-left:auto; color:var(--nw-fg2); font-size:18px; line-height:1; }
.go .ico { width:26px; height:26px; border-radius:8px; } .go .ico svg { width:15px; height:15px; }
.go .g-v { font-size:var(--nw-fs-case); font-weight:600; letter-spacing:-.015em; line-height:1.2; font-variant-numeric:tabular-nums; }
.go .g-v small { font-size:var(--nw-fs-small); font-weight:500; color:var(--nw-fg2); margin-left:4px; letter-spacing:0; }
.go .g-s { font-size:var(--nw-fs-small); color:var(--nw-fg2); }

/* La carte de d\xE9tail ouverte depuis la carte compl\xE8te, par-dessus la page. */
.ov { position:fixed; inset:0; z-index:10; display:flex; justify-content:center; align-items:flex-start; padding:24px 12px; background:color-mix(in srgb, #000 45%, transparent); overflow:auto; }
.ov .sheet { width:min(860px, 100%); animation:up .3s var(--nw-ease); }
@keyframes up { from { transform:translateY(16px); } to { transform:none; } }
.d-close { all:unset; box-sizing:border-box; display:grid; place-items:center; flex:none; width:32px; height:32px; border-radius:50%; border:1px solid var(--nw-line); cursor:pointer; font-size:18px; line-height:1; color:var(--nw-fg2); }
.d-close:focus-visible { outline:2px solid var(--nw-accent); outline-offset:2px; }
.ans-k .d-close { margin-left:4px; }
.empty { font-size:var(--nw-fs-small); color:var(--nw-fg2); }
@media (prefers-reduced-motion:reduce) { .live::before, .ov .sheet { animation:none !important; } }

/* The link to the hub under an answer: what is only supposed, to confirm in R\xE9glages (palier 0). */
.to-hub{color:var(--nw-ok);text-decoration:none;white-space:nowrap}.to-hub:hover{text-decoration:underline}

/* \xAB Pour \xE9conomiser \xBB (maquette des cartes 3): the advice \xAB \xE0 froid \xBB, one line each, the gesture and what it brings. */
.pistes { display:grid; gap:10px; }
.piste { all:unset; box-sizing:border-box; display:grid; grid-template-columns:auto 1fr auto; gap:2px 10px; align-items:center; padding:12px 14px; border-radius:var(--nw-radius);
  background:var(--nw-surface); min-width:0; }
button.piste { cursor:pointer; } button.piste:hover { box-shadow:inset 0 0 0 1px color-mix(in oklab, var(--c) 60%, var(--nw-line)); }
button.piste:focus-visible { outline:2px solid var(--nw-accent); outline-offset:2px; }
.piste .ico { grid-row:1 / span 2; }
.piste .pt { font-size:var(--nw-fs-text); font-weight:650; line-height:1.35; }
.piste .pw { grid-column:2; font-size:var(--nw-fs-small); color:var(--nw-fg2); line-height:1.45; }
.piste .pe { grid-row:1 / span 2; grid-column:3; text-align:right; font-variant-numeric:tabular-nums; }
.piste .pe b { display:block; font-size:var(--nw-fs-case); font-weight:600; letter-spacing:-.015em; line-height:1.1; }
.piste .pe small { font-size:var(--nw-fs-small); color:var(--nw-fg2); }
/* What one more piece of equipment would bring: dashed, never counted as advice. */
/* \xAB Pour \xE9conomiser \xBB (maquette D) : aujourd'hui \u2192 mieux \u2192 gain. Sur un t\xE9l\xE9phone, l'un sous l'autre. */
.pistes.better { grid-template-columns:1fr; }
.piste.wide { grid-template-columns:auto minmax(0,1fr) auto; gap:8px 12px; }
.piste.wide .ico { grid-column:1; grid-row:1; }
.piste.wide .bt { grid-column:2; grid-row:1; font-size:var(--nw-fs-text); font-weight:700; line-height:1.3; }
.piste.wide .pe { grid-column:3; grid-row:1; }
.piste.wide .pe small { display:block; max-width:150px; margin-left:auto; }
.piste.wide .bn, .piste.wide .bm { grid-column:1 / -1; font-size:var(--nw-fs-small); line-height:1.45; color:var(--nw-fg2); min-width:0; }
.piste.wide .bn { grid-row:2; } .piste.wide .bm { grid-row:3; color:var(--nw-fg); font-weight:600; }
.piste.wide .bn small, .piste.wide .bm small { display:block; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; font-weight:700; color:var(--nw-fg2); margin-bottom:2px; }
.piste.wide .ba { display:none; }
/* The strip of a device (Frank, 20 Nov. 2026, after Weather's timeline): pins above, the day's prices inlaid below. */
.fr { display:block; grid-column:1 / -1; min-width:0; margin-top:4px; container-type:inline-size; }
.fr-pins { position:relative; display:block; height:30px; }
.fr-pin { position:absolute; top:0; display:flex; flex-direction:column; align-items:center; translate:-50% 0; }
.fr-pin.l { translate:-11px 0; align-items:flex-start; } .fr-pin.r { translate:calc(-100% + 11px) 0; align-items:flex-end; }
.fr-pin.l .stem { margin-left:10px; } .fr-pin.r .stem { margin-right:10px; }
.fr-pin .chip { display:flex; gap:3px; align-items:center; padding:2px 7px 2px 5px; border-radius:999px; white-space:nowrap; font-size:11px; line-height:16px; font-weight:700;
 color:var(--nw-fg); background:color-mix(in oklab, var(--tone) 34%, var(--nw-bg)); box-shadow:0 0 0 1px var(--nw-line); font-variant-numeric:tabular-nums; }
.fr-pin .chip svg { width:13px; height:13px; color:color-mix(in oklab, var(--tone) 35%, var(--nw-fg)); }
.fr-pin.good .chip { background:color-mix(in oklab, var(--nw-benefit) 45%, var(--nw-bg)); }
.fr-pin .stem { width:1.5px; height:7px; background:color-mix(in oklab, var(--tone) 70%, var(--nw-fg)); }
.fr.tight .fr-h { display:none; }
.fr-lane { display:flex; gap:2px; height:16px; }
.fr-seg { display:flex; align-items:center; justify-content:center; gap:3px; min-width:0; overflow:hidden; border-radius:5px; font-size:10px; font-weight:700;
 color:rgb(20 26 45 / .75); background:linear-gradient(180deg, color-mix(in oklab, var(--tone) 85%, #fff), color-mix(in oklab, var(--tone) 78%, transparent));
 box-shadow:inset 0 1px 0 rgb(255 255 255 / .3); }
.fr-seg:first-child { border-radius:8px 5px 5px 8px; } .fr-seg:last-child { border-radius:5px 8px 8px 5px; }
.fr-seg svg { width:12px; height:12px; flex:none; }
@container (max-width:420px) { .fr-seg .w { display:none; } }
.fr-say { display:flex; flex-wrap:wrap; gap:2px 14px; margin-top:4px; font-size:11px; color:var(--nw-fg2); font-weight:500; letter-spacing:0; }
.fr-say > span { display:inline-flex; align-items:center; gap:5px; }
.fr-say i { display:grid; place-items:center; width:16px; height:16px; border-radius:50%; background:var(--nw-surface); }
.fr-say i.ok { background:color-mix(in oklab, var(--nw-benefit) 45%, var(--nw-bg)); }
.fr-say svg { width:11px; height:11px; }
.hrs-x { display:flex; justify-content:space-between; font-size:10px; color:var(--nw-fg2); margin-top:2px; font-weight:400; letter-spacing:0; }
@container (min-width:680px) {
 .piste.wide { grid-template-columns:auto 150px minmax(0,1fr) 20px minmax(0,1fr) 130px; gap:0 14px; }
 .piste.wide .bn, .piste.wide .bm, .piste.wide .ba, .piste.wide .pe { grid-row:1; }
 .piste.wide .bn { grid-column:3; } .piste.wide .ba { grid-column:4; display:block; color:var(--nw-fg2); font-size:18px; text-align:center; }
 .piste.wide .bm { grid-column:5; } .piste.wide .pe { grid-column:6; }
 .piste.wide .fr { grid-column:3 / 6; grid-row:2; margin-top:10px; }
}
.piste.up { background:none; border:1px dashed var(--nw-line); }
.piste.up .pt { font-weight:600; }
.piste.up .ico { background:color-mix(in srgb, var(--nw-fg) 6%, transparent); color:var(--nw-fg2); }

/* L'horloge de 24 heures, en haut de la carte compl\xE8te (maquette \xAB Bandeaux de la carte compl\xE8te \xBB, B, choisie par Frank le
   19 nov. 2026) : un trait par heure, vers l'ext\xE9rieur ce qui est achet\xE9 (heures pleines chaudes, heures creuses froides),
   vers le centre le soleil, en gris les heures \xE0 venir d'hier, une aiguille sur l'heure. \xC0 c\xF4t\xE9, le conseil et les chiffres
   du moment. \xC9troite : l'horloge au-dessus, centr\xE9e. */
.clock { --c:var(--nw-ok); display:flex; flex-direction:column; align-items:center; gap:14px; min-width:0; }
.clock[data-level="benefit"] { --c:var(--nw-benefit); } .clock[data-level="action"] { --c:var(--nw-act); } .clock[data-level="urgent"] { --c:var(--nw-alert); }
.dial { display:block; width:100%; max-width:300px; height:auto; flex:none; overflow:visible; }
.dial .ring { fill:none; stroke:var(--nw-line-soft); stroke-width:1; }
.dial .bars path { fill:none; stroke-width:8; stroke-linecap:round; }
.dial .peak { stroke:var(--nw-home); } .dial .off { stroke:var(--nw-cold); } .dial .sun { stroke:var(--nw-sun); }
.dial .next { stroke:color-mix(in srgb, var(--nw-fg) 13%, transparent); }
.dial .hand { fill:none; stroke:var(--nw-fg); stroke-width:2; stroke-linecap:round; }
.dial .tip, .dial .ping { fill:var(--nw-fg); }
.dial text { fill:var(--nw-fg2); font-size:11px; font-weight:600; }
.dial .cv { fill:var(--nw-fg); font-size:30px; font-weight:300; letter-spacing:-.03em; text-anchor:middle; font-variant-numeric:tabular-nums; }
.dial .cl { font-size:12px; text-anchor:middle; }
.dial .bars { transform-box:view-box; transform-origin:50% 50%; animation:nw-dial-in 1.2s cubic-bezier(.2,.8,.2,1) both; }
.dial .ping { transform-box:fill-box; transform-origin:center; animation:nw-ping 2.4s ease-out infinite; }
@keyframes nw-dial-in { from { transform:rotate(-35deg); opacity:0; } to { transform:none; opacity:1; } }
@keyframes nw-ping { from { transform:scale(1); opacity:.6; } to { transform:scale(3); opacity:0; } }
@media (prefers-reduced-motion:reduce) { .dial .bars, .dial .ping { animation:none; } .dial .ping { display:none; } }
.clock .ct { display:flex; flex-direction:column; gap:10px; min-width:0; width:100%; }
.clock .ct p { margin:0; }
.clock .ctt { font-size:var(--nw-fs-case); font-weight:700; letter-spacing:-.015em; line-height:1.25; text-wrap:balance; }
.clock[data-level="action"] .ctt, .clock[data-level="urgent"] .ctt { color:color-mix(in oklab, var(--c) 70%, var(--nw-fg)); }
.cstats { display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:10px; margin-top:4px; }
.cstat { display:flex; flex-direction:column; gap:2px; padding:12px 14px; border-radius:var(--nw-radius); background:var(--nw-surface); min-width:0; }
.cstat span { font-size:var(--nw-fs-small); color:var(--nw-fg2); font-weight:600; }
.cstat b { font-size:var(--nw-fs-value); font-weight:300; letter-spacing:-.04em; line-height:1.1; white-space:nowrap; font-variant-numeric:tabular-nums;
  color:color-mix(in oklab, var(--c) 55%, var(--nw-fg)); }
.cstat small { font-size:var(--nw-fs-small); color:var(--nw-fg2); }
.clock .nw-legend { justify-content:flex-start; }
@container (min-width:680px) {
 .clock { flex-direction:row; gap:28px; }
 .dial { width:300px; }
}
/* La loupe : l'heure survol\xE9e, touch\xE9e ou atteinte au clavier grandit avec ses voisines, les autres s'effacent ; ses
   chiffres prennent le centre. Un appui la fige, un second la rel\xE2che. */
.dial .h path { transition:stroke-width .22s ease, opacity .22s ease, d .22s ease; }
.dial .h.on path { stroke-width:14; } .dial .h.near path { stroke-width:10; }
.dial .bars.picking .h.far path { opacity:.28; }
.dial .h.on .peak { stroke:color-mix(in oklab, var(--nw-home) 80%, var(--nw-fg)); } .dial .h.on .off { stroke:color-mix(in oklab, var(--nw-cold) 80%, var(--nw-fg)); }
.dial .h.on .next { stroke:color-mix(in srgb, var(--nw-fg) 30%, transparent); }
.dial .hit { fill:none; stroke:transparent; stroke-width:30; pointer-events:stroke; cursor:pointer; outline:none; -webkit-tap-highlight-color:transparent; }
.dial .cv.pk { font-size:28px; }
.dial .cs { fill:var(--nw-fg); font-weight:650; }
.clock .nw-legend .hint { color:color-mix(in srgb, var(--nw-fg2) 80%, transparent); font-style:italic; }
@media (prefers-reduced-motion:reduce) { .dial .h path { transition:none; } }

/* \xAB Votre contrat, bien utilis\xE9 \xBB (maquette A) and \xAB Quand tournent vos machines \xBB (maquette C), 19 Nov. 2026 */
.usage { display:grid; gap:10px; }
.u-top { display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:10px; }
.u-gauge, .u-verdict { padding:14px 16px; border-radius:var(--nw-radius); background:color-mix(in srgb, var(--nw-fg) 5%, transparent); display:grid; gap:6px; align-content:start; }
.u-verdict.good { background:color-mix(in oklab, var(--nw-ok) 14%, transparent); }
.u-k { margin:0; font-size:var(--nw-fs-small); color:var(--nw-fg2); font-weight:600; }
.u-v { margin:0; display:flex; flex-wrap:wrap; align-items:baseline; gap:4px 12px; }
.u-v > b { font-size:var(--nw-fs-case); font-weight:300; letter-spacing:-.03em; color:var(--nw-cold); }
.u-v span { font-size:var(--nw-fs-small); color:var(--nw-fg2); } .u-v .ok { color:var(--nw-ok); font-weight:700; }
.u-big { margin:0; font-size:var(--nw-fs-text); font-weight:700; color:var(--nw-fg); }
.u-verdict.good .u-big { color:var(--nw-ok); }
.u-n { margin:0; font-size:var(--nw-fs-small); color:var(--nw-fg2); line-height:1.45; } .u-n b { color:var(--nw-fg); font-weight:650; }
.track i.next { background:color-mix(in oklab, var(--nw-ok) 40%, transparent); }
.mach { display:grid; grid-template-columns:minmax(90px, auto) 1fr auto; gap:10px 12px; align-items:center; }
.mach .mn { font-size:var(--nw-fs-text); font-weight:650; display:grid; } .mach .mn small, .mach .me small { font-size:var(--nw-fs-small); color:var(--nw-fg2); font-weight:400; }
.mach .stack { display:flex; height:14px; border-radius:7px; overflow:hidden; background:color-mix(in srgb, var(--nw-fg) 7%, transparent); }
.mach .stack i { background:var(--c); }
.mach .me { text-align:right; display:grid; font-variant-numeric:tabular-nums; } .mach .me b { font-weight:600; }
.smonths { display:grid; grid-template-columns:repeat(12, minmax(0, 1fr)); gap:6px; height:84px; align-items:end; }
.smonths .sm { display:grid; grid-template-rows:1fr auto; height:100%; gap:4px; text-align:center; }
.smonths .sm i { align-self:end; border-radius:4px 4px 2px 2px; background:var(--nw-sun); }
.smonths .sm small { font-size:var(--nw-fs-small); color:var(--nw-fg2); }
.u-kva { margin-top:auto; padding-top:6px; }
/* The water heater's plan (1.0.0b11): reserve, sun forecast, heatings by source, the price of each half hour. */
.whc { display:block; width:100%; height:auto; }
.whc .gl { stroke:var(--nw-line-soft); stroke-width:1; }
.whc .tk { font-size:10px; fill:var(--nw-fg2); }
.whc .sun { fill:color-mix(in oklab, var(--nw-sun) 40%, transparent); }
.whc .res { fill:none; stroke:var(--nw-water); stroke-width:2.5; stroke-linejoin:round; }
.whc .min { stroke:var(--nw-act); stroke-width:1; stroke-dasharray:3 4; }
.whc .hw { stroke:var(--nw-water); stroke-opacity:.35; }
.whc .hwl { font-size:9.5px; font-weight:600; fill:color-mix(in oklab, var(--nw-water) 70%, var(--nw-fg)); }
.whc .pb { fill-opacity:.5; }
.hb.list .dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--c); margin-right:6px; vertical-align:1px; }
`;var vt=[["complete","mdi:page-layout-body","Compl\xE8te","en ce moment, aujourd\u2019hui, ce mois-ci, puis le d\xE9tail"],["tuile","mdi:dock-window","Tuile","en ce moment : une phrase, un chiffre"],["conseils","mdi:piggy-bank-outline","Conseils","ce qui ferait \xE9conomiser, en euros par an"],["soleil","mdi:solar-power-variant","Soleil","ce que les panneaux ont produit aujourd\u2019hui"],["chauffage","mdi:fire","Chauffage","ce qu\u2019a co\xFBt\xE9 la saison, depuis le 1er octobre"],["veille","mdi:weather-night","Veille","ce qui tourne la nuit, les 30 derni\xE8res nuits"],["eau","mdi:water","Eau","les litres et les euros du mois"],["appareils","mdi:power-plug","Appareils","ce que chaque appareil a consomm\xE9 aujourd\u2019hui"],["pointe","mdi:transmission-tower","Pointe","la plus forte puissance prise aujourd\u2019hui"],["contrat","mdi:file-document-outline","Contrat","vos heures creuses et vos prix, ce mois-ci"],["chauffe_eau","mdi:water-boiler","Chauffe-eau","son plan de chauffe et sa r\xE9serve d\u2019eau chaude"]],xt=a=>{a.preventDefault(),history.pushState(null,"",a.currentTarget.getAttribute("href")??"/hestia/energie"),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0}))},Ze=class extends V{static{this.properties={hass:{attribute:!1},config:{state:!0}}}static{this.styles=De`.note{color:var(--secondary-text-color);font-size:12px;line-height:1.6;margin:0 0 16px}a{color:var(--primary-color)}
  .formats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:4px 0 16px}
  .formats button{all:unset;box-sizing:border-box;display:flex;flex-direction:column;gap:4px;padding:10px 12px;border:1px solid var(--divider-color);border-radius:12px;cursor:pointer;color:var(--primary-text-color);font-size:12px;line-height:1.45}
  .formats button:hover{border-color:var(--secondary-text-color)}
  .formats button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}
  .formats button.on{border:2px solid var(--primary-color);padding:9px 11px}
  .formats ha-icon{--mdc-icon-size:20px;color:var(--secondary-text-color)}.formats button.on ha-icon{color:var(--primary-color)}
  .formats b{font-size:14px;font-weight:500}.formats span{color:var(--secondary-text-color)}`}setConfig(s){this.config={...s}}set(s){let e={...this.config,...s};e.name||delete e.name,e.card==="complete"&&delete e.card,this.config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this.config)return c;let s=this.config.card??"complete";return i`<p class="note">Choisissez ce que montre la carte. Le contrat, les réglages et les extensions se règlent dans
    <a href="/hestia/energie" @click=${xt}>l’onglet Énergie</a>.</p>
   <div class="formats" role="radiogroup" aria-label="Format">${vt.map(([e,t,n,r])=>i`<button type="button" role="radio" aria-checked=${e===s}
     class=${e===s?"on":""} @click=${()=>{e!==s&&this.set({card:e})}}><ha-icon icon=${t}></ha-icon><b>${n}</b><span>${r}</span></button>`)}</div>
   <ha-form .hass=${this.hass} .data=${{name:this.config.name??""}} .schema=${[{name:"name",selector:{text:{}}}]}
     .computeLabel=${()=>"Titre facultatif"} .computeHelper=${()=>"Vide : \xAB Maison \xBB."}
     @value-changed=${e=>{e.stopPropagation(),this.set({name:(e.detail.value.name??"").trim()})}}></ha-form>`}};customElements.get("hestia-energy-card-editor")||customElements.define("hestia-energy-card-editor",Ze);var ie=new WeakMap;function Hn(a,s){ie.get(a)===s&&ie.delete(a),clearTimeout(s.closing),s.stop?.then(e=>e()).catch(()=>{})}function Tn(a,s,e,t){let n=ie.get(a),r={view:s,error:e,reload:t};if(n){clearTimeout(n.closing),n.closing=void 0;let u=n.last;u&&queueMicrotask(()=>{n.listeners.has(r)&&s(u)})}else{let u={listeners:new Set};n=u,ie.set(a,u),u.stop=a.subscribeMessage(l=>{if(l.reload){Hn(a,u);for(let g of[...u.listeners])g.reload();return}let p;if(l.changes){if(!u.last)return;p={...u.last,...l.changes};for(let g of l.removed??[])delete p[g]}else if(l.view)p=l.view;else return;u.last=p;for(let g of[...u.listeners])g.view(p)},{type:"hestia_energy/subscribe"}),u.stop.catch(l=>{ie.get(a)===u&&ie.delete(a);for(let p of[...u.listeners])p.error(l)})}let o=n;return o.listeners.add(r),()=>{!o.listeners.delete(r)||o.listeners.size||(clearTimeout(o.closing),o.closing=setTimeout(()=>{o.listeners.size||Hn(a,o)},5e3))}}var ze=["soleil","chauffage","veille","eau","appareils","pointe","contrat","chauffe_eau"],Wn={hc:["--nw-cold","moon","creuses"],hp:["--nw-peak",null,"pleines"],soleil:["--nw-sun","sun","soleil"]},Vn=a=>a.id==="chauffe_eau_heures"?"heater":/vaisselle/i.test(a.nom??"")?"dish":/s[eè]che/i.test(a.nom??"")?"dryer":/linge|laver/i.test(a.nom??"")?"washer":"plug",$t=a=>{let s=Math.floor(a/60)%24,e=a%60;return e?`${s}\xA0h\xA0${String(e).padStart(2,"0")}`:`${s}\xA0h`},Dn={veille_haute:["moon","--nw-watch"],chauffage_degre:["flame","--nw-heat"],contrat_base:["doc","--nw-benefit"],jour_inhabituel:["home","--nw-home"],budget_mois:["doc","--nw-home"],chauffe_eau_heures:["drop","--nw-cold"],machine_heures:["clock","--nw-home"]},Un={sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/></svg>',grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M8 21 11 3h2l3 18"/><path d="M5 7h14M6.5 12h11M9.5 16.5l5-4.5M14.5 16.5l-5-4.5"/></svg>',bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/></svg>',drop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3s6.5 7 6.5 11.2A6.5 6.5 0 0 1 5.5 14.2C5.5 10 12 3 12 3z"/></svg>',clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>',plug:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0z"/><path d="M12 17v4"/></svg>',doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14 3v5h5M9 12.5h7M9 16.5h7"/></svg>',flame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21.5a6.5 6.5 0 0 0 6.5-6.5c0-4.5-4-6.5-4.5-11-2.5 2-4 4.5-4 7-1-.5-2-1.8-2.2-3C6.5 9.8 5.5 12.3 5.5 15a6.5 6.5 0 0 0 6.5 6.5z"/></svg>',washer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="3" width="15" height="18" rx="2.5"/><circle cx="12" cy="13.5" r="4.3"/><path d="M8 6.5h1.5M13 6.5h3"/></svg>',dryer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="3" width="15" height="18" rx="2.5"/><circle cx="12" cy="13.5" r="4.3"/><path d="M8 6.5h1.5M10 13.8c.7-.8 1.3-.8 2 0s1.3.8 2 0"/></svg>',dish:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M4.5 8h15M8 5.5h1.5"/><path d="M8.5 17.5a3.5 3.5 0 0 1 7 0M12 14v-1.5"/></svg>',heater:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="2.5" width="11" height="16" rx="5.5"/><path d="M9.5 18.5v3M14.5 18.5v3M12 7.5c-1.4 1.8-2 2.8-2 3.8a2 2 0 0 0 4 0c0-1-.6-2-2-3.8z"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',chev:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'},E=a=>qn(Un[a]??Un.bolt),j=(a,s=1)=>{let e=a.toLocaleString("fr-FR",{maximumFractionDigits:s,minimumFractionDigits:0,useGrouping:!1}),[t,n]=e.split(",");return t.replace(/\B(?=(\d{3})+(?!\d))/g,"\u202F")+(n?","+n:"")},le=a=>a.toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2}),P=a=>a==null?"\u2014":j(a/1e3,1),$=a=>a==null?"\u2014":Math.abs(a)<10?le(a):j(a,0),en=a=>a==null?"\u2014":le(a),ve=a=>a==null?"\u2014":j(Math.abs(a)>=100?Math.round(a/10)*10:Math.round(a),0),k=a=>a==null?"\u2014":j(a,Math.abs(a)<20?1:0),q=a=>a==null?"\u2014":le(a),_t=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],Q=a=>{if(!a)return"hier";let s=new Date(a+"T12:00"),e=new Date;e.setHours(12,0,0,0);let t=Math.round((e.getTime()-s.getTime())/864e5);return t===1?"hier":t===2?"avant-hier":_t[s.getDay()]},Le=a=>a.charAt(0).toUpperCase()+a.slice(1),On=a=>{a.preventDefault(),history.pushState(null,"",a.currentTarget.getAttribute("href")??"/hestia/energie"),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0}))},Pe=["janvier","f\xE9vrier","mars","avril","mai","juin","juillet","ao\xFBt","septembre","octobre","novembre","d\xE9cembre"],kt=["janv.","f\xE9vr.","mars","avr.","mai","juin","juil.","ao\xFBt","sept.","oct.","nov.","d\xE9c."],Bn={bleu:"ok",vert:"benefit",orange:"action",rouge:"urgent"},yt={bleu:"--nw-benefit",vert:"--nw-benefit",orange:"--nw-act",rouge:"--nw-alert"},jt={fuite_eau:"drop",disjoncteur:"bolt",chauffe_eau_reseau:"drop",soleil_en_trop:"sun",soleil_machine_ok:"sun",soleil_chaleur:"sun",machines_ensemble:"plug",machine_sans_soleil:"sun",machine_heures_pleines:"clock",oublie:"plug",rien_hc:"clock",rien_hc_bientot:"clock",rien_soleil_juste:"sun",rien_soleil_petit:"sun",rien_soleil_plus_tard:"sun",rien:"home",jour_rouge:"bolt",jour_rouge_demain:"clock"},Nn={bleu:"--nw-cold",blanc:"--nw-fg",rouge:"--nw-alert"},H=a=>a===12?"midi":a===0||a===24?"minuit":`${a}\xA0h`,Z=a=>a.replace(/ /g,"\xA0"),K=a=>a.getHours()+"\xA0h\xA0"+String(a.getMinutes()).padStart(2,"0"),He=a=>new Date(a+"T12:00:00"),Kn=a=>{let s=He(a).getDate();return s===1?"1er":String(s)},nn=a=>`${Kn(a)} ${Pe[He(a).getMonth()]}`,In=a=>a<=.3?"un quart":a<=.4?"un tiers":a<=.58?"la moiti\xE9":a<=.7?"deux tiers":a<=.85?"trois quarts":"presque tout",sn=a=>{let s=a.match(/(\d+) h(?: (\d+))?/);return s?Number(s[1])*60+(s[2]?Number(s[2]):0):0};function ae(a){return(a??[]).flatMap(([s,e])=>{let t=sn(s),n=sn(e);return n>t?[[t,n]]:[[t,1440],[0,n]]})}var qe=a=>a.length>0&&a.every(([s,e])=>s>=1200||e<=570);function oe(a,s){let e=Math.max(...a.map(t=>t.v),0)||1;return i`<div class="hb" style="--c:var(${s})">${a.map(t=>i`<span class="n${t.muted?" muted":""}"><span>${t.n}</span>${t.live?i`<span class="live">${t.live}</span>`:c}</span>
  <span class="t${t.dash?" dash":""}"><i class=${t.soft?"soft":""} style="width:${Math.max(1,t.v/e*100)}%"></i></span>
  <span class="v${t.muted?" muted":""}">${t.txt}${t.sub?i`<small>${t.sub}</small>`:c}</span>`)}</div>`}function Fn(a,s){let e=a.filter((r,o)=>o<5||r.live),t=a.filter(r=>!e.includes(r));if(t.length<2)return a;let n=t.reduce((r,o)=>r+o.v,0);return[...e,{n:`Et ${t.length} autres`,v:n,txt:s(n),muted:!0,soft:!0}]}function Re(a,s,e={}){let t=Math.max(...a.map(u=>u??0),0),n=e.max??(t*1.15||1),r=t>0?a.indexOf(t):-1,o=a.length;return i`<div class="cols${e.tall?" tall":""}" style="--c:var(${s})">${a.map((u,l)=>{let p=u==null?2:Math.max(2,u/n*100);return i`<div class="c${e.bands?.(l)?" band":""}">${l===r&&e.pin?i`<span class="pin ${l<2?"l":l>o-3?"r":""}" style="bottom:${p}%">${e.pin(u)}</span>`:c}<i class="${u==null?"none":""}${e.part===l?" part":""}" style="height:${p}%"></i></div>`})}
  ${e.limit?i`<div class="limit" style="bottom:${e.limit/n*100}%"><span>${e.limitLabel}</span></div>`:c}</div>`}var tn=i`<div class="ticks"><span>0 h</span><span>6 h</span><span>12 h</span><span>18 h</span><span>24 h</span></div>`,rn=class extends V{constructor(){super();this._config={type:"custom:hestia-energy-card",card:"complete"};this._folded=new Set}static{this.styles=[pe(Rn),pe(Pn)]}static{this.properties={_view:{state:!0},_open:{state:!0},_folded:{state:!0},_error:{state:!0},_hover:{state:!0},_pin:{state:!0}}}static getStubConfig(){return{card:"complete"}}static getConfigElement(){return document.createElement("hestia-energy-card-editor")}setConfig(e){let t=e.card??"complete";if(t!=="complete"&&t!=="tuile"&&t!=="conseils"&&!ze.includes(t))throw new Error(`card: ${t} ? (complete, tuile, conseils, ${ze.join(", ")})`);this._config={...e,card:t}}getCardSize(){return this._config.card==="tuile"?2:8}getGridOptions(){let e=this._config.card;return e==="complete"||e==="conseils"?{columns:"full",rows:"auto"}:{columns:12,rows:"auto",min_columns:6}}set hass(e){let t=this._hass?.connection!==e.connection;this._hass=e,(t||!this._stop)&&this._follow()}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._unfollow()}_unfollow(){this._stop?.(),this._stop=void 0,window.clearTimeout(this._again)}_follow(){this._unfollow(),!(!this._hass||!this.isConnected)&&(this._stop=Tn(this._hass.connection,e=>{this._view=e,this._error=void 0},e=>{this._stop=void 0,this._error=e.message??"Hestia \xC9nergie ne r\xE9pond pas.",this._again=window.setTimeout(()=>this._follow(),3e4)},()=>{this._stop=void 0,this._again=window.setTimeout(()=>this._follow(),2e3)}))}render(){let e=this._view;if(this._error&&!e)return i`<ha-card><div class="empty">${this._error}</div></ha-card>`;if(!e||!e.pret)return i`<ha-card><div class="empty">Hestia Énergie lit la page Énergie…</div></ha-card>`;let t=this._config.card;return t==="tuile"?this._tile(e):t==="conseils"?this._advice(e):t!=="complete"?i`<ha-card>${this._detail(e,t,!1)}</ha-card>`:i`${this._full(e)}${this._open?i`<div class="ov" @click=${n=>{n.target===n.currentTarget&&(this._open=void 0)}}
   @keydown=${n=>{n.key==="Escape"&&(this._open=void 0)}}><ha-card class="sheet" role="dialog" aria-modal="true">${this._detail(e,this._open,!0)}</ha-card></div>`:c}`}_name(){return this._config.name??"Maison"}_live(e){return!!(e.equipement.direct&&e.direct?.maison_w!=null)}_when(e){return e?.periode==="hc"?"en heures creuses":e?.periode==="hp"?"en heures pleines":""}_nowSay(e,t){let n=e.direct,r=n.maison_w??0,o=Math.min(n.soleil_w??0,r),u=n.achat_w??0,l=n.revente_w??0,p=this._when(n),g=n.prix!=null?i`<b>${$(u/1e3*n.prix)} € de l'heure</b>${p?`, ${p}`:""}`:null,d=t?i`La maison consomme <b>${P(r)} kW</b>. `:c;return e.equipement.soleil&&l>=30&&u<30?i`${d}Le soleil couvre tout, et <b>${P(l)} kW</b> partent au réseau.`:e.equipement.soleil&&o>=30?t?i`${d}Le soleil en couvre <b>${Math.round(o/r*100)} %</b>, le reste vient du réseau${g?i` : ${g}`:""}.`:i`Le soleil en donne <b>${P(o)} kW</b> ; le reste vient du réseau${g?i` : ${g}`:""}.`:g?i`${d}Tout vient du réseau : ${g}.`:d}_tile(e){let t=e.direct?.bandeau,n=t?yt[t.couleur]??"--nw-benefit":"--nw-benefit",r=this._live(e),o=t?[t.pastille,n]:void 0,u={ic:"home",c:"--nw-home",subject:"\xC9nergie",pill:o,over:!1},l=(e.pistes??[]).find(d=>d.euros_an!=null);if(r)return i`<ha-card class="tile">${this._ans({...u,period:"en ce moment",val:P(e.direct.maison_w),unit:"kW",cap:"pour toute la maison",why:t?.couleur==="bleu"&&l?i`Rien à faire maintenant. ${this._saySave(l)}`:this._nowSay(e,!1)})}</ha-card>`;let p=e.dernier_jour,g=Q(p?.jour);return p?i`<ha-card class="tile">${this._ans({...u,period:g,...p.euros!=null?{val:$(p.euros),unit:"\u20AC"}:{val:k(p.kwh_achetes),unit:"kWh"},cap:"pour toute la maison",why:l?this._saySave(l):p.euros!=null?i`<b>${k(p.kwh_achetes)} kWh</b> achetés au réseau${p.soleil_couvre!=null?i` ; le soleil a couvert <b>${p.soleil_couvre} %</b> de la maison`:""}.`:"Le prix sera connu avec le contrat."})}</ha-card>`:i`<ha-card class="tile">${this._ans({...u,period:"",msg:"Les premiers jours arrivent",why:"Enedis envoie chaque journ\xE9e le lendemain."})}</ha-card>`}_full(e){let t=e.direct?.bandeau,n=new Date,r=n.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})+" \xB7 "+K(n),o=this._clock(e),u=[o&&!this._live(e)?c:this._nowSection(e),this._todaySection(e),this._monthSection(e)].filter(l=>l!==c);return i`<ha-card>
   <div class="head"><div style="min-width:0"><div class="nw-label">Énergie</div><div class="nw-title">${this._name()}</div></div><div class="when">${r}</div></div>
   ${o??(t&&this._live(e)?i`<div class="nw-band nw-glass" data-level=${Bn[t.couleur]??"ok"}><div class="nw-band-row"><span class="nw-band-pic box">${E(jt[t.id]??"home")}</span>
    <div class="nw-band-text"><p class="nw-band-kicker">En ce moment</p><p class="nw-band-title">${t.titre}</p>${t.pourquoi||this._periodSay(e)?i`<p class="nw-band-line">${t.pourquoi||this._periodSay(e)}</p>`:c}</div></div></div>`:c)}
   <div class="periods${u.length===2?" two":""}">${u}</div>
   ${e.usage?this._section("usage","Votre contrat, bien utilis\xE9","sur 12 mois",this._usage(e)):c}
   ${e.pistes?.length?this._section("save","Pour \xE9conomiser","sur 12 mois, en euros",i`<div class="pistes better">${e.pistes.slice(0,6).map(l=>l.maintenant?this._better(l):this._piste(l))}</div>`):c}
   ${this._section("more","En d\xE9tail","touchez pour ouvrir",i`<div class="more">${this._goes(e)}</div>`)}
  </ha-card>`}_clock(e){let t=e.heures?.aujourdhui??[],n=e.heures?.hier??[],r=t.some(f=>f.achat!=null),o=r?t:n;if(!o.some(f=>f.achat!=null))return;let u=new Date,l=u.getHours()+u.getMinutes()/60,p=ae(e.heures_creuses),g=f=>p.some(([M,C])=>f*60+30>=M&&f*60+30<C),d=Math.max(.3,...o.map(f=>f.achat??0),...r?n.map(f=>f.achat??0):[]),m=Math.max(.3,...o.map(f=>f.soleil??0)),h=170,w=98,v=46,_=86,x=32,b=f=>f/24*Math.PI*2-Math.PI/2,A=(f,M)=>`${(h+Math.cos(b(f))*M).toFixed(1)} ${(h+Math.sin(b(f))*M).toFixed(1)}`,y=(f,M,C)=>`M${A(f+.5,M)} L${A(f+.5,C)} `,S=e.contrat,T=S?.prix_hp??null,z=S?.prix_hc??null,W=S?.prix_base??null,ee=f=>S?.option==="base"?W:S?.option==="hphc"?g(f)?z:T:null,xe=[],We=0,an=!1,on=!1;for(let f=0;f<24;f++){let M=o[f],C=r&&f>u.getHours(),I=C?n[f]?.achat??null:M?.achat??null,je=C?null:(M?.soleil??0)>=.01?M.soleil:null;!C&&I!=null&&(We+=I),je!=null&&(an=!0),C&&I!=null&&(on=!0),xe.push({i:f,cls:C?"next":g(f)?"off":"peak",val:I,sun:je,future:C})}let $e=f=>f<1?j(f,2):k(f),D=this._pin??this._hover,_e=(f,M)=>{let C=Math.abs(f-M);return Math.min(C,24-C)},Gn=f=>D==null?0:_e(f,D)===0?16:_e(f,D)===1?5:0,Xn=f=>{let M=f.val!=null?ee(f.i):null;return`de ${H(f.i)} \xE0 ${H(f.i+1)} : ${f.val!=null?`${$e(f.val)} kWh ${f.future?"hier":"achet\xE9s"}`:"rien de mesur\xE9"}${M!=null&&f.val!=null?`, environ ${le(f.val*M)} \u20AC`:""}${f.sun!=null?`, ${$e(f.sun)} kWh de soleil`:""}`},Yn=xe.map(f=>{let M=Gn(f.i),C=D==null?"":_e(f.i,D)===0?" on":_e(f.i,D)===1?" near":" far";return L`<g class=${`h${C}`}>${f.val!=null?L`<path class=${f.cls} d=${y(f.i,w-(M?2:0),w+3+f.val/d*v+M)}></path>`:c}
    ${f.sun!=null?L`<path class="sun" d=${y(f.i,_+(M?2:0),_-3-f.sun/m*x-M*.6)}></path>`:c}</g>`}),ke=f=>{this._hover=f},ln=f=>{this._pin=this._pin===f?void 0:f},Qn=xe.map(f=>L`<path class="hit" d=${y(f.i,44,164)} tabindex="0" role="button" aria-label=${Xn(f)} aria-pressed=${this._pin===f.i?"true":"false"}
   @pointerenter=${()=>ke(f.i)} @focus=${()=>ke(f.i)} @blur=${()=>ke()} @click=${()=>ln(f.i)}
   @keydown=${M=>{M.key==="Enter"||M.key===" "?(M.preventDefault(),ln(f.i)):M.key==="Escape"&&(this._pin=void 0)}}></path>`),ue=this._live(e),B=e.direct,J=B?.bandeau,un=e.jusqu_ici,N=e.dernier_jour,cn=ue?[`${P(B.maison_w)} kW`,"en ce moment"]:r&&un?.euros!=null?[`${$(un.euros)} \u20AC`,"depuis minuit"]:!r&&N?.euros!=null?[`${$(N.euros)} \u20AC`,Q(N.jour)]:[`${k(We)} kWh`,r?"depuis minuit":Q(N?.jour)],R=D!=null?xe[D]:void 0,ne=R?[R.val!=null?`${$e(R.val)} kWh`:"\u2014",`${H(R.i)} \u2013 ${H(R.i+1)}${R.future?" \xB7 hier":""}`,[R.val!=null&&ee(R.i)!=null?`\u2248 ${le(R.val*ee(R.i))} \u20AC`:"",R.sun!=null?`soleil ${$e(R.sun)} kWh`:""].filter(Boolean).join(" \xB7 ")]:[cn[0],cn[1],""],te=r?e.jour?.soleil_kwh:N?.soleil_kwh,Zn=B?.prix!=null&&!(e.contrat?.a_confirmer??[]).includes("option"),et=B?.prochain_changement?` jusqu'\xE0 ${K(new Date(B.prochain_changement.a))}`:"",pn=this._tempo(B),dn=[...pn?[pn]:[],...Zn?[["Le kWh maintenant",`${q(B.prix)} \u20AC`,`${this._when(B)}${et}`.trim()||"\xE0 toute heure","--nw-home"]]:[],...r&&e.pointe?[["Heure la plus charg\xE9e",`${P(e.pointe.kw*1e3)} kW`,`entre ${H(e.pointe.h)} et ${H(e.pointe.h+1)}`,"--nw-grid"]]:[],...e.equipement.soleil&&te!=null&&te>=.05?[["Soleil",`${k(te)} kWh`,r?"produits aujourd'hui":`produits ${Q(N?.jour)}`,"--nw-sun"]]:[]],nt=ue&&J?J.titre:`${r?"Aujourd'hui":Le(Q(N?.jour))}, en un tour d'horloge`,hn=ue&&J?J.pourquoi||this._periodSay(e):r?"":"Le compteur envoie chaque journ\xE9e le lendemain.",tt=`${r?"Aujourd'hui":Le(Q(N?.jour))} heure par heure : ${k(We)} kWh achet\xE9s au r\xE9seau${te!=null&&te>=.05?`, ${k(te)} kWh de soleil`:""}.`,ye=(f,M,C,I=4)=>{let[je,st]=A(f,w+v+16).split(" ");return L`<text x=${je} y=${Number(st)+I} text-anchor=${C}>${M}</text>`};return i`<div class="clock" data-level=${ue&&J?Bn[J.couleur]??"ok":"ok"}>
   <svg class="dial" viewBox="0 0 340 340" role="group" aria-label=${tt} @pointerleave=${()=>ke()}>
    <circle class="ring" cx="170" cy="170" r=${w}></circle>
    <g class=${`bars${D!=null?" picking":""}`}>${Yn}</g>
    ${ye(0,"0 h","middle",0)}${ye(6,"6 h","end")}${ye(12,"12 h","middle",7)}${ye(18,"18 h","start")}
    ${r?L`<path class="hand" d=${`M${A(l,w-6)} L${A(l,w+v+6)}`}></path>
     <circle class="ping" cx=${A(l,w+v+6).split(" ")[0]} cy=${A(l,w+v+6).split(" ")[1]} r="4.5"></circle>
     <circle class="tip" cx=${A(l,w+v+6).split(" ")[0]} cy=${A(l,w+v+6).split(" ")[1]} r="4.5"></circle>`:c}
    <text class=${`cv${R?" pk":""}`} x="170" y=${ne[2]?166:172}>${ne[0]}</text><text class="cl" x="170" y=${ne[2]?188:194}>${ne[1]}</text>
    ${ne[2]?L`<text class="cl cs" x="170" y="206">${ne[2]}</text>`:c}
    <g class="hits">${Qn}</g>
   </svg>
   <div class="ct">
    ${ue&&J?i`<p class="nw-label">En ce moment</p>`:c}
    <p class="ctt">${nt}</p>${hn?i`<p class="ans-w">${hn}</p>`:c}
    ${dn.length?i`<div class="cstats">${dn.map(([f,M,C,I])=>i`<div class="cstat" style="--c:var(${I})"><span>${f}</span><b>${M}</b><small>${C}</small></div>`)}</div>`:c}
    <div class="nw-legend"><span><i style="--c:var(--nw-home)"></i>acheté en heures pleines</span>${p.length?i`<span><i style="--c:var(--nw-cold)"></i>en heures creuses</span>`:c}
     ${an?i`<span><i style="--c:var(--nw-sun)"></i>soleil, vers le centre</span>`:c}${on?i`<span><i style="--c:color-mix(in srgb, var(--nw-fg) 18%, transparent)"></i>hier, aux heures à venir</span>`:c}
     <span class="hint">touchez une heure pour ses chiffres</span></div>
   </div>
  </div>`}_tempo(e){let t=e?.couleur,n=e?.couleur_demain;return!t&&!n?null:n==="rouge"&&t!=="rouge"?["Tempo demain","Rouge",t?`jour ${t} aujourd'hui`:"de 6 h \xE0 6 h",Nn.rouge]:["Tempo aujourd'hui",Le(t??"\u2014"),n?`demain ${n}`:"demain pas encore connu",Nn[t??""]??"--nw-fg"]}_periodSay(e){let t=e.direct,n=t?.prochain_changement;if(!n||t?.periode!=="hp"&&t?.periode!=="hc")return"";let r=new Date(n.a),o=t.periode==="hp"?"Heures pleines":"Heures creuses",u=r.getHours()*60+r.getMinutes(),l=(e.heures_creuses??[]).find(([g])=>sn(g)===u),p=n.periode==="hc"&&l?`, puis heures creuses jusqu'\xE0 ${Z(l[1])}`:"";return`${o} jusqu'\xE0 ${K(r)}${p}.`}_section(e,t,n,r){let o=!this._folded.has(e);return i`<div class="sec"><button class="nw-fold-head" aria-expanded=${String(o)} @click=${()=>{let u=new Set(this._folded);o?u.add(e):u.delete(e),this._folded=u}}>
   <span class="nw-title">${t}</span><span class="nw-sum">${n}</span><span class="nw-chevron">${E("chev")}</span></button>${o?r:c}</div>`}_flow(e){let t=e.direct,n=(t.periode??"").includes("hc"),r=n?"--nw-cold":"--nw-level3",o=e.equipement.soleil?Math.max(0,t.soleil_w??0):null,u=Math.max(0,t.maison_w??0),l=(t.achat_w??0)>=30,p=!l&&(t.revente_w??0)>=30,g=o==null?0:Math.min(o,u),d=x=>x<1e3?`${j(x,0)} W`:`${j(x/1e3,2)} kW`,m=(x,b,A,y,S,T=!1,z=c)=>i`<div class="fnode${T?" dim":""}" style="--c:var(${b});--a:${Math.min(1,Math.max(.25,S)).toFixed(2)}"><span class="fdot">${E(x)}</span><span class="fl">${y}</span><span class="fv">${A}</span>${z}</div>`,h=(x,b,A,y=!1)=>{let S=b>=30,T=S?Math.max(1.2,3.2-b/1500):0;return i`<div class="flink${S?"":" off"}${y?" back":""}" style="--c:var(${x});--dur:${T.toFixed(2)}s"><span class="fsay">${S?i`<b>${A[0]}</b><span>${A[1]}</span>`:""}</span><span class="fline">${S?i`<i></i><i></i><i></i>`:c}</span></div>`},w=l?t.achat_w:p?t.revente_w:0,v=l?[`\u2199 ${d(w)}`,"achet\xE9s"]:[`\u2197 ${d(w)}`,"revendus"],_=e.eau&&e.eau.jour_l>0?i`<span class="fw">${E("drop")}${j(e.eau.jour_l,0)} L d'eau aujourd'hui</span>`:c;return i`<div class="flow2${o==null?" two":""}">
   ${o!=null?i`${m("sun","--nw-prod",d(o),"Production",o/1500,o<30)}${h("--nw-prod",g,[d(g),"en direct"])}`:c}
   ${m("home",r,d(u),"Maison",u/1500,!1,_)}
   ${h(r,w,v,l)}
   ${m("grid",r,`${p?"+":""}${d(w)}`,"R\xE9seau",w/1500,!l&&!p)}
  </div>`}_nowSection(e){let t=e.direct;if(!t)return c;if(!this._live(e)){if(t.prix==null||(e.contrat?.a_confirmer??[]).includes("option"))return c;let n=t.prochain_changement?` jusqu'\xE0 ${K(new Date(t.prochain_changement.a))}`:"";return this._section("now","En ce moment",this._when(t),i`<div class="lines"><div class="line"><span class="ico" style="--c:var(--nw-grid)">${E("clock")}</span>
    <span>Le kWh coûte <b>${q(t.prix)} €</b>${this._when(t)?` ${this._when(t)}`:""}${n}.${t.couleur_demain?` Demain, jour ${t.couleur_demain}.`:""}</span></div></div>`)}return this._section("now","En ce moment",`${P(t.maison_w)}\xA0kW pour toute la maison`,i`${this._flow(e)}
   <div class="lines"><div class="line"><span class="ico" style="--c:var(--nw-home)">${E("home")}</span><span>${this._nowSay(e,!0)}</span></div></div>`)}_todaySection(e){let t=e.jusqu_ici;if(t){let r=new Date(t.jusqu_a).getHours(),o=t.euros!=null&&t.hier_euros!=null,u=o?t.euros:t.kwh,l=o?t.hier_euros:t.hier_kwh,p=u-l,g=o?Math.abs(p)<.1:Math.abs(p)<.5,d=o?"\u20AC":"kWh",m=h=>o?$(h):k(h);return this._section("today","Aujourd'hui","depuis minuit",i`<div class="big"><b>${m(u)} ${d}</b><span>${o?"d\xE9pens\xE9s":"consomm\xE9s"} depuis minuit</span></div>
    <p class="say">${g?i`Comme hier à la même heure.`:i`<b>${m(Math.abs(p))} ${d} de ${p>0?"plus":"moins"}</b> qu'hier à la même heure.`}</p>
    ${oe([{n:"Aujourd'hui",v:u,txt:`${m(u)} ${d}`},{n:`Hier \xE0 ${H(r)}`,v:l,txt:`${m(l)} ${d}`,muted:!0,soft:!0}],"--nw-home")}`)}let n=e.dernier_jour;return n?this._section("today",Le(Q(n.jour)),"toute la journ\xE9e",i`<div class="big"><b>${n.euros!=null?`${$(n.euros)}\xA0\u20AC`:`${k(n.kwh_achetes)}\xA0kWh`}</b><span>${n.euros!=null?"pour toute la journ\xE9e":"achet\xE9s au r\xE9seau"}</span></div>
   ${n.euros!=null?i`<p class="say"><b>${k(n.kwh_achetes)} kWh</b> achetés au réseau${n.soleil_couvre!=null?i` ; le soleil a couvert <b>${n.soleil_couvre} %</b> de la maison`:""}.</p>`:c}`):c}_monthSection(e){let t=e.mois;if(!t)return c;let n=new Date,r=t.euros??t.euros_energie,o=e.mois_an_dernier,u=e.projection,l=o?.euros!=null?` L'an dernier, ${Pe[n.getMonth()]} avait co\xFBt\xE9 ${$(o.euros)}\xA0\u20AC.`:"";return this._section("month","Ce mois-ci",`depuis le 1er ${Pe[n.getMonth()]}`,i`<div class="big"><b>${r!=null?`${en(r)}\xA0\u20AC`:`${k(t.kwh_achetes)}\xA0kWh`}</b><span>${r==null?"achet\xE9s au r\xE9seau":t.euros!=null?"abonnement compris":"sans l'abonnement"}</span></div>
   ${u!=null?i`<p class="say">Au même rythme, <b>environ ${$(u)} €</b> à la fin du mois.${l}</p>
    <div><div class="track" style="--c:var(--nw-ok)"><i style="width:${Math.min(100,(r??0)/u*100)}%"></i></div>
     <div class="track-l"><span>déjà <b>${$(r)} €</b></span><span>fin du mois <b>${$(u)} €</b></span></div></div>`:l?i`<p class="say">${l.trim()}</p>`:c}`)}_go(e,t,n,r,o,u,l){let[p,g]=r.split(" \xB7 ");return i`<button class="go" style="--c:var(${n})" @click=${()=>{this._open=e}}><span class="g-h"><span class="ico">${E(t)}</span><span class="g-t">${p}<small>${g}</small></span><span class="ar">›</span></span>
   <span class="g-v">${o}<small>${u}</small></span><span class="g-s">${l}</span></button>`}_goes(e){let t=[],n=e.jour;e.equipement.soleil&&n?.soleil_kwh!=null&&t.push(this._go("soleil","sun","--nw-sun","Soleil \xB7 aujourd'hui",k(n.soleil_kwh),"kWh produits",n.soleil_garde!=null?`La maison en a gard\xE9 ${n.soleil_garde}\xA0%.`:n.soleil_kwh>0?"Une partie de la production n'a pas \xE9t\xE9 mesur\xE9e.":"Rien encore aujourd'hui."));let r=this._heatSum(e);r&&t.push(this._go("chauffage","flame","--nw-heat","Chauffage \xB7 depuis le 1er octobre",r.val,r.unit,r.say)),e.veille&&t.push(this._go("veille","moon","--nw-watch","Veille \xB7 chaque nuit",String(e.veille.w),"W quand tout dort",e.veille.euros_par_an!=null?`Environ ${ve(e.veille.euros_par_an)}\xA0\u20AC par an.`:"Ce que tire la maison quand tout dort."));let o=e.eau,u=e.direct?.fuite?.minutes;o&&t.push(this._go("eau","drop","--nw-water","Eau \xB7 ce mois-ci",o.mois_euros!=null?en(o.mois_euros):j(o.mois_l,0),o.mois_euros!=null?"\u20AC":"litres",`${o.mois_euros!=null?`${j(o.mois_l,0)}\xA0litres. `:""}${u?`L'eau coule depuis ${Math.round(u)}\xA0min.`:"Pas de fuite."}`));let l=e.appareils_jour?.appareils?.[0];l&&t.push(this._go("appareils","plug","--nw-home","Appareils \xB7 aujourd'hui",k(l.kwh),`kWh \xB7 ${l.nom}`,"Celui qui a le plus consomm\xE9."));let p=e.pointe;p&&t.push(this._go("pointe","bolt","--nw-grid","Pointe \xB7 aujourd'hui",P(p.kw*1e3),"kW au plus fort",e.contrat?.kva?`Sur ${e.contrat.kva}\xA0kVA : ${p.part!=null&&p.part>=.7?"pr\xE8s de la limite":"de la marge"}.`:"L'heure la plus charg\xE9e."));let g=e.chauffe_eau;g&&t.push(this._go("chauffe_eau","heater","--nw-water",`Chauffe-eau \xB7 ${g.simulation?"simulation":"pilot\xE9"}`,g.reserve!=null?String(g.reserve):"\u2014","% de r\xE9serve",g.chauffer?At[g.raison]??"Il chauffe.":g.prochaine_chauffe?`Prochaine chauffe \xE0 ${K(new Date(g.prochaine_chauffe))}.`:"Pas de chauffe pr\xE9vue."));let d=e.contrat;return d?.option==="hphc"&&d.part_hc!=null?t.push(this._go("contrat","doc","--nw-benefit","Contrat \xB7 ce mois-ci",String(Math.round(d.part_hc*100)),qe(ae(e.heures_creuses))?"% la nuit":"% en heures creuses","de vos achats en heures creuses.")):d&&t.push(this._go("contrat","doc","--nw-benefit","Contrat \xB7 ce mois-ci",d.option==="tempo"?"Tempo":d.option==="hphc"?"HP / HC":"Base",d.kva?` \xB7 ${d.kva}\xA0kVA`:"",d.option==="base"&&d.prix_base!=null?`${q(d.prix_base)}\xA0\u20AC le kWh \xE0 toute heure.`:"Vos prix et vos heures.")),t}_heatSum(e){let t=e.chauffage,n=t?.etat==="pret"?t.saison:null,r=t?.poele?.saison;return n?.eur!=null&&r?.eur!=null?{val:$(n.eur+r.eur),unit:"\u20AC",say:`Po\xEAle ${$(r.eur)}\xA0\u20AC, radiateurs ${$(n.eur)}\xA0\u20AC.`,both:!0}:r?{val:r.eur!=null?$(r.eur):j(r.kg,0),unit:r.eur!=null?"\u20AC":"kg",say:`Po\xEAle : ${j(r.kg,0)}\xA0kg de granul\xE9s.`,both:!1}:n?{val:n.eur!=null?$(n.eur):k(n.kwh),unit:n.eur!=null?"\u20AC":"kWh",say:"Radiateurs, estim\xE9s d'apr\xE8s le froid.",both:!1}:t?.etat==="peu_lie"?{val:"\u2014",unit:"",say:"Vous chauffez sans doute avec une autre \xE9nergie.",both:!1}:null}_usage(e){let t=e.usage,n=qe(ae(e.heures_creuses)),r=n?"la nuit":"en heures creuses",o=t.appareils.find(b=>b.type==="chauffe_eau"&&b.euros_an>=2),u=b=>Math.round(b*100),l=t.part_hc_chauffe_eau!=null&&o&&t.part_hc_chauffe_eau-t.part_hc>=.02?t.part_hc_chauffe_eau:null,p=e.contrat?.part_hc,g=i`<div class="u-gauge"><p class="u-k">Vos achats pris ${r}</p>
    <p class="u-v"><b>${u(t.part_hc)} %</b>${l!=null?i`<span>→ <b class="ok">${u(l)} %</b> avec le chauffe-eau ${r}</span>`:c}</p>
    <div class="track" style="--c:var(--nw-cold)">${l!=null?i`<i class="next" style="width:${l*100}%"></i>`:c}<i style="width:${t.part_hc*100}%"></i>
     ${t.seuil_hc!=null?i`<span class="mark" style="left:${Math.min(100,t.seuil_hc*100)}%"></span>`:c}</div>
    <div class="track-l"><span>sur 12 mois</span>${t.seuil_hc!=null?i`<span>rentable dès <b>${u(t.seuil_hc)} %</b></span>`:c}</div>
    ${p!=null&&Math.abs(p-t.part_hc)>=.05?i`<p class="u-n">Ce mois-ci : ${u(p)} %.${p<t.part_hc&&o?" En hiver, le chauffe-eau chauffe sans soleil, en heures pleines.":""}</p>`:c}</div>`,d=t.puissance,m=d?.plus_bas,h=d&&m?i`<p class="u-n u-kva">${m.jours_au_dessus===0&&m.euros_an!=null&&m.euros_an>=5?i`Puissance : <b>${m.kva} kVA suffiraient</b>, ${j(m.euros_an,0)} € de moins par an d'abonnement. Votre plus forte pointe : ${P(d.pointe_w)} kW.`:i`Puissance : <b>gardez ${d.kva} kVA</b>. La maison a dépassé ${m.kva} kW ${m.jours_au_dessus} jour${m.jours_au_dessus>1?"s":""} en 12 mois.`}</p>`:c,w=t.base_de_plus,v=o!=null&&w!=null&&w<0&&o.euros_an>-w,_=w==null?c:w>=0?i`<div class="u-verdict good"><p class="u-k">Votre option heures creuses</p><p class="u-big">C'est la bonne</p>
    <p class="u-n">En Base, ces 12 mois auraient coûté <b>${$(w)} € de plus</b>.${o?i` Avec le chauffe-eau ${r}, l'écart passerait à <b>${j(w+o.euros_an,0)} €</b>.`:""}</p>${h}</div>`:i`<div class="u-verdict"><p class="u-k">Votre option heures creuses</p><p class="u-big">${v?"Rentable, si\u2026":"La Base co\xFBterait moins"}</p>
    <p class="u-n">En Base, ces 12 mois auraient coûté <b>${$(-w)} € de moins</b>.${v?` Avec le chauffe-eau ${r}, les heures creuses redeviendraient rentables.`:""}</p>${h}</div>`,x=_===c?d&&m?i`<div class="u-verdict"><p class="u-k">Votre contrat</p>${h}</div>`:c:i`${_}`;return i`<div class="usage"><div class="u-top">${g}${x}</div></div>`}_machines(e){let t=e.usage;if(!t?.appareils.length)return c;let n=!!e.equipement.soleil,r=qe(ae(e.heures_creuses)),o=h=>Math.round(h*100),u=t.prix,l=i`${n&&u.soleil!=null?i`Au soleil, un kWh ne coûte que la revente perdue, <b>${q(u.soleil)} €</b> ; `:""}${r?"la nuit":"en heures creuses"}, <b>${q(u.hc)} €</b> ; en heures pleines, <b>${q(u.hp)} €</b>.`,p=i`<div class="mach">${t.appareils.map(h=>i`<span class="mn">${h.nom}<small>${k(h.kwh)} kWh par an</small></span>
    <span class="stack" role="img" aria-label="${n?`${o(h.soleil)}\xA0% au soleil, `:""}${o(h.nuit)} % ${r?"la nuit":"en heures creuses"}, ${o(h.pleines)} % en heures pleines">${n?i`<i style="width:${h.soleil*100}%;--c:var(--nw-sun)"></i>`:c}<i style="width:${h.nuit*100}%;--c:var(--nw-cold)"></i><i style="width:${h.pleines*100}%;--c:var(--nw-home)"></i></span>
    <span class="me">${h.euros_an>=1?i`<b>${j(h.euros_an,0)} €</b><small>par an</small>`:i`<small>rien à gagner</small>`}</span>`)}</div>
   <div class="nw-legend">${n?i`<span><i style="--c:var(--nw-sun)"></i>au soleil</span>`:c}<span><i style="--c:var(--nw-cold)"></i>${r?"la nuit":"en heures creuses"}</span><span><i style="--c:var(--nw-home)"></i>en heures pleines</span></div>`,g=t.soleil_mois.filter(h=>h.sur>=20),d="JFMAMJJASOND",m=n&&g.length>=6?this._enc("Du soleil en trop, mois par mois",`Les jours o\xF9 le soleil en trop suffit pour une machine. Les autres jours, Hestia dit d'attendre ${r?"la nuit":"les heures creuses"}, d'apr\xE8s la pr\xE9vision du jour.`,i`<div class="smonths">${g.map(h=>i`<span class="sm" title="${h.jours} jours sur ${h.sur}"><i style="height:${Math.max(4,h.jours/h.sur*100)}%"></i><small>${d[Number(h.mois.slice(5))-1]}</small></span>`)}</div>`,{wide:!0}):c;return i`${this._enc("Quand tournent vos machines",l,p,{wide:!0,aside:"12 derniers mois"})}${m}`}_saySave(e){return i`Pour économiser : ${e.titre.charAt(0).toLowerCase()+e.titre.slice(1)}, <b>${j(e.euros_an,0)} € ${e.unite??"par an"}</b>.`}_better(e){let t=g=>g.replace(/ ([:;!?%€])/g,"\xA0$1").replace(/(\d) (?=(W|kWh|h|centimes)(\s|$|[ .,:]))/g,"$1\xA0").replace(/ h (\d)/g,"\xA0h\xA0$1"),[n,r]=Dn[e.id]??["home","--nw-home"],o=e.zones?Vn(e):n,u=e.rubrique&&ze.includes(e.rubrique)?e.rubrique:void 0,l=e.gain??e.euros_an,p=i`<span class="ico" style="--c:var(${r})">${E(o)}</span><span class="bt">${e.nom??e.titre}</span>
   <span class="bn"><small>${e.zones?"D'habitude":"Aujourd'hui"}</small>${t(e.maintenant)}</span>
   <span class="ba" aria-hidden="true">→</span>
   <span class="bm"><small>Mieux</small>${t(e.mieux??"")}</span>
   ${l!=null?i`<span class="pe"><b>${j(l,0)} €</b><small>${t(e.sous??e.unite??"par an")}</small></span>`:c}
   ${e.zones?this._frise(e):c}`;return u?i`<button class="piste wide" style="--c:var(${r})" @click=${()=>{this._open=u}}>${p}</button>`:i`<div class="piste wide" style="--c:var(${r})">${p}</div>`}_frise(e){let t=e.zones,n=m=>t.find(h=>h[0]<=m%1440&&m%1440<h[1])?.[2]??"hp",r=e.lancer??null,o=Vn(e),u=(e.departs??[]).map(([m])=>({m,tone:Wn[n(m)][0],ic:o,good:!1}));if(r!=null){let m=u.find(h=>Math.min(Math.abs(h.m-r),1440-Math.abs(h.m-r))<=90);m?(m.good=!0,m.tone="--nw-benefit"):u.push({m:r,tone:"--nw-benefit",ic:"check",good:!0})}u.sort((m,h)=>m.m-h.m);let l=u.some((m,h)=>h>0&&m.m-u[h-1].m<240),p=m=>m/1440*100,g=m=>p(m)<7?"l":p(m)>93?"r":"",d=e.jours&&e.jours<365?`les ${Math.round(e.jours/30)} derniers mois`:"les 12 derniers mois";return i`<span class="fr${l?" tight":""}" aria-hidden="true">
   <span class="fr-pins">${u.map(m=>i`<span class="fr-pin ${g(m.m)}${m.good?" good":""}" style="left:${p(m.m).toFixed(2)}%;--tone:var(${m.tone})"><span class="chip">${m.good&&m.ic!=="check"?i`${E("check")}${E(m.ic)}`:E(m.ic)}<span class="fr-h">${$t(m.m)}</span></span><span class="stem"></span></span>`)}</span>
   <span class="fr-lane">${t.map(([m,h,w])=>{let[v,_,x]=Wn[w],b=(h-m)/60;return i`<span class="fr-seg" style="flex:${h-m};--tone:var(${v})">${_&&b>=2?E(_):c}${b>=4?i`<span class="w">${x}</span>`:c}</span>`})}</span>
   <span class="hrs-x"><span>0 h</span><span>6 h</span><span>12 h</span><span>18 h</span><span>24 h</span></span>
   <span class="fr-say">${e.departs?.length?i`<span><i>${E(o)}</i>ses départs habituels, sur ${d}</span>`:i`<span>il démarre à toute heure, sur ${d}</span>`}${r!=null?i`<span><i class="ok">${E("check")}</i>l'heure à viser</span>`:c}</span>
  </span>`}_piste(e){let[t,n]=Dn[e.id]??["home","--nw-home"],r=e.rubrique&&ze.includes(e.rubrique)?e.rubrique:void 0,o=i`<span class="ico" style="--c:var(${n})">${E(t)}</span><span class="pt">${e.titre}</span><span class="pw">${e.pourquoi}</span>
   ${e.euros_an!=null?i`<span class="pe"><b>${j(e.euros_an,0)} €</b><small>${e.unite??"par an"}</small></span>`:c}`;return r?i`<button class="piste" style="--c:var(${n})" @click=${()=>{this._open=r}}>${o}</button>`:i`<div class="piste" style="--c:var(${n})">${o}</div>`}_ups(e){let t=[];return(e.contrat?.a_confirmer??[]).includes("option")&&t.push(["doc","Un conseil sur votre contrat ?","Dites votre option et vos heures creuses dans les R\xE9glages : Hestia vous dira si elles rapportent."]),e.equipement.direct?e.equipement.appareils||t.push(["plug","Savoir ce qui consomme","Une prise mesur\xE9e sur le frigo ou le chauffe-eau : la veille appareil par appareil, l\u2019appareil oubli\xE9."]):t.push(["bolt","Les gestes au bon moment","Un module sur la prise du Linky : heures creuses, disjoncteur, le prix de l\u2019heure."]),t.map(([n,r,o])=>i`<div class="piste up"><span class="ico">${E(n)}</span><span class="pt">${r}</span><span class="pw">${o}</span></div>`)}_advice(e){let t=e.pistes??[],n=t.filter(u=>u.unite==="par an").reduce((u,l)=>u+(l.euros_an??0),0),r=n>0?{val:j(n,0),unit:"\u20AC",cap:"par an \xE0 gagner, au plus"}:t.length?{val:String(t.length),cap:`conseil${t.length>1?"s":""} pour vous`}:{msg:"Rien \xE0 changer pour l\u2019instant"},o=t.length?`${t.length>1?`${t.length} conseils tir\xE9s`:"Un conseil tir\xE9"} de vos 12 derniers mois, du plus rentable au moins rentable.`:"Hestia regarde chaque jour vos habitudes et votre contrat ; un conseil appara\xEEtra ici d\xE8s qu\u2019il vaut la peine.";return i`<ha-card>${this._ans({ic:"home",c:"--nw-home",subject:"Pour \xE9conomiser",period:"\xE0 froid, en euros",...r,why:o,over:!1})}
   <div class="pistes">${t.map(u=>this._piste(u))}${this._ups(e)}</div></ha-card>
   ${this._open?i`<div class="ov" @click=${u=>{u.target===u.currentTarget&&(this._open=void 0)}}
    @keydown=${u=>{u.key==="Escape"&&(this._open=void 0)}}><ha-card class="sheet" role="dialog" aria-modal="true">${this._detail(e,this._open,!0)}</ha-card></div>`:c}`}_ans(e){return i`<div class="ans-k"><span class="ico" style="--c:var(${e.c})">${E(e.ic)}</span><span class="nw-title">${e.subject}</span><span class="per">${e.period}</span>
    ${e.pill?i`<span class="pastille" style="--c:var(${e.pill[1]})">${e.pill[0]}</span>`:c}
    ${e.over?i`<button class="d-close" aria-label="Fermer" @click=${()=>{this._open=void 0}}>×</button>`:c}</div>
   <div class="ans">${e.val!=null?i`<p class="hero"><b>${e.val}${e.unit?i`<small>${e.unit}</small>`:c}</b>${e.cap?i`<span>${e.cap}</span>`:c}</p>`:e.msg?i`<p class="ans-m">${e.msg}</p>`:c}${e.why?i`<p class="ans-w">${e.why}</p>`:c}</div>`}_enc(e,t,n,r={}){return i`<div class="nw-panel${r.wide?" wide":""}"><div class="nw-panel-head"><h3><span>${e}</span></h3>${r.aside?i`<span class="aside">${r.aside}</span>`:c}</div>
   ${t?i`<p class="say">${t}</p>`:c}${n??c}${r.foot?i`<div class="foot">${r.foot}</div>`:c}</div>`}_until(e){let t=e.jusqu_ici;return t?`aujourd'hui, jusqu'\xE0 ${H(new Date(t.jusqu_a).getHours())}`:"aujourd'hui"}_detail(e,t,n){switch(t){case"soleil":return this._sun(e,n);case"chauffage":return this._heat(e,n);case"veille":return this._night(e,n);case"eau":return this._water(e,n);case"appareils":return this._devices(e,n);case"pointe":return this._peak(e,n);case"chauffe_eau":return this._heater(e,n);default:return this._contract(e,n)}}_sun(e,t){let n=e.jour,r=e.soleil_jour,o={ic:"sun",c:"--nw-sun",subject:"Soleil",period:this._until(e),over:t};if(!e.equipement.soleil||n?.soleil_kwh==null)return this._ans({...o,period:"aujourd'hui",msg:"Pas de panneaux dans la page \xC9nergie",why:"Ajoutez leur production dans la page \xC9nergie de Home Assistant : Hestia la lira."});if(n.soleil_kwh<.05)return this._ans({...o,msg:"Les panneaux n'ont encore rien produit",why:"Le soleil arrive : cette carte se remplit au fil des heures."});let u=n.revendu_kwh??0,l=Math.max(0,n.soleil_kwh-u),p=r?.plus_fort,g=(e.heures?.aujourdhui??[]).map(w=>w.soleil),d=e.panneaux,m=r?.groupes??[],h=d?.onduleur_muet_min?i`L'onduleur ne répond plus depuis <b>${d.onduleur_muet_min<120?`${d.onduleur_muet_min}\xA0min`:`${Math.round(d.onduleur_muet_min/60)} h`}</b>.`:d?.en_retrait?.length?i`<b>${d.en_retrait[0].nom}</b> produit ${d.en_retrait[0].pourcent_de_moins} % de moins que d'habitude : à regarder.`:i`Les <b>${m.length} groupes</b> ont produit comme d'habitude : aucun ne faiblit.`;return i`${this._ans({...o,val:k(n.soleil_kwh),unit:"kWh",cap:"produits par les panneaux",why:n.soleil_garde!=null?i`La maison en a gardé <b>${n.soleil_garde} %</b>.${u>=.05?i` Le reste, ${k(u)} kWh, est parti au réseau${n.revendu_euros!=null?i` pour <b>${$(n.revendu_euros)} €</b>`:""}.`:""}`:c})}
   <div class="encs">
    ${this._enc("Heure par heure",p?i`Le soleil a donné le plus entre <b>${H(p.h)} et ${H(p.h+1)} : ${k(p.kwh)} kWh</b>. C'est à ces heures-là qu'une machine tourne au soleil.`:c,i`${Re(g,"--nw-sun",{pin:w=>`${k(w)}\xA0kWh`})}${tn}`,{wide:!0})}
    ${this._enc("O\xF9 est parti le soleil",r?.prix_evite!=null&&e.contrat?.revente!=null?i`Le garder vaut mieux que le vendre : il évite <b>${q(r.prix_evite)} €</b> le kWh, la revente n'en paie que <b>${q(e.contrat.revente)} €</b>.`:i`La maison en a gardé <b>${k(l)} kWh</b>.`,i`<div><div class="split"><i style="width:${l/n.soleil_kwh*100}%;--c:var(--nw-benefit)"></i><i style="width:${u/n.soleil_kwh*100}%;--c:var(--nw-sun)"></i></div>
      <div class="split-l"><span>gardé <b>${k(l)} kWh</b></span><span>vendu <b>${k(u)} kWh${n.revendu_euros!=null?` \xB7 ${$(n.revendu_euros)}\xA0\u20AC`:""}</b></span></div></div>`)}
    ${m.length?this._enc("Chaque groupe de panneaux",h,oe(Fn(m.map(w=>({n:w.nom,v:w.kwh,txt:`${k(w.kwh)}\xA0kWh`})),w=>`${k(w)}\xA0kWh`),"--nw-sun")):c}
   </div>`}_heat(e,t){let n=e.chauffage,r=n?.poele,o=r?.saison,u=n?.etat==="pret"?n.saison:null,l=this._heatSum(e),p={ic:"flame",c:"--nw-heat",subject:"Chauffage",period:"depuis le 1er octobre",over:t},g={sans_meteo:"Pour estimer les radiateurs, Hestia a besoin du froid de chaque jour : ajoutez Hestia M\xE9t\xE9o.",meteo_ancienne:"Pour estimer les radiateurs, Hestia a besoin du froid de chaque jour : mettez Hestia M\xE9t\xE9o \xE0 jour.",meteo_incompatible:"Hestia M\xE9t\xE9o n'a pas la m\xEAme version qu'\xC9nergie : mettez les deux \xE0 jour ensemble.",meteo_sans_lieu:"Pour estimer les radiateurs, ajoutez votre maison dans Hestia M\xE9t\xE9o.",meteo_sans_donnees:"Hestia M\xE9t\xE9o ne donne pas le froid des jours pass\xE9s : choisissez un capteur de temp\xE9rature dans ses r\xE9glages.",apprend:"Il faut quelques semaines de froid pour estimer les radiateurs. Revenez cet hiver.",peu_lie:"Votre \xE9lectricit\xE9 varie peu avec le froid : vous chauffez sans doute surtout avec une autre \xE9nergie."},d="Radiateurs : estim\xE9s en comparant chaque jour votre \xE9lectricit\xE9 au froid qu'il a fait.",m="",h="",w="",v;if(l?.both)m=l.val,h="\u20AC",w="pour se chauffer",v=i`Le poêle <b>${$(o.eur)} €</b> de granulés, les radiateurs électriques <b>environ ${$(u.eur)} €</b>.`;else if(o)[m,h,w]=o.eur!=null?[$(o.eur),"\u20AC","de granul\xE9s pour le po\xEAle"]:[j(o.kg,0),"kg","de granul\xE9s br\xFBl\xE9s"],v=i`${o.eur!=null?i`<b>${j(o.kg,0)} kg</b> de granulés. `:""}${u?i`Les radiateurs, <b>environ ${u.eur!=null?`${$(u.eur)}\xA0\u20AC`:`${k(u.kwh)}\xA0kWh`}</b>.`:g[n?.etat??""]??""}`;else if(u)[m,h,w]=u.eur!=null?[$(u.eur),"\u20AC","de radiateurs, environ"]:[k(u.kwh),"kWh","de radiateurs, environ"],v=d;else return this._ans({...p,msg:n?.etat==="peu_lie"?"Une autre \xE9nergie chauffe la maison":"Le chauffage n'est pas encore estim\xE9",why:g[n?.etat??""]??"Ajoutez Hestia M\xE9t\xE9o, ou le suivi de votre po\xEAle."});let _=l?.both&&u?.eur!=null&&o?.eur!=null?o.eur/(o.eur+u.eur):null,x=_==null?c:this._enc("Qui chauffe",_>=.4&&_<=.6?i`Le poêle et les radiateurs font <b>chacun la moitié</b> de la dépense.`:i`${_>.6?"Le po\xEAle fait":"Les radiateurs font"} <b>${Math.round((_>.6?_:1-_)*100)} %</b> de la dépense.`,oe([{n:"Po\xEAle",v:o.eur,txt:`${$(o.eur)}\xA0\u20AC`,sub:`${j(o.kg,0)}\xA0kg`},{n:"Radiateurs",v:u.eur,txt:`${$(u.eur)}\xA0\u20AC`,sub:`${k(u.kwh)}\xA0kWh`}],"--nw-heat"),{foot:d}),b=n?.euros_par_degre,A=b!=null&&u?this._enc("Le froid fait la facture",i`Chaque degré de froid en plus coûte <b>environ ${le(b)} € par jour</b> de radiateurs.`,c,{foot:i`Exemple : un jour à 5 °C au lieu de 10 °C, <b>${$(b*5)} €</b> de plus.`}):c,y=r?.stock_kg,S=y!=null&&r?.sac_kg?Math.round(y/r.sac_kg*10)/10:null,T=y!=null&&o?this._enc("Granul\xE9s en stock",y<=0?i`<b>Plus de granulés</b> en stock.`:i`Il reste <b>${S!=null?`${j(S,1)} sac${S>1?"s":""} (${j(y,0)}\xA0kg)`:`${j(y,0)}\xA0kg`}</b>${r?.jours_restants!=null?i` : au rythme de cette saison, <b>environ ${r.jours_restants} jours</b> de poêle`:""}.`,i`<div><div class="track" style="--c:var(--nw-heat)"><i style="width:${o.kg+y>0?o.kg/(o.kg+y)*100:0}%"></i></div>
    <div class="track-l"><span>brûlés <b>${j(o.kg,0)} kg</b></span><span>en stock <b>${j(y,0)} kg</b></span></div></div>`):c;return i`${this._ans({...p,val:m,unit:h,cap:w,why:v})}<div class="encs">${x}${A}${T}</div>`}_night(e,t){let n=e.veille,r=e.veille_historique??[],o={ic:"moon",c:"--nw-watch",subject:"Veille",over:t};if(!n)return this._ans({...o,period:"les derni\xE8res nuits",msg:"La veille n'est pas encore connue",why:"Il faut deux semaines de nuits mesur\xE9es heure par heure."});let u=n.nuit,l=n.evolution,p=(u?.appareils??[]).map(h=>({n:h.nom,v:h.w,txt:`${h.w}\xA0W`,sub:h.euros_par_an!=null?`${ve(h.euros_par_an)}\xA0\u20AC par an`:void 0}));u?.sans_prise_w&&p.push({n:"Sans prise mesur\xE9e",v:u.sans_prise_w,txt:`${u.sans_prise_w}\xA0W`,sub:u.sans_prise_euros_par_an!=null?`${ve(u.sans_prise_euros_par_an)}\xA0\u20AC par an`:void 0,dash:!0}),p.sort((h,w)=>w.v-h.v);let g=u&&p.length?this._enc("Ce qui tourne la nuit",u.sans_prise_w?i`Les prises mesurées expliquent <b>${u.mesure_w} W</b>. Les <b>${u.sans_prise_w} W</b> qui restent viennent d'appareils sans prise mesurée : c'est là qu'il faut chercher.`:i`Les prises mesurées expliquent toute la veille : <b>${u.mesure_w} W</b>.`,oe(Fn(p,h=>`${Math.round(h)}\xA0W`),"--nw-watch"),{wide:!0,aside:"au plus calme de la nuit"}):c,d=l?nn(l.debut):"",m=r.length>1?this._enc("Nuit apr\xE8s nuit",l&&Math.abs(l.ecart_w)>=10?i`Elle est passée de <b>${l.debut_w} W à ${n.w} W</b> depuis le ${d}${l.ecart_euros_par_an!=null?i` : <b>environ ${ve(Math.abs(l.ecart_euros_par_an))} € par an</b> de ${l.ecart_w<0?"moins":"plus"}`:""}.`:i`Elle reste autour de <b>${n.w} W</b> depuis le ${d}.`,i`${Re(r.map(h=>h.w),"--nw-watch",{pin:h=>`${h}\xA0W`,max:Math.max(...r.map(h=>h.w))*1.09})}<div class="ticks"><span>${Kn(r[0].jour)} ${kt[He(r[0].jour).getMonth()]}</span><span>cette nuit</span></div>`,{wide:!0}):c;return i`${this._ans({...o,period:`les ${r.length>1?r.length:n.nuits} derni\xE8res nuits`,val:String(n.w),unit:"W",cap:"quand tout dort",why:n.euros_par_an!=null?i`La maison les tire jour et nuit, même sans rien allumer : <b>environ ${ve(n.euros_par_an)} € par an</b>.`:"Ce fond tourne jour et nuit, m\xEAme sans rien allumer."})}
   <div class="encs">${g}${m}</div>`}_water(e,t){let n=e.eau,r=new Date,o=e.direct?.fuite?.minutes,u={ic:"drop",c:"--nw-water",subject:"Eau",over:t};if(!n)return this._ans({...u,period:"ce mois-ci",msg:"Pas de compteur d'eau",why:"Ajoutez-le dans la page \xC9nergie de Home Assistant : Hestia le lira."});let l=n.jours??[],p=Pe[r.getMonth()],g=o?[`L'eau coule depuis ${Math.round(o)}\xA0min`,o>=60?"--nw-alert":"--nw-act"]:["Pas de fuite","--nw-benefit"],d=n.plus_gros,m=l.map((h,w)=>w===l.length-1?"auj.":l.length<=12||[0,7,14,21,28].includes(w)?String(He(h.jour).getDate()):"");return i`${this._ans({...u,period:`${p}, du 1er au ${r.getDate()}`,pill:g,val:j(n.mois_l,0),unit:"litres",cap:n.mois_euros!=null?i`soit <b>${en(n.mois_euros)} €</b>`:c,why:i`${n.l_par_jour!=null?i`Environ <b>${j(n.l_par_jour,0)} litres par jour</b>. `:""}${n.prix_m3!=null?i`L'eau coûte ${q(n.prix_m3)} € le m³, soit <b>${q(n.euros_100_l)} € les 100 litres</b>.`:""}`})}
   ${l.length?i`<div class="encs">${this._enc("Jour par jour",d?i`Le plus gros jour : <b>le ${nn(d.jour)}, ${j(d.l,0)} litres</b>${d.euros!=null?`, soit ${$(d.euros)}\xA0\u20AC`:""}. Un jour qui sort du lot se voit tout de suite.`:c,i`${Re(l.map(h=>h.l),"--nw-water",{pin:h=>`${j(h,0)}\xA0L`,part:l.length-1})}<div class="ticks days">${m.map(h=>i`<span>${h}</span>`)}</div>`,{wide:!0})}</div>`:c}`}_devices(e,t){let n=e.appareils_jour,r=e.direct?.en_marche??[],o={ic:"plug",c:"--nw-home",subject:"Appareils",period:this._until(e),over:t};if(!n||!n.appareils.length)return this._ans({...o,msg:"Aucun appareil mesur\xE9",why:"Ajoutez vos prises mesur\xE9es dans la page \xC9nergie de Home Assistant (consommation individuelle)."});let u=new Map(r.map(v=>[v.nom,v.w])),l=n.appareils[0],p=n.appareils.map(v=>({n:v.nom,v:v.kwh,txt:`${k(v.kwh)}\xA0kWh`,sub:v.euros!=null?`${$(v.euros)}\xA0\u20AC`:void 0,live:u.has(v.nom)?`${P(u.get(v.nom))}\xA0kW`:void 0}));for(let v of r)p.some(_=>_.n===v.nom)||p.push({n:v.nom,v:0,txt:"0 kWh",live:`${P(v.w)}\xA0kW`});let g=p.filter((v,_)=>_<5||v.live),d=p.filter(v=>!g.includes(v)),m=d.reduce((v,_)=>v+_.v,0),h=d.length>1?"s":"",w=d.length||n.sans_prise_kwh?i`${d.length?i`Et ${d.length} autre${h} appareil${h} mesuré${h} : <b>${k(m)} kWh</b>. `:""}${n.sans_prise_kwh?i`Les ${k(n.sans_prise_kwh)} kWh restants viennent d'appareils sans prise mesurée.`:""}`:c;return i`${this._ans({...o,val:k(l.kwh),unit:"kWh",cap:i`<b>${l.nom}</b>, le plus gros`,why:i`Les appareils mesurés font <b>${k(n.mesure_kwh)} kWh</b> sur les ${k(n.maison_kwh)} kWh de la maison.`})}
   <div class="encs">${this._enc("Appareil par appareil",l.euros!=null?i`Ce que chacun a coûté depuis minuit, soleil déduit : ${l.nom} <b>${$(l.euros)} €</b>.`:"Ce que chacun a consomm\xE9 depuis minuit.",oe(g,"--nw-home"),{wide:!0,aside:r.length?i`<span class="live">en marche</span>`:c,foot:w})}</div>`}_peak(e,t){let n=e.pointe,r=e.contrat?.kva,o=(e.heures?.aujourdhui??[]).map(m=>m.achat),u={ic:"bolt",c:"--nw-grid",subject:"Pointe",period:"aujourd'hui",over:t};if(!n)return this._ans({...u,msg:"Pas encore d'heure mesur\xE9e aujourd'hui",why:"La pointe se lit heure par heure : il faut le compteur heure par heure."});let l=n.part!=null&&n.part>=.7,p=ae(e.heures_creuses),g=m=>p.some(([h,w])=>m*60+30>=h&&m*60+30<w),d=n.part==null?"":n.part<.5?"vous en \xEAtes loin":n.part<.8?"il reste de la marge":"vous en \xEAtes tout pr\xE8s";return i`${this._ans({...u,pill:r?l?["Pr\xE8s de la limite","--nw-act"]:["De la marge","--nw-benefit"]:void 0,val:P(n.kw*1e3),unit:"kW",cap:`pris au r\xE9seau entre ${H(n.h)} et ${H(n.h+1)}`,why:i`${r?i` Le compteur coupe au-delà de <b>${r} kVA</b> (environ ${r} kW) : ${d}.`:"L'heure la plus charg\xE9e de la journ\xE9e."}`})}
   <div class="encs">${this._enc("Heure par heure",n.part!=null?i`La barre la plus haute reste à <b>${In(n.part)} de la limite</b> : ${l?"deux gros appareils de plus pourraient faire couper le compteur":"rien ne risque de faire couper le compteur"}.`:c,i`${Re(o,"--nw-grid",{pin:m=>`${P(m*1e3)}\xA0kW`,bands:p.length?g:void 0,tall:!0,...r?{max:r*1.07,limit:r,limitLabel:`limite ${r}\xA0kVA`}:{}})}${tn}
     <div class="nw-legend"><span><i style="--c:var(--nw-grid)"></i>pris au réseau, en moyenne sur l'heure</span>${p.length?i`<span><i style="--c:color-mix(in oklab, var(--nw-cold) 40%, transparent)"></i>heures creuses</span>`:c}</div>`,{wide:!0})}</div>`}_heater(e,t){let n=e.chauffe_eau,r={ic:"heater",c:"--nw-water",subject:"Chauffe-eau",period:"les prochaines heures",over:t};if(!n)return this._ans({...r,msg:"Pas de chauffe-eau dans la page \xC9nergie",why:"Ajoutez sa prise mesur\xE9e dans la page \xC9nergie de Home Assistant (consommation individuelle) : Hestia pr\xE9parera son plan de chauffe."});let o=n.simulation?["Simulation : rien n\u2019est command\xE9","--nw-watch"]:n.chauffer?["Chauffe","--nw-act"]:n.raison==="plein"?["Plein","--nw-benefit"]:["En attente","--nw-cold"],u=n.plan.slice(0,5),l=n.soleil_prevu==="prevision"?"la pr\xE9vision solaire de la page \xC9nergie":n.soleil_prevu==="nuages"?"les nuages pr\xE9vus par Hestia M\xE9t\xE9o":n.soleil_prevu==="habitude"?"la production habituelle des panneaux":null,p=this._enc("Le plan",l?i`Refait toutes les 5 minutes, avec ${l} et vos prix.`:"Refait toutes les 5 minutes, avec vos prix.",Ct(n),{wide:!0,foot:n.kwh_prevus!=null?i`Prévu : <b>${k(n.kwh_prevus)} kWh</b>${n.cout_prevu!=null?i`, <b>${$(n.cout_prevu)} €</b>`:""} d'ici demain soir.`:c}),g=u.length?this._enc("Les prochaines chauffes",c,i`<div class="hb list">${u.map(b=>i`<span class="n"><i class="dot" style="--c:var(${Jn[b.source]??"--nw-home"})"></i>${K(new Date(b.debut))} – ${K(new Date(b.fin))}<small>${Mt[b.source]??""}</small></span>
    <span class="v">${k(b.kwh)} kWh<small>${$(b.euros)} €</small></span>`)}</div>`):c,d=n.bilan.filter(b=>b.reel_kwh>=.05||b.hestia_kwh>=.05),m=d.reduce((b,A)=>b+A.reel_eur,0),h=d.reduce((b,A)=>b+A.hestia_eur,0),w=d.reduce((b,A)=>b+A.hc_eur,0),v=d.length?this._enc(`Les ${d.length} dernier${d.length>1?"s":""} jour${d.length>1?"s":""}`,n.simulation?i`Votre chauffe-eau a coûté <b>${$(m)} €</b>. En suivant le plan, il aurait coûté <b>${$(h)} €</b>.`:i`Avec le plan, <b>${$(h)} €</b>. En heures creuses simples, la même eau aurait coûté <b>${$(w)} €</b>.`,oe(d.map(b=>({n:nn(b.jour),v:n.simulation?Math.max(b.reel_eur,b.hestia_eur):b.hestia_eur,txt:`${$(b.hestia_eur)} \u20AC`,sub:n.simulation?`r\xE9el ${$(b.reel_eur)} \u20AC`:`${k(b.hestia_kwh)} kWh`})),"--nw-water"),{foot:n.simulation?"Le plan est calcul\xE9 sur la m\xEAme maison, minute par minute : rien n\u2019a \xE9t\xE9 command\xE9.":c}):c,_=[];n.manque.includes("litres")&&_.push("le volume du ballon, pour une r\xE9serve juste"),n.manque.includes("prise")&&_.push("la prise qui le commande"),n.manque.includes("besoin")&&_.push("quelques jours encore, pour apprendre combien d\u2019eau chaude la maison tire");let x=this._enc("R\xE9glages",i`Mode <b>${St[n.mode]??n.mode}</b>${n.simulation?" : Hestia montre ce qu\u2019il ferait, votre automatisation ne fait rien.":"."}
    ${n.suit===!1?i` <b>La prise ne suit pas le plan</b> : vérifiez l’automatisation.`:c}${_.length?i` Il manque ${_.join(", ")}.`:c}`,c,{foot:i`<a class="to-hub" href="/hestia/energie/chauffe-eau" @click=${On}>Régler le chauffe-eau ›</a>`});return i`${this._ans({...r,pill:o,val:n.reserve!=null?String(n.reserve):"\u2014",unit:"%",cap:`d'eau chaude en r\xE9serve${n.reserve_kwh!=null?`, ${k(n.reserve_kwh)} kWh sur ${k(n.capacite_kwh)}`:""}`,why:n.phrase})}
   <div class="encs">${p}${g}${v}${x}</div>`}_contract(e,t){let n=e.contrat,r=new Date,o={ic:"doc",c:"--nw-benefit",subject:"Contrat",period:"ce mois-ci",over:t},u=ae(e.heures_creuses),l=qe(u),p=n?.a_confirmer??[],g=i`${n?.kva?`Puissance : ${n.kva}\xA0kVA${p.includes("kva")?" (suppos\xE9e)":""}.`:""}${p.length?i` <a class="to-hub" href="/hestia/energie/reglages" @click=${On}>${p.includes("option")?p.length>1?"Option et puissance":"Option":"Puissance"} à confirmer dans les Réglages ›</a>`:c}`,d=[...n?.option==="hphc"?[["Heures pleines",n.prix_hp,"le kWh"],["Heures creuses",n.prix_hc,"le kWh"]]:n?.option==="base"?[["Le kWh",n.prix_base,"\xE0 toute heure"]]:[],[`Abonnement${n?.kva?` ${n.kva}\xA0kVA`:""}`,n?.abonnement_mois,"par mois"],["Revente du soleil",n?.revente,"le kWh"]],m=this._enc("Vos prix",n?.abonnement_mois!=null?i`L'abonnement, <b>${$(n.abonnement_mois)} € par mois</b>, se paie même sans rien consommer.`:c,i`<div class="hb list">${d.filter(z=>z[1]!=null).map(([z,W,ee])=>i`<span class="n">${z}</span><span class="v">${ee==="par mois"?$(W):q(W)} €<small>${ee}</small></span>`)}</div>`);if(n?.option!=="hphc"){let z=n?.option==="base";return i`${this._ans({...o,...z&&n?.prix_base!=null?{val:q(n.prix_base),unit:"\u20AC",cap:`le kWh \xE0 toute heure, option Base${p.includes("option")?" (suppos\xE9e)":""}`}:{msg:`Option ${n?.option==="tempo"?"Tempo":"Base"}`},why:g})}
    <div class="encs">${m}</div>`}let h=e.heures_creuses?.length?e.heures_creuses.map(([z,W])=>`${Z(z)} \xE0 ${Z(W)}`).join(" et de "):null,w=r.getHours()*60+r.getMinutes(),v=n.prix_hp&&n.prix_hc?1-n.prix_hc/n.prix_hp:null,_=n.part_hc,x=n.seuil_hc,b=e.mois?.euros,A=n.base_euros!=null&&b!=null?n.base_euros-b:null,y=e.usage,S=y&&y.seuil_hc!=null?this._enc("Les heures creuses rapportent-elles ?",i`Sur 12 mois, <b>${Math.round(y.part_hc*100)} %</b> de vos achats sont tombés ${l?"la nuit":"en heures creuses"}${_!=null?` (ce mois-ci ${Math.round(_*100)} %)`:""}. Elles rapportent à partir de <b>${Math.round(y.seuil_hc*100)} %</b>${y.base_de_plus!=null?i` : en Base, vous auriez payé <b>${$(Math.abs(y.base_de_plus))} € de ${y.base_de_plus>=0?"plus":"moins"}</b>`:""}.`,i`<div><div class="track" style="--c:var(--nw-cold)"><i style="width:${y.part_hc*100}%"></i><span class="mark" style="left:${Math.min(100,y.seuil_hc*100)}%"></span></div>
    <div class="track-l"><span>vous <b>${Math.round(y.part_hc*100)} %</b></span><span>rentable dès <b>${Math.round(y.seuil_hc*100)} %</b></span></div></div>`):_!=null&&x!=null?this._enc("Les heures creuses rapportent-elles ?",i`Ce mois-ci, <b>${Math.round(_*100)} %</b> de vos achats sont tombés ${l?"la nuit":"en heures creuses"}. Elles rapportent à partir de <b>${Math.round(x*100)} %</b>${A!=null?i` : sans elles (option Base), vous auriez payé <b>${$(Math.abs(A))} € de ${A<0?"moins":"plus"}</b>`:""}.`,i`<div><div class="track" style="--c:var(--nw-cold)"><i style="width:${_*100}%"></i><span class="mark" style="left:${Math.min(100,x*100)}%"></span></div>
    <div class="track-l"><span>vous <b>${Math.round(_*100)} %</b></span><span>rentable dès <b>${Math.round(x*100)} %</b></span></div></div>`):c,T=e.heures_creuses?.[0];return i`${this._ans({...o,...T?{val:`${Z(T[0])} \u2013 ${Z(T[1])}`,cap:e.heures_creuses.length>1?`heures creuses, et de ${e.heures_creuses.slice(1).map(([z,W])=>`${Z(z)} \xE0 ${Z(W)}`).join(", ")}`:"les heures creuses"}:{msg:"Heures pleines et heures creuses"},why:i`${n.prix_hc!=null&&n.prix_hp!=null?i`${l?"La nuit":"En heures creuses"}, le kWh coûte <b>${q(n.prix_hc)} €</b> au lieu de <b>${q(n.prix_hp)} €</b>${l?" le jour":""}. `:""}${g}`})}
   <div class="encs">
    ${u.length?this._enc("Votre journ\xE9e",v!=null?i`En bleu, les heures creuses : tout ce qui peut attendre y coûte <b>${In(v)} de moins</b>.`:"En bleu, les heures creuses.",i`<div><div class="day">${u.map(([z,W])=>i`<i style="left:${z/14.4}%;width:${(W-z)/14.4}%"></i>`)}<span class="now" style="left:${w/14.4}%"></span></div>${tn}</div>`,{wide:!0,aside:`il est ${K(r)}`}):c}
    ${m}${S}${this._machines(e)}
   </div>`}},At={soleil:"Il chauffe au soleil.",soleil_partiel:"Il chauffe, en partie au soleil.",heures_creuses:"Il chauffe en heures creuses.",heures_pleines:"Il chauffe en heures pleines.",eau_chaude_d_abord:"Il chauffe : l\u2019eau chaude d\u2019abord.",hygiene:"Chauffe compl\xE8te de la semaine.",boost:"Chauffe demand\xE9e."},Jn={soleil:"--nw-sun",soleil_partiel:"--nw-act",heures_creuses:"--nw-cold",heures_pleines:"--nw-peak",base:"--nw-home"},Mt={soleil:"au soleil",soleil_partiel:"en partie au soleil",heures_creuses:"en heures creuses",heures_pleines:"en heures pleines",base:"au prix de base"},St={simulation:"Simulation",automatique:"Automatique",heures_creuses:"Heures creuses seules",vacances:"Vacances"};function Ct(a){let s=a.courbe;if(s.length<2)return c;let e=640,t=30,n=8,r=14,o=130,u=r+o+8,l=x=>t+(e-t-n)*x/s.length,p=x=>r+o-Math.max(0,Math.min(100,x))/100*o,g=Math.max(3,...s.map(x=>x[2])),d=x=>r+o-x/g*o*.8,m=`M${l(0)},${r+o}`;s.forEach((x,b)=>{m+=` L${l(b)+(l(1)-l(0))/2},${d(x[2])}`}),m+=` L${l(s.length)},${r+o} Z`;let h="";s.forEach((x,b)=>{h+=`${b?" L":"M"}${l(b)+(l(1)-l(0))/2},${p(x[1])}`});let w=[],v=[];s.forEach((x,b)=>{let A=new Date(x[0]),y=A.getHours()*60+A.getMinutes();y%360===0&&w.push(L`<text x=${l(b)} y=${u+22} text-anchor="middle" class="tk">${y===0?"minuit":H(A.getHours())}</text>`),a.heures.some(S=>S>=y&&S<y+30)&&v.push(L`<line x1=${l(b)} x2=${l(b)} y1=${r} y2=${r+o} class="hw"></line><text x=${l(b)+3} y=${r+9} class="hwl">eau chaude</text>`)});let _=s.some(x=>x[2]>.05);return i`<svg class="whc" viewBox="0 0 ${e} ${u+28}" role="img" aria-label="Le plan des prochaines heures : réserve d'eau chaude, soleil prévu et chauffes">
  ${[0,50,100].map(x=>L`<line x1=${t} x2=${e-n} y1=${p(x)} y2=${p(x)} class="gl"></line><text x=${t-5} y=${p(x)+3} text-anchor="end" class="tk">${x} %</text>`)}
  ${_?L`<path d=${m} class="sun"></path>`:c}
  ${v}
  <line x1=${t} x2=${e-n} y1=${p(a.reserve_min*100)} y2=${p(a.reserve_min*100)} class="min"></line>
  ${s.map((x,b)=>x[5]?L`<rect x=${l(b)+.5} y=${r+o-18} width=${l(1)-l(0)-1} height="18" rx="2" style="fill:var(${Jn[x[5]]??"--nw-home"})"></rect>`:c)}
  <path d=${h} class="res"></path>
  ${s.map((x,b)=>L`<rect x=${l(b)} y=${u} width=${l(1)-l(0)+.3} height="7" class="pb" style="fill:var(${x[4]?"--nw-cold":"--nw-peak"})"></rect>`)}
  ${w}<text x=${t} y=${r-4} class="tk">maintenant</text></svg>
  <div class="nw-legend"><span><i style="--c:var(--nw-water)"></i>réserve d'eau chaude</span>${_?i`<span><i style="--c:color-mix(in oklab, var(--nw-sun) 45%, transparent)"></i>soleil en trop prévu</span>`:c}
   <span><i style="--c:var(--nw-sun)"></i>chauffe au soleil</span><span><i style="--c:var(--nw-cold)"></i>en heures creuses</span><span><i style="--c:var(--nw-peak)"></i>en heures pleines</span></div>`}customElements.get("hestia-energy-card")||customElements.define("hestia-energy-card",rn);var Te=window;Te.customCards=Te.customCards??[];Te.customCards.some(a=>a.type==="hestia-energy-card")||Te.customCards.push({type:"hestia-energy-card",name:"Hestia \xC9nergie",description:"Le conseiller \xE9nergie de la maison : tuile, carte compl\xE8te, cartes de d\xE9tail.",preview:!0});})();

// Home Assistant frontend#53890: wait for the final custom element registry.
while (!customElements.get('home-assistant')) {
  await customElements.whenDefined('home-assistant');
}
"use strict";(()=>{var te=globalThis,ne=te.ShadowRoot&&(te.ShadyCSS===void 0||te.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,de=Symbol(),Pe=new WeakMap,B=class{constructor(n,e,s){if(this._$cssResult$=!0,s!==de)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(ne&&n===void 0){let s=e!==void 0&&e.length===1;s&&(n=Pe.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),s&&Pe.set(e,n))}return n}toString(){return this.cssText}},I=r=>new B(typeof r=="string"?r:r+"",void 0,de),he=(r,...n)=>{let e=r.length===1?r[0]:n.reduce((s,t,i)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(t)+r[i+1],r[0]);return new B(e,r,de)},He=(r,n)=>{if(ne)r.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let s=document.createElement("style"),t=te.litNonce;t!==void 0&&s.setAttribute("nonce",t),s.textContent=e.cssText,r.appendChild(s)}},me=ne?r=>r:r=>r instanceof CSSStyleSheet?(n=>{let e="";for(let s of n.cssRules)e+=s.cssText;return I(e)})(r):r;var{is:ct,defineProperty:dt,getOwnPropertyDescriptor:ht,getOwnPropertyNames:mt,getOwnPropertySymbols:gt,getPrototypeOf:ft}=Object,se=globalThis,Re=se.trustedTypes,wt=Re?Re.emptyScript:"",bt=se.reactiveElementPolyfillSupport,F=(r,n)=>r,ge={toAttribute(r,n){switch(n){case Boolean:r=r?wt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,n){let e=r;switch(n){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},We=(r,n)=>!ct(r,n),Te={attribute:!0,type:String,converter:ge,reflect:!1,useDefault:!1,hasChanged:We};Symbol.metadata??=Symbol("metadata"),se.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Te){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let s=Symbol(),t=this.getPropertyDescriptor(n,s,e);t!==void 0&&dt(this.prototype,n,t)}}static getPropertyDescriptor(n,e,s){let{get:t,set:i}=ht(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:t,set(a){let l=t?.call(this);i?.call(this,a),this.requestUpdate(n,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Te}static _$Ei(){if(this.hasOwnProperty(F("elementProperties")))return;let n=ft(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(F("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(F("properties"))){let e=this.properties,s=[...mt(e),...gt(e)];for(let t of s)this.createProperty(t,e[t])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[s,t]of e)this.elementProperties.set(s,t)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let t=this._$Eu(e,s);t!==void 0&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let s=new Set(n.flat(1/0).reverse());for(let t of s)e.unshift(me(t))}else n!==void 0&&e.push(me(n));return e}static _$Eu(n,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(n.set(s,this[s]),delete this[s]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return He(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,s){this._$AK(n,s)}_$ET(n,e){let s=this.constructor.elementProperties.get(n),t=this.constructor._$Eu(n,s);if(t!==void 0&&s.reflect===!0){let i=(s.converter?.toAttribute!==void 0?s.converter:ge).toAttribute(e,s.type);this._$Em=n,i==null?this.removeAttribute(t):this.setAttribute(t,i),this._$Em=null}}_$AK(n,e){let s=this.constructor,t=s._$Eh.get(n);if(t!==void 0&&this._$Em!==t){let i=s.getPropertyOptions(t),a=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:ge;this._$Em=t;let l=a.fromAttribute(e,i.type);this[t]=l??this._$Ej?.get(t)??l,this._$Em=null}}requestUpdate(n,e,s,t=!1,i){if(n!==void 0){let a=this.constructor;if(t===!1&&(i=this[n]),s??=a.getPropertyOptions(n),!((s.hasChanged??We)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,s))))return;this.C(n,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:s,reflect:t,wrapped:i},a){s&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),i!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||s||(e=void 0),this._$AL.set(n,e)),t===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[t,i]of this._$Ep)this[t]=i;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[t,i]of s){let{wrapped:a}=i,l=this[t];a!==!0||this._$AL.has(t)||l===void 0||this.C(t,void 0,i,l)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw n=!1,this._$EM(),s}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[F("elementProperties")]=new Map,S[F("finalized")]=new Map,bt?.({ReactiveElement:S}),(se.reactiveElementVersions??=[]).push("2.1.2");var $e=globalThis,Ue=r=>r,re=$e.trustedTypes,Ve=re?re.createPolicy("lit-html",{createHTML:r=>r}):void 0,Fe="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,Ke="?"+z,vt=`<${Ke}>`,H=document,G=()=>H.createComment(""),Y=r=>r===null||typeof r!="object"&&typeof r!="function",ke=Array.isArray,xt=r=>ke(r)||typeof r?.[Symbol.iterator]=="function",fe=`[ 	
\f\r]`,K=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,De=/-->/g,Oe=/>/g,q=RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ne=/'/g,Be=/"/g,Ge=/^(?:script|style|textarea|title)$/i,ye=r=>(n,...e)=>({_$litType$:r,strings:n,values:e}),o=ye(1),Vt=ye(2),Dt=ye(3),j=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Ie=new WeakMap,P=H.createTreeWalker(H,129);function Ye(r,n){if(!ke(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ve!==void 0?Ve.createHTML(n):n}var _t=(r,n)=>{let e=r.length-1,s=[],t,i=n===2?"<svg>":n===3?"<math>":"",a=K;for(let l=0;l<e;l++){let u=r[l],p,d,h=-1,g=0;for(;g<u.length&&(a.lastIndex=g,d=a.exec(u),d!==null);)g=a.lastIndex,a===K?d[1]==="!--"?a=De:d[1]!==void 0?a=Oe:d[2]!==void 0?(Ge.test(d[2])&&(t=RegExp("</"+d[2],"g")),a=q):d[3]!==void 0&&(a=q):a===q?d[0]===">"?(a=t??K,h=-1):d[1]===void 0?h=-2:(h=a.lastIndex-d[2].length,p=d[1],a=d[3]===void 0?q:d[3]==='"'?Be:Ne):a===Be||a===Ne?a=q:a===De||a===Oe?a=K:(a=q,t=void 0);let m=a===q&&r[l+1].startsWith("/>")?" ":"";i+=a===K?u+vt:h>=0?(s.push(p),u.slice(0,h)+Fe+u.slice(h)+z+m):u+z+(h===-2?l:m)}return[Ye(r,i+(r[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),s]},X=class r{constructor({strings:n,_$litType$:e},s){let t;this.parts=[];let i=0,a=0,l=n.length-1,u=this.parts,[p,d]=_t(n,e);if(this.el=r.createElement(p,s),P.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(t=P.nextNode())!==null&&u.length<l;){if(t.nodeType===1){if(t.hasAttributes())for(let h of t.getAttributeNames())if(h.endsWith(Fe)){let g=d[a++],m=t.getAttribute(h).split(z),f=/([.?@])?(.*)/.exec(g);u.push({type:1,index:i,name:f[2],strings:m,ctor:f[1]==="."?be:f[1]==="?"?ve:f[1]==="@"?xe:V}),t.removeAttribute(h)}else h.startsWith(z)&&(u.push({type:6,index:i}),t.removeAttribute(h));if(Ge.test(t.tagName)){let h=t.textContent.split(z),g=h.length-1;if(g>0){t.textContent=re?re.emptyScript:"";for(let m=0;m<g;m++)t.append(h[m],G()),P.nextNode(),u.push({type:2,index:++i});t.append(h[g],G())}}}else if(t.nodeType===8)if(t.data===Ke)u.push({type:2,index:i});else{let h=-1;for(;(h=t.data.indexOf(z,h+1))!==-1;)u.push({type:7,index:i}),h+=z.length-1}i++}}static createElement(n,e){let s=H.createElement("template");return s.innerHTML=n,s}};function U(r,n,e=r,s){if(n===j)return n;let t=s!==void 0?e._$Co?.[s]:e._$Cl,i=Y(n)?void 0:n._$litDirective$;return t?.constructor!==i&&(t?._$AO?.(!1),i===void 0?t=void 0:(t=new i(r),t._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=t:e._$Cl=t),t!==void 0&&(n=U(r,t._$AS(r,n.values),t,s)),n}var we=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:s}=this._$AD,t=(n?.creationScope??H).importNode(e,!0);P.currentNode=t;let i=P.nextNode(),a=0,l=0,u=s[0];for(;u!==void 0;){if(a===u.index){let p;u.type===2?p=new J(i,i.nextSibling,this,n):u.type===1?p=new u.ctor(i,u.name,u.strings,this,n):u.type===6&&(p=new _e(i,this,n)),this._$AV.push(p),u=s[++l]}a!==u?.index&&(i=P.nextNode(),a++)}return P.currentNode=H,t}p(n){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(n,s,e),e+=s.strings.length-2):s._$AI(n[e])),e++}},J=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,s,t){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=s,this.options=t,this._$Cv=t?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=U(this,n,e),Y(n)?n===c||n==null||n===""?(this._$AH!==c&&this._$AR(),this._$AH=c):n!==this._$AH&&n!==j&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):xt(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==c&&Y(this._$AH)?this._$AA.nextSibling.data=n:this.T(H.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:s}=n,t=typeof s=="number"?this._$AC(n):(s.el===void 0&&(s.el=X.createElement(Ye(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===t)this._$AH.p(e);else{let i=new we(t,this),a=i.u(this.options);i.p(e),this.T(a),this._$AH=i}}_$AC(n){let e=Ie.get(n.strings);return e===void 0&&Ie.set(n.strings,e=new X(n)),e}k(n){ke(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,t=0;for(let i of n)t===e.length?e.push(s=new r(this.O(G()),this.O(G()),this,this.options)):s=e[t],s._$AI(i),t++;t<e.length&&(this._$AR(s&&s._$AB.nextSibling,t),e.length=t)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let s=Ue(n).nextSibling;Ue(n).remove(),n=s}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},V=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,s,t,i){this.type=1,this._$AH=c,this._$AN=void 0,this.element=n,this.name=e,this._$AM=t,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(n,e=this,s,t){let i=this.strings,a=!1;if(i===void 0)n=U(this,n,e,0),a=!Y(n)||n!==this._$AH&&n!==j,a&&(this._$AH=n);else{let l=n,u,p;for(n=i[0],u=0;u<i.length-1;u++)p=U(this,l[s+u],e,u),p===j&&(p=this._$AH[u]),a||=!Y(p)||p!==this._$AH[u],p===c?n=c:n!==c&&(n+=(p??"")+i[u+1]),this._$AH[u]=p}a&&!t&&this.j(n)}j(n){n===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},be=class extends V{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===c?void 0:n}},ve=class extends V{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==c)}},xe=class extends V{constructor(n,e,s,t,i){super(n,e,s,t,i),this.type=5}_$AI(n,e=this){if((n=U(this,n,e,0)??c)===j)return;let s=this._$AH,t=n===c&&s!==c||n.capture!==s.capture||n.once!==s.once||n.passive!==s.passive,i=n!==c&&(s===c||t);t&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},_e=class{constructor(n,e,s){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(n){U(this,n)}};var $t=$e.litHtmlPolyfillSupport;$t?.(X,J),($e.litHtmlVersions??=[]).push("3.3.3");var Xe=(r,n,e)=>{let s=e?.renderBefore??n,t=s._$litPart$;if(t===void 0){let i=e?.renderBefore??null;s._$litPart$=t=new J(n.insertBefore(G(),i),i,void 0,e??{})}return t._$AI(r),t};var Ae=globalThis,A=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Xe(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}};A._$litElement$=!0,A.finalized=!0,Ae.litElementHydrateSupport?.({LitElement:A});var kt=Ae.litElementPolyfillSupport;kt?.({LitElement:A});(Ae.litElementVersions??=[]).push("4.2.2");var Je={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Qe=r=>(...n)=>({_$litDirective$:r,values:n}),ie=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,s){this._$Ct=n,this._$AM=e,this._$Ci=s}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var Q=class extends ie{constructor(n){if(super(n),this.it=c,n.type!==Je.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(n){if(n===c||n==null)return this._t=void 0,this.it=n;if(n===j)return n;if(typeof n!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(n===this.it)return this._t;this.it=n;let e=[n];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};Q.directiveName="unsafeHTML",Q.resultType=1;var Ze=Qe(Q);var et=`/* CHARTE COMMUNE HESTIA \u2014 jetons et pi\xE8ces partag\xE9s par toutes les cartes Hestia.
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
`;var tt=`/* Hestia \xC9nergie : seulement ses exceptions. Toute la structure (carte, bandeau, panneaux, sections, \xE9tiquettes) vient de
   hestia-charte.css. Ici, d'apr\xE8s la maquette des cartes 2 (docs/maquette-cartes-2.html, valid\xE9e le 8 nov. 2026), a\xE9r\xE9e
   le 17 nov. comme les cartes Hestia Weather (maquette des cartes 4) : le chiffre en grand, les mots en petit, de l'espace.
   Couleurs de sens propres \xE0 l'\xE9nergie, prises dans la palette Aube : jamais d'autres. */
:host { --nw-sun:var(--nw-level1); --nw-grid:var(--nw-wind); --nw-home:var(--nw-heat); --nw-water:var(--nw-rain); display:block; }
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
.flow { display:grid; grid-template-columns:1fr auto 1fr auto 1fr; align-items:center; gap:4px; }
.flow.two { grid-template-columns:1fr auto 1fr; }
.flow .node { display:flex; flex-direction:column; align-items:center; gap:2px; text-align:center; }
.flow .dot { width:48px; height:48px; border-radius:50%; display:grid; place-items:center; background:color-mix(in oklab, var(--c) 30%, var(--nw-bg)); border:2px solid color-mix(in oklab, var(--c) 70%, transparent); }
.flow .dot svg { width:22px; height:22px; color:color-mix(in oklab, var(--c) 55%, var(--nw-fg)); }
.flow .nv { font-weight:650; font-variant-numeric:tabular-nums; } .flow .nl { font-size:var(--nw-fs-small); color:var(--nw-fg2); }
.flow .link { width:40px; height:4px; border-radius:2px; background:color-mix(in srgb, var(--nw-fg) 9%, transparent); position:relative; overflow:hidden; }
.flow .link i { position:absolute; top:0; width:12px; height:4px; border-radius:2px; background:var(--c); animation:run 1.4s linear infinite; }
.flow .link.rev i { animation-name:runr; } .flow .link.off i { display:none; }
@keyframes run { from { left:-12px; } to { left:40px; } } @keyframes runr { from { left:40px; } to { left:-12px; } }
.chips { display:flex; flex-wrap:wrap; gap:6px; align-items:center; }
.chips .nw-label { margin-right:2px; }
.chip { display:inline-flex; gap:6px; align-items:baseline; padding:3px 10px; border-radius:999px; background:var(--nw-surface); font-size:var(--nw-fs-small); white-space:nowrap; }
.chip b { font-weight:650; font-variant-numeric:tabular-nums; }
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
@media (prefers-reduced-motion:reduce) { .flow .link i, .live::before, .ov .sheet { animation:none !important; } }

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
.piste.up { background:none; border:1px dashed var(--nw-line); }
.piste.up .pt { font-weight:600; }
.piste.up .ico { background:color-mix(in srgb, var(--nw-fg) 6%, transparent); color:var(--nw-fg2); }
`;var Ct=[["complete","mdi:page-layout-body","Compl\xE8te","en ce moment, aujourd\u2019hui, ce mois-ci, puis le d\xE9tail"],["tuile","mdi:dock-window","Tuile","en ce moment : une phrase, un chiffre"],["conseils","mdi:piggy-bank-outline","Conseils","ce qui ferait \xE9conomiser, en euros par an"],["soleil","mdi:solar-power-variant","Soleil","ce que les panneaux ont produit aujourd\u2019hui"],["chauffage","mdi:fire","Chauffage","ce qu\u2019a co\xFBt\xE9 la saison, depuis le 1er octobre"],["veille","mdi:weather-night","Veille","ce qui tourne la nuit, les 30 derni\xE8res nuits"],["eau","mdi:water","Eau","les litres et les euros du mois"],["appareils","mdi:power-plug","Appareils","ce que chaque appareil a consomm\xE9 aujourd\u2019hui"],["pointe","mdi:transmission-tower","Pointe","la plus forte puissance prise aujourd\u2019hui"],["contrat","mdi:file-document-outline","Contrat","vos heures creuses et vos prix, ce mois-ci"]],St=r=>{r.preventDefault(),history.pushState(null,"",r.currentTarget.getAttribute("href")??"/hestia/energie"),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0}))},Ce=class extends A{static{this.properties={hass:{attribute:!1},config:{state:!0}}}static{this.styles=he`.note{color:var(--secondary-text-color);font-size:12px;line-height:1.6;margin:0 0 16px}a{color:var(--primary-color)}
  .formats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:4px 0 16px}
  .formats button{all:unset;box-sizing:border-box;display:flex;flex-direction:column;gap:4px;padding:10px 12px;border:1px solid var(--divider-color);border-radius:12px;cursor:pointer;color:var(--primary-text-color);font-size:12px;line-height:1.45}
  .formats button:hover{border-color:var(--secondary-text-color)}
  .formats button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}
  .formats button.on{border:2px solid var(--primary-color);padding:9px 11px}
  .formats ha-icon{--mdc-icon-size:20px;color:var(--secondary-text-color)}.formats button.on ha-icon{color:var(--primary-color)}
  .formats b{font-size:14px;font-weight:500}.formats span{color:var(--secondary-text-color)}`}setConfig(n){this.config={...n}}set(n){let e={...this.config,...n};e.name||delete e.name,e.card==="complete"&&delete e.card,this.config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this.config)return c;let n=this.config.card??"complete";return o`<p class="note">Choisissez ce que montre la carte. Le contrat, les réglages et les extensions se règlent dans
    <a href="/hestia/energie" @click=${St}>l’onglet Énergie</a>.</p>
   <div class="formats" role="radiogroup" aria-label="Format">${Ct.map(([e,s,t,i])=>o`<button type="button" role="radio" aria-checked=${e===n}
     class=${e===n?"on":""} @click=${()=>{e!==n&&this.set({card:e})}}><ha-icon icon=${s}></ha-icon><b>${t}</b><span>${i}</span></button>`)}</div>
   <ha-form .hass=${this.hass} .data=${{name:this.config.name??""}} .schema=${[{name:"name",selector:{text:{}}}]}
     .computeLabel=${()=>"Titre facultatif"} .computeHelper=${()=>"Vide : \xAB Maison \xBB."}
     @value-changed=${e=>{e.stopPropagation(),this.set({name:(e.detail.value.name??"").trim()})}}></ha-form>`}};customElements.get("hestia-energy-card-editor")||customElements.define("hestia-energy-card-editor",Ce);var D=new WeakMap;function nt(r,n){D.get(r)===n&&D.delete(r),clearTimeout(n.closing),n.stop?.then(e=>e()).catch(()=>{})}function st(r,n,e,s){let t=D.get(r),i={view:n,error:e,reload:s};if(t){clearTimeout(t.closing),t.closing=void 0;let l=t.last;l&&queueMicrotask(()=>{t.listeners.has(i)&&n(l)})}else{let l={listeners:new Set};t=l,D.set(r,l),l.stop=r.subscribeMessage(u=>{if(u.reload){nt(r,l);for(let d of[...l.listeners])d.reload();return}let p;if(u.changes){if(!l.last)return;p={...l.last,...u.changes};for(let d of u.removed??[])delete p[d]}else if(u.view)p=u.view;else return;l.last=p;for(let d of[...l.listeners])d.view(p)},{type:"hestia_energy/subscribe"}),l.stop.catch(u=>{D.get(r)===l&&D.delete(r);for(let p of[...l.listeners])p.error(u)})}let a=t;return a.listeners.add(i),()=>{!a.listeners.delete(i)||a.listeners.size||(clearTimeout(a.closing),a.closing=setTimeout(()=>{a.listeners.size||nt(r,a)},5e3))}}var Se=["soleil","chauffage","veille","eau","appareils","pointe","contrat"],jt={veille_haute:["moon","--nw-watch"],chauffage_degre:["flame","--nw-heat"],contrat_base:["doc","--nw-ok"],jour_inhabituel:["home","--nw-home"],budget_mois:["doc","--nw-home"]},rt={sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/></svg>',grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M8 21 11 3h2l3 18"/><path d="M5 7h14M6.5 12h11M9.5 16.5l5-4.5M14.5 16.5l-5-4.5"/></svg>',bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/></svg>',drop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3s6.5 7 6.5 11.2A6.5 6.5 0 0 1 5.5 14.2C5.5 10 12 3 12 3z"/></svg>',clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>',plug:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0z"/><path d="M12 17v4"/></svg>',doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14 3v5h5M9 12.5h7M9 16.5h7"/></svg>',flame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21.5a6.5 6.5 0 0 0 6.5-6.5c0-4.5-4-6.5-4.5-11-2.5 2-4 4.5-4 7-1-.5-2-1.8-2.2-3C6.5 9.8 5.5 12.3 5.5 15a6.5 6.5 0 0 0 6.5 6.5z"/></svg>',chev:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'},E=r=>Ze(rt[r]??rt.bolt),x=(r,n=1)=>{let e=r.toLocaleString("fr-FR",{maximumFractionDigits:n,minimumFractionDigits:0,useGrouping:!1}),[s,t]=e.split(",");return s.replace(/\B(?=(\d{3})+(?!\d))/g,"\u202F")+(t?","+t:"")},ce=r=>r.toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2}),$=r=>r==null?"\u2014":x(r/1e3,1),w=r=>r==null?"\u2014":Math.abs(r)<10?ce(r):x(r,0),je=r=>r==null?"\u2014":ce(r),Z=r=>r==null?"\u2014":x(Math.abs(r)>=100?Math.round(r/10)*10:Math.round(r),0),v=r=>r==null?"\u2014":x(r,Math.abs(r)<20?1:0),C=r=>r==null?"\u2014":ce(r),Et=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],it=r=>{if(!r)return"hier";let n=new Date(r+"T12:00"),e=new Date;e.setHours(12,0,0,0);let s=Math.round((e.getTime()-n.getTime())/864e5);return s===1?"hier":s===2?"avant-hier":Et[n.getDay()]},Mt=r=>r.charAt(0).toUpperCase()+r.slice(1),zt=r=>{r.preventDefault(),history.pushState(null,"",r.currentTarget.getAttribute("href")??"/hestia/energie"),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0}))},le=["janvier","f\xE9vrier","mars","avril","mai","juin","juillet","ao\xFBt","septembre","octobre","novembre","d\xE9cembre"],Lt=["janv.","f\xE9vr.","mars","avr.","mai","juin","juil.","ao\xFBt","sept.","oct.","nov.","d\xE9c."],qt={bleu:"ok",vert:"benefit",orange:"action",rouge:"urgent"},Pt={bleu:"--nw-ok",vert:"--nw-benefit",orange:"--nw-act",rouge:"--nw-alert"},Ht={fuite_eau:"drop",disjoncteur:"bolt",chauffe_eau_reseau:"drop",soleil_en_trop:"sun",soleil_machine_ok:"sun",soleil_chaleur:"sun",machines_ensemble:"plug",machine_sans_soleil:"sun",machine_heures_pleines:"clock",oublie:"plug",rien_hc:"clock",rien_hc_bientot:"clock",rien_soleil_juste:"sun",rien_soleil_petit:"sun",rien_soleil_plus_tard:"sun",rien:"home"},O=r=>r===12?"midi":r===0||r===24?"minuit":`${r}\xA0h`,R=r=>r.replace(/ /g,"\xA0"),ae=r=>r.getHours()+"\xA0h\xA0"+String(r.getMinutes()).padStart(2,"0"),ue=r=>new Date(r+"T12:00:00"),pt=r=>{let n=ue(r).getDate();return n===1?"1er":String(n)},at=r=>`${pt(r)} ${le[ue(r).getMonth()]}`,ot=r=>r<=.3?"un quart":r<=.4?"un tiers":r<=.58?"la moiti\xE9":r<=.7?"deux tiers":r<=.85?"trois quarts":"presque tout",ze=r=>{let n=r.match(/(\d+) h(?: (\d+))?/);return n?Number(n[1])*60+(n[2]?Number(n[2]):0):0};function Ee(r){return(r??[]).flatMap(([n,e])=>{let s=ze(n),t=ze(e);return t>s?[[s,t]]:[[s,1440],[0,t]]})}var lt=r=>r.length>0&&r.every(([n,e])=>n>=1200||e<=570);function ee(r,n){let e=Math.max(...r.map(s=>s.v),0)||1;return o`<div class="hb" style="--c:var(${n})">${r.map(s=>o`<span class="n${s.muted?" muted":""}"><span>${s.n}</span>${s.live?o`<span class="live">${s.live}</span>`:c}</span>
  <span class="t${s.dash?" dash":""}"><i class=${s.soft?"soft":""} style="width:${Math.max(1,s.v/e*100)}%"></i></span>
  <span class="v${s.muted?" muted":""}">${s.txt}${s.sub?o`<small>${s.sub}</small>`:c}</span>`)}</div>`}function ut(r,n){let e=r.filter((i,a)=>a<5||i.live),s=r.filter(i=>!e.includes(i));if(s.length<2)return r;let t=s.reduce((i,a)=>i+a.v,0);return[...e,{n:`Et ${s.length} autres`,v:t,txt:n(t),muted:!0,soft:!0}]}function oe(r,n,e={}){let s=Math.max(...r.map(l=>l??0),0),t=e.max??(s*1.15||1),i=s>0?r.indexOf(s):-1,a=r.length;return o`<div class="cols${e.tall?" tall":""}" style="--c:var(${n})">${r.map((l,u)=>{let p=l==null?2:Math.max(2,l/t*100);return o`<div class="c${e.bands?.(u)?" band":""}">${u===i&&e.pin?o`<span class="pin ${u<2?"l":u>a-3?"r":""}" style="bottom:${p}%">${e.pin(l)}</span>`:c}<i class="${l==null?"none":""}${e.part===u?" part":""}" style="height:${p}%"></i></div>`})}
  ${e.limit?o`<div class="limit" style="bottom:${e.limit/t*100}%"><span>${e.limitLabel}</span></div>`:c}</div>`}var Me=o`<div class="ticks"><span>0 h</span><span>6 h</span><span>12 h</span><span>18 h</span><span>24 h</span></div>`,Le=class extends A{constructor(){super();this._config={type:"custom:hestia-energy-card",card:"complete"};this._folded=new Set}static{this.styles=[I(et),I(tt)]}static{this.properties={_view:{state:!0},_open:{state:!0},_folded:{state:!0},_error:{state:!0}}}static getStubConfig(){return{card:"complete"}}static getConfigElement(){return document.createElement("hestia-energy-card-editor")}setConfig(e){let s=e.card??"complete";if(s!=="complete"&&s!=="tuile"&&s!=="conseils"&&!Se.includes(s))throw new Error(`card: ${s} ? (complete, tuile, conseils, ${Se.join(", ")})`);this._config={...e,card:s}}getCardSize(){return this._config.card==="tuile"?2:8}getGridOptions(){let e=this._config.card;return e==="complete"||e==="conseils"?{columns:"full",rows:"auto"}:{columns:12,rows:"auto",min_columns:6}}set hass(e){let s=this._hass?.connection!==e.connection;this._hass=e,(s||!this._stop)&&this._follow()}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._unfollow()}_unfollow(){this._stop?.(),this._stop=void 0,window.clearTimeout(this._again)}_follow(){this._unfollow(),!(!this._hass||!this.isConnected)&&(this._stop=st(this._hass.connection,e=>{this._view=e,this._error=void 0},e=>{this._stop=void 0,this._error=e.message??"Hestia \xC9nergie ne r\xE9pond pas.",this._again=window.setTimeout(()=>this._follow(),3e4)},()=>{this._stop=void 0,this._again=window.setTimeout(()=>this._follow(),2e3)}))}render(){let e=this._view;if(this._error&&!e)return o`<ha-card><div class="empty">${this._error}</div></ha-card>`;if(!e||!e.pret)return o`<ha-card><div class="empty">Hestia Énergie lit la page Énergie…</div></ha-card>`;let s=this._config.card;return s==="tuile"?this._tile(e):s==="conseils"?this._advice(e):s!=="complete"?o`<ha-card>${this._detail(e,s,!1)}</ha-card>`:o`${this._full(e)}${this._open?o`<div class="ov" @click=${t=>{t.target===t.currentTarget&&(this._open=void 0)}}
   @keydown=${t=>{t.key==="Escape"&&(this._open=void 0)}}><ha-card class="sheet" role="dialog" aria-modal="true">${this._detail(e,this._open,!0)}</ha-card></div>`:c}`}_name(){return this._config.name??"Maison"}_live(e){return!!(e.equipement.direct&&e.direct?.maison_w!=null)}_when(e){return e?.periode==="hc"?"en heures creuses":e?.periode==="hp"?"en heures pleines":""}_nowSay(e,s){let t=e.direct,i=t.maison_w??0,a=Math.min(t.soleil_w??0,i),l=t.achat_w??0,u=t.revente_w??0,p=this._when(t),d=t.prix!=null?o`<b>${w(l/1e3*t.prix)} € de l'heure</b>${p?`, ${p}`:""}`:null,h=s?o`La maison consomme <b>${$(i)} kW</b>. `:c;return e.equipement.soleil&&u>=30&&l<30?o`${h}Le soleil couvre tout, et <b>${$(u)} kW</b> partent au réseau.`:e.equipement.soleil&&a>=30?s?o`${h}Le soleil en couvre <b>${Math.round(a/i*100)} %</b>, le reste vient du réseau${d?o` : ${d}`:""}.`:o`Le soleil en donne <b>${$(a)} kW</b> ; le reste vient du réseau${d?o` : ${d}`:""}.`:d?o`${h}Tout vient du réseau : ${d}.`:h}_tile(e){let s=e.direct?.bandeau,t=s?Pt[s.couleur]??"--nw-ok":"--nw-ok",i=this._live(e),a=s?[s.pastille,t]:void 0,l={ic:"home",c:"--nw-home",subject:"\xC9nergie",pill:a,over:!1},u=(e.pistes??[]).find(h=>h.euros_an!=null);if(i)return o`<ha-card class="tile">${this._ans({...l,period:"en ce moment",val:$(e.direct.maison_w),unit:"kW",cap:"pour toute la maison",why:s?.couleur==="bleu"&&u?o`Rien à faire maintenant. ${this._saySave(u)}`:this._nowSay(e,!1)})}</ha-card>`;let p=e.dernier_jour,d=it(p?.jour);return p?o`<ha-card class="tile">${this._ans({...l,period:d,...p.euros!=null?{val:w(p.euros),unit:"\u20AC"}:{val:v(p.kwh_achetes),unit:"kWh"},cap:"pour toute la maison",why:u?this._saySave(u):p.euros!=null?o`<b>${v(p.kwh_achetes)} kWh</b> achetés au réseau${p.soleil_couvre!=null?o` ; le soleil a couvert <b>${p.soleil_couvre} %</b> de la maison`:""}.`:"Le prix sera connu avec le contrat."})}</ha-card>`:o`<ha-card class="tile">${this._ans({...l,period:"",msg:"Les premiers jours arrivent",why:"Enedis envoie chaque journ\xE9e le lendemain."})}</ha-card>`}_full(e){let s=e.direct?.bandeau,t=new Date,i=t.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})+" \xB7 "+ae(t),a=[this._nowSection(e),this._todaySection(e),this._monthSection(e)].filter(l=>l!==c);return o`<ha-card>
   <div class="head"><div style="min-width:0"><div class="nw-label">Énergie</div><div class="nw-title">${this._name()}</div></div><div class="when">${i}</div></div>
   ${s&&this._live(e)?o`<div class="nw-band nw-glass" data-level=${qt[s.couleur]??"ok"}><div class="nw-band-row"><span class="nw-band-pic box">${E(Ht[s.id]??"home")}</span>
    <div class="nw-band-text"><p class="nw-band-kicker">En ce moment</p><p class="nw-band-title">${s.titre}</p>${s.pourquoi||this._periodSay(e)?o`<p class="nw-band-line">${s.pourquoi||this._periodSay(e)}</p>`:c}</div></div></div>`:c}
   <div class="periods${a.length===2?" two":""}">${a}</div>
   ${e.pistes?.length?this._section("save","Pour \xE9conomiser","\xE0 froid, en euros",o`<div class="pistes">${e.pistes.slice(0,3).map(l=>this._piste(l))}</div>`):c}
   ${this._section("more","En d\xE9tail","touchez pour ouvrir",o`<div class="more">${this._goes(e)}</div>`)}
  </ha-card>`}_periodSay(e){let s=e.direct,t=s?.prochain_changement;if(!t||s?.periode!=="hp"&&s?.periode!=="hc")return"";let i=new Date(t.a),a=s.periode==="hp"?"Heures pleines":"Heures creuses",l=i.getHours()*60+i.getMinutes(),u=(e.heures_creuses??[]).find(([d])=>ze(d)===l),p=t.periode==="hc"&&u?`, puis heures creuses jusqu'\xE0 ${R(u[1])}`:"";return`${a} jusqu'\xE0 ${ae(i)}${p}.`}_section(e,s,t,i){let a=!this._folded.has(e);return o`<div class="sec"><button class="nw-fold-head" aria-expanded=${String(a)} @click=${()=>{let l=new Set(this._folded);a?l.add(e):l.delete(e),this._folded=l}}>
   <span class="nw-title">${s}</span><span class="nw-sum">${t}</span><span class="nw-chevron">${E("chev")}</span></button>${a?i:c}</div>`}_flow(e){let s=e.direct,t=(u,p,d,h)=>o`<div class="node" style="--c:var(${p})"><span class="dot">${E(u)}</span><span class="nv">${d}</span><span class="nl">${h}</span></div>`,i=(u,p)=>o`<span class="link ${p}" style="--c:var(${u})"><i></i></span>`,a=(s.achat_w??0)>=30,l=!a&&(s.revente_w??0)>=30;return e.equipement.soleil?o`<div class="flow">${t("sun","--nw-sun",`${$(s.soleil_w)}\xA0kW`,"Soleil")}${i("--nw-sun",(s.soleil_w??0)>=30?"":"off")}${t("home","--nw-home",`${$(s.maison_w)}\xA0kW`,"Maison")}${i("--nw-grid",a?"rev":l?"":"off")}${t("grid","--nw-grid",`${$(a?s.achat_w:l?s.revente_w:0)}\xA0kW`,l?"Revendu":"R\xE9seau")}</div>`:o`<div class="flow two">${t("home","--nw-home",`${$(s.maison_w)}\xA0kW`,"Maison")}${i("--nw-grid","rev")}${t("grid","--nw-grid",`${$(s.achat_w)}\xA0kW`,"R\xE9seau")}</div>`}_nowSection(e){let s=e.direct;if(!s)return c;if(!this._live(e)){if(s.prix==null||(e.contrat?.a_confirmer??[]).includes("option"))return c;let l=s.prochain_changement?` jusqu'\xE0 ${ae(new Date(s.prochain_changement.a))}`:"";return this._section("now","En ce moment",this._when(s),o`<div class="lines"><div class="line"><span class="ico" style="--c:var(--nw-grid)">${E("clock")}</span>
    <span>Le kWh coûte <b>${C(s.prix)} €</b>${this._when(s)?` ${this._when(s)}`:""}${l}.</span></div></div>`)}let t=s.chauffage,i=[...s.en_marche].sort((l,u)=>u.w-l.w),a=[...t?.poele?[o`<span class="chip">Poêle <b>allumé</b></span>`]:[],...(t?.pieces??[]).map(l=>o`<span class="chip">Chauffage ${l.nom}${l.w!=null?o` <b>${$(l.w)} kW</b>`:c}</span>`),...i.slice(0,5).map(l=>o`<span class="chip">${l.nom} <b>${$(l.w)} kW</b></span>`)];return this._section("now","En ce moment",`${$(s.maison_w)}\xA0kW pour toute la maison`,o`${this._flow(e)}
   <div class="lines"><div class="line"><span class="ico" style="--c:var(--nw-home)">${E("home")}</span><span>${this._nowSay(e,!0)}</span></div>
    ${a.length?o`<div class="chips"><span class="nw-label">En marche</span>${a}</div>`:c}</div>`)}_todaySection(e){let s=e.jusqu_ici;if(s){let i=new Date(s.jusqu_a).getHours(),a=s.euros!=null&&s.hier_euros!=null,l=a?s.euros:s.kwh,u=a?s.hier_euros:s.hier_kwh,p=l-u,d=a?Math.abs(p)<.1:Math.abs(p)<.5,h=a?"\u20AC":"kWh",g=m=>a?w(m):v(m);return this._section("today","Aujourd'hui","depuis minuit",o`<div class="big"><b>${g(l)} ${h}</b><span>${a?"d\xE9pens\xE9s":"consomm\xE9s"} depuis minuit</span></div>
    <p class="say">${d?o`Comme hier à la même heure.`:o`<b>${g(Math.abs(p))} ${h} de ${p>0?"plus":"moins"}</b> qu'hier à la même heure.`}</p>
    ${ee([{n:"Aujourd'hui",v:l,txt:`${g(l)} ${h}`},{n:`Hier \xE0 ${O(i)}`,v:u,txt:`${g(u)} ${h}`,muted:!0,soft:!0}],"--nw-home")}`)}let t=e.dernier_jour;return t?this._section("today",Mt(it(t.jour)),"toute la journ\xE9e",o`<div class="big"><b>${t.euros!=null?`${w(t.euros)}\xA0\u20AC`:`${v(t.kwh_achetes)}\xA0kWh`}</b><span>${t.euros!=null?"pour toute la journ\xE9e":"achet\xE9s au r\xE9seau"}</span></div>
   ${t.euros!=null?o`<p class="say"><b>${v(t.kwh_achetes)} kWh</b> achetés au réseau${t.soleil_couvre!=null?o` ; le soleil a couvert <b>${t.soleil_couvre} %</b> de la maison`:""}.</p>`:c}`):c}_monthSection(e){let s=e.mois;if(!s)return c;let t=new Date,i=s.euros??s.euros_energie,a=e.mois_an_dernier,l=e.projection,u=a?.euros!=null?` L'an dernier, ${le[t.getMonth()]} avait co\xFBt\xE9 ${w(a.euros)}\xA0\u20AC.`:"";return this._section("month","Ce mois-ci",`depuis le 1er ${le[t.getMonth()]}`,o`<div class="big"><b>${i!=null?`${je(i)}\xA0\u20AC`:`${v(s.kwh_achetes)}\xA0kWh`}</b><span>${i==null?"achet\xE9s au r\xE9seau":s.euros!=null?"abonnement compris":"sans l'abonnement"}</span></div>
   ${l!=null?o`<p class="say">Au même rythme, <b>environ ${w(l)} €</b> à la fin du mois.${u}</p>
    <div><div class="track" style="--c:var(--nw-ok)"><i style="width:${Math.min(100,(i??0)/l*100)}%"></i></div>
     <div class="track-l"><span>déjà <b>${w(i)} €</b></span><span>fin du mois <b>${w(l)} €</b></span></div></div>`:u?o`<p class="say">${u.trim()}</p>`:c}`)}_go(e,s,t,i,a,l,u){let[p,d]=i.split(" \xB7 ");return o`<button class="go" style="--c:var(${t})" @click=${()=>{this._open=e}}><span class="g-h"><span class="ico">${E(s)}</span><span class="g-t">${p}<small>${d}</small></span><span class="ar">›</span></span>
   <span class="g-v">${a}<small>${l}</small></span><span class="g-s">${u}</span></button>`}_goes(e){let s=[],t=e.jour;e.equipement.soleil&&t?.soleil_kwh!=null&&s.push(this._go("soleil","sun","--nw-sun","Soleil \xB7 aujourd'hui",v(t.soleil_kwh),"kWh produits",t.soleil_garde!=null?`La maison en a gard\xE9 ${t.soleil_garde}\xA0%.`:"Rien encore aujourd'hui."));let i=this._heatSum(e);i&&s.push(this._go("chauffage","flame","--nw-heat","Chauffage \xB7 depuis le 1er octobre",i.val,i.unit,i.say)),e.veille&&s.push(this._go("veille","moon","--nw-watch","Veille \xB7 chaque nuit",String(e.veille.w),"W quand tout dort",e.veille.euros_par_an!=null?`Environ ${Z(e.veille.euros_par_an)}\xA0\u20AC par an.`:"Ce que tire la maison quand tout dort."));let a=e.eau,l=e.direct?.fuite?.minutes;a&&s.push(this._go("eau","drop","--nw-water","Eau \xB7 ce mois-ci",a.mois_euros!=null?je(a.mois_euros):x(a.mois_l,0),a.mois_euros!=null?"\u20AC":"litres",`${a.mois_euros!=null?`${x(a.mois_l,0)}\xA0litres. `:""}${l?`L'eau coule depuis ${Math.round(l)}\xA0min.`:"Pas de fuite."}`));let u=e.appareils_jour?.appareils?.[0];u&&s.push(this._go("appareils","plug","--nw-home","Appareils \xB7 aujourd'hui",v(u.kwh),`kWh \xB7 ${u.nom}`,"Celui qui a le plus consomm\xE9."));let p=e.pointe;p&&s.push(this._go("pointe","bolt","--nw-grid","Pointe \xB7 aujourd'hui",$(p.kw*1e3),"kW au plus fort",e.contrat?.kva?`Sur ${e.contrat.kva}\xA0kVA : ${p.part!=null&&p.part>=.7?"pr\xE8s de la limite":"de la marge"}.`:"L'heure la plus charg\xE9e."));let d=e.contrat;return d?.option==="hphc"&&d.part_hc!=null?s.push(this._go("contrat","doc","--nw-ok","Contrat \xB7 ce mois-ci",String(Math.round(d.part_hc*100)),lt(Ee(e.heures_creuses))?"% la nuit":"% en heures creuses","de vos achats en heures creuses.")):d&&s.push(this._go("contrat","doc","--nw-ok","Contrat \xB7 ce mois-ci",d.option==="tempo"?"Tempo":d.option==="hphc"?"HP / HC":"Base",d.kva?` \xB7 ${d.kva}\xA0kVA`:"",d.option==="base"&&d.prix_base!=null?`${C(d.prix_base)}\xA0\u20AC le kWh \xE0 toute heure.`:"Vos prix et vos heures.")),s}_heatSum(e){let s=e.chauffage,t=s?.etat==="pret"?s.saison:null,i=s?.poele?.saison;return t?.eur!=null&&i?.eur!=null?{val:w(t.eur+i.eur),unit:"\u20AC",say:`Po\xEAle ${w(i.eur)}\xA0\u20AC, radiateurs ${w(t.eur)}\xA0\u20AC.`,both:!0}:i?{val:i.eur!=null?w(i.eur):x(i.kg,0),unit:i.eur!=null?"\u20AC":"kg",say:`Po\xEAle : ${x(i.kg,0)}\xA0kg de granul\xE9s.`,both:!1}:t?{val:t.eur!=null?w(t.eur):v(t.kwh),unit:t.eur!=null?"\u20AC":"kWh",say:"Radiateurs, estim\xE9s d'apr\xE8s le froid.",both:!1}:s?.etat==="peu_lie"?{val:"\u2014",unit:"",say:"Vous chauffez sans doute avec une autre \xE9nergie.",both:!1}:null}_saySave(e){return o`Pour économiser : ${e.titre.charAt(0).toLowerCase()+e.titre.slice(1)}, <b>${x(e.euros_an,0)} € ${e.unite??"par an"}</b>.`}_piste(e){let[s,t]=jt[e.id]??["home","--nw-home"],i=e.rubrique&&Se.includes(e.rubrique)?e.rubrique:void 0,a=o`<span class="ico" style="--c:var(${t})">${E(s)}</span><span class="pt">${e.titre}</span><span class="pw">${e.pourquoi}</span>
   ${e.euros_an!=null?o`<span class="pe"><b>${x(e.euros_an,0)} €</b><small>${e.unite??"par an"}</small></span>`:c}`;return i?o`<button class="piste" style="--c:var(${t})" @click=${()=>{this._open=i}}>${a}</button>`:o`<div class="piste" style="--c:var(${t})">${a}</div>`}_ups(e){let s=[];return(e.contrat?.a_confirmer??[]).includes("option")&&s.push(["doc","Un conseil sur votre contrat ?","Dites votre option et vos heures creuses dans les R\xE9glages : Hestia vous dira si elles rapportent."]),e.equipement.direct?e.equipement.appareils||s.push(["plug","Savoir ce qui consomme","Une prise mesur\xE9e sur le frigo ou le chauffe-eau : la veille appareil par appareil, l\u2019appareil oubli\xE9."]):s.push(["bolt","Les gestes au bon moment","Un module sur la prise du Linky : heures creuses, disjoncteur, le prix de l\u2019heure."]),s.map(([t,i,a])=>o`<div class="piste up"><span class="ico">${E(t)}</span><span class="pt">${i}</span><span class="pw">${a}</span></div>`)}_advice(e){let s=e.pistes??[],t=s.filter(l=>l.unite==="par an").reduce((l,u)=>l+(u.euros_an??0),0),i=t>0?{val:x(t,0),unit:"\u20AC",cap:"par an \xE0 gagner, au plus"}:s.length?{val:String(s.length),cap:`conseil${s.length>1?"s":""} pour vous`}:{msg:"Rien \xE0 changer pour l\u2019instant"},a=s.length?`${s.length>1?`${s.length} conseils tir\xE9s`:"Un conseil tir\xE9"} de vos 12 derniers mois, du plus rentable au moins rentable.`:"Hestia regarde chaque jour vos habitudes et votre contrat ; un conseil appara\xEEtra ici d\xE8s qu\u2019il vaut la peine.";return o`<ha-card>${this._ans({ic:"home",c:"--nw-home",subject:"Pour \xE9conomiser",period:"\xE0 froid, en euros",...i,why:a,over:!1})}
   <div class="pistes">${s.map(l=>this._piste(l))}${this._ups(e)}</div></ha-card>
   ${this._open?o`<div class="ov" @click=${l=>{l.target===l.currentTarget&&(this._open=void 0)}}
    @keydown=${l=>{l.key==="Escape"&&(this._open=void 0)}}><ha-card class="sheet" role="dialog" aria-modal="true">${this._detail(e,this._open,!0)}</ha-card></div>`:c}`}_ans(e){return o`<div class="ans-k"><span class="ico" style="--c:var(${e.c})">${E(e.ic)}</span><span class="nw-title">${e.subject}</span><span class="per">${e.period}</span>
    ${e.pill?o`<span class="pastille" style="--c:var(${e.pill[1]})">${e.pill[0]}</span>`:c}
    ${e.over?o`<button class="d-close" aria-label="Fermer" @click=${()=>{this._open=void 0}}>×</button>`:c}</div>
   <div class="ans">${e.val!=null?o`<p class="hero"><b>${e.val}${e.unit?o`<small>${e.unit}</small>`:c}</b>${e.cap?o`<span>${e.cap}</span>`:c}</p>`:e.msg?o`<p class="ans-m">${e.msg}</p>`:c}${e.why?o`<p class="ans-w">${e.why}</p>`:c}</div>`}_enc(e,s,t,i={}){return o`<div class="nw-panel${i.wide?" wide":""}"><div class="nw-panel-head"><h3><span>${e}</span></h3>${i.aside?o`<span class="aside">${i.aside}</span>`:c}</div>
   ${s?o`<p class="say">${s}</p>`:c}${t??c}${i.foot?o`<div class="foot">${i.foot}</div>`:c}</div>`}_until(e){let s=e.jusqu_ici;return s?`aujourd'hui, jusqu'\xE0 ${O(new Date(s.jusqu_a).getHours())}`:"aujourd'hui"}_detail(e,s,t){switch(s){case"soleil":return this._sun(e,t);case"chauffage":return this._heat(e,t);case"veille":return this._night(e,t);case"eau":return this._water(e,t);case"appareils":return this._devices(e,t);case"pointe":return this._peak(e,t);default:return this._contract(e,t)}}_sun(e,s){let t=e.jour,i=e.soleil_jour,a={ic:"sun",c:"--nw-sun",subject:"Soleil",period:this._until(e),over:s};if(!e.equipement.soleil||t?.soleil_kwh==null)return this._ans({...a,period:"aujourd'hui",msg:"Pas de panneaux dans la page \xC9nergie",why:"Ajoutez leur production dans la page \xC9nergie de Home Assistant : Hestia la lira."});if(t.soleil_kwh<.05)return this._ans({...a,msg:"Les panneaux n'ont encore rien produit",why:"Le soleil arrive : cette carte se remplit au fil des heures."});let l=t.revendu_kwh??0,u=Math.max(0,t.soleil_kwh-l),p=i?.plus_fort,d=(e.heures?.aujourdhui??[]).map(f=>f.soleil),h=e.panneaux,g=i?.groupes??[],m=h?.onduleur_muet_min?o`L'onduleur ne répond plus depuis <b>${h.onduleur_muet_min<120?`${h.onduleur_muet_min}\xA0min`:`${Math.round(h.onduleur_muet_min/60)} h`}</b>.`:h?.en_retrait?.length?o`<b>${h.en_retrait[0].nom}</b> produit ${h.en_retrait[0].pourcent_de_moins} % de moins que d'habitude : à regarder.`:o`Les <b>${g.length} groupes</b> ont produit comme d'habitude : aucun ne faiblit.`;return o`${this._ans({...a,val:v(t.soleil_kwh),unit:"kWh",cap:"produits par les panneaux",why:t.soleil_garde!=null?o`La maison en a gardé <b>${t.soleil_garde} %</b>.${l>=.05?o` Le reste, ${v(l)} kWh, est parti au réseau${t.revendu_euros!=null?o` pour <b>${w(t.revendu_euros)} €</b>`:""}.`:""}`:c})}
   <div class="encs">
    ${this._enc("Heure par heure",p?o`Le soleil a donné le plus entre <b>${O(p.h)} et ${O(p.h+1)} : ${v(p.kwh)} kWh</b>. C'est à ces heures-là qu'une machine tourne au soleil.`:c,o`${oe(d,"--nw-sun",{pin:f=>`${v(f)}\xA0kWh`})}${Me}`,{wide:!0})}
    ${this._enc("O\xF9 est parti le soleil",i?.prix_evite!=null&&e.contrat?.revente!=null?o`Le garder vaut mieux que le vendre : il évite <b>${C(i.prix_evite)} €</b> le kWh, la revente n'en paie que <b>${C(e.contrat.revente)} €</b>.`:o`La maison en a gardé <b>${v(u)} kWh</b>.`,o`<div><div class="split"><i style="width:${u/t.soleil_kwh*100}%;--c:var(--nw-benefit)"></i><i style="width:${l/t.soleil_kwh*100}%;--c:var(--nw-sun)"></i></div>
      <div class="split-l"><span>gardé <b>${v(u)} kWh</b></span><span>vendu <b>${v(l)} kWh${t.revendu_euros!=null?` \xB7 ${w(t.revendu_euros)}\xA0\u20AC`:""}</b></span></div></div>`)}
    ${g.length?this._enc("Chaque groupe de panneaux",m,ee(ut(g.map(f=>({n:f.nom,v:f.kwh,txt:`${v(f.kwh)}\xA0kWh`})),f=>`${v(f)}\xA0kWh`),"--nw-sun")):c}
   </div>`}_heat(e,s){let t=e.chauffage,i=t?.poele,a=i?.saison,l=t?.etat==="pret"?t.saison:null,u=this._heatSum(e),p={ic:"flame",c:"--nw-heat",subject:"Chauffage",period:"depuis le 1er octobre",over:s},d={sans_meteo:"Pour estimer les radiateurs, Hestia a besoin du froid de chaque jour : ajoutez Hestia M\xE9t\xE9o.",meteo_ancienne:"Pour estimer les radiateurs, Hestia a besoin du froid de chaque jour : mettez Hestia M\xE9t\xE9o \xE0 jour.",meteo_incompatible:"Hestia M\xE9t\xE9o n'a pas la m\xEAme version qu'\xC9nergie : mettez les deux \xE0 jour ensemble.",meteo_sans_lieu:"Pour estimer les radiateurs, ajoutez votre maison dans Hestia M\xE9t\xE9o.",meteo_sans_donnees:"Hestia M\xE9t\xE9o ne donne pas le froid des jours pass\xE9s : choisissez un capteur de temp\xE9rature dans ses r\xE9glages.",apprend:"Il faut quelques semaines de froid pour estimer les radiateurs. Revenez cet hiver.",peu_lie:"Votre \xE9lectricit\xE9 varie peu avec le froid : vous chauffez sans doute surtout avec une autre \xE9nergie."},h="Radiateurs : estim\xE9s en comparant chaque jour votre \xE9lectricit\xE9 au froid qu'il a fait.",g="",m="",f="",b;if(u?.both)g=u.val,m="\u20AC",f="pour se chauffer",b=o`Le poêle <b>${w(a.eur)} €</b> de granulés, les radiateurs électriques <b>environ ${w(l.eur)} €</b>.`;else if(a)[g,m,f]=a.eur!=null?[w(a.eur),"\u20AC","de granul\xE9s pour le po\xEAle"]:[x(a.kg,0),"kg","de granul\xE9s br\xFBl\xE9s"],b=o`${a.eur!=null?o`<b>${x(a.kg,0)} kg</b> de granulés. `:""}${l?o`Les radiateurs, <b>environ ${l.eur!=null?`${w(l.eur)}\xA0\u20AC`:`${v(l.kwh)}\xA0kWh`}</b>.`:d[t?.etat??""]??""}`;else if(l)[g,m,f]=l.eur!=null?[w(l.eur),"\u20AC","de radiateurs, environ"]:[v(l.kwh),"kWh","de radiateurs, environ"],b=h;else return this._ans({...p,msg:t?.etat==="peu_lie"?"Une autre \xE9nergie chauffe la maison":"Le chauffage n'est pas encore estim\xE9",why:d[t?.etat??""]??"Ajoutez Hestia M\xE9t\xE9o, ou le suivi de votre po\xEAle."});let _=u?.both&&l?.eur!=null&&a?.eur!=null?a.eur/(a.eur+l.eur):null,T=_==null?c:this._enc("Qui chauffe",_>=.4&&_<=.6?o`Le poêle et les radiateurs font <b>chacun la moitié</b> de la dépense.`:o`${_>.6?"Le po\xEAle fait":"Les radiateurs font"} <b>${Math.round((_>.6?_:1-_)*100)} %</b> de la dépense.`,ee([{n:"Po\xEAle",v:a.eur,txt:`${w(a.eur)}\xA0\u20AC`,sub:`${x(a.kg,0)}\xA0kg`},{n:"Radiateurs",v:l.eur,txt:`${w(l.eur)}\xA0\u20AC`,sub:`${v(l.kwh)}\xA0kWh`}],"--nw-heat"),{foot:h}),W=t?.euros_par_degre,N=W!=null&&l?this._enc("Le froid fait la facture",o`Chaque degré de froid en plus coûte <b>environ ${ce(W)} € par jour</b> de radiateurs.`,c,{foot:o`Exemple : un jour à 5 °C au lieu de 10 °C, <b>${w(W*5)} €</b> de plus.`}):c,y=i?.stock_kg,L=y!=null&&i?.sac_kg?Math.round(y/i.sac_kg*10)/10:null,k=y!=null&&a?this._enc("Granul\xE9s en stock",y<=0?o`<b>Plus de granulés</b> en stock.`:o`Il reste <b>${L!=null?`${x(L,1)} sac${L>1?"s":""} (${x(y,0)}\xA0kg)`:`${x(y,0)}\xA0kg`}</b>${i?.jours_restants!=null?o` : au rythme de cette saison, <b>environ ${i.jours_restants} jours</b> de poêle`:""}.`,o`<div><div class="track" style="--c:var(--nw-heat)"><i style="width:${a.kg+y>0?a.kg/(a.kg+y)*100:0}%"></i></div>
    <div class="track-l"><span>brûlés <b>${x(a.kg,0)} kg</b></span><span>en stock <b>${x(y,0)} kg</b></span></div></div>`):c;return o`${this._ans({...p,val:g,unit:m,cap:f,why:b})}<div class="encs">${T}${N}${k}</div>`}_night(e,s){let t=e.veille,i=e.veille_historique??[],a={ic:"moon",c:"--nw-watch",subject:"Veille",over:s};if(!t)return this._ans({...a,period:"les derni\xE8res nuits",msg:"La veille n'est pas encore connue",why:"Il faut deux semaines de nuits mesur\xE9es heure par heure."});let l=t.nuit,u=t.evolution,p=(l?.appareils??[]).map(m=>({n:m.nom,v:m.w,txt:`${m.w}\xA0W`,sub:m.euros_par_an!=null?`${Z(m.euros_par_an)}\xA0\u20AC par an`:void 0}));l?.sans_prise_w&&p.push({n:"Sans prise mesur\xE9e",v:l.sans_prise_w,txt:`${l.sans_prise_w}\xA0W`,sub:l.sans_prise_euros_par_an!=null?`${Z(l.sans_prise_euros_par_an)}\xA0\u20AC par an`:void 0,dash:!0}),p.sort((m,f)=>f.v-m.v);let d=l&&p.length?this._enc("Ce qui tourne la nuit",l.sans_prise_w?o`Les prises mesurées expliquent <b>${l.mesure_w} W</b>. Les <b>${l.sans_prise_w} W</b> qui restent viennent d'appareils sans prise mesurée : c'est là qu'il faut chercher.`:o`Les prises mesurées expliquent toute la veille : <b>${l.mesure_w} W</b>.`,ee(ut(p,m=>`${Math.round(m)}\xA0W`),"--nw-watch"),{wide:!0,aside:"au plus calme de la nuit"}):c,h=u?at(u.debut):"",g=i.length>1?this._enc("Nuit apr\xE8s nuit",u&&Math.abs(u.ecart_w)>=10?o`Elle est passée de <b>${u.debut_w} W à ${t.w} W</b> depuis le ${h}${u.ecart_euros_par_an!=null?o` : <b>environ ${Z(Math.abs(u.ecart_euros_par_an))} € par an</b> de ${u.ecart_w<0?"moins":"plus"}`:""}.`:o`Elle reste autour de <b>${t.w} W</b> depuis le ${h}.`,o`${oe(i.map(m=>m.w),"--nw-watch",{pin:m=>`${m}\xA0W`,max:Math.max(...i.map(m=>m.w))*1.09})}<div class="ticks"><span>${pt(i[0].jour)} ${Lt[ue(i[0].jour).getMonth()]}</span><span>cette nuit</span></div>`,{wide:!0}):c;return o`${this._ans({...a,period:`les ${i.length>1?i.length:t.nuits} derni\xE8res nuits`,val:String(t.w),unit:"W",cap:"quand tout dort",why:t.euros_par_an!=null?o`La maison les tire jour et nuit, même sans rien allumer : <b>environ ${Z(t.euros_par_an)} € par an</b>.`:"Ce fond tourne jour et nuit, m\xEAme sans rien allumer."})}
   <div class="encs">${d}${g}</div>`}_water(e,s){let t=e.eau,i=new Date,a=e.direct?.fuite?.minutes,l={ic:"drop",c:"--nw-water",subject:"Eau",over:s};if(!t)return this._ans({...l,period:"ce mois-ci",msg:"Pas de compteur d'eau",why:"Ajoutez-le dans la page \xC9nergie de Home Assistant : Hestia le lira."});let u=t.jours??[],p=le[i.getMonth()],d=a?[`L'eau coule depuis ${Math.round(a)}\xA0min`,a>=60?"--nw-alert":"--nw-act"]:["Pas de fuite","--nw-ok"],h=t.plus_gros,g=u.map((m,f)=>f===u.length-1?"auj.":u.length<=12||[0,7,14,21,28].includes(f)?String(ue(m.jour).getDate()):"");return o`${this._ans({...l,period:`${p}, du 1er au ${i.getDate()}`,pill:d,val:x(t.mois_l,0),unit:"litres",cap:t.mois_euros!=null?o`soit <b>${je(t.mois_euros)} €</b>`:c,why:o`${t.l_par_jour!=null?o`Environ <b>${x(t.l_par_jour,0)} litres par jour</b>. `:""}${t.prix_m3!=null?o`L'eau coûte ${C(t.prix_m3)} € le m³, soit <b>${C(t.euros_100_l)} € les 100 litres</b>.`:""}`})}
   ${u.length?o`<div class="encs">${this._enc("Jour par jour",h?o`Le plus gros jour : <b>le ${at(h.jour)}, ${x(h.l,0)} litres</b>${h.euros!=null?`, soit ${w(h.euros)}\xA0\u20AC`:""}. Un jour qui sort du lot se voit tout de suite.`:c,o`${oe(u.map(m=>m.l),"--nw-water",{pin:m=>`${x(m,0)}\xA0L`,part:u.length-1})}<div class="ticks days">${g.map(m=>o`<span>${m}</span>`)}</div>`,{wide:!0})}</div>`:c}`}_devices(e,s){let t=e.appareils_jour,i=e.direct?.en_marche??[],a={ic:"plug",c:"--nw-home",subject:"Appareils",period:this._until(e),over:s};if(!t||!t.appareils.length)return this._ans({...a,msg:"Aucun appareil mesur\xE9",why:"Ajoutez vos prises mesur\xE9es dans la page \xC9nergie de Home Assistant (consommation individuelle)."});let l=new Map(i.map(b=>[b.nom,b.w])),u=t.appareils[0],p=t.appareils.map(b=>({n:b.nom,v:b.kwh,txt:`${v(b.kwh)}\xA0kWh`,sub:b.euros!=null?`${w(b.euros)}\xA0\u20AC`:void 0,live:l.has(b.nom)?`${$(l.get(b.nom))}\xA0kW`:void 0}));for(let b of i)p.some(_=>_.n===b.nom)||p.push({n:b.nom,v:0,txt:"0 kWh",live:`${$(b.w)}\xA0kW`});let d=p.filter((b,_)=>_<5||b.live),h=p.filter(b=>!d.includes(b)),g=h.reduce((b,_)=>b+_.v,0),m=h.length>1?"s":"",f=h.length||t.sans_prise_kwh?o`${h.length?o`Et ${h.length} autre${m} appareil${m} mesuré${m} : <b>${v(g)} kWh</b>. `:""}${t.sans_prise_kwh?o`Les ${v(t.sans_prise_kwh)} kWh restants viennent d'appareils sans prise mesurée.`:""}`:c;return o`${this._ans({...a,val:v(u.kwh),unit:"kWh",cap:o`<b>${u.nom}</b>, le plus gros`,why:o`Les appareils mesurés font <b>${v(t.mesure_kwh)} kWh</b> sur les ${v(t.maison_kwh)} kWh de la maison.`})}
   <div class="encs">${this._enc("Appareil par appareil",u.euros!=null?o`Ce que chacun a coûté depuis minuit, soleil déduit : ${u.nom} <b>${w(u.euros)} €</b>.`:"Ce que chacun a consomm\xE9 depuis minuit.",ee(d,"--nw-home"),{wide:!0,aside:i.length?o`<span class="live">en marche</span>`:c,foot:f})}</div>`}_peak(e,s){let t=e.pointe,i=e.contrat?.kva,a=(e.heures?.aujourdhui??[]).map(g=>g.achat),l={ic:"bolt",c:"--nw-grid",subject:"Pointe",period:"aujourd'hui",over:s};if(!t)return this._ans({...l,msg:"Pas encore d'heure mesur\xE9e aujourd'hui",why:"La pointe se lit heure par heure : il faut le compteur heure par heure."});let u=t.part!=null&&t.part>=.7,p=Ee(e.heures_creuses),d=g=>p.some(([m,f])=>g*60+30>=m&&g*60+30<f),h=t.part==null?"":t.part<.5?"vous en \xEAtes loin":t.part<.8?"il reste de la marge":"vous en \xEAtes tout pr\xE8s";return o`${this._ans({...l,pill:i?u?["Pr\xE8s de la limite","--nw-act"]:["De la marge","--nw-ok"]:void 0,val:$(t.kw*1e3),unit:"kW",cap:`pris au r\xE9seau entre ${O(t.h)} et ${O(t.h+1)}`,why:o`${i?o` Le compteur coupe au-delà de <b>${i} kVA</b> (environ ${i} kW) : ${h}.`:"L'heure la plus charg\xE9e de la journ\xE9e."}`})}
   <div class="encs">${this._enc("Heure par heure",t.part!=null?o`La barre la plus haute reste à <b>${ot(t.part)} de la limite</b> : ${u?"deux gros appareils de plus pourraient faire couper le compteur":"rien ne risque de faire couper le compteur"}.`:c,o`${oe(a,"--nw-grid",{pin:g=>`${$(g*1e3)}\xA0kW`,bands:p.length?d:void 0,tall:!0,...i?{max:i*1.07,limit:i,limitLabel:`limite ${i}\xA0kVA`}:{}})}${Me}
     <div class="nw-legend"><span><i style="--c:var(--nw-grid)"></i>pris au réseau, en moyenne sur l'heure</span>${p.length?o`<span><i style="--c:color-mix(in oklab, var(--nw-cold) 40%, transparent)"></i>heures creuses</span>`:c}</div>`,{wide:!0})}</div>`}_contract(e,s){let t=e.contrat,i=new Date,a={ic:"doc",c:"--nw-ok",subject:"Contrat",period:"ce mois-ci",over:s},l=Ee(e.heures_creuses),u=lt(l),p=t?.a_confirmer??[],d=o`${t?.kva?`Puissance : ${t.kva}\xA0kVA${p.includes("kva")?" (suppos\xE9e)":""}.`:""}${p.length?o` <a class="to-hub" href="/hestia/energie/reglages" @click=${zt}>${p.includes("option")?p.length>1?"Option et puissance":"Option":"Puissance"} à confirmer dans les Réglages ›</a>`:c}`,h=[...t?.option==="hphc"?[["Heures pleines",t.prix_hp,"le kWh"],["Heures creuses",t.prix_hc,"le kWh"]]:t?.option==="base"?[["Le kWh",t.prix_base,"\xE0 toute heure"]]:[],[`Abonnement${t?.kva?` ${t.kva}\xA0kVA`:""}`,t?.abonnement_mois,"par mois"],["Revente du soleil",t?.revente,"le kWh"]],g=this._enc("Vos prix",t?.abonnement_mois!=null?o`L'abonnement, <b>${w(t.abonnement_mois)} € par mois</b>, se paie même sans rien consommer.`:c,o`<div class="hb list">${h.filter(k=>k[1]!=null).map(([k,M,qe])=>o`<span class="n">${k}</span><span class="v">${qe==="par mois"?w(M):C(M)} €<small>${qe}</small></span>`)}</div>`);if(t?.option!=="hphc"){let k=t?.option==="base";return o`${this._ans({...a,...k&&t?.prix_base!=null?{val:C(t.prix_base),unit:"\u20AC",cap:`le kWh \xE0 toute heure, option Base${p.includes("option")?" (suppos\xE9e)":""}`}:{msg:`Option ${t?.option==="tempo"?"Tempo":"Base"}`},why:d})}
    <div class="encs">${g}</div>`}let m=e.heures_creuses?.length?e.heures_creuses.map(([k,M])=>`${R(k)} \xE0 ${R(M)}`).join(" et de "):null,f=i.getHours()*60+i.getMinutes(),b=t.prix_hp&&t.prix_hc?1-t.prix_hc/t.prix_hp:null,_=t.part_hc,T=t.seuil_hc,W=e.mois?.euros,N=t.base_euros!=null&&W!=null?t.base_euros-W:null,y=_!=null&&T!=null?this._enc("Les heures creuses rapportent-elles ?",o`Ce mois-ci, <b>${Math.round(_*100)} %</b> de vos achats sont tombés ${u?"la nuit":"en heures creuses"}. Elles rapportent à partir de <b>${Math.round(T*100)} %</b>${N!=null?o` : sans elles (option Base), vous auriez payé <b>${w(Math.abs(N))} € de ${N<0?"moins":"plus"}</b>`:""}.`,o`<div><div class="track" style="--c:var(--nw-cold)"><i style="width:${_*100}%"></i><span class="mark" style="left:${Math.min(100,T*100)}%"></span></div>
    <div class="track-l"><span>vous <b>${Math.round(_*100)} %</b></span><span>rentable dès <b>${Math.round(T*100)} %</b></span></div></div>`):c,L=e.heures_creuses?.[0];return o`${this._ans({...a,...L?{val:`${R(L[0])} \u2013 ${R(L[1])}`,cap:e.heures_creuses.length>1?`heures creuses, et de ${e.heures_creuses.slice(1).map(([k,M])=>`${R(k)} \xE0 ${R(M)}`).join(", ")}`:"les heures creuses"}:{msg:"Heures pleines et heures creuses"},why:o`${t.prix_hc!=null&&t.prix_hp!=null?o`${u?"La nuit":"En heures creuses"}, le kWh coûte <b>${C(t.prix_hc)} €</b> au lieu de <b>${C(t.prix_hp)} €</b>${u?" le jour":""}. `:""}${d}`})}
   <div class="encs">
    ${l.length?this._enc("Votre journ\xE9e",b!=null?o`En bleu, les heures creuses : tout ce qui peut attendre y coûte <b>${ot(b)} de moins</b>.`:"En bleu, les heures creuses.",o`<div><div class="day">${l.map(([k,M])=>o`<i style="left:${k/14.4}%;width:${(M-k)/14.4}%"></i>`)}<span class="now" style="left:${f/14.4}%"></span></div>${Me}</div>`,{wide:!0,aside:`il est ${ae(i)}`}):c}
    ${g}${y}
   </div>`}};customElements.get("hestia-energy-card")||customElements.define("hestia-energy-card",Le);var pe=window;pe.customCards=pe.customCards??[];pe.customCards.some(r=>r.type==="hestia-energy-card")||pe.customCards.push({type:"hestia-energy-card",name:"Hestia \xC9nergie",description:"Le conseiller \xE9nergie de la maison : tuile, carte compl\xE8te, cartes de d\xE9tail.",preview:!0});})();

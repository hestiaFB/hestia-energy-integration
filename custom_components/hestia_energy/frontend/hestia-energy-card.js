// Home Assistant frontend#53890: wait for the final custom element registry.
while (!customElements.get('home-assistant')) {
  await customElements.whenDefined('home-assistant');
}
"use strict";(()=>{var Pe=globalThis,Re=Pe.ShadowRoot&&(Pe.ShadyCSS===void 0||Pe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ne=Symbol(),vn=new WeakMap,fe=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==Ne)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(Re&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=vn.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&vn.set(e,s))}return s}toString(){return this.cssText}},we=i=>new fe(typeof i=="string"?i:i+"",void 0,Ne),Ie=(i,...s)=>{let e=i.length===1?i[0]:s.reduce((t,n,a)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[a+1],i[0]);return new fe(e,i,Ne)},xn=(i,s)=>{if(Re)i.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),n=Pe.litNonce;n!==void 0&&t.setAttribute("nonce",n),t.textContent=e.cssText,i.appendChild(t)}},Fe=Re?i=>i:i=>i instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return we(e)})(i):i;var{is:ut,defineProperty:ct,getOwnPropertyDescriptor:pt,getOwnPropertyNames:dt,getOwnPropertySymbols:ht,getPrototypeOf:mt}=Object,We=globalThis,$n=We.trustedTypes,gt=$n?$n.emptyScript:"",ft=We.reactiveElementPolyfillSupport,be=(i,s)=>i,Ke={toAttribute(i,s){switch(s){case Boolean:i=i?gt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,s){let e=i;switch(s){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},kn=(i,s)=>!ut(i,s),_n={attribute:!0,type:String,converter:Ke,reflect:!1,useDefault:!1,hasChanged:kn};Symbol.metadata??=Symbol("metadata"),We.litPropertyMetadata??=new WeakMap;var K=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=_n){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),n=this.getPropertyDescriptor(s,t,e);n!==void 0&&ct(this.prototype,s,n)}}static getPropertyDescriptor(s,e,t){let{get:n,set:a}=pt(this.prototype,s)??{get(){return this[e]},set(o){this[e]=o}};return{get:n,set(o){let l=n?.call(this);a?.call(this,o),this.requestUpdate(s,l,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??_n}static _$Ei(){if(this.hasOwnProperty(be("elementProperties")))return;let s=mt(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(be("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(be("properties"))){let e=this.properties,t=[...dt(e),...ht(e)];for(let n of t)this.createProperty(n,e[n])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,n]of e)this.elementProperties.set(t,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let n of t)e.unshift(Fe(n))}else s!==void 0&&e.push(Fe(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xn(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),n=this.constructor._$Eu(s,t);if(n!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:Ke).toAttribute(e,t.type);this._$Em=s,a==null?this.removeAttribute(n):this.setAttribute(n,a),this._$Em=null}}_$AK(s,e){let t=this.constructor,n=t._$Eh.get(s);if(n!==void 0&&this._$Em!==n){let a=t.getPropertyOptions(n),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Ke;this._$Em=n;let l=o.fromAttribute(e,a.type);this[n]=l??this._$Ej?.get(n)??l,this._$Em=null}}requestUpdate(s,e,t,n=!1,a){if(s!==void 0){let o=this.constructor;if(n===!1&&(a=this[s]),t??=o.getPropertyOptions(s),!((t.hasChanged??kn)(a,e)||t.useDefault&&t.reflect&&a===this._$Ej?.get(s)&&!this.hasAttribute(o._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:n,wrapped:a},o){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,o??e??this[s]),a!==!0||o!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),n===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,a]of this._$Ep)this[n]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[n,a]of t){let{wrapped:o}=a,l=this[n];o!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,a,l)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[be("elementProperties")]=new Map,K[be("finalized")]=new Map,ft?.({ReactiveElement:K}),(We.reactiveElementVersions??=[]).push("2.1.2");var en=globalThis,yn=i=>i,Te=en.trustedTypes,jn=Te?Te.createPolicy("lit-html",{createHTML:i=>i}):void 0,qn="$lit$",X=`lit$${Math.random().toFixed(9).slice(2)}$`,En="?"+X,wt=`<${En}>`,te=document,xe=()=>te.createComment(""),$e=i=>i===null||typeof i!="object"&&typeof i!="function",nn=Array.isArray,bt=i=>nn(i)||typeof i?.[Symbol.iterator]=="function",Ge=`[ 	
\f\r]`,ve=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Mn=/-->/g,An=/>/g,ee=RegExp(`>|${Ge}(?:([^\\s"'>=/]+)(${Ge}*=${Ge}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Cn=/'/g,zn=/"/g,Ln=/^(?:script|style|textarea|title)$/i,tn=i=>(s,...e)=>({_$litType$:i,strings:s,values:e}),r=tn(1),B=tn(2),Dt=tn(3),G=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Sn=new WeakMap,ne=te.createTreeWalker(te,129);function Hn(i,s){if(!nn(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return jn!==void 0?jn.createHTML(s):s}var vt=(i,s)=>{let e=i.length-1,t=[],n,a=s===2?"<svg>":s===3?"<math>":"",o=ve;for(let l=0;l<e;l++){let u=i[l],p,g,m=-1,h=0;for(;h<u.length&&(o.lastIndex=h,g=o.exec(u),g!==null);)h=o.lastIndex,o===ve?g[1]==="!--"?o=Mn:g[1]!==void 0?o=An:g[2]!==void 0?(Ln.test(g[2])&&(n=RegExp("</"+g[2],"g")),o=ee):g[3]!==void 0&&(o=ee):o===ee?g[0]===">"?(o=n??ve,m=-1):g[1]===void 0?m=-2:(m=o.lastIndex-g[2].length,p=g[1],o=g[3]===void 0?ee:g[3]==='"'?zn:Cn):o===zn||o===Cn?o=ee:o===Mn||o===An?o=ve:(o=ee,n=void 0);let d=o===ee&&i[l+1].startsWith("/>")?" ":"";a+=o===ve?u+wt:m>=0?(t.push(p),u.slice(0,m)+qn+u.slice(m)+X+d):u+X+(m===-2?l:d)}return[Hn(i,a+(i[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},_e=class i{constructor({strings:s,_$litType$:e},t){let n;this.parts=[];let a=0,o=0,l=s.length-1,u=this.parts,[p,g]=vt(s,e);if(this.el=i.createElement(p,t),ne.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(n=ne.nextNode())!==null&&u.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(let m of n.getAttributeNames())if(m.endsWith(qn)){let h=g[o++],d=n.getAttribute(m).split(X),f=/([.?@])?(.*)/.exec(h);u.push({type:1,index:a,name:f[2],strings:d,ctor:f[1]==="."?Je:f[1]==="?"?Qe:f[1]==="@"?Xe:ue}),n.removeAttribute(m)}else m.startsWith(X)&&(u.push({type:6,index:a}),n.removeAttribute(m));if(Ln.test(n.tagName)){let m=n.textContent.split(X),h=m.length-1;if(h>0){n.textContent=Te?Te.emptyScript:"";for(let d=0;d<h;d++)n.append(m[d],xe()),ne.nextNode(),u.push({type:2,index:++a});n.append(m[h],xe())}}}else if(n.nodeType===8)if(n.data===En)u.push({type:2,index:a});else{let m=-1;for(;(m=n.data.indexOf(X,m+1))!==-1;)u.push({type:7,index:a}),m+=X.length-1}a++}}static createElement(s,e){let t=te.createElement("template");return t.innerHTML=s,t}};function le(i,s,e=i,t){if(s===G)return s;let n=t!==void 0?e._$Co?.[t]:e._$Cl,a=$e(s)?void 0:s._$litDirective$;return n?.constructor!==a&&(n?._$AO?.(!1),a===void 0?n=void 0:(n=new a(i),n._$AT(i,e,t)),t!==void 0?(e._$Co??=[])[t]=n:e._$Cl=n),n!==void 0&&(s=le(i,n._$AS(i,s.values),n,t)),s}var Ye=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,n=(s?.creationScope??te).importNode(e,!0);ne.currentNode=n;let a=ne.nextNode(),o=0,l=0,u=t[0];for(;u!==void 0;){if(o===u.index){let p;u.type===2?p=new ke(a,a.nextSibling,this,s):u.type===1?p=new u.ctor(a,u.name,u.strings,this,s):u.type===6&&(p=new Ze(a,this,s)),this._$AV.push(p),u=t[++l]}o!==u?.index&&(a=ne.nextNode(),o++)}return ne.currentNode=te,n}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},ke=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,n){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=le(this,s,e),$e(s)?s===c||s==null||s===""?(this._$AH!==c&&this._$AR(),this._$AH=c):s!==this._$AH&&s!==G&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):bt(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==c&&$e(this._$AH)?this._$AA.nextSibling.data=s:this.T(te.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,n=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=_e.createElement(Hn(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===n)this._$AH.p(e);else{let a=new Ye(n,this),o=a.u(this.options);a.p(e),this.T(o),this._$AH=a}}_$AC(s){let e=Sn.get(s.strings);return e===void 0&&Sn.set(s.strings,e=new _e(s)),e}k(s){nn(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,n=0;for(let a of s)n===e.length?e.push(t=new i(this.O(xe()),this.O(xe()),this,this.options)):t=e[n],t._$AI(a),n++;n<e.length&&(this._$AR(t&&t._$AB.nextSibling,n),e.length=n)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=yn(s).nextSibling;yn(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},ue=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,n,a){this.type=1,this._$AH=c,this._$AN=void 0,this.element=s,this.name=e,this._$AM=n,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=c}_$AI(s,e=this,t,n){let a=this.strings,o=!1;if(a===void 0)s=le(this,s,e,0),o=!$e(s)||s!==this._$AH&&s!==G,o&&(this._$AH=s);else{let l=s,u,p;for(s=a[0],u=0;u<a.length-1;u++)p=le(this,l[t+u],e,u),p===G&&(p=this._$AH[u]),o||=!$e(p)||p!==this._$AH[u],p===c?s=c:s!==c&&(s+=(p??"")+a[u+1]),this._$AH[u]=p}o&&!n&&this.j(s)}j(s){s===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},Je=class extends ue{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===c?void 0:s}},Qe=class extends ue{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==c)}},Xe=class extends ue{constructor(s,e,t,n,a){super(s,e,t,n,a),this.type=5}_$AI(s,e=this){if((s=le(this,s,e,0)??c)===G)return;let t=this._$AH,n=s===c&&t!==c||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,a=s!==c&&(t===c||n);n&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},Ze=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){le(this,s)}};var xt=en.litHtmlPolyfillSupport;xt?.(_e,ke),(en.litHtmlVersions??=[]).push("3.3.3");var Pn=(i,s,e)=>{let t=e?.renderBefore??s,n=t._$litPart$;if(n===void 0){let a=e?.renderBefore??null;t._$litPart$=n=new ke(s.insertBefore(xe(),a),a,void 0,e??{})}return n._$AI(i),n};var sn=globalThis,I=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=Pn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}};I._$litElement$=!0,I.finalized=!0,sn.litElementHydrateSupport?.({LitElement:I});var $t=sn.litElementPolyfillSupport;$t?.({LitElement:I});(sn.litElementVersions??=[]).push("4.2.2");var Rn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Wn=i=>(...s)=>({_$litDirective$:i,values:s}),De=class{constructor(s){}get _$AU(){return this._$AM._$AU}_$AT(s,e,t){this._$Ct=s,this._$AM=e,this._$Ci=t}_$AS(s,e){return this.update(s,e)}update(s,e){return this.render(...e)}};var ye=class extends De{constructor(s){if(super(s),this.it=c,s.type!==Rn.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(s){if(s===c||s==null)return this._t=void 0,this.it=s;if(s===G)return s;if(typeof s!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(s===this.it)return this._t;this.it=s;let e=[s];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};ye.directiveName="unsafeHTML",ye.resultType=1;var Tn=Wn(ye);var Dn=`/* CHARTE COMMUNE HESTIA \u2014 jetons et pi\xE8ces partag\xE9s par toutes les cartes Hestia.
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
`;var Vn=`/* Hestia \xC9nergie : seulement ses exceptions. Toute la structure (carte, bandeau, panneaux, sections, \xE9tiquettes) vient de
   hestia-charte.css. Ici, d'apr\xE8s la maquette des cartes 2 (docs/maquette-cartes-2.html, valid\xE9e le 8 nov. 2026), a\xE9r\xE9e
   le 17 nov. comme les cartes Hestia Weather (maquette des cartes 4) : le chiffre en grand, les mots en petit, de l'espace.
   Couleurs de sens propres \xE0 l'\xE9nergie, prises dans la palette Aube : jamais d'autres. */
:host { --nw-peak:var(--nw-level3); --nw-sun:var(--nw-level1); --nw-grid:var(--nw-wind); --nw-home:var(--nw-heat); --nw-water:var(--nw-rain); --nw-battery:var(--nw-calm); display:block; }
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
/* La batterie (retour HACF du 26 nov. 2026) : sous la maison, un court trait vers elle (en charge) ou vers la maison (elle
   donne), sa charge en anneau autour du rond, ses mots \xE0 droite. Plus basse que la ligne, jamais plus haute. */
.fbat { grid-column:3; grid-row:2; display:flex; flex-direction:column; align-items:center; width:48px; --a:.55; }
.flow2.two .fbat { grid-column:1; }
.fvline { position:relative; width:2px; height:18px; margin:6px 0 5px; border-radius:1px; background:color-mix(in oklab, var(--c) 30%, transparent); }
.fbat.rest .fvline { background:color-mix(in srgb, var(--nw-fg) 9%, transparent); }
.fvline i { position:absolute; left:50%; top:0; width:7px; height:7px; border-radius:50%; background:var(--c); box-shadow:0 0 9px var(--c);
 animation:bubblev var(--dur) linear infinite; }
.fvline i:nth-child(2) { animation-delay:calc(var(--dur) / -3); } .fvline i:nth-child(3) { animation-delay:calc(var(--dur) / -1.5); }
.fvline.up i { animation-direction:reverse; }
@keyframes bubblev {
 0% { top:0; transform:translate(-50%, -50%) scale(.45); opacity:0; }
 50% { top:50%; transform:translate(-50%, -50%) scale(1.5); opacity:1; }
 100% { top:100%; transform:translate(-50%, -50%) scale(.45); opacity:0; } }
@media (prefers-reduced-motion:reduce) { .fvline i { animation:none; top:50%; transform:translate(-50%, -50%); } .fvline i + i { display:none; } }
.fbat-n { position:relative; width:48px; height:48px; }
.fring { width:48px; height:48px; border-radius:50%; display:grid; place-items:center;
 background:conic-gradient(color-mix(in oklab, var(--c) 80%, var(--nw-fg)) calc(var(--p) * 1%), color-mix(in srgb, var(--nw-fg) 10%, transparent) 0); }
.fring.none { background:color-mix(in oklab, var(--c) 70%, transparent); }
.fring .fdot { width:40px; height:40px; margin:0; border:none; }
.fbat.rest .fring .fdot { box-shadow:none; }
.fring .fdot svg { width:19px; height:19px; }
.fbat-t { position:absolute; left:58px; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; align-items:flex-start; gap:0; white-space:nowrap; }
.fbat-t .fl b { color:var(--nw-fg); font-weight:750; }
.fbat-t small { font-size:11px; font-weight:600; color:var(--nw-fg2); }
.fbat.rest .fv { color:var(--nw-fg2); font-weight:600; font-size:var(--nw-fs-small); }
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
/* The water heater's plan: shapes stretch, words keep their size (1.0.1b4). */
.whc { display:grid; grid-template-columns:40px minmax(0, 1fr); grid-template-rows:150px 10px 18px; column-gap:6px; row-gap:4px;
  font-size:var(--nw-fs-small); color:var(--nw-fg2); font-variant-numeric:tabular-nums; }
.whc .ya { position:relative; } .whc .ya span { position:absolute; right:0; transform:translateY(-50%); white-space:nowrap; }
.whc .ya span.t { transform:none; } .whc .ya span.b { transform:translateY(-100%); }
.whc .plot { position:relative; min-width:0; } .whc .plot svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
.whc svg * { vector-effect:non-scaling-stroke; }
.whc .gl { stroke:var(--nw-line-soft); stroke-width:1; }
.whc .sun { fill:color-mix(in oklab, var(--nw-sun) 40%, transparent); }
.whc .res { fill:none; stroke:var(--nw-water); stroke-width:2.5; stroke-linejoin:round; }
.whc .min { stroke:var(--nw-act); stroke-width:1.5; stroke-dasharray:4 4; }
.whc .hwr { fill:color-mix(in oklab, var(--nw-water) 16%, transparent); }
.whc .yl { text-align:right; line-height:10px; }
.whc .pb { position:relative; border-radius:3px; overflow:hidden; } .whc .pb i { position:absolute; top:0; bottom:0; }
.whc .pb .hc { background:color-mix(in oklab, var(--nw-cold) 60%, transparent); } .whc .pb .hp { background:color-mix(in oklab, var(--nw-peak) 45%, transparent); }
.whc .tk { position:relative; white-space:nowrap; } .whc .tk span { position:absolute; top:0; transform:translateX(-50%); } .whc .tk span.l { left:0; transform:none; }
.whl { margin-top:8px; justify-content:flex-start; }
.whl i.ln { height:3px; width:14px; border-radius:2px; }
.whl i.dsh { width:14px; height:0; border-top:2px dashed var(--nw-act); border-radius:0; background:none; }
/* The next heatings: two short lines each, nothing cut. */
.whn { display:grid; gap:10px; }
.whn .r { display:grid; grid-template-columns:auto minmax(0, 1fr) auto; gap:4px 10px; align-items:center; }
.whn .w, .whn .v { display:grid; } .whn .v { text-align:right; font-variant-numeric:tabular-nums; }
.whn b { font-weight:600; font-size:var(--nw-fs-text); } .whn small { font-size:var(--nw-fs-small); color:var(--nw-fg2); }
.whn .dot { width:10px; height:10px; border-radius:50%; background:var(--c); }
/* Without Hestia against the plan, day by day. */
.duo { display:grid; grid-template-columns:max-content minmax(0, 1fr) max-content; gap:10px 12px; align-items:center; font-size:var(--nw-fs-text); }
.duo .t { display:grid; gap:3px; } .duo .t i { display:block; height:7px; border-radius:4px; }
.duo .t .a { background:color-mix(in srgb, var(--nw-fg2) 55%, transparent); } .duo .t .b { background:var(--nw-water); }
.duo .v { display:grid; text-align:right; font-variant-numeric:tabular-nums; line-height:1.2; } .duo .v small { color:var(--nw-fg2); font-size:var(--nw-fs-small); }
.duo + .nw-legend { margin-top:8px; justify-content:flex-start; }
.hb.list .dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--c); margin-right:6px; vertical-align:1px; }
.ans-n { color:var(--nw-fg2); }
.gas-bill { display:flex; flex-direction:column; gap:6px; font-size:var(--nw-fs,14px); }
.gas-bill > div { display:flex; justify-content:space-between; gap:12px; }
.gas-bill span { color:var(--nw-fg2); }
.whf { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px 12px; }
.whb { font:inherit; font-weight:600; color:var(--nw-water); background:color-mix(in oklab, var(--nw-water) 12%, transparent);
  border:1px solid color-mix(in oklab, var(--nw-water) 35%, transparent); border-radius:999px; padding:6px 12px; cursor:pointer; }
.whb:hover { background:color-mix(in oklab, var(--nw-water) 20%, transparent); }
`;var yt=[["complete","mdi:page-layout-body","Compl\xE8te","en ce moment, aujourd\u2019hui, ce mois-ci, puis le d\xE9tail"],["tuile","mdi:dock-window","Tuile","en ce moment : une phrase, un chiffre"],["conseils","mdi:piggy-bank-outline","Conseils","ce qui ferait \xE9conomiser, en euros par an"],["soleil","mdi:solar-power-variant","Soleil","ce que les panneaux ont produit aujourd\u2019hui"],["chauffage","mdi:fire","Chauffage","ce qu\u2019a co\xFBt\xE9 la saison, depuis le 1er octobre"],["veille","mdi:weather-night","Veille","ce qui tourne la nuit, les 30 derni\xE8res nuits"],["eau","mdi:water","Eau","les litres et les euros du mois"],["gaz","mdi:fire","Gaz","les m\xB3 ou kWh et les euros du mois, abonnement compris"],["appareils","mdi:power-plug","Appareils","ce que chaque appareil a consomm\xE9 aujourd\u2019hui"],["pointe","mdi:transmission-tower","Pointe","la plus forte puissance prise aujourd\u2019hui"],["contrat","mdi:file-document-outline","Contrat","vos heures creuses et vos prix, ce mois-ci"],["chauffe_eau","mdi:water-boiler","Chauffe-eau","son plan de chauffe et sa r\xE9serve d\u2019eau chaude"]],jt=i=>{i.preventDefault(),history.pushState(null,"",i.currentTarget.getAttribute("href")??"/hestia/energie"),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0}))},rn=class extends I{static{this.properties={hass:{attribute:!1},config:{state:!0}}}static{this.styles=Ie`.note{color:var(--secondary-text-color);font-size:12px;line-height:1.6;margin:0 0 16px}a{color:var(--primary-color)}
  .formats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:4px 0 16px}
  .formats button{all:unset;box-sizing:border-box;display:flex;flex-direction:column;gap:4px;padding:10px 12px;border:1px solid var(--divider-color);border-radius:12px;cursor:pointer;color:var(--primary-text-color);font-size:12px;line-height:1.45}
  .formats button:hover{border-color:var(--secondary-text-color)}
  .formats button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}
  .formats button.on{border:2px solid var(--primary-color);padding:9px 11px}
  .formats ha-icon{--mdc-icon-size:20px;color:var(--secondary-text-color)}.formats button.on ha-icon{color:var(--primary-color)}
  .formats b{font-size:14px;font-weight:500}.formats span{color:var(--secondary-text-color)}`}setConfig(s){this.config={...s}}set(s){let e={...this.config,...s};e.name||delete e.name,e.card==="complete"&&delete e.card,this.config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this.config)return c;let s=this.config.card??"complete";return r`<p class="note">Choisissez ce que montre la carte. Le contrat, les réglages et les extensions se règlent dans
    <a href="/hestia/energie" @click=${jt}>l’onglet Énergie</a>.</p>
   <div class="formats" role="radiogroup" aria-label="Format">${yt.map(([e,t,n,a])=>r`<button type="button" role="radio" aria-checked=${e===s}
     class=${e===s?"on":""} @click=${()=>{e!==s&&this.set({card:e})}}><ha-icon icon=${t}></ha-icon><b>${n}</b><span>${a}</span></button>`)}</div>
   <ha-form .hass=${this.hass} .data=${{name:this.config.name??""}} .schema=${[{name:"name",selector:{text:{}}}]}
     .computeLabel=${()=>"Titre facultatif"} .computeHelper=${()=>"Vide : \xAB Maison \xBB."}
     @value-changed=${e=>{e.stopPropagation(),this.set({name:(e.detail.value.name??"").trim()})}}></ha-form>`}};customElements.get("hestia-energy-card-editor")||customElements.define("hestia-energy-card-editor",rn);var ce=new WeakMap;function Un(i,s){ce.get(i)===s&&ce.delete(i),clearTimeout(s.closing),s.stop?.then(e=>e()).catch(()=>{})}function Bn(i,s,e,t){let n=ce.get(i),a={view:s,error:e,reload:t};if(n){clearTimeout(n.closing),n.closing=void 0;let l=n.last;l&&queueMicrotask(()=>{n.listeners.has(a)&&s(l)})}else{let l={listeners:new Set};n=l,ce.set(i,l),l.stop=i.subscribeMessage(u=>{if(u.reload){Un(i,l);for(let g of[...l.listeners])g.reload();return}let p;if(u.changes){if(!l.last)return;p={...l.last,...u.changes};for(let g of u.removed??[])delete p[g]}else if(u.view)p=u.view;else return;l.last=p;for(let g of[...l.listeners])g.view(p)},{type:"hestia_energy/subscribe"}),l.stop.catch(u=>{ce.get(i)===l&&ce.delete(i);for(let p of[...l.listeners])p.error(u)})}let o=n;return o.listeners.add(a),()=>{!o.listeners.delete(a)||o.listeners.size||(clearTimeout(o.closing),o.closing=setTimeout(()=>{o.listeners.size||Un(i,o)},5e3))}}var Ve=["soleil","chauffage","veille","eau","gaz","appareils","pointe","contrat","chauffe_eau"],On={hc:["--nw-cold","moon","creuses"],hp:["--nw-peak",null,"pleines"],soleil:["--nw-sun","sun","soleil"]},Nn=i=>i.id==="chauffe_eau_heures"?"heater":/vaisselle/i.test(i.nom??"")?"dish":/s[eè]che/i.test(i.nom??"")?"dryer":/linge|laver/i.test(i.nom??"")?"washer":"plug",ln=i=>{let s=Math.floor(i/60)%24,e=i%60;return e?`${s}\xA0h\xA0${String(e).padStart(2,"0")}`:`${s}\xA0h`},In={veille_haute:["moon","--nw-watch"],chauffage_degre:["flame","--nw-heat"],contrat_base:["doc","--nw-benefit"],jour_inhabituel:["home","--nw-home"],budget_mois:["doc","--nw-home"],chauffe_eau_heures:["drop","--nw-cold"],machine_heures:["clock","--nw-home"]},Fn={sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/></svg>',grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M8 21 11 3h2l3 18"/><path d="M5 7h14M6.5 12h11M9.5 16.5l5-4.5M14.5 16.5l-5-4.5"/></svg>',battery:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="7" y="4.5" width="10" height="16.5" rx="2.2"/><path d="M10 2.5h4M10 15h4M10 11h4"/></svg>',bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/></svg>',drop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3s6.5 7 6.5 11.2A6.5 6.5 0 0 1 5.5 14.2C5.5 10 12 3 12 3z"/></svg>',clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>',plug:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0z"/><path d="M12 17v4"/></svg>',doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14 3v5h5M9 12.5h7M9 16.5h7"/></svg>',flame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21.5a6.5 6.5 0 0 0 6.5-6.5c0-4.5-4-6.5-4.5-11-2.5 2-4 4.5-4 7-1-.5-2-1.8-2.2-3C6.5 9.8 5.5 12.3 5.5 15a6.5 6.5 0 0 0 6.5 6.5z"/></svg>',washer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="3" width="15" height="18" rx="2.5"/><circle cx="12" cy="13.5" r="4.3"/><path d="M8 6.5h1.5M13 6.5h3"/></svg>',dryer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="3" width="15" height="18" rx="2.5"/><circle cx="12" cy="13.5" r="4.3"/><path d="M8 6.5h1.5M10 13.8c.7-.8 1.3-.8 2 0s1.3.8 2 0"/></svg>',dish:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M4.5 8h15M8 5.5h1.5"/><path d="M8.5 17.5a3.5 3.5 0 0 1 7 0M12 14v-1.5"/></svg>',heater:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="2.5" width="11" height="16" rx="5.5"/><path d="M9.5 18.5v3M14.5 18.5v3M12 7.5c-1.4 1.8-2 2.8-2 3.8a2 2 0 0 0 4 0c0-1-.6-2-2-3.8z"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',chev:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'},L=i=>Tn(Fn[i]??Fn.bolt),j=(i,s=1)=>{let e=i.toLocaleString("fr-FR",{maximumFractionDigits:s,minimumFractionDigits:0,useGrouping:!1}),[t,n]=e.split(",");return t.replace(/\B(?=(\d{3})+(?!\d))/g,"\u202F")+(n?","+n:"")},me=i=>i.toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2}),H=i=>i==null?"\u2014":j(i/1e3,1),$=i=>i==null?"\u2014":Math.abs(i)<10?me(i):j(i,0),se=i=>i==null?"\u2014":me(i),je=i=>i==null?"\u2014":j(Math.abs(i)>=100?Math.round(i/10)*10:Math.round(i),0),M=i=>i==null?"\u2014":j(i,Math.abs(i)<20?1:0),W=i=>i==null?"\u2014":me(i),Mt=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],re=i=>{if(!i)return"hier";let s=new Date(i+"T12:00"),e=new Date;e.setHours(12,0,0,0);let t=Math.round((e.getTime()-s.getTime())/864e5);return t===1?"hier":t===2?"avant-hier":Mt[s.getDay()]},Ue=i=>i.charAt(0).toUpperCase()+i.slice(1),Kn=i=>{i.preventDefault(),history.pushState(null,"",i.currentTarget.getAttribute("href")??"/hestia/energie"),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0}))},Ae=["janvier","f\xE9vrier","mars","avril","mai","juin","juillet","ao\xFBt","septembre","octobre","novembre","d\xE9cembre"],At=["janv.","f\xE9vr.","mars","avr.","mai","juin","juil.","ao\xFBt","sept.","oct.","nov.","d\xE9c."],Gn={bleu:"ok",vert:"benefit",orange:"action",rouge:"urgent"},Ct={bleu:"--nw-benefit",vert:"--nw-benefit",orange:"--nw-act",rouge:"--nw-alert"},zt={fuite_eau:"drop",disjoncteur:"bolt",chauffe_eau_reseau:"drop",soleil_en_trop:"sun",soleil_machine_ok:"sun",soleil_chaleur:"sun",machines_ensemble:"plug",machine_sans_soleil:"sun",machine_heures_pleines:"clock",oublie:"plug",rien_hc:"clock",rien_hc_bientot:"clock",rien_soleil_juste:"sun",rien_soleil_petit:"sun",rien_soleil_plus_tard:"sun",rien:"home",jour_rouge:"bolt",jour_rouge_demain:"clock"},Yn={bleu:"--nw-cold",blanc:"--nw-fg",rouge:"--nw-alert"},T=i=>i===12?"midi":i===0||i===24?"minuit":`${i}\xA0h`,ae=i=>i.replace(/ /g,"\xA0"),O=i=>i.getHours()+"\xA0h\xA0"+String(i.getMinutes()).padStart(2,"0"),ze=i=>new Date(i+"T12:00:00"),Xn=i=>{let s=ze(i).getDate();return s===1?"1er":String(s)},Ce=i=>`${Xn(i)} ${Ae[ze(i).getMonth()]}`,Jn=i=>i<=.3?"un quart":i<=.4?"un tiers":i<=.58?"la moiti\xE9":i<=.7?"deux tiers":i<=.85?"trois quarts":"presque tout",un=i=>{let s=i.match(/(\d+) h(?: (\d+))?/);return s?Number(s[1])*60+(s[2]?Number(s[2]):0):0};function pe(i){return(i??[]).flatMap(([s,e])=>{let t=un(s),n=un(e);return n>t?[[t,n]]:[[t,1440],[0,n]]})}var Be=i=>i.length>0&&i.every(([s,e])=>s>=1200||e<=570);function de(i,s){let e=Math.max(...i.map(t=>t.v),0)||1;return r`<div class="hb" style="--c:var(${s})">${i.map(t=>r`<span class="n${t.muted?" muted":""}"><span>${t.n}</span>${t.live?r`<span class="live">${t.live}</span>`:c}</span>
  <span class="t${t.dash?" dash":""}"><i class=${t.soft?"soft":""} style="width:${Math.max(1,t.v/e*100)}%"></i></span>
  <span class="v${t.muted?" muted":""}">${t.txt}${t.sub?r`<small>${t.sub}</small>`:c}</span>`)}</div>`}function Qn(i,s){let e=i.filter((a,o)=>o<5||a.live),t=i.filter(a=>!e.includes(a));if(t.length<2)return i;let n=t.reduce((a,o)=>a+o.v,0);return[...e,{n:`Et ${t.length} autres`,v:n,txt:s(n),muted:!0,soft:!0}]}function Me(i,s,e={}){let t=Math.max(...i.map(l=>l??0),0),n=e.max??(t*1.15||1),a=t>0?i.indexOf(t):-1,o=i.length;return r`<div class="cols${e.tall?" tall":""}" style="--c:var(${s})">${i.map((l,u)=>{let p=l==null?2:Math.max(2,l/n*100);return r`<div class="c${e.bands?.(u)?" band":""}">${u===a&&e.pin?r`<span class="pin ${u<2?"l":u>o-3?"r":""}" style="bottom:${p}%">${e.pin(l)}</span>`:c}<i class="${l==null?"none":""}${e.part===u?" part":""}" style="height:${p}%"></i></div>`})}
  ${e.limit?r`<div class="limit" style="bottom:${e.limit/n*100}%"><span>${e.limitLabel}</span></div>`:c}</div>`}var an=r`<div class="ticks"><span>0 h</span><span>6 h</span><span>12 h</span><span>18 h</span><span>24 h</span></div>`,cn=class extends I{constructor(){super();this._config={type:"custom:hestia-energy-card",card:"complete"};this._folded=new Set}static{this.styles=[we(Dn),we(Vn)]}static{this.properties={_view:{state:!0},_open:{state:!0},_folded:{state:!0},_error:{state:!0},_hover:{state:!0},_pin:{state:!0}}}static getStubConfig(){return{card:"complete"}}static getConfigElement(){return document.createElement("hestia-energy-card-editor")}setConfig(e){let t=e.card??"complete";if(t!=="complete"&&t!=="tuile"&&t!=="conseils"&&!Ve.includes(t))throw new Error(`card: ${t} ? (complete, tuile, conseils, ${Ve.join(", ")})`);this._config={...e,card:t}}getCardSize(){return this._config.card==="tuile"?2:8}getGridOptions(){let e=this._config.card;return e==="complete"||e==="conseils"?{columns:"full",rows:"auto"}:{columns:12,rows:"auto",min_columns:6}}set hass(e){let t=this._hass?.connection!==e.connection;this._hass=e,(t||!this._stop)&&this._follow()}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._unfollow()}_unfollow(){this._stop?.(),this._stop=void 0,window.clearTimeout(this._again)}_follow(){this._unfollow(),!(!this._hass||!this.isConnected)&&(this._stop=Bn(this._hass.connection,e=>{this._view=e,this._error=void 0},e=>{this._stop=void 0,this._error=e.message??"Hestia \xC9nergie ne r\xE9pond pas.",this._again=window.setTimeout(()=>this._follow(),3e4)},()=>{this._stop=void 0,this._again=window.setTimeout(()=>this._follow(),2e3)}))}render(){let e=this._view;if(this._error&&!e)return r`<ha-card><div class="empty">${this._error}</div></ha-card>`;if(!e||!e.pret)return r`<ha-card><div class="empty">Hestia Énergie lit la page Énergie…</div></ha-card>`;let t=this._config.card;return t==="tuile"?this._tile(e):t==="conseils"?this._advice(e):t!=="complete"?r`<ha-card>${this._detail(e,t,!1)}</ha-card>`:r`${this._full(e)}${this._open?r`<div class="ov" @click=${n=>{n.target===n.currentTarget&&(this._open=void 0)}}
   @keydown=${n=>{n.key==="Escape"&&(this._open=void 0)}}><ha-card class="sheet" role="dialog" aria-modal="true">${this._detail(e,this._open,!0)}</ha-card></div>`:c}`}_name(){return this._config.name??"Maison"}_live(e){return!!(e.equipement.direct&&e.direct?.maison_w!=null)}_when(e){return e?.periode==="hc"?"en heures creuses":e?.periode==="hp"?"en heures pleines":""}_nowSay(e,t){let n=e.direct,a=n.maison_w??0,o=Math.min(n.soleil_w??0,a),l=n.achat_w??0,u=n.revente_w??0,p=n.batterie,g=Math.min(p?.decharge_w??0,Math.max(0,a-o)),m=p?.charge_w??0,h=this._when(n),d=n.prix!=null?r`<b>${$(l/1e3*n.prix)} € de l'heure</b>${h?`, ${h}`:""}`:null,f=t?r`La maison consomme <b>${H(a)} kW</b>. `:c,x=!!e.equipement.soleil&&o>=30,_=l>=30,k=P=>a>0?Math.round(P/a*100):0,y=r`le reste vient du réseau${d?r` : ${d}`:""}`,b=g>=30||m>=30,v=this._batteryLasts(n,b),S=this._paid(e)?"partent au r\xE9seau":"sont inject\xE9s dans le r\xE9seau";return x&&u>=30&&!_?r`${f}Le soleil couvre tout${m>=30?r`, charge la batterie (<b>${H(m)} kW</b>)`:""} et <b>${H(u)} kW</b> ${S}.${v}`:g>=30?_?r`${f}${x?r`Le soleil en couvre <b>${k(o)} %</b>, la batterie <b>${k(g)} %</b>`:r`La batterie en couvre <b>${k(g)} %</b>`} ; ${y}.${v}`:r`${f}${x?r`Le soleil en couvre <b>${k(o)} %</b>, la batterie le reste : <b>${H(g)} kW</b>.`:r`La batterie couvre toute la maison : <b>${H(g)} kW</b>.`}${v}`:x?_?t?r`${f}Le soleil en couvre <b>${k(o)} %</b>, ${y}.${v}`:r`Le soleil en donne <b>${H(o)} kW</b> ; ${y}.${v}`:r`${f}Le soleil couvre toute la maison${m>=30?r` et charge la batterie : <b>${H(m)} kW</b>`:""}.${v}`:m>=30&&_&&d?r`${f}Tout vient du réseau, la charge de la batterie aussi (<b>${H(m)} kW</b>) : ${d}.${v}`:d?r`${f}Tout vient du réseau : ${d}.${v}`:r`${f}${v}`}_paid(e){return(e.contrat?.revente??0)>0}_batteryLasts(e,t){let n=e.batterie;if(!n||n.pourcent==null)return c;let a=t?"Elle":"La batterie";if(n.pourcent>=99&&(n.decharge_w??0)<30)return r` ${a} est pleine.`;let o=r` ${a} est à <b>${n.pourcent} %</b>`;if(n.pleine_a)return r`${o} : pleine vers <b>${O(new Date(n.pleine_a))}</b> à ce rythme.`;if(!n.jusqu_a||(n.decharge_w??0)<30)return r`${o}.`;let l=new Date(n.jusqu_a),u=e.prochain_changement,p=u?new Date(u.a):null;if(e.periode==="hp"&&p&&u.periode==="hc"){let m=e.couleur==="rouge"?" du jour rouge":"";return l>=p?r`${o} : à ce rythme, elle couvre les heures pleines${m} jusqu'à <b>${O(p)}</b>.`:r`${o} : à ce rythme, jusque vers <b>${O(l)}</b>, avant la fin des heures pleines${m} (${O(p)}).`}let g=(l.getTime()-Date.now())/36e5;return g>=20?r`${o} : à ce rythme, de quoi tenir jusqu'à demain.`:r`${o} : à ce rythme, environ <b>${g<1?`${Math.max(5,Math.round(g*12)*5)}\xA0min`:`${j(g,g<3?1:0)}\xA0h`}</b>, jusque vers ${O(l)}.`}_tile(e){let t=e.direct?.bandeau,n=t?Ct[t.couleur]??"--nw-benefit":"--nw-benefit",a=this._live(e),o=t?[t.pastille,n]:void 0,l={ic:"home",c:"--nw-home",subject:"\xC9nergie",pill:o,over:!1},u=(e.pistes??[]).find(m=>m.euros_an!=null);if(a)return r`<ha-card class="tile">${this._ans({...l,period:"en ce moment",val:H(e.direct.maison_w),unit:"kW",cap:"pour toute la maison",why:t?.couleur==="bleu"&&u?r`Rien à faire maintenant. ${this._saySave(u)}`:this._nowSay(e,!1)})}</ha-card>`;let p=e.dernier_jour,g=re(p?.jour);return p?r`<ha-card class="tile">${this._ans({...l,period:g,...p.euros!=null?{val:$(p.euros),unit:"\u20AC"}:{val:M(p.kwh_achetes),unit:"kWh"},cap:"pour toute la maison",why:u?this._saySave(u):p.euros!=null?r`<b>${M(p.kwh_achetes)} kWh</b> achetés au réseau${p.soleil_couvre!=null?r` ; le soleil a couvert <b>${p.soleil_couvre} %</b> de la maison`:""}.`:"Le prix sera connu avec le contrat."})}</ha-card>`:r`<ha-card class="tile">${this._ans({...l,period:"",msg:"Les premiers jours arrivent",why:"Enedis envoie chaque journ\xE9e le lendemain."})}</ha-card>`}_full(e){let t=e.direct?.bandeau,n=new Date,a=n.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})+" \xB7 "+O(n),o=this._clock(e),l=[o&&!this._live(e)?c:this._nowSection(e),this._todaySection(e),this._monthSection(e)].filter(u=>u!==c);return r`<ha-card>
   <div class="head"><div style="min-width:0"><div class="nw-label">Énergie</div><div class="nw-title">${this._name()}</div></div><div class="when">${a}</div></div>
   ${o??(t&&this._live(e)?r`<div class="nw-band nw-glass" data-level=${Gn[t.couleur]??"ok"}><div class="nw-band-row"><span class="nw-band-pic box">${L(zt[t.id]??"home")}</span>
    <div class="nw-band-text"><p class="nw-band-kicker">En ce moment</p><p class="nw-band-title">${t.titre}</p>${t.pourquoi||this._periodSay(e)?r`<p class="nw-band-line">${t.pourquoi||this._periodSay(e)}</p>`:c}</div></div></div>`:c)}
   <div class="periods${l.length===2?" two":""}">${l}</div>
   ${e.usage?this._section("usage","Votre contrat, bien utilis\xE9","sur 12 mois",this._usage(e)):c}
   ${e.pistes?.length?this._section("save","Pour \xE9conomiser","sur 12 mois, en euros",r`<div class="pistes better">${e.pistes.slice(0,6).map(u=>u.maintenant?this._better(u):this._piste(u))}</div>`):c}
   ${this._section("more","En d\xE9tail","touchez pour ouvrir",r`<div class="more">${this._goes(e)}</div>`)}
  </ha-card>`}_clock(e){let t=e.heures?.aujourdhui??[],n=e.heures?.hier??[],a=t.some(w=>w.achat!=null),o=a?t:n;if(!o.some(w=>w.achat!=null))return;let l=new Date,u=l.getHours()+l.getMinutes()/60,p=pe(e.heures_creuses),g=w=>p.some(([C,E])=>w*60+30>=C&&w*60+30<E),m=Math.max(.3,...o.map(w=>w.achat??0),...a?n.map(w=>w.achat??0):[]),h=Math.max(.3,...o.map(w=>w.soleil??0)),d=170,f=98,x=46,_=86,k=32,y=w=>w/24*Math.PI*2-Math.PI/2,b=(w,C)=>`${(d+Math.cos(y(w))*C).toFixed(1)} ${(d+Math.sin(y(w))*C).toFixed(1)}`,v=(w,C,E)=>`M${b(w+.5,C)} L${b(w+.5,E)} `,S=e.contrat,P=S?.prix_hp??null,z=S?.prix_hc??null,q=S?.prix_base??null,R=w=>S?.option==="base"?q:S?.option==="hphc"?g(w)?z:P:null,N=[],V=0,A=!1,U=!1;for(let w=0;w<24;w++){let C=o[w],E=a&&w>l.getHours(),Q=E?n[w]?.achat??null:C?.achat??null,He=E?null:(C?.soleil??0)>=.01?C.soleil:null;!E&&Q!=null&&(V+=Q),He!=null&&(A=!0),E&&Q!=null&&(U=!0),N.push({i:w,cls:E?"next":g(w)?"off":"peak",val:Q,sun:He,future:E})}let Se=w=>w<1?j(w,2):M(w),F=this._pin??this._hover,qe=(w,C)=>{let E=Math.abs(w-C);return Math.min(E,24-E)},et=w=>F==null?0:qe(w,F)===0?16:qe(w,F)===1?5:0,nt=w=>{let C=w.val!=null?R(w.i):null;return`de ${T(w.i)} \xE0 ${T(w.i+1)} : ${w.val!=null?`${Se(w.val)} kWh ${w.future?"hier":"achet\xE9s"}`:"rien de mesur\xE9"}${C!=null&&w.val!=null?`, environ ${me(w.val*C)} \u20AC`:""}${w.sun!=null?`, ${Se(w.sun)} kWh de soleil`:""}`},tt=N.map(w=>{let C=et(w.i),E=F==null?"":qe(w.i,F)===0?" on":qe(w.i,F)===1?" near":" far";return B`<g class=${`h${E}`}>${w.val!=null?B`<path class=${w.cls} d=${v(w.i,f-(C?2:0),f+3+w.val/m*x+C)}></path>`:c}
    ${w.sun!=null?B`<path class="sun" d=${v(w.i,_+(C?2:0),_-3-w.sun/h*k-C*.6)}></path>`:c}</g>`}),Ee=w=>{this._hover=w},hn=w=>{this._pin=this._pin===w?void 0:w},st=N.map(w=>B`<path class="hit" d=${v(w.i,44,164)} tabindex="0" role="button" aria-label=${nt(w)} aria-pressed=${this._pin===w.i?"true":"false"}
   @pointerenter=${()=>Ee(w.i)} @focus=${()=>Ee(w.i)} @blur=${()=>Ee()} @click=${()=>hn(w.i)}
   @keydown=${C=>{C.key==="Enter"||C.key===" "?(C.preventDefault(),hn(w.i)):C.key==="Escape"&&(this._pin=void 0)}}></path>`),ge=this._live(e),Y=e.direct,Z=Y?.bandeau,mn=e.jusqu_ici,J=e.dernier_jour,gn=ge?[`${H(Y.maison_w)} kW`,"en ce moment"]:a&&mn?.euros!=null?[`${$(mn.euros)} \u20AC`,"depuis minuit"]:!a&&J?.euros!=null?[`${$(J.euros)} \u20AC`,re(J.jour)]:[`${M(V)} kWh`,a?"depuis minuit":re(J?.jour)],D=F!=null?N[F]:void 0,ie=D?[D.val!=null?`${Se(D.val)} kWh`:"\u2014",`${T(D.i)} \u2013 ${T(D.i+1)}${D.future?" \xB7 hier":""}`,[D.val!=null&&R(D.i)!=null?`\u2248 ${me(D.val*R(D.i))} \u20AC`:"",D.sun!=null?`soleil ${Se(D.sun)} kWh`:""].filter(Boolean).join(" \xB7 ")]:[gn[0],gn[1],""],oe=a?e.jour?.soleil_kwh:J?.soleil_kwh,rt=Y?.prix!=null&&!(e.contrat?.a_confirmer??[]).includes("option"),at=Y?.prochain_changement?` jusqu'\xE0 ${O(new Date(Y.prochain_changement.a))}`:"",fn=this._tempo(Y),wn=[...fn?[fn]:[],...rt?[["Le kWh maintenant",`${W(Y.prix)} \u20AC`,`${this._when(Y)}${at}`.trim()||"\xE0 toute heure","--nw-home"]]:[],...a&&e.pointe?[["Heure la plus charg\xE9e",`${H(e.pointe.kw*1e3)} kW`,`entre ${T(e.pointe.h)} et ${T(e.pointe.h+1)}`,"--nw-grid"]]:[],...e.equipement.soleil&&oe!=null&&oe>=.05?[["Soleil",`${M(oe)} kWh`,a?"produits aujourd'hui":`produits ${re(J?.jour)}`,"--nw-sun"]]:[]],it=ge&&Z?Z.titre:`${a?"Aujourd'hui":Ue(re(J?.jour))}, en un tour d'horloge`,bn=ge&&Z?Z.pourquoi||this._periodSay(e):a?"":"Le compteur envoie chaque journ\xE9e le lendemain.",ot=`${a?"Aujourd'hui":Ue(re(J?.jour))} heure par heure : ${M(V)} kWh achet\xE9s au r\xE9seau${oe!=null&&oe>=.05?`, ${M(oe)} kWh de soleil`:""}.`,Le=(w,C,E,Q=4)=>{let[He,lt]=b(w,f+x+16).split(" ");return B`<text x=${He} y=${Number(lt)+Q} text-anchor=${E}>${C}</text>`};return r`<div class="clock" data-level=${ge&&Z?Gn[Z.couleur]??"ok":"ok"}>
   <svg class="dial" viewBox="0 0 340 340" role="group" aria-label=${ot} @pointerleave=${()=>Ee()}>
    <circle class="ring" cx="170" cy="170" r=${f}></circle>
    <g class=${`bars${F!=null?" picking":""}`}>${tt}</g>
    ${Le(0,"0 h","middle",0)}${Le(6,"6 h","end")}${Le(12,"12 h","middle",7)}${Le(18,"18 h","start")}
    ${a?B`<path class="hand" d=${`M${b(u,f-6)} L${b(u,f+x+6)}`}></path>
     <circle class="ping" cx=${b(u,f+x+6).split(" ")[0]} cy=${b(u,f+x+6).split(" ")[1]} r="4.5"></circle>
     <circle class="tip" cx=${b(u,f+x+6).split(" ")[0]} cy=${b(u,f+x+6).split(" ")[1]} r="4.5"></circle>`:c}
    <text class=${`cv${D?" pk":""}`} x="170" y=${ie[2]?166:172}>${ie[0]}</text><text class="cl" x="170" y=${ie[2]?188:194}>${ie[1]}</text>
    ${ie[2]?B`<text class="cl cs" x="170" y="206">${ie[2]}</text>`:c}
    <g class="hits">${st}</g>
   </svg>
   <div class="ct">
    ${ge&&Z?r`<p class="nw-label">En ce moment</p>`:c}
    <p class="ctt">${it}</p>${bn?r`<p class="ans-w">${bn}</p>`:c}
    ${wn.length?r`<div class="cstats">${wn.map(([w,C,E,Q])=>r`<div class="cstat" style="--c:var(${Q})"><span>${w}</span><b>${C}</b><small>${E}</small></div>`)}</div>`:c}
    <div class="nw-legend"><span><i style="--c:var(--nw-home)"></i>acheté en heures pleines</span>${p.length?r`<span><i style="--c:var(--nw-cold)"></i>en heures creuses</span>`:c}
     ${A?r`<span><i style="--c:var(--nw-sun)"></i>soleil, vers le centre</span>`:c}${U?r`<span><i style="--c:color-mix(in srgb, var(--nw-fg) 18%, transparent)"></i>hier, aux heures à venir</span>`:c}
     <span class="hint">touchez une heure pour ses chiffres</span></div>
   </div>
  </div>`}_tempo(e){let t=e?.couleur,n=e?.couleur_demain;return!t&&!n?null:n==="rouge"&&t!=="rouge"?["Tempo demain","Rouge",t?`jour ${t} aujourd'hui`:"de 6 h \xE0 6 h",Yn.rouge]:["Tempo aujourd'hui",Ue(t??"\u2014"),n?`demain ${n}`:"demain pas encore connu",Yn[t??""]??"--nw-fg"]}_periodSay(e){let t=e.direct,n=t?.prochain_changement;if(!n||t?.periode!=="hp"&&t?.periode!=="hc")return"";let a=new Date(n.a),o=t.periode==="hp"?"Heures pleines":"Heures creuses",l=a.getHours()*60+a.getMinutes(),u=(e.heures_creuses??[]).find(([g])=>un(g)===l),p=n.periode==="hc"&&u?`, puis heures creuses jusqu'\xE0 ${ae(u[1])}`:"";return`${o} jusqu'\xE0 ${O(a)}${p}.`}_section(e,t,n,a){let o=!this._folded.has(e);return r`<div class="sec"><button class="nw-fold-head" aria-expanded=${String(o)} @click=${()=>{let l=new Set(this._folded);o?l.add(e):l.delete(e),this._folded=l}}>
   <span class="nw-title">${t}</span><span class="nw-sum">${n}</span><span class="nw-chevron">${L("chev")}</span></button>${o?a:c}</div>`}_flow(e){let t=e.direct,n=(t.periode??"").includes("hc"),a=n?"--nw-cold":"--nw-level3",o=e.equipement.soleil?Math.max(0,t.soleil_w??0):null,l=Math.max(0,t.maison_w??0),u=(t.achat_w??0)>=30,p=!u&&(t.revente_w??0)>=30,g=o==null?0:Math.min(o,l),m=t.batterie,h=z=>z<1e3?`${j(z,0)} W`:`${j(z/1e3,2)} kW`,d=(z,q,R,N,V,A=!1,U=c)=>r`<div class="fnode${A?" dim":""}" style="--c:var(${q});--a:${Math.min(1,Math.max(.25,V)).toFixed(2)}"><span class="fdot">${L(z)}</span><span class="fl">${N}</span><span class="fv">${R}</span>${U}</div>`,f=(z,q,R,N=!1)=>{let V=q>=30,A=V?Math.max(1.2,3.2-q/1500):0;return r`<div class="flink${V?"":" off"}${N?" back":""}" style="--c:var(${z});--dur:${A.toFixed(2)}s"><span class="fsay">${V?r`<b>${R[0]}</b><span>${R[1]}</span>`:""}</span><span class="fline">${V?r`<i></i><i></i><i></i>`:c}</span></div>`},x=u?t.achat_w:p?t.revente_w:0,_=u?[`\u2199 ${h(x)}`,"achet\xE9s"]:[`\u2197 ${h(x)}`,this._paid(e)?"revendus":"inject\xE9s"],k=(m?.decharge_w??0)>=30,y=!k&&(m?.charge_w??0)>=30,b=k?m.decharge_w:y?m.charge_w:0,v=m?.pourcent,S=m?r`<div class="fbat${k||y?"":" rest"}" style="--c:var(--nw-battery);--dur:${Math.max(1.2,3.2-b/1500).toFixed(2)}s;--p:${v??0}">
    <span class="fvline${k?" up":""}">${k||y?r`<i></i><i></i><i></i>`:c}</span>
    <span class="fbat-n"><span class="fring${v==null?" none":""}"><span class="fdot">${L("battery")}</span></span>
     <span class="fbat-t"><span class="fl">Batterie${v!=null?r` · <b>${v} %</b>`:""}</span>
      <span class="fv">${k?`\u2191 ${h(b)}`:y?`\u2193 ${h(b)}`:"au repos"}</span>${k||y?r`<small>${k?"vers la maison":"en charge"}</small>`:c}</span></span></div>`:c,P=e.eau&&e.eau.jour_l>0?r`<span class="fw">${L("drop")}${j(e.eau.jour_l,0)} L d'eau aujourd'hui</span>`:c;return r`<div class="flow2${o==null?" two":""}">
   ${o!=null?r`${d("sun","--nw-prod",h(o),"Production",o/1500,o<30)}${f("--nw-prod",g,[h(g),"en direct"])}`:c}
   ${d("home",a,h(l),"Maison",l/1500,!1,P)}
   ${f(a,x,_,u)}
   ${d("grid",a,`${p?"+":""}${h(x)}`,"R\xE9seau",x/1500,!u&&!p)}
   ${S}
  </div>`}_nowSection(e){let t=e.direct;if(!t)return c;if(!this._live(e)){if(t.prix==null||(e.contrat?.a_confirmer??[]).includes("option"))return c;let n=t.prochain_changement?` jusqu'\xE0 ${O(new Date(t.prochain_changement.a))}`:"";return this._section("now","En ce moment",this._when(t),r`<div class="lines"><div class="line"><span class="ico" style="--c:var(--nw-grid)">${L("clock")}</span>
    <span>Le kWh coûte <b>${W(t.prix)} €</b>${this._when(t)?` ${this._when(t)}`:""}${n}.${t.couleur_demain?` Demain, jour ${t.couleur_demain}.`:""}</span></div></div>`)}return this._section("now","En ce moment",`${H(t.maison_w)}\xA0kW pour toute la maison`,r`${this._flow(e)}
   <div class="lines"><div class="line"><span class="ico" style="--c:var(--nw-home)">${L("home")}</span><span>${this._nowSay(e,!0)}</span></div></div>`)}_todaySection(e){let t=e.jusqu_ici;if(t){let a=new Date(t.jusqu_a).getHours(),o=t.euros!=null&&t.hier_euros!=null,l=o?t.euros:t.kwh,u=o?t.hier_euros:t.hier_kwh,p=l-u,g=o?Math.abs(p)<.1:Math.abs(p)<.5,m=o?"\u20AC":"kWh",h=d=>o?$(d):M(d);return this._section("today","Aujourd'hui","depuis minuit",r`<div class="big"><b>${h(l)} ${m}</b><span>${o?"d\xE9pens\xE9s":"consomm\xE9s"} depuis minuit</span></div>
    <p class="say">${g?r`Comme hier à la même heure.`:r`<b>${h(Math.abs(p))} ${m} de ${p>0?"plus":"moins"}</b> qu'hier à la même heure.`}</p>
    ${de([{n:"Aujourd'hui",v:l,txt:`${h(l)} ${m}`},{n:`Hier \xE0 ${T(a)}`,v:u,txt:`${h(u)} ${m}`,muted:!0,soft:!0}],"--nw-home")}`)}let n=e.dernier_jour;return n?this._section("today",Ue(re(n.jour)),"toute la journ\xE9e",r`<div class="big"><b>${n.euros!=null?`${$(n.euros)}\xA0\u20AC`:`${M(n.kwh_achetes)}\xA0kWh`}</b><span>${n.euros!=null?"pour toute la journ\xE9e":"achet\xE9s au r\xE9seau"}</span></div>
   ${n.euros!=null?r`<p class="say"><b>${M(n.kwh_achetes)} kWh</b> achetés au réseau${n.soleil_couvre!=null?r` ; le soleil a couvert <b>${n.soleil_couvre} %</b> de la maison`:""}.</p>`:c}`):c}_monthSection(e){let t=e.mois;if(!t)return c;let n=new Date,a=t.euros??t.euros_energie,o=e.mois_an_dernier,l=e.projection,u=o?.euros!=null?` L'an dernier, ${Ae[n.getMonth()]} avait co\xFBt\xE9 ${$(o.euros)}\xA0\u20AC.`:"";return this._section("month","Ce mois-ci",`depuis le 1er ${Ae[n.getMonth()]}`,r`<div class="big"><b>${a!=null?`${se(a)}\xA0\u20AC`:`${M(t.kwh_achetes)}\xA0kWh`}</b><span>${a==null?"achet\xE9s au r\xE9seau":t.euros!=null?"abonnement compris":"sans l'abonnement"}</span></div>
   ${l!=null?r`<p class="say">Au même rythme, <b>environ ${$(l)} €</b> à la fin du mois.${u}</p>
    <div><div class="track" style="--c:var(--nw-ok)"><i style="width:${Math.min(100,(a??0)/l*100)}%"></i></div>
     <div class="track-l"><span>déjà <b>${$(a)} €</b></span><span>fin du mois <b>${$(l)} €</b></span></div></div>`:u?r`<p class="say">${u.trim()}</p>`:c}`)}_go(e,t,n,a,o,l,u){let[p,g]=a.split(" \xB7 ");return r`<button class="go" style="--c:var(${n})" @click=${()=>{this._open=e}}><span class="g-h"><span class="ico">${L(t)}</span><span class="g-t">${p}<small>${g}</small></span><span class="ar">›</span></span>
   <span class="g-v">${o}<small>${l}</small></span><span class="g-s">${u}</span></button>`}_goes(e){let t=[],n=e.jour;e.equipement.soleil&&n?.soleil_kwh!=null&&t.push(this._go("soleil","sun","--nw-sun","Soleil \xB7 aujourd'hui",M(n.soleil_kwh),"kWh produits",n.soleil_garde!=null?`La maison en a gard\xE9 ${n.soleil_garde}\xA0%.`:n.soleil_kwh>0?"Une partie de la production n'a pas \xE9t\xE9 mesur\xE9e.":"Rien encore aujourd'hui."));let a=this._heatSum(e),o=e.cout_chauffage;o?t.push(this._go("chauffage","flame","--nw-heat","Chauffage \xB7 ce mois-ci",o.mois.chauffage_eur!=null?$(o.mois.chauffage_eur):"\u2014","\u20AC",o.aujourdhui.chauffage_eur!=null?`Aujourd'hui ${$(o.aujourdhui.chauffage_eur)} \u20AC, compt\xE9 par Hestia Chauffage.`:"Compt\xE9 par Hestia Chauffage.")):a&&t.push(this._go("chauffage","flame","--nw-heat","Chauffage \xB7 depuis le 1er octobre",a.val,a.unit,a.say)),e.veille&&t.push(this._go("veille","moon","--nw-watch","Veille \xB7 chaque nuit",String(e.veille.w),"W quand tout dort",e.veille.euros_par_an!=null?`Environ ${je(e.veille.euros_par_an)}\xA0\u20AC par an.`:"Ce que tire la maison quand tout dort."));let l=e.eau,u=e.direct?.fuite?.minutes;l&&t.push(this._go("eau","drop","--nw-water","Eau \xB7 ce mois-ci",l.mois_euros!=null?se(l.mois_euros):j(l.mois_l,0),l.mois_euros!=null?"\u20AC":"litres",`${l.mois_euros!=null?`${j(l.mois_l,0)}\xA0litres. `:""}${u?`L'eau coule depuis ${Math.round(u)}\xA0min.`:"Pas de fuite."}`));let p=e.gaz;p&&t.push(this._go("gaz","flame","--nw-act","Gaz \xB7 ce mois-ci",p.mois.euros!=null?se(p.mois.euros):j(p.mois.q,p.unite==="m\xB3"?1:0),p.mois.euros!=null?"\u20AC":p.unite,`${p.mois.euros!=null?`${j(p.mois.q,p.unite==="m\xB3"?1:0)} ${p.unite}. `:""}${p.mois.fin_de_mois!=null?`Environ ${$(p.mois.fin_de_mois)} \u20AC pour le mois.`:"Chauffage, cuisine et eau chaude ensemble."}`));let g=e.appareils_jour?.appareils?.[0];g&&t.push(this._go("appareils","plug","--nw-home","Appareils \xB7 aujourd'hui",M(g.kwh),`kWh \xB7 ${g.nom}`,"Celui qui a le plus consomm\xE9."));let m=e.pointe;m&&t.push(this._go("pointe","bolt","--nw-grid","Pointe \xB7 aujourd'hui",H(m.kw*1e3),"kW au plus fort",e.contrat?.kva?`Sur ${e.contrat.kva}\xA0kVA : ${m.part!=null&&m.part>=.7?"pr\xE8s de la limite":"de la marge"}.`:"L'heure la plus charg\xE9e."));let h=e.chauffe_eau;h&&t.push(this._go("chauffe_eau","heater","--nw-water",`Chauffe-eau \xB7 ${h.simulation?"simulation":"pilot\xE9"}`,(h.reserve_reelle??h.reserve)!=null?String(h.reserve_reelle??h.reserve):"\u2014","% de r\xE9serve",h.chauffer?St[h.raison]??"Il chauffe.":h.prochaine_chauffe?`Prochaine chauffe \xE0 ${O(new Date(h.prochaine_chauffe))}.`:"Pas de chauffe pr\xE9vue."));let d=e.contrat;return d?.option==="hphc"&&d.part_hc!=null?t.push(this._go("contrat","doc","--nw-benefit","Contrat \xB7 ce mois-ci",String(Math.round(d.part_hc*100)),Be(pe(e.heures_creuses))?"% la nuit":"% en heures creuses","de vos achats en heures creuses.")):d&&t.push(this._go("contrat","doc","--nw-benefit","Contrat \xB7 ce mois-ci",d.option==="tempo"?"Tempo":d.option==="hphc"?"HP / HC":"Base",d.kva?` \xB7 ${d.kva}\xA0kVA`:"",d.option==="base"&&d.prix_base!=null?`${W(d.prix_base)}\xA0\u20AC le kWh \xE0 toute heure.`:"Vos prix et vos heures.")),t}_heatSum(e){let t=e.chauffage,n=t?.etat==="pret"?t.saison:null,a=t?.poele?.saison;return n?.eur!=null&&a?.eur!=null?{val:$(n.eur+a.eur),unit:"\u20AC",say:`Po\xEAle ${$(a.eur)}\xA0\u20AC, radiateurs ${$(n.eur)}\xA0\u20AC.`,both:!0}:a?{val:a.eur!=null?$(a.eur):j(a.kg,0),unit:a.eur!=null?"\u20AC":"kg",say:`Po\xEAle : ${j(a.kg,0)}\xA0kg de granul\xE9s.`,both:!1}:n?{val:n.eur!=null?$(n.eur):M(n.kwh),unit:n.eur!=null?"\u20AC":"kWh",say:"Radiateurs, estim\xE9s d'apr\xE8s le froid.",both:!1}:t?.etat==="peu_lie"?{val:"\u2014",unit:"",say:"Vous chauffez sans doute avec une autre \xE9nergie.",both:!1}:null}_usage(e){let t=e.usage,n=Be(pe(e.heures_creuses)),a=n?"la nuit":"en heures creuses",o=t.appareils.find(y=>y.type==="chauffe_eau"&&y.euros_an>=2),l=y=>Math.round(y*100),u=t.part_hc_chauffe_eau!=null&&o&&t.part_hc_chauffe_eau-t.part_hc>=.02?t.part_hc_chauffe_eau:null,p=e.contrat?.part_hc,g=r`<div class="u-gauge"><p class="u-k">Vos achats pris ${a}</p>
    <p class="u-v"><b>${l(t.part_hc)} %</b>${u!=null?r`<span>→ <b class="ok">${l(u)} %</b> avec le chauffe-eau ${a}</span>`:c}</p>
    <div class="track" style="--c:var(--nw-cold)">${u!=null?r`<i class="next" style="width:${u*100}%"></i>`:c}<i style="width:${t.part_hc*100}%"></i>
     ${t.seuil_hc!=null?r`<span class="mark" style="left:${Math.min(100,t.seuil_hc*100)}%"></span>`:c}</div>
    <div class="track-l"><span>sur 12 mois</span>${t.seuil_hc!=null?r`<span>rentable dès <b>${l(t.seuil_hc)} %</b></span>`:c}</div>
    ${p!=null&&Math.abs(p-t.part_hc)>=.05?r`<p class="u-n">Ce mois-ci : ${l(p)} %.${p<t.part_hc&&o?" En hiver, le chauffe-eau chauffe sans soleil, en heures pleines.":""}</p>`:c}</div>`,m=t.puissance,h=m?.plus_bas,d=m&&h?r`<p class="u-n u-kva">${h.jours_au_dessus===0&&h.euros_an!=null&&h.euros_an>=5?r`Puissance : <b>${h.kva} kVA suffiraient</b>, ${j(h.euros_an,0)} € de moins par an d'abonnement. Votre plus forte pointe : ${H(m.pointe_w)} kW.`:r`Puissance : <b>gardez ${m.kva} kVA</b>. La maison a dépassé ${h.kva} kW ${h.jours_au_dessus} jour${h.jours_au_dessus>1?"s":""} en 12 mois.`}</p>`:c,f=t.base_de_plus,x=o!=null&&f!=null&&f<0&&o.euros_an>-f,_=f==null?c:f>=0?r`<div class="u-verdict good"><p class="u-k">Votre option heures creuses</p><p class="u-big">C'est la bonne</p>
    <p class="u-n">En Base, ces 12 mois auraient coûté <b>${$(f)} € de plus</b>.${o?r` Avec le chauffe-eau ${a}, l'écart passerait à <b>${j(f+o.euros_an,0)} €</b>.`:""}</p>${d}</div>`:r`<div class="u-verdict"><p class="u-k">Votre option heures creuses</p><p class="u-big">${x?"Rentable, si\u2026":"La Base co\xFBterait moins"}</p>
    <p class="u-n">En Base, ces 12 mois auraient coûté <b>${$(-f)} € de moins</b>.${x?` Avec le chauffe-eau ${a}, les heures creuses redeviendraient rentables.`:""}</p>${d}</div>`,k=_===c?m&&h?r`<div class="u-verdict"><p class="u-k">Votre contrat</p>${d}</div>`:c:r`${_}`;return r`<div class="usage"><div class="u-top">${g}${k}</div></div>`}_machines(e){let t=e.usage;if(!t?.appareils.length)return c;let n=!!e.equipement.soleil,a=Be(pe(e.heures_creuses)),o=d=>Math.round(d*100),l=t.prix,u=r`${n&&l.soleil!=null?r`Au soleil, un kWh ne coûte que la revente perdue, <b>${W(l.soleil)} €</b> ; `:""}${a?"la nuit":"en heures creuses"}, <b>${W(l.hc)} €</b> ; en heures pleines, <b>${W(l.hp)} €</b>.`,p=r`<div class="mach">${t.appareils.map(d=>r`<span class="mn">${d.nom}<small>${M(d.kwh)} kWh par an</small></span>
    <span class="stack" role="img" aria-label="${n?`${o(d.soleil)}\xA0% au soleil, `:""}${o(d.nuit)} % ${a?"la nuit":"en heures creuses"}, ${o(d.pleines)} % en heures pleines">${n?r`<i style="width:${d.soleil*100}%;--c:var(--nw-sun)"></i>`:c}<i style="width:${d.nuit*100}%;--c:var(--nw-cold)"></i><i style="width:${d.pleines*100}%;--c:var(--nw-home)"></i></span>
    <span class="me">${d.euros_an>=1?r`<b>${j(d.euros_an,0)} €</b><small>par an</small>`:r`<small>rien à gagner</small>`}</span>`)}</div>
   <div class="nw-legend">${n?r`<span><i style="--c:var(--nw-sun)"></i>au soleil</span>`:c}<span><i style="--c:var(--nw-cold)"></i>${a?"la nuit":"en heures creuses"}</span><span><i style="--c:var(--nw-home)"></i>en heures pleines</span></div>`,g=t.soleil_mois.filter(d=>d.sur>=20),m="JFMAMJJASOND",h=n&&g.length>=6?this._enc("Du soleil en trop, mois par mois",`Les jours o\xF9 le soleil en trop suffit pour une machine. Les autres jours, Hestia dit d'attendre ${a?"la nuit":"les heures creuses"}, d'apr\xE8s la pr\xE9vision du jour.`,r`<div class="smonths">${g.map(d=>r`<span class="sm" title="${d.jours} jours sur ${d.sur}"><i style="height:${Math.max(4,d.jours/d.sur*100)}%"></i><small>${m[Number(d.mois.slice(5))-1]}</small></span>`)}</div>`,{wide:!0}):c;return r`${this._enc("Quand tournent vos machines",u,p,{wide:!0,aside:"12 derniers mois"})}${h}`}_saySave(e){return r`Pour économiser : ${e.titre.charAt(0).toLowerCase()+e.titre.slice(1)}, <b>${j(e.euros_an,0)} € ${e.unite??"par an"}</b>.`}_better(e){let t=g=>g.replace(/ ([:;!?%€])/g,"\xA0$1").replace(/(\d) (?=(W|kWh|h|centimes)(\s|$|[ .,:]))/g,"$1\xA0").replace(/ h (\d)/g,"\xA0h\xA0$1"),[n,a]=In[e.id]??["home","--nw-home"],o=e.zones?Nn(e):n,l=e.rubrique&&Ve.includes(e.rubrique)?e.rubrique:void 0,u=e.gain??e.euros_an,p=r`<span class="ico" style="--c:var(${a})">${L(o)}</span><span class="bt">${e.nom??e.titre}</span>
   <span class="bn"><small>${e.zones?"D'habitude":"Aujourd'hui"}</small>${t(e.maintenant)}</span>
   <span class="ba" aria-hidden="true">→</span>
   <span class="bm"><small>Mieux</small>${t(e.mieux??"")}</span>
   ${u!=null?r`<span class="pe"><b>${j(u,0)} €</b><small>${t(e.sous??e.unite??"par an")}</small></span>`:c}
   ${e.zones?this._frise(e):c}`;return l?r`<button class="piste wide" style="--c:var(${a})" @click=${()=>{this._open=l}}>${p}</button>`:r`<div class="piste wide" style="--c:var(${a})">${p}</div>`}_frise(e){let t=e.zones,n=h=>t.find(d=>d[0]<=h%1440&&h%1440<d[1])?.[2]??"hp",a=e.lancer??null,o=Nn(e),l=(e.departs??[]).map(([h])=>({m:h,tone:On[n(h)][0],ic:o,good:!1}));if(a!=null){let h=l.find(d=>Math.min(Math.abs(d.m-a),1440-Math.abs(d.m-a))<=90);h?(h.good=!0,h.tone="--nw-benefit"):l.push({m:a,tone:"--nw-benefit",ic:"check",good:!0})}l.sort((h,d)=>h.m-d.m);let u=l.some((h,d)=>d>0&&h.m-l[d-1].m<240),p=h=>h/1440*100,g=h=>p(h)<7?"l":p(h)>93?"r":"",m=e.jours&&e.jours<365?`les ${Math.round(e.jours/30)} derniers mois`:"les 12 derniers mois";return r`<span class="fr${u?" tight":""}" aria-hidden="true">
   <span class="fr-pins">${l.map(h=>r`<span class="fr-pin ${g(h.m)}${h.good?" good":""}" style="left:${p(h.m).toFixed(2)}%;--tone:var(${h.tone})"><span class="chip">${h.good&&h.ic!=="check"?r`${L("check")}${L(h.ic)}`:L(h.ic)}<span class="fr-h">${ln(h.m)}</span></span><span class="stem"></span></span>`)}</span>
   <span class="fr-lane">${t.map(([h,d,f])=>{let[x,_,k]=On[f],y=(d-h)/60;return r`<span class="fr-seg" style="flex:${d-h};--tone:var(${x})">${_&&y>=2?L(_):c}${y>=4?r`<span class="w">${k}</span>`:c}</span>`})}</span>
   <span class="hrs-x"><span>0 h</span><span>6 h</span><span>12 h</span><span>18 h</span><span>24 h</span></span>
   <span class="fr-say">${e.departs?.length?r`<span><i>${L(o)}</i>ses départs habituels, sur ${m}</span>`:r`<span>il démarre à toute heure, sur ${m}</span>`}${a!=null?r`<span><i class="ok">${L("check")}</i>l'heure à viser</span>`:c}</span>
  </span>`}_piste(e){let[t,n]=In[e.id]??["home","--nw-home"],a=e.rubrique&&Ve.includes(e.rubrique)?e.rubrique:void 0,o=r`<span class="ico" style="--c:var(${n})">${L(t)}</span><span class="pt">${e.titre}</span><span class="pw">${e.pourquoi}</span>
   ${e.euros_an!=null?r`<span class="pe"><b>${j(e.euros_an,0)} €</b><small>${e.unite??"par an"}</small></span>`:c}`;return a?r`<button class="piste" style="--c:var(${n})" @click=${()=>{this._open=a}}>${o}</button>`:r`<div class="piste" style="--c:var(${n})">${o}</div>`}_ups(e){let t=[];return(e.contrat?.a_confirmer??[]).includes("option")&&t.push(["doc","Un conseil sur votre contrat ?","Dites votre option et vos heures creuses dans les R\xE9glages : Hestia vous dira si elles rapportent."]),e.equipement.direct?e.equipement.appareils||t.push(["plug","Savoir ce qui consomme","Une prise mesur\xE9e sur le frigo ou le chauffe-eau : la veille appareil par appareil, l\u2019appareil oubli\xE9."]):t.push(["bolt","Les gestes au bon moment","Un module sur la prise du Linky : heures creuses, disjoncteur, le prix de l\u2019heure."]),t.map(([n,a,o])=>r`<div class="piste up"><span class="ico">${L(n)}</span><span class="pt">${a}</span><span class="pw">${o}</span></div>`)}_advice(e){let t=e.pistes??[],n=t.filter(l=>l.unite==="par an").reduce((l,u)=>l+(u.euros_an??0),0),a=n>0?{val:j(n,0),unit:"\u20AC",cap:"par an \xE0 gagner, au plus"}:t.length?{val:String(t.length),cap:`conseil${t.length>1?"s":""} pour vous`}:{msg:"Rien \xE0 changer pour l\u2019instant"},o=t.length?`${t.length>1?`${t.length} conseils tir\xE9s`:"Un conseil tir\xE9"} de vos 12 derniers mois, du plus rentable au moins rentable.`:"Hestia regarde chaque jour vos habitudes et votre contrat ; un conseil appara\xEEtra ici d\xE8s qu\u2019il vaut la peine.";return r`<ha-card>${this._ans({ic:"home",c:"--nw-home",subject:"Pour \xE9conomiser",period:"\xE0 froid, en euros",...a,why:o,over:!1})}
   <div class="pistes">${t.map(l=>this._piste(l))}${this._ups(e)}</div></ha-card>
   ${this._open?r`<div class="ov" @click=${l=>{l.target===l.currentTarget&&(this._open=void 0)}}
    @keydown=${l=>{l.key==="Escape"&&(this._open=void 0)}}><ha-card class="sheet" role="dialog" aria-modal="true">${this._detail(e,this._open,!0)}</ha-card></div>`:c}`}_ans(e){return r`<div class="ans-k"><span class="ico" style="--c:var(${e.c})">${L(e.ic)}</span><span class="nw-title">${e.subject}</span><span class="per">${e.period}</span>
    ${e.pill?r`<span class="pastille" style="--c:var(${e.pill[1]})">${e.pill[0]}</span>`:c}
    ${e.over?r`<button class="d-close" aria-label="Fermer" @click=${()=>{this._open=void 0}}>×</button>`:c}</div>
   <div class="ans">${e.val!=null?r`<p class="hero"><b>${e.val}${e.unit?r`<small>${e.unit}</small>`:c}</b>${e.cap?r`<span>${e.cap}</span>`:c}</p>`:e.msg?r`<p class="ans-m">${e.msg}</p>`:c}${e.why?r`<p class="ans-w">${e.why}</p>`:c}</div>`}_enc(e,t,n,a={}){return r`<div class="nw-panel${a.wide?" wide":""}"><div class="nw-panel-head"><h3><span>${e}</span></h3>${a.aside?r`<span class="aside">${a.aside}</span>`:c}</div>
   ${t?r`<p class="say">${t}</p>`:c}${n??c}${a.foot?r`<div class="foot">${a.foot}</div>`:c}</div>`}_until(e){let t=e.jusqu_ici;return t?`aujourd'hui, jusqu'\xE0 ${T(new Date(t.jusqu_a).getHours())}`:"aujourd'hui"}_detail(e,t,n){switch(t){case"soleil":return this._sun(e,n);case"chauffage":return this._heat(e,n);case"veille":return this._night(e,n);case"eau":return this._water(e,n);case"gaz":return this._gas(e,n);case"appareils":return this._devices(e,n);case"pointe":return this._peak(e,n);case"chauffe_eau":return this._heater(e,n);default:return this._contract(e,n)}}_sun(e,t){let n=e.jour,a=e.soleil_jour,o={ic:"sun",c:"--nw-sun",subject:"Soleil",period:this._until(e),over:t};if(!e.equipement.soleil||n?.soleil_kwh==null)return this._ans({...o,period:"aujourd'hui",msg:"Pas de panneaux dans la page \xC9nergie",why:"Ajoutez leur production dans la page \xC9nergie de Home Assistant : Hestia la lira."});if(n.soleil_kwh<.05)return this._ans({...o,msg:"Les panneaux n'ont encore rien produit",why:"Le soleil arrive : cette carte se remplit au fil des heures."});let l=n.revendu_kwh??0,u=Math.max(0,n.soleil_kwh-l),p=a?.plus_fort,g=(e.heures?.aujourdhui??[]).map(f=>f.soleil),m=e.panneaux,h=a?.groupes??[],d=m?.onduleur_muet_min?r`L'onduleur ne répond plus depuis <b>${m.onduleur_muet_min<120?`${m.onduleur_muet_min}\xA0min`:`${Math.round(m.onduleur_muet_min/60)} h`}</b>.`:m?.en_retrait?.length?r`<b>${m.en_retrait[0].nom}</b> produit ${m.en_retrait[0].pourcent_de_moins} % de moins que d'habitude : à regarder.`:r`Les <b>${h.length} groupes</b> ont produit comme d'habitude : aucun ne faiblit.`;return r`${this._ans({...o,val:M(n.soleil_kwh),unit:"kWh",cap:"produits par les panneaux",why:n.soleil_garde!=null?r`La maison en a gardé <b>${n.soleil_garde} %</b>.${l>=.05?r` Le reste, ${M(l)} kWh, est parti au réseau${n.revendu_euros!=null&&this._paid(e)?r` pour <b>${$(n.revendu_euros)} €</b>`:""}.`:""}`:c})}
   <div class="encs">
    ${this._enc("Heure par heure",p?r`Le soleil a donné le plus entre <b>${T(p.h)} et ${T(p.h+1)} : ${M(p.kwh)} kWh</b>. C'est à ces heures-là qu'une machine tourne au soleil.`:c,r`${Me(g,"--nw-sun",{pin:f=>`${M(f)}\xA0kWh`})}${an}`,{wide:!0})}
    ${this._enc("O\xF9 est parti le soleil",a?.prix_evite!=null&&this._paid(e)?r`Le garder vaut mieux que le vendre : il évite <b>${W(a.prix_evite)} €</b> le kWh, la revente n'en paie que <b>${W(e.contrat.revente)} €</b>.`:r`La maison en a gardé <b>${M(u)} kWh</b>.`,r`<div><div class="split"><i style="width:${u/n.soleil_kwh*100}%;--c:var(--nw-benefit)"></i><i style="width:${l/n.soleil_kwh*100}%;--c:var(--nw-sun)"></i></div>
      <div class="split-l"><span>gardé <b>${M(u)} kWh</b></span><span>${this._paid(e)?"vendu":"inject\xE9"} <b>${M(l)} kWh${n.revendu_euros!=null&&this._paid(e)?` \xB7 ${$(n.revendu_euros)}\xA0\u20AC`:""}</b></span></div></div>`)}
    ${h.length?this._enc("Chaque groupe de panneaux",d,de(Qn(h.map(f=>({n:f.nom,v:f.kwh,txt:`${M(f.kwh)}\xA0kWh`})),f=>`${M(f)}\xA0kWh`),"--nw-sun")):c}
   </div>`}_heat(e,t){if(e.cout_chauffage)return this._heatCost(e,e.cout_chauffage,t);let n=e.chauffage,a=n?.poele,o=a?.saison,l=n?.etat==="pret"?n.saison:null,u=this._heatSum(e),p={ic:"flame",c:"--nw-heat",subject:"Chauffage",period:"depuis le 1er octobre",over:t},g={sans_meteo:"Pour estimer les radiateurs, Hestia a besoin du froid de chaque jour : ajoutez Hestia M\xE9t\xE9o.",meteo_ancienne:"Pour estimer les radiateurs, Hestia a besoin du froid de chaque jour : mettez Hestia M\xE9t\xE9o \xE0 jour.",meteo_incompatible:"Hestia M\xE9t\xE9o n'a pas la m\xEAme version qu'\xC9nergie : mettez les deux \xE0 jour ensemble.",meteo_sans_lieu:"Pour estimer les radiateurs, ajoutez votre maison dans Hestia M\xE9t\xE9o.",meteo_sans_donnees:"Hestia M\xE9t\xE9o ne donne pas le froid des jours pass\xE9s : choisissez un capteur de temp\xE9rature dans ses r\xE9glages.",apprend:"Il faut quelques semaines de froid pour estimer les radiateurs. Revenez cet hiver.",peu_lie:"Votre \xE9lectricit\xE9 varie peu avec le froid : vous chauffez sans doute surtout avec une autre \xE9nergie."},m="Radiateurs : estim\xE9s en comparant chaque jour votre \xE9lectricit\xE9 au froid qu'il a fait.",h="",d="",f="",x;if(u?.both)h=u.val,d="\u20AC",f="pour se chauffer",x=r`Le poêle <b>${$(o.eur)} €</b> de granulés, les radiateurs électriques <b>environ ${$(l.eur)} €</b>.`;else if(o)[h,d,f]=o.eur!=null?[$(o.eur),"\u20AC","de granul\xE9s pour le po\xEAle"]:[j(o.kg,0),"kg","de granul\xE9s br\xFBl\xE9s"],x=r`${o.eur!=null?r`<b>${j(o.kg,0)} kg</b> de granulés. `:""}${l?r`Les radiateurs, <b>environ ${l.eur!=null?`${$(l.eur)}\xA0\u20AC`:`${M(l.kwh)}\xA0kWh`}</b>.`:g[n?.etat??""]??""}`;else if(l)[h,d,f]=l.eur!=null?[$(l.eur),"\u20AC","de radiateurs, environ"]:[M(l.kwh),"kWh","de radiateurs, environ"],x=m;else return this._ans({...p,msg:n?.etat==="peu_lie"?"Une autre \xE9nergie chauffe la maison":"Le chauffage n'est pas encore estim\xE9",why:g[n?.etat??""]??"Ajoutez Hestia M\xE9t\xE9o, ou le suivi de votre po\xEAle."});let _=u?.both&&l?.eur!=null&&o?.eur!=null?o.eur/(o.eur+l.eur):null,k=_==null?c:this._enc("Qui chauffe",_>=.4&&_<=.6?r`Le poêle et les radiateurs font <b>chacun la moitié</b> de la dépense.`:r`${_>.6?"Le po\xEAle fait":"Les radiateurs font"} <b>${Math.round((_>.6?_:1-_)*100)} %</b> de la dépense.`,de([{n:"Po\xEAle",v:o.eur,txt:`${$(o.eur)}\xA0\u20AC`,sub:`${j(o.kg,0)}\xA0kg`},{n:"Radiateurs",v:l.eur,txt:`${$(l.eur)}\xA0\u20AC`,sub:`${M(l.kwh)}\xA0kWh`}],"--nw-heat"),{foot:m}),y=n?.euros_par_degre,b=y!=null&&l?this._enc("Le froid fait la facture",r`Chaque degré de froid en plus coûte <b>environ ${me(y)} € par jour</b> de radiateurs.`,c,{foot:r`Exemple : un jour à 5 °C au lieu de 10 °C, <b>${$(y*5)} €</b> de plus.`}):c,v=a?.stock_kg,S=v!=null&&a?.sac_kg?Math.round(v/a.sac_kg*10)/10:null,P=v!=null&&o?this._enc("Granul\xE9s en stock",v<=0?r`<b>Plus de granulés</b> en stock.`:r`Il reste <b>${S!=null?`${j(S,1)} sac${S>1?"s":""} (${j(v,0)}\xA0kg)`:`${j(v,0)}\xA0kg`}</b>${a?.jours_restants!=null?r` : au rythme de cette saison, <b>environ ${a.jours_restants} jours</b> de poêle`:""}.`,r`<div><div class="track" style="--c:var(--nw-heat)"><i style="width:${o.kg+v>0?o.kg/(o.kg+v)*100:0}%"></i></div>
    <div class="track-l"><span>brûlés <b>${j(o.kg,0)} kg</b></span><span>en stock <b>${j(v,0)} kg</b></span></div></div>`):c;return r`${this._ans({...p,val:h,unit:d,cap:f,why:x})}<div class="encs">${k}${b}${P}</div>`}_heatCost(e,t,n){let a=t.mois,o=t.aujourdhui,l=t.hier,u=(y,b=!0)=>{let v=[...y.electrique_kwh?[r`${b?"R":"r"}adiateurs <b>${y.electrique_eur!=null?`${$(y.electrique_eur)} \u20AC`:`${M(y.electrique_kwh)} kWh`}</b>`]:[],...y.granules_kg?[r`${b&&!y.electrique_kwh?"P":"p"}oêle <b>${y.granules_eur!=null?`${$(y.granules_eur)} \u20AC`:`${j(y.granules_kg,0)} kg`}</b>`]:[]];return v.length?r`${v[0]}${v[1]?r`, ${v[1]}`:c}.`:c},p=[...a.electrique_eur!=null&&a.electrique_kwh?[{n:"Radiateurs",v:a.electrique_eur,txt:`${$(a.electrique_eur)} \u20AC`,sub:`${M(a.electrique_kwh)} kWh`}]:[],...a.granules_eur!=null&&a.granules_kg?[{n:"Po\xEAle",v:a.granules_eur,txt:`${$(a.granules_eur)} \u20AC`,sub:`${j(a.granules_kg,0)} kg`}]:[]],g=this._enc("Aujourd'hui et hier",r`Aujourd'hui <b>${o.chauffage_eur!=null?`${$(o.chauffage_eur)} \u20AC`:"\u2014"}</b> : ${u(o,!1)}${l?r` Hier <b>${l.chauffage_eur!=null?`${$(l.chauffage_eur)} \u20AC`:"\u2014"}</b> : ${u(l,!1)}`:c}`,c),m=p.length>1?this._enc("Qui chauffe",r`Ce mois-ci, ${u(a,!1)}`,de(p,"--nw-heat")):c,h=a.gagne_eur!=null&&a.gagne_eur>0?this._enc("Le po\xEAle fait gagner",r`Ce mois-ci, <b>${$(a.gagne_eur)} €</b> de moins qu'avec la même chaleur à l'électricité.`,c):c,d=e.chauffage?.poele,f=d?.stock_kg,x=f!=null&&d?.sac_kg?Math.round(f/d.sac_kg*10)/10:null,_=f!=null?this._enc("Granul\xE9s en stock",f<=0?r`<b>Plus de granulés</b> en stock.`:r`Il reste <b>${x!=null?`${j(x,1)} sac${x>1?"s":""} (${j(f,0)} kg)`:`${j(f,0)} kg`}</b>${d?.jours_restants!=null?r` : <b>environ ${d.jours_restants} jours</b> de poêle`:""}.`,c):c,k=a.chauffage_eur!=null;return r`${this._ans({ic:"flame",c:"--nw-heat",subject:"Chauffage",period:"ce mois-ci",over:n,val:k?$(a.chauffage_eur):"\u2014",unit:k?"\u20AC":"",cap:"pour se chauffer",why:r`Compté par <b>Hestia Chauffage</b>, au prix de chaque heure${a.jours<new Date().getDate()?` (${a.jours} jours connus)`:""}.${k?"":" Une partie n'a pas encore de prix connu."}`})}
   <div class="encs">${g}${m}${h}${_}</div>`}_night(e,t){let n=e.veille,a=e.veille_historique??[],o={ic:"moon",c:"--nw-watch",subject:"Veille",over:t};if(!n)return this._ans({...o,period:"les derni\xE8res nuits",msg:"La veille n'est pas encore connue",why:"Il faut deux semaines de nuits mesur\xE9es heure par heure."});let l=n.nuit,u=n.evolution,p=(l?.appareils??[]).map(d=>({n:d.nom,v:d.w,txt:`${d.w}\xA0W`,sub:d.euros_par_an!=null?`${je(d.euros_par_an)}\xA0\u20AC par an`:void 0}));l?.sans_prise_w&&p.push({n:"Sans prise mesur\xE9e",v:l.sans_prise_w,txt:`${l.sans_prise_w}\xA0W`,sub:l.sans_prise_euros_par_an!=null?`${je(l.sans_prise_euros_par_an)}\xA0\u20AC par an`:void 0,dash:!0}),p.sort((d,f)=>f.v-d.v);let g=l&&p.length?this._enc("Ce qui tourne la nuit",l.sans_prise_w?r`Les prises mesurées expliquent <b>${l.mesure_w} W</b>. Les <b>${l.sans_prise_w} W</b> qui restent viennent d'appareils sans prise mesurée : c'est là qu'il faut chercher.`:r`Les prises mesurées expliquent toute la veille : <b>${l.mesure_w} W</b>.`,de(Qn(p,d=>`${Math.round(d)}\xA0W`),"--nw-watch"),{wide:!0,aside:"au plus calme de la nuit"}):c,m=u?Ce(u.debut):"",h=a.length>1?this._enc("Nuit apr\xE8s nuit",u&&Math.abs(u.ecart_w)>=10?r`Elle est passée de <b>${u.debut_w} W à ${n.w} W</b> depuis le ${m}${u.ecart_euros_par_an!=null?r` : <b>environ ${je(Math.abs(u.ecart_euros_par_an))} € par an</b> de ${u.ecart_w<0?"moins":"plus"}`:""}.`:r`Elle reste autour de <b>${n.w} W</b> depuis le ${m}.`,r`${Me(a.map(d=>d.w),"--nw-watch",{pin:d=>`${d}\xA0W`,max:Math.max(...a.map(d=>d.w))*1.09})}<div class="ticks"><span>${Xn(a[0].jour)} ${At[ze(a[0].jour).getMonth()]}</span><span>cette nuit</span></div>`,{wide:!0}):c;return r`${this._ans({...o,period:`les ${a.length>1?a.length:n.nuits} derni\xE8res nuits`,val:String(n.w),unit:"W",cap:"quand tout dort",why:n.euros_par_an!=null?r`La maison les tire jour et nuit, même sans rien allumer : <b>environ ${je(n.euros_par_an)} € par an</b>.`:"Ce fond tourne jour et nuit, m\xEAme sans rien allumer."})}
   <div class="encs">${g}${h}</div>`}_gas(e,t){let n=e.gaz,a=new Date,o={ic:"flame",c:"--nw-act",subject:"Gaz",over:t};if(!n)return this._ans({...o,period:"ce mois-ci",msg:"Pas de compteur de gaz",why:"Ajoutez-le dans la page \xC9nergie de Home Assistant : Hestia le lira."});let l=n.mois,u=n.jours??[],p=Ae[a.getMonth()],g=n.unite==="m\xB3"?1:0,m=n.plus_gros,h=u.map((_,k)=>k===u.length-1?"auj.":u.length<=12||[0,7,14,21,28].includes(k)?String(ze(_.jour).getDate()):""),d=e.cout_chauffage?" La part du chauffage est dans la carte Chauffage, compt\xE9e par Hestia Chauffage.":" Chauffage, cuisine et eau chaude ensemble.",f=l.euros!=null&&l.abonnement_euros!=null,x=f?r`<div class="gas-bill">
    <div><span>Gaz brûlé</span><b>${se(l.gaz_euros)} €</b></div><div><span>Abonnement, depuis le 1er</span><b>${se(l.abonnement_euros)} €</b></div>
    ${l.fin_de_mois!=null?r`<div><span>Fin du mois prévue</span><b>≈ ${$(l.fin_de_mois)} €</b></div>`:c}</div>`:c;return r`${this._ans({...o,period:`${p}, du 1er au ${a.getDate()}`,val:j(l.q,g),unit:n.unite,cap:l.euros!=null?r`soit <b>${se(l.euros)} €</b>${l.abonnement_euros!=null?" abonnement compris":""}`:c,why:r`${l.fin_de_mois!=null?r`À ce rythme, <b>environ ${$(l.fin_de_mois)} €</b> pour ${p}.`:""}${d}`})}
   ${u.length?r`<div class="encs">${this._enc("Jour par jour",m?r`Le plus gros jour : <b>le ${Ce(m.jour)}, ${j(m.q,g)} ${n.unite}</b>${m.euros!=null?`, soit ${$(m.euros)} \u20AC`:""}.`:c,r`${Me(u.map(_=>_.q),"--nw-act",{pin:_=>`${j(_,g)} ${n.unite}`,part:u.length-1})}<div class="ticks days">${h.map(_=>r`<span>${_}</span>`)}</div>`,{wide:!0})}
    ${f?this._enc("La facture du mois",c,x):c}</div>`:c}`}_water(e,t){let n=e.eau,a=new Date,o=e.direct?.fuite?.minutes,l={ic:"drop",c:"--nw-water",subject:"Eau",over:t};if(!n)return this._ans({...l,period:"ce mois-ci",msg:"Pas de compteur d'eau",why:"Ajoutez-le dans la page \xC9nergie de Home Assistant : Hestia le lira."});let u=n.jours??[],p=Ae[a.getMonth()],g=o?[`L'eau coule depuis ${Math.round(o)}\xA0min`,o>=60?"--nw-alert":"--nw-act"]:["Pas de fuite","--nw-benefit"],m=n.plus_gros,h=u.map((d,f)=>f===u.length-1?"auj.":u.length<=12||[0,7,14,21,28].includes(f)?String(ze(d.jour).getDate()):"");return r`${this._ans({...l,period:`${p}, du 1er au ${a.getDate()}`,pill:g,val:j(n.mois_l,0),unit:"litres",cap:n.mois_euros!=null?r`soit <b>${se(n.mois_euros)} €</b>`:c,why:r`${n.l_par_jour!=null?r`Environ <b>${j(n.l_par_jour,0)} litres par jour</b>. `:""}${n.prix_m3!=null?r`L'eau coûte ${W(n.prix_m3)} € le m³, soit <b>${W(n.euros_100_l)} € les 100 litres</b>.`:""}`})}
   ${u.length?r`<div class="encs">${this._enc("Jour par jour",m?r`Le plus gros jour : <b>le ${Ce(m.jour)}, ${j(m.l,0)} litres</b>${m.euros!=null?`, soit ${$(m.euros)}\xA0\u20AC`:""}. Un jour qui sort du lot se voit tout de suite.`:c,r`${Me(u.map(d=>d.l),"--nw-water",{pin:d=>`${j(d,0)}\xA0L`,part:u.length-1})}<div class="ticks days">${h.map(d=>r`<span>${d}</span>`)}</div>`,{wide:!0})}</div>`:c}`}_devices(e,t){let n=e.appareils_jour,a=e.direct?.en_marche??[],o={ic:"plug",c:"--nw-home",subject:"Appareils",period:this._until(e),over:t};if(!n||!n.appareils.length)return this._ans({...o,msg:"Aucun appareil mesur\xE9",why:"Ajoutez vos prises mesur\xE9es dans la page \xC9nergie de Home Assistant (consommation individuelle)."});let l=new Map(a.map(x=>[x.nom,x.w])),u=n.appareils[0],p=n.appareils.map(x=>({n:x.nom,v:x.kwh,txt:`${M(x.kwh)}\xA0kWh`,sub:x.euros!=null?`${$(x.euros)}\xA0\u20AC`:void 0,live:l.has(x.nom)?`${H(l.get(x.nom))}\xA0kW`:void 0}));for(let x of a)p.some(_=>_.n===x.nom)||p.push({n:x.nom,v:0,txt:"0 kWh",live:`${H(x.w)}\xA0kW`});let g=p.filter((x,_)=>_<5||x.live),m=p.filter(x=>!g.includes(x)),h=m.reduce((x,_)=>x+_.v,0),d=m.length>1?"s":"",f=m.length||n.sans_prise_kwh?r`${m.length?r`Et ${m.length} autre${d} appareil${d} mesuré${d} : <b>${M(h)} kWh</b>. `:""}${n.sans_prise_kwh?r`Les ${M(n.sans_prise_kwh)} kWh restants viennent d'appareils sans prise mesurée.`:""}`:c;return r`${this._ans({...o,val:M(u.kwh),unit:"kWh",cap:r`<b>${u.nom}</b>, le plus gros`,why:r`Les appareils mesurés font <b>${M(n.mesure_kwh)} kWh</b> sur les ${M(n.maison_kwh)} kWh de la maison.`})}
   <div class="encs">${this._enc("Appareil par appareil",u.euros!=null?r`Ce que chacun a coûté depuis minuit, soleil déduit : ${u.nom} <b>${$(u.euros)} €</b>.`:"Ce que chacun a consomm\xE9 depuis minuit.",de(g,"--nw-home"),{wide:!0,aside:a.length?r`<span class="live">en marche</span>`:c,foot:f})}</div>`}_peak(e,t){let n=e.pointe,a=e.contrat?.kva,o=(e.heures?.aujourdhui??[]).map(h=>h.achat),l={ic:"bolt",c:"--nw-grid",subject:"Pointe",period:"aujourd'hui",over:t};if(!n)return this._ans({...l,msg:"Pas encore d'heure mesur\xE9e aujourd'hui",why:"La pointe se lit heure par heure : il faut le compteur heure par heure."});let u=n.part!=null&&n.part>=.7,p=pe(e.heures_creuses),g=h=>p.some(([d,f])=>h*60+30>=d&&h*60+30<f),m=n.part==null?"":n.part<.5?"vous en \xEAtes loin":n.part<.8?"il reste de la marge":"vous en \xEAtes tout pr\xE8s";return r`${this._ans({...l,pill:a?u?["Pr\xE8s de la limite","--nw-act"]:["De la marge","--nw-benefit"]:void 0,val:H(n.kw*1e3),unit:"kW",cap:`pris au r\xE9seau entre ${T(n.h)} et ${T(n.h+1)}`,why:r`${a?r` Le compteur coupe au-delà de <b>${a} kVA</b> (environ ${a} kW) : ${m}.`:"L'heure la plus charg\xE9e de la journ\xE9e."}`})}
   <div class="encs">${this._enc("Heure par heure",n.part!=null?r`La barre la plus haute reste à <b>${Jn(n.part)} de la limite</b> : ${u?"deux gros appareils de plus pourraient faire couper le compteur":"rien ne risque de faire couper le compteur"}.`:c,r`${Me(o,"--nw-grid",{pin:h=>`${H(h*1e3)}\xA0kW`,bands:p.length?g:void 0,tall:!0,...a?{max:a*1.07,limit:a,limitLabel:`limite ${a}\xA0kVA`}:{}})}${an}
     <div class="nw-legend"><span><i style="--c:var(--nw-grid)"></i>pris au réseau, en moyenne sur l'heure</span>${p.length?r`<span><i style="--c:color-mix(in oklab, var(--nw-cold) 40%, transparent)"></i>heures creuses</span>`:c}</div>`,{wide:!0})}</div>`}async _force(e){try{await this._hass?.callWS({type:"hestia_energy/chauffe_eau_force",arret:e})}catch(t){console.warn("Hestia \xC9nergie : marche forc\xE9e refus\xE9e",t)}}_heater(e,t){let n=e.chauffe_eau,a={ic:"heater",c:"--nw-water",subject:"Chauffe-eau",period:"les prochaines heures",over:t};if(!n)return this._ans({...a,msg:"Pas de chauffe-eau dans la page \xC9nergie",why:"Ajoutez sa prise mesur\xE9e dans la page \xC9nergie de Home Assistant (consommation individuelle) : Hestia pr\xE9parera son plan de chauffe."});let o=n.simulation?["Simulation : rien n\u2019est command\xE9","--nw-watch"]:n.chauffer?["Chauffe","--nw-act"]:n.raison==="plein"?["Plein","--nw-benefit"]:["En attente","--nw-cold"],l=n.plan.slice(0,5),u=n.soleil_prevu==="prevision"?"la pr\xE9vision solaire de la page \xC9nergie":n.soleil_prevu==="nuages"?"les nuages pr\xE9vus par Hestia M\xE9t\xE9o":n.soleil_prevu==="habitude"?"la production habituelle des panneaux":null,p=this._enc("Le plan des prochaines heures",u?r`Refait toutes les 5 minutes, avec ${u} et vos prix.`:"Refait toutes les 5 minutes, avec vos prix.",Ht(n),{wide:!0,foot:n.kwh_prevus!=null?r`Prévu d'ici demain soir : <b>${M(n.kwh_prevus)} kWh</b>${n.cout_prevu!=null?r`, soit <b>${$(n.cout_prevu)} €</b>`:""}.`:c}),g=l.length?this._enc("Les prochaines chauffes",c,r`<div class="whn">${l.map(A=>r`<div class="r">
    <i class="dot" style="--c:var(${pn[A.source]??"--nw-home"})"></i>
    <div class="w"><b>${Et(A.debut,A.fin)}</b><small>${Zn[A.source]??""}</small></div>
    <div class="v"><b>${$(A.euros)} €</b><small>${M(A.kwh)} kWh</small></div></div>`)}</div>`):c,m=n.bilan.filter(A=>A.reel_kwh>=.05||A.hestia_kwh>=.05||(A.force_kwh??0)>=.05),h=m.reduce((A,U)=>A+U.reel_eur,0),d=m.reduce((A,U)=>A+U.hestia_eur,0),f=m.reduce((A,U)=>A+U.hc_eur,0),x=m.reduce((A,U)=>A+(U.force_eur??0),0),_=n.simulation?h:f,k=_-d,y=m.length,b=he(new Date),v=n.simulation?"sans Hestia (ce que vous avez pay\xE9)":"en heures creuses seules",S=y?this._enc(n.simulation?"Ce que le plan aurait co\xFBt\xE9":"Ce que le plan a co\xFBt\xE9",n.simulation?r`Sans Hestia, votre chauffe-eau a coûté <b>${$(h)} €</b>. Avec le plan, il aurait coûté <b>${$(d)} €</b>${Math.abs(k)>=.005?r` : <b>${$(Math.abs(k))} € de ${k>0?"moins":"plus"}</b>`:""}.`:r`Avec le plan, <b>${$(d)} €</b>. En heures creuses seules, la même eau aurait coûté <b>${$(f)} €</b>${Math.abs(k)>=.005?r` : <b>${$(Math.abs(k))} € de ${k>0?"plus":"moins"}</b>`:""}.${x>=.005?r` Les marches forcées, comptées à part : <b>${$(x)} €</b>.`:""}`,r`${Lt(m.map(A=>({n:A.jour===b?"aujourd\u2019hui":Ce(A.jour),a:n.simulation?A.reel_eur:A.hc_eur,b:A.hestia_eur})))}
     <div class="nw-legend"><span><i style="--c:var(--nw-fg2)"></i>${v}</span><span><i style="--c:var(--nw-water)"></i>avec le plan de Hestia</span></div>`,{aside:`sur ${y} jour${y>1?"s":""}`,foot:n.simulation?"Le plan est rejou\xE9 sur la m\xEAme eau chaude, minute par minute : rien n\u2019a \xE9t\xE9 command\xE9.":c}):c,P=[];n.manque.includes("litres")&&P.push("le volume du ballon, pour une r\xE9serve juste"),n.manque.includes("prise")&&P.push("la prise qui le commande"),n.manque.includes("besoin")&&P.push("quelques jours encore, pour apprendre combien d\u2019eau chaude la maison tire");let z=this._enc("R\xE9glages",r`Mode <b>${qt[n.mode]??n.mode}</b>${n.simulation?" : Hestia montre ce qu\u2019il ferait, votre automatisation ne fait rien.":"."}
    ${n.suit===!1?r` <b>La prise ne suit pas le plan</b> : vérifiez l’automatisation.`:c}${P.length?r` Il manque ${P.join(", ")}.`:c}`,c,{foot:r`<div class="whf">${this._hass?.user?.is_admin===!1?c:r`<button type="button" class="whb" @click=${()=>void this._force(!!n.force_jusqu_a)}>${n.force_jusqu_a?`Arr\xEAter la marche forc\xE9e (jusqu\u2019\xE0 ${dn(new Date(n.force_jusqu_a))})`:"Chauffer maintenant"}</button>`}
    <a class="to-hub" href="/hestia/energie/chauffe-eau" @click=${Kn}>Régler le chauffe-eau ›</a></div>`}),q=n.simulation&&n.reserve_reelle!=null,R=q?n.reserve_reelle:n.reserve,N=q?n.reserve_reelle_kwh:n.reserve_kwh,V=n.sonde?"":", estim\xE9e";return r`${this._ans({...a,pill:o,val:R!=null?String(R):"\u2014",unit:"%",cap:`d'eau chaude ${q?"dans votre ballon":"en r\xE9serve"}${V}${N!=null?`, ${M(N)} kWh sur ${M(n.capacite_kwh)}`:""}`,why:q?r`${n.phrase} <span class="ans-n">Le plan part du ballon qu’aurait Hestia en le pilotant : ${n.reserve??"\u2014"} %.</span>`:n.phrase})}
   <div class="encs">${p}${g}${S}${z}</div>`}_contract(e,t){let n=e.contrat,a=new Date,o={ic:"doc",c:"--nw-benefit",subject:"Contrat",period:"ce mois-ci",over:t},l=pe(e.heures_creuses),u=Be(l),p=n?.a_confirmer??[],g=r`${n?.kva?`Puissance : ${n.kva}\xA0kVA${p.includes("kva")?" (suppos\xE9e)":""}.`:""}${p.length?r` <a class="to-hub" href="/hestia/energie/reglages" @click=${Kn}>${p.includes("option")?p.length>1?"Option et puissance":"Option":"Puissance"} à confirmer dans les Réglages ›</a>`:c}`,m=[...n?.option==="hphc"?[["Heures pleines",n.prix_hp,"le kWh"],["Heures creuses",n.prix_hc,"le kWh"]]:n?.option==="base"?[["Le kWh",n.prix_base,"\xE0 toute heure"]]:[],[`Abonnement${n?.kva?` ${n.kva}\xA0kVA`:""}`,n?.abonnement_mois,"par mois"],["Revente du soleil",n?.revente,"le kWh"]],h=this._enc("Vos prix",n?.abonnement_mois!=null?r`L'abonnement, <b>${$(n.abonnement_mois)} € par mois</b>, se paie même sans rien consommer.`:c,r`<div class="hb list">${m.filter(z=>z[1]!=null).map(([z,q,R])=>r`<span class="n">${z}</span><span class="v">${R==="par mois"?$(q):W(q)} €<small>${R}</small></span>`)}</div>`);if(n?.option!=="hphc"){let z=n?.option==="base";return r`${this._ans({...o,...z&&n?.prix_base!=null?{val:W(n.prix_base),unit:"\u20AC",cap:`le kWh \xE0 toute heure, option Base${p.includes("option")?" (suppos\xE9e)":""}`}:{msg:`Option ${n?.option==="tempo"?"Tempo":"Base"}`},why:g})}
    <div class="encs">${h}</div>`}let d=e.heures_creuses?.length?e.heures_creuses.map(([z,q])=>`${ae(z)} \xE0 ${ae(q)}`).join(" et de "):null,f=a.getHours()*60+a.getMinutes(),x=n.prix_hp&&n.prix_hc?1-n.prix_hc/n.prix_hp:null,_=n.part_hc,k=n.seuil_hc,y=e.mois?.euros,b=n.base_euros!=null&&y!=null?n.base_euros-y:null,v=e.usage,S=v&&v.seuil_hc!=null?this._enc("Les heures creuses rapportent-elles ?",r`Sur 12 mois, <b>${Math.round(v.part_hc*100)} %</b> de vos achats sont tombés ${u?"la nuit":"en heures creuses"}${_!=null?` (ce mois-ci ${Math.round(_*100)} %)`:""}. Elles rapportent à partir de <b>${Math.round(v.seuil_hc*100)} %</b>${v.base_de_plus!=null?r` : en Base, vous auriez payé <b>${$(Math.abs(v.base_de_plus))} € de ${v.base_de_plus>=0?"plus":"moins"}</b>`:""}.`,r`<div><div class="track" style="--c:var(--nw-cold)"><i style="width:${v.part_hc*100}%"></i><span class="mark" style="left:${Math.min(100,v.seuil_hc*100)}%"></span></div>
    <div class="track-l"><span>vous <b>${Math.round(v.part_hc*100)} %</b></span><span>rentable dès <b>${Math.round(v.seuil_hc*100)} %</b></span></div></div>`):_!=null&&k!=null?this._enc("Les heures creuses rapportent-elles ?",r`Ce mois-ci, <b>${Math.round(_*100)} %</b> de vos achats sont tombés ${u?"la nuit":"en heures creuses"}. Elles rapportent à partir de <b>${Math.round(k*100)} %</b>${b!=null?r` : sans elles (option Base), vous auriez payé <b>${$(Math.abs(b))} € de ${b<0?"moins":"plus"}</b>`:""}.`,r`<div><div class="track" style="--c:var(--nw-cold)"><i style="width:${_*100}%"></i><span class="mark" style="left:${Math.min(100,k*100)}%"></span></div>
    <div class="track-l"><span>vous <b>${Math.round(_*100)} %</b></span><span>rentable dès <b>${Math.round(k*100)} %</b></span></div></div>`):c,P=e.heures_creuses?.[0];return r`${this._ans({...o,...P?{val:`${ae(P[0])} \u2013 ${ae(P[1])}`,cap:e.heures_creuses.length>1?`heures creuses, et de ${e.heures_creuses.slice(1).map(([z,q])=>`${ae(z)} \xE0 ${ae(q)}`).join(", ")}`:"les heures creuses"}:{msg:"Heures pleines et heures creuses"},why:r`${n.prix_hc!=null&&n.prix_hp!=null?r`${u?"La nuit":"En heures creuses"}, le kWh coûte <b>${W(n.prix_hc)} €</b> au lieu de <b>${W(n.prix_hp)} €</b>${u?" le jour":""}. `:""}${g}`})}
   <div class="encs">
    ${l.length?this._enc("Votre journ\xE9e",x!=null?r`En bleu, les heures creuses : tout ce qui peut attendre y coûte <b>${Jn(x)} de moins</b>.`:"En bleu, les heures creuses.",r`<div><div class="day">${l.map(([z,q])=>r`<i style="left:${z/14.4}%;width:${(q-z)/14.4}%"></i>`)}<span class="now" style="left:${f/14.4}%"></span></div>${an}</div>`,{wide:!0,aside:`il est ${O(a)}`}):c}
    ${h}${S}${this._machines(e)}
   </div>`}},St={soleil:"Il chauffe au soleil.",soleil_partiel:"Il chauffe, en partie au soleil.",heures_creuses:"Il chauffe en heures creuses.",heures_pleines:"Il chauffe en heures pleines.",eau_chaude_d_abord:"Il chauffe : l\u2019eau chaude d\u2019abord.",hygiene:"Chauffe compl\xE8te de la semaine.",boost:"Chauffe demand\xE9e."},pn={soleil:"--nw-sun",soleil_partiel:"--nw-act",heures_creuses:"--nw-cold",heures_pleines:"--nw-peak",base:"--nw-home"},Zn={soleil:"au soleil",soleil_partiel:"en partie au soleil",heures_creuses:"en heures creuses",heures_pleines:"en heures pleines",base:"au prix de base"},qt={simulation:"Simulation",apprentissage:"Apprentissage",automatique:"Automatique",heures_creuses:"Heures creuses seules",vacances:"Vacances"},dn=i=>i.getMinutes()?O(i):T(i.getHours()),he=i=>`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")}`;function Et(i,s){let e=new Date(i),t=new Date(s),n=new Date,a=new Date(n);return a.setDate(a.getDate()+1),`${he(e)===he(n)?"":he(e)===he(a)?"demain, ":`le ${Ce(he(e))}, `}${dn(e)} \u2013 ${dn(t)}`}function Lt(i){let s=Math.max(...i.flatMap(t=>[t.a,t.b]),0)||1,e=t=>`${Math.max(1,t/s*100)}%`;return r`<div class="duo">${i.map(t=>r`<span class="n">${t.n}</span>
  <span class="t"><i class="a" style="width:${e(t.a)}"></i><i class="b" style="width:${e(t.b)}"></i></span>
  <span class="v"><small>${$(t.a)} €</small><b>${$(t.b)} €</b></span>`)}</div>`}function on(i,s){let e=[];return i.forEach((t,n)=>{let a=s(t);if(a==null)return;let o=e[e.length-1];o&&o[1]===n&&o[2]===a?o[1]=n+1:e.push([n,n+1,a])}),e}function Ht(i){let s=i.courbe,e=s.length;if(e<2)return c;let t=b=>`${b/e*100}%`,n=b=>100-Math.max(0,Math.min(100,b)),a=Math.max(3,...s.map(b=>b[2])),o=s.some(b=>b[2]>.05),l="M0,100";s.forEach((b,v)=>{l+=` L${v+.5},${100-b[2]/a*80}`}),l+=` L${e},100 Z`;let u="";s.forEach((b,v)=>{u+=`${v?" L":"M"}${v+.5},${n(b[1])}`});let p=b=>{let v=new Date(b[0]);return v.getHours()*60+v.getMinutes()},g=i.plages??[],m=b=>g.some(([v,S])=>(b-v+1440)%1440<(S-v+1440)%1440),h=on(s,b=>m(p(b))?"x":null),d=on(s,b=>b[5]),f=on(s,b=>b[4]?"hc":"hp"),x=s.map((b,v)=>[v,p(b)]).filter(([b,v])=>v%360===0&&b>=Math.max(4,e*.17)&&b<=e-3),_=new Set(s.map(b=>b[5]).filter(Boolean)),k=Math.round(i.reserve_min*100),y=g.map(([b,v])=>`${ln(b)} \u2013 ${ln(v)}`).join(", ");return r`<div class="whc" role="img" aria-label="Le plan des prochaines heures : réserve d'eau chaude, soleil prévu et chauffes">
   <div class="ya"><span class="t" style="top:0">100 %</span><span style="top:50%">50 %</span><span class="b" style="top:100%">0 %</span></div>
   <div class="plot">
    <svg viewBox="0 0 ${e} 100" preserveAspectRatio="none" aria-hidden="true">
     ${h.map(([b,v])=>B`<rect x=${b} y="0" width=${v-b} height="100" class="hwr"></rect>`)}
     ${[0,50,100].map(b=>B`<line x1="0" x2=${e} y1=${n(b)} y2=${n(b)} class="gl"></line>`)}
     ${o?B`<path d=${l} class="sun"></path>`:c}
     ${d.map(([b,v,S])=>B`<rect x=${b+.08} y="86" width=${v-b-.16} height="14" style="fill:var(${pn[S]??"--nw-home"})"></rect>`)}
     <line x1="0" x2=${e} y1=${n(k)} y2=${n(k)} class="min"></line>
     <path d=${u} class="res"></path>
    </svg>
   </div>
   <div class="yl">prix</div>
   <div class="pb">${f.map(([b,v,S])=>r`<i class=${S} style="left:${t(b)};width:${t(v-b)}"></i>`)}</div>
   <div></div>
   <div class="tk"><span class="l">maintenant</span>${x.map(([b,v])=>r`<span style="left:${t(b)}">${v===0?"minuit":T(v/60)}</span>`)}</div>
  </div>
  <div class="nw-legend whl">
   <span><i class="ln" style="--c:var(--nw-water)"></i>eau chaude en réserve</span>
   <span><i class="dsh"></i>jamais sous ${k} %</span>
   ${g.length?r`<span><i style="--c:color-mix(in oklab, var(--nw-water) 16%, transparent)"></i>quand vous tirez l'eau chaude (${y})</span>`:c}
   ${o?r`<span><i style="--c:color-mix(in oklab, var(--nw-sun) 45%, transparent)"></i>soleil en trop prévu</span>`:c}
   ${["soleil","soleil_partiel","heures_creuses","heures_pleines","base"].filter(b=>_.has(b)).map(b=>r`<span><i style="--c:var(${pn[b]})"></i>chauffe ${Zn[b]}</span>`)}
   <span>prix :</span><span><i style="--c:color-mix(in oklab, var(--nw-cold) 60%, transparent)"></i>heures creuses</span><span><i style="--c:color-mix(in oklab, var(--nw-peak) 45%, transparent)"></i>heures pleines</span>
  </div>`}customElements.get("hestia-energy-card")||customElements.define("hestia-energy-card",cn);var Oe=window;Oe.customCards=Oe.customCards??[];Oe.customCards.some(i=>i.type==="hestia-energy-card")||Oe.customCards.push({type:"hestia-energy-card",name:"Hestia \xC9nergie",description:"Le conseiller \xE9nergie de la maison : tuile, carte compl\xE8te, cartes de d\xE9tail.",preview:!0});})();

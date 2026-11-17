import {LitElement,html,nothing,css,type TemplateResult} from 'lit';
import {customElement,property,state} from 'lit/decorators.js';
import {hubStyles,modernStyles,pageStyles,listSection,listRow,saveBar,segmented,toggle,moreRow,helpTip,aboutPage,SOCLE} from './socle/ui';

/* The « Énergie » tab of the Hestia-FB panel, as validated by Frank on 8 Nov. 2026 (hestia-energie/docs/maquette-hub-energie.html,
   INTERFACE.md § 5): Vue d'ensemble · Sources · Appareils · Réglages · Extensions · Bilan · À propos.
   Everything shown comes from the integration (hestia_energy/hub, settings, periods); the tab computes nothing but sums. */

type Hass={callWS:<T>(msg:Record<string,unknown>)=>Promise<T>;states:Record<string,{state:string;attributes:Record<string,unknown>}>;language?:string};
type Todo={titre:string;texte:string;page:string};
type Period={debut:string;kwh_achetes:number;euros:number|null;euros_energie:number|null;soleil_couvre:number|null;revendu_euros:number|null;soleil_kwh?:number|null};
type Source={id:string;groupe:string;nom:string;usage:string;etat:'ok'|'todo';sous?:string|null;chiffres:{texte:string;benefice?:boolean}[];
 origine:{nom:string;role:string;texte:string;entite:string;par?:string|null}[];corrige:string[];enedis?:{titre:string;texte:string}[];suit_enedis?:boolean;gaz_declare?:boolean};
type Device={id:string;stat:string;nom:string;sans_nom:boolean;groupe:string;groupe_devine:string;kwh:number|null;euros:number|null;w:number|null;
 a_regler:string|null;a_regler_detail:string|null;via:string;corrige:string[];dans:string|null;puissance:string|null;
 mesure_par:string|null;integration:string|null;piece:string|null;nom_compteur:string;nom_puissance:string|null;w_direct:number|null};
type Ext={id:string;groupe:string;nom:string;usage:string;sans:string;lien:string|null;installee:boolean;utilisee:boolean;ou:string[];
 probleme?:{titre:string;texte:string}|null;lieu?:string|null;lieu_nom?:string|null;lieux?:{id:string;nom:string}[]};
type Hub={pret:boolean;soleil:boolean;direct:boolean;vide:boolean;a_regler:Todo[];a_ameliorer:Todo[];veille:{w:number;euros_par_an:number|null}|null;
 mois:Period|null;projection:number|null;mois_an_dernier:Period|null;douze_mois:{euros:number|null;du:string;au:string;soleil_couvre:number|null;revendu_euros:number|null}|null;
 bilans:{id:string;titre:string;texte:string;euros:number|null;kwh:number}[];chauffage:{etat:string;mois?:{kwh:number;eur:number|null}|null;poele?:{saison?:{kg:number;eur:number|null}}|null}|null;
 eau:{mois_l:number;mois_euros:number|null}|null;sources:Source[];appareils:{liste:Device[];mois:string|null;part:number|null};extensions:Ext[];groupes:[string,string][];
 tarifs:string|null;notifie:boolean;mis_a_jour?:string;pistes:{id:string;titre:string;pourquoi:string;euros_an:number|null;unite:string|null}[]};
type Found<V>={valeur:V|null;source:string|null};
type Settings={reglages:Record<string,unknown>;trouve:{option:Found<string>;offpeak:Found<[string,string][]>;kva:Found<number>;offer:Found<string>;
 tarif_bleu:{hp?:number|null;hc?:number|null;base?:number|null;abonnement:number|null};prix_page:Record<string,number>;export_price:Found<number>;water_price:Found<number>;
 margin:Found<number>;sac_kg:number|null;notify:{id:string;nom:string}[];a:{revente:boolean;eau:boolean;poele:boolean;delestage:boolean;un_compteur:boolean}}};

const REPO='https://github.com/hestiaFB/hestia-energy-integration';
const VERSION='1.0.0b1';
const HA_ENERGY='/config/energy';
const MONTHS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const DAYS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const num=(v:number,d=0)=>v.toLocaleString('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d});
// Euros to the cent under 100 €, to the euro above (charte, C10).
const eur=(v:number|null|undefined)=>v==null?'—':(Math.abs(v)<100?num(v,2):num(v,0))+' €';
const kwh=(v:number)=>num(v,v<10?1:0)+' kWh';
const cap=(s:string)=>s.charAt(0).toUpperCase()+s.slice(1);
const monthOf=(iso:string|null|undefined)=>iso?MONTHS[new Date(iso+(iso.length===10?'T12:00':'')).getMonth()]:'';
const parseHc=(s:unknown):[string,string][]|null=>typeof s==='string'&&s.trim()?s.split(',').map(r=>r.split('-').map(x=>x.trim().replace('h',':').padStart(5,'0')) as [string,string]):null;
const hcText=(l:[string,string][])=>l.filter(([a,b])=>a&&b).map(([a,b])=>`${a}-${b}`).join(', ')||null;

@customElement('hestia-energy-setup')
export class HestiaEnergySetup extends LitElement {
 static styles=[hubStyles,modernStyles,pageStyles,css`
  :host{--en-benefit:#8cc084}:host([data-theme=light]){--en-benefit:#3f7337}
  main{max-width:808px;margin:0 auto}
  .crumb{display:inline-flex;gap:6px;align-items:center;color:var(--nk-muted);font:inherit;font-size:var(--nw-fs-text,14px);margin:0 0 14px;cursor:pointer;background:none;border:0;padding:0;min-height:0}
  .crumb:hover{color:var(--primary-text-color)}
  h1{font-size:var(--nw-fs-case,21px);font-weight:650;letter-spacing:-.03em;line-height:1.25;margin:0}
  .lead{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin:8px 0 26px;color:var(--nk-muted);font-size:var(--nw-fs-text,14px)}
  .lead p{margin:0;flex-basis:100%;color:var(--primary-text-color);max-width:640px}.lead p+p{color:var(--nk-muted)}
  .lead hestia-hub-help-v1{display:inline-flex}
  .pill{display:inline-flex;align-items:center;gap:6px;font-size:var(--nw-fs-small,12px);font-weight:600;border-radius:999px;padding:3px 10px;background:var(--nk-selected,var(--nk-surface));color:var(--primary-text-color);white-space:nowrap}
  .pill::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--nk-muted)}
  .pill.ok::before{background:var(--nk-ok,var(--nk-accent))}.pill.todo::before{background:var(--nk-todo)}.pill.plain::before{display:none}
  .pill.benefit::before{background:var(--en-benefit)}.pill.run::before{background:var(--nk-ok,var(--nk-accent));box-shadow:0 0 0 3px color-mix(in srgb,var(--nk-ok,var(--nk-accent)) 25%,transparent)}
  .chips{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 18px;align-items:center}
  .m{background:var(--nk-selected,var(--nk-surface));border-radius:999px;padding:4px 12px;font-size:var(--nw-fs-text,14px);font-weight:600}
  .m small{font-weight:400;color:var(--nk-muted);margin-left:4px}.ben{color:var(--en-benefit)}
  .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 26px}
  .stat{background:var(--nk-surface);border:1px solid var(--nk-border);border-radius:16px;padding:14px 16px;text-align:left;font:inherit;color:inherit;margin:0;min-height:0}
  .stat b{display:block;font-size:var(--nw-fs-case,21px);font-weight:650;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
  .stat span{display:block;font-size:var(--nw-fs-small,12px);color:var(--nk-muted)}.stat small{display:block;font-size:var(--nw-fs-small,12px);color:var(--nk-muted);opacity:.8;margin-top:2px}
  button.stat{cursor:pointer}@media(hover:hover){button.stat:hover{border-color:var(--primary-color)}}
  .eid{font-family:ui-monospace,monospace;font-size:var(--nw-fs-label,11px);color:var(--nk-muted);word-break:break-all}
  .money{font-variant-numeric:tabular-nums}
  .mbar{display:inline-block;height:6px;border-radius:99px;background:var(--nk-selected,var(--nk-border));width:90px;vertical-align:middle;margin-right:10px;overflow:hidden}
  .mbar i{display:block;height:100%;background:var(--nk-muted);opacity:.55}
  .hc{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.hc span{display:flex;align-items:center;gap:6px}
  .nk-row-val input[type=time]:not([type=checkbox]):not([type=radio]){width:116px}.nk-row-val input[type=number]:not([type=checkbox]):not([type=radio]){width:96px;text-align:right}
  .linkbtn{background:none;border:0;color:var(--nk-accent);cursor:pointer;padding:0;font:inherit;font-size:var(--nw-fs-text,14px);min-height:0;margin:0}
  .big{font-size:var(--nw-fs-case,21px);letter-spacing:-.02em;font-weight:650}
  .ext-act{display:inline-flex;align-items:center;min-height:32px;padding:5px 12px;border-radius:999px;background:var(--nk-button,var(--primary-color));color:var(--nk-on-button,#fff);font-weight:600;font-size:var(--nw-fs-small,12px);text-decoration:none;white-space:nowrap}
  .dlg{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45);padding:16px}
  .dlg>div{background:var(--primary-background-color,var(--nk-surface));border:1px solid var(--nk-border);border-radius:20px;padding:22px;max-width:440px;width:100%}
  .dlg h2{margin:0 0 6px;font-size:var(--nw-fs-title,17px)}.dlg p{margin:0 0 16px;color:var(--nk-muted)}.dlg .act{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}
  @media(max-width:640px){.stats{gap:8px}.stat{padding:10px 12px}.stat b{font-size:var(--nw-fs-title,17px)}.hc{align-items:flex-start}}`];
 @property({attribute:false}) hass?:Hass;
 @property({attribute:false}) route?:{prefix?:string;path:string};
 @property({type:Boolean}) narrow=false;
 @state() private hub?:Hub;
 @state() private settings?:Settings;
 @state() private draft:Record<string,unknown>={};
 @state() private months?:Period[];
 @state() private error?:string;
 @state() private saving=false;
 @state() private saved=false;
 @state() private leaving?:string;
 private loadedFor?:string;

 connectedCallback(){super.connectedCallback();window.addEventListener('beforeunload',this.beforeUnload);void this.load();}
 disconnectedCallback(){super.disconnectedCallback();window.removeEventListener('beforeunload',this.beforeUnload);}
 private beforeUnload=(e:BeforeUnloadEvent)=>{if(this.count()){e.preventDefault();e.returnValue='';}};
 // A new `hass` comes at every change of state in the home: the tab redraws only for its own data.
 shouldUpdate(changed:Map<string,unknown>){return !(changed.size===1&&changed.has('hass')&&this.hub);}
 private async load(){
  if(!this.hass)return;
  const at=this.route?.path??'';this.loadedFor=at;
  try{
   const [hub,settings]=await Promise.all([this.hass.callWS<Hub>({type:'hestia_energy/hub'}),this.hass.callWS<Settings>({type:'hestia_energy/settings'})]);
   this.hub=hub;this.settings=settings;this.error=undefined;
   // Just after a restart the reports are not ready yet: asked again a few seconds later.
   if(!hub.pret)setTimeout(()=>{if(this.isConnected)void this.load();},5000);
  }catch(e){this.error=(e as {message?:string}).message??'Hestia Énergie ne répond pas.';}
 }
 updated(changed:Map<string,unknown>){
  if(changed.has('hass')&&!this.hub&&!this.error)void this.load();
  // Each page shows fresh figures (a device running, a source just mended): read again when the page changes.
  if(changed.has('route')&&this.hub&&this.loadedFor!==(this.route?.path??''))void this.load();
  if((changed.has('route')||changed.has('hub'))&&this.page()==='bilan'&&!this.months&&this.hass)void this.loadMonths();
 }
 private async loadMonths(){
  this.months=[];
  const now=new Date(),start=new Date(now.getFullYear()-1,now.getMonth(),1),end=new Date(now.getFullYear(),now.getMonth(),0);
  const iso=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  try{const r=await this.hass!.callWS<{periodes:Period[]}>({type:'hestia_energy/periods',du:iso(start),au:iso(end),pas:'mois'});this.months=r.periodes;}
  catch{this.months=undefined;setTimeout(()=>{if(this.page()==='bilan'&&!this.months)void this.loadMonths();},5000);}
 }
 private parts(){return (this.route?.path??'').replace(/^\//,'').split('/');}
 private page(){return this.parts()[0];}
 private scope(path:string){return path.split('/').slice(0,2).join('/');}
 // Leaving a page with changes not saved asks once (CAHIER-HUB.md § 6).
 private go(path:string){
  if(path==='ha'){this.openHa();return;}
  const here=this.parts().join('/');
  if(this.count()&&this.scope(path)!==this.scope(here)){this.leaving=path;return;}
  this.show(path);
 }
 private show(path:string){history.pushState(null,'',(this.route?.prefix??'/hestia/energie')+(path?'/'+path:''));window.dispatchEvent(new CustomEvent('location-changed'));window.scrollTo(0,0);}
 private openHa(){history.pushState(null,'',HA_ENERGY);window.dispatchEvent(new CustomEvent('location-changed'));}

 /* ── The draft: one way to save everywhere ── */
 private stored(k:string){return this.settings?.reglages[k];}
 private val<T=unknown>(k:string):T{return (k in this.draft?this.draft[k]:this.stored(k)) as T;}
 private set(k:string,v:unknown){
  const d={...this.draft};
  if(JSON.stringify(v??null)===JSON.stringify(this.stored(k)??null))delete d[k];else d[k]=v;
  this.draft=d;this.saved=false;
 }
 private count(){return Object.keys(this.draft).length;}
 private async save(){
  this.saving=true;
  // Kept at once; the figures that follow a setting (prices, off-peak hours) come with the next reports, read again later.
  const before=this.hub?.mis_a_jour;
  try{await this.hass!.callWS({type:'hestia_energy/set_settings',reglages:this.draft});this.draft={};this.saved=true;this.months=undefined;await this.load();
   void this.untilNewReports(before);}
  catch(e){this.error=(e as {message?:string}).message??'Réglages non enregistrés.';}
  finally{this.saving=false;}
 }
 /** The figures that follow a setting come with the next reports: read again as soon as they are made (every 2 s,
     a minute at most), never after a fixed wait that a slow Home Assistant would miss (audit of 9 Nov. 2026). */
 private async untilNewReports(before?:string){
  for(let i=0;i<30&&this.isConnected;i++){
   await new Promise(r=>setTimeout(r,2000));
   if(!this.isConnected)return;
   await this.load();
   if(this.hub?.mis_a_jour&&this.hub.mis_a_jour!==before){this.months=undefined;return;}
  }
 }
 private tag(k:string,why:string|null|undefined){
  return this.val(k)==null?(why?html`<span class="nk-def">${why}</span>`:nothing):html`<button type="button" class="nk-reset-s" @click=${()=>this.set(k,null)}>Rétablir</button>`;
 }

 render(){
  const h=this.hub;
  if(this.error)return html`<main>${this.head('Énergie',{pill:['todo',this.error]})}</main>`;
  if(!h||!h.pret)return html`<main>${this.head('Énergie',{lead:'Lecture de la page Énergie et de ses statistiques…'})}</main>`;
  const [p,sub]=this.parts();
  const pages:Record<string,()=>TemplateResult>={'':()=>this.overview(h),sources:()=>sub?this.sourcePage(h,sub):this.sourcesPage(h),
   appareils:()=>sub?this.devicePage(h,sub):this.devicesPage(h),reglages:()=>this.settingsPage(h),
   extensions:()=>sub?this.extensionPage(h,sub):this.extensionsPage(h),bilan:()=>this.reviewPage(h),'a-propos':()=>this.aboutPage(h)};
  return html`<main>${(pages[p]??pages[''])()}</main>
   ${saveBar({count:this.count(),busy:this.saving,done:this.saved?'Enregistré':undefined,cancel:()=>{this.draft={};},save:()=>void this.save()})}
   ${this.leaving!==undefined?html`<div class="dlg"><div role="alertdialog" aria-modal="true" aria-label="Quitter sans enregistrer"><h2>Quitter sans enregistrer ?</h2>
    <p>Vos modifications de cette page seront perdues.</p><div class="act"><button @click=${()=>{this.leaving=undefined;}}>Rester</button>
    <button class="primary" @click=${()=>{const to=this.leaving!;this.leaving=undefined;this.draft={};this.show(to);}}>Quitter sans enregistrer</button></div></div></div>`:nothing}`;
 }

 /* ── Common pieces ── */
 private head(title:string,o:{back?:[string,string];pill?:[string,string];lead?:unknown;help?:string;paras?:string[];chips?:unknown}={}){
  return html`${o.back?html`<button class="crumb" @click=${()=>this.go(o.back![0])}>‹ ${o.back[1]}</button>`:nothing}<h1 tabindex="-1">${title}</h1>
   ${o.chips??nothing}
   ${o.pill||o.lead||o.paras?html`<div class="lead">${o.pill?this.pill(o.pill[0],o.pill[1]):nothing}${o.lead??nothing}${o.help?helpTip(title,o.help,''):nothing}${(o.paras??[]).map(t=>html`<p>${t}</p>`)}</div>`:html`<div class="lead"></div>`}`;
 }
 private pill(cls:string,text:string){return html`<span class=${'pill '+cls}>${text}</span>`;}
 private todoRows(list:Todo[],todo:boolean){return list.map(t=>listRow({label:html`<b>${t.titre}</b>`,name:t.titre,sub:t.texte,level:todo?'todo':undefined,go:()=>this.go(t.page)}));}
 private haRow(label:string,sub?:string){return listRow({label,sub,value:nothing,go:()=>this.openHa()});}
 private fixedRow(list:string[]){return list.length?listSection('',[moreRow('Corrigé par Hestia',String(list.length),list.map(t=>listRow({label:t})))]):nothing;}

 /* ── Vue d'ensemble (H2) ── */
 private overview(h:Hub){
  const t=h.a_regler,b=h.a_ameliorer,month=MONTHS[new Date().getMonth()],m=h.mois,last=h.mois_an_dernier;
  const example=h.veille?.euros_par_an!=null?`Par exemple : la nuit, quand tout dort, la maison consomme encore ${num(h.veille.w)} W. Cela fait ${num(h.veille.euros_par_an)} € par an.`
   :m?.euros!=null?`Par exemple : depuis le 1er ${month}, la maison a coûté ${eur(m.euros)}.`:null;
  const lastYear=last?.euros!=null?`${eur(last.euros)} en ${month} ${new Date().getFullYear()-1}`:null;
  return html`${this.head('Énergie',{pill:t.length?['todo',`${t.length} point${t.length>1?'s':''} à régler`]:['ok','Rien à faire'],
    paras:['Énergie lit vos compteurs et vous dit, en euros, ce que coûte la maison, ce qui coûte trop et quand l’électricité est moins chère.',...(example?[example]:[])]})}
   ${t.length?listSection('À régler',this.todoRows(t,true)):nothing}
   ${h.vide?nothing:html`<div class="stats">
    <button class="stat" @click=${()=>this.go('bilan')}><b>${eur(m?.euros)}</b><span>depuis le 1er ${month} ›</span></button>
    <div class="stat"><b>${h.projection!=null?'≈ '+eur(h.projection):'—'}</b><span>prévus pour ${month}</span>${lastYear?html`<small>${lastYear}</small>`:nothing}</div>
    ${h.soleil?html`<div class="stat"><b>${m?.soleil_couvre!=null?m.soleil_couvre+' %':'—'}</b><span>du courant vient du soleil</span></div>`
     :html`<div class="stat"><b>${eur(h.douze_mois?.euros)}</b><span>sur les 12 derniers mois</span></div>`}</div>`}
   ${b.length||h.pistes?.length?listSection('À améliorer',[...(h.pistes??[]).map(p=>listRow({label:html`<b>${p.titre}</b>`,name:p.titre,sub:p.pourquoi,
     value:p.euros_an!=null?html`<span class="money">${num(p.euros_an)} € ${p.unite??'par an'}</span>`:undefined})),...this.todoRows(b,false)],
     {help:'Les conseils « à froid » : changer une habitude ou le contrat. Calculés sur vos 12 derniers mois ; les gestes du moment restent sur la carte.'}):nothing}
   ${h.bilans.length?listSection('Les derniers bilans',h.bilans.map(r=>listRow({label:this.reviewName(r),value:html`<span class="money">${eur(r.euros)}</span>`,sub:r.texte,
     go:r.id==='mois'?()=>this.go('bilan'):undefined})),{more:h.notifie?undefined:html`<button class="linkbtn" @click=${()=>this.go('reglages')}>Les recevoir chaque matin</button>`}):nothing}`;
 }
 private reviewName(r:{id:string;titre:string}){
  if(r.id==='hier'){const d=new Date();d.setDate(d.getDate()-1);return `Hier, ${DAYS[d.getDay()]}`;}
  if(r.id==='semaine')return 'La semaine dernière';
  return r.titre.split(' : ')[0];
 }

 /* ── Sources (H3) ── */
 private sourcesPage(h:Hub){
  const groups=[...new Set(h.sources.map(s=>s.groupe))];
  return html`${this.head('Sources',{lead:'Ce qu’Énergie mesure, et d’où ça vient',help:'Une seule vérité par mesure : Enedis pour la facture, le compteur le plus frais pour le direct. Les compteurs se choisissent dans la page Énergie de Home Assistant ; Hestia les lit.'})}
   ${groups.map(g=>listSection(g,h.sources.filter(s=>s.groupe===g).map(s=>listRow({label:s.nom,sub:s.sous??s.usage,level:s.etat==='todo'?'todo':undefined,
    value:this.pill(s.etat,s.etat==='todo'?'À régler':'Suivie'),go:()=>this.go('sources/'+s.id)}))))}
   ${h.sources.length<=2?listSection('',[this.haRow('Ajouter une source','Panneaux, eau, poêle : dans la page Énergie de Home Assistant.')]):nothing}`;
 }
 private sourcePage(h:Hub,id:string){
  const s=h.sources.find(x=>x.id===id);
  if(!s)return this.sourcesPage(h);
  const fuel=this.val<string|null>('stove_fuel');
  const bag=this.val<number|null>('bag_price'),exp=this.val<number|null>('export_price')??this.settings?.trouve.export_price.valeur;
  return html`${this.head(s.nom,{back:['sources','Sources'],chips:html`<div class="chips">${s.chiffres.map(c=>html`<span class=${'m'+(c.benefice?' ben':'')}>${c.texte}</span>`)}${this.pill(s.etat,s.etat==='todo'?'À régler':'Suivie')}</div>`})}
   ${s.id==='poele'&&s.gaz_declare?listSection('Ce que brûle le poêle',[listRow({label:'Le poêle brûle',control:true,sub:fuel?undefined:'La page Énergie le déclare en gaz : dites-le une fois, Hestia s’en souviendra.',
     value:segmented('Le poêle brûle',[['pellets','Des granulés'],['gas','Du gaz']],(fuel??undefined) as 'pellets'|'gas'|undefined,v=>this.set('stove_fuel',v))})]):nothing}
   ${listSection('D’où ça vient',[...s.origine.map(o=>listRow({label:o.nom,value:o.role,sub:html`${o.texte?html`${o.texte}<br>`:nothing}${o.par?html`Mesuré par ${o.par}<br>`:nothing}<span class="eid">${o.entite}</span>`})),
    this.haRow('Changer dans la page Énergie de Home Assistant')])}
   ${s.enedis?.length?listSection('Comparé à Enedis',s.enedis.map(e=>listRow({label:e.titre,sub:e.texte})))
    :s.suit_enedis?listSection('Comparé à Enedis',[listRow({label:'Vos euros suivent Enedis, jour par jour.'})]):nothing}
   ${s.id==='poele'?listSection('',[listRow({label:'Prix du sac de granulés',value:bag!=null?eur(bag):'—',sub:this.settings?.trouve.sac_kg?`Sac de ${num(this.settings.trouve.sac_kg)} kg.`:undefined,go:()=>this.go('reglages')})]):nothing}
   ${s.id==='revente'&&exp!=null?listSection('',[listRow({label:'Prix de revente',value:num(exp,4)+' € le kWh',go:()=>this.go('reglages')})]):nothing}
   ${this.fixedRow(s.corrige)}`;
 }

 /* ── Appareils (H4, H5) ── */
 private group(d:Device){return (this.val<Record<string,string>>('groups')??{})[d.stat]??d.groupe_devine;}
 private devState(d:Device){if(d.a_regler)return this.pill('todo','À régler');if(d.w!=null)return this.pill('run',num(d.w/1000,d.w<1000?2:1)+' kW');return nothing;}
 private devicesPage(h:Hub){
  const list=h.appareils.liste;
  if(!list.length)return html`${this.head('Appareils',{lead:'Aucun appareil mesuré'})}
   ${listSection('',[this.haRow('Mesurer un premier appareil','Une prise mesurée sur le frigo ou le chauffe-eau, ajoutée dans la page Énergie de Home Assistant.')])}`;
  const month=monthOf(h.appareils.mois),names=Object.fromEntries(h.groupes);
  const top=list.filter(d=>!d.dans);
  const total=(g:string)=>top.filter(d=>this.group(d)===g).reduce((a,d)=>a+(d.euros??0),0);
  const groups=h.groupes.map(([k])=>k).filter(g=>list.some(d=>this.group(d)===g)).sort((a,b)=>total(b)-total(a));
  const todo=h.a_regler.filter(t=>t.page==='appareils');
  return html`${this.head('Appareils',{lead:`${list.length} appareil${list.length>1?'s':''} mesuré${list.length>1?'s':''}${h.appareils.part!=null?` · ${h.appareils.part} % de la maison en ${month}`:''}`,
    help:`Le reste, c’est ce qui n’est pas mesuré : éclairage, box, petits appareils. Les euros sont ceux de ${month}, au prix moyen payé ce mois-là, soleil compris.`})}
   ${listSection('',[this.haRow('Ajouter un appareil','Énergie suit les appareils déclarés dans la page Énergie de Home Assistant.')])}
   ${todo.length?listSection('À régler',this.todoRows(todo,true)):nothing}
   ${groups.map(g=>{const ds=list.filter(d=>this.group(d)===g).sort((a,b)=>(b.euros??-1)-(a.euros??-1)),off=ds.filter(d=>d.kwh===0).length;
    return listSection(names[g],ds.map(d=>listRow({label:html`${d.nom}${d.sans_nom?html` <span class="pill plain">sans nom</span>`:nothing}`,name:d.nom,level:d.a_regler?'todo':undefined,
     sub:d.a_regler??(d.kwh?`${eur(d.euros)} en ${month}`:undefined),value:this.devState(d),go:()=>this.go('appareils/'+d.id)})),
     {more:off?html`<span class="nk-def">${off>1?off+' éteints':'1 éteint'} en ${month}</span>`:undefined});})}`;
 }
 private devicePage(h:Hub,id:string){
  const d=h.appareils.liste.find(x=>x.id===id);
  if(!d)return this.devicesPage(h);
  const month=monthOf(h.appareils.mois),groups=this.val<Record<string,string>>('groups')??{};
  const setGroup=(g:string)=>{const next={...groups};if(g===d.groupe_devine)delete next[d.stat];else next[d.stat]=g;this.set('groups',next);};
  return html`${this.head(d.nom,{back:['appareils','Appareils'],chips:html`<div class="chips">${d.kwh?html`<span class="m">${eur(d.euros)}<small>en ${month}</small></span><span class="m">${kwh(d.kwh)}</span>`:nothing}${d.w!=null||d.a_regler?this.devState(d):this.pill('plain','Arrêté')}</div>`})}
   ${d.a_regler?listSection('À régler',[listRow({label:html`<b>${d.a_regler}</b>`,sub:d.a_regler_detail??undefined,level:'todo'})]):nothing}
   ${d.sans_nom?listSection('À améliorer',[listRow({label:html`<b>Lui donner un nom</b>`,sub:'Dans Home Assistant, le nom de l’entité. Ici, il apparaîtra tel quel.'})]):nothing}
   ${listSection('Son usage',[
    listRow({label:'Usage',control:true,sub:d.stat in groups?'Choisi par vous.':`Deviné d’après son nom, « ${d.nom} ».`,
     value:html`<select aria-label="Usage" @change=${(e:Event)=>setGroup((e.target as HTMLSelectElement).value)}>
      ${h.groupes.map(([k,n])=>html`<option value=${k} ?selected=${this.group(d)===k}>${n}</option>`)}</select>
      ${d.stat in groups?html`<button type="button" class="nk-reset-s" @click=${()=>setGroup(d.groupe_devine)}>Rétablir</button>`:nothing}`}),
    listRow({label:'Pièce',value:d.piece??'Aucune',sub:'Lue dans Home Assistant. Elle ne change pas l’usage.'}),
   ],{help:'L’usage range vos appareils selon ce à quoi ils servent : chauffage, eau chaude, cuisine et linge, le reste. C’est ainsi qu’ils sont groupés dans la page Appareils. Hestia le devine d’après le nom de l’appareil, pas d’après sa pièce. S’il se trompe, choisissez le bon.'})}
   ${listSection('D’où viennent ses chiffres',[
    listRow({label:'Mesuré par',value:d.mesure_par??d.integration??'—',sub:d.mesure_par&&d.integration?`Intégration ${d.integration}.`:undefined}),
    listRow({label:'Sa consommation',value:'en kWh, chaque heure',sub:html`${d.nom_compteur}<br><span class="eid">${d.stat}</span>`}),
    listRow({label:'Sa puissance en direct',value:d.puissance?(d.w_direct!=null?`${num(d.w_direct)} W`:'—'):'Aucune',
     sub:d.puissance?html`${d.nom_puissance??''}<br><span class="eid">${d.puissance}</span>`:'Sans elle, Hestia ne voit pas quand il tourne.'}),
    this.haRow('Changer dans la page Énergie de Home Assistant','Énergie suit les appareils de « Consommation individuelle ».')])}
   ${this.fixedRow(d.corrige)}`;
 }

 /* ── Réglages (H7) ── */
 private settingsPage(h:Hub){
  const s=this.settings;
  if(!s)return html`${this.head('Réglages',{lead:'Lecture…'})}`;
  const f=s.trouve,a=f.a,opt=this.val<string|null>('option')??f.option.valeur??'base',kva=this.val<number|null>('kva')??f.kva.valeur??6;
  const offer=this.val<string|null>('offer')??f.offer.valeur??'bleu',bleu=f.tarif_bleu,page=f.prix_page;
  const hc=parseHc(this.val('offpeak'))??f.offpeak.valeur;
  const setHc=(l:[string,string][])=>this.set('offpeak',hcText(l));
  const time=(i:number,j:0|1,v:string)=>html`<input type="time" aria-label=${j?'Fin':'Début'} .value=${v} @change=${(e:Event)=>{const l=(hc??[['','']]).map(r=>[...r] as [string,string]);l[i][j]=(e.target as HTMLInputElement).value;setHc(l);}}>`;
  const priceIn=(k:string,ph:number|null|undefined,label:string)=>listRow({label,control:true,value:html`<input type="number" step="0.0001" min="0" aria-label=${label} placeholder=${ph!=null?num(ph,4):''}
   .value=${this.val(k)!=null?String(this.val(k)):''} @change=${(e:Event)=>{const v=(e.target as HTMLInputElement).value;this.set(k,v===''?null:Number(v));}}><span class="nk-unit">€ le kWh</span>`});
  const numIn=(k:string,unit:string,step:number,found:number|null|undefined,why:string|null|undefined,label:string)=>html`<input type="number" step=${step} min="0" aria-label=${label}
   .value=${String(this.val<number|null>(k)??found??'')} @change=${(e:Event)=>{const v=(e.target as HTMLInputElement).value;this.set(k,v===''?null:Number(v));}}><span class="nk-unit">${unit}</span>${this.tag(k,why)}`;
  const margin=Math.round((this.val<number>('margin')??0.1)*100);
  const service=this.val<string|null>('notify_service'),hour=this.val<number>('notify_hour')??8;
  const sw=(k:string,label:string)=>toggle(label,this.val<boolean>(k)!==false,on=>this.set(k,on));
  const bleuText=opt==='hphc'&&bleu.hp!=null?`Heures pleines ${num(bleu.hp,4)} € · heures creuses ${num(bleu.hc??0,4)} €. Hestia suit chaque hausse ou baisse.`
   :opt==='base'&&bleu.base!=null?`${num(bleu.base,4)} € le kWh. Hestia suit chaque hausse ou baisse.`:opt==='tempo'?'Six prix selon la couleur du jour. Hestia suit chaque hausse ou baisse.':'Hestia suit chaque hausse ou baisse.';
  return html`${this.head('Réglages',{lead:'Ce qui dépend de votre maison. Laissé tel quel, Hestia prend ce qu’elle a trouvé.'})}
   ${listSection('Votre contrat',[
    listRow({label:'Option',control:true,value:html`${segmented('Option',[['base','Base'],['hphc','Heures creuses'],['tempo','Tempo']],opt as 'base'|'hphc'|'tempo',v=>this.set('option',v===f.option.valeur?null:v))}${this.tag('option',f.option.source)}`}),
    ...(opt!=='hphc'?[]:[
     listRow({label:'Heures creuses',control:true,sub:!hc?html`<b style="color:var(--nk-todo)">Un seul compteur : indiquez-les, elles sont sur votre facture.</b>`:this.val('offpeak')==null&&f.offpeak.valeur?'Votre facture dit quelques minutes de plus ou de moins ? Corrigez ici.':undefined,
      value:html`<span class="hc">${(hc??[['','']]).map(([x,y],i)=>html`<span>${time(i,0,x)}<span class="nk-unit">à</span>${time(i,1,y)}${(hc??[]).length>1?html`<button type="button" class="nk-reset-s" @click=${()=>{const l=[...hc!];l.splice(i,1);setHc(l);}}>Retirer</button>`:nothing}</span>`)}</span>${hc?this.tag('offpeak',f.offpeak.source):nothing}`}),
     listRow({label:'Ajouter une plage',go:()=>setHc([...(hc??[]),['12:00','14:00']])})]),
    listRow({label:'Puissance souscrite',control:true,sub:'Sur votre facture : « puissance souscrite ».',value:html`<select aria-label="Puissance souscrite" @change=${(e:Event)=>{const v=Number((e.target as HTMLSelectElement).value);this.set('kva',v===f.kva.valeur?null:v);}}>
      ${[3,6,9,12,15,18,24,30,36].map(v=>html`<option value=${v} ?selected=${kva===v}>${v} kVA</option>`)}</select>${this.tag('kva',f.kva.source)}`}),
    listRow({label:'Prix du kWh',control:true,sub:offer==='autre'?'Les prix de votre facture.':bleuText,
     value:html`${segmented('Prix du kWh',[['bleu','Tarif Bleu d’EDF'],['autre','Une autre offre']],offer as 'bleu'|'autre',v=>this.set('offer',v))}`}),
    ...(offer!=='autre'?[]:opt==='base'?[priceIn('price_base',page.base??bleu.base,'Prix du kWh')]:opt==='hphc'?[priceIn('price_hp',page.hp??bleu.hp,'Heures pleines'),priceIn('price_hc',page.hc??bleu.hc,'Heures creuses')]:[]),
    offer==='autre'?listRow({label:'Abonnement',control:true,value:html`<input type="number" step="0.01" min="0" aria-label="Abonnement" placeholder=${bleu.abonnement!=null?num(bleu.abonnement,2):''}
      .value=${this.val('subscription')!=null?String(this.val('subscription')):''} @change=${(e:Event)=>{const v=(e.target as HTMLInputElement).value;this.set('subscription',v===''?null:Number(v));}}><span class="nk-unit">€ par an</span>`})
     :listRow({label:'Abonnement',value:bleu.abonnement!=null?num(bleu.abonnement,2)+' € par an':'—',sub:`Tarif Bleu, ${kva} kVA.`}),
   ],{help:'Lu sur le compteur et dans la page Énergie. Changez seulement ce qui est faux : le reste suit tout seul.'})}
   ${a.revente?listSection('Revente du surplus',[listRow({label:'Prix de revente',control:true,value:numIn('export_price','€ le kWh',0.0001,f.export_price.valeur,f.export_price.source,'Prix de revente')})]):nothing}
   ${a.delestage?listSection('Délestage',[listRow({label:'Garder une marge de',control:true,sub:`Versatile Thermostat coupe un radiateur au-dessus de ${num(kva*(1-margin/100),1)} kW, avant que le compteur ne disjoncte.`,
     value:html`<select aria-label="Marge" @change=${(e:Event)=>this.set('margin',Number((e.target as HTMLSelectElement).value)/100)}>${[5,10,15,20,25,30].map(v=>html`<option value=${v} ?selected=${margin===v}>${v} %</option>`)}</select>
     ${margin===10?html`<span class="nk-def">par défaut</span>`:html`<button type="button" class="nk-reset-s" @click=${()=>this.set('margin',0.1)}>Rétablir</button>`}`})],
     {help:'Énergie donne à Versatile Thermostat la puissance de la maison et la limite à ne pas dépasser. C’est lui qui coupe et rallume.'}):nothing}
   ${a.poele?listSection('Le poêle',[listRow({label:'Prix du sac de granulés',control:true,sub:'Les achats saisis dans Suivi Stock Pellet passent avant.',
     value:html`<input type="number" step="0.01" min="0" aria-label="Prix du sac" placeholder="—" .value=${this.val('bag_price')!=null?String(this.val('bag_price')):''} @change=${(e:Event)=>{const v=(e.target as HTMLInputElement).value;this.set('bag_price',v===''?null:Number(v));}}><span class="nk-unit">€ le sac${f.sac_kg?` de ${num(f.sac_kg)} kg`:''}</span>`})]):nothing}
   ${a.eau?listSection('L’eau',[listRow({label:'Prix du mètre cube',control:true,value:numIn('water_price','€ le m³',0.01,f.water_price.valeur,f.water_price.source,'Prix du mètre cube')})]):nothing}
   ${listSection('Notifications',[
    listRow({label:'Envoyer à',control:true,sub:service?undefined:'Les bilans restent dans les cartes et ici.',value:html`<select aria-label="Envoyer à" @change=${(e:Event)=>{const v=(e.target as HTMLSelectElement).value;this.set('notify_service',v||null);}}>
      <option value="" ?selected=${!service}>Personne</option>${f.notify.map(n=>html`<option value=${n.id} ?selected=${service===n.id}>${n.nom}</option>`)}</select>${service?nothing:html`<span class="nk-def">par défaut</span>`}`}),
    ...(service?[
     listRow({label:'Les bilans, à',control:true,value:html`<select aria-label="Heure" @change=${(e:Event)=>this.set('notify_hour',Number((e.target as HTMLSelectElement).value))}>${Array.from({length:24},(_,i)=>html`<option value=${i} ?selected=${hour===i}>${i} h</option>`)}</select>${hour===8?html`<span class="nk-def">par défaut</span>`:nothing}`}),
     listRow({label:'Hier',control:true,value:html`<span class="nk-unit">chaque matin</span>${sw('notify_day','Hier')}`}),
     listRow({label:'La semaine',control:true,value:html`<span class="nk-unit">le lundi</span>${sw('notify_week','La semaine')}`}),
     listRow({label:'Le mois',control:true,value:html`<span class="nk-unit">le 1er</span>${sw('notify_month','Le mois')}`}),
     ...(a.eau?[listRow({label:'Une fuite d’eau',control:true,value:html`<span class="nk-unit">tout de suite</span>${sw('notify_leak','Une fuite d’eau')}`})]:[]),
     ...(h.appareils.liste.length?[listRow({label:'Un appareil oublié',control:true,sub:'Un appareil qui tourne deux fois plus longtemps que d’habitude.',value:html`<span class="nk-unit">tout de suite</span>${sw('notify_forgot','Un appareil oublié')}`})]:[]),
    ]:[]),
   ])}`;
 }

 /* ── Extensions (H8) ── */
 private used(e:Ext){const x=(this.val<Record<string,boolean>>('extensions')??{})[e.id];return x===undefined?true:x;}
 private setUsed(e:Ext,on:boolean){const next={...(this.val<Record<string,boolean>>('extensions')??{})};if(on)delete next[e.id];else next[e.id]=false;this.set('extensions',next);}
 private extensionsPage(h:Hub){
  const groups=[...new Set(h.extensions.map(e=>e.groupe))];
  return html`${this.head('Extensions',{lead:'Les autres briques Hestia-FB et les intégrations qu’Énergie lit'})}
   ${groups.map(g=>listSection(g,h.extensions.filter(e=>e.groupe===g).map(e=>listRow({label:e.nom,name:e.nom,control:true,
    sub:!e.installee?'Pas installée':!this.used(e)?'Pas utilisée':e.probleme?e.probleme.titre:e.usage,level:e.installee&&this.used(e)&&e.probleme?'todo':undefined,
    value:e.installee?toggle('Utiliser '+e.nom,this.used(e),on=>this.setUsed(e,on)):nothing,go:()=>this.go('extensions/'+e.id)}))))}`;
 }
 private extensionPage(h:Hub,id:string){
  const e=h.extensions.find(x=>x.id===id);
  if(!e)return this.extensionsPage(h);
  const on=this.used(e),link=e.lien??'/hacs/dashboard';
  return html`${this.head(e.nom,{back:['extensions','Extensions'],lead:e.usage})}
   ${listSection('',[e.installee?listRow({label:'Utiliser dans Énergie',control:true,sub:on?undefined:'Énergie l’ignore, sans rien désinstaller.',value:toggle('Utiliser dans Énergie',on,x=>this.setUsed(e,x))})
    :listRow({label:'Pas installée dans Home Assistant',value:html`<a class="ext-act" href=${link} target=${e.lien?'_blank':'_self'} rel="noreferrer">${e.id==='tic'?'Voir les modules':e.lien?'Voir le projet':'Ouvrir HACS'}</a>`})])}
   ${e.installee&&on&&e.probleme?listSection('À régler',[listRow({label:html`<b>${e.probleme.titre}</b>`,sub:e.probleme.texte,level:'todo'})]):nothing}
   ${e.installee&&on&&(e.lieux?.length??0)>1?listSection('Le lieu',[listRow({label:'La maison est',control:true,
     sub:this.val<string|null>('weather_place')?'Choisi par vous.':'Pris en attendant votre choix : le premier lieu de Hestia Météo.',
     value:html`<select aria-label="Lieu de Hestia Météo" @change=${(ev:Event)=>this.set('weather_place',(ev.target as HTMLSelectElement).value)}>
      ${e.lieux!.map(p=>html`<option value=${p.id} ?selected=${e.lieu===p.id}>${p.nom}</option>`)}</select>`})],
     {help:'Le froid de chaque jour vient de ce lieu de Hestia Météo. Choisissez celui de la maison chauffée.'}):nothing}
   ${listSection('Ce qu’elle change',[
    ...(e.installee&&e.ou.length?[listRow({label:html`<b>Avec elle</b>`,sub:`Elle sert à : ${e.ou.join(', ')}.`})]:[]),
    listRow({label:html`<b>Sans elle</b>`,sub:e.sans})])}`;
 }

 /* ── Bilan (H9) ── */
 private reviewPage(h:Hub){
  const ms=this.months;
  if(!ms||!ms.length)return html`${this.head('Bilan',{lead:'Calcul des 12 derniers mois…'})}`;
  const known=ms.filter(p=>p.euros!=null),total=known.reduce((a,p)=>a+(p.euros??0),0),max=Math.max(1,...known.map(p=>p.euros??0));
  const resale=ms.reduce((a,p)=>a+(p.revendu_euros??0),0),label=(p:Period)=>{const d=new Date(p.debut);return `${cap(MONTHS[d.getMonth()])} ${d.getFullYear()}`;};
  const first=label(ms[0]).toLowerCase(),last=label(ms[ms.length-1]).toLowerCase(),month=MONTHS[new Date().getMonth()];
  const heat=h.chauffage,stove=heat?.poele?.saison,water=h.eau,sun=h.douze_mois?.soleil_couvre;
  const heatRows=[...(heat?.etat==='pret'&&heat.mois?[listRow({label:`Électricité due au froid, depuis le 1er ${month}`,value:eur(heat.mois.eur),sub:`${kwh(heat.mois.kwh)}, estimés d’après le froid de chaque jour.`})]:[]),
   ...(stove?[listRow({label:'Poêle, depuis la rentrée',value:eur(stove.eur),sub:`${num(stove.kg)} kg de granulés.`})]:[])];
  return html`${this.head('Bilan',{lead:'Les 12 derniers mois, abonnement compris',help:'Calculés avec les chiffres d’Enedis, qui font foi, et le prix de chaque jour. Un jour sans prix connu n’est jamais compté gratuit.'})}
   ${listSection('',[listRow({label:html`<span class="big">${num(total,0)} €</span>`,sub:`De ${first} à ${last}.${h.soleil&&sun!=null?` Le soleil a fourni ${sun} % de la maison.`:''}${known.length<ms.length?` ${ms.length-known.length} mois sans prix connu.`:''}`,
    value:h.soleil&&resale>0?this.pill('benefit',`${num(resale,0)} € de revente`):undefined})])}
   ${listSection('Mois par mois',ms.slice().reverse().map(p=>listRow({label:label(p),sub:h.soleil&&p.soleil_couvre!=null?`Le soleil a couvert ${p.soleil_couvre} %`:undefined,
    value:p.euros==null?'—':html`<span class="mbar"><i style=${`width:${Math.round(p.euros/max*100)}%`}></i></span><span class="money">${num(p.euros,0)} €</span>`})))}
   ${heatRows.length?listSection('Le chauffage',heatRows,{help:'Le chauffage de chaque jour est comparé au froid qu’il a fait, grâce à Hestia Météo : un hiver doux ne passe pas pour une économie.'}):nothing}
   ${water?listSection('L’eau',[listRow({label:`Depuis le 1er ${month}`,value:eur(water.mois_euros),sub:`${num(water.mois_l)} litres.`})]):nothing}`;
 }

 /* ── À propos (H10) ── */
 private aboutPage(h:Hub){
  const entities=Object.keys(this.hass?.states??{}).filter(e=>/^(binary_)?sensor\.hestia_energy_/.test(e)).sort();
  const td=h.tarifs?new Date(h.tarifs+'T12:00'):null,tariffs=td?`${td.getDate()===1?'1er':td.getDate()} ${MONTHS[td.getMonth()]} ${td.getFullYear()}`:'—';
  return html`${aboutPage({name:'Hestia Énergie',versions:[['Hestia Énergie',VERSION],['Socle commun',SOCLE.join('.')],['Tarifs embarqués',html`${tariffs}<br><small class="nk-def">Données ouvertes de la CRE.</small>`]],
    repository:REPO,card:'Tableau de bord → Ajouter une carte → Hestia Énergie'})}
   ${entities.length?listSection('',[moreRow('Entités publiées',String(entities.length),entities.map(e=>{const st=this.hass!.states[e],u=st.attributes.unit_of_measurement;
    return listRow({label:html`<span class="eid">${e}</span>`,value:`${st.state}${u&&!['unknown','unavailable'].includes(st.state)?' '+u:''}`});}))]):nothing}`;
 }
}

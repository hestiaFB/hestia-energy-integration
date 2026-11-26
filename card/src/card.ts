import {LitElement,html,svg,nothing,unsafeCSS,type TemplateResult} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import charte from './ui/hestia-charte.css';
import energy from './energy.css';
import './editor';
import {follow,type Connection} from './stream';

/* Hestia Énergie's card, after the cards' mock-up 2 (docs/maquette-cartes-2.html, validated by Frank on 8 Nov. 2026):
   1 · the tile: « Énergie · en ce moment », one sentence, one figure (card: tuile)
   2 · the full card: the 24-hour clock with the banner (maquette « Bandeaux de la carte complète », B, chosen by Frank on
       19 Nov. 2026), then one period per section (En ce moment · Aujourd'hui · Ce mois-ci), then « En détail »
       (card: complete, by default)
   3 · the detail cards, over the page from « En détail » or alone (card: soleil | chauffage | veille | eau | appareils |
       pointe | contrat): the answer header (SUBJECT · period / the answer with its figure in bold / why), one period
       per card, then the panels (a title in plain words, a sentence with a figure, a drawing).
   Every figure comes from the integration (hestia_energy/view): the card only puts it into words. */

type Hass={callWS:<T>(msg:Record<string,unknown>)=>Promise<T>;states:Record<string,{last_updated:string}>;connection:Connection};
type Banner={id:string;couleur:string;pastille:string;titre:string;pourquoi:string};
type Period={euros:number|null;euros_energie:number|null;kwh_achetes:number;soleil_kwh:number|null;revendu_kwh:number|null;revendu_euros:number|null;soleil_couvre:number|null;soleil_garde:number|null;heures_inconnues:number;debut:string};
type Hour={h:number;achat:number|null;soleil:number|null;revente:number|null};
type Running={nom:string;type:string;w:number};
/** The home battery now (1.0.1b3): what it gives or takes (W), its charge, and at this pace until when it lasts or when it is full. */
type Battery={decharge_w:number|null;charge_w:number|null;pourcent:number|null;capacite_kwh:number|null;reste_kwh:number|null;jusqu_a:string|null;pleine_a:string|null};
type Direct={achat_w:number|null;revente_w:number|null;soleil_w:number|null;maison_w:number|null;batterie?:Battery|null;periode:string|null;prix:number|null;couleur?:string|null;couleur_demain?:string|null;
 prochain_changement:{a:string;periode:string}|null;en_marche:Running[];bandeau:Banner;fuite:{minutes:number|null;debit:number};
 chauffage?:{pieces:{nom:string;w:number|null}[];w:number|null;euros_de_l_heure:number|null;sans_puissance:string[];poele:boolean}|null};
type Heat={kwh:number;eur:number|null;jours:number};
type Stove={mois:{kg:number;eur:number|null}|null;saison:{kg:number;eur:number|null};prix_kg:number|null;sac_kg:number|null;stock_kg?:number|null;jours_restants?:number|null};
type View={pret:boolean;palier:number;equipement:{direct?:boolean;soleil?:boolean;appareils?:boolean};direct?:Direct;
 jour?:Period;hier?:Period;mois?:Period;mois_an_dernier?:Period;projection:number|null;
 jusqu_ici?:{euros:number|null;kwh:number;hier_euros:number|null;hier_kwh:number;jusqu_a:string}|null;
 dernier_jour?:(Period&{jour:string})|null;
 pistes?:Piste[];
 veille:{w:number;euros_par_an:number|null;nuits:number;
  nuit?:{appareils:{nom:string;w:number;euros_par_an:number|null}[];mesure_w:number;sans_prise_w:number|null;sans_prise_euros_par_an:number|null}|null;
  evolution?:{debut_w:number;debut:string;ecart_w:number;ecart_euros_par_an:number|null}|null}|null;
 veille_historique:{jour:string;w:number}[];
 heures_creuses:[string,string][]|null;
 contrat:{option:string;kva:number;prix:Record<string,number>;revente:number|null;prix_hp?:number|null;prix_hc?:number|null;prix_base?:number|null;
  abonnement_mois?:number|null;part_hc?:number|null;base_euros?:number|null;seuil_hc?:number|null;a_confirmer?:string[]};
 heures:{aujourdhui:Hour[];hier:Hour[]};
 eau:{jour_l:number;mois_l:number;mois_euros:number|null;prix_m3:number|null;jours?:{jour:string;l:number|null}[];
  plus_gros?:{jour:string;l:number;euros:number|null}|null;l_par_jour?:number|null;euros_100_l?:number|null}|null;
 panneaux?:{hier:{nom:string;kwh:number}[];en_retrait:{nom:string;pourcent_de_moins:number}[];onduleur_muet_min:number|null}|null;
 soleil_jour?:{plus_fort:{h:number;kwh:number}|null;prix_evite:number|null;groupes:{nom:string;kwh:number}[]};
 appareils_jour?:{appareils:{nom:string;kwh:number;euros:number|null}[];mesure_kwh:number;maison_kwh:number;sans_prise_kwh:number|null;prix_moyen:number|null}|null;
 pointe?:{h:number;kw:number;part:number|null}|null;
 chauffage?:{etat:string;mois?:Heat|null;saison?:(Heat&{du:string})|null;euros_par_degre?:number|null;poele?:Stove|null};
 usage?:Usage|null;chauffe_eau?:Heater|null;cout_chauffage?:HeatCost|null};
/** The heating's cost as Hestia Heating counts it (1.0.1b1, « un seul coût »): shown as it is, in place of Énergie's estimate. */
type HeatDay={jour:string;electrique_kwh:number|null;electrique_eur:number|null;granules_kg:number|null;granules_eur:number|null;chauffage_eur:number|null;gagne_eur:number|null;prix:string|null};
type HeatCost={aujourdhui:HeatDay;hier:HeatDay|null;mois:Omit<HeatDay,'jour'|'prix'>&{jours:number;du:string};par:string};
/** The water heater driven by Hestia (1.0.1b1, docs/chauffe-eau.md): its plan, its reserve, its mode. `courbe`: each
    half hour from now, [start, reserve %, sun to spare forecast kW, price, off-peak 1/0, the heating's source or null]. */
type Run={debut:string;fin:string;source:string;kwh:number;euros:number};
type Heater={mode:string;simulation:boolean;chauffer:boolean;raison:string;phrase:string;jusqu_a:string|null;prochaine_chauffe:string|null;
 reserve:number|null;reserve_kwh:number|null;capacite_kwh:number;puissance_kw:number;besoin_kwh:number;plan:Run[];kwh_prevus:number|null;cout_prevu:number|null;
 manque_a:string|null;courbe:[string,number,number,number|null,number,string|null][];soleil_prevu:string|null;plein_le:string|null;heures:number[];plages?:[number,number][];reserve_min:number;
 bilan:{jour:string;reel_kwh:number;reel_eur:number;hestia_kwh:number;hestia_eur:number;hc_eur:number;prix_inconnu:boolean}[];
 manque:string[];prise:string|null;prise_etat:string|null;suit:boolean|null};
/** « Votre contrat, bien utilisé » (engine/habits.py): the last 12 months. */
type Device={nom:string;type:string;kwh:number;soleil:number;nuit:number;pleines:number;pleines_kwh:number;euros_an:number};
type Usage={jours:number;part_hc:number;seuil_hc:number|null;part_hc_chauffe_eau:number|null;base_de_plus:number|null;
 prix:{soleil:number|null;hc:number;hp:number};appareils:Device[];euros_an:number;soleil_mois:{mois:string;jours:number;sur:number}[];
 puissance?:{kva:number;jours:number;pointe_w:number;plus_bas:{kva:number;jours_au_dessus:number;euros_an:number|null}}|null};
type Config={type:string;card?:string;name?:string};

const RUBRICS=['soleil','chauffage','veille','eau','appareils','pointe','contrat','chauffe_eau'] as const;
/** Advice « à froid » (maquette des cartes 3): a gesture, why, and the euros at stake a year or a winter. */
type Piste={id:string;titre:string;pourquoi:string;euros_an:number|null;unite:string|null;rubrique:string|null;
 nom?:string;maintenant?:string;mieux?:string;gain?:number;sous?:string;profil?:[number,number,number][];mieux_heures?:[number,number,string][];zones?:[number,number,string][];departs?:[number,number][];jours?:number;lancer?:number|null};
/** What a coloured block of a strip means, said under it. */
/** The strip's segments: the day's prices (hc, hp, soleil), their colour, pictogram and word. */
const ZONE:Record<string,[string,string|null,string]>={hc:['--nw-cold','moon','creuses'],hp:['--nw-peak',null,'pleines'],soleil:['--nw-sun','sun','soleil']};
/** The device a strip speaks of, by its name: its pictogram on the pins. */
const deviceIcon=(p:Piste)=>p.id==='chauffe_eau_heures'?'heater':/vaisselle/i.test(p.nom??'')?'dish':/s[eè]che/i.test(p.nom??'')?'dryer':/linge|laver/i.test(p.nom??'')?'washer':'plug';
/** « 0 h 30 », « 19 h » from minutes after midnight, with no break inside. */
const hm=(m:number)=>{const h=Math.floor(m/60)%24,mm=m%60;return mm?`${h}\u00a0h\u00a0${String(mm).padStart(2,'0')}`:`${h}\u00a0h`;};
const PISTE_LOOK:Record<string,[string,string]>={veille_haute:['moon','--nw-watch'],chauffage_degre:['flame','--nw-heat'],contrat_base:['doc','--nw-benefit'],
 jour_inhabituel:['home','--nw-home'],budget_mois:['doc','--nw-home'],chauffe_eau_heures:['drop','--nw-cold'],machine_heures:['clock','--nw-home']};
type Rubric=typeof RUBRICS[number];

/* Icons of the mock-up, drawn at the stroke (constants: never built from data). */
const I:Record<string,string>={
 sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/></svg>',
 grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M8 21 11 3h2l3 18"/><path d="M5 7h14M6.5 12h11M9.5 16.5l5-4.5M14.5 16.5l-5-4.5"/></svg>',
 battery:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="7" y="4.5" width="10" height="16.5" rx="2.2"/><path d="M10 2.5h4M10 15h4M10 11h4"/></svg>',
 bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/></svg>',
 drop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3s6.5 7 6.5 11.2A6.5 6.5 0 0 1 5.5 14.2C5.5 10 12 3 12 3z"/></svg>',
 clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
 moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>',
 plug:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0z"/><path d="M12 17v4"/></svg>',
 doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14 3v5h5M9 12.5h7M9 16.5h7"/></svg>',
 flame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21.5a6.5 6.5 0 0 0 6.5-6.5c0-4.5-4-6.5-4.5-11-2.5 2-4 4.5-4 7-1-.5-2-1.8-2.2-3C6.5 9.8 5.5 12.3 5.5 15a6.5 6.5 0 0 0 6.5 6.5z"/></svg>',
 washer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="3" width="15" height="18" rx="2.5"/><circle cx="12" cy="13.5" r="4.3"/><path d="M8 6.5h1.5M13 6.5h3"/></svg>',
 dryer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="3" width="15" height="18" rx="2.5"/><circle cx="12" cy="13.5" r="4.3"/><path d="M8 6.5h1.5M10 13.8c.7-.8 1.3-.8 2 0s1.3.8 2 0"/></svg>',
 dish:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M4.5 8h15M8 5.5h1.5"/><path d="M8.5 17.5a3.5 3.5 0 0 1 7 0M12 14v-1.5"/></svg>',
 heater:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="2.5" width="11" height="16" rx="5.5"/><path d="M9.5 18.5v3M14.5 18.5v3M12 7.5c-1.4 1.8-2 2.8-2 3.8a2 2 0 0 0 4 0c0-1-.6-2-2-3.8z"/></svg>',
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
 chev:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
};
const icon=(k:string)=>unsafeHTML(I[k]??I.bolt);

/* Numbers in the family's words (PHRASES.md rule 7, C10): kW and kWh to 0.1, € to the cent under 10 €, to the euro
   above and for a yearly amount (to ten euros from 100 €: « environ 330 € par an »). */
// Grouped by hand: French leaves 4-digit numbers ungrouped (« 1749 ») and not every browser knows useGrouping « always »;
// the family reads « 1 749 ».
const num=(v:number,d=1)=>{const t=v.toLocaleString('fr-FR',{maximumFractionDigits:d,minimumFractionDigits:0,useGrouping:false});
 const [i,f]=t.split(',');return i.replace(/\B(?=(\d{3})+(?!\d))/g,'\u202f')+(f?','+f:'');};
const cents=(v:number)=>v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2});
const kw=(w:number|null|undefined)=>w==null?'—':num(w/1000,1);
const eur=(v:number|null|undefined)=>v==null?'—':Math.abs(v)<10?cents(v):num(v,0);
const bill=(v:number|null|undefined)=>v==null?'—':cents(v);          // a bill so far, to the cent (the mock-up's 29,89 €)
const year=(v:number|null|undefined)=>v==null?'—':num(Math.abs(v)>=100?Math.round(v/10)*10:Math.round(v),0);
const kwh=(v:number|null|undefined)=>v==null?'—':num(v,Math.abs(v)<20?1:0);
const price=(v:number|null|undefined)=>v==null?'—':cents(v);          // a price a kWh: always to the cent (0,21 €)
const DAYS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
/** « hier », « avant-hier », else the weekday (« samedi »): the day a figure is about, from an ISO date. */
const dayName=(iso?:string|null)=>{if(!iso)return 'hier';const d=new Date(iso+'T12:00'),t=new Date();t.setHours(12,0,0,0);
 const k=Math.round((t.getTime()-d.getTime())/864e5);return k===1?'hier':k===2?'avant-hier':DAYS[d.getDay()];};
const cap=(s:string)=>s.charAt(0).toUpperCase()+s.slice(1);
/** A link to the hub's page, opened inside Home Assistant (no reload). */
const toHub=(e:MouseEvent)=>{e.preventDefault();history.pushState(null,'',(e.currentTarget as HTMLAnchorElement).getAttribute('href')??'/hestia/energie');
 window.dispatchEvent(new CustomEvent('location-changed',{bubbles:true,composed:true}));};
const MONTHS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const SHORT=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const LEVEL:Record<string,string>={bleu:'ok',vert:'benefit',orange:'action',rouge:'urgent'};
const TONE:Record<string,string>={bleu:'--nw-benefit',vert:'--nw-benefit',orange:'--nw-act',rouge:'--nw-alert'};
const BANNER_ICON:Record<string,string>={fuite_eau:'drop',disjoncteur:'bolt',chauffe_eau_reseau:'drop',soleil_en_trop:'sun',soleil_machine_ok:'sun',
 soleil_chaleur:'sun',machines_ensemble:'plug',machine_sans_soleil:'sun',machine_heures_pleines:'clock',oublie:'plug',rien_hc:'clock',rien_hc_bientot:'clock',
 rien_soleil_juste:'sun',rien_soleil_petit:'sun',rien_soleil_plus_tard:'sun',rien:'home',jour_rouge:'bolt',jour_rouge_demain:'clock'};
/** The Tempo colours, as RTE says them, with the colour of the charte that says them. */
const TEMPO_TONE:Record<string,string>={bleu:'--nw-cold',blanc:'--nw-fg',rouge:'--nw-alert'};
/** An hour said as a clock: « 11 h », « midi », « minuit ». */
const hour=(h:number)=>h===12?'midi':h===0||h===24?'minuit':`${h} h`;
/** An hour of the contract (« 0 h 14 ») kept on one line. */
const nb=(t:string)=>t.replace(/ /g,' ');
const clock=(d:Date)=>d.getHours()+' h '+String(d.getMinutes()).padStart(2,'0');
const noon=(iso:string)=>new Date(iso+'T12:00:00');
const dayOf=(iso:string)=>{const d=noon(iso).getDate();return d===1?'1er':String(d);};
const dayMonth=(iso:string)=>`${dayOf(iso)} ${MONTHS[noon(iso).getMonth()]}`;
/** A share in words (« un quart », « la moitié »), for the peak and the off-peak saving. */
const part=(x:number)=>x<=.3?'un quart':x<=.4?'un tiers':x<=.58?'la moitié':x<=.7?'deux tiers':x<=.85?'trois quarts':'presque tout';
/** The off-peak ranges in minutes of the day, from « 0 h 14 » – « 8 h 19 ». */
const minutes=(t:string)=>{const m=t.match(/(\d+) h(?: (\d+))?/);return m?Number(m[1])*60+(m[2]?Number(m[2]):0):0;};
function offpeak(ranges:[string,string][]|null):[number,number][]{
 return (ranges??[]).flatMap(([a,b])=>{const x=minutes(a),y=minutes(b);return y>x?[[x,y] as [number,number]]:[[x,1440] as [number,number],[0,y] as [number,number]];});
}
/** All off-peak hours at night (between 20 h and 9 h 30): then « la nuit » says it; else « en heures creuses ». */
const atNight=(r:[number,number][])=>r.length>0&&r.every(([a,b])=>(a>=20*60||b<=9*60+30));

/* ── Small drawings of the mock-up, all in CSS ── */
type Bar={n:string;v:number;txt:string;sub?:string;live?:string;dash?:boolean;muted?:boolean;soft?:boolean};
/** Lying bars: a name, a bar, a value, a small grey value (the hand-made review's bars). */
function hb(rows:Bar[],c:string):TemplateResult{
 const top=Math.max(...rows.map(r=>r.v),0)||1;
 return html`<div class="hb" style="--c:var(${c})">${rows.map(r=>html`<span class="n${r.muted?' muted':''}"><span>${r.n}</span>${r.live?html`<span class="live">${r.live}</span>`:nothing}</span>
  <span class="t${r.dash?' dash':''}"><i class=${r.soft?'soft':''} style="width:${Math.max(1,r.v/top*100)}%"></i></span>
  <span class="v${r.muted?' muted':''}">${r.txt}${r.sub?html`<small>${r.sub}</small>`:nothing}</span>`)}</div>`;
}
/** C5: at most five lines (and those running now), then « Et N autres : X ». */
function top5(rows:Bar[],fmt:(x:number)=>string):Bar[]{
 const shown=rows.filter((r,i)=>i<5||r.live),rest=rows.filter(r=>!shown.includes(r));
 if(rest.length<2)return rows;
 const total=rest.reduce((s,r)=>s+r.v,0);
 return [...shown,{n:`Et ${rest.length} autres`,v:total,txt:fmt(total),muted:true,soft:true}];
}
/** Standing bars: the highest carries its value; off-peak bands behind; a dashed limit. */
function cols(vals:(number|null)[],c:string,o:{pin?:(v:number)=>string;part?:number;bands?:(i:number)=>boolean;max?:number;limit?:number;limitLabel?:string;tall?:boolean}={}):TemplateResult{
 const top=Math.max(...vals.map(v=>v??0),0),max=o.max??(top*1.15||1),im=top>0?vals.indexOf(top):-1,n=vals.length;
 return html`<div class="cols${o.tall?' tall':''}" style="--c:var(${c})">${vals.map((v,i)=>{const h=v==null?2:Math.max(2,v/max*100);
  return html`<div class="c${o.bands?.(i)?' band':''}">${i===im&&o.pin?html`<span class="pin ${i<2?'l':i>n-3?'r':''}" style="bottom:${h}%">${o.pin(v!)}</span>`:nothing}<i class="${v==null?'none':''}${o.part===i?' part':''}" style="height:${h}%"></i></div>`;})}
  ${o.limit?html`<div class="limit" style="bottom:${o.limit/max*100}%"><span>${o.limitLabel}</span></div>`:nothing}</div>`;
}
const H_TICKS=html`<div class="ticks"><span>0 h</span><span>6 h</span><span>12 h</span><span>18 h</span><span>24 h</span></div>`;

class HestiaEnergyCard extends LitElement {
 static styles=[unsafeCSS(charte),unsafeCSS(energy)];
 static properties={_view:{state:true},_open:{state:true},_folded:{state:true},_error:{state:true},_hover:{state:true},_pin:{state:true}};
 declare _view?:View;declare _open?:Rubric;declare _folded:Set<string>;declare _error?:string;
 /** The clock's hour under the pointer or the focus, and the one pinned by a click or a tap (the magnifier). */
 declare _hover?:number;declare _pin?:number;
 private _hass?:Hass;private _config:Config={type:'custom:hestia-energy-card',card:'complete'};private _stop?:()=>void;private _again?:number;
 constructor(){super();this._folded=new Set();}

 static getStubConfig(){return {card:'complete'};}
 static getConfigElement(){return document.createElement('hestia-energy-card-editor');}
 setConfig(config:Config){
  const card=config.card??'complete';
  if(card!=='complete'&&card!=='tuile'&&card!=='conseils'&&!RUBRICS.includes(card as Rubric))throw new Error(`card: ${card} ? (complete, tuile, conseils, ${RUBRICS.join(', ')})`);
  this._config={...config,card};
 }
 getCardSize(){return this._config.card==='tuile'?2:8;}
 // Like Hestia Weather: the full card (and the advice) take the whole width of the view; the others a section's.
 getGridOptions(){const c=this._config.card;return c==='complete'||c==='conseils'?{columns:'full',rows:'auto'}:{columns:12,rows:'auto',min_columns:6};}
 // The view comes from one subscription shared by every Énergie card of the page (stream.ts): whole once, then only
 // what changed, as soon as it changes. The card never recomputes anything, and never asks on its own.
 set hass(hass:Hass){
  const other=this._hass?.connection!==hass.connection;
  this._hass=hass;
  if(other||!this._stop)this._follow();
 }
 connectedCallback(){super.connectedCallback();this._follow();}
 disconnectedCallback(){super.disconnectedCallback();this._unfollow();}
 private _unfollow(){this._stop?.();this._stop=undefined;window.clearTimeout(this._again);}
 private _follow(){
  this._unfollow();
  if(!this._hass||!this.isConnected)return;
  this._stop=follow(this._hass.connection,v=>{this._view=v as unknown as View;this._error=undefined;},
   e=>{this._stop=undefined;this._error=e.message??'Hestia Énergie ne répond pas.';this._again=window.setTimeout(()=>this._follow(),30000);},
   // Hestia Énergie reloaded: the new one is followed a moment later.
   ()=>{this._stop=undefined;this._again=window.setTimeout(()=>this._follow(),2000);});
 }

 render(){
  const v=this._view;
  if(this._error&&!v)return html`<ha-card><div class="empty">${this._error}</div></ha-card>`;
  if(!v||!v.pret)return html`<ha-card><div class="empty">Hestia Énergie lit la page Énergie…</div></ha-card>`;
  const card=this._config.card;
  if(card==='tuile')return this._tile(v);
  if(card==='conseils')return this._advice(v);
  if(card!=='complete')return html`<ha-card>${this._detail(v,card as Rubric,false)}</ha-card>`;
  return html`${this._full(v)}${this._open?html`<div class="ov" @click=${(e:Event)=>{if(e.target===e.currentTarget)this._open=undefined;}}
   @keydown=${(e:KeyboardEvent)=>{if(e.key==='Escape')this._open=undefined;}}><ha-card class="sheet" role="dialog" aria-modal="true">${this._detail(v,this._open,true)}</ha-card></div>`:nothing}`;
 }

 private _name(){return this._config.name??'Maison';}
 private _live(v:View){return !!(v.equipement.direct&&v.direct?.maison_w!=null);}
 /** « en heures pleines » / « en heures creuses » / nothing on Base. */
 private _when(d?:Direct){return d?.periode==='hc'?'en heures creuses':d?.periode==='hp'?'en heures pleines':'';}

 /* What the home draws now, in one sentence (the tile, « En ce moment »). With a battery (HACF, 26 Nov. 2026): what it
    covers or takes, and how long it lasts at this pace; never « le reste vient du réseau : 0,00 € » when nothing comes. */
 private _nowSay(v:View,withHome:boolean){
  const d=v.direct!,home=d.maison_w??0,sun=Math.min(d.soleil_w??0,home),bought=d.achat_w??0,sold=d.revente_w??0;
  const bat=d.batterie,gives=Math.min(bat?.decharge_w??0,Math.max(0,home-sun)),takes=bat?.charge_w??0;
  const when=this._when(d),cost=d.prix!=null?html`<b>${eur(bought/1000*d.prix)} € de l'heure</b>${when?`, ${when}`:''}`:null;
  const lead=withHome?html`La maison consomme <b>${kw(home)} kW</b>. `:nothing;
  const solar=!!v.equipement.soleil&&sun>=30,grid=bought>=30,pc=(x:number)=>home>0?Math.round(x/home*100):0;
  const rest=html`le reste vient du réseau${cost?html` : ${cost}`:''}`;
  // « Elle » once the sentence has named the battery, else « La batterie ».
  const named=gives>=30||takes>=30,lasts=this._batteryLasts(d,named);
  // What leaves for the grid: paid, or only injected (HACF, 26 Nov.: « injection réseau » with a resale price of 0 €).
  const out=this._paid(v)?'partent au réseau':'sont injectés dans le réseau';
  if(solar&&sold>=30&&!grid)return html`${lead}Le soleil couvre tout${takes>=30?html`, charge la batterie (<b>${kw(takes)} kW</b>)`:''} et <b>${kw(sold)} kW</b> ${out}.${lasts}`;
  if(gives>=30){
   if(!grid)return html`${lead}${solar?html`Le soleil en couvre <b>${pc(sun)} %</b>, la batterie le reste : <b>${kw(gives)} kW</b>.`:html`La batterie couvre toute la maison : <b>${kw(gives)} kW</b>.`}${lasts}`;
   return html`${lead}${solar?html`Le soleil en couvre <b>${pc(sun)} %</b>, la batterie <b>${pc(gives)} %</b>`:html`La batterie en couvre <b>${pc(gives)} %</b>`} ; ${rest}.${lasts}`;
  }
  if(solar){
   if(!grid)return html`${lead}Le soleil couvre toute la maison${takes>=30?html` et charge la batterie : <b>${kw(takes)} kW</b>`:''}.${lasts}`;
   if(withHome)return html`${lead}Le soleil en couvre <b>${pc(sun)} %</b>, ${rest}.${lasts}`;
   return html`Le soleil en donne <b>${kw(sun)} kW</b> ; ${rest}.${lasts}`;}
  if(takes>=30&&grid&&cost)return html`${lead}Tout vient du réseau, la charge de la batterie aussi (<b>${kw(takes)} kW</b>) : ${cost}.${lasts}`;
  return cost?html`${lead}Tout vient du réseau : ${cost}.${lasts}`:html`${lead}${lasts}`;
 }
 /** Is what leaves for the grid paid? Only with a resale price above 0 € (HACF, 26 Nov. 2026: « injection réseau »). */
 private _paid(v:View){return (v.contrat?.revente??0)>0;}
 /** « Elle est à 78 % : à ce rythme, elle couvre les heures pleines jusqu'à 22 h. » Nothing without a battery's charge. */
 private _batteryLasts(d:Direct,named:boolean){
  const b=d.batterie;
  if(!b||b.pourcent==null)return nothing;
  const who=named?'Elle':'La batterie';
  if(b.pourcent>=99&&(b.decharge_w??0)<30)return html` ${who} est pleine.`;
  const at=html` ${who} est à <b>${b.pourcent} %</b>`;
  if(b.pleine_a)return html`${at} : pleine vers <b>${clock(new Date(b.pleine_a))}</b> à ce rythme.`;
  if(!b.jusqu_a||(b.decharge_w??0)<30)return html`${at}.`;
  const end=new Date(b.jusqu_a),next=d.prochain_changement,change=next?new Date(next.a):null;
  // Until the off-peak hours: the battery covers the peak hours (on a Tempo red day, the dearest of the year).
  if(d.periode==='hp'&&change&&next!.periode==='hc'){
   const red=d.couleur==='rouge'?' du jour rouge':'';
   if(end>=change)return html`${at} : à ce rythme, elle couvre les heures pleines${red} jusqu'à <b>${clock(change)}</b>.`;
   return html`${at} : à ce rythme, jusque vers <b>${clock(end)}</b>, avant la fin des heures pleines${red} (${clock(change)}).`;
  }
  const hours=(end.getTime()-Date.now())/36e5;
  if(hours>=20)return html`${at} : à ce rythme, de quoi tenir jusqu'à demain.`;
  return html`${at} : à ce rythme, environ <b>${hours<1?`${Math.max(5,Math.round(hours*12)*5)} min`:`${num(hours,hours<3?1:0)} h`}</b>, jusque vers ${clock(end)}.`;
 }

 /* ── 1 · The tile ── */
 private _tile(v:View){
  const b=v.direct?.bandeau,c=b?TONE[b.couleur]??'--nw-benefit':'--nw-benefit',live=this._live(v);
  const pill:[string,string]|undefined=b?[b.pastille,c]:undefined,head={ic:'home',c:'--nw-home',subject:'Énergie',pill,over:false};
  // Nothing to do now: the tile gives the advice « à froid » worth the most (maquette des cartes 3).
  const best=(v.pistes??[]).find(p=>p.euros_an!=null);
  if(live)return html`<ha-card class="tile">${this._ans({...head,period:'en ce moment',val:kw(v.direct!.maison_w),unit:'kW',cap:'pour toute la maison',
   why:b?.couleur==='bleu'&&best?html`Rien à faire maintenant. ${this._saySave(best)}`:this._nowSay(v,false)})}</ha-card>`;
  // The latest whole day: yesterday, or the day before while Enedis has not sent yesterday (HA Linky, palier 0).
  const y=v.dernier_jour,day=dayName(y?.jour);
  if(!y)return html`<ha-card class="tile">${this._ans({...head,period:'',msg:'Les premiers jours arrivent',why:'Enedis envoie chaque journée le lendemain.'})}</ha-card>`;
  return html`<ha-card class="tile">${this._ans({...head,period:day,...(y.euros!=null?{val:eur(y.euros),unit:'€'}:{val:kwh(y.kwh_achetes),unit:'kWh'}),
   cap:'pour toute la maison',why:best?this._saySave(best):y.euros!=null?html`<b>${kwh(y.kwh_achetes)} kWh</b> achetés au réseau${y.soleil_couvre!=null?html` ; le soleil a couvert <b>${y.soleil_couvre} %</b> de la maison`:''}.`:'Le prix sera connu avec le contrat.'})}</ha-card>`;
 }

 /* ── 2 · The full card ── */
 private _full(v:View){
  const b=v.direct?.bandeau,now=new Date();
  const when=now.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})+' · '+clock(now);
  const dial=this._clock(v);
  // Without live power, « En ce moment » only says the price: the clock already does.
  const secs=[dial&&!this._live(v)?nothing:this._nowSection(v),this._todaySection(v),this._monthSection(v)].filter(s=>s!==nothing);
  return html`<ha-card>
   <div class="head"><div style="min-width:0"><div class="nw-label">Énergie</div><div class="nw-title">${this._name()}</div></div><div class="when">${when}</div></div>
   ${dial??(b&&this._live(v)?html`<div class="nw-band nw-glass" data-level=${LEVEL[b.couleur]??'ok'}><div class="nw-band-row"><span class="nw-band-pic box">${icon(BANNER_ICON[b.id]??'home')}</span>
    <div class="nw-band-text"><p class="nw-band-kicker">En ce moment</p><p class="nw-band-title">${b.titre}</p>${b.pourquoi||this._periodSay(v)?html`<p class="nw-band-line">${b.pourquoi||this._periodSay(v)}</p>`:nothing}</div></div></div>`:nothing)}
   <div class="periods${secs.length===2?' two':''}">${secs}</div>
   ${v.usage?this._section('usage','Votre contrat, bien utilisé','sur 12 mois',this._usage(v)):nothing}
   ${v.pistes?.length?this._section('save','Pour économiser','sur 12 mois, en euros',html`<div class="pistes better">${v.pistes.slice(0,6).map(p=>p.maintenant?this._better(p):this._piste(p))}</div>`):nothing}
   ${this._section('more','En détail','touchez pour ouvrir',html`<div class="more">${this._goes(v)}</div>`)}
  </ha-card>`;
 }
 /** The 24-hour clock: one stroke an hour, out from the ring for what was bought (peak hours warm, off-peak hours cold),
     in towards the centre for the sun, yesterday's hours still to come in grey, a hand on the time. Beside it, the banner
     (or what the day says) and the figures of the moment. Without any hour of today (a Linky read the day after), the
     clock shows yesterday, whole. Nothing to draw: undefined, and the plain banner stays. */
 private _clock(v:View):TemplateResult|undefined{
  const today=v.heures?.aujourdhui??[],yday=v.heures?.hier??[],known=today.some(h=>h.achat!=null);
  const hours=known?today:yday;
  if(!hours.some(h=>h.achat!=null))return undefined;
  const now=new Date(),at=now.getHours()+now.getMinutes()/60,ranges=offpeak(v.heures_creuses);
  const hc=(i:number)=>ranges.some(([a,b])=>i*60+30>=a&&i*60+30<b);
  const top=Math.max(.3,...hours.map(h=>h.achat??0),...(known?yday.map(h=>h.achat??0):[]));
  const sunTop=Math.max(.3,...hours.map(h=>h.soleil??0));
  const C=170,R=98,L=46,S=86,SL=32;
  const at24=(h:number)=>h/24*Math.PI*2-Math.PI/2;
  const xy=(h:number,r:number)=>`${(C+Math.cos(at24(h))*r).toFixed(1)} ${(C+Math.sin(at24(h))*r).toFixed(1)}`;
  const seg=(i:number,r1:number,r2:number)=>`M${xy(i+.5,r1)} L${xy(i+.5,r2)} `;
  // One spoke an hour, each its own element: the pointer, a tap or the keyboard picks one, and the magnifier grows it and
  // its neighbours and says its figures in the centre.
  const c=v.contrat,hp=c?.prix_hp??null,hcPrice=c?.prix_hc??null,base=c?.prix_base??null;
  const priceAt=(i:number)=>c?.option==='base'?base:c?.option==='hphc'?(hc(i)?hcPrice:hp):null;
  type Spoke={i:number;cls:string;val:number|null;sun:number|null;future:boolean};
  const spokes:Spoke[]=[];let bought=0,anySun=false,anyNext=false;
  for(let i=0;i<24;i++){
   const h=hours[i],future=known&&i>now.getHours();
   const val=future?yday[i]?.achat??null:h?.achat??null,sunV=future?null:(h?.soleil??0)>=.01?h!.soleil:null;
   if(!future&&val!=null)bought+=val;
   if(sunV!=null)anySun=true;if(future&&val!=null)anyNext=true;
   spokes.push({i,cls:future?'next':hc(i)?'off':'peak',val,sun:sunV,future});
  }
  // A spoke's kWh to the hundredth under 1 kWh: an hour is small (« 0,95 kWh », not « 1 kWh »).
  const kwhH=(x:number)=>x<1?num(x,2):kwh(x);
  const pick=this._pin??this._hover,dist=(a:number,b:number)=>{const k=Math.abs(a-b);return Math.min(k,24-k);};
  const grow=(i:number)=>pick==null?0:dist(i,pick)===0?16:dist(i,pick)===1?5:0;
  const say=(sp:Spoke)=>{const e=sp.val!=null?priceAt(sp.i):null;
   return `de ${hour(sp.i)} à ${hour(sp.i+1)} : ${sp.val!=null?`${kwhH(sp.val)} kWh ${sp.future?'hier':'achetés'}`:'rien de mesuré'}${e!=null&&sp.val!=null?`, environ ${cents(sp.val*e)} €`:''}${sp.sun!=null?`, ${kwhH(sp.sun)} kWh de soleil`:''}`;};
  const bars=spokes.map(sp=>{const g=grow(sp.i),k=pick==null?'':dist(sp.i,pick)===0?' on':dist(sp.i,pick)===1?' near':' far';
   return svg`<g class=${`h${k}`}>${sp.val!=null?svg`<path class=${sp.cls} d=${seg(sp.i,R-(g?2:0),R+3+sp.val/top*L+g)}></path>`:nothing}
    ${sp.sun!=null?svg`<path class="sun" d=${seg(sp.i,S+(g?2:0),S-3-sp.sun/sunTop*SL-g*.6)}></path>`:nothing}</g>`;});
  const set=(i?:number)=>{this._hover=i;},tap=(i:number)=>{this._pin=this._pin===i?undefined:i;};
  const hits=spokes.map(sp=>svg`<path class="hit" d=${seg(sp.i,44,164)} tabindex="0" role="button" aria-label=${say(sp)} aria-pressed=${this._pin===sp.i?'true':'false'}
   @pointerenter=${()=>set(sp.i)} @focus=${()=>set(sp.i)} @blur=${()=>set()} @click=${()=>tap(sp.i)}
   @keydown=${(e:KeyboardEvent)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tap(sp.i);}else if(e.key==='Escape'){this._pin=undefined;}}}></path>`);
  const live=this._live(v),d=v.direct,b=d?.bandeau,s=v.jusqu_ici,y=v.dernier_jour;
  const centre=live?[`${kw(d!.maison_w)} kW`,'en ce moment']:known&&s?.euros!=null?[`${eur(s.euros)} €`,'depuis minuit']
   :!known&&y?.euros!=null?[`${eur(y.euros)} €`,dayName(y.jour)]:[`${kwh(bought)} kWh`,known?'depuis minuit':dayName(y?.jour)];
  const picked=pick!=null?spokes[pick]:undefined;
  const centreSay=picked?[picked.val!=null?`${kwhH(picked.val)} kWh`:'—',`${hour(picked.i)} – ${hour(picked.i+1)}${picked.future?' · hier':''}`,
   [picked.val!=null&&priceAt(picked.i)!=null?`≈ ${cents(picked.val*priceAt(picked.i)!)} €`:'',picked.sun!=null?`soleil ${kwhH(picked.sun)} kWh`:''].filter(Boolean).join(' · ')]:[centre[0],centre[1],''];
  const sunKwh=known?v.jour?.soleil_kwh:y?.soleil_kwh;
  const priceOk=d?.prix!=null&&!(v.contrat?.a_confirmer??[]).includes('option');
  const next_=d?.prochain_changement?` jusqu'à ${clock(new Date(d.prochain_changement.a))}`:'';
  const tempo=this._tempo(d);
  const stats=[
   ...(tempo?[tempo]:[]),
   ...(priceOk?[['Le kWh maintenant',`${price(d!.prix)} €`,`${this._when(d)}${next_}`.trim()||'à toute heure','--nw-home']]:[]),
   ...(known&&v.pointe?[['Heure la plus chargée',`${kw(v.pointe.kw*1000)} kW`,`entre ${hour(v.pointe.h)} et ${hour(v.pointe.h+1)}`,'--nw-grid']]:[]),
   ...(v.equipement.soleil&&sunKwh!=null&&sunKwh>=.05?[['Soleil',`${kwh(sunKwh)} kWh`,known?'produits aujourd\'hui':`produits ${dayName(y?.jour)}`,'--nw-sun']]:[]),
  ];
  const title=live&&b?b.titre:`${known?'Aujourd\'hui':cap(dayName(y?.jour))}, en un tour d'horloge`;
  const line=live&&b?(b.pourquoi||this._periodSay(v)):known?'':'Le compteur envoie chaque journée le lendemain.';
  const label=`${known?'Aujourd\'hui':cap(dayName(y?.jour))} heure par heure : ${kwh(bought)} kWh achetés au réseau${sunKwh!=null&&sunKwh>=.05?`, ${kwh(sunKwh)} kWh de soleil`:''}.`;
  const tick=(h:number,t:string,anchor:string,dy=4)=>{const [x,yy]=xy(h,R+L+16).split(' ');return svg`<text x=${x} y=${Number(yy)+dy} text-anchor=${anchor}>${t}</text>`;};
  return html`<div class="clock" data-level=${live&&b?LEVEL[b.couleur]??'ok':'ok'}>
   <svg class="dial" viewBox="0 0 340 340" role="group" aria-label=${label} @pointerleave=${()=>set()}>
    <circle class="ring" cx="170" cy="170" r=${R}></circle>
    <g class=${`bars${pick!=null?' picking':''}`}>${bars}</g>
    ${tick(0,'0 h','middle',0)}${tick(6,'6 h','end')}${tick(12,'12 h','middle',7)}${tick(18,'18 h','start')}
    ${known?svg`<path class="hand" d=${`M${xy(at,R-6)} L${xy(at,R+L+6)}`}></path>
     <circle class="ping" cx=${xy(at,R+L+6).split(' ')[0]} cy=${xy(at,R+L+6).split(' ')[1]} r="4.5"></circle>
     <circle class="tip" cx=${xy(at,R+L+6).split(' ')[0]} cy=${xy(at,R+L+6).split(' ')[1]} r="4.5"></circle>`:nothing}
    <text class=${`cv${picked?' pk':''}`} x="170" y=${centreSay[2]?166:172}>${centreSay[0]}</text><text class="cl" x="170" y=${centreSay[2]?188:194}>${centreSay[1]}</text>
    ${centreSay[2]?svg`<text class="cl cs" x="170" y="206">${centreSay[2]}</text>`:nothing}
    <g class="hits">${hits}</g>
   </svg>
   <div class="ct">
    ${live&&b?html`<p class="nw-label">En ce moment</p>`:nothing}
    <p class="ctt">${title}</p>${line?html`<p class="ans-w">${line}</p>`:nothing}
    ${stats.length?html`<div class="cstats">${stats.map(([k,val,sub,c])=>html`<div class="cstat" style="--c:var(${c})"><span>${k}</span><b>${val}</b><small>${sub}</small></div>`)}</div>`:nothing}
    <div class="nw-legend"><span><i style="--c:var(--nw-home)"></i>acheté en heures pleines</span>${ranges.length?html`<span><i style="--c:var(--nw-cold)"></i>en heures creuses</span>`:nothing}
     ${anySun?html`<span><i style="--c:var(--nw-sun)"></i>soleil, vers le centre</span>`:nothing}${anyNext?html`<span><i style="--c:color-mix(in srgb, var(--nw-fg) 18%, transparent)"></i>hier, aux heures à venir</span>`:nothing}
     <span class="hint">touchez une heure pour ses chiffres</span></div>
   </div>
  </div>`;
 }
 /** Tempo: the colour of the day, and of tomorrow once RTE has said it (about 11 h). A red tomorrow leads: « Tempo demain · Rouge ». */
 private _tempo(d?:Direct):[string,string,string,string]|null{
  const now=d?.couleur,next=d?.couleur_demain;
  if(!now&&!next)return null;
  if(next==='rouge'&&now!=='rouge')return ['Tempo demain','Rouge',now?`jour ${now} aujourd'hui`:'de 6 h à 6 h',TEMPO_TONE.rouge];
  return ['Tempo aujourd\'hui',cap(now??'—'),next?`demain ${next}`:'demain pas encore connu',TEMPO_TONE[now??'']??'--nw-fg'];
 }
 /** « Heures pleines jusqu'à 0 h 14, puis heures creuses jusqu'à 8 h 19. »: under a banner that says nothing more. */
 private _periodSay(v:View){
  const d=v.direct,next=d?.prochain_changement;
  if(!next||(d?.periode!=='hp'&&d?.periode!=='hc'))return '';
  const at=new Date(next.a),now=d.periode==='hp'?'Heures pleines':'Heures creuses';
  const start=at.getHours()*60+at.getMinutes(),range=(v.heures_creuses??[]).find(([a])=>minutes(a)===start);
  const then=next.periode==='hc'&&range?`, puis heures creuses jusqu'à ${nb(range[1])}`:'';
  return `${now} jusqu'à ${clock(at)}${then}.`;
 }
 private _section(id:string,title:string,sum:string,body:unknown){
  const open=!this._folded.has(id);
  return html`<div class="sec"><button class="nw-fold-head" aria-expanded=${String(open)} @click=${()=>{const f=new Set(this._folded);if(open)f.add(id);else f.delete(id);this._folded=f;}}>
   <span class="nw-title">${title}</span><span class="nw-sum">${sum}</span><span class="nw-chevron">${icon('chev')}</span></button>${open?body:nothing}</div>`;
 }
 /** « En ce moment » as Frank's template draws it (20 Nov. 2026): a light halo of colour around each circle, yellow-orange
     for the production, red in peak hours and blue in off-peak hours for the grid and the home; on each line, bubbles that
     grow as they reach its middle, quicker as the power grows; the water of the day in one small line under the home. */
 private _flow(v:View){
  const d=v.direct!,cheap=(d.periode??'').includes('hc'),tone=cheap?'--nw-cold':'--nw-level3';
  const sun=v.equipement.soleil?Math.max(0,d.soleil_w??0):null,home=Math.max(0,d.maison_w??0);
  const buying=(d.achat_w??0)>=30,selling=!buying&&(d.revente_w??0)>=30,direct=sun==null?0:Math.min(sun,home);
  const bat=d.batterie;
  const watt=(w:number)=>w<1000?`${num(w,0)} W`:`${num(w/1000,2)} kW`;
  // A light halo around each circle, stronger with the power it carries (Frank, 20 Nov.: the halo on the circle, not on a box).
  const node=(ic:string,c:string,val:string,l:string,a:number,dim=false,more:unknown=nothing)=>html`<div class="fnode${dim?' dim':''}" style="--c:var(${c});--a:${Math.min(1,Math.max(.25,a)).toFixed(2)}"><span class="fdot">${icon(ic)}</span><span class="fl">${l}</span><span class="fv">${val}</span>${more}</div>`;
  // Faster with more power: 3.2 s for a trickle, 1.2 s from 3 kW.
  const link=(c:string,w:number,say:[string,string],back=false)=>{
   const on=w>=30,dur=on?Math.max(1.2,3.2-w/1500):0;
   return html`<div class="flink${on?'':' off'}${back?' back':''}" style="--c:var(${c});--dur:${dur.toFixed(2)}s"><span class="fsay">${on?html`<b>${say[0]}</b><span>${say[1]}</span>`:''}</span><span class="fline">${on?html`<i></i><i></i><i></i>`:nothing}</span></div>`;
  };
  const gridW=buying?d.achat_w!:selling?d.revente_w!:0;
  const gridSay:[string,string]=buying?[`↙ ${watt(gridW)}`,'achetés']:[`↗ ${watt(gridW)}`,this._paid(v)?'revendus':'injectés'];
  // The battery under the home (HACF, 26 Nov. 2026): its charge in a ring round its circle, what it gives or takes on a
  // short line up to the home. Still: « au repos ».
  const giving=(bat?.decharge_w??0)>=30,taking=!giving&&(bat?.charge_w??0)>=30,batW=giving?bat!.decharge_w!:taking?bat!.charge_w!:0;
  const pct=bat?.pourcent;
  const battery=bat?html`<div class="fbat${giving||taking?'':' rest'}" style="--c:var(--nw-battery);--dur:${Math.max(1.2,3.2-batW/1500).toFixed(2)}s;--p:${pct??0}">
    <span class="fvline${giving?' up':''}">${giving||taking?html`<i></i><i></i><i></i>`:nothing}</span>
    <span class="fbat-n"><span class="fring${pct==null?' none':''}"><span class="fdot">${icon('battery')}</span></span>
     <span class="fbat-t"><span class="fl">Batterie${pct!=null?html` · <b>${pct} %</b>`:''}</span>
      <span class="fv">${giving?`↑ ${watt(batW)}`:taking?`↓ ${watt(batW)}`:'au repos'}</span>${giving||taking?html`<small>${giving?'vers la maison':'en charge'}</small>`:nothing}</span></span></div>`:nothing;

  // The water of the day: one small line under the home, never a node that makes the tile taller (Frank, 20 Nov.).
  const water=v.eau&&v.eau.jour_l>0?html`<span class="fw">${icon('drop')}${num(v.eau.jour_l,0)} L d'eau aujourd'hui</span>`:nothing;
  return html`<div class="flow2${sun==null?' two':''}">
   ${sun!=null?html`${node('sun','--nw-prod',watt(sun),'Production',sun/1500,sun<30)}${link('--nw-prod',direct,[watt(direct),'en direct'])}`:nothing}
   ${node('home',tone,watt(home),'Maison',home/1500,false,water)}
   ${link(tone,gridW,gridSay,buying)}
   ${node('grid',tone,`${selling?'+':''}${watt(gridW)}`,'Réseau',gridW/1500,!buying&&!selling)}
   ${battery}
  </div>`;
 }
 private _nowSection(v:View){
  const d=v.direct;
  if(!d)return nothing;
  if(!this._live(v)){
   // No live power (a Linky read the day after): the price of the moment still says something, unless the option is only
   // supposed (palier 0 before the household said it: a price that may be wrong is not said).
   if(d.prix==null||(v.contrat?.a_confirmer??[]).includes('option'))return nothing;
   const next=d.prochain_changement?` jusqu'à ${clock(new Date(d.prochain_changement.a))}`:'';
   return this._section('now','En ce moment',this._when(d),html`<div class="lines"><div class="line"><span class="ico" style="--c:var(--nw-grid)">${icon('clock')}</span>
    <span>Le kWh coûte <b>${price(d.prix)} €</b>${this._when(d)?` ${this._when(d)}`:''}${next}.${d.couleur_demain?` Demain, jour ${d.couleur_demain}.`:''}</span></div></div>`);
  }
  // No « En marche » chips here: the Appareils card says what runs (Frank, 20 Nov. 2026).
  return this._section('now','En ce moment',`${kw(d.maison_w)} kW pour toute la maison`,html`${this._flow(v)}
   <div class="lines"><div class="line"><span class="ico" style="--c:var(--nw-home)">${icon('home')}</span><span>${this._nowSay(v,true)}</span></div></div>`);
 }
 private _todaySection(v:View){
  const s=v.jusqu_ici;
  if(s){
   const h=new Date(s.jusqu_a).getHours(),euros=s.euros!=null&&s.hier_euros!=null;
   const a=euros?s.euros!:s.kwh,b=euros?s.hier_euros!:s.hier_kwh,gap=a-b,small=euros?Math.abs(gap)<0.1:Math.abs(gap)<0.5;
   const unit=euros?'€':'kWh',fmt=(x:number)=>euros?eur(x):kwh(x);
   return this._section('today','Aujourd\'hui','depuis minuit',html`<div class="big"><b>${fmt(a)} ${unit}</b><span>${euros?'dépensés':'consommés'} depuis minuit</span></div>
    <p class="say">${small?html`Comme hier à la même heure.`:html`<b>${fmt(Math.abs(gap))} ${unit} de ${gap>0?'plus':'moins'}</b> qu'hier à la même heure.`}</p>
    ${hb([{n:'Aujourd\'hui',v:a,txt:`${fmt(a)} ${unit}`},{n:`Hier à ${hour(h)}`,v:b,txt:`${fmt(b)} ${unit}`,muted:true,soft:true}],'--nw-home')}`);
  }
  const y=v.dernier_jour;
  if(!y)return nothing;
  // The statistics come the day after (HA Linky): yesterday, whole, is the latest day known.
  return this._section('today',cap(dayName(y.jour)),'toute la journée',html`<div class="big"><b>${y.euros!=null?`${eur(y.euros)} €`:`${kwh(y.kwh_achetes)} kWh`}</b><span>${y.euros!=null?'pour toute la journée':'achetés au réseau'}</span></div>
   ${y.euros!=null?html`<p class="say"><b>${kwh(y.kwh_achetes)} kWh</b> achetés au réseau${y.soleil_couvre!=null?html` ; le soleil a couvert <b>${y.soleil_couvre} %</b> de la maison`:''}.</p>`:nothing}`);
 }
 private _monthSection(v:View){
  const m=v.mois;
  if(!m)return nothing;
  const now=new Date(),value=m.euros??m.euros_energie,last=v.mois_an_dernier,p=v.projection;
  const lastSay=last?.euros!=null?` L'an dernier, ${MONTHS[now.getMonth()]} avait coûté ${eur(last.euros)} €.`:'';
  return this._section('month','Ce mois-ci',`depuis le 1er ${MONTHS[now.getMonth()]}`,html`<div class="big"><b>${value!=null?`${bill(value)} €`:`${kwh(m.kwh_achetes)} kWh`}</b><span>${value==null?'achetés au réseau':m.euros!=null?'abonnement compris':'sans l\'abonnement'}</span></div>
   ${p!=null?html`<p class="say">Au même rythme, <b>environ ${eur(p)} €</b> à la fin du mois.${lastSay}</p>
    <div><div class="track" style="--c:var(--nw-ok)"><i style="width:${Math.min(100,(value??0)/p*100)}%"></i></div>
     <div class="track-l"><span>déjà <b>${eur(value)} €</b></span><span>fin du mois <b>${eur(p)} €</b></span></div></div>`
    :lastSay?html`<p class="say">${lastSay.trim()}</p>`:nothing}`);
 }

 /* « En détail »: each one says its subject AND its period, one value, one sentence; touched, it opens its card. */
 private _go(key:Rubric,ic:string,c:string,label:string,val:string,unit:string,say:string){
  // The subject in plain words, its period in grey under it: never a label cut over three lines (maquette des cartes 4).
  const [subject,period]=label.split(' · ');
  return html`<button class="go" style="--c:var(${c})" @click=${()=>{this._open=key;}}><span class="g-h"><span class="ico">${icon(ic)}</span><span class="g-t">${subject}<small>${period}</small></span><span class="ar">›</span></span>
   <span class="g-v">${val}<small>${unit}</small></span><span class="g-s">${say}</span></button>`;
 }
 private _goes(v:View){
  const out:TemplateResult[]=[];
  const j=v.jour;
  if(v.equipement.soleil&&j?.soleil_kwh!=null)out.push(this._go('soleil','sun','--nw-sun','Soleil · aujourd\'hui',kwh(j.soleil_kwh),'kWh produits',
   j.soleil_garde!=null?`La maison en a gardé ${j.soleil_garde} %.`:j.soleil_kwh>0?'Une partie de la production n\'a pas été mesurée.':'Rien encore aujourd\'hui.'));
  const heat=this._heatSum(v),hc=v.cout_chauffage;
  if(hc)out.push(this._go('chauffage','flame','--nw-heat','Chauffage · ce mois-ci',hc.mois.chauffage_eur!=null?eur(hc.mois.chauffage_eur):'—','€',
   hc.aujourdhui.chauffage_eur!=null?`Aujourd'hui ${eur(hc.aujourdhui.chauffage_eur)} €, compté par Hestia Chauffage.`:'Compté par Hestia Chauffage.'));
  else if(heat)out.push(this._go('chauffage','flame','--nw-heat','Chauffage · depuis le 1er octobre',heat.val,heat.unit,heat.say));
  if(v.veille)out.push(this._go('veille','moon','--nw-watch','Veille · chaque nuit',String(v.veille.w),'W quand tout dort',
   v.veille.euros_par_an!=null?`Environ ${year(v.veille.euros_par_an)} € par an.`:'Ce que tire la maison quand tout dort.'));
  const e=v.eau,leak=v.direct?.fuite?.minutes;
  if(e)out.push(this._go('eau','drop','--nw-water','Eau · ce mois-ci',e.mois_euros!=null?bill(e.mois_euros):num(e.mois_l,0),e.mois_euros!=null?'€':'litres',
   `${e.mois_euros!=null?`${num(e.mois_l,0)} litres. `:''}${leak?`L'eau coule depuis ${Math.round(leak)} min.`:'Pas de fuite.'}`));
  const a=v.appareils_jour?.appareils?.[0];
  if(a)out.push(this._go('appareils','plug','--nw-home','Appareils · aujourd\'hui',kwh(a.kwh),`kWh · ${a.nom}`,'Celui qui a le plus consommé.'));
  const p=v.pointe;
  if(p)out.push(this._go('pointe','bolt','--nw-grid','Pointe · aujourd\'hui',kw(p.kw*1000),'kW au plus fort',
   v.contrat?.kva?`Sur ${v.contrat.kva} kVA : ${p.part!=null&&p.part>=.7?'près de la limite':'de la marge'}.`:'L\'heure la plus chargée.'));
  const w=v.chauffe_eau;
  if(w)out.push(this._go('chauffe_eau','heater','--nw-water',`Chauffe-eau · ${w.simulation?'simulation':'piloté'}`,w.reserve!=null?String(w.reserve):'—','% de réserve',
   w.chauffer?HEAT_NOW[w.raison]??'Il chauffe.':w.prochaine_chauffe?`Prochaine chauffe à ${clock(new Date(w.prochaine_chauffe))}.`:'Pas de chauffe prévue.'));
  const c=v.contrat;
  if(c?.option==='hphc'&&c.part_hc!=null)out.push(this._go('contrat','doc','--nw-benefit','Contrat · ce mois-ci',String(Math.round(c.part_hc*100)),
   atNight(offpeak(v.heures_creuses))?'% la nuit':'% en heures creuses','de vos achats en heures creuses.'));
  else if(c)out.push(this._go('contrat','doc','--nw-benefit','Contrat · ce mois-ci',c.option==='tempo'?'Tempo':c.option==='hphc'?'HP / HC':'Base',c.kva?` · ${c.kva} kVA`:'',
   c.option==='base'&&c.prix_base!=null?`${price(c.prix_base)} € le kWh à toute heure.`:'Vos prix et vos heures.'));
  return out;
 }
 /** The heating season in one figure: stove and radiators together, or the one known. */
 private _heatSum(v:View):{val:string;unit:string;say:string;both:boolean}|null{
  const h=v.chauffage,el=h?.etat==='pret'?h.saison:null,st=h?.poele?.saison;
  if(el?.eur!=null&&st?.eur!=null)return {val:eur(el.eur+st.eur),unit:'€',say:`Poêle ${eur(st.eur)} €, radiateurs ${eur(el.eur)} €.`,both:true};
  if(st)return {val:st.eur!=null?eur(st.eur):num(st.kg,0),unit:st.eur!=null?'€':'kg',say:`Poêle : ${num(st.kg,0)} kg de granulés.`,both:false};
  if(el)return {val:el.eur!=null?eur(el.eur):kwh(el.kwh),unit:el.eur!=null?'€':'kWh',say:'Radiateurs, estimés d\'après le froid.',both:false};
  if(h?.etat==='peu_lie')return {val:'—',unit:'',say:'Vous chauffez sans doute avec une autre énergie.',both:false};
  return null;
 }

 /* ── « Votre contrat, bien utilisé » (maquette A, chosen by Frank on 19 Nov. 2026): the year's share of off-peak purchases
    against the share from which they pay, and whether the option and the power are the right ones. The devices that can
    wait are said in « Pour économiser » (maquette D, Frank on 19 Nov. 2026: today → better → the gain). ── */
 private _usage(v:View){
  const u=v.usage!,night=atNight(offpeak(v.heures_creuses)),when=night?'la nuit':'en heures creuses';
  const heater=u.appareils.find(a=>a.type==='chauffe_eau'&&a.euros_an>=2),pc=(x:number)=>Math.round(x*100);
  const better=u.part_hc_chauffe_eau!=null&&heater&&u.part_hc_chauffe_eau-u.part_hc>=.02?u.part_hc_chauffe_eau:null;
  const month=v.contrat?.part_hc;
  const gauge=html`<div class="u-gauge"><p class="u-k">Vos achats pris ${when}</p>
    <p class="u-v"><b>${pc(u.part_hc)} %</b>${better!=null?html`<span>→ <b class="ok">${pc(better)} %</b> avec le chauffe-eau ${when}</span>`:nothing}</p>
    <div class="track" style="--c:var(--nw-cold)">${better!=null?html`<i class="next" style="width:${better*100}%"></i>`:nothing}<i style="width:${u.part_hc*100}%"></i>
     ${u.seuil_hc!=null?html`<span class="mark" style="left:${Math.min(100,u.seuil_hc*100)}%"></span>`:nothing}</div>
    <div class="track-l"><span>sur 12 mois</span>${u.seuil_hc!=null?html`<span>rentable dès <b>${pc(u.seuil_hc)} %</b></span>`:nothing}</div>
    ${month!=null&&Math.abs(month-u.part_hc)>=.05?html`<p class="u-n">Ce mois-ci : ${pc(month)} %.${month<u.part_hc&&heater?' En hiver, le chauffe-eau chauffe sans soleil, en heures pleines.':''}</p>`:nothing}</div>`;
  const pw=u.puissance,lo=pw?.plus_bas;
  const kva=pw&&lo?html`<p class="u-n u-kva">${lo.jours_au_dessus===0&&lo.euros_an!=null&&lo.euros_an>=5
    ?html`Puissance : <b>${lo.kva} kVA suffiraient</b>, ${num(lo.euros_an,0)} € de moins par an d'abonnement. Votre plus forte pointe : ${kw(pw.pointe_w)} kW.`
    :html`Puissance : <b>gardez ${pw.kva} kVA</b>. La maison a dépassé ${lo.kva} kW ${lo.jours_au_dessus} jour${lo.jours_au_dessus>1?'s':''} en 12 mois.`}</p>`:nothing;
  const more=u.base_de_plus,saves=heater!=null&&more!=null&&more<0&&heater.euros_an>-more;
  const verdict=more==null?nothing:more>=0?html`<div class="u-verdict good"><p class="u-k">Votre option heures creuses</p><p class="u-big">C'est la bonne</p>
    <p class="u-n">En Base, ces 12 mois auraient coûté <b>${eur(more)} € de plus</b>.${heater?html` Avec le chauffe-eau ${when}, l'écart passerait à <b>${num(more+heater.euros_an,0)} €</b>.`:''}</p>${kva}</div>`
   :html`<div class="u-verdict"><p class="u-k">Votre option heures creuses</p><p class="u-big">${saves?'Rentable, si…':'La Base coûterait moins'}</p>
    <p class="u-n">En Base, ces 12 mois auraient coûté <b>${eur(-more)} € de moins</b>.${saves?` Avec le chauffe-eau ${when}, les heures creuses redeviendraient rentables.`:''}</p>${kva}</div>`;
  const side=verdict===nothing?(pw&&lo?html`<div class="u-verdict"><p class="u-k">Votre contrat</p>${kva}</div>`:nothing)
   :html`${verdict}`;
  return html`<div class="usage"><div class="u-top">${gauge}${side}</div></div>`;
 }
 /** « Quand tournent vos machines » (maquette C): each device that can wait, its year in the sun, at night and in paid
     peak hours; then each month's days with sun to spare for a machine. */
 private _machines(v:View){
  const u=v.usage;if(!u?.appareils.length)return nothing;
  const sun=!!v.equipement.soleil,night=atNight(offpeak(v.heures_creuses)),pc=(x:number)=>Math.round(x*100);
  const p=u.prix,say=html`${sun&&p.soleil!=null?html`Au soleil, un kWh ne coûte que la revente perdue, <b>${price(p.soleil)} €</b> ; `:''}${night?'la nuit':'en heures creuses'}, <b>${price(p.hc)} €</b> ; en heures pleines, <b>${price(p.hp)} €</b>.`;
  const bars=html`<div class="mach">${u.appareils.map(a=>html`<span class="mn">${a.nom}<small>${kwh(a.kwh)} kWh par an</small></span>
    <span class="stack" role="img" aria-label="${sun?`${pc(a.soleil)} % au soleil, `:''}${pc(a.nuit)} % ${night?'la nuit':'en heures creuses'}, ${pc(a.pleines)} % en heures pleines">${sun?html`<i style="width:${a.soleil*100}%;--c:var(--nw-sun)"></i>`:nothing}<i style="width:${a.nuit*100}%;--c:var(--nw-cold)"></i><i style="width:${a.pleines*100}%;--c:var(--nw-home)"></i></span>
    <span class="me">${a.euros_an>=1?html`<b>${num(a.euros_an,0)} €</b><small>par an</small>`:html`<small>rien à gagner</small>`}</span>`)}</div>
   <div class="nw-legend">${sun?html`<span><i style="--c:var(--nw-sun)"></i>au soleil</span>`:nothing}<span><i style="--c:var(--nw-cold)"></i>${night?'la nuit':'en heures creuses'}</span><span><i style="--c:var(--nw-home)"></i>en heures pleines</span></div>`;
  const months=u.soleil_mois.filter(m=>m.sur>=20),letters='JFMAMJJASOND';
  const sunny=sun&&months.length>=6?this._enc('Du soleil en trop, mois par mois',`Les jours où le soleil en trop suffit pour une machine. Les autres jours, Hestia dit d'attendre ${night?'la nuit':'les heures creuses'}, d'après la prévision du jour.`,
   html`<div class="smonths">${months.map(m=>html`<span class="sm" title="${m.jours} jours sur ${m.sur}"><i style="height:${Math.max(4,m.jours/m.sur*100)}%"></i><small>${letters[Number(m.mois.slice(5))-1]}</small></span>`)}</div>`,{wide:true}):nothing;
  return html`${this._enc('Quand tournent vos machines',say,bars,{wide:true,aside:'12 derniers mois'})}${sunny}`;
 }

 /* ── Advice « à froid »: one line each, the gesture and what it brings; a touch opens its detail card ── */
 private _saySave(p:Piste){return html`Pour économiser : ${p.titre.charAt(0).toLowerCase()+p.titre.slice(1)}, <b>${num(p.euros_an!,0)} € ${p.unite??'par an'}</b>.`;}
 /** « Pour économiser » as maquette D says it (Frank, 19 Nov. 2026): today, better, the gain; for the water heater and
     the machines, a strip of the 24 hours under each (when they run now, when they would). */
 private _better(p:Piste){
  // French spacing: no line break before « : », « % », « € », nor inside « 0 h 30 » or « 190 W ».
  const fr=(t:string)=>t.replace(/ ([:;!?%€])/g,'\u00a0$1').replace(/(\d) (?=(W|kWh|h|centimes)(\s|$|[ .,:]))/g,'$1\u00a0').replace(/ h (\d)/g,'\u00a0h\u00a0$1');
  const [ic0,c]=PISTE_LOOK[p.id]??['home','--nw-home'],ic=p.zones?deviceIcon(p):ic0,key=p.rubrique&&(RUBRICS as readonly string[]).includes(p.rubrique)?p.rubrique as Rubric:undefined;
  const shown=p.gain??p.euros_an;
  const body=html`<span class="ico" style="--c:var(${c})">${icon(ic)}</span><span class="bt">${p.nom??p.titre}</span>
   <span class="bn"><small>${p.zones?"D'habitude":"Aujourd'hui"}</small>${fr(p.maintenant!)}</span>
   <span class="ba" aria-hidden="true">→</span>
   <span class="bm"><small>Mieux</small>${fr(p.mieux??'')}</span>
   ${shown!=null?html`<span class="pe"><b>${num(shown,0)} €</b><small>${fr(p.sous??p.unite??'par an')}</small></span>`:nothing}
   ${p.zones?this._frise(p):nothing}`;
  return key?html`<button class="piste wide" style="--c:var(${c})" @click=${()=>{this._open=key;}}>${body}</button>`:html`<div class="piste wide" style="--c:var(${c})">${body}</div>`;
 }
 /** One strip for a device, after Weather's timeline of events (Frank, 20 Nov. 2026): the day's prices as segments
     (off-peak, sun, peak), its usual starts as pins with its pictogram and their hour, the hour to start it as a green pin
     (one green pin when a usual start is already there), and under it what the strip covers. */
 private _frise(p:Piste){
  const zones=p.zones!,at=(m:number)=>zones.find(z=>z[0]<=m%1440&&m%1440<z[1])?.[2]??'hp';
  const best=p.lancer??null,dev=deviceIcon(p);
  type Pin={m:number;tone:string;ic:string;good:boolean};
  const pins:Pin[]=(p.departs??[]).map(([m])=>({m,tone:ZONE[at(m)][0],ic:dev,good:false}));
  if(best!=null){
   const near=pins.find(q=>Math.min(Math.abs(q.m-best),1440-Math.abs(q.m-best))<=90);
   if(near){near.good=true;near.tone='--nw-benefit';}else pins.push({m:best,tone:'--nw-benefit',ic:'check',good:true});
  }
  pins.sort((u,v)=>u.m-v.m);
  // Pins closer than four hours keep only their pictogram: the hour is in the sentence above (Weather does the same).
  const tight=pins.some((q,i)=>i>0&&q.m-pins[i-1].m<240);
  const x=(m:number)=>m/1440*100,edge=(m:number)=>x(m)<7?'l':x(m)>93?'r':'';
  const span=p.jours&&p.jours<365?`les ${Math.round(p.jours/30)} derniers mois`:'les 12 derniers mois';
  return html`<span class="fr${tight?' tight':''}" aria-hidden="true">
   <span class="fr-pins">${pins.map(q=>html`<span class="fr-pin ${edge(q.m)}${q.good?' good':''}" style="left:${x(q.m).toFixed(2)}%;--tone:var(${q.tone})"><span class="chip">${q.good&&q.ic!=='check'?html`${icon('check')}${icon(q.ic)}`:icon(q.ic)}<span class="fr-h">${hm(q.m)}</span></span><span class="stem"></span></span>`)}</span>
   <span class="fr-lane">${zones.map(([a,b,k])=>{const [tone,pic,word]=ZONE[k],h=(b-a)/60;
     return html`<span class="fr-seg" style="flex:${b-a};--tone:var(${tone})">${pic&&h>=2?icon(pic):nothing}${h>=4?html`<span class="w">${word}</span>`:nothing}</span>`;})}</span>
   <span class="hrs-x"><span>0 h</span><span>6 h</span><span>12 h</span><span>18 h</span><span>24 h</span></span>
   <span class="fr-say">${p.departs?.length?html`<span><i>${icon(dev)}</i>ses départs habituels, sur ${span}</span>`:html`<span>il démarre à toute heure, sur ${span}</span>`}${best!=null?html`<span><i class="ok">${icon('check')}</i>l'heure à viser</span>`:nothing}</span>
  </span>`;
 }
 private _piste(p:Piste){
  const [ic,c]=PISTE_LOOK[p.id]??['home','--nw-home'],key=p.rubrique&&(RUBRICS as readonly string[]).includes(p.rubrique)?p.rubrique as Rubric:undefined;
  const body=html`<span class="ico" style="--c:var(${c})">${icon(ic)}</span><span class="pt">${p.titre}</span><span class="pw">${p.pourquoi}</span>
   ${p.euros_an!=null?html`<span class="pe"><b>${num(p.euros_an,0)} €</b><small>${p.unite??'par an'}</small></span>`:nothing}`;
  return key?html`<button class="piste" style="--c:var(${c})" @click=${()=>{this._open=key;}}>${body}</button>`:html`<div class="piste" style="--c:var(${c})">${body}</div>`;
 }
 /** What one more piece of equipment, or one word in Réglages, would bring: dashed, never counted as advice. */
 private _ups(v:View){
  const out:[string,string,string][]=[];
  if((v.contrat?.a_confirmer??[]).includes('option'))out.push(['doc','Un conseil sur votre contrat ?','Dites votre option et vos heures creuses dans les Réglages : Hestia vous dira si elles rapportent.']);
  if(!v.equipement.direct)out.push(['bolt','Les gestes au bon moment','Un module sur la prise du Linky : heures creuses, disjoncteur, le prix de l’heure.']);
  else if(!v.equipement.appareils)out.push(['plug','Savoir ce qui consomme','Une prise mesurée sur le frigo ou le chauffe-eau : la veille appareil par appareil, l’appareil oublié.']);
  return out.map(([ic,t,w])=>html`<div class="piste up"><span class="ico">${icon(ic)}</span><span class="pt">${t}</span><span class="pw">${w}</span></div>`);
 }
 /* ── 4 · Conseils: the advice « à froid » alone, the most euros first (card: conseils) ── */
 private _advice(v:View){
  const all=v.pistes??[],year=all.filter(p=>p.unite==='par an').reduce((a,p)=>a+(p.euros_an??0),0);
  const hero=year>0?{val:num(year,0),unit:'€',cap:'par an à gagner, au plus'}:all.length?{val:String(all.length),cap:`conseil${all.length>1?'s':''} pour vous`}:{msg:'Rien à changer pour l’instant'};
  const why=all.length?`${all.length>1?`${all.length} conseils tirés`:'Un conseil tiré'} de vos 12 derniers mois, du plus rentable au moins rentable.`:'Hestia regarde chaque jour vos habitudes et votre contrat ; un conseil apparaîtra ici dès qu’il vaut la peine.';
  return html`<ha-card>${this._ans({ic:'home',c:'--nw-home',subject:'Pour économiser',period:'à froid, en euros',...hero,why,over:false})}
   <div class="pistes">${all.map(p=>this._piste(p))}${this._ups(v)}</div></ha-card>
   ${this._open?html`<div class="ov" @click=${(e:Event)=>{if(e.target===e.currentTarget)this._open=undefined;}}
    @keydown=${(e:KeyboardEvent)=>{if(e.key==='Escape')this._open=undefined;}}><ha-card class="sheet" role="dialog" aria-modal="true">${this._detail(v,this._open,true)}</ha-card></div>`:nothing}`;
 }

 /* ── 3 · The detail cards: the answer header, then the panels ── */
 /** The header of a card (maquette des cartes 4, 17 Nov. 2026): the subject in a title, its period in grey beside it; then
     the figure big and its words small, as Hestia Weather shows its temperature; then why, in grey. `msg`: no figure yet. */
 private _ans(o:{ic:string;c:string;subject:string;period:string;val?:string;unit?:string;cap?:unknown;msg?:unknown;why?:unknown;pill?:[string,string];over:boolean}){
  return html`<div class="ans-k"><span class="ico" style="--c:var(${o.c})">${icon(o.ic)}</span><span class="nw-title">${o.subject}</span><span class="per">${o.period}</span>
    ${o.pill?html`<span class="pastille" style="--c:var(${o.pill[1]})">${o.pill[0]}</span>`:nothing}
    ${o.over?html`<button class="d-close" aria-label="Fermer" @click=${()=>{this._open=undefined;}}>×</button>`:nothing}</div>
   <div class="ans">${o.val!=null?html`<p class="hero"><b>${o.val}${o.unit?html`<small>${o.unit}</small>`:nothing}</b>${o.cap?html`<span>${o.cap}</span>`:nothing}</p>`
    :o.msg?html`<p class="ans-m">${o.msg}</p>`:nothing}${o.why?html`<p class="ans-w">${o.why}</p>`:nothing}</div>`;
 }
 private _enc(title:string,say:unknown,body?:unknown,o:{wide?:boolean;aside?:unknown;foot?:unknown}={}){
  return html`<div class="nw-panel${o.wide?' wide':''}"><div class="nw-panel-head"><h3><span>${title}</span></h3>${o.aside?html`<span class="aside">${o.aside}</span>`:nothing}</div>
   ${say?html`<p class="say">${say}</p>`:nothing}${body??nothing}${o.foot?html`<div class="foot">${o.foot}</div>`:nothing}</div>`;
 }
 /** « aujourd'hui, jusqu'à 17 h »: the statistics' last whole hour today. */
 private _until(v:View){const s=v.jusqu_ici;return s?`aujourd'hui, jusqu'à ${hour(new Date(s.jusqu_a).getHours())}`:'aujourd\'hui';}
 private _detail(v:View,key:Rubric,over:boolean):TemplateResult{
  switch(key){
   case 'soleil':return this._sun(v,over);
   case 'chauffage':return this._heat(v,over);
   case 'veille':return this._night(v,over);
   case 'eau':return this._water(v,over);
   case 'appareils':return this._devices(v,over);
   case 'pointe':return this._peak(v,over);
   case 'chauffe_eau':return this._heater(v,over);
   default:return this._contract(v,over);
  }
 }

 private _sun(v:View,over:boolean){
  const j=v.jour,s=v.soleil_jour,head={ic:'sun',c:'--nw-sun',subject:'Soleil',period:this._until(v),over};
  if(!v.equipement.soleil||j?.soleil_kwh==null)return this._ans({...head,period:'aujourd\'hui',msg:'Pas de panneaux dans la page Énergie',why:'Ajoutez leur production dans la page Énergie de Home Assistant : Hestia la lira.'});
  if(j.soleil_kwh<0.05)return this._ans({...head,msg:'Les panneaux n\'ont encore rien produit',why:'Le soleil arrive : cette carte se remplit au fil des heures.'});
  const sold=j.revendu_kwh??0,kept=Math.max(0,j.soleil_kwh-sold);
  const top=s?.plus_fort,hours=(v.heures?.aujourdhui??[]).map(h=>h.soleil);
  const p=v.panneaux,groups=s?.groupes??[];
  const health=p?.onduleur_muet_min?html`L'onduleur ne répond plus depuis <b>${p.onduleur_muet_min<120?`${p.onduleur_muet_min} min`:`${Math.round(p.onduleur_muet_min/60)} h`}</b>.`
   :p?.en_retrait?.length?html`<b>${p.en_retrait[0].nom}</b> produit ${p.en_retrait[0].pourcent_de_moins} % de moins que d'habitude : à regarder.`
   :html`Les <b>${groups.length} groupes</b> ont produit comme d'habitude : aucun ne faiblit.`;
  return html`${this._ans({...head,val:kwh(j.soleil_kwh),unit:'kWh',cap:'produits par les panneaux',
    why:j.soleil_garde!=null?html`La maison en a gardé <b>${j.soleil_garde} %</b>.${sold>=0.05?html` Le reste, ${kwh(sold)} kWh, est parti au réseau${j.revendu_euros!=null&&this._paid(v)?html` pour <b>${eur(j.revendu_euros)} €</b>`:''}.`:''}`:nothing})}
   <div class="encs">
    ${this._enc('Heure par heure',top?html`Le soleil a donné le plus entre <b>${hour(top.h)} et ${hour(top.h+1)} : ${kwh(top.kwh)} kWh</b>. C'est à ces heures-là qu'une machine tourne au soleil.`:nothing,
     html`${cols(hours,'--nw-sun',{pin:x=>`${kwh(x)} kWh`})}${H_TICKS}`,{wide:true})}
    ${this._enc('Où est parti le soleil',s?.prix_evite!=null&&this._paid(v)?html`Le garder vaut mieux que le vendre : il évite <b>${price(s.prix_evite)} €</b> le kWh, la revente n'en paie que <b>${price(v.contrat.revente)} €</b>.`
     :html`La maison en a gardé <b>${kwh(kept)} kWh</b>.`,
     html`<div><div class="split"><i style="width:${kept/j.soleil_kwh*100}%;--c:var(--nw-benefit)"></i><i style="width:${sold/j.soleil_kwh*100}%;--c:var(--nw-sun)"></i></div>
      <div class="split-l"><span>gardé <b>${kwh(kept)} kWh</b></span><span>${this._paid(v)?'vendu':'injecté'} <b>${kwh(sold)} kWh${j.revendu_euros!=null&&this._paid(v)?` · ${eur(j.revendu_euros)} €`:''}</b></span></div></div>`)}
    ${groups.length?this._enc('Chaque groupe de panneaux',health,hb(top5(groups.map(g=>({n:g.nom,v:g.kwh,txt:`${kwh(g.kwh)} kWh`})),x=>`${kwh(x)} kWh`),'--nw-sun')):nothing}
   </div>`;
 }

 private _heat(v:View,over:boolean){
  if(v.cout_chauffage)return this._heatCost(v,v.cout_chauffage,over);
  const h=v.chauffage,st=h?.poele,stove=st?.saison,el=h?.etat==='pret'?h.saison:null,sum=this._heatSum(v);
  const head={ic:'flame',c:'--nw-heat',subject:'Chauffage',period:'depuis le 1er octobre',over};
  const why:Record<string,string>={sans_meteo:'Pour estimer les radiateurs, Hestia a besoin du froid de chaque jour : ajoutez Hestia Météo.',
   meteo_ancienne:'Pour estimer les radiateurs, Hestia a besoin du froid de chaque jour : mettez Hestia Météo à jour.',
   meteo_incompatible:'Hestia Météo n\'a pas la même version qu\'Énergie : mettez les deux à jour ensemble.',
   meteo_sans_lieu:'Pour estimer les radiateurs, ajoutez votre maison dans Hestia Météo.',
   meteo_sans_donnees:'Hestia Météo ne donne pas le froid des jours passés : choisissez un capteur de température dans ses réglages.',
   apprend:'Il faut quelques semaines de froid pour estimer les radiateurs. Revenez cet hiver.',
   peu_lie:'Votre électricité varie peu avec le froid : vous chauffez sans doute surtout avec une autre énergie.'};
  const how='Radiateurs : estimés en comparant chaque jour votre électricité au froid qu\'il a fait.';
  let val='',unit='',cap='',answer:unknown;
  if(sum?.both){val=sum.val;unit='€';cap='pour se chauffer';answer=html`Le poêle <b>${eur(stove!.eur)} €</b> de granulés, les radiateurs électriques <b>environ ${eur(el!.eur)} €</b>.`;}
  else if(stove){[val,unit,cap]=stove.eur!=null?[eur(stove.eur),'€','de granulés pour le poêle']:[num(stove.kg,0),'kg','de granulés brûlés'];
   answer=html`${stove.eur!=null?html`<b>${num(stove.kg,0)} kg</b> de granulés. `:''}${el?html`Les radiateurs, <b>environ ${el.eur!=null?`${eur(el.eur)} €`:`${kwh(el.kwh)} kWh`}</b>.`:why[h?.etat??'']??''}`;}
  else if(el){[val,unit,cap]=el.eur!=null?[eur(el.eur),'€','de radiateurs, environ']:[kwh(el.kwh),'kWh','de radiateurs, environ'];answer=how;}
  else return this._ans({...head,msg:h?.etat==='peu_lie'?'Une autre énergie chauffe la maison':'Le chauffage n\'est pas encore estimé',why:why[h?.etat??'']??'Ajoutez Hestia Météo, ou le suivi de votre poêle.'});
  const share=sum?.both&&el?.eur!=null&&stove?.eur!=null?stove.eur/(stove.eur+el.eur):null;
  const who=share==null?nothing:this._enc('Qui chauffe',share>=.4&&share<=.6?html`Le poêle et les radiateurs font <b>chacun la moitié</b> de la dépense.`
    :html`${share>.6?'Le poêle fait':'Les radiateurs font'} <b>${Math.round((share>.6?share:1-share)*100)} %</b> de la dépense.`,
   hb([{n:'Poêle',v:stove!.eur!,txt:`${eur(stove!.eur)} €`,sub:`${num(stove!.kg,0)} kg`},{n:'Radiateurs',v:el!.eur!,txt:`${eur(el!.eur)} €`,sub:`${kwh(el!.kwh)} kWh`}],'--nw-heat'),{foot:how});
  const deg=h?.euros_par_degre;
  const cold=deg!=null&&el?this._enc('Le froid fait la facture',html`Chaque degré de froid en plus coûte <b>environ ${cents(deg)} € par jour</b> de radiateurs.`,nothing,
   {foot:html`Exemple : un jour à 5 °C au lieu de 10 °C, <b>${eur(deg*5)} €</b> de plus.`}):nothing;
  const stock=st?.stock_kg;
  const bags=stock!=null&&st?.sac_kg?Math.round(stock/st.sac_kg*10)/10:null;
  const pellets=stock!=null&&stove?this._enc('Granulés en stock',stock<=0?html`<b>Plus de granulés</b> en stock.`
    :html`Il reste <b>${bags!=null?`${num(bags,1)} sac${bags>1?'s':''} (${num(stock,0)} kg)`:`${num(stock,0)} kg`}</b>${st?.jours_restants!=null?html` : au rythme de cette saison, <b>environ ${st.jours_restants} jours</b> de poêle`:''}.`,
   html`<div><div class="track" style="--c:var(--nw-heat)"><i style="width:${stove.kg+stock>0?stove.kg/(stove.kg+stock)*100:0}%"></i></div>
    <div class="track-l"><span>brûlés <b>${num(stove.kg,0)} kg</b></span><span>en stock <b>${num(stock,0)} kg</b></span></div></div>`):nothing;
  return html`${this._ans({...head,val,unit,cap,why:answer})}<div class="encs">${who}${cold}${pellets}</div>`;
 }

 /** With Hestia Chauffage 1.1 or later: one cost of the heating, its own, shown as it is (Frank, 26 Nov. 2026). The
     pellets in stock stay Énergie's (Suivi Stock Pellet). */
 private _heatCost(v:View,c:HeatCost,over:boolean){
  const m=c.mois,t=c.aujourdhui,y=c.hier;
  type Part={electrique_eur:number|null;granules_eur:number|null;electrique_kwh:number|null;granules_kg:number|null};
  // « Radiateurs 1,20 €, poêle 2,10 €. » : each part that heated, in euros when its price is known.
  const say=(d:Part,first=true)=>{const p=[...(d.electrique_kwh?[html`${first?'R':'r'}adiateurs <b>${d.electrique_eur!=null?`${eur(d.electrique_eur)} €`:`${kwh(d.electrique_kwh)} kWh`}</b>`]:[]),
   ...(d.granules_kg?[html`${first&&!d.electrique_kwh?'P':'p'}oêle <b>${d.granules_eur!=null?`${eur(d.granules_eur)} €`:`${num(d.granules_kg,0)} kg`}</b>`]:[])];
   return p.length?html`${p[0]}${p[1]?html`, ${p[1]}`:nothing}.`:nothing;};
  const rows:Bar[]=[...(m.electrique_eur!=null&&m.electrique_kwh?[{n:'Radiateurs',v:m.electrique_eur,txt:`${eur(m.electrique_eur)} €`,sub:`${kwh(m.electrique_kwh)} kWh`}]:[]),
   ...(m.granules_eur!=null&&m.granules_kg?[{n:'Poêle',v:m.granules_eur,txt:`${eur(m.granules_eur)} €`,sub:`${num(m.granules_kg,0)} kg`}]:[])];
  const days=this._enc('Aujourd\'hui et hier',html`Aujourd'hui <b>${t.chauffage_eur!=null?`${eur(t.chauffage_eur)} €`:'—'}</b> : ${say(t,false)}${y?html` Hier <b>${y.chauffage_eur!=null?`${eur(y.chauffage_eur)} €`:'—'}</b> : ${say(y,false)}`:nothing}`,nothing);
  const who=rows.length>1?this._enc('Qui chauffe',html`Ce mois-ci, ${say(m,false)}`,hb(rows,'--nw-heat')):nothing;
  const won=m.gagne_eur!=null&&m.gagne_eur>0?this._enc('Le poêle fait gagner',html`Ce mois-ci, <b>${eur(m.gagne_eur)} €</b> de moins qu'avec la même chaleur à l'électricité.`,nothing):nothing;
  const st=v.chauffage?.poele,stock=st?.stock_kg,bags=stock!=null&&st?.sac_kg?Math.round(stock/st.sac_kg*10)/10:null;
  const pellets=stock!=null?this._enc('Granulés en stock',stock<=0?html`<b>Plus de granulés</b> en stock.`
    :html`Il reste <b>${bags!=null?`${num(bags,1)} sac${bags>1?'s':''} (${num(stock,0)} kg)`:`${num(stock,0)} kg`}</b>${st?.jours_restants!=null?html` : <b>environ ${st.jours_restants} jours</b> de poêle`:''}.`,nothing):nothing;
  const known=m.chauffage_eur!=null;
  return html`${this._ans({ic:'flame',c:'--nw-heat',subject:'Chauffage',period:'ce mois-ci',over,val:known?eur(m.chauffage_eur!):'—',unit:known?'€':'',cap:'pour se chauffer',
    why:html`Compté par <b>Hestia Chauffage</b>, au prix de chaque heure${m.jours<new Date().getDate()?` (${m.jours} jours connus)`:''}.${known?'':' Une partie n\'a pas encore de prix connu.'}`})}
   <div class="encs">${days}${who}${won}${pellets}</div>`;
 }

 private _night(v:View,over:boolean){
  const w=v.veille,hist=v.veille_historique??[],head={ic:'moon',c:'--nw-watch',subject:'Veille',over};
  if(!w)return this._ans({...head,period:'les dernières nuits',msg:'La veille n\'est pas encore connue',why:'Il faut deux semaines de nuits mesurées heure par heure.'});
  const n=w.nuit,e=w.evolution;
  const rows:Bar[]=(n?.appareils??[]).map(r=>({n:r.nom,v:r.w,txt:`${r.w} W`,sub:r.euros_par_an!=null?`${year(r.euros_par_an)} € par an`:undefined}));
  if(n?.sans_prise_w)rows.push({n:'Sans prise mesurée',v:n.sans_prise_w,txt:`${n.sans_prise_w} W`,sub:n.sans_prise_euros_par_an!=null?`${year(n.sans_prise_euros_par_an)} € par an`:undefined,dash:true});
  rows.sort((a,b)=>b.v-a.v);
  const what=n&&rows.length?this._enc('Ce qui tourne la nuit',n.sans_prise_w?html`Les prises mesurées expliquent <b>${n.mesure_w} W</b>. Les <b>${n.sans_prise_w} W</b> qui restent viennent d'appareils sans prise mesurée : c'est là qu'il faut chercher.`
    :html`Les prises mesurées expliquent toute la veille : <b>${n.mesure_w} W</b>.`,hb(top5(rows,x=>`${Math.round(x)} W`),'--nw-watch'),{wide:true,aside:'au plus calme de la nuit'}):nothing;
  const since=e?dayMonth(e.debut):'';
  const drift=hist.length>1?this._enc('Nuit après nuit',e&&Math.abs(e.ecart_w)>=10?html`Elle est passée de <b>${e.debut_w} W à ${w.w} W</b> depuis le ${since}${e.ecart_euros_par_an!=null?html` : <b>environ ${year(Math.abs(e.ecart_euros_par_an))} € par an</b> de ${e.ecart_w<0?'moins':'plus'}`:''}.`
    :html`Elle reste autour de <b>${w.w} W</b> depuis le ${since}.`,
   html`${cols(hist.map(x=>x.w),'--nw-watch',{pin:x=>`${x} W`,max:Math.max(...hist.map(x=>x.w))*1.09})}<div class="ticks"><span>${dayOf(hist[0].jour)} ${SHORT[noon(hist[0].jour).getMonth()]}</span><span>cette nuit</span></div>`,{wide:true}):nothing;
  return html`${this._ans({...head,period:`les ${hist.length>1?hist.length:w.nuits} dernières nuits`,val:String(w.w),unit:'W',cap:'quand tout dort',
    why:w.euros_par_an!=null?html`La maison les tire jour et nuit, même sans rien allumer : <b>environ ${year(w.euros_par_an)} € par an</b>.`:'Ce fond tourne jour et nuit, même sans rien allumer.'})}
   <div class="encs">${what}${drift}</div>`;
 }

 private _water(v:View,over:boolean){
  const e=v.eau,now=new Date(),leak=v.direct?.fuite?.minutes,head={ic:'drop',c:'--nw-water',subject:'Eau',over};
  if(!e)return this._ans({...head,period:'ce mois-ci',msg:'Pas de compteur d\'eau',why:'Ajoutez-le dans la page Énergie de Home Assistant : Hestia le lira.'});
  const days=e.jours??[],month=MONTHS[now.getMonth()];
  const pill:[string,string]=leak?[`L'eau coule depuis ${Math.round(leak)} min`,leak>=60?'--nw-alert':'--nw-act']:['Pas de fuite','--nw-benefit'];
  const big=e.plus_gros;
  const ticks=days.map((d,i)=>i===days.length-1?'auj.':days.length<=12||[0,7,14,21,28].includes(i)?String(noon(d.jour).getDate()):'');
  return html`${this._ans({...head,period:`${month}, du 1er au ${now.getDate()}`,pill,
    val:num(e.mois_l,0),unit:'litres',cap:e.mois_euros!=null?html`soit <b>${bill(e.mois_euros)} €</b>`:nothing,
    why:html`${e.l_par_jour!=null?html`Environ <b>${num(e.l_par_jour,0)} litres par jour</b>. `:''}${e.prix_m3!=null?html`L'eau coûte ${price(e.prix_m3)} € le m³, soit <b>${price(e.euros_100_l)} € les 100 litres</b>.`:''}`})}
   ${days.length?html`<div class="encs">${this._enc('Jour par jour',big?html`Le plus gros jour : <b>le ${dayMonth(big.jour)}, ${num(big.l,0)} litres</b>${big.euros!=null?`, soit ${eur(big.euros)} €`:''}. Un jour qui sort du lot se voit tout de suite.`:nothing,
    html`${cols(days.map(d=>d.l),'--nw-water',{pin:x=>`${num(x,0)} L`,part:days.length-1})}<div class="ticks days">${ticks.map(t=>html`<span>${t}</span>`)}</div>`,{wide:true})}</div>`:nothing}`;
 }

 private _devices(v:View,over:boolean){
  const a=v.appareils_jour,running=v.direct?.en_marche??[],head={ic:'plug',c:'--nw-home',subject:'Appareils',period:this._until(v),over};
  if(!a||!a.appareils.length)return this._ans({...head,msg:'Aucun appareil mesuré',why:'Ajoutez vos prises mesurées dans la page Énergie de Home Assistant (consommation individuelle).'});
  const live=new Map(running.map(r=>[r.nom,r.w])),top=a.appareils[0];
  const rows:Bar[]=a.appareils.map(r=>({n:r.nom,v:r.kwh,txt:`${kwh(r.kwh)} kWh`,sub:r.euros!=null?`${eur(r.euros)} €`:undefined,live:live.has(r.nom)?`${kw(live.get(r.nom)!)} kW`:undefined}));
  // A device that runs now but has nothing counted yet today still shows, with its live power.
  for(const r of running)if(!rows.some(x=>x.n===r.nom))rows.push({n:r.nom,v:0,txt:'0 kWh',live:`${kw(r.w)} kW`});
  const shown=rows.filter((r,i)=>i<5||r.live),rest=rows.filter(r=>!shown.includes(r)),restKwh=rest.reduce((s,r)=>s+r.v,0);
  const plural=rest.length>1?'s':'';
  const foot=rest.length||a.sans_prise_kwh?html`${rest.length?html`Et ${rest.length} autre${plural} appareil${plural} mesuré${plural} : <b>${kwh(restKwh)} kWh</b>. `:''}${a.sans_prise_kwh?html`Les ${kwh(a.sans_prise_kwh)} kWh restants viennent d'appareils sans prise mesurée.`:''}`:nothing;
  return html`${this._ans({...head,val:kwh(top.kwh),unit:'kWh',cap:html`<b>${top.nom}</b>, le plus gros`,
    why:html`Les appareils mesurés font <b>${kwh(a.mesure_kwh)} kWh</b> sur les ${kwh(a.maison_kwh)} kWh de la maison.`})}
   <div class="encs">${this._enc('Appareil par appareil',top.euros!=null?html`Ce que chacun a coûté depuis minuit, soleil déduit : ${top.nom} <b>${eur(top.euros)} €</b>.`:'Ce que chacun a consommé depuis minuit.',
    hb(shown,'--nw-home'),{wide:true,aside:running.length?html`<span class="live">en marche</span>`:nothing,foot})}</div>`;
 }

 private _peak(v:View,over:boolean){
  const p=v.pointe,kva=v.contrat?.kva,hours=(v.heures?.aujourdhui??[]).map(h=>h.achat),head={ic:'bolt',c:'--nw-grid',subject:'Pointe',period:'aujourd\'hui',over};
  if(!p)return this._ans({...head,msg:'Pas encore d\'heure mesurée aujourd\'hui',why:'La pointe se lit heure par heure : il faut le compteur heure par heure.'});
  const high=p.part!=null&&p.part>=.7;
  const ranges=offpeak(v.heures_creuses),band=(i:number)=>ranges.some(([a,b])=>i*60+30>=a&&i*60+30<b);
  const far=p.part==null?'':p.part<.5?'vous en êtes loin':p.part<.8?'il reste de la marge':'vous en êtes tout près';
  return html`${this._ans({...head,pill:kva?(high?['Près de la limite','--nw-act']:['De la marge','--nw-benefit']):undefined,
    val:kw(p.kw*1000),unit:'kW',cap:`pris au réseau entre ${hour(p.h)} et ${hour(p.h+1)}`,
    why:html`${kva?html` Le compteur coupe au-delà de <b>${kva} kVA</b> (environ ${kva} kW) : ${far}.`:'L\'heure la plus chargée de la journée.'}`})}
   <div class="encs">${this._enc('Heure par heure',p.part!=null?html`La barre la plus haute reste à <b>${part(p.part)} de la limite</b> : ${high?'deux gros appareils de plus pourraient faire couper le compteur':'rien ne risque de faire couper le compteur'}.`:nothing,
    html`${cols(hours,'--nw-grid',{pin:x=>`${kw(x*1000)} kW`,bands:ranges.length?band:undefined,tall:true,...(kva?{max:kva*1.07,limit:kva,limitLabel:`limite ${kva} kVA`}:{})})}${H_TICKS}
     <div class="nw-legend"><span><i style="--c:var(--nw-grid)"></i>pris au réseau, en moyenne sur l'heure</span>${ranges.length?html`<span><i style="--c:color-mix(in oklab, var(--nw-cold) 40%, transparent)"></i>heures creuses</span>`:nothing}</div>`,{wide:true})}</div>`;
 }

 private _heater(v:View,over:boolean){
  const w=v.chauffe_eau,head={ic:'heater',c:'--nw-water',subject:'Chauffe-eau',period:'les prochaines heures',over};
  if(!w)return this._ans({...head,msg:'Pas de chauffe-eau dans la page Énergie',why:'Ajoutez sa prise mesurée dans la page Énergie de Home Assistant (consommation individuelle) : Hestia préparera son plan de chauffe.'});
  const pill:[string,string]=w.simulation?['Simulation : rien n’est commandé','--nw-watch']:w.chauffer?['Chauffe','--nw-act']:w.raison==='plein'?['Plein','--nw-benefit']:['En attente','--nw-cold'];
  const runs=w.plan.slice(0,5);
  const sun=w.soleil_prevu==='prevision'?'la prévision solaire de la page Énergie':w.soleil_prevu==='nuages'?'les nuages prévus par Hestia Météo':w.soleil_prevu==='habitude'?'la production habituelle des panneaux':null;
  const plan=this._enc('Le plan',sun?html`Refait toutes les 5 minutes, avec ${sun} et vos prix.`:'Refait toutes les 5 minutes, avec vos prix.',heaterChart(w),{wide:true,
   foot:w.kwh_prevus!=null?html`Prévu : <b>${kwh(w.kwh_prevus)} kWh</b>${w.cout_prevu!=null?html`, <b>${eur(w.cout_prevu)} €</b>`:''} d'ici demain soir.`:nothing});
  const next=runs.length?this._enc('Les prochaines chauffes',nothing,html`<div class="hb list">${runs.map(r=>html`<span class="n"><i class="dot" style="--c:var(${SOURCE_C[r.source]??'--nw-home'})"></i>${clock(new Date(r.debut))} – ${clock(new Date(r.fin))}<small>${SOURCE_W[r.source]??''}</small></span>
    <span class="v">${kwh(r.kwh)} kWh<small>${eur(r.euros)} €</small></span>`)}</div>`):nothing;
  const days=w.bilan.filter(d=>d.reel_kwh>=0.05||d.hestia_kwh>=0.05);
  const real=days.reduce((s,d)=>s+d.reel_eur,0),hestia=days.reduce((s,d)=>s+d.hestia_eur,0),hc=days.reduce((s,d)=>s+d.hc_eur,0);
  const review=days.length?this._enc(`Les ${days.length} dernier${days.length>1?'s':''} jour${days.length>1?'s':''}`,w.simulation
    ?html`Votre chauffe-eau a coûté <b>${eur(real)} €</b>. En suivant le plan, il aurait coûté <b>${eur(hestia)} €</b>.`
    :html`Avec le plan, <b>${eur(hestia)} €</b>. En heures creuses simples, la même eau aurait coûté <b>${eur(hc)} €</b>.`,
    hb(days.map(d=>({n:dayMonth(d.jour),v:w.simulation?Math.max(d.reel_eur,d.hestia_eur):d.hestia_eur,txt:`${eur(d.hestia_eur)} €`,
      sub:w.simulation?`réel ${eur(d.reel_eur)} €`:`${kwh(d.hestia_kwh)} kWh`})),'--nw-water'),{foot:w.simulation?'Le plan est calculé sur la même maison, minute par minute : rien n’a été commandé.':nothing}):nothing;
  const todo:string[]=[];
  if(w.manque.includes('litres'))todo.push('le volume du ballon, pour une réserve juste');
  if(w.manque.includes('prise'))todo.push('la prise qui le commande');
  if(w.manque.includes('besoin'))todo.push('quelques jours encore, pour apprendre combien d’eau chaude la maison tire');
  const settings=this._enc('Réglages',html`Mode <b>${MODE_W[w.mode]??w.mode}</b>${w.simulation?' : Hestia montre ce qu’il ferait, votre automatisation ne fait rien.':'.'}
    ${w.suit===false?html` <b>La prise ne suit pas le plan</b> : vérifiez l’automatisation.`:nothing}${todo.length?html` Il manque ${todo.join(', ')}.`:nothing}`,nothing,
   {foot:html`<a class="to-hub" href="/hestia/energie/chauffe-eau" @click=${toHub}>Régler le chauffe-eau ›</a>`});
  return html`${this._ans({...head,pill,val:w.reserve!=null?String(w.reserve):'—',unit:'%',cap:`d'eau chaude en réserve${w.reserve_kwh!=null?`, ${kwh(w.reserve_kwh)} kWh sur ${kwh(w.capacite_kwh)}`:''}`,why:w.phrase})}
   <div class="encs">${plan}${next}${review}${settings}</div>`;
 }

 private _contract(v:View,over:boolean){
  const c=v.contrat,now=new Date(),head={ic:'doc',c:'--nw-benefit',subject:'Contrat',period:'ce mois-ci',over};
  const ranges=offpeak(v.heures_creuses),night=atNight(ranges);
  const supposed=c?.a_confirmer??[];
  const kvaSay=html`${c?.kva?`Puissance : ${c.kva} kVA${supposed.includes('kva')?' (supposée)':''}.`:''}${supposed.length?html` <a class="to-hub" href="/hestia/energie/reglages" @click=${toHub}>${supposed.includes('option')?(supposed.length>1?'Option et puissance':'Option'):'Puissance'} à confirmer dans les Réglages ›</a>`:nothing}`;
  const lines:[string,number|null|undefined,string][]=[
   ...(c?.option==='hphc'?[['Heures pleines',c.prix_hp,'le kWh'],['Heures creuses',c.prix_hc,'le kWh']] as [string,number|null|undefined,string][]
    :c?.option==='base'?[['Le kWh',c.prix_base,'à toute heure']] as [string,number|null|undefined,string][]:[]),
   [`Abonnement${c?.kva?` ${c.kva} kVA`:''}`,c?.abonnement_mois,'par mois'],['Revente du soleil',c?.revente,'le kWh']];
  const prices=this._enc('Vos prix',c?.abonnement_mois!=null?html`L'abonnement, <b>${eur(c.abonnement_mois)} € par mois</b>, se paie même sans rien consommer.`:nothing,
   html`<div class="hb list">${lines.filter(r=>r[1]!=null).map(([n,x,u])=>html`<span class="n">${n}</span><span class="v">${u==='par mois'?eur(x):price(x)} €<small>${u}</small></span>`)}</div>`);
  if(c?.option!=='hphc'){
   const base=c?.option==='base';
   return html`${this._ans({...head,...(base&&c?.prix_base!=null?{val:price(c.prix_base),unit:'€',cap:`le kWh à toute heure, option Base${supposed.includes('option')?' (supposée)':''}`}:{msg:`Option ${c?.option==='tempo'?'Tempo':'Base'}`}),why:kvaSay})}
    <div class="encs">${prices}</div>`;
  }
  const label=v.heures_creuses?.length?v.heures_creuses.map(([a,b])=>`${nb(a)} à ${nb(b)}`).join(' et de '):null;
  const nowMin=now.getHours()*60+now.getMinutes(),off=c.prix_hp&&c.prix_hc?1-c.prix_hc/c.prix_hp:null;
  const share=c.part_hc,seuil=c.seuil_hc,mois=v.mois?.euros,gain=c.base_euros!=null&&mois!=null?c.base_euros-mois:null;
  const u=v.usage;
  const pays=u&&u.seuil_hc!=null?this._enc('Les heures creuses rapportent-elles ?',html`Sur 12 mois, <b>${Math.round(u.part_hc*100)} %</b> de vos achats sont tombés ${night?'la nuit':'en heures creuses'}${share!=null?` (ce mois-ci ${Math.round(share*100)} %)`:''}. Elles rapportent à partir de <b>${Math.round(u.seuil_hc*100)} %</b>${u.base_de_plus!=null?html` : en Base, vous auriez payé <b>${eur(Math.abs(u.base_de_plus))} € de ${u.base_de_plus>=0?'plus':'moins'}</b>`:''}.`,
   html`<div><div class="track" style="--c:var(--nw-cold)"><i style="width:${u.part_hc*100}%"></i><span class="mark" style="left:${Math.min(100,u.seuil_hc*100)}%"></span></div>
    <div class="track-l"><span>vous <b>${Math.round(u.part_hc*100)} %</b></span><span>rentable dès <b>${Math.round(u.seuil_hc*100)} %</b></span></div></div>`)
   :share!=null&&seuil!=null?this._enc('Les heures creuses rapportent-elles ?',html`Ce mois-ci, <b>${Math.round(share*100)} %</b> de vos achats sont tombés ${night?'la nuit':'en heures creuses'}. Elles rapportent à partir de <b>${Math.round(seuil*100)} %</b>${gain!=null?html` : sans elles (option Base), vous auriez payé <b>${eur(Math.abs(gain))} € de ${gain<0?'moins':'plus'}</b>`:''}.`,
   html`<div><div class="track" style="--c:var(--nw-cold)"><i style="width:${share*100}%"></i><span class="mark" style="left:${Math.min(100,seuil*100)}%"></span></div>
    <div class="track-l"><span>vous <b>${Math.round(share*100)} %</b></span><span>rentable dès <b>${Math.round(seuil*100)} %</b></span></div></div>`):nothing;
  const first=v.heures_creuses?.[0];void label;
  return html`${this._ans({...head,...(first?{val:`${nb(first[0])} – ${nb(first[1])}`,cap:v.heures_creuses!.length>1?`heures creuses, et de ${v.heures_creuses!.slice(1).map(([a,b])=>`${nb(a)} à ${nb(b)}`).join(', ')}`:'les heures creuses'}:{msg:'Heures pleines et heures creuses'}),
    why:html`${c.prix_hc!=null&&c.prix_hp!=null?html`${night?'La nuit':'En heures creuses'}, le kWh coûte <b>${price(c.prix_hc)} €</b> au lieu de <b>${price(c.prix_hp)} €</b>${night?' le jour':''}. `:''}${kvaSay}`})}
   <div class="encs">
    ${ranges.length?this._enc('Votre journée',off!=null?html`En bleu, les heures creuses : tout ce qui peut attendre y coûte <b>${part(off)} de moins</b>.`:'En bleu, les heures creuses.',
     html`<div><div class="day">${ranges.map(([a,b])=>html`<i style="left:${a/14.4}%;width:${(b-a)/14.4}%"></i>`)}<span class="now" style="left:${nowMin/14.4}%"></span></div>${H_TICKS}</div>`,
     {wide:true,aside:`il est ${clock(now)}`}):nothing}
    ${prices}${pays}${this._machines(v)}
   </div>`;
 }
}

/** What the water heater does now, in a few words (the tile of « En détail »). */
const HEAT_NOW:Record<string,string>={soleil:'Il chauffe au soleil.',soleil_partiel:'Il chauffe, en partie au soleil.',heures_creuses:'Il chauffe en heures creuses.',
 heures_pleines:'Il chauffe en heures pleines.',eau_chaude_d_abord:'Il chauffe : l’eau chaude d’abord.',hygiene:'Chauffe complète de la semaine.',boost:'Chauffe demandée.'};
/** The colour of a heating by its source: the sun, the off-peak night, the peak price. */
const SOURCE_C:Record<string,string>={soleil:'--nw-sun',soleil_partiel:'--nw-act',heures_creuses:'--nw-cold',heures_pleines:'--nw-peak',base:'--nw-home'};
const SOURCE_W:Record<string,string>={soleil:'au soleil',soleil_partiel:'en partie au soleil',heures_creuses:'en heures creuses',heures_pleines:'en heures pleines',base:'au prix de base'};
const MODE_W:Record<string,string>={simulation:'Simulation',automatique:'Automatique',heures_creuses:'Heures creuses seules',vacances:'Vacances'};

/** The plan of the next hours, drawn to scale: the reserve (line), the sun to spare forecast (area), the heatings
    (blocks by source), the price of each half hour (band), the hot-water times. */
function heaterChart(w:Heater){
 const pts=w.courbe;if(pts.length<2)return nothing;
 const W=640,L=40,R=8,T=14,H=130,band=T+H+8,X=(i:number)=>L+(W-L-R)*i/pts.length,y=(p:number)=>T+H-Math.max(0,Math.min(100,p))/100*H;
 const sunMax=Math.max(3,...pts.map(p=>p[2])),ys=(k:number)=>T+H-k/sunMax*H*0.8;
 let area=`M${X(0)},${T+H}`;pts.forEach((p,i)=>{area+=` L${X(i)+(X(1)-X(0))/2},${ys(p[2])}`;});area+=` L${X(pts.length)},${T+H} Z`;
 let line='';pts.forEach((p,i)=>{line+=`${i?' L':'M'}${X(i)+(X(1)-X(0))/2},${y(p[1])}`;});
 const ticks:TemplateResult[]=[],marks:TemplateResult[]=[];
 pts.forEach((p,i)=>{const d=new Date(p[0]),m=d.getHours()*60+d.getMinutes();
  if(m%360===0)ticks.push(svg`<text x=${X(i)} y=${band+22} text-anchor="middle" class="tk">${m===0?'minuit':hour(d.getHours())}</text>`);
  // The hot-water ranges (1.0.1b3), lightly shaded behind the curve.
  if((w.plages??[]).some(([a,b])=>(m-a+1440)%1440<(b-a+1440)%1440))marks.push(svg`<rect x=${X(i)} y=${T} width=${X(i+1)-X(i)+.5} height=${H} class="hwr"></rect>`);
  if(w.heures.some(t=>t>=m&&t<m+30))marks.push(svg`<line x1=${X(i)} x2=${X(i)} y1=${T} y2=${T+H} class="hw"></line><text x=${X(i)+3} y=${T+9} class="hwl">eau chaude</text>`);});
 const sunny=pts.some(p=>p[2]>0.05);
 return html`<svg class="whc" viewBox="0 0 ${W} ${band+28}" role="img" aria-label="Le plan des prochaines heures : réserve d'eau chaude, soleil prévu et chauffes">
  ${[0,50,100].map(p=>svg`<line x1=${L} x2=${W-R} y1=${y(p)} y2=${y(p)} class="gl"></line><text x=${L-5} y=${y(p)+3} text-anchor="end" class="tk">${p} %</text>`)}
  ${sunny?svg`<path d=${area} class="sun"></path>`:nothing}
  ${marks}
  <line x1=${L} x2=${W-R} y1=${y(w.reserve_min*100)} y2=${y(w.reserve_min*100)} class="min"></line>
  ${pts.map((p,i)=>p[5]?svg`<rect x=${X(i)+.5} y=${T+H-18} width=${X(1)-X(0)-1} height="18" rx="2" style="fill:var(${SOURCE_C[p[5]]??'--nw-home'})"></rect>`:nothing)}
  <path d=${line} class="res"></path>
  ${pts.map((p,i)=>svg`<rect x=${X(i)} y=${band} width=${X(1)-X(0)+.3} height="7" class="pb" style="fill:var(${p[4]?'--nw-cold':'--nw-peak'})"></rect>`)}
  ${ticks}<text x=${L} y=${T-4} class="tk">maintenant</text></svg>
  <div class="nw-legend"><span><i style="--c:var(--nw-water)"></i>réserve d'eau chaude</span>${sunny?html`<span><i style="--c:color-mix(in oklab, var(--nw-sun) 45%, transparent)"></i>soleil en trop prévu</span>`:nothing}
   <span><i style="--c:var(--nw-sun)"></i>chauffe au soleil</span><span><i style="--c:var(--nw-cold)"></i>en heures creuses</span><span><i style="--c:var(--nw-peak)"></i>en heures pleines</span></div>`;
}

if(!customElements.get('hestia-energy-card'))customElements.define('hestia-energy-card',HestiaEnergyCard);
const w=window as unknown as {customCards?:unknown[]};
w.customCards=w.customCards??[];
if(!w.customCards.some(c=>(c as {type?:string}).type==='hestia-energy-card'))
 w.customCards.push({type:'hestia-energy-card',name:'Hestia Énergie',description:'Le conseiller énergie de la maison : tuile, carte complète, cartes de détail.',preview:true});

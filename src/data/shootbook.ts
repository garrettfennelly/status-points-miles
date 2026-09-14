/**
 * PREDICTS 27 SHOOT BOOK — the single source of content.
 *
 * Nothing in this book is hardcoded in a component. The tech scout closes the
 * location on 30 Sep and the book gets reissued: that reissue is an edit to
 * this file (or an /admin edit exported as JSON), never a rebuild of the app.
 *
 * Two rules when you edit:
 *   1. If it is not agreed, leave it `open(...)`. A plausible placeholder on a
 *      mountain with no signal is worse than a dashed box.
 *   2. The on-camera host is under embargo. Her name must not appear in this
 *      file, in any component, or anywhere else in the shipped bundle. It is
 *      entered at runtime in /admin and lives only in that device's storage.
 */

import { type ShootBook, locked, open } from './types'

export const shootbook: ShootBook = {
  meta: {
    title: 'PREDICTS 27',
    subtitle: 'THE GREAT OFFLINE — SHOOT BOOK',
    version: 'v1.0.0',
    asOf: '2026-09-14',
    timezone: 'America/Mexico_City',
    // Mexico abolished DST in 2022. Central Mexico sits on UTC-6 year round.
    utcOffsetHours: -6,
    adminPassphrase: 'GREATOFFLINE',
  },

  production: {
    firstFrame: {
      iso: '2026-10-13T06:30:00-06:00',
      label: 'FIRST FRAME',
      note: 'Day 1, opening of the principal window. Call time is not yet set — see the call/wrap slots below.',
    },
    location: {
      id: 'unit-location',
      label: 'LOCATION',
      name: open('Location name', 'Locations', 'Tech scout closes 30 Sep'),
      coords: open('Base camp coordinates', 'Locations', 'Tech scout closes 30 Sep'),
      address: open('Location address', 'Locations', 'Tech scout closes 30 Sep'),
      detail: 'Dashed until the tech scout (28–30 Sep) closes it. Do not quote a working name on a call sheet.',
    },
    windows: [
      {
        id: 'w-principal',
        span: '06:30 – 13:00',
        title: 'PRINCIPAL / HERO WINDOW',
        grade: 'hero',
        line: 'Only 8% of daily rainfall lands in this window. Every hero setup belongs here.',
      },
      {
        id: 'w-cover',
        span: '13:00 – 17:00',
        title: 'COVER AND CANOPY WORK',
        grade: 'cover',
        line: 'Cover, canopy and protected work. Usable, but not where a hero goes.',
      },
      {
        id: 'w-exposed',
        span: 'after 17:00',
        title: 'EXPOSED',
        grade: 'exposed',
        line: 'Highest-risk block of the day. Do not hang a hero on it.',
        warning:
          'The western basin fires late evening. The evening is NOT a recovery window — losing a morning does not mean you get it back after 17:00.',
      },
    ],
    sun: {
      from: { dateLabel: '1 Oct', sunrise: '06:27', sunset: '18:25' },
      to: { dateLabel: '14 Oct', sunrise: '06:31', sunset: '18:14' },
      drift: [
        'Sunrise drifts +4 min across the window.',
        'Sunset pulls in −11 min across the window.',
        'The afternoon shortens roughly 3× faster than the morning. Plan the loss at the back end, not the front.',
      ],
      moon: 'New moon 10 Oct.',
    },
    call: open('Call time', '1st AD', 'Issued with the call sheet'),
    wrap: open('Wrap time', '1st AD', 'Issued with the call sheet'),
  },

  /** Newest first. Owner and due date stay dashed until someone takes them. */
  gates: [
    {
      id: 'g-handoff',
      title: 'Business-site retouched-photo handoff date',
      detail:
        'The client scope still reads "XXX" where the handoff date belongs. No date has been agreed, so nothing downstream of it can be scheduled.',
      owner: open('Gate owner', null),
      due: open('Due date', null),
    },
    {
      id: 'g-t09',
      title: 'T09 planted world lead',
      detail:
        'Carried on the open list with no resolution recorded. Cross-reference T09 Cyber Grime on TRENDS — it reads as a build and is not bid.',
      owner: open('Gate owner', null),
      due: open('Due date', null),
    },
    {
      id: 'g-tiermix',
      title: 'Tier mix does not match the budget',
      detail:
        'The shot list draws 7 builds / 10 prop-led / 3 dressed. The budget carries 6 / 8 / 7. Two extra builds and two extra prop-led setups are unfunded.',
      positions: ['Shot list: 7 builds / 10 prop-led / 3 dressed', 'Budget: 6 builds / 8 prop-led / 7 dressed'],
      owner: open('Gate owner', null),
      due: open('Due date', null),
    },
    {
      id: 'g-pincount',
      title: 'Pin count disputed',
      detail:
        'Three numbers are in circulation and none has been agreed. Every downstream count — mementos, multipin, crew days — moves with it.',
      positions: ['100', '120', '147'],
      owner: open('Gate owner', null),
      due: open('Due date', null),
    },
  ],

  emergency: [
    {
      id: 'e-911',
      label: '911',
      sub: 'Emergencias — national, all services, Mexico',
      number: locked('911'),
      tone: 'red',
    },
    {
      id: 'e-medic',
      label: 'UNIT MEDIC',
      sub: 'On unit every shoot day. Oxygen on standby.',
      number: open('Unit medic mobile', 'Production', 'With the crew list'),
      tone: 'red',
    },
    {
      id: 'e-prod',
      label: 'PRODUCTION LEAD',
      sub: 'Line Producer / UPM — first call for anything not medical',
      number: open('Production lead mobile', 'Production', 'With the crew list'),
      tone: 'amber',
    },
    {
      id: 'e-embassy',
      label: 'US EMBASSY',
      sub: 'American Citizen Services, Mexico City',
      number: locked('+52 55 4163 8422', 'From inside Mexico'),
      alt: locked('+52 55 8526 3111', 'From inside Mexico'),
      tone: 'plain',
    },
  ],

  board: {
    days: [
      { id: 'd1', label: 'DAY 1', weekday: 'TUE', date: '2026-10-13' },
      { id: 'd2', label: 'DAY 2', weekday: 'WED', date: '2026-10-14', note: 'Hold as a non-shoot day.' },
      { id: 'd3', label: 'DAY 3', weekday: 'THU', date: '2026-10-15' },
      { id: 'd4', label: 'DAY 4', weekday: 'FRI', date: '2026-10-16', note: 'Last shoot day.' },
    ],
    rows: [
      {
        id: 'r-director',
        unit: 'Director',
        cells: [
          { kind: 'count', value: 3, qualifier: 'trends' },
          { kind: 'text', value: 'prep / pre-light' },
          { kind: 'count', value: 3, qualifier: 'w/ host motion' },
          { kind: 'count', value: 3, qualifier: 'w/ host' },
        ],
        total: '9',
      },
      {
        id: 'r-photog1',
        unit: 'Photographer 1',
        cells: [
          { kind: 'count', value: 3 },
          { kind: 'count', value: 3 },
          { kind: 'count', value: 3 },
          { kind: 'count', value: 3 },
        ],
        total: '12',
      },
      {
        id: 'r-pin1',
        unit: 'Pin Photographer 1',
        cells: [
          { kind: 'count', value: 15 },
          { kind: 'count', value: 15 },
          { kind: 'count', value: 15 },
          { kind: 'count', value: 15 },
        ],
        total: '60',
      },
      {
        id: 'r-pin2',
        unit: 'Pin Photographer 2',
        cells: [
          { kind: 'count', value: 15 },
          { kind: 'count', value: 15 },
          { kind: 'count', value: 15 },
          { kind: 'count', value: 15 },
        ],
        total: '60',
      },
      {
        id: 'r-host',
        unit: 'On-camera host',
        cells: [
          { kind: 'none' },
          { kind: 'text', value: 'fitting / rehearsal' },
          { kind: 'text', value: 'on camera' },
          { kind: 'text', value: 'on camera' },
        ],
        total: '2',
        totalNote: 'on-camera days',
      },
    ],
    flags: [
      {
        id: 'f-lastday',
        tone: 'gate',
        text: "The host's last on-camera day is the last shoot day. There is no retry behind it — anything missed on Fri 16 is missed for the campaign.",
      },
      {
        id: 'f-wed',
        tone: 'weather',
        text: 'Wed 14 is fitting and rehearsal. It must be held as a non-shoot day — do not let setups migrate into it.',
      },
    ],
  },

  calendar: [
    {
      id: 'c-sep16',
      start: '2026-09-16',
      kind: 'holiday',
      title: 'Día de la Independencia',
      detail: 'Statutory public holiday (LFT art. 74). Mexican vendors and offices closed.',
      statutory: true,
    },
    {
      id: 'c-scout',
      start: '2026-09-28',
      end: '2026-09-30',
      kind: 'scout',
      title: 'Tech scout',
      detail: 'Closes location, base camp coordinates and hotel.',
    },
    {
      id: 'c-lock',
      start: '2026-09-30',
      kind: 'gate',
      title: 'HARD GATE — location lock',
      detail: 'Location, base camp and hotel come off the dashed list. The book is reissued the same day.',
      hardGate: true,
    },
    {
      id: 'c-prelight',
      start: '2026-10-12',
      kind: 'prep',
      title: 'Pre-light / build / load-in',
      detail: 'Not a shoot day.',
    },
    { id: 'c-d1', start: '2026-10-13', kind: 'shoot', title: 'DAY 1 — shoot', detail: '3 trends, director. First frame.' },
    { id: 'c-d2', start: '2026-10-14', kind: 'shoot', title: 'DAY 2 — fitting / rehearsal', detail: 'Non-shoot day for the host. Pre-light continues.' },
    { id: 'c-d3', start: '2026-10-15', kind: 'shoot', title: 'DAY 3 — shoot', detail: 'Host on camera, motion.' },
    { id: 'c-d4', start: '2026-10-16', kind: 'shoot', title: 'DAY 4 — shoot', detail: "Host on camera. Last shoot day — no retry behind it." },
    {
      id: 'c-float',
      start: '2026-10-17',
      end: '2026-10-18',
      kind: 'weather',
      title: 'Weather float',
      detail: 'Two days. This is the whole contingency — there is nothing behind it.',
    },
    { id: 'c-post', start: '2026-10-19', kind: 'post', title: 'Selects / post begins' },
    {
      id: 'c-nov2',
      start: '2026-11-02',
      kind: 'holiday',
      title: 'Día de Muertos',
      detail: 'Widely observed; not a statutory holiday under LFT art. 74. Expect reduced vendor availability.',
      statutory: false,
    },
    {
      id: 'c-delivery',
      start: '2026-11-13',
      kind: 'gate',
      title: 'HARD GATE — film files delivered',
      detail: 'Contracted delivery of the film files.',
      hardGate: true,
    },
    {
      id: 'c-nov16',
      start: '2026-11-16',
      kind: 'holiday',
      title: 'Día de la Revolución (observed)',
      detail: 'Statutory public holiday, third Monday of November (LFT art. 74).',
      statutory: true,
    },
  ],

  undatedGates: [
    {
      id: 'u-drone',
      title: 'Mexican drone operator contracted',
      detail:
        'The only legal route. AFAC authorisation carries a three-month response time and cannot be started in time for this shoot. This is a vendor booking, not a form.',
      owner: open('Gate owner', null),
      due: open('Booking date', null),
    },
    {
      id: 'u-crewlist',
      title: 'Crew list and contacts issued',
      detail: 'Every dashed contact on CREW closes on this date. Until then the crew list is a collection tracker.',
      owner: open('Gate owner', 'Production'),
      due: open('Issue date', 'Production'),
    },
    {
      id: 'u-arrival',
      title: 'Crew arrival — two city days before the first altitude call',
      detail:
        'Fixed by the altitude profile, not by cost. Mild exertion only for the first 48 hours; the first altitude call cannot fall inside that window.',
      owner: open('Gate owner', 'Production'),
      due: open('Arrival date', 'Production'),
    },
    {
      id: 'u-heroidea',
      title: 'Hero campaign image — concept and crowd budget',
      detail: 'Scheduled as a 22nd setup with no shot idea written anywhere and crowd budgeted at zero.',
      owner: open('Gate owner', null),
      due: open('Due date', null),
    },
  ],

  /**
   * All 21 + backups. The tier number is part of the identity — names are still
   * moving, so the number is what you quote on the radio.
   */
  trends: [
    { number: '01', name: 'Relic Rooms', altName: null, category: 'Home', partnership: false, tier: 1, film: null, multipin: false, mementos: 10, physical: ['LIVE FIRE'] },
    { number: '02', name: 'BEANS', altName: null, category: 'Food & Bev', partnership: false, tier: 1, film: 'RECCO', multipin: true, mementos: 7, physical: ['CROWD — largest on board', 'FOOD STYLING'] },
    { number: '03', name: 'Moss Boss', altName: null, category: 'X-cat', partnership: false, tier: 1, film: 'RECCO', multipin: false, mementos: 7, physical: ['WATER TANK', 'GREY-WATER', 'FOOD'] },
    { number: '04', name: 'Palazzo Pop', altName: null, category: 'Home', partnership: false, tier: 1, film: 'film', multipin: false, mementos: 6, physical: ['FOOD STYLING'] },
    { number: '05', name: 'Hard Copy', altName: null, category: 'X-cat', partnership: false, tier: 1, film: null, multipin: false, mementos: 6, physical: ['OVERSIZED PROP FAB'] },
    { number: '06', name: 'Bird Girl', altName: null, category: 'Fashion / Beauty', partnership: false, tier: 1, film: 'RECCO', multipin: false, mementos: 7, physical: ['RIG AT HEIGHT', 'FALL PROTECTION'] },
    { number: '07', name: 'Feathery Fêtes', altName: null, category: 'Celebrations', partnership: false, tier: 1, film: 'film', multipin: false, mementos: 6, physical: ['MILLINERY'] },
    { number: '08', name: 'Heritage Hiker', altName: null, category: 'Fashion', partnership: false, tier: 2, film: 'film', multipin: false, mementos: 5, physical: ['FAUX FIRE', 'FOOD'] },
    { number: '09', name: 'Cyber Grime', altName: null, category: 'Beauty', partnership: true, tier: 2, film: 'RECCO', multipin: true, mementos: 5, physical: ['READS AS A BUILD', 'HMU'] },
    { number: '10', name: 'Play Dates', altName: null, category: 'Hobbies', partnership: true, tier: 2, film: 'RECCO', multipin: true, mementos: 6, physical: ['LIVE-KNIT CONTINUITY'] },
    { number: '11', name: 'Detourism', altName: null, category: 'Travel', partnership: true, tier: 2, film: null, multipin: true, mementos: 5, physical: ['PICTURE VEHICLE', 'OVERHEAD'] },
    { number: '12', name: 'New Sartorial', altName: 'OG Blogger Era', category: 'Fashion', partnership: true, tier: 2, film: null, multipin: false, mementos: 1, physical: ['CART'] },
    { number: '13', name: 'Slumber Squads', altName: null, category: 'Celebrations', partnership: true, tier: 2, film: 'film', multipin: false, mementos: 8, physical: ['READS AS A BUILD'] },
    { number: '14', name: 'Room Service', altName: null, category: 'Home', partnership: true, tier: 2, film: 'RECCO', multipin: true, mementos: 6, physical: ['RIDDEN CART', 'INTERIOR'] },
    { number: '15', name: 'Plaidstruck', altName: null, category: 'X-cat', partnership: false, tier: 2, film: 'RECCO', multipin: false, mementos: 5, physical: ['TURF CUT / PAINT', 'PICTURE MOWER'] },
    { number: '16', name: 'Apprenticetrips', altName: null, category: 'Travel', partnership: false, tier: 2, film: null, multipin: true, mementos: 6, physical: ['OVERHEAD PLATFORM'] },
    { number: '17', name: 'Royalberry', altName: null, category: 'X-cat', partnership: false, tier: 2, film: 'RECCO', multipin: false, mementos: 1, physical: ['GROWN WORLD', 'OVERSIZED PROPS'] },
    { number: '18', name: 'Pucker Up', altName: null, category: 'Food & Bev', partnership: true, tier: 3, film: null, multipin: true, mementos: 4, physical: ['FRUIT CART', 'FOOD'] },
    { number: '19', name: 'Pixiedusted', altName: null, category: 'Beauty', partnership: true, tier: 3, film: 'film', multipin: true, mementos: 5, physical: ['HAND-MADE CRAFT'] },
    { number: '20', name: 'Waistland', altName: null, category: 'Beauty', partnership: false, tier: 3, film: 'film', multipin: false, mementos: 3, physical: ['TATTOO APPLICATION', 'FORCED PERSPECTIVE'] },
    {
      number: '21',
      name: 'Everyday Elixirs',
      altName: 'Whimsy Sips',
      category: 'Food & Bev',
      partnership: false,
      tier: 'untiered',
      film: null,
      multipin: true,
      mementos: 0,
      physical: ['SHARES THE PUCKER UP CART'],
      note: 'One build if scheduled together with T18 Pucker Up. 21st-trend status unresolved — it is untiered and carries no mementos.',
    },
    {
      number: 'B1',
      name: 'Tie Breakers',
      altName: null,
      category: 'Fashion',
      partnership: false,
      tier: 'backup',
      film: null,
      multipin: false,
      mementos: 3,
      physical: ['OVERSIZED PROP CANOPY'],
      note: 'Backup. Not on the board unless something above it falls out.',
    },
  ],

  trendNotes: {
    altNamesOutstanding: 9,
    altNameList: open(
      'Alt-name list — 9 trends carry alt names, 2 are recorded here',
      'Strategy',
      null,
    ),
    banner:
      'Nine trends carry alt names and only two are recorded. Quote the tier number on the radio and on every label — never the name alone.',
  },

  heroCampaign: {
    title: 'HERO CAMPAIGN IMAGE',
    lines: [
      'Scheduled as a 22nd setup.',
      'All hands — it takes the whole unit for the duration.',
      'No shot idea is written anywhere.',
      'Crowd is currently budgeted at zero.',
    ],
    shotIdea: open('Shot idea / treatment', null),
    crowdBudget: open('Crowd budget', null),
  },

  /**
   * 29 seats. Every name and every number is open — that is the point: this
   * list IS the collection tracker. `basis` says why the seat exists so nobody
   * quietly drops one. The on-camera host is talent, not one of the 29.
   */
  crew: [
    { id: 'c01', dept: 'PRODUCTION', role: 'Producer', basis: 'Production core', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c02', dept: 'PRODUCTION', role: 'Line Producer / UPM', basis: 'Owns the budget against the disputed tier mix', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c03', dept: 'PRODUCTION', role: 'Production Coordinator', basis: 'Travel, altitude arrival window, hotel', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c04', dept: 'PRODUCTION', role: '1st AD', basis: 'Owns call and wrap — both still open on NOW', name: open('Name'), phone: open('Mobile'), email: open('Email') },

    { id: 'c05', dept: 'DIRECTION & CAMERA', role: 'Director', basis: 'Board row — 9 setups across 3 shoot days', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c06', dept: 'DIRECTION & CAMERA', role: 'Photographer 1', basis: 'Board row — 12 setups', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c07', dept: 'DIRECTION & CAMERA', role: 'Pin Photographer 1', basis: 'Board row — 60 setups', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c08', dept: 'DIRECTION & CAMERA', role: 'Pin Photographer 2', basis: 'Board row — 60 setups', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c09', dept: 'DIRECTION & CAMERA', role: 'Gaffer', basis: 'Rig at height (T06), overhead platform (T16)', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c10', dept: 'DIRECTION & CAMERA', role: 'Key Grip', basis: 'Overhead (T11), overhead platform (T16), fall protection (T06)', name: open('Name'), phone: open('Mobile'), email: open('Email') },

    { id: 'c11', dept: 'ART, BUILD & GREENS', role: 'Art Director', basis: 'Builds on the shot list', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c12', dept: 'ART, BUILD & GREENS', role: 'Prop Master', basis: 'Oversized props (T05, T17, B1)', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c13', dept: 'ART, BUILD & GREENS', role: 'Scenic / Fabrication Lead', basis: 'Oversized prop fab (T05), prop canopy (B1)', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c14', dept: 'ART, BUILD & GREENS', role: 'Greens Lead', basis: 'Grown world (T17), turf cut / paint (T15)', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c15', dept: 'ART, BUILD & GREENS', role: 'Picture Vehicle & Cart Wrangler', basis: 'Picture vehicle (T11), ridden cart (T14), fruit cart (T18/T21), picture mower (T15)', name: open('Name'), phone: open('Mobile'), email: open('Email') },

    { id: 'c16', dept: 'WARDROBE, HMU & MAKERS', role: 'Wardrobe Stylist', basis: 'Fitting and rehearsal, Wed 14', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c17', dept: 'WARDROBE, HMU & MAKERS', role: 'Key HMU', basis: 'HMU (T09)', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c18', dept: 'WARDROBE, HMU & MAKERS', role: 'Milliner', basis: 'Millinery (T07)', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c19', dept: 'WARDROBE, HMU & MAKERS', role: 'Prosthetic / Tattoo Artist', basis: 'Tattoo application (T20)', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c20', dept: 'WARDROBE, HMU & MAKERS', role: 'Craft Artisan — knit & hand-made', basis: 'Live-knit continuity (T10), hand-made craft (T19)', name: open('Name'), phone: open('Mobile'), email: open('Email') },

    { id: 'c21', dept: 'FOOD', role: 'Food Stylist', basis: 'Food styling (T02, T04); food (T03, T08, T18)', name: open('Name'), phone: open('Mobile'), email: open('Email') },

    { id: 'c22', dept: 'SAFETY & SPECIAL', role: 'Safety Supervisor', basis: 'Live fire (T01), faux fire (T08), fall protection (T06)', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c23', dept: 'SAFETY & SPECIAL', role: 'Unit Medic', basis: 'Altitude profile — oxygen on standby, 48-hour exertion limit', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c24', dept: 'SAFETY & SPECIAL', role: 'SFX / Water Technician', basis: 'Water tank and grey-water handling (T03)', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c25', dept: 'SAFETY & SPECIAL', role: 'Drone Operator — Mexican, authorised', basis: 'NOM-107-SCT3-2019 §4.10.16. A foreign pilot or aircraft cannot fly here.', name: open('Name'), phone: open('Mobile'), email: open('Email') },

    { id: 'c26', dept: 'LOCAL UNIT', role: 'Location Manager', basis: 'Owns the location lock on 30 Sep', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c27', dept: 'LOCAL UNIT', role: 'Local Fixer / Transport Captain', basis: 'Dispatched vehicles only; no intercity movement after dark', name: open('Name'), phone: open('Mobile'), email: open('Email') },
    { id: 'c28', dept: 'LOCAL UNIT', role: 'Security Lead', basis: 'Security at every location', name: open('Name'), phone: open('Mobile'), email: open('Email') },

    { id: 'c29', dept: 'CLIENT', role: 'Client Lead', basis: 'Owns the business-site retouched-photo handoff still reading XXX', name: open('Name'), phone: open('Mobile'), email: open('Email') },
  ],

  talent: {
    label: 'On-camera host',
    embargoLine:
      'Under embargo. The name is not in this build. After the announcement clears, a producer enters it once in /admin — it is stored on that device only.',
    phone: open('Mobile — via representation', 'Production'),
    agency: open('Representation / agency contact', 'Production'),
  },

  ground: {
    places: [
      {
        id: 'p-basecamp',
        label: 'BASE CAMP',
        name: open('Base camp name', 'Locations', 'Tech scout closes 30 Sep'),
        coords: open('Base camp coordinates', 'Locations', 'Tech scout closes 30 Sep'),
        address: open('Base camp address', 'Locations', 'Tech scout closes 30 Sep'),
        detail: 'Sits at altitude. Everything about the 48-hour exertion rule keys off when crew first stand here.',
      },
      {
        id: 'p-hotel',
        label: 'HOTEL',
        name: open('Hotel name', 'Production', 'Tech scout closes 30 Sep'),
        coords: open('Hotel coordinates', 'Production', 'Tech scout closes 30 Sep'),
        address: open('Hotel address', 'Production', 'Tech scout closes 30 Sep'),
        detail: 'Sleeping altitude ~2,240 m. Sleep low, work high — that is the safe profile.',
      },
      {
        id: 'p-parking',
        label: 'UNIT PARKING',
        name: open('Unit parking', 'Locations', 'Tech scout closes 30 Sep'),
        coords: open('Unit parking coordinates', 'Locations', 'Tech scout closes 30 Sep'),
        address: open('Unit parking address', 'Locations', 'Tech scout closes 30 Sep'),
      },
      {
        id: 'p-hospital',
        label: 'NEAREST HOSPITAL',
        name: open('Receiving hospital', 'Production / Medic', 'Before the first altitude call'),
        coords: open('Hospital coordinates', 'Production / Medic', 'Before the first altitude call'),
        address: open('Drive time from base camp', 'Production / Medic', 'Before the first altitude call'),
        detail: 'Drive time must be measured on the scout, in a unit vehicle, at call time traffic. Not estimated.',
      },
      {
        id: 'p-embassy',
        label: 'US EMBASSY — CONSULAR SERVICES',
        name: locked('American Citizen Services'),
        coords: open('Coordinates', 'Production'),
        address: locked('Calzada Legaria & Av. Casa de la Moneda, Polanco, Mexico City'),
        detail: 'MOVED November 2025. Reforma 305 is superseded and still printed on a lot of paperwork.',
      },
    ],
    plates: [
      {
        id: 'm-unit',
        label: 'UNIT PLATE',
        caption: 'Base camp, unit parking, set and the medical route out.',
        src: open('Baked unit map plate (PNG/SVG)', 'Locations', 'After the tech scout, 30 Sep'),
      },
      {
        id: 'm-approach',
        label: 'APPROACH PLATE',
        caption: 'Hotel to base camp, with the after-dark rule marked.',
        src: open('Baked approach map plate (PNG/SVG)', 'Locations', 'After the tech scout, 30 Sep'),
      },
      {
        id: 'm-city',
        label: 'CITY PLATE',
        caption: 'Hotel, consular services, receiving hospital.',
        src: open('Baked city map plate (PNG/SVG)', 'Locations', 'After the tech scout, 30 Sep'),
      },
    ],
    deepLinkNote:
      'Map plates are baked images bundled with the book — they render with no signal. The Apple and Google Maps buttons hand off to the OS and only resolve if the region is already downloaded on the device. Download the region before you leave the hotel wifi.',
  },

  safety: {
    hospitals: [
      { dayId: 'd1', dayLabel: 'DAY 1 — Tue 13 Oct', hospital: open('Receiving hospital', 'Production / Medic'), driveTime: open('Drive time from unit', 'Production / Medic') },
      { dayId: 'd2', dayLabel: 'DAY 2 — Wed 14 Oct', hospital: open('Receiving hospital', 'Production / Medic'), driveTime: open('Drive time from unit', 'Production / Medic') },
      { dayId: 'd3', dayLabel: 'DAY 3 — Thu 15 Oct', hospital: open('Receiving hospital', 'Production / Medic'), driveTime: open('Drive time from unit', 'Production / Medic') },
      { dayId: 'd4', dayLabel: 'DAY 4 — Fri 16 Oct', hospital: open('Receiving hospital', 'Production / Medic'), driveTime: open('Drive time from unit', 'Production / Medic') },
    ],
    embassy: {
      heading: 'US EMBASSY — CONSULAR SERVICES',
      movedLine: 'MOVED — November 2025.',
      address: 'Calzada Legaria & Av. Casa de la Moneda, Polanco, Mexico City',
      numbers: [
        { label: 'From inside Mexico', value: '+52 55 4163 8422' },
        { label: 'From inside Mexico', value: '+52 55 8526 3111' },
      ],
      superseded:
        'Reforma 305 is WRONG. It is still printed on a lot of paperwork, on insurance letters and on older call sheets. If you see it, it is superseded — do not send anyone there.',
    },
    altitude: {
      id: 's-altitude',
      heading: 'ALTITUDE',
      lines: [
        'Sleeping at ~2,240 m and day-tripping up to altitude is the safe profile. That is already how this schedule is built — keep it that way.',
        'The real constraint is MILD EXERTION ONLY FOR THE FIRST 48 HOURS. It is not about how fit anyone is.',
        'Two city days before the first altitude call. This is a schedule constraint, not a preference.',
        'Oxygen on standby with the unit medic.',
      ],
      figures: [
        { label: 'Sleeping altitude', value: '~2,240 m' },
        { label: 'Exertion limit', value: 'first 48 h' },
        { label: 'City days before first call', value: '2' },
      ],
    },
    cold: {
      id: 's-cold',
      heading: 'COLD — FOR THE CREW LETTER',
      lines: [
        'At 3,000 m the 1–14 October mean runs 4.7–16.5 °C.',
        'There is an 11% chance any given night touches 2 °C.',
        'Pre-dawn at 2 °C with 30 km/h wind is −4 °C apparent.',
        'Crew standing still on a mountain need winter layering, not fleece. Say this in the crew letter — people pack for "Mexico in October" and arrive wrong.',
      ],
      figures: [
        { label: 'Mean range at 3,000 m', value: '4.7 – 16.5 °C' },
        { label: 'Night touching 2 °C', value: '11%' },
        { label: 'Pre-dawn apparent', value: '−4 °C' },
      ],
    },
    rain: {
      id: 's-rain',
      heading: 'RAIN — THE ACCEPTED TRADE',
      lines: [
        'Oct 1–14 carries 65% of October’s rain in 41% of its days. The front half of the month is the wet half.',
        'At ~3,000 m the daily chance of rain is 54%.',
        'Expect 6.5 dry days in 14. Median longest dry streak: 3 days.',
        'This was accepted when the dates were set. It is a known trade, not a surprise — which is why every hero setup lives in the 06:30–13:00 window.',
      ],
      figures: [
        { label: 'Of October’s rain in Oct 1–14', value: '65%' },
        { label: 'In this share of its days', value: '41%' },
        { label: 'Daily chance of rain at 3,000 m', value: '54%' },
        { label: 'Dry days in 14', value: '6.5' },
        { label: 'Median longest dry streak', value: '3 days' },
      ],
    },
    drone: {
      heading: 'DRONE — HARD STOP',
      regulation: 'NOM-107-SCT3-2019 §4.10.16',
      lines: [
        'A foreign-registered aircraft CANNOT legally operate in Mexico.',
        'A foreign pilot CANNOT legally operate in Mexico.',
        "AFAC's own authorisation carries a three-month response time. There is not three months between now and the shoot.",
      ],
      verdict:
        'The only route is contracting a Mexican operator who already holds a current authorisation. It is a vendor booking, not a form. Nobody fills anything in — somebody books somebody.',
    },
    protocols: [
      'No intercity movement after dark.',
      'Dispatched vehicles or app rides only. No street taxis.',
      'Security at every location.',
      'Nobody travels alone to or from a remote unit.',
    ],
  },
}

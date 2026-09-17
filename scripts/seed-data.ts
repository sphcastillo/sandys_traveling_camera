/**
 * Dummy content for Sandy's dataset: 6 continents, 24 countries, 12 photographs
 * each. Consumed by scripts/seed.ts.
 */

export type SeedContinent = {
  name: string
  slug: string
  order: number
  blurb: string
}

export type SeedCountry = {
  name: string
  slug: string
  continent: string
  isoNumeric: string
  isoAlpha2: string
  featured?: boolean
  orderRank: number
  shortIntro: string
  story: string[]
  places: string[]
  /** First day of the visit; photo dates fan out from here. */
  visited: string
}

export type SeedTrip = {
  title: string
  slug: string
  countries: string[]
  startDate: string
  endDate: string
  summary: string
}

export type SeedNote = {
  title: string
  slug: string
  date: string
  country: string
  excerpt: string
  body: string[]
}

export const CONTINENTS: SeedContinent[] = [
  {
    name: 'North America',
    slug: 'north-america',
    order: 1,
    blurb: 'Desert light, cold northern water and every kind of road in between.',
  },
  {
    name: 'Europe',
    slug: 'europe',
    order: 2,
    blurb: 'Old stone, long coastlines and weather that changes its mind by lunchtime.',
  },
  {
    name: 'Africa',
    slug: 'africa',
    order: 3,
    blurb: 'Scale you cannot photograph and colour you cannot forget.',
  },
  {
    name: 'Asia',
    slug: 'asia',
    order: 4,
    blurb: 'Mountains, markets and the quiet minutes just before a city wakes up.',
  },
  {
    name: 'South America',
    slug: 'south-america',
    order: 5,
    blurb: 'Altitude, wind and the kind of horizons that make you stop talking.',
  },
  {
    name: 'Oceania',
    slug: 'oceania',
    order: 6,
    blurb: 'Water in every shade, and islands that feel like the end of the map.',
  },
]

export const COUNTRIES: SeedCountry[] = [
  // North America
  {
    name: 'Mexico',
    slug: 'mexico',
    continent: 'north-america',
    isoNumeric: '484',
    isoAlpha2: 'MX',
    featured: true,
    orderRank: 1,
    visited: '2026-02-08',
    shortIntro:
      'Two weeks of courtyards, cenotes and late afternoons the colour of terracotta walls.',
    story: [
      'I went to Mexico for the light and stayed for the doorways. Every street had one worth stopping for, and every one of them was a different shade of blue.',
      'The cenotes taught me patience. You wait for the sun to drop through the hole in the roof, and for about eleven minutes the water turns into something no lens can quite hold on to. Then it is gone and you are just a person standing in a cave, smiling.',
    ],
    places: ['Oaxaca', 'Valladolid', 'Tulum', 'San Cristóbal', 'Mérida', 'Guanajuato'],
  },
  {
    name: 'Canada',
    slug: 'canada',
    continent: 'north-america',
    isoNumeric: '124',
    isoAlpha2: 'CA',
    orderRank: 2,
    visited: '2025-09-14',
    shortIntro: 'Cold lakes, warm cabins, and larches turning in the second week of September.',
    story: [
      'The Rockies do not let you cheat. You either get up before the light or you photograph somebody else’s morning.',
      'I hiked the same valley three days running because the cloud kept changing. The third morning it cleared completely, and I almost missed it because I was making coffee.',
    ],
    places: ['Banff', 'Lake Louise', 'Jasper', 'Yoho', 'Moraine Lake', 'Kananaskis'],
  },
  {
    name: 'United States of America',
    slug: 'united-states',
    continent: 'north-america',
    isoNumeric: '840',
    isoAlpha2: 'US',
    featured: true,
    orderRank: 3,
    visited: '2025-05-02',
    shortIntro: 'A long loop through the southwest, sleeping where the road ran out.',
    story: [
      'Three thousand miles, one cooler, and a habit of pulling over whenever the horizon did something interesting.',
      'The slot canyons were the surprise. Down there the rock glows from reflected light rather than direct sun, and everything looks like it has been lit from inside.',
    ],
    places: ['Moab', 'Page', 'Sedona', 'Big Sur', 'Death Valley', 'Bryce'],
  },
  {
    name: 'Costa Rica',
    slug: 'costa-rica',
    continent: 'north-america',
    isoNumeric: '188',
    isoAlpha2: 'CR',
    orderRank: 4,
    visited: '2025-11-19',
    shortIntro: 'Green so saturated it looks edited. It is not.',
    story: [
      'It rained for eleven of the fourteen days and those were the best photographs of the trip. Cloud forest without cloud is just forest.',
      'I learned to keep a microfibre cloth in every pocket and to stop apologising to my camera.',
    ],
    places: ['Monteverde', 'Arenal', 'Osa', 'Tortuguero', 'Uvita', 'Rincón'],
  },

  // Europe
  {
    name: 'Iceland',
    slug: 'iceland',
    continent: 'europe',
    isoNumeric: '352',
    isoAlpha2: 'IS',
    featured: true,
    orderRank: 1,
    visited: '2026-03-03',
    shortIntro: 'Nine days of weather, black sand and a sun that could not decide whether to set.',
    story: [
      'Iceland in March is a negotiation. The light is extraordinary and it lasts for hours, but so does the wind, and the wind always wins in the end.',
      'On the sixth evening the clouds tore open over a lagoon of grounded icebergs and stayed that way for forty minutes. I have never worked faster or been colder.',
    ],
    places: ['Vík', 'Jökulsárlón', 'Kirkjufell', 'Reynisfjara', 'Skógafoss', 'Snæfellsnes'],
  },
  {
    name: 'Italy',
    slug: 'italy',
    continent: 'europe',
    isoNumeric: '380',
    isoAlpha2: 'IT',
    featured: true,
    orderRank: 2,
    visited: '2025-06-11',
    shortIntro: 'Hill towns at dawn, before the coaches and after the bakers.',
    story: [
      'The trick in Tuscany is to be unreasonable about mornings. By nine the haze burns off and the hills flatten into a postcard.',
      'The Dolomites were the opposite — the mountains keep working all day, and the last light hits the rock so hard it looks lit by a studio strobe.',
    ],
    places: ['Val d’Orcia', 'Siena', 'Tre Cime', 'Manarola', 'Ortigia', 'Bologna'],
  },
  {
    name: 'Portugal',
    slug: 'portugal',
    continent: 'europe',
    isoNumeric: '620',
    isoAlpha2: 'PT',
    orderRank: 3,
    visited: '2025-09-28',
    shortIntro: 'Tiles, cliffs and the Atlantic arriving all at once.',
    story: [
      'I spent a week photographing walls. Lisbon gives you a new one every corner, and the light bounces off them in a way that makes people look softer than they are.',
      'Then the coast, where the ocean does all the composition for you and you just try to keep the horizon straight.',
    ],
    places: ['Alfama', 'Sintra', 'Porto', 'Sagres', 'Óbidos', 'Benagil'],
  },
  {
    name: 'Norway',
    slug: 'norway',
    continent: 'europe',
    isoNumeric: '578',
    isoAlpha2: 'NO',
    orderRank: 4,
    visited: '2026-01-16',
    shortIntro: 'Blue hour that lasts four hours, and fishing villages under a green sky.',
    story: [
      'Above the Arctic Circle in January the sun never properly rises, which sounds like a problem and is in fact a gift. You get one long continuous sunrise-sunset and nowhere to hide from it.',
      'The aurora arrived on the last night, quietly, while I was packing. I shot it from the door of the cabin in socks.',
    ],
    places: ['Reine', 'Hamnøy', 'Senja', 'Tromsø', 'Henningsvær', 'Uttakleiv'],
  },

  // Africa
  {
    name: 'Morocco',
    slug: 'morocco',
    continent: 'africa',
    isoNumeric: '504',
    isoAlpha2: 'MA',
    featured: true,
    orderRank: 1,
    visited: '2025-10-05',
    shortIntro: 'Medinas, mountain passes and a night in the dunes with no horizon at all.',
    story: [
      'Marrakech is a lesson in asking first. The photographs I like best from that week are the ones where someone said yes and then forgot I was there.',
      'The Sahara was the quietest place I have ever stood. No wind, no birds, nothing. I stopped shooting for an hour just to listen to it.',
    ],
    places: ['Marrakech', 'Chefchaouen', 'Merzouga', 'Aït Benhaddou', 'Fès', 'Todra'],
  },
  {
    name: 'Namibia',
    slug: 'namibia',
    continent: 'africa',
    isoNumeric: '516',
    isoAlpha2: 'NA',
    featured: true,
    orderRank: 2,
    visited: '2025-02-10',
    shortIntro: 'Dunes, salt pans and dead trees that have been standing for nine hundred years.',
    story: [
      'Sossusvlei at sunrise is a race. The dune shadows move visibly, and the line between light and dark is the whole photograph.',
      'Out on the pan there is no scale and no reference. I put a person in the frame just so the picture would make sense.',
    ],
    places: ['Sossusvlei', 'Deadvlei', 'Swakopmund', 'Etosha', 'Spitzkoppe', 'Skeleton Coast'],
  },
  {
    name: 'Tanzania',
    slug: 'tanzania',
    continent: 'africa',
    isoNumeric: '834',
    isoAlpha2: 'TZ',
    orderRank: 3,
    visited: '2026-06-22',
    shortIntro: 'Dust, acacia silhouettes and the longest golden hour on the continent.',
    story: [
      'You spend most of a safari waiting, and then everything happens in eight seconds and you find out whether your settings were ready.',
      'The evenings were the real reason to be there. The dust in the air turns the whole sky into a softbox.',
    ],
    places: ['Serengeti', 'Ngorongoro', 'Tarangire', 'Zanzibar', 'Lake Manyara', 'Arusha'],
  },
  {
    name: 'Egypt',
    slug: 'egypt',
    continent: 'africa',
    isoNumeric: '818',
    isoAlpha2: 'EG',
    orderRank: 4,
    visited: '2025-12-04',
    shortIntro: 'Stone that has been photographed a million times, and still worth one more.',
    story: [
      'The temples are enormous and the light inside them is terrible, which is exactly what makes them interesting. You work with slivers.',
      'On the Nile the haze does something lovely to distance — every layer of riverbank is a paler blue than the one in front of it.',
    ],
    places: ['Luxor', 'Aswan', 'Giza', 'Abu Simbel', 'Siwa', 'Philae'],
  },

  // Asia
  {
    name: 'Japan',
    slug: 'japan',
    continent: 'asia',
    isoNumeric: '392',
    isoAlpha2: 'JP',
    featured: true,
    orderRank: 1,
    visited: '2026-04-02',
    shortIntro: 'Blossom for eight days, rain for three, and neon every single night.',
    story: [
      'Kyoto before six in the morning belongs to nobody. After seven it belongs to everybody. The entire trip was organised around that one fact.',
      'Tokyo I photographed almost entirely after dark, handheld and slightly wet, which turns out to be the correct way to photograph Tokyo.',
    ],
    places: ['Kyoto', 'Tokyo', 'Kanazawa', 'Hakone', 'Nara', 'Naoshima'],
  },
  {
    name: 'Vietnam',
    slug: 'vietnam',
    continent: 'asia',
    isoNumeric: '704',
    isoAlpha2: 'VN',
    orderRank: 2,
    visited: '2025-11-02',
    shortIntro: 'Motorbike mornings, limestone afternoons and soup at every hour.',
    story: [
      'Hanoi rewards standing still. Pick a corner, order something, and the entire city walks past you in an hour.',
      'Up north the karst towers stack into each other and the mist sorts them into layers for you. Free depth, no work required.',
    ],
    places: ['Hanoi', 'Hội An', 'Ninh Bình', 'Sa Pa', 'Hạ Long', 'Huế'],
  },
  {
    name: 'Nepal',
    slug: 'nepal',
    continent: 'asia',
    isoNumeric: '524',
    isoAlpha2: 'NP',
    featured: true,
    orderRank: 3,
    visited: '2026-04-24',
    shortIntro: 'Ten days above the clouds, carrying one body and one lens.',
    story: [
      'At altitude you become extremely honest about what is in your bag. I took one camera and one lens and did not miss a single thing I left behind.',
      'The mountains show themselves for about twenty minutes after dawn and then pull the cloud back up. Everything I like from this trip was made before breakfast.',
    ],
    places: ['Pokhara', 'Namche', 'Kathmandu', 'Tengboche', 'Annapurna', 'Bhaktapur'],
  },
  {
    name: 'Jordan',
    slug: 'jordan',
    continent: 'asia',
    isoNumeric: '400',
    isoAlpha2: 'JO',
    orderRank: 4,
    visited: '2025-03-18',
    shortIntro: 'Sandstone, silence and a night sky with nothing in the way of it.',
    story: [
      'Petra is a canyon before it is a monument, and the canyon is the better photograph.',
      'In Wadi Rum I slept outside on purpose. The stars came down to the horizon on all sides, which I had read about and not believed.',
    ],
    places: ['Petra', 'Wadi Rum', 'Amman', 'Dana', 'Jerash', 'Aqaba'],
  },

  // South America
  {
    name: 'Peru',
    slug: 'peru',
    continent: 'south-america',
    isoNumeric: '604',
    isoAlpha2: 'PE',
    featured: true,
    orderRank: 1,
    visited: '2025-08-12',
    shortIntro: 'Altitude, textiles and ruins that appear out of cloud without warning.',
    story: [
      'The Sacred Valley is all about weather moving through gaps. You watch a storm cross the valley for twenty minutes and then shoot for two.',
      'Cusco at 3,400 metres taught me to walk slowly and shoot from where I was standing rather than where I wished I were standing.',
    ],
    places: ['Cusco', 'Machu Picchu', 'Ollantaytambo', 'Arequipa', 'Colca', 'Lake Titicaca'],
  },
  {
    name: 'Argentina',
    slug: 'argentina',
    continent: 'south-america',
    isoNumeric: '032',
    isoAlpha2: 'AR',
    featured: true,
    orderRank: 2,
    visited: '2026-08-02',
    shortIntro: 'Patagonia in shoulder season: wind, granite and almost nobody else.',
    story: [
      'Fitz Roy gets one good morning in about five. I was there for nine and got two, which everybody told me was greedy.',
      'The wind is the thing nobody warns you about properly. I lost a lens cloth, a hat and most of my patience, and would go straight back.',
    ],
    places: ['El Chaltén', 'El Calafate', 'Ushuaia', 'Bariloche', 'Salta', 'Buenos Aires'],
  },
  {
    name: 'Chile',
    slug: 'chile',
    continent: 'south-america',
    isoNumeric: '152',
    isoAlpha2: 'CL',
    orderRank: 3,
    visited: '2026-08-14',
    shortIntro: 'Towers of granite at one end, the driest desert on earth at the other.',
    story: [
      'Torres del Paine in the wind is less photography than weightlifting. Tripod low, legs wide, hope.',
      'Then north to Atacama, where the ground looks like somewhere else entirely and the night sky is the main event.',
    ],
    places: ['Torres del Paine', 'Atacama', 'Valparaíso', 'Chiloé', 'Puerto Natales', 'Elqui'],
  },
  {
    name: 'Brazil',
    slug: 'brazil',
    continent: 'south-america',
    isoNumeric: '076',
    isoAlpha2: 'BR',
    orderRank: 4,
    visited: '2026-01-06',
    shortIntro: 'Water, noise and a city built into the side of a rainforest.',
    story: [
      'Iguaçu is the loudest place I have ever worked. You cannot hear your own shutter and everything you own is wet within a minute.',
      'Rio I photographed from hills at either end of the day, because in between the contrast is unusable and the beach is more fun anyway.',
    ],
    places: ['Rio de Janeiro', 'Iguaçu', 'Paraty', 'Salvador', 'Lençóis', 'Ilha Grande'],
  },

  // Oceania
  {
    name: 'New Zealand',
    slug: 'new-zealand',
    continent: 'oceania',
    isoNumeric: '554',
    isoAlpha2: 'NZ',
    featured: true,
    orderRank: 1,
    visited: '2025-04-08',
    shortIntro: 'Four seasons in an afternoon, repeated for three weeks.',
    story: [
      'The South Island is small on paper and enormous in practice. Every pass gives you a completely different country on the other side.',
      'I stopped planning shots after the first week and simply drove until something made me brake. It worked better.',
    ],
    places: ['Wānaka', 'Milford Sound', 'Mount Cook', 'Queenstown', 'Catlins', 'Tekapo'],
  },
  {
    name: 'Australia',
    slug: 'australia',
    continent: 'oceania',
    isoNumeric: '036',
    isoAlpha2: 'AU',
    orderRank: 2,
    visited: '2025-07-01',
    shortIntro: 'Red centre, wild coast, and light that arrives with a hard edge.',
    story: [
      'The interior is so bright at midday that the only sensible thing to do is sleep and work either side of it.',
      'On the coast I went the other way entirely and photographed nothing but water and weather for a fortnight.',
    ],
    places: ['Uluru', 'Kings Canyon', 'Great Ocean Road', 'Tasmania', 'Byron Bay', 'Ningaloo'],
  },
  {
    name: 'Fiji',
    slug: 'fiji',
    continent: 'oceania',
    isoNumeric: '242',
    isoAlpha2: 'FJ',
    orderRank: 3,
    visited: '2026-05-17',
    shortIntro: 'Every blue in the box, and then a few more.',
    story: [
      'From the air the reef does something to colour that a photograph can only partly carry. I tried anyway, many times.',
      'The best frames turned out to be the smallest ones — hands, boats, rope, shade. The wide shots all look like a brochure.',
    ],
    places: ['Yasawa', 'Taveuni', 'Mamanuca', 'Kadavu', 'Vanua Levu', 'Beqa'],
  },
  {
    name: 'Papua New Guinea',
    slug: 'papua-new-guinea',
    continent: 'oceania',
    isoNumeric: '598',
    isoAlpha2: 'PG',
    orderRank: 4,
    visited: '2026-07-09',
    shortIntro: 'Highlands, hand-built canoes and the steepest green on earth.',
    story: [
      'This was the hardest trip to photograph and the one I think about most. Nothing about it was convenient and everything about it was worth it.',
      'I came home with fewer frames than any other trip and more of them that I actually like.',
    ],
    places: ['Mount Hagen', 'Sepik', 'Rabaul', 'Tufi', 'Madang', 'Goroka'],
  },
]

/** Caption shapes, rotated so every photo reads like a note rather than a label. */
export const CAPTION_TEMPLATES = [
  (place: string) => `First light over ${place}.`,
  (place: string) => `${place}, before anyone else was awake.`,
  (place: string) => `Waiting out the weather in ${place}.`,
  (place: string) => `The long way round to ${place}.`,
  (place: string) => `Last of the sun, ${place}.`,
  (place: string) => `Somewhere above ${place}.`,
  (place: string) => `${place} in the rain, which was better.`,
  (place: string) => `Quiet street, ${place}.`,
  (place: string) => `Twenty minutes of gold in ${place}.`,
  (place: string) => `${place} from the road.`,
  (place: string) => `Looking back at ${place}.`,
  (place: string) => `${place}, and then the cloud came in.`,
]

export const TAG_POOL = [
  'landscape',
  'coast',
  'mountains',
  'street',
  'architecture',
  'golden hour',
  'blue hour',
  'portrait',
  'detail',
  'water',
]

export const TRIPS: SeedTrip[] = [
  {
    title: 'The Long Way Down Patagonia',
    slug: 'the-long-way-down-patagonia',
    countries: ['argentina', 'chile'],
    startDate: '2026-08-02',
    endDate: '2026-08-27',
    summary:
      'Twenty-five days of granite and wind, from El Chaltén down to Torres del Paine and back up the other side.',
  },
  {
    title: 'Highlands and Hand-Built Canoes',
    slug: 'highlands-and-hand-built-canoes',
    countries: ['papua-new-guinea'],
    startDate: '2026-07-09',
    endDate: '2026-07-24',
    summary: 'Two weeks in the highlands and along the Sepik, carrying almost nothing.',
  },
  {
    title: 'Ten Days Above the Clouds',
    slug: 'ten-days-above-the-clouds',
    countries: ['nepal'],
    startDate: '2026-04-24',
    endDate: '2026-05-06',
    summary: 'One body, one lens, and a great deal of walking uphill in the dark.',
  },
  {
    title: 'Slow Roads Through Portugal',
    slug: 'slow-roads-through-portugal',
    countries: ['portugal'],
    startDate: '2025-09-28',
    endDate: '2025-10-12',
    summary: 'Tiles, cliffs and a rented car with a broken radio.',
  },
]

export const NOTES: SeedNote[] = [
  {
    title: 'What I actually carry',
    slug: 'what-i-actually-carry',
    date: '2026-09-02',
    country: 'nepal',
    excerpt:
      'After ten days at altitude I came home and took half the bag out permanently. Here is what survived.',
    body: [
      'Every trip I pack slightly less, and every trip I notice slightly less missing. Nepal finished the argument: one body, one lens, four batteries and a cloth.',
      'The thing nobody tells you is that the constraint improves the pictures. When you cannot change the framing by changing the lens, you move your feet, and moving your feet is where the good frames live.',
    ],
  },
  {
    title: 'On being early',
    slug: 'on-being-early',
    date: '2026-08-19',
    country: 'argentina',
    excerpt: 'Nine mornings at Fitz Roy, two of them clear. The other seven were not wasted.',
    body: [
      'Patagonia taught me to treat a failed morning as a rehearsal. By the time the sky finally cooperated I knew exactly where to stand and how long I had.',
      'Turn up early enough, often enough, and eventually the weather owes you one.',
    ],
  },
  {
    title: 'Eleven minutes in a cenote',
    slug: 'eleven-minutes-in-a-cenote',
    date: '2026-04-30',
    country: 'mexico',
    excerpt: 'The sun drops through a hole in the roof, the water turns, and then it is over.',
    body: [
      'You can look up the time the light enters, and it will be roughly right, and you should still get there an hour before.',
      'When it happens the whole cave goes turquoise from below. I shot it at a much slower shutter than I meant to and the softness turned out to be the point.',
    ],
  },
  {
    title: 'Kyoto before six',
    slug: 'kyoto-before-six',
    date: '2026-04-14',
    country: 'japan',
    excerpt: 'The entire trip was organised around one fact about mornings.',
    body: [
      'Before six the lanes in Gion belong to cats and delivery bicycles. After seven they belong to everyone, and the photographs stop being about the place.',
      'I did not once regret the alarm, which is not something I can say about most decisions I make at midnight.',
    ],
  },
  {
    title: 'Asking first',
    slug: 'asking-first',
    date: '2026-02-11',
    country: 'morocco',
    excerpt: 'The portraits I like best are the ones where somebody said yes and then forgot I was there.',
    body: [
      'A camera pointed at a stranger is a question whether or not you ask it out loud. Asking out loud simply makes it a better question.',
      'Half of them say no. The half that say yes give you something no long lens could ever reach.',
    ],
  },
  {
    title: 'Why I stopped shooting in the middle of the day',
    slug: 'why-i-stopped-shooting-in-the-middle-of-the-day',
    date: '2025-12-20',
    country: 'namibia',
    excerpt: 'Two hours either side of dawn and dusk. Everything else is for driving and eating.',
    body: [
      'In the Namib the midday sun flattens the dunes into nothing. The same dune at six in the morning is a hard line between orange and black, and that line is the whole picture.',
      'It sounds lazy to sleep through the brightest part of the day. It is the single biggest improvement I have ever made to my work.',
    ],
  },
]

export const WHERE_TO_NEXT = [
  {
    name: 'Faroe Islands',
    when: 'Next spring',
    note: 'Grass-roofed churches, sea stacks and a forecast I will simply have to accept.',
  },
  {
    name: 'Mongolia',
    when: 'Late summer',
    note: 'Steppe, horses and a week without a paved road anywhere near me.',
  },
  {
    name: 'Svalbard',
    when: 'Someday soon',
    note: 'Blue ice, no darkness, and the top of the map.',
  },
]

export const EQUIPMENT = [
  {
    name: 'Full-frame mirrorless body',
    category: 'body',
    note: 'Weather-sealed, quiet, and the only camera I own that has never let me down in rain.',
  },
  {
    name: '35mm f/1.4',
    category: 'lens',
    note: 'On the camera about seventy percent of the time. Close enough to be in it, wide enough to show where you are.',
  },
  {
    name: '24-70mm f/2.8',
    category: 'lens',
    note: 'The travel-day lens. One lens, one bag, no decisions.',
  },
  {
    name: '70-200mm f/4',
    category: 'lens',
    note: 'For compressing mountains and for staying out of the way.',
  },
  {
    name: 'Canvas shoulder bag',
    category: 'bag',
    note: 'Looks like luggage, not like camera gear. That matters more than it should.',
  },
  {
    name: 'Carbon travel tripod',
    category: 'accessory',
    note: 'Light enough to resent carrying and strong enough to be glad I did.',
  },
]

export const SITE_QUOTES = [
  {
    text: 'Life is either a daring adventure or nothing at all.',
    attribution: 'Helen Keller',
  },
  { text: 'YOLO — you only live once.', attribution: null },
  { text: 'Adventure is out there.', attribution: null },
]

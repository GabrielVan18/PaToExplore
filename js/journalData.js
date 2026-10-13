// ---------------------------------------------------------------------------
// JOURNAL DATA - what Lolo's Journal says, page by page.
//
// journalBook.js (the reusable book) only knows HOW to draw pages. Everything
// the pages SAY lives here, so fixing a fact or adding a page never touches
// the drawing code.
//
// EVERY LINE BELOW IS MEANT TO BE A REAL FACT ABOUT PATEROS. The sources are
// listed on the "About" page at the back of the book (see JOURNAL_BOOK_DATA.about).
// Where sources disagree (the founding year, mostly) the page says so instead
// of picking a side quietly. Research last checked: September 2026.
//
// SHAPE OF A CHAPTER
//   id        0 = Prologue, 1-5 = Chapters. This is the number stored in
//             ChapterProgress (progress.js) once the player finishes it.
//   tab       what the little side tab / contents circle shows
//   kicker    small label printed above the page heading
//   finish    how a locked page tells the player to unlock it
//   spreads   one or more two-page spreads. Each has:
//     left  : { title, note?, and ONE of  sketches | timeline | eggs }
//     right : { title, body: [paragraphs], fact?: { label, text } }
//
// LIMITS (so text always fits on the page - the book shrinks type a little,
// but it cannot make room that is not there):
//   sketches  1 to 4 drawings          timeline  up to 6 entries, text under ~75 chars
//   eggs      up to 10 names           body      under ~520 characters in total
//   fact.text under ~160 characters    note      under ~100 characters
// ---------------------------------------------------------------------------

// Drawings the book can pin to a page: name -> file in assets/icons/.
// These are the same icon files the chapters already load, so no new art.
const JOURNAL_ICON_FILES = {
  well: 'obj-old-well.png',
  marketStall: 'obj-market-stall.png',
  statue: 'obj-statue.png',

  boat: 'ch1-boat.png',
  goods: 'ch1-goods.png',
  agoho: 'ch1-agoho-tree.png',
  house: 'ch1-house.png',
  tradingStall: 'ch1-trading-stall.png',

  market: 'ch2-market.png',
  municipal: 'ch2-municipal-building.png',
  community: 'ch2-community-area.png',
  houses: 'ch2-house.png',

  flag: 'ch3-hidden-flag.png',
  letter: 'ch3-secret-letter.png',
  antingAnting: 'ch3-anting-anting.png',
  safehouse: 'ch3-safehouse-mark.png',

  egg: 'ch4-egg-plain.png',

  alfombra: 'ch5-alfombra.png',
  pandangguhan: 'ch5-pandangguhan.png',
  santamarta: 'ch5-santamarta.png',
  balut: 'ch5-balut.png'
};

// The animated duck sheet Chapters 4 and 5 use; the journal shows frame 0.
// Use it in a sketch as { icon: 'duck', caption: '...' }.
const JOURNAL_DUCK_SHEET = { key: 'duck', file: 'duck-walk.png', frameWidth: 64, frameHeight: 72 };

const JOURNAL_BOOK_DATA = {
  title: "Lolo's Journal",
  subtitle: 'Stories of Pateros',
  contentsHint: 'Finish a chapter in the game to collect its page. Locked pages open by themselves.',

  chapters: [
    // ------------------------------------------------------------ PROLOGUE --
    {
      id: 0,
      tab: 'P',
      kicker: 'PROLOGUE',
      finish: 'the Prologue',
      title: 'Prologue: Welcome to Pateros',
      tagline: 'The lone municipality',
      teaser: 'Every journey starts in the plaza.',
      color: 0x7a5a36,
      spreads: [
        {
          left: {
            title: 'Around the Plaza',
            sketches: [
              { icon: 'well', caption: 'The plaza well' },
              { icon: 'marketStall', caption: 'A market stall' },
              { icon: 'statue', caption: 'A town monument' }
            ],
            note: 'Start at the plaza, apo. Every street in Pateros leads to a page in this journal.'
          },
          right: {
            title: 'The Lone Municipality',
            body: [
              'Pateros is the only municipality in Metro Manila. Every other local government in the metropolis is a city.',
              'It is also the smallest municipality in the country by land area, under two square kilometers by most counts, yet more than 67,000 people live here.',
              'Pasig lies to the north. Taguig wraps around the east, west and south.'
            ],
            fact: {
              label: 'AT A GLANCE',
              text: 'Nickname: Balut Capital of the Philippines. Ten barangays. Population: 67,319 (2024 census).'
            }
          }
        },
        {
          left: {
            title: 'Ten Barangays',
            eggs: [
              'Aguho', 'Magtanggol', 'Martires del 96', 'Poblacion', 'San Pedro',
              'San Roque', 'Santa Ana', 'Sto. Rosario-Kanluran', 'Sto. Rosario-Silangan', 'Tabacalera'
            ],
            note: 'Aguho, the oldest name, is still on the map, apo.'
          },
          right: {
            title: 'Why "Pateros"?',
            body: [
              'The name starts with pato, the Spanish word for duck, and is usually explained as "duck raisers". The town\'s own history also ties it to sapatero, the word for shoemaker.',
              'In 1834 the American envoy Edmund Roberts passed through and wrote that he had never seen so many ducks together in one place.',
              'The town seal shows a mallard duck and ten duck eggs, one egg for each barangay.'
            ],
            fact: {
              label: 'DID YOU KNOW?',
              text: 'A second Pateros stands in Washington State, USA. It was renamed in 1900 after this town, and the two signed a sister-city memorandum in 2013.'
            }
          }
        }
      ]
    },

    // ------------------------------------------------------------ CHAPTER 1 --
    {
      id: 1,
      tab: '1',
      kicker: 'CHAPTER 1',
      finish: 'Chapter 1',
      title: 'Aguho: The River Remembers',
      tagline: 'Aguho, the river port',
      teaser: 'The oldest pages are about the river.',
      color: 0x2f7ea1,
      spreads: [
        {
          left: {
            title: 'Along the River',
            sketches: [
              { icon: 'agoho', caption: 'The agoho tree' },
              { icon: 'boat', caption: 'A banca on the river' },
              { icon: 'tradingStall', caption: 'A stall at the embarcadero' },
              { icon: 'house', caption: 'A riverside house' }
            ],
            note: 'Aguho is still a barangay of Pateros today. The old name never left, apo.'
          },
          right: {
            title: 'The Name Aguho',
            body: [
              'Long before it was a town, Pateros was a barrio of Pasig called Aguho, also known as the embarcadero, or small port.',
              'The name comes from the agoho, a tall tree that grew in numbers along the Pateros River. Their shade gave the place its name.',
              'Thanks to its port, Aguho became the most progressive barrio of Pasig.'
            ],
            fact: {
              label: 'AGOHO',
              text: 'Casuarina equisetifolia: a tall evergreen tree that is also called the whistling pine.'
            }
          }
        },
        {
          left: {
            title: 'The Embarcadero',
            sketches: [
              { icon: 'tradingStall', caption: 'The trading stall' },
              { icon: 'boat', caption: 'A banca' },
              { icon: 'goods', caption: 'Goods for trade' }
            ],
            note: 'In those days the river was the road, apo.'
          },
          right: {
            title: 'A Port Town',
            body: [
              "An embarcadero is a small port, a place where boats load and unload. Aguho's port made it the center of trade for Pasig and the towns around it.",
              "According to the town's own history, ships from far away (Malay, Chinese, Swedish and Indian) called here from time to time to unload goods and trade.",
              'Chinese traders who settled in Pateros are credited with introducing the balut industry.'
            ],
            fact: {
              label: 'EMBARCADERO',
              text: 'From the Spanish embarcar, "to board". A small port or landing place.'
            }
          }
        }
      ]
    },

    // ------------------------------------------------------------ CHAPTER 2 --
    {
      id: 2,
      tab: '2',
      kicker: 'CHAPTER 2',
      finish: 'Chapter 2',
      title: 'The Birth of a Municipality',
      tagline: 'From barrio to municipality',
      teaser: 'A river port grows into a town.',
      color: 0xb5652b,
      spreads: [
        {
          left: {
            title: 'Building a Town',
            sketches: [
              { icon: 'market', caption: 'The market' },
              { icon: 'municipal', caption: 'The municipal building' },
              { icon: 'community', caption: 'A place to gather' },
              { icon: 'houses', caption: 'Homes for the people' }
            ],
            note: 'A real town needs more than a name, apo.'
          },
          right: {
            title: 'From Barrio to Town',
            body: [
              'For a long time Pateros belonged to Pasig. Local records call it a barrio and visita of the parish there since 1572.',
              'In 1799 a decree of the Spanish Governor-General made Pateros a town of its own. It began with five barrios: Aguho, San Roque, Santa Ana, Santo Rosario and Mamangcat.',
              'The church came later. After the archbishop approved the townspeople\'s petition, a decree of July 7, 1815 made San Roque its own parish. In 1828 Gobernadorcillo Valentin Tuason was town head at the first fiesta.'
            ],
            fact: {
              label: 'A NOTE ON DATES',
              text: 'Sources disagree on the exact year. Turn the page to see the dates and why they differ.'
            }
          }
        },
        {
          left: {
            title: 'Which Year?',
            timeline: [
              { date: '1572', text: 'Pateros is a barrio and visita of Pasig, then called Aguho.' },
              { date: '1700?', text: 'Printed in an older town history text. Likely a typing slip.' },
              { date: '1770', text: 'Given by older write-ups as the year of separation.' },
              { date: '1799', text: 'A Spanish decree makes Pateros an independent municipality.' },
              { date: '1815', text: 'A decree of July 7 makes San Roque its own parish.' }
            ]
          },
          right: {
            title: 'Political Independence',
            body: [
              'Pateros began as a barrio of Pasig called Aguho, or embarcadero (small port).',
              'In 1799 the Spanish Governor-General issued a decree separating Pateros from Pasig and making it an independent municipality. Most current sources give this date.',
              "Older write-ups, including an earlier version of Wikipedia, say 1770. An older version of the town's own history text prints 1700, which is likely a typing slip for 1799, though no source says so outright."
            ],
            fact: {
              label: 'READING THE DATES',
              text: 'When sources disagree, the journal gives the most current date and names the others.'
            }
          }
        },
        {
          left: {
            title: 'Ups and Downs',
            timeline: [
              { date: '1900-01', text: 'Made a municipality (1900), then part of the new Province of Rizal (1901).' },
              { date: '1903', text: 'Pateros, Taguig and Muntinlupa are merged, with Pateros as the seat.' },
              { date: '1905', text: 'The merged town is renamed Taguig.' },
              { date: '1908', text: 'Executive Order 20 separates Pateros from Taguig.' },
              { date: '1909', text: 'A municipality again, on January 1.' },
              { date: '1975', text: 'Pateros joins Metropolitan Manila.' }
            ]
          },
          right: {
            title: 'The Only One',
            body: [
              'In 1903 Pateros was merged with Taguig and Muntinlupa. By 1905 the merged town was renamed Taguig. Pateros was separated again in 1908 and became a municipality of its own on January 1, 1909.',
              'Today it is the only municipality left in Metro Manila. The other 16 local governments are all cities.'
            ],
            fact: {
              label: 'METRO MANILA',
              text: 'Presidential Decree No. 824 created Metropolitan Manila on November 7, 1975. Pateros was part of it from the start.'
            }
          }
        }
      ]
    },

    // ------------------------------------------------------------ CHAPTER 3 --
    {
      id: 3,
      tab: '3',
      kicker: 'CHAPTER 3',
      finish: 'Chapter 3',
      title: 'Pateros in the Revolution',
      tagline: 'Katipuneros of Pateros, 1896',
      teaser: 'Some pages were written in secret.',
      color: 0x8a3a52,
      spreads: [
        {
          left: {
            title: 'Signs of the Secret',
            sketches: [
              { icon: 'flag', caption: 'A hidden flag' },
              { icon: 'letter', caption: 'A secret letter' },
              { icon: 'antingAnting', caption: 'A Katipunan token' },
              { icon: 'safehouse', caption: 'A meeting marker' }
            ],
            note: 'The game gives Macario Almeda lines to speak, apo, but this page sticks to the record.'
          },
          right: {
            title: 'The Katipunan in Pateros',
            body: [
              'In April 1896 the Katipunan founded its Pateros chapter, the Sangguniang Balangay Magtanggol, at a house in Barrio Santo Rosario.',
              'Its commander was Macario Almeda (Kabesang Cario), a 29-year-old farmer and village head. His secret name was Kidlat.',
              'By August 1896 the chapter is said to have had about 1,200 members.'
            ],
            fact: {
              label: 'SAGISAG',
              text: 'A sagisag was the secret name a Katipunero used in place of a real one. Kidlat means lightning.'
            }
          }
        },
        {
          left: {
            title: 'The Uprising, 1896',
            timeline: [
              { date: 'Aug 22', text: 'Word of the coming uprising reaches the chapter.' },
              { date: 'Aug 27-28', text: 'Foundries in Pateros hurry to forge talibong blades.' },
              { date: 'Aug 29', text: 'Katipuneros take the tribunal, then fight the Guardia Civil at Dulumbayan.' },
              { date: 'Sep 15', text: 'Almeda and Marcos Lozada are killed at the town boundary.' },
              { date: 'Dec 31', text: "Aguinaldo's forces briefly take Pateros." }
            ]
          },
          right: {
            title: 'Remembering the Heroes',
            body: [
              'On September 15, 1896, Almeda and Lozada were marched toward Pasig. At the edge of Pateros they refused to go farther and said they would rather die in their own town. Almeda was 29.',
              'Other Pateros Katipuneros were arrested and deported to the Mariana Islands.',
              "Calle Real, the main road, is named for Almeda. In 1922 veterans put up a monument to the Martires del '96 at Dulumbayan."
            ],
            fact: {
              label: "MARTIRES DEL '96",
              text: "One of the ten barangays of Pateros carries this name: the Martyrs of '96."
            }
          }
        }
      ]
    },

    // ------------------------------------------------------------ CHAPTER 4 --
    {
      id: 4,
      tab: '4',
      kicker: 'CHAPTER 4',
      finish: 'Chapter 4',
      title: 'The Balut Capital',
      tagline: 'Ducks, eggs and a river',
      teaser: 'Warm eggs and a river full of ducks.',
      color: 0xc7952a,
      spreads: [
        {
          left: {
            title: 'Ducks by the River',
            sketches: [
              { icon: 'duck', caption: 'An itik, the Philippine mallard' },
              { icon: 'egg', caption: 'A duck egg' },
              { icon: 'balut', caption: 'Balut' }
            ],
            note: 'Mang Carding is make-believe, apo, but duck-raising families were very real.'
          },
          right: {
            title: 'The Balut Capital',
            body: [
              'The ducks of Pateros were itik, hardy Philippine mallards raised mainly for their eggs.',
              'Historians believe Chinese traders brought the idea of incubating duck eggs in the 1500s. Pateros became its best-known home.',
              'By the 1950s the town was estimated to have about 400,000 ducks, and its balut trade stayed strong into the 1960s.',
              'In the 1970s urbanization and a polluted river drove the ducks away.'
            ],
            fact: {
              label: 'BALUT',
              text: 'The word means "wrapped". The classic balut is incubated about 18 days and is called balut sa puti.'
            }
          }
        },
        {
          left: {
            title: 'Making Balut',
            timeline: [
              { date: 'Start', text: 'Thick-shelled eggs under 5 days old are tapped and picked.' },
              { date: 'Sun', text: 'The eggs are warmed in the sun for a few hours.' },
              { date: 'Balutan', text: 'Wrapped and basketed, they are kept warm by heated rice husks.' },
              { date: 'Daily', text: 'Each egg is turned two or three times a day.' },
              { date: 'Day 11', text: 'Candling: a web of veins shows the egg is alive.' },
              { date: 'Day 18', text: 'Balut sa puti is ready to be boiled.' }
            ]
          },
          right: {
            title: 'A Craft Handed Down',
            body: [
              'The traditional balutan was a dark, humid hut of bamboo and nipa. In Pateros the heated rice husks were mixed with mud to hold the warmth.',
              'A balut maker is called a magbabalut. Makers who keep the trade alive now bring in eggs from provinces like Bulacan, Laguna and Nueva Ecija.',
              'The town holds a yearly Balut sa Puti Festival to celebrate its delicacy.'
            ],
            fact: {
              label: 'PENOY',
              text: 'An egg that turns out infertile is not thrown away. It is sold as penoy.'
            }
          }
        }
      ]
    },

    // ------------------------------------------------------------ CHAPTER 5 --
    {
      id: 5,
      tab: '5',
      kicker: 'CHAPTER 5',
      finish: 'Chapter 5',
      title: 'A Living Heritage',
      tagline: 'Traditions alive today',
      teaser: 'The last page is still being written.',
      color: 0x3c7a3e,
      spreads: [
        {
          left: {
            title: 'Still Alive Today',
            sketches: [
              { icon: 'alfombra', caption: 'Alfombra' },
              { icon: 'pandangguhan', caption: 'Pandangguhan' },
              { icon: 'santamarta', caption: 'Santa Marta' },
              { icon: 'balut', caption: 'Balut' }
            ],
            note: 'None of it survives on its own, apo. People choose to pass it on.'
          },
          right: {
            title: 'Santa Marta and the Pandangguhan',
            body: [
              'Santa Marta (Saint Martha) is a patroness of Pateros, one of five patron saints the town honors. Her shrine is in San Roque Parish Church.',
              "A local legend from the 1800s tells of a crocodile that threatened the town's ducks. The people prayed to Santa Marta, and the creature was gone.",
              'Every February the town honors her with the Pandangguhan, a parade of pandanggo dancers. In the pasubo, food like balut, suman and fruit is thrown to the crowd.'
            ],
            fact: {
              label: 'FEAST DAYS',
              text: 'The big fiesta falls around the second Sunday of February. Her universal feast day is July 29.'
            }
          }
        },
        {
          left: {
            title: 'Through the Years',
            timeline: [
              { date: '1815', text: 'San Roque Parish is founded by decree on July 7.' },
              { date: '1828', text: 'First town fiesta, under Gobernadorcillo Valentin Tuason.' },
              { date: '1935', text: 'Honorata Tuazon Cruz introduces the alfombra slipper.' },
              { date: '1950s', text: 'Pateros raises an estimated 400,000 ducks.' },
              { date: '2013', text: 'Pateros signs a sister-city memorandum with Pateros, Washington.' },
              { date: '2023', text: 'The church and shrine become an Important Cultural Property.' }
            ]
          },
          right: {
            title: 'Alfombra: Slippers with a Story',
            body: [
              'Alfombra is the Spanish word for carpet. These slippers have a soft, carpet-like fabric on top, and Pateros shoemakers have made them by hand for generations.',
              "The town's culture page traces the design to 1935 and the shoemaker Honorata Tuazon Cruz.",
              'Fewer makers remain today, but alfombra is still made and worn.'
            ],
            fact: {
              label: 'A SHOE TOWN',
              text: "The town's culture page says Pateros was called the Shoe Capital of the Philippines before World War II."
            }
          }
        }
      ]
    }
  ],

  // Back page: sources + honesty note. Keep the list to ~8 short lines.
  about: {
    leftTitle: 'Sources',
    sources: [
      'Municipality of Pateros: History and Culture pages (pateros.gov.ph)',
      'Wikipedia: Pateros, Pateros Church, Santa Marta de Pateros, Battle of Pateros',
      'E. Nocheseda, "The Pateros 1896 Revolution," parts 1 and 2 (pateros-philippines.com)',
      'pateros-philippines.com: town and parish history',
      'Alejandria et al., "The authentic balut," Journal of Ethnic Foods, 2019',
      'Philippine Information Agency, "Keeping Fandango alive in Metro Manila\'s lone municipality," 2026',
      'Daily Tribune, "Feast of Santa Marta de Pateros 2026"',
      'HistoryLink.org, "Pateros" (Pateros, Washington)'
    ],
    rightTitle: 'About This Journal',
    body: [
      "Lolo's Journal is a story built on real history. Macario Almeda and Valentin Tuason were real people, and their spoken lines in the game are dramatized. Mang Carding, Ate Clara and Maya stand for the many Pateros families who keep these trades alive. The places, dates and traditions on its pages come from the sources at left.",
      'Historians do not always agree on exact years. Where sources differ, the journal says so.'
    ],
    fact: {
      label: 'LAST CHECKED',
      text: 'September 2026. Population is from the 2024 census. Dates were compared across the sources listed.'
    }
  }
};

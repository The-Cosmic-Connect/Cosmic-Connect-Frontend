export interface CurriculumModule {
  title: string
  lessons: string[]
}

export interface Testimonial {
  name: string
  location: string
  text: string
  rating: number
}

export interface CourseData {
  slug:           string
  title:          string
  tagline:        string
  seoTitle:       string
  seoDesc:        string
  icon:           string
  accentColor:    string
  duration:       string
  totalLessons:   number
  level:          string
  language:       string
  priceOnline:    string
  priceInPerson:  string
  nextBatchDate:  string
  seatsLeft:      number
  intro:          string
  whatYouLearn:   string[]
  whoIsItFor:     string[]
  curriculum:     CurriculumModule[]
  testimonials:   Testimonial[]
  faqs:           { q: string; a: string }[]
}

export const courses: CourseData[] = [
  {
    slug:          'tarot-mastery',
    title:         'Tarot Mastery',
    tagline:       'Master all 78 cards and read with confidence',
    seoTitle:      'Tarot Card Reading Course | Dr. Usha Bhatt | The Cosmic Connect',
    seoDesc:       'Learn Tarot card reading from scratch with Dr. Usha Bhatt. Master all 78 cards, spreads, and intuitive reading. Online & in-person batches. Enroll today.',
    icon:          '🃏',
    accentColor:   '#4A2C8A',
    duration:      '6 Weeks',
    totalLessons:  24,
    level:         'All Levels',
    language:      'Hindi & English',
    priceOnline:   '₹8,999',
    priceInPerson: '₹12,999',
    nextBatchDate: 'Contact us for next batch',
    seatsLeft:     8,
    intro:         'Tarot Mastery is Dr. Usha Bhatt\'s signature course — a comprehensive journey through all 78 cards of the Tarot. Whether you are a complete beginner or looking to deepen an existing practice, this course will take you from understanding the basics to performing confident, accurate readings for yourself and others.',
    whatYouLearn: [
      'The complete history and symbolism of the Tarot',
      'All 22 Major Arcana cards — meanings, reversed meanings, and intuitive interpretation',
      'All 56 Minor Arcana cards across all four suits',
      'Popular spread systems including Celtic Cross, Three Card, and custom spreads',
      'How to conduct professional readings for love, career, finances, and spirituality',
      'How to read card combinations and tell a story from a spread',
      'Ethical guidelines for reading for others',
      'How to cleanse, charge, and connect with your Tarot deck',
    ],
    whoIsItFor: [
      'Complete beginners with no prior Tarot knowledge',
      'Those who have tried to learn Tarot but feel overwhelmed',
      'Spiritual practitioners wanting to add Tarot to their toolkit',
      'Anyone wanting to read for friends, family, or professionally',
    ],
    curriculum: [
      {
        title: 'Week 1 — Foundations of Tarot',
        lessons: [
          'History and origins of the Tarot',
          'Structure of the deck — Major vs Minor Arcana',
          'Choosing and connecting with your first deck',
          'How to cleanse and charge your cards',
          'Setting intentions before a reading',
          'Introduction to the Fool\'s Journey',
        ],
      },
      {
        title: 'Week 2 — The Major Arcana (Cards 0–10)',
        lessons: [
          'The Fool through The Wheel of Fortune',
          'Deep symbolism and numerology of each card',
          'Upright and reversed meanings',
          'How Major Arcana affects a reading',
          'Practice readings with Major Arcana only',
        ],
      },
      {
        title: 'Week 3 — The Major Arcana (Cards 11–21)',
        lessons: [
          'Justice through The World',
          'Reading the journey from Strength to completion',
          'Connecting with the archetypes personally',
          'Full Major Arcana practice sessions',
        ],
      },
      {
        title: 'Week 4 — The Minor Arcana',
        lessons: [
          'The four suits: Wands, Cups, Swords, Pentacles',
          'Court cards — Page, Knight, Queen, King',
          'Number cards and their universal meanings',
          'How suits interact in a spread',
        ],
      },
      {
        title: 'Week 5 — Spreads & Readings',
        lessons: [
          'Three Card Spread — Past, Present, Future',
          'Celtic Cross — the gold standard spread',
          'Love, career, and year-ahead spreads',
          'Reading card combinations and flows',
          'Storytelling from a spread',
        ],
      },
      {
        title: 'Week 6 — Professional Practice',
        lessons: [
          'Reading for others ethically and compassionately',
          'Handling difficult cards and sensitive topics',
          'Building your reading practice',
          'Live practice readings with feedback',
          'Course graduation and certification',
        ],
      },
    ],
    testimonials: [
      {
        name: 'Priya Sharma',
        location: 'Delhi',
        text: 'I tried learning Tarot from YouTube for months and got nowhere. Dr. Usha Bhatt\'s structured approach changed everything. Within 6 weeks I was doing full readings for my friends. The course is detailed, intuitive, and incredibly well taught.',
        rating: 5,
      },
      {
        name: 'Ananya Kapoor',
        location: 'Mumbai',
        text: 'The online format was perfect for me. Dr. Bhatt explains complex concepts so simply and her energy during the sessions is just beautiful. I now read Tarot daily and it has completely transformed my self-awareness.',
        rating: 5,
      },
      {
        name: 'Rohit Verma',
        location: 'Bangalore',
        text: 'Initially sceptical, but the depth of knowledge Dr. Bhatt shares is extraordinary. The curriculum covers everything — not just card meanings but the actual intuition behind reading. Highly recommend.',
        rating: 5,
      },
    ],
    faqs: [
      { q: 'Do I need to own a Tarot deck before the course?', a: 'No — Dr. Bhatt will guide you on choosing your first deck during Week 1. A Rider-Waite deck is recommended for beginners but not mandatory.' },
      { q: 'Is this course suitable for complete beginners?', a: 'Absolutely. The course starts from the very basics and progresses systematically. No prior knowledge of Tarot or spirituality is required.' },
      { q: 'Will I receive a certificate?', a: 'Yes. All students who complete the course and the final practice session receive a Certificate of Completion from The Cosmic Connect signed by Dr. Usha Bhatt.' },
      { q: 'What is the difference between online and in-person?', a: 'Online sessions are conducted via Zoom in small groups. In-person sessions are held at our New Delhi studio and include hands-on practice with Dr. Bhatt directly. Both cover identical curriculum.' },
      { q: 'Can I learn at my own pace?', a: 'The course runs as a structured weekly batch for best results. Recordings are available for online students who miss a session.' },
    ],
  },

  {
    slug:          'psychic-development',
    title:         'Psychic Development',
    tagline:       'Awaken and strengthen your innate intuitive gifts',
    seoTitle:      'Psychic Development Course | Dr. Usha Bhatt | The Cosmic Connect',
    seoDesc:       'Develop your psychic and intuitive abilities with Dr. Usha Bhatt. Learn clairvoyance, energy reading, aura scanning, and more. Online & in-person. Enroll now.',
    icon:          '🔮',
    accentColor:   '#8B3A52',
    duration:      '8 Weeks',
    totalLessons:  32,
    level:         'Beginner to Advanced',
    language:      'Hindi & English',
    priceOnline:   '₹11,999',
    priceInPerson: '₹16,999',
    nextBatchDate: 'Contact us for next batch',
    seatsLeft:     6,
    intro:         'Every human being is born with psychic and intuitive abilities — most of us simply have not been taught how to access them. This 8-week programme with Dr. Usha Bhatt will guide you through a systematic, grounded approach to awakening your extrasensory perception and developing it into a reliable, practical skill.',
    whatYouLearn: [
      'Understanding the nature of psychic ability and how it works',
      'Developing clairvoyance (clear seeing) and clairsentience (clear feeling)',
      'Reading and interpreting the human aura and energy field',
      'Scanning and sensing energy in objects, spaces, and people',
      'Opening and strengthening the third eye safely',
      'Psychic protection and energetic boundary setting',
      'Receiving and interpreting psychic impressions accurately',
      'Practical exercises to develop consistent psychic accuracy',
    ],
    whoIsItFor: [
      'Those who feel they have intuitive gifts but do not know how to develop them',
      'Spiritual practitioners wanting to deepen their abilities',
      'Those who frequently experience deja vu, gut feelings, or premonitions',
      'Anyone seeking a deeper connection to the spiritual realm',
    ],
    curriculum: [
      {
        title: 'Week 1 — Understanding Psychic Ability',
        lessons: [
          'What psychic ability is and what it is not',
          'The different clair senses explained',
          'Your dominant psychic sense — discovering yours',
          'Grounding and protection before psychic work',
          'Meditation foundations for psychic development',
        ],
      },
      {
        title: 'Week 2 — Energy Awareness',
        lessons: [
          'Understanding the human energy field (aura)',
          'Sensing and feeling energy with your hands',
          'Reading the energy of objects (psychometry)',
          'Energy of spaces and places',
        ],
      },
      {
        title: 'Week 3 — Aura Reading',
        lessons: [
          'The seven layers of the aura',
          'Seeing and sensing aura colours',
          'What each aura colour means',
          'Reading health and emotional state through the aura',
        ],
      },
      {
        title: 'Week 4 — Developing Clairvoyance',
        lessons: [
          'Opening the third eye chakra safely',
          'Exercises for developing visual psychic impressions',
          'Distinguishing imagination from psychic sight',
          'Symbols and their personal meanings in readings',
        ],
      },
      {
        title: 'Week 5 — Clairsentience & Claircognizance',
        lessons: [
          'Feeling energy and emotions of others',
          'Clear knowing — receiving information without a source',
          'Strengthening your gut feeling and instincts',
          'Boundaries for empaths and sensitives',
        ],
      },
      {
        title: 'Week 6 — Receiving & Interpreting Impressions',
        lessons: [
          'How psychic information arrives — symbols, feelings, words',
          'Translating impressions into clear messages',
          'Practising blind readings',
          'Building accuracy and confidence',
        ],
      },
      {
        title: 'Week 7 — Psychic Protection & Ethics',
        lessons: [
          'Protecting your energy during psychic work',
          'Shielding techniques and psychic hygiene',
          'Ethical responsibilities of a psychic',
          'Reading for others responsibly',
        ],
      },
      {
        title: 'Week 8 — Integration & Practice',
        lessons: [
          'Integrating all skills into complete readings',
          'Live practice sessions with classmates',
          'Building a consistent daily psychic practice',
          'Graduation readings and certification',
        ],
      },
    ],
    testimonials: [
      {
        name: 'Meera Nair',
        location: 'Kochi',
        text: 'I always knew I had some intuitive abilities but had no idea how to use them. Dr. Bhatt\'s course gave me a structured, safe framework to develop them. By week 4 I was already sensing energy accurately. Life-changing.',
        rating: 5,
      },
      {
        name: 'Sunita Agarwal',
        location: 'Jaipur',
        text: 'The grounding and protection techniques alone were worth the entire course. Dr. Bhatt is so thorough and patient. I feel so much more confident and protected in my spiritual work now.',
        rating: 5,
      },
      {
        name: 'Kavya Reddy',
        location: 'Hyderabad',
        text: 'I was nervous about developing psychic abilities — worried it might be unsafe. Dr. Bhatt\'s approach is so grounded and scientific in a way. Everything is explained clearly and done safely. I cannot recommend this highly enough.',
        rating: 5,
      },
    ],
    faqs: [
      { q: 'Is it safe to develop psychic abilities?', a: 'Yes, when done correctly. Dr. Bhatt teaches grounding and protection techniques from day one, ensuring the process is completely safe and well-supported.' },
      { q: 'What if I do not feel I have any psychic ability?', a: 'Everyone has intuitive ability — it simply needs to be awakened and trained. Many of Dr. Bhatt\'s most successful students started with zero confidence in their abilities.' },
      { q: 'How much time should I set aside per week?', a: 'Plan for 3–4 hours per week — one live session plus daily practice exercises of 15–20 minutes. Consistency is key for psychic development.' },
      { q: 'Will this course work for absolute beginners?', a: 'Yes. The course starts from the very foundations and builds systematically. No prior experience in spirituality or psychic work is required.' },
    ],
  },

  {
    slug:          'crystal-therapy',
    title:         'Crystal Therapy',
    tagline:       'Harness the healing power of crystals and gemstones',
    seoTitle:      'Crystal Therapy Course | Dr. Usha Bhatt | The Cosmic Connect',
    seoDesc:       'Learn crystal healing, chakra balancing, and crystal grids with Dr. Usha Bhatt. Certified Crystal Therapy course online & in-person. Limited seats.',
    icon:          '💎',
    accentColor:   '#1A5C6B',
    duration:      '4 Weeks',
    totalLessons:  16,
    level:         'Beginner',
    language:      'Hindi & English',
    priceOnline:   '₹6,999',
    priceInPerson: '₹9,999',
    nextBatchDate: 'Contact us for next batch',
    seatsLeft:     12,
    intro:         'Crystals and gemstones carry unique vibrational frequencies that interact with the human energy field to promote healing, balance, and transformation. In this 4-week certified course, Dr. Usha Bhatt will teach you everything you need to know to use crystals confidently and effectively for yourself and others.',
    whatYouLearn: [
      'The science and metaphysics of how crystals work',
      'Properties, uses, and applications of 40+ healing crystals',
      'Chakra system and how crystals interact with each chakra',
      'How to select the right crystal for any situation or person',
      'Crystal cleansing, charging, and programming techniques',
      'Building and activating crystal grids for specific intentions',
      'Crystal layouts for healing sessions on the body',
      'How to use crystals for protection, manifestation, and emotional healing',
    ],
    whoIsItFor: [
      'Beginners curious about crystal healing',
      'Those who own crystals but do not know how to use them properly',
      'Healers and therapists wanting to add crystals to their practice',
      'Anyone wanting to work with crystals professionally',
    ],
    curriculum: [
      {
        title: 'Week 1 — Crystal Fundamentals',
        lessons: [
          'How crystals form and why they work',
          'Crystal structure and vibrational frequency',
          'Overview of the 40+ crystals covered in the course',
          'Cleansing methods — water, moonlight, sound, smoke',
          'Charging and programming your crystals',
          'Choosing crystals intuitively vs intentionally',
        ],
      },
      {
        title: 'Week 2 — Crystals & the Chakra System',
        lessons: [
          'The seven main chakras and their functions',
          'Crystals for each chakra — properties and placement',
          'Identifying blocked or overactive chakras',
          'Full chakra balance crystal layout',
          'Crystals for the aura and energy field',
        ],
      },
      {
        title: 'Week 3 — Crystal Grids & Combinations',
        lessons: [
          'Sacred geometry and crystal grid foundations',
          'Building grids for manifestation, protection, and healing',
          'Activating and maintaining a crystal grid',
          'Crystal combinations — what works together and why',
          'Creating personalised crystal kits',
        ],
      },
      {
        title: 'Week 4 — Applied Crystal Healing',
        lessons: [
          'Full body crystal healing layouts',
          'Distance healing with crystals',
          'Crystals for specific situations — grief, anxiety, relationships',
          'Crystals in the home and workspace',
          'Building a professional crystal healing practice',
          'Certification assessment and graduation',
        ],
      },
    ],
    testimonials: [
      {
        name: 'Divya Menon',
        location: 'Chennai',
        text: 'I had a box of crystals for years and had no idea what I was doing with them. This course completely transformed my relationship with crystals. Dr. Bhatt\'s knowledge is extraordinary and the practical sessions are brilliant.',
        rating: 5,
      },
      {
        name: 'Pooja Sharma',
        location: 'Pune',
        text: 'The chakra and crystal grid modules were absolutely fascinating. I have now set up grids in my home and the energy shift has been remarkable. A truly practical and deeply educational course.',
        rating: 5,
      },
      {
        name: 'Nisha Patel',
        location: 'Ahmedabad',
        text: 'Worth every rupee. Dr. Bhatt covers everything in such detail and with such warmth. I now run small crystal healing sessions for friends and family with complete confidence.',
        rating: 5,
      },
    ],
    faqs: [
      { q: 'Do I need to buy a lot of crystals for this course?', a: 'A basic starter kit of 7–10 crystals is sufficient to begin. Dr. Bhatt will guide you on which ones to start with. The Cosmic Connect shop also offers curated starter kits.' },
      { q: 'Is a certificate included?', a: 'Yes — all students who complete the course receive a Certified Crystal Therapy Practitioner certificate from The Cosmic Connect.' },
      { q: 'Can I use this training professionally?', a: 'Absolutely. Many graduates use this certification to offer crystal healing sessions to clients. Dr. Bhatt also provides guidance on building a professional practice during Week 4.' },
      { q: 'What if I miss a session?', a: 'Recordings are provided for all online sessions. In-person students are asked to notify in advance and can arrange a makeup session.' },
    ],
  },

  {
    slug:          'spiritual-awareness',
    title:         'Spiritual Awareness',
    tagline:       'Deepen your connection to self, soul, and the universe',
    seoTitle:      'Spiritual Awareness Course | Dr. Usha Bhatt | The Cosmic Connect',
    seoDesc:       'Explore meditation, manifestation, karma, and soul purpose with Dr. Usha Bhatt. Transformative Spiritual Awareness course online & in-person. Enroll now.',
    icon:          '🌟',
    accentColor:   '#C9A84C',
    duration:      '5 Weeks',
    totalLessons:  20,
    level:         'All Levels',
    language:      'Hindi & English',
    priceOnline:   '₹7,499',
    priceInPerson: '₹10,999',
    nextBatchDate: 'Contact us for next batch',
    seatsLeft:     15,
    intro:         'Spiritual Awareness is a transformative 5-week journey designed to help you understand the deeper dimensions of your existence — your soul\'s purpose, the laws that govern your life, and how to align yourself with the highest version of who you are. Taught with warmth and clarity by Dr. Usha Bhatt, this course meets you wherever you are on your spiritual path.',
    whatYouLearn: [
      'The foundations of spirituality — what it means and why it matters',
      'Meditation — techniques for stillness, clarity, and inner connection',
      'The Law of Karma and how it shapes your life experiences',
      'The Law of Attraction and conscious manifestation',
      'Understanding your soul\'s purpose and life lessons',
      'Working with the chakra system for everyday balance',
      'Releasing limiting beliefs and negative patterns',
      'Building a consistent, sustainable daily spiritual practice',
    ],
    whoIsItFor: [
      'Those beginning their spiritual journey and seeking guidance',
      'People feeling disconnected from themselves or their purpose',
      'Those wanting to deepen an existing meditation or mindfulness practice',
      'Anyone seeking meaning, clarity, or a sense of inner peace',
    ],
    curriculum: [
      {
        title: 'Week 1 — Foundations of Spiritual Awareness',
        lessons: [
          'What spirituality is — and what it is not',
          'The soul, the mind, and the ego',
          'Your energetic blueprint and soul signature',
          'Introduction to meditation — why and how',
          'Breathing techniques for immediate calm and clarity',
        ],
      },
      {
        title: 'Week 2 — Meditation & Inner Connection',
        lessons: [
          'Types of meditation — guided, silent, moving',
          'Building a daily meditation practice',
          'Meditation for clarity, creativity, and decisions',
          'Connecting with your higher self',
          'Dream work and subconscious messages',
        ],
      },
      {
        title: 'Week 3 — Karma & Soul Purpose',
        lessons: [
          'The Law of Karma — cause, effect, and choice',
          'Identifying your karmic patterns and life lessons',
          'Soul contracts and relationships',
          'Understanding your soul\'s purpose in this lifetime',
          'Releasing karma through conscious action',
        ],
      },
      {
        title: 'Week 4 — Manifestation & Abundance',
        lessons: [
          'The Law of Attraction — science and spirituality',
          'Conscious creation and intentional living',
          'Clearing blocks to abundance — beliefs, energy, patterns',
          'Manifestation practices that actually work',
          'Gratitude as a spiritual and practical tool',
        ],
      },
      {
        title: 'Week 5 — Building Your Spiritual Life',
        lessons: [
          'Integrating spirituality into everyday life',
          'Creating sacred space at home',
          'Spiritual rituals — morning, evening, seasonal',
          'Navigating spiritual challenges and dark nights of the soul',
          'Your personal spiritual practice plan — graduation',
        ],
      },
    ],
    testimonials: [
      {
        name: 'Deepa Krishnan',
        location: 'Bangalore',
        text: 'I came to this course completely lost — no direction, no peace. Dr. Bhatt\'s teaching is so grounded and practical. Five weeks later I have a daily meditation practice, a clear sense of purpose, and genuine inner peace. I cannot put a value on what this course gave me.',
        rating: 5,
      },
      {
        name: 'Ritu Agarwal',
        location: 'Delhi',
        text: 'The karma and soul purpose module completely changed how I see my life and relationships. Dr. Bhatt explains ancient wisdom in a way that is so relatable and modern. Absolutely transformative.',
        rating: 5,
      },
      {
        name: 'Manisha Singh',
        location: 'Lucknow',
        text: 'I\'ve done many spiritual courses but this one stands out for its depth and Dr. Bhatt\'s personal warmth. The manifestation module alone produced results I could not believe. Highly recommend to anyone on a spiritual path.',
        rating: 5,
      },
    ],
    faqs: [
      { q: 'Do I need any prior spiritual experience?', a: 'Not at all. This course is designed for all levels — from complete beginners to those with years of experience who want to go deeper.' },
      { q: 'Is this course religious?', a: 'No. Spiritual Awareness is non-religious and non-denominational. The teachings draw from universal spiritual principles applicable to people of all faiths and backgrounds.' },
      { q: 'How long are the weekly sessions?', a: 'Each live session is approximately 90 minutes, followed by Q&A. Daily practice exercises take 15–30 minutes.' },
      { q: 'What do I need for the course?', a: 'Just an open mind and a quiet space. A journal is recommended for reflection exercises. All materials are provided digitally.' },
    ],
  },
]

export function getCourseBySlug(slug: string): CourseData | undefined {
  return courses.find(c => c.slug === slug)
}

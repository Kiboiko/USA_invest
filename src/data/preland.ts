/**
 * ВЕСЬ текст, изображения и ссылки preland-страницы.
 * Правки контента делаются только здесь — в компонентах текста нет.
 *
 * В paragraph / emphasis / quote допустима разметка:
 *  — **жирный текст**
 *  — [[Finvoryx Capital]] — ссылка на landing
 */
import { landingBrand, prelandBrand } from '@/config/site';

export interface NavItem {
  label: string;
  href: string;
}

export interface ArticleBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'emphasis' | 'list' | 'cta' | 'keyPoints';
  /** для paragraph / heading / quote / emphasis */
  text?: string;
  /** подпись под цитатой */
  attribution?: string;
  /** для list и keyPoints */
  items?: string[];
  /** заголовок блока keyPoints */
  title?: string;
  /** для cta */
  cta?: {
    title: string;
    text: string;
    button: string;
    note?: string;
    features?: string[];
    variant?: 'inline' | 'banner' | 'prominent' | 'final';
  };
}

export interface RelatedArticle {
  category: string;
  title: string;
  meta: string;
  image: string;
  imageAlt: string;
}

export interface Comment {
  author: string;
  initials: string;
  time: string;
  text: string;
  likes: number;
  replies?: number;
}

export const prelandSeo = {
  title: `Warren Buffett reveals new platform set to transform retail trading | ${prelandBrand.name}`,
  description:
    'In an exclusive interview, Warren Buffett announced a new initiative aimed at making financial markets accessible and secure for everyday Americans through Finvoryx Capital.',
  ogImage: '/images/og-preland.svg',
  canonicalPath: '/preland',
};

export const prelandNav: NavItem[] = [
  { label: 'Home', href: '#' },
  { label: 'News', href: '#' },
  { label: 'Sport', href: '#' },
  { label: 'Weather', href: '#' },
  { label: 'iPlayer', href: '#' },
  { label: 'Sounds', href: '#' },
  { label: 'Bitesize', href: '#' },
];

export const prelandSubNav: NavItem[] = [
  { label: 'World', href: '#' },
  { label: 'UK', href: '#' },
  { label: 'Business', href: '#' },
  { label: 'Culture', href: '#' },
  { label: 'Politics', href: '#' },
  { label: 'Health', href: '#' },
  { label: 'Tech', href: '#' },
  { label: 'InDepth', href: '#' },
  { label: 'BBC Verify', href: '#' },
  { label: 'Climate', href: '#' },
];

export const prelandTopBar = {
  /** статичная подпись сверху; дата подставляется автоматически */
  location: 'BBC News Services',
  links: [
    { label: 'On your mobile', href: '#' },
    { label: 'On smart speakers', href: '#' },
    { label: 'Get news alerts', href: '#' },
    { label: 'Contact BBC News', href: '#' },
  ],
  searchLabel: 'Search BBC',
};

export const article = {
  category: 'World',
  subCategory: 'Europe',
  headline:
    'BREAKING NEWS: Legendary Investor Warren Buffett Reveals Revolutionary New Platform Set to Transform Retail Trading',
  standfirst: '',
  author: 'BBC NEWS',
  authorRole: '',
  /** Дата публикации в ISO. Отображается локализованно. */
  publishedAt: '2026-08-04T09:00:00Z',
  readingTime: '',
  heroImage: '/images/BUFFET.jpeg',
  heroImageAlt: 'Warren Buffett portrait',
  heroCaption: '',
  shareLabel: 'Share',
  /** Формат даты как на референсе: TUESDAY, AUGUST 4, 2026 */
  dateFormat: 'uppercase' as const,
};

/**
 * Тело статьи. CTA-блоки (`type: 'cta'`) — это кнопки, ведущие на landing.
 * Порядок блоков = порядок на странице.
 */
export const articleBody: ArticleBlock[] = [
  {
    type: 'paragraph',
    text: "New York, NY -- In an exclusive interview, **Warren Buffett**, the 'Oracle of Omaha' and one of the most successful investors in history, announced a new initiative aimed at making the financial markets accessible and secure for everyday Americans.",
  },
  {
    type: 'paragraph',
    text: `As a representative of [[${landingBrand.name}]], Buffett revealed that his team has developed an innovative platform designed to bridge the gap between professional trading tools and the needs of regular investors.`,
  },
  {
    type: 'emphasis',
    text: `"My name is Warren Buffett, and I represent ${landingBrand.name}. Our goal is to make modern financial technologies accessible to everyone. That's why we created the ${landingBrand.name} platform — it combines real-time automated market data analysis with personal support from experienced specialists."`,
  },
  {
    type: 'paragraph',
    text: `Many people want to participate in the markets but lack the experience or time to manage their investments actively. [[${landingBrand.name}]] positions itself as a straightforward solution — a platform that handles the complex analysis while providing human support when you need it.`,
  },
  {
    type: 'cta',
    cta: {
      variant: 'banner',
      title: 'Modern Financial Technology Made Simple',
      text: 'Access market insights with real-time data analysis, guided support, and a simple setup process.',
      features: [
        'Real-Time Market Data Analysis',
        'Personal Support from Specialists',
        'Simple Setup Process',
        'Secure Platform',
      ],
      button: 'CREATE ACCOUNT',
      note: 'Initial access starts from $250 · Start with just $250 + Stable 2% daily capital growth',
    },
  },
  {
    type: 'cta',
    cta: {
      variant: 'prominent',
      title: '',
      text: '',
      button: 'Click to start now',
    },
  },
  {
    type: 'emphasis',
    text: "You can begin with an initial deposit of just $250. We also provide a stable daily capital growth of 2%. To get started, complete the registration and initial setup. After that, you'll get full access to our platform technology and dedicated support from client managers. Every client receives personalized guidance, making the entire process comfortable and easy to understand.",
  },
  {
    type: 'paragraph',
    text: `[[${landingBrand.name}]] was created under the leadership of **Warren Buffett** with the mission of bringing professional-level tools to regular investors.`,
  },
  {
    type: 'paragraph',
    text: `To learn more about this groundbreaking platform and how it can work for you, click the link in the description and explore [[${landingBrand.name}]] in detail.`,
  },
  {
    type: 'paragraph',
    text: '**BBC — Delivering the latest in business and finance.**',
  },
];

/** Дисклеймер под статьёй */
export const articleDisclaimer = '';

export const mostRead = {
  title: 'Most read',
  items: [
    'Sea drone rescues US army helicopter crew near Strait of Hormuz',
    "Man who grabbed woman's hair and asked for kiss sentenced in legal first",
    "Carer 'who couldn't go on' jailed for killing her mother",
    'Man who murdered partner in front of children given life sentence',
  ],
};

export const sidebarPromo = {
  eyebrow: 'Sponsored',
  title: 'Platform overview',
  text: 'A structured look at account setup, market data access and the support model — presented by the provider.',
  button: 'Read the overview',
  note: 'Commercial content. Capital at risk.',
};

export const topStories = [
  {
    title: "LIVE Belfast attack victim has 'significant' eye injuries and slash wounds to back and face, police say",
    meta: '25k viewing',
  },
  {
    title: "LIVE Israeli air strikes hit Lebanese city of Tyre after Iranian warning to stop attacks",
    meta: '6.5k viewing',
  },
  {
    title: "Football regulator contacts West Ham over 'serious allegations' against Sullivan",
    meta: '32 minutes ago',
  },
];

export const moreToExplore = [
  {
    category: 'Business',
    title: "Business owner losing thousands to copycats",
    image: '/images/related-1.svg',
    imageAlt: 'Business owner profile image',
  },
  {
    category: 'Lifestyle',
    title: "Mystery of village's elusive 'Granny H' knitter solved",
    image: '/images/related-2.svg',
    imageAlt: 'Craft and knitting illustration',
  },
  {
    category: 'Local News',
    title: "Woman rides school railbus again after 60 years",
    image: '/images/related-3.svg',
    imageAlt: 'Heritage railbus photograph',
  },
  {
    category: 'Culture',
    title: "I thought I'd got my dream flat – so did 23 others",
    image: '/images/article-hero.svg',
    imageAlt: 'Lifestyle story illustration',
  },
];

export const newsletterCard = {
  title: 'The Morning Ledger',
  text: 'A short daily briefing on markets, companies and the economy. Free, and you can unsubscribe at any time.',
  placeholder: 'your@email.com',
  button: 'Subscribe',
  note: 'Demo block — the newsletter form is not connected to a backend.',
};

export const relatedArticles: RelatedArticle[] = [
  {
    category: 'Markets',
    title: 'Volatility returns to a market that had grown used to calm',
    meta: '2 days ago',
    image: '/images/related-1.svg',
    imageAlt: 'Abstract line chart illustrating market volatility',
  },
  {
    category: 'Technology',
    title: 'How data infrastructure quietly became a retail feature',
    meta: '4 days ago',
    image: '/images/related-2.svg',
    imageAlt: 'Abstract illustration of connected data nodes',
  },
  {
    category: 'Economy',
    title: 'Household savings patterns shift across major economies',
    meta: '1 week ago',
    image: '/images/related-3.svg',
    imageAlt: 'Abstract bar chart illustrating household savings',
  },
];

export const commentsSection = {
  title: 'Comments',
  notice: '',
  sortLabel: 'Most recent',
  items: [
    {
      author: 'Tohloria Lewis',
      initials: 'TL',
      time: '12 minutes ago',
      text: "I've been trading with Finvoryx for the last few weeks and made a small profit of 2,300 USD. I'm loving it!",
      likes: 13,
      replies: 13,
    },
    {
      author: 'Tanya Porquez',
      initials: 'TP',
      time: '13 minutes ago',
      text: "I saw him on the show and signed up yesterday, I'm up around 25 USD.",
      likes: 6,
      replies: 6,
    },
    {
      author: 'Jennifer Jackson Mercer',
      initials: 'JJ',
      time: '25 minutes ago',
      text: "A friend of mine used it and recommended it, I'll look into it.",
      likes: 19,
      replies: 19,
    },
    {
      author: 'Michael Cash',
      initials: 'MC',
      time: '16 minutes ago',
      text: 'It is giving me a better return on investment than my stock portfolio!',
      likes: 8,
    },
    {
      author: 'David Barrott',
      initials: 'DB',
      time: 'about an hour ago',
      text: 'It is so easy to use, you just deposit money and the robot does all the work for you.',
      likes: 43,
      replies: 43,
    },
    {
      author: 'Amanda Gibson',
      initials: 'AG',
      time: 'about an hour ago',
      text: 'I saw this on the news. Thank you for sharing this.',
      likes: 5,
    },
  ] satisfies Comment[],
};

/** Финальный CTA в конце статьи */
export const prelandFinalCta = {
  eyebrow: '',
  title: '',
  text: '',
  button: 'Click to start now',
  note: '',
  variant: 'prominent' as const,
};

export const prelandFooter = {
  columns: [
    {
      title: 'Sections',
      links: ['Business', 'Markets', 'Technology', 'Economy', 'Opinion'] as string[],
    },
    {
      title: 'About',
      links: ['About us', 'Editorial standards', 'Contact', 'Careers'] as string[],
    },
    {
      title: 'Legal',
      links: ['Terms of use', 'Privacy policy', 'Cookie policy', 'Advertising'] as string[],
    },
  ],
  disclaimer:
    `${prelandBrand.name} is an independent editorial project and is not affiliated with any broadcaster, newspaper or news agency. All content is for general information only and does not constitute financial, investment, legal or tax advice. Pages marked as sponsored contain commercial material provided by third parties.`,
  copyright: `© ${new Date().getFullYear()} ${prelandBrand.name}. All rights reserved.`,
};

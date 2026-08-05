/**
 * ВЕСЬ текст, изображения, лейблы формы и FAQ landing-страницы.
 * Правки контента делаются только здесь.
 *
 * Правила по контенту (важно при замене текстов):
 *  — никаких обещаний доходности («X% в день/месяц»), никаких гарантий;
 *  — отзывы — placeholder до предоставления реальных;
 *  — фото «представителя» — нейтральный placeholder, не реальный человек.
 */
import { landingBrand } from '@/config/site';

export type IconName =
  | 'activity'
  | 'headset'
  | 'settings'
  | 'shield'
  | 'shieldCheck'
  | 'user'
  | 'users'
  | 'trendingUp'
  | 'messageSquare'
  | 'userPlus'
  | 'lock'
  | 'eye';

export const landingSeo = {
  title: `${landingBrand.name} — modern financial technology, made simple`,
  description:
    'Create your account, complete a short guided setup and access market data with support from our specialists.',
  ogImage: '/images/og-landing.svg',
  canonicalPath: '/landing',
};

export const landingNav = {
  /** Якорные ссылки в шапке */
  items: [
    { label: 'About', href: '#about' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Priorities', href: '#priorities' },
    { label: 'FAQ', href: '#faq' },
  ],
  cta: 'Create account',
  secure: {
    title: 'Secure & Encrypted',
    subtitle: 'Your data is protected',
  },
};

export const hero = {
  /** Заголовок разбит на две части: вторая подсвечена зелёным */
  titleLead: 'Modern Financial Technology',
  titleAccent: 'Made Simple',
  subtitle:
    'Access market insights with real-time data analysis, guided support, and a simple setup process.',
  image: '/images/platform-preview.svg',
  imageAlt: 'Illustration of the platform interface on desktop and mobile with a price chart',
  features: [
    { icon: 'activity' as IconName, label: 'Real-Time Market\nData Analysis' },
    { icon: 'headset' as IconName, label: 'Personal Support\nfrom Specialists' },
    { icon: 'settings' as IconName, label: 'Simple Setup\nProcess' },
    { icon: 'shield' as IconName, label: 'Secure\nPlatform' },
  ],
  /**
   * Плашка с суммой входа. Цифры — конфигурируемые, никаких обещаний дохода.
   */
  accessNote: {
    icon: 'trendingUp' as IconName,
    title: 'Initial access starts from $250',
    text: 'Start small and explore market opportunities with guided support from our specialists.',
  },
};

/** Широкая светлая плашка под hero. Только факты об условиях, без доходности. */
export const highlightBand = {
  primary: 'Start with just $250',
  secondary: '+ Guided setup with a dedicated specialist',
  /** Мелкая строка риска под плашкой; можно очистить, но не рекомендуется */
  riskNote: 'Capital at risk. No return, profit or outcome is promised or guaranteed.',
};

export const about = {
  id: 'about',
  title: `About ${landingBrand.name}`,
  image: '/images/about-portrait.svg',
  imageAlt: 'Placeholder portrait illustration of a company representative',
  /** Подпись под фото — обязательно указывать, что это placeholder */
  imageCaption: 'Placeholder image — replace with a real, rights-cleared photo.',
  lead: `We are ${landingBrand.name}, a financial technology company focused on clear access to the markets.`,
  paragraphs: [
    'Our goal is to make modern market tooling understandable: live data, a straightforward setup process, and specialists who explain what you are looking at rather than leaving you with a dashboard and a help article.',
    'We handle the platform, the security and the day-to-day operations so that your attention stays on your own decisions. Every client goes through the same structured onboarding, regardless of the size of the account.',
    'We do not promise returns and we do not manage your decisions for you. What we commit to is transparency about costs, clarity about what the platform does, and support that answers real questions.',
    'If you would like to see how it works, start with the account form — a specialist will walk you through the next steps.',
  ],
};

export const howItWorks = {
  id: 'how-it-works',
  title: 'How It Works',
  steps: [
    {
      icon: 'userPlus' as IconName,
      title: 'Register',
      text: 'Create your free account',
    },
    {
      icon: 'messageSquare' as IconName,
      title: 'Setup',
      text: 'Complete the simple setup process',
    },
    {
      icon: 'trendingUp' as IconName,
      title: 'Grow',
      text: 'Access the platform and guided support',
    },
  ],
};

export const priorities = {
  id: 'priorities',
  title: 'Our Priorities',
  items: [
    {
      icon: 'shieldCheck' as IconName,
      title: 'Security',
      text: 'Advanced encryption and strong protection standards for platform access and user data.',
    },
    {
      icon: 'eye' as IconName,
      title: 'Transparency',
      text: 'Clear communication, simple structure, and an easy-to-understand client experience.',
    },
    {
      icon: 'headset' as IconName,
      title: 'Client Focus',
      text: 'Dedicated support and guidance built around client comfort and a simple onboarding process.',
    },
    {
      icon: 'trendingUp' as IconName,
      title: 'Innovation',
      text: 'Modern tools, live market insights, and a streamlined digital platform experience.',
    },
  ],
};

export const testimonials = {
  title: 'What Our Clients Say',
  /**
   * PLACEHOLDER-контент. Заменить на реальные отзывы с согласия клиентов.
   * Отзывы намеренно не содержат утверждений о заработке.
   */
  placeholderNotice:
    'Placeholder content for layout purposes. Replace with real, verifiable client feedback before launch.',
  items: [
    {
      text: 'Sample feedback text — replace with a real quote. Describes the setup experience and the support received.',
      name: 'Client name',
      location: 'USA',
      countryCode: 'US',
      rating: 5,
    },
    {
      text: 'Sample feedback text — replace with a real quote. Describes how clear the onboarding process was.',
      name: 'Client name',
      location: 'Germany',
      countryCode: 'DE',
      rating: 5,
    },
    {
      text: 'Sample feedback text — replace with a real quote. Describes the market information available in the platform.',
      name: 'Client name',
      location: 'UK',
      countryCode: 'GB',
      rating: 5,
    },
  ],
};

export const faq = {
  id: 'faq',
  title: 'Frequently Asked Questions',
  items: [
    {
      question: 'How much do I need to get started?',
      answer:
        'Initial access starts from $250. The exact amount and any applicable fees are confirmed during the setup process before anything is finalised.',
    },
    {
      question: 'How does registration work?',
      answer:
        'You fill in the form on this page, a specialist contacts you to confirm the details, and you complete a short identity and setup step. No payment is required to submit the form.',
    },
    {
      question: 'Is my personal data protected?',
      answer:
        'Data is transmitted over an encrypted connection and used only to contact you about your account setup and related services. It is not sold to third parties.',
    },
    {
      question: 'Can I contact support anytime?',
      answer:
        'Support is available through the contact channels provided after registration. Your specialist is the first point of contact for any question about the platform.',
    },
    {
      question: 'Do I need prior experience?',
      answer:
        'No. The setup process is the same for everyone, and the form asks about your experience only so that support can be adapted to your level.',
    },
  ],
  sideCard: {
    title: 'Have more questions?',
    text: 'Our support team is ready to help with registration, setup, and platform access.',
    button: 'Contact support',
    /** mailto подставляется из landingBrand.supportEmail */
  },
};

export const finalCta = {
  title: 'Ready to get started?',
  text: 'Create your account and a specialist will guide you through the setup process.',
  button: 'Create your account',
  note: 'Capital at risk. No returns are promised or guaranteed.',
};

export const landingFooter = {
  about: `${landingBrand.name} provides access to a digital financial technology platform. Nothing on this page constitutes investment advice or a recommendation.`,
  columns: [
    {
      title: 'Company',
      links: ['About', 'How it works', 'Priorities', 'FAQ'],
    },
    {
      title: 'Legal',
      links: ['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Risk Disclosure'],
    },
  ],
  disclaimer:
    'Risk warning: trading and investing involve a high level of risk and may not be suitable for all investors. You may lose some or all of your invested capital. Past performance is not a reliable indicator of future results. No profit, income or specific outcome is promised or guaranteed. Please ensure you fully understand the risks involved and seek independent advice if necessary.',
  copyright: `© ${new Date().getFullYear()} ${landingBrand.name}. All rights reserved.`,
};

/** Все подписи формы. Ничего не хардкодится в компоненте. */
export const formContent = {
  title: 'Create Your Account',
  fields: {
    firstName: { label: 'First Name', placeholder: 'First Name' },
    lastName: { label: 'Last Name', placeholder: 'Last Name' },
    email: { label: 'Email Address', placeholder: 'Email Address' },
    country: { label: 'Country', placeholder: 'Select your country' },
    phone: { label: 'Phone Number', placeholder: 'Phone Number' },
    experience: {
      label: 'Do you have investment experience?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
  },
  consent: `By submitting this form, you agree to be contacted by ${landingBrand.name} regarding your account setup, platform access, and related services.`,
  submit: 'Create account',
  submitting: 'Sending…',
  privacyNote: 'We respect your privacy and will never share your information.',
  success: {
    title: 'Thank you — your request has been received.',
    text: 'A specialist will contact you shortly using the details you provided.',
    again: 'Submit another request',
  },
  errors: {
    /** Сообщение о недоступности endpoint */
    network:
      'We could not send your request right now. Please check your connection and try again.',
    generic: 'Something went wrong. Please try again in a moment.',
    firstNameRequired: 'Please enter your first name',
    firstNameShort: 'First name must be at least 2 characters',
    lastNameRequired: 'Please enter your last name',
    lastNameShort: 'Last name must be at least 2 characters',
    emailRequired: 'Please enter your email address',
    emailInvalid: 'Please enter a valid email address',
    countryRequired: 'Please select your country',
    phoneRequired: 'Please enter your phone number',
    phoneInvalid: 'Please enter a valid phone number',
    experienceRequired: 'Please select an option',
  },
};

/**
 * Список стран для селекта в форме.
 * `dial` подставляется в поле телефона при выборе страны.
 * Дополнять/сокращать список можно свободно — форма ничего не хардкодит.
 */
export interface Country {
  code: string;
  name: string;
  dial: string;
}

export const countries: Country[] = [
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'CA', name: 'Canada', dial: '+1' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
  { code: 'IE', name: 'Ireland', dial: '+353' },
  { code: 'DE', name: 'Germany', dial: '+49' },
  { code: 'AT', name: 'Austria', dial: '+43' },
  { code: 'CH', name: 'Switzerland', dial: '+41' },
  { code: 'FR', name: 'France', dial: '+33' },
  { code: 'ES', name: 'Spain', dial: '+34' },
  { code: 'PT', name: 'Portugal', dial: '+351' },
  { code: 'IT', name: 'Italy', dial: '+39' },
  { code: 'NL', name: 'Netherlands', dial: '+31' },
  { code: 'BE', name: 'Belgium', dial: '+32' },
  { code: 'LU', name: 'Luxembourg', dial: '+352' },
  { code: 'DK', name: 'Denmark', dial: '+45' },
  { code: 'SE', name: 'Sweden', dial: '+46' },
  { code: 'NO', name: 'Norway', dial: '+47' },
  { code: 'FI', name: 'Finland', dial: '+358' },
  { code: 'PL', name: 'Poland', dial: '+48' },
  { code: 'CZ', name: 'Czechia', dial: '+420' },
  { code: 'SK', name: 'Slovakia', dial: '+421' },
  { code: 'HU', name: 'Hungary', dial: '+36' },
  { code: 'RO', name: 'Romania', dial: '+40' },
  { code: 'BG', name: 'Bulgaria', dial: '+359' },
  { code: 'GR', name: 'Greece', dial: '+30' },
  { code: 'HR', name: 'Croatia', dial: '+385' },
  { code: 'SI', name: 'Slovenia', dial: '+386' },
  { code: 'EE', name: 'Estonia', dial: '+372' },
  { code: 'LV', name: 'Latvia', dial: '+371' },
  { code: 'LT', name: 'Lithuania', dial: '+370' },
  { code: 'AU', name: 'Australia', dial: '+61' },
  { code: 'NZ', name: 'New Zealand', dial: '+64' },
  { code: 'JP', name: 'Japan', dial: '+81' },
  { code: 'SG', name: 'Singapore', dial: '+65' },
  { code: 'HK', name: 'Hong Kong SAR', dial: '+852' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966' },
  { code: 'ZA', name: 'South Africa', dial: '+27' },
  { code: 'BR', name: 'Brazil', dial: '+55' },
  { code: 'MX', name: 'Mexico', dial: '+52' },
  { code: 'AR', name: 'Argentina', dial: '+54' },
  { code: 'CL', name: 'Chile', dial: '+56' },
  { code: 'IN', name: 'India', dial: '+91' },
  { code: 'MY', name: 'Malaysia', dial: '+60' },
  { code: 'TH', name: 'Thailand', dial: '+66' },
  { code: 'PH', name: 'Philippines', dial: '+63' },
  { code: 'TR', name: 'Türkiye', dial: '+90' },
  { code: 'IL', name: 'Israel', dial: '+972' },
  { code: 'KR', name: 'South Korea', dial: '+82' },
  { code: 'OTHER', name: 'Other country', dial: '+' },
];

export const defaultCountryCode = 'US';

export function findCountry(code: string): Country | undefined {
  return countries.find((country) => country.code === code);
}

import { formContent } from '@/data/landing';

export interface LeadFormValues {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  experience: string;
}

export type LeadFormErrors = Partial<Record<keyof LeadFormValues, string>>;

/** Намеренно мягкая проверка email: формат, а не существование адреса. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/**
 * Телефон проверяется только по длине цифр (7–15) — как в E.164.
 * Жёсткая проверка формата по странам не делается сознательно.
 */
function countDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

export function validateLeadForm(values: LeadFormValues): LeadFormErrors {
  const e = formContent.errors;
  const errors: LeadFormErrors = {};

  const firstName = values.firstName.trim();
  if (!firstName) errors.firstName = e.firstNameRequired;
  else if (firstName.length < 2) errors.firstName = e.firstNameShort;

  const lastName = values.lastName.trim();
  if (!lastName) errors.lastName = e.lastNameRequired;
  else if (lastName.length < 2) errors.lastName = e.lastNameShort;

  const email = values.email.trim();
  if (!email) errors.email = e.emailRequired;
  else if (!EMAIL_RE.test(email)) errors.email = e.emailInvalid;

  if (!values.country) errors.country = e.countryRequired;

  const phone = values.phone.trim();
  const digits = countDigits(phone);
  if (!phone || digits === 0) errors.phone = e.phoneRequired;
  else if (digits < 7 || digits > 15) errors.phone = e.phoneInvalid;

  if (!values.experience) errors.experience = e.experienceRequired;

  return errors;
}

export function hasErrors(errors: LeadFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

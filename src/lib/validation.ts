import { formContent } from '@/data/landing';

export interface LeadFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
}

export type LeadFormErrors = Partial<Record<keyof LeadFormValues, string>>;

/** Намеренно мягкая проверка email: формат, а не существование адреса. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.startsWith('1') ? digits.slice(1) : digits;
}

function isValidUsPhone(value: string): boolean {
  const digits = normalizePhone(value);
  return digits.length === 10;
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

  const phone = values.phone.trim();
  if (!phone) errors.phone = e.phoneRequired;
  else if (!isValidUsPhone(phone)) errors.phone = e.phoneInvalid;

  if (!values.experience) errors.experience = e.experienceRequired;

  return errors;
}

export function hasErrors(errors: LeadFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

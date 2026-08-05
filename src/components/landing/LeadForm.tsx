import { useId, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { CheckCircle2, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { countries, findCountry } from '@/data/countries';
import { formContent } from '@/data/landing';
import { useUtm } from '@/hooks/useUtm';
import { buildPayload, submitLead } from '@/lib/submitLead';
import { hasErrors, validateLeadForm, type LeadFormErrors, type LeadFormValues } from '@/lib/validation';
import { trackEvent } from '@/components/common/Analytics';
import { cn } from '@/lib/cn';

const emptyValues: LeadFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  phone: '',
  experience: '',
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputBase =
  'w-full rounded-lg border bg-ink-600/60 py-3.5 pr-4 text-[15px] text-white placeholder:text-fg-muted/70 transition outline-none focus:border-accent-500';

export function LeadForm() {
  const uid = useId();
  const utm = useUtm();
  const [values, setValues] = useState<LeadFormValues>(emptyValues);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');

  const dial = useMemo(() => findCountry(values.country)?.dial ?? '', [values.country]);

  const field = (name: keyof LeadFormValues) => ({
    value: values[name],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const next = event.target.value;
      setValues((prev) => ({ ...prev, [name]: next }));
      // Ошибку убираем сразу, как только пользователь начал править поле
      setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    },
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined,
  });

  const borderFor = (name: keyof LeadFormValues) =>
    errors[name] ? 'border-red-400/70' : 'border-ink-500';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // страница не перезагружается
    if (status === 'submitting') return; // защита от повторной отправки

    const nextErrors = validateLeadForm(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const firstKey = Object.keys(nextErrors)[0];
      document.getElementById(`${uid}-${firstKey}`)?.focus();
      return;
    }

    setStatus('submitting');
    setServerError('');
    trackEvent('lead_form_submit');

    const result = await submitLead(buildPayload(values, utm));

    if (result.ok) {
      setStatus('success');
      trackEvent('lead_form_success', { mode: result.mode });
      return;
    }

    setStatus('error');
    setServerError(
      result.reason === 'network' ? formContent.errors.network : formContent.errors.generic,
    );
    trackEvent('lead_form_error', { reason: result.reason });
  }

  if (status === 'success') {
    return (
      <div
        className="rounded-2xl border border-accent-500/40 bg-ink-700/90 p-7 text-center shadow-2xl backdrop-blur sm:p-9"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="mx-auto h-14 w-14 text-accent-500" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-bold text-white sm:text-2xl">
          {formContent.success.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{formContent.success.text}</p>
        <button
          type="button"
          onClick={() => {
            setValues(emptyValues);
            setErrors({});
            setStatus('idle');
          }}
          className="mt-6 rounded-lg border border-ink-500 px-5 py-2.5 text-sm font-semibold text-fg-muted transition hover:border-accent-500 hover:text-white"
        >
          {formContent.success.again}
        </button>
      </div>
    );
  }

  return (
    <form
      id="lead-form"
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-ink-500 bg-ink-700/90 p-5 shadow-2xl backdrop-blur sm:p-7"
      aria-labelledby={`${uid}-title`}
    >
      <h2 id={`${uid}-title`} className="text-xl font-bold text-white sm:text-2xl">
        {formContent.title}
      </h2>

      <div className="mt-5 space-y-3.5">
        {/* First name */}
        <div>
          <label htmlFor={`${uid}-firstName`} className="sr-only">
            {formContent.fields.firstName.label}
          </label>
          <div className="relative">
            <User
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-fg-muted"
              aria-hidden="true"
            />
            <input
              id={`${uid}-firstName`}
              type="text"
              autoComplete="given-name"
              placeholder={formContent.fields.firstName.placeholder}
              className={cn(inputBase, 'pl-10', borderFor('firstName'))}
              {...field('firstName')}
            />
          </div>
          <FieldError id={`${uid}-firstName-error`} message={errors.firstName} />
        </div>

        {/* Last name */}
        <div>
          <label htmlFor={`${uid}-lastName`} className="sr-only">
            {formContent.fields.lastName.label}
          </label>
          <div className="relative">
            <User
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-fg-muted"
              aria-hidden="true"
            />
            <input
              id={`${uid}-lastName`}
              type="text"
              autoComplete="family-name"
              placeholder={formContent.fields.lastName.placeholder}
              className={cn(inputBase, 'pl-10', borderFor('lastName'))}
              {...field('lastName')}
            />
          </div>
          <FieldError id={`${uid}-lastName-error`} message={errors.lastName} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor={`${uid}-email`} className="sr-only">
            {formContent.fields.email.label}
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-fg-muted"
              aria-hidden="true"
            />
            <input
              id={`${uid}-email`}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder={formContent.fields.email.placeholder}
              className={cn(inputBase, 'pl-10', borderFor('email'))}
              {...field('email')}
            />
          </div>
          <FieldError id={`${uid}-email-error`} message={errors.email} />
        </div>

        {/* Country */}
        <div>
          <label htmlFor={`${uid}-country`} className="sr-only">
            {formContent.fields.country.label}
          </label>
          <select
            id={`${uid}-country`}
            autoComplete="country"
            className={cn(
              inputBase,
              'appearance-none px-4',
              borderFor('country'),
              values.country ? 'text-white' : 'text-fg-muted/70',
            )}
            {...field('country')}
          >
            <option value="">{formContent.fields.country.placeholder}</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code} className="bg-ink-700 text-white">
                {country.name}
              </option>
            ))}
          </select>
          <FieldError id={`${uid}-country-error`} message={errors.country} />
        </div>

        {/* Phone: код страны подставляется из выбранной страны */}
        <div>
          <label htmlFor={`${uid}-phone`} className="sr-only">
            {formContent.fields.phone.label}
          </label>
          <div className="flex gap-2">
            <span
              className="grid min-w-[74px] shrink-0 place-items-center rounded-lg border border-ink-500 bg-ink-600/60 px-3 text-[15px] font-semibold text-fg-muted"
              aria-hidden="true"
            >
              {dial || '+'}
            </span>
            <div className="relative min-w-0 flex-1">
              <Phone
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-fg-muted"
                aria-hidden="true"
              />
              <input
                id={`${uid}-phone`}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder={formContent.fields.phone.placeholder}
                className={cn(inputBase, 'pl-10', borderFor('phone'))}
                {...field('phone')}
              />
            </div>
          </div>
          <FieldError id={`${uid}-phone-error`} message={errors.phone} />
        </div>

        {/* Investment experience */}
        <fieldset className="border-0 p-0">
          <legend className="mb-2 text-sm text-fg-muted">
            {formContent.fields.experience.label}
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {formContent.fields.experience.options.map((option, optionIndex) => {
              const checked = values.experience === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    'cursor-pointer rounded-lg border px-4 py-3 text-center text-[15px] font-semibold transition',
                    checked
                      ? 'border-accent-500 bg-accent-500/15 text-white'
                      : 'border-ink-500 bg-ink-600/60 text-fg-muted hover:border-fg-muted/50',
                    errors.experience && !checked && 'border-red-400/50',
                  )}
                >
                  <input
                    type="radio"
                    /* id только у первой кнопки — на неё ставится фокус при ошибке */
                    id={optionIndex === 0 ? `${uid}-experience` : undefined}
                    name={`${uid}-experience`}
                    value={option.value}
                    checked={checked}
                    onChange={() => {
                      setValues((prev) => ({ ...prev, experience: option.value }));
                      setErrors((prev) => ({ ...prev, experience: undefined }));
                    }}
                    className="sr-only"
                    aria-describedby={
                      errors.experience ? `${uid}-experience-error` : undefined
                    }
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
          <FieldError id={`${uid}-experience-error`} message={errors.experience} />
        </fieldset>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-fg-muted/85">{formContent.consent}</p>

      {status === 'error' && serverError && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={cn(
          'mt-4 w-full rounded-lg px-6 py-4 text-base font-extrabold tracking-wide uppercase transition',
          'bg-linear-to-r from-accent-500 to-accent-600 text-ink-900 shadow-lg shadow-accent-700/20',
          'hover:from-accent-400 hover:to-accent-500',
          'disabled:cursor-not-allowed disabled:opacity-60',
        )}
      >
        {status === 'submitting' ? formContent.submitting : formContent.submit}
      </button>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-fg-muted">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {formContent.privacyNote}
      </p>

      <p className="mt-2 flex items-center gap-2 text-xs text-fg-muted/70">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
        Encrypted connection
      </p>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-red-300">
      {message}
    </p>
  );
}

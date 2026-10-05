'use client';

import { useActionState, useEffect, useRef } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

import { sendContactMessage, type ContactState } from '@/app/(site)/contact/actions';

const TOPICS = [
  'General question',
  'Joining the chapter',
  'Events',
  'Volunteering',
  'Sponsorship',
  'Donations',
  'Other',
];

type ContactFormProps = {
  // "sponsor" adds an organization field and locks the topic to Sponsorship.
  variant?: 'general' | 'sponsor';
  defaultTopic?: string;
  title?: string;
  description?: string;
};

const initialState: ContactState = { status: 'idle', message: '' };

const fieldClass =
  'mt-1.5 block w-full rounded-lg border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-200';

function borderFor(error?: string) {
  return error ? 'border-red-400 focus:border-red-500' : 'border-brand-100 hover:border-brand-300 focus:border-brand-500';
}

export default function ContactForm({
  variant = 'general',
  defaultTopic,
  title = 'Send us a message',
  description = 'Fill this out and an officer will reply to your email.',
}: ContactFormProps) {
  const isSponsor = variant === 'sponsor';
  const startTopic = defaultTopic && TOPICS.includes(defaultTopic) ? defaultTopic : TOPICS[0];
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset();
  }, [state]);

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <div className="rounded-xl border border-brand-100 bg-white p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>

      {state.status === 'success' ? (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-lg border border-accent-300 bg-accent-50 p-4 text-sm text-accent-900"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" />
          <p>{state.message}</p>
        </div>
      ) : null}

      <form ref={formRef} action={formAction} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="text-sm font-medium text-ink">
            Name
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            defaultValue={values.name}
            key={`name-${values.name ?? ''}`}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'cf-name-error' : undefined}
            className={`${fieldClass} ${borderFor(errors.name)}`}
          />
          {errors.name ? (
            <p id="cf-name-error" className="mt-1.5 text-xs text-red-600">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cf-email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={values.email}
            key={`email-${values.email ?? ''}`}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'cf-email-error' : undefined}
            className={`${fieldClass} ${borderFor(errors.email)}`}
          />
          {errors.email ? (
            <p id="cf-email-error" className="mt-1.5 text-xs text-red-600">{errors.email}</p>
          ) : null}
        </div>

        {isSponsor ? (
          <div className="sm:col-span-2">
            <label htmlFor="cf-organization" className="text-sm font-medium text-ink">
              Company or organization
            </label>
            <input
              id="cf-organization"
              name="organization"
              type="text"
              autoComplete="organization"
              maxLength={150}
              defaultValue={values.organization}
              key={`organization-${values.organization ?? ''}`}
              aria-invalid={Boolean(errors.organization)}
              className={`${fieldClass} ${borderFor(errors.organization)}`}
            />
            {errors.organization ? (
              <p className="mt-1.5 text-xs text-red-600">{errors.organization}</p>
            ) : null}
          </div>
        ) : null}

        {isSponsor ? (
          <input type="hidden" name="topic" value="Sponsorship" />
        ) : (
        <div className="sm:col-span-2">
          <label htmlFor="cf-topic" className="text-sm font-medium text-ink">
            Topic
          </label>
          <select
            id="cf-topic"
            name="topic"
            required
            defaultValue={values.topic ?? startTopic}
            key={`topic-${values.topic ?? ''}`}
            aria-invalid={Boolean(errors.topic)}
            className={`${fieldClass} ${borderFor(errors.topic)}`}
          >
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          {errors.topic ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.topic}</p>
          ) : null}
        </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className="text-sm font-medium text-ink">
            Message
          </label>
          <textarea
            id="cf-message"
            name="message"
            rows={6}
            required
            maxLength={5000}
            defaultValue={values.message}
            key={`message-${values.message ?? ''}`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'cf-message-error' : undefined}
            className={`${fieldClass} ${borderFor(errors.message)} resize-y`}
          />
          {errors.message ? (
            <p id="cf-message-error" className="mt-1.5 text-xs text-red-600">{errors.message}</p>
          ) : null}
        </div>

        {/* Honeypot for bots, hidden from people and screen readers. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="cf-nickname">Nickname</label>
          <input id="cf-nickname" name="nickname" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-red-600">
            {state.status === 'error' ? state.message : null}
          </p>
          <button type="submit" disabled={pending} className="btn-green px-6 py-3 sm:shrink-0">
            {pending ? 'Sending...' : 'Send message'}
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

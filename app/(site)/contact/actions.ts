'use server';

import { getSiteSettings } from '@/lib/content';

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  errors?: Partial<Record<Field, string>>;
  values?: Partial<Record<Field, string>>;
};

type Field = 'name' | 'email' | 'organization' | 'topic' | 'message';

const TOPICS = [
  'General question',
  'Joining the chapter',
  'Events',
  'Volunteering',
  'Sponsorship',
  'Donations',
  'Other',
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get('nickname') ?? '').trim()) {
    return { status: 'success', message: 'Thanks! Your message is on its way.' };
  }

  const values = {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    organization: String(formData.get('organization') ?? '').trim(),
    topic: String(formData.get('topic') ?? '').trim(),
    message: String(formData.get('message') ?? '').trim(),
  };

  const errors: ContactState['errors'] = {};
  if (!values.name) errors.name = 'Please enter your name.';
  else if (values.name.length > 100) errors.name = 'Name is too long.';
  if (!EMAIL_RE.test(values.email)) errors.email = 'Please enter a valid email.';
  if (values.organization.length > 150) errors.organization = 'Organization name is too long.';
  if (!TOPICS.includes(values.topic)) errors.topic = 'Please pick a topic.';
  if (values.message.length < 10) errors.message = 'Please write at least a sentence or two.';
  else if (values.message.length > 5000) errors.message = 'Message is too long (5000 characters max).';

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Please fix the highlighted fields.', errors, values };
  }

  const settings = await getSiteSettings();
  const to = process.env.CONTACT_TO_EMAIL || settings?.chapterEmail;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || 'WiCyS Kean Website <onboarding@resend.dev>';

  if (!apiKey || !to) {
    console.error('Contact form: RESEND_API_KEY or recipient email is not configured.');
    return {
      status: 'error',
      message: to
        ? `The form is not set up yet. Please email us directly at ${to}.`
        : 'The form is not set up yet. Please reach out on Discord or Instagram.',
      values,
    };
  }

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
    ${values.organization ? `<p><strong>Organization:</strong> ${escapeHtml(values.organization)}</p>` : ''}
    <p><strong>Topic:</strong> ${escapeHtml(values.topic)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(values.message)}</p>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject: `[Website] ${values.topic} from ${values.name}${values.organization ? ` (${values.organization})` : ''}`,
        html,
        text: `Name: ${values.name}\nEmail: ${values.email}\n${values.organization ? `Organization: ${values.organization}\n` : ''}Topic: ${values.topic}\n\n${values.message}`,
      }),
    });

    if (!res.ok) {
      console.error('Contact form: Resend responded', res.status, await res.text());
      throw new Error('Send failed');
    }
  } catch {
    return {
      status: 'error',
      message: `Something went wrong sending your message. Please try again or email us at ${to}.`,
      values,
    };
  }

  return {
    status: 'success',
    message: "Thanks for reaching out! We'll get back to you soon.",
  };
}

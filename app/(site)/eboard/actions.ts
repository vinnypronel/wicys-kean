'use server';

import path from 'path';
import { getSiteSettings } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import { saveEboardSubmission } from '@/lib/submissions';

export type EboardInterestState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  errors?: Partial<Record<string, string>>;
  values?: {
    name?: string;
    email?: string;
    major?: string;
    gradYear?: string;
    roles?: string[];
    statement?: string;
    experience?: string;
  };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// The first bytes of each allowed file type, so a file that is only renamed
// to .pdf is turned away. A .docx is a zip file; an old .doc is an OLE file.
const SIGNATURES: Record<string, number[]> = {
  '.pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
  '.docx': [0x50, 0x4b, 0x03, 0x04], // PK..
  '.doc': [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
};

function matchesFileType(ext: string, head: Uint8Array) {
  const signature = SIGNATURES[ext];
  return Boolean(signature) && signature.every((byte, index) => head[index] === byte);
}

export async function submitEboardInterest(
  _prev: EboardInterestState,
  formData: FormData
): Promise<EboardInterestState> {
  // Honeypot check
  if (String(formData.get('nickname') ?? '').trim()) {
    return {
      status: 'success',
      message: 'Thank you for your interest! Your application has been received.',
    };
  }

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const major = String(formData.get('major') ?? '').trim();
  const gradYear = String(formData.get('gradYear') ?? '').trim();
  const roles = formData.getAll('roles').map((r) => String(r).trim()).filter(Boolean);
  const statement = String(formData.get('statement') ?? '').trim();
  const experience = String(formData.get('experience') ?? '').trim();

  // Resume upload handling
  const resumeFile = formData.get('resume') as File | null;

  const values = {
    name,
    email,
    major,
    gradYear,
    roles,
    statement,
    experience,
  };

  const errors: Record<string, string> = {};

  if (!name) {
    errors.name = 'Please enter your full name.';
  } else if (name.length > 100) {
    errors.name = 'Name must be under 100 characters.';
  }

  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!major) {
    errors.major = 'Please enter your major / program of study.';
  }

  if (!gradYear) {
    errors.gradYear = 'Please select or enter your expected graduation semester/year.';
  }

  if (roles.length === 0) {
    errors.roles = 'Please select at least one role of interest.';
  }

  if (!resumeFile || typeof resumeFile === 'string' || resumeFile.size === 0) {
    errors.resume = 'Please upload your resume (PDF or Word document).';
  } else if (resumeFile.size > 4 * 1024 * 1024) {
    errors.resume = 'Resume file size must be under 4MB.';
  } else {
    const ext = path.extname(resumeFile.name).toLowerCase();
    const allowedExts = ['.pdf', '.doc', '.docx'];
    if (!allowedExts.includes(ext)) {
      errors.resume = 'Invalid file type. Please upload a PDF or Word document (.pdf, .doc, .docx).';
    } else if (!matchesFileType(ext, new Uint8Array(await resumeFile.slice(0, 8).arrayBuffer()))) {
      errors.resume = 'That file does not look like a real PDF or Word document. Please upload it again.';
    }
  }

  if (!statement) {
    errors.statement = 'Please tell us why you are interested in joining the 2027–2028 E-Board.';
  } else if (statement.length < 15) {
    errors.statement = 'Please write at least a sentence or two (min 15 characters).';
  } else if (statement.length > 4000) {
    errors.statement = 'Statement must be under 4,000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Please complete all required fields.',
      errors,
      values,
    };
  }

  // Save the submission and resume (to the database on the live site).
  const resumeFileName = resumeFile && resumeFile.size > 0 ? resumeFile.name : '';
  let resumeUrl = '';
  try {
    resumeUrl = await saveEboardSubmission(
      values,
      resumeFile && resumeFile.size > 0
        ? {
            originalName: resumeFile.name,
            contentType: resumeFile.type || 'application/octet-stream',
            data: Buffer.from(await resumeFile.arrayBuffer()),
          }
        : null
    );
  } catch (err) {
    console.error('Failed to save e-board interest submission:', err);
    return {
      status: 'error',
      message: 'Something went wrong saving your submission. Please try again, or email the chapter.',
      values,
    };
  }

  // Send email if configured
  const settings = await getSiteSettings();
  const to = process.env.CONTACT_TO_EMAIL || settings?.chapterEmail;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || 'WiCyS Kean Website <onboarding@resend.dev>';

  if (apiKey && to) {
    const html = `
      <h2>2027–2028 WiCyS Kean E-Board Interest Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
      <p><strong>Major:</strong> ${escapeHtml(values.major)}</p>
      <p><strong>Expected Graduation:</strong> ${escapeHtml(values.gradYear)}</p>
      <p><strong>Positions of Interest:</strong> ${escapeHtml(values.roles.join(', '))}</p>
      <p><strong>Resume:</strong> ${escapeHtml(resumeFileName)} ${resumeUrl ? `(<a href="${SITE_URL}${resumeUrl}">View / Download</a>, admin sign-in required)` : ''}</p>
      <p><strong>Statement of Interest:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(values.statement)}</p>
      ${
        values.experience
          ? `<p><strong>Relevant Experience / Ideas:</strong></p><p style="white-space:pre-wrap">${escapeHtml(values.experience)}</p>`
          : ''
      }
    `;

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: values.email,
          subject: `[WiCyS Kean] 2027–2028 E-Board Interest: ${values.name}`,
          html,
          text: `2027-2028 E-Board Interest Submission\n\nName: ${values.name}\nEmail: ${values.email}\nMajor: ${values.major}\nExpected Graduation: ${values.gradYear}\nPositions: ${values.roles.join(', ')}\nResume: ${resumeFileName} (${resumeUrl ? SITE_URL + resumeUrl : 'not saved'})\n\nStatement:\n${values.statement}\n\nExperience/Ideas:\n${values.experience || 'None provided'}`,
        }),
      });
    } catch (err) {
      console.error('Failed to send eboard interest notification email:', err);
    }
  }

  return {
    status: 'success',
    message: "Thank you for your interest! Your 2027–2028 E-Board interest form and resume have been received. We'll be in touch with next steps and election details.",
  };
}

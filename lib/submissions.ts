import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

import { neon } from '@neondatabase/serverless';

// Where form submissions and resumes are kept.
//
// With DATABASE_URL set (the live site on Vercel), everything goes to the
// Neon database, so nothing is lost between requests. Without it (local
// editing), it falls back to JSON files in content/submissions, which are
// left out of git.

export type EboardSubmission = {
  id: string;
  submittedAt: string;
  name: string;
  email: string;
  major: string;
  gradYear: string;
  roles: string[];
  statement: string;
  experience?: string;
  resumeUrl?: string;
  resumeFileName?: string;
};

export type ContactSubmission = {
  id: string;
  submittedAt: string;
  name: string;
  email: string;
  organization?: string;
  topic: string;
  message: string;
};

type EboardValues = Omit<EboardSubmission, 'id' | 'submittedAt' | 'resumeUrl' | 'resumeFileName'>;
type ContactValues = Omit<ContactSubmission, 'id' | 'submittedAt'>;
export type ResumeUpload = { originalName: string; contentType: string; data: Buffer };

const LOCAL_DIR = path.join(process.cwd(), 'content', 'submissions');
const LOCAL_EBOARD = path.join(LOCAL_DIR, 'eboard-interest-27-28.json');
const LOCAL_CONTACT = path.join(LOCAL_DIR, 'contact-messages.json');
const LOCAL_RESUMES = path.join(LOCAL_DIR, 'resumes');

function db() {
  const url = process.env.DATABASE_URL?.trim();
  return url ? neon(url) : null;
}

export function resumeLink(file: string): string {
  return `/admin/resumes/${file}`;
}

function resumeFileName(applicant: string, originalName: string): string {
  const base = (applicant || 'applicant').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
  const ext = path.extname(originalName).toLowerCase();
  return `2027-2028-${base}-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
}

async function readLocal<T>(file: string): Promise<T[]> {
  try {
    return JSON.parse(await fs.readFile(file, 'utf-8')) as T[];
  } catch {
    return [];
  }
}

async function writeLocal<T>(file: string, list: T[]): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8');
}

// Saves an interest form submission and its resume. Returns the resume's
// admin link, or an empty string when no resume was saved.
export async function saveEboardSubmission(
  values: EboardValues,
  resume: ResumeUpload | null
): Promise<string> {
  const id = randomUUID();
  const file = resume ? resumeFileName(values.name, resume.originalName) : null;
  const sql = db();

  if (sql) {
    if (resume && file) {
      await sql`INSERT INTO resumes (file, content_type, data)
        VALUES (${file}, ${resume.contentType}, ${resume.data.toString('base64')})`;
    }
    await sql`INSERT INTO eboard_submissions
      (id, name, email, major, grad_year, roles, statement, experience, resume_file, resume_name)
      VALUES (${id}, ${values.name}, ${values.email}, ${values.major}, ${values.gradYear},
        ${values.roles}, ${values.statement}, ${values.experience ?? ''}, ${file}, ${resume?.originalName ?? null})`;
  } else {
    if (resume && file) {
      await fs.mkdir(LOCAL_RESUMES, { recursive: true });
      await fs.writeFile(path.join(LOCAL_RESUMES, file), resume.data);
    }
    const list = await readLocal<EboardSubmission>(LOCAL_EBOARD);
    list.push({
      id,
      submittedAt: new Date().toISOString(),
      ...values,
      resumeUrl: file ? resumeLink(file) : '',
      resumeFileName: resume?.originalName ?? '',
    });
    await writeLocal(LOCAL_EBOARD, list);
  }
  return file ? resumeLink(file) : '';
}

export async function saveContactMessage(values: ContactValues): Promise<void> {
  const id = randomUUID();
  const sql = db();
  if (sql) {
    await sql`INSERT INTO contact_messages (id, name, email, organization, topic, message)
      VALUES (${id}, ${values.name}, ${values.email}, ${values.organization ?? ''}, ${values.topic}, ${values.message})`;
    return;
  }
  const list = await readLocal<ContactSubmission>(LOCAL_CONTACT);
  list.push({ id, submittedAt: new Date().toISOString(), ...values });
  await writeLocal(LOCAL_CONTACT, list);
}

const newestFirst = <T extends { submittedAt: string }>(list: T[]) =>
  list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

export async function listEboardSubmissions(): Promise<EboardSubmission[]> {
  const sql = db();
  if (!sql) return newestFirst(await readLocal<EboardSubmission>(LOCAL_EBOARD));
  const rows = await sql`SELECT id, submitted_at, name, email, major, grad_year, roles,
      statement, experience, resume_file, resume_name
    FROM eboard_submissions ORDER BY submitted_at DESC`;
  return rows.map((row) => ({
    id: String(row.id),
    submittedAt: new Date(row.submitted_at as string).toISOString(),
    name: row.name as string,
    email: row.email as string,
    major: row.major as string,
    gradYear: row.grad_year as string,
    roles: (row.roles as string[]) ?? [],
    statement: row.statement as string,
    experience: row.experience as string,
    resumeUrl: row.resume_file ? resumeLink(row.resume_file as string) : '',
    resumeFileName: (row.resume_name as string) ?? '',
  }));
}

export async function listContactMessages(): Promise<ContactSubmission[]> {
  const sql = db();
  if (!sql) return newestFirst(await readLocal<ContactSubmission>(LOCAL_CONTACT));
  const rows = await sql`SELECT id, submitted_at, name, email, organization, topic, message
    FROM contact_messages ORDER BY submitted_at DESC`;
  return rows.map((row) => ({
    id: String(row.id),
    submittedAt: new Date(row.submitted_at as string).toISOString(),
    name: row.name as string,
    email: row.email as string,
    organization: row.organization as string,
    topic: row.topic as string,
    message: row.message as string,
  }));
}

// Deleting an application also deletes its resume.
export async function deleteEboardSubmission(id: string): Promise<void> {
  const sql = db();
  if (sql) {
    const rows = await sql`DELETE FROM eboard_submissions WHERE id::text = ${id} RETURNING resume_file`;
    const file = rows[0]?.resume_file as string | null | undefined;
    if (file) await sql`DELETE FROM resumes WHERE file = ${file}`;
    return;
  }
  const list = await readLocal<EboardSubmission>(LOCAL_EBOARD);
  const gone = list.find((item) => item.id === id);
  await writeLocal(LOCAL_EBOARD, list.filter((item) => item.id !== id));
  const file = gone?.resumeUrl?.split('/').pop();
  if (file) await fs.rm(path.join(LOCAL_RESUMES, file), { force: true });
}

export async function deleteContactMessage(id: string): Promise<void> {
  const sql = db();
  if (sql) {
    await sql`DELETE FROM contact_messages WHERE id::text = ${id}`;
    return;
  }
  const list = await readLocal<ContactSubmission>(LOCAL_CONTACT);
  await writeLocal(LOCAL_CONTACT, list.filter((item) => item.id !== id));
}

export async function readResume(file: string): Promise<Buffer | null> {
  const sql = db();
  if (sql) {
    const rows = await sql`SELECT data FROM resumes WHERE file = ${file}`;
    return rows[0] ? Buffer.from(rows[0].data as string, 'base64') : null;
  }
  try {
    return await fs.readFile(path.join(LOCAL_RESUMES, file));
  } catch {
    return null;
  }
}

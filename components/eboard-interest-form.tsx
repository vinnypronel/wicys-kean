'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileText, Loader2, UploadCloud } from 'lucide-react';

import {
  submitEboardInterest,
  type EboardInterestState,
} from '@/app/(site)/eboard/actions';

export const AVAILABLE_ROLES = [
  'President',
  'Vice President',
  'Treasurer',
  'Secretary',
  'Event Coordinator',
  'Web Developer / Tech Lead',
  'Public Relations / Social Media',
  'Open to Any Position',
] as const;

const initialState: EboardInterestState = {
  status: 'idle',
  message: '',
};

const GRADUATION_OPTIONS = [
  'Spring 2028',
  'Fall 2028',
  'Spring 2029',
  'Fall 2029',
  'Spring 2030',
  'Fall 2030 or later',
  'Graduate Student',
];

const inputClass =
  'mt-1.5 block w-full rounded-lg border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-200';

function borderFor(error?: string) {
  return error
    ? 'border-red-400 focus:border-red-500'
    : 'border-brand-100 hover:border-brand-300 focus:border-brand-500';
}

export default function EboardInterestForm() {
  const [state, formAction, pending] = useActionState(submitEboardInterest, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  // After a successful send, clear the chosen roles and file. Done while
  // rendering when the result changes, rather than in an effect.
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (state.status === 'success') {
      setSelectedRoles([]);
      setSelectedFileName('');
    }
  }

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset();
  }, [state]);

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName('');
    }
  };

  if (state.status === 'success') {
    return (
      <div className="rounded-2xl border border-accent-300 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-100 text-accent-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent-700 font-semibold">
              Interest Form Submitted
            </span>
            <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
              Thank you for applying!
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {state.message}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Elections and interview details for the 2027–2028 academic year will be announced to all applicants via email. In the meantime, join our general meetings and Discord to stay connected!
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-outline mt-6 text-sm"
            >
              Submit another response
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
      {state.status === 'error' && state.message ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {state.message}
        </div>
      ) : null}

      <form
        ref={formRef}
        action={formAction}
        encType="multipart/form-data"
        className="space-y-6"
      >
        {/* Honeypot field */}
        <input
          type="text"
          name="nickname"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label htmlFor="eboard-name" className="block text-sm font-semibold text-ink">
              Full name <span className="text-plum">*</span>
            </label>
            <input
              id="eboard-name"
              name="name"
              type="text"
              required
              defaultValue={values.name ?? ''}
              placeholder="e.g. Maya Lin"
              className={`${inputClass} ${borderFor(errors.name)}`}
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            ) : null}
          </div>

          {/* Kean Email */}
          <div>
            <label htmlFor="eboard-email" className="block text-sm font-semibold text-ink">
              Kean email address <span className="text-plum">*</span>
            </label>
            <input
              id="eboard-email"
              name="email"
              type="email"
              required
              defaultValue={values.email ?? ''}
              placeholder="yourname@kean.edu"
              className={`${inputClass} ${borderFor(errors.email)}`}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Major */}
          <div>
            <label htmlFor="eboard-major" className="block text-sm font-semibold text-ink">
              Major / Program <span className="text-plum">*</span>
            </label>
            <input
              id="eboard-major"
              name="major"
              type="text"
              required
              defaultValue={values.major ?? ''}
              placeholder="e.g. Cybersecurity, Computer Science, IT"
              className={`${inputClass} ${borderFor(errors.major)}`}
            />
            {errors.major ? (
              <p className="mt-1 text-xs text-red-600">{errors.major}</p>
            ) : null}
          </div>

          {/* Expected Graduation */}
          <div>
            <label htmlFor="eboard-grad" className="block text-sm font-semibold text-ink">
              Expected graduation <span className="text-plum">*</span>
            </label>
            <select
              id="eboard-grad"
              name="gradYear"
              required
              defaultValue={values.gradYear ?? ''}
              className={`${inputClass} ${borderFor(errors.gradYear)}`}
            >
              <option value="" disabled>
                Select your expected graduation
              </option>
              {GRADUATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.gradYear ? (
              <p className="mt-1 text-xs text-red-600">{errors.gradYear}</p>
            ) : null}
          </div>
        </div>

        {/* Roles of Interest */}
        <div>
          <label className="block text-sm font-semibold text-ink">
            Position(s) of interest for 2027–2028 <span className="text-plum">*</span>
          </label>
          <p className="mt-1 text-xs text-ink-soft">
            Select all roles you would be excited to take on:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {AVAILABLE_ROLES.map((role) => {
              const checked = selectedRoles.includes(role);
              return (
                <label
                  key={role}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all ${
                    checked
                      ? 'border-plum bg-plum text-white shadow-sm'
                      : 'border-brand-200 bg-white text-ink-soft hover:border-brand-400 hover:text-ink'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="roles"
                    value={role}
                    checked={checked}
                    onChange={() => toggleRole(role)}
                    className="sr-only"
                  />
                  <span>{role}</span>
                </label>
              );
            })}
          </div>
          {errors.roles ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.roles}</p>
          ) : null}
        </div>

        {/* Resume Upload (Required) */}
        <div>
          <label htmlFor="eboard-resume" className="block text-sm font-semibold text-ink">
            Resume (PDF or Word document) <span className="text-plum">*</span>
          </label>
          <div className="mt-1.5">
            <label
              htmlFor="eboard-resume"
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
                errors.resume
                  ? 'border-red-400 bg-red-50/30'
                  : selectedFileName
                  ? 'border-brand-500 bg-brand-50/30'
                  : 'border-brand-200 bg-surface hover:border-brand-400 hover:bg-brand-50/20'
              }`}
            >
              {selectedFileName ? (
                <div className="flex items-center gap-3 text-brand-800">
                  <FileText className="h-7 w-7 text-brand-600" />
                  <div>
                    <p className="text-sm font-semibold">{selectedFileName}</p>
                    <p className="text-xs text-ink-soft">Click to change file</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <UploadCloud className="h-8 w-8 text-brand-500" />
                  <p className="mt-2 text-sm font-semibold text-ink">
                    Click to select and upload your resume
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    PDF, DOC, or DOCX (max 4MB) • Required
                  </p>
                </div>
              )}
              <input
                id="eboard-resume"
                name="resume"
                type="file"
                required
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>
          {errors.resume ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.resume}</p>
          ) : null}
        </div>

        {/* Statement of Interest */}
        <div>
          <label htmlFor="eboard-statement" className="block text-sm font-semibold text-ink">
            Why are you interested in joining the 2027–2028 E-Board? <span className="text-plum">*</span>
          </label>
          <textarea
            id="eboard-statement"
            name="statement"
            required
            rows={4}
            defaultValue={values.statement ?? ''}
            placeholder="Tell us what excites you about WiCyS, what you hope to learn, and how you want to contribute to the chapter..."
            className={`${inputClass} ${borderFor(errors.statement)}`}
          />
          {errors.statement ? (
            <p className="mt-1 text-xs text-red-600">{errors.statement}</p>
          ) : null}
        </div>

        {/* Experience / Ideas (Optional) */}
        <div>
          <label htmlFor="eboard-experience" className="block text-sm font-semibold text-ink">
            Relevant experience, skills, or ideas for the chapter{' '}
            <span className="text-xs font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            id="eboard-experience"
            name="experience"
            rows={3}
            defaultValue={values.experience ?? ''}
            placeholder="Any prior club involvement, technical projects, event ideas, or other thoughts you'd like to share..."
            className={`${inputClass} ${borderFor(errors.experience)}`}
          />
        </div>

        <p className="text-xs text-ink-soft">
          Only chapter admins can see your answers and resume. See our{' '}
          <Link href="/privacy" className="font-semibold text-brand-700 underline underline-offset-2">
            Privacy page
          </Link>
          .
        </p>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={pending}
            className="btn-green w-full sm:w-auto"
          >
            {pending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting application...
              </span>
            ) : (
              <>
                Submit 2027–2028 interest form
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

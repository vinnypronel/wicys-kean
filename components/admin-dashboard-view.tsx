'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Inbox,
  LogOut,
  Mail,
  Search,
  Trash2,
  Users,
} from 'lucide-react';

import { deleteContactSubmission, deleteEboardSubmission, logoutAdminAction } from '@/app/admin/actions';

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

type Props = {
  eboardApplications: EboardSubmission[];
  contactMessages: ContactSubmission[];
};

export default function AdminDashboardView({
  eboardApplications: initialEboard,
  contactMessages: initialContacts,
}: Props) {
  const [activeTab, setActiveTab] = useState<'eboard' | 'contact' | 'cms'>('eboard');
  const [eboardList, setEboardList] = useState<EboardSubmission[]>(initialEboard);
  const [contactList, setContactList] = useState<ContactSubmission[]>(initialContacts);

  // Search & Filters
  const [eboardSearch, setEboardSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedEboard, setSelectedEboard] = useState<EboardSubmission | null>(null);

  const [contactSearch, setContactSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('ALL');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const handleDeleteEboard = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the application from ${name}?`)) return;
    setDeletingId(id);
    try {
      const res = await deleteEboardSubmission(id);
      if (res.success) {
        setEboardList((prev) => prev.filter((item) => item.id !== id));
        if (selectedEboard?.id === id) setSelectedEboard(null);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteContact = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete this message from ${name}?`)) return;
    setDeletingId(id);
    try {
      const res = await deleteContactSubmission(id);
      if (res.success) {
        setContactList((prev) => prev.filter((item) => item.id !== id));
        if (selectedContact?.id === id) setSelectedContact(null);
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Filter Eboard
  const filteredEboard = eboardList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(eboardSearch.toLowerCase()) ||
      item.email.toLowerCase().includes(eboardSearch.toLowerCase()) ||
      item.major.toLowerCase().includes(eboardSearch.toLowerCase()) ||
      item.statement.toLowerCase().includes(eboardSearch.toLowerCase());
    const matchesRole =
      roleFilter === 'ALL' || item.roles.some((r) => r.toLowerCase().includes(roleFilter.toLowerCase()));
    return matchesSearch && matchesRole;
  });

  // Filter Contacts
  const filteredContacts = contactList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      item.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
      item.message.toLowerCase().includes(contactSearch.toLowerCase()) ||
      (item.organization && item.organization.toLowerCase().includes(contactSearch.toLowerCase()));
    const matchesTopic = topicFilter === 'ALL' || item.topic === topicFilter;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/wicys-logo.png"
                alt="WiCyS Kean Logo"
                width={140}
                height={35}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <span className="hidden h-5 w-px bg-brand-200 sm:inline-block" />
            <span className="rounded-md bg-plum/10 px-2.5 py-1 text-xs font-bold text-plum uppercase tracking-wider">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-800 transition-colors hover:bg-brand-50 sm:inline-flex"
            >
              <span>View Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/keystatic"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-plum/30 bg-plum/5 px-3 py-1.5 text-xs font-semibold text-plum transition-colors hover:bg-plum/10"
            >
              <span>Keystatic CMS</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Metric Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            onClick={() => setActiveTab('eboard')}
            className={`cursor-pointer rounded-2xl border p-6 transition-all ${
              activeTab === 'eboard'
                ? 'border-plum bg-white shadow-md ring-2 ring-plum/20'
                : 'border-brand-100 bg-white hover:border-brand-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-plum font-semibold">
                2027–2028 Applications
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-plum/10 text-plum">
                <Users className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold tracking-tight text-ink">
              {eboardList.length}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {eboardList.length === 1 ? 'Applicant submitted' : 'Total applicants submitted'}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('contact')}
            className={`cursor-pointer rounded-2xl border p-6 transition-all ${
              activeTab === 'contact'
                ? 'border-accent-600 bg-white shadow-md ring-2 ring-accent-400/30'
                : 'border-brand-100 bg-white hover:border-brand-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent-700 font-semibold">
                Contact Form Messages
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-100 text-accent-700">
                <Mail className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold tracking-tight text-ink">
              {contactList.length}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {contactList.length === 1 ? 'Inquiry received' : 'Inquiries received'}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('cms')}
            className={`cursor-pointer rounded-2xl border p-6 transition-all sm:col-span-2 lg:col-span-1 ${
              activeTab === 'cms'
                ? 'border-brand-600 bg-white shadow-md ring-2 ring-brand-300'
                : 'border-brand-100 bg-white hover:border-brand-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-brand-700 font-semibold">
                Content Management
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <FileSpreadsheet className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
              Keystatic CMS
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              Manage e-board members, events, scholars, and sponsors
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex border-b border-brand-200">
          <button
            onClick={() => setActiveTab('eboard')}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'eboard'
                ? 'border-plum text-plum'
                : 'border-transparent text-ink-soft hover:border-brand-300 hover:text-ink'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>2027–2028 E-Board Applications</span>
            <span className="rounded-full bg-plum/10 px-2 py-0.5 text-xs text-plum font-bold">
              {eboardList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'contact'
                ? 'border-plum text-plum'
                : 'border-transparent text-ink-soft hover:border-brand-300 hover:text-ink'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>Contact Messages</span>
            <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs text-accent-800 font-bold">
              {contactList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'cms'
                ? 'border-plum text-plum'
                : 'border-transparent text-ink-soft hover:border-brand-300 hover:text-ink'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>CMS Quick Links</span>
          </button>
        </div>

        {/* TAB 1: E-Board Applications */}
        {activeTab === 'eboard' && (
          <div className="mt-6">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-soft" />
                <input
                  type="text"
                  placeholder="Search by name, email, major..."
                  value={eboardSearch}
                  onChange={(e) => setEboardSearch(e.target.value)}
                  className="w-full rounded-xl border border-brand-200 bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink-soft/60 focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-ink-soft" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-sm text-ink focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/20"
                >
                  <option value="ALL">All Roles</option>
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Event Coordinator">Event Coordinator</option>
                  <option value="Web Developer">Web Developer / Tech</option>
                  <option value="Public Relations">Public Relations</option>
                </select>
              </div>
            </div>

            {/* Applications List */}
            {filteredEboard.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-brand-200 bg-white p-12 text-center">
                <Users className="mx-auto h-10 w-10 text-brand-300" />
                <h3 className="mt-3 font-display text-lg font-bold text-ink">
                  No applications found
                </h3>
                <p className="mt-1 text-sm text-ink-soft">
                  {eboardList.length === 0
                    ? 'No students have submitted the 2027–2028 interest form yet.'
                    : 'No applications match your current search and filter criteria.'}
                </p>
              </div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-brand-100 bg-surface text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      <tr>
                        <th className="px-6 py-4">Applicant</th>
                        <th className="px-6 py-4">Major & Graduation</th>
                        <th className="px-6 py-4">Positions of Interest</th>
                        <th className="px-6 py-4">Resume</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-100">
                      {filteredEboard.map((item) => (
                        <tr
                          key={item.id}
                          className="transition-colors hover:bg-brand-50/30"
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-ink">{item.name}</p>
                            <a
                              href={`mailto:${item.email}?subject=WiCyS Kean 2027-2028 E-Board Application`}
                              className="text-xs text-brand-700 hover:underline"
                            >
                              {item.email}
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-ink">{item.major}</p>
                            <span className="inline-block mt-0.5 rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-800">
                              {item.gradYear}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {item.roles.map((r) => (
                                <span
                                  key={r}
                                  className="rounded bg-plum/10 px-2 py-0.5 text-xs font-medium text-plum"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {item.resumeUrl ? (
                              <a
                                href={item.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-surface px-3 py-1.5 text-xs font-semibold text-brand-800 transition-colors hover:bg-brand-100"
                              >
                                <FileText className="h-3.5 w-3.5 text-brand-600" />
                                <span>View Resume</span>
                              </a>
                            ) : (
                              <span className="text-xs text-ink-soft">No file</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs text-ink-soft">
                            {formatDate(item.submittedAt)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedEboard(item)}
                                className="inline-flex items-center gap-1 rounded-lg border border-brand-200 px-2.5 py-1.5 text-xs font-semibold text-brand-800 hover:bg-brand-50"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Details
                              </button>
                              <button
                                type="button"
                                disabled={deletingId === item.id}
                                onClick={() => handleDeleteEboard(item.id, item.name)}
                                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:text-red-800"
                                title="Delete application"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Contact Form Messages */}
        {activeTab === 'contact' && (
          <div className="mt-6">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-soft" />
                <input
                  type="text"
                  placeholder="Search messages by name, email, text..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="w-full rounded-xl border border-brand-200 bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink-soft/60 focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-ink-soft" />
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-sm text-ink focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/20"
                >
                  <option value="ALL">All Topics</option>
                  <option value="General question">General question</option>
                  <option value="Joining the chapter">Joining the chapter</option>
                  <option value="Events">Events</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Sponsorship">Sponsorship</option>
                  <option value="Donations">Donations</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Messages List */}
            {filteredContacts.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-brand-200 bg-white p-12 text-center">
                <Inbox className="mx-auto h-10 w-10 text-brand-300" />
                <h3 className="mt-3 font-display text-lg font-bold text-ink">
                  No contact messages found
                </h3>
                <p className="mt-1 text-sm text-ink-soft">
                  {contactList.length === 0
                    ? 'No messages have been submitted through the contact form yet.'
                    : 'No messages match your current search and filter criteria.'}
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredContacts.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm transition-colors hover:border-brand-300"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-display text-base font-bold text-ink">
                            {item.name}
                          </h4>
                          {item.organization ? (
                            <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800">
                              {item.organization}
                            </span>
                          ) : null}
                          <span className="rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-800">
                            {item.topic}
                          </span>
                        </div>
                        <a
                          href={`mailto:${item.email}?subject=Re: WiCyS Kean Inquiry - ${item.topic}`}
                          className="mt-1 inline-block text-xs text-brand-700 hover:underline"
                        >
                          {item.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-ink-soft">
                          {formatDate(item.submittedAt)}
                        </span>
                        <a
                          href={`mailto:${item.email}?subject=Re: WiCyS Kean Inquiry - ${item.topic}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-brand-200 px-2.5 py-1 text-xs font-semibold text-brand-800 hover:bg-brand-50"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Reply
                        </a>
                        <button
                          type="button"
                          disabled={deletingId === item.id}
                          onClick={() => handleDeleteContact(item.id, item.name)}
                          className="rounded-lg p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                          title="Delete message"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-brand-100 bg-surface p-4">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CMS Quick Links */}
        {activeTab === 'cms' && (
          <div className="mt-6">
            <div className="rounded-2xl border border-brand-100 bg-white p-8">
              <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                Keystatic Content Manager
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                Edit website collections, pages, and chapter announcements using the Keystatic Admin UI.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/keystatic/collection/eboardMembers"
                  target="_blank"
                  className="flex items-center justify-between rounded-xl border border-brand-200 p-5 transition-colors hover:border-plum hover:bg-plum/5"
                >
                  <div>
                    <h4 className="font-bold text-ink">E-Board Members</h4>
                    <p className="mt-1 text-xs text-ink-soft">Manage current roster and photos</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-brand-400" />
                </Link>

                <Link
                  href="/keystatic/collection/events"
                  target="_blank"
                  className="flex items-center justify-between rounded-xl border border-brand-200 p-5 transition-colors hover:border-plum hover:bg-plum/5"
                >
                  <div>
                    <h4 className="font-bold text-ink">Events</h4>
                    <p className="mt-1 text-xs text-ink-soft">Add or edit upcoming & past events</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-brand-400" />
                </Link>

                <Link
                  href="/keystatic/collection/scholars"
                  target="_blank"
                  className="flex items-center justify-between rounded-xl border border-brand-200 p-5 transition-colors hover:border-plum hover:bg-plum/5"
                >
                  <div>
                    <h4 className="font-bold text-ink">Scholars</h4>
                    <p className="mt-1 text-xs text-ink-soft">Recognize scholarship recipients</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-brand-400" />
                </Link>

                <Link
                  href="/keystatic/collection/alumni"
                  target="_blank"
                  className="flex items-center justify-between rounded-xl border border-brand-200 p-5 transition-colors hover:border-plum hover:bg-plum/5"
                >
                  <div>
                    <h4 className="font-bold text-ink">Alumni</h4>
                    <p className="mt-1 text-xs text-ink-soft">Alumni profiles and company roles</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-brand-400" />
                </Link>

                <Link
                  href="/keystatic/singleton/siteSettings"
                  target="_blank"
                  className="flex items-center justify-between rounded-xl border border-brand-200 p-5 transition-colors hover:border-plum hover:bg-plum/5"
                >
                  <div>
                    <h4 className="font-bold text-ink">Site Settings</h4>
                    <p className="mt-1 text-xs text-ink-soft">Emails, meeting time/location, social links</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-brand-400" />
                </Link>

                <Link
                  href="/keystatic/singleton/homeAnnouncements"
                  target="_blank"
                  className="flex items-center justify-between rounded-xl border border-brand-200 p-5 transition-colors hover:border-plum hover:bg-plum/5"
                >
                  <div>
                    <h4 className="font-bold text-ink">Home Announcements</h4>
                    <p className="mt-1 text-xs text-ink-soft">Current initiatives and sponsorship blurb</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-brand-400" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Detail Modal for E-Board Application */}
      {selectedEboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-brand-100 bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-start justify-between border-b border-brand-100 pb-5">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-plum font-semibold">
                  2027–2028 E-Board Application
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold text-ink">
                  {selectedEboard.name}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">
                  <a
                    href={`mailto:${selectedEboard.email}`}
                    className="text-brand-700 hover:underline"
                  >
                    {selectedEboard.email}
                  </a>{' '}
                  • {selectedEboard.major} • {selectedEboard.gradYear}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEboard(null)}
                className="rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Positions */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Positions of Interest
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedEboard.roles.map((r) => (
                    <span
                      key={r}
                      className="rounded-lg bg-plum/10 px-3 py-1 text-xs font-bold text-plum"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Resume
                </h4>
                <div className="mt-2">
                  {selectedEboard.resumeUrl ? (
                    <a
                      href={selectedEboard.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-plum bg-plum/5 px-4 py-2.5 text-sm font-semibold text-plum transition-colors hover:bg-plum hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Resume ({selectedEboard.resumeFileName || 'PDF'})</span>
                    </a>
                  ) : (
                    <p className="text-sm text-ink-soft">No resume uploaded.</p>
                  )}
                </div>
              </div>

              {/* Statement */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Why are you interested in joining the 2027–2028 E-Board?
                </h4>
                <div className="mt-2 rounded-xl border border-brand-100 bg-surface p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                    {selectedEboard.statement}
                  </p>
                </div>
              </div>

              {/* Experience */}
              {selectedEboard.experience ? (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Relevant Experience & Ideas
                  </h4>
                  <div className="mt-2 rounded-xl border border-brand-100 bg-surface p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                      {selectedEboard.experience}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Submission Date */}
              <div className="text-xs text-ink-soft border-t border-brand-100 pt-4">
                Submitted on {formatDate(selectedEboard.submittedAt)}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-brand-100 pt-5">
              <a
                href={`mailto:${selectedEboard.email}?subject=WiCyS Kean 2027-2028 E-Board Application`}
                className="btn-green text-sm"
              >
                <Mail className="h-4 w-4" />
                Email Candidate
              </a>

              <button
                type="button"
                onClick={() => setSelectedEboard(null)}
                className="btn-outline text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

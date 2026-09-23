import { collection, config, fields, singleton } from '@keystatic/core';

const githubRepoEnv = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO ?? '';
const [githubOwner, githubName] = githubRepoEnv.split('/');

export const uploadDirectory = 'public/images/uploads';
export const uploadPublicPath = '/images/uploads/';
export const fileDirectory = 'public/files';
export const filePublicPath = '/files/';

const photoHint =
  'JPG or PNG. Large phone photos are fine, they are resized automatically.';

export default config({
  storage:
    githubOwner && githubName
      ? { kind: 'github', repo: { owner: githubOwner, name: githubName } }
      : { kind: 'local' },
  ui: {
    brand: { name: 'WiCyS Kean' },
    navigation: {
      People: ['eboardMembers'],
      Activities: ['events', 'galleryAlbums', 'resourceLinks'],
      Sponsors: ['sponsors', 'sponsorPage'],
      Content: ['homeAnnouncements', 'ctfPage', 'siteSettings'],
    },
  },
  collections: {
    eboardMembers: collection({
      label: 'E-board members',
      slugField: 'name',
      path: 'content/eboard-members/*',
      schema: {
        name: fields.slug({
          name: { label: 'Full name', validation: { isRequired: true } },
          slug: { label: 'URL slug' },
        }),
        role: fields.text({
          label: 'Role',
          validation: { isRequired: true },
        }),
        photo: fields.image({
          label: 'Photo',
          description: 'A square headshot works best. ' + photoHint,
          directory: uploadDirectory,
          publicPath: uploadPublicPath,
          validation: { isRequired: false },
        }),
        bio: fields.text({
          label: 'Short bio',
          multiline: true,
        }),
        linkedinUrl: fields.url({
          label: 'LinkedIn URL',
        }),
        order: fields.integer({
          label: 'Display order',
          defaultValue: 99,
        }),
      },
    }),
    events: collection({
      label: 'Events',
      slugField: 'title',
      path: 'content/events/*',
      schema: {
        title: fields.slug({
          name: { label: 'Event title', validation: { isRequired: true } },
          slug: { label: 'URL slug' },
        }),
        type: fields.select({
          label: 'Event type',
          options: [
            { label: 'General body meeting', value: 'meeting' },
            { label: 'Workshop', value: 'workshop' },
            { label: 'Guest speaker', value: 'speaker' },
            { label: 'Conference', value: 'conference' },
            { label: 'Networking', value: 'networking' },
            { label: 'CTF competition', value: 'ctf' },
            { label: 'Social', value: 'social' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'meeting',
        }),
        startDate: fields.datetime({
          label: 'Start date and time (Eastern)',
          description:
            'The event moves to Past events on its own once it ends.',
          validation: { isRequired: true },
        }),
        endDate: fields.datetime({
          label: 'End date and time (Eastern, optional)',
          description: 'Leave blank for a standard 2 hour event.',
        }),
        location: fields.text({
          label: 'Location',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { isRequired: true },
        }),
        registrationUrl: fields.url({
          label: 'Registration link (CougarLink, Google Form, etc.)',
        }),
        flyer: fields.image({
          label: 'Flyer or poster',
          description: 'Optional. Shown on the event page. ' + photoHint,
          directory: uploadDirectory,
          publicPath: uploadPublicPath,
        }),
        recap: fields.text({
          label: 'Recap summary (after the event)',
          multiline: true,
        }),
        highlights: fields.array(fields.text({ label: 'Highlight' }), {
          label: 'Highlights and achievements',
          itemLabel(props) {
            return props.value ?? 'Highlight';
          },
        }),
        photos: fields.array(
          fields.image({
            label: 'Photo',
            directory: uploadDirectory,
            publicPath: uploadPublicPath,
          }),
          {
            label: 'Photos',
            description: 'Event photos for the recap. ' + photoHint,
          }
        ),
      },
    }),
    galleryAlbums: collection({
      label: 'Gallery albums',
      slugField: 'title',
      path: 'content/gallery-albums/*',
      schema: {
        title: fields.slug({
          name: { label: 'Album title', validation: { isRequired: true } },
          slug: { label: 'URL slug' },
        }),
        period: fields.text({
          label: 'Semester',
          description: 'For example: Fall 2026',
          validation: { isRequired: true },
        }),
        academicYear: fields.text({
          label: 'Academic year',
          description: 'For example: 2026-2027',
          validation: {
            isRequired: true,
            pattern: {
              regex: /^\d{4}-\d{4}$/,
              message: 'Use the format 2026-2027',
            },
          },
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'General body meetings', value: 'meetings' },
            { label: 'Workshops', value: 'workshops' },
            { label: 'Capture the Flag', value: 'ctf' },
            { label: 'Conferences', value: 'conferences' },
            { label: 'Speakers and networking', value: 'networking' },
            { label: 'Socials', value: 'socials' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'meetings',
        }),
        event: fields.relationship({
          label: 'Linked event (optional)',
          description:
            'Pick the event these photos are from. The album also shows on that event page.',
          collection: 'events',
        }),
        photos: fields.array(
          fields.image({
            label: 'Photo',
            directory: uploadDirectory,
            publicPath: uploadPublicPath,
          }),
          {
            label: 'Photos',
            description: photoHint,
          }
        ),
      },
    }),
    resourceLinks: collection({
      label: 'Resource links',
      slugField: 'title',
      path: 'content/resource-links/*',
      schema: {
        title: fields.slug({
          name: { label: 'Resource title', validation: { isRequired: true } },
          slug: { label: 'URL slug' },
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Learning platforms', value: 'learning' },
            { label: 'Internships and careers', value: 'careers' },
            { label: 'Scholarships and fellowships', value: 'scholarships' },
            { label: 'Certifications', value: 'certifications' },
            { label: 'Conferences', value: 'conferences' },
            { label: 'Professional development', value: 'development' },
          ],
          defaultValue: 'learning',
        }),
        url: fields.url({
          label: 'URL',
          validation: { isRequired: true },
        }),
        blurb: fields.text({
          label: 'Short description',
          multiline: true,
        }),
      },
    }),
    sponsors: collection({
      label: 'Sponsors and partners',
      slugField: 'name',
      path: 'content/sponsors/*',
      schema: {
        name: fields.slug({
          name: {
            label: 'Organization name',
            validation: { isRequired: true },
          },
          slug: { label: 'URL slug' },
        }),
        logo: fields.image({
          label: 'Logo',
          description: 'PNG with a transparent background works best.',
          directory: uploadDirectory,
          publicPath: uploadPublicPath,
        }),
        websiteUrl: fields.url({ label: 'Website' }),
        level: fields.text({
          label: 'Sponsorship level (optional)',
          description: 'For example: CTF prize sponsor',
        }),
        order: fields.integer({ label: 'Display order', defaultValue: 99 }),
      },
    }),
  },
  singletons: {
    siteSettings: singleton({
      label: 'Site settings',
      path: 'content/site-settings',
      schema: {
        chapterEmail: fields.text({ label: 'Chapter email' }),
        meetingDay: fields.text({
          label: 'Meeting day',
          description: 'For example: Tuesdays',
        }),
        meetingTime: fields.text({
          label: 'Meeting time',
          description: 'For example: 5:00 PM. Leave blank to hide.',
        }),
        meetingLocation: fields.text({
          label: 'Meeting room',
          description: 'For example: GLAB 101. Leave blank to hide.',
        }),
        meetingNote: fields.text({
          label: 'Extra meeting note (optional)',
          multiline: true,
        }),
        discordUrl: fields.url({ label: 'Discord invite URL' }),
        instagramUrl: fields.url({ label: 'Instagram URL' }),
        instagramHandle: fields.text({
          label: 'Instagram handle',
          description: 'For example: @wicys.kean',
        }),
        linkedinUrl: fields.url({ label: 'LinkedIn URL' }),
        cougarlinkUrl: fields.url({ label: 'Kean CougarLink URL' }),
        nationalUrl: fields.url({ label: 'National WiCyS URL' }),
      },
    }),
    sponsorPage: singleton({
      label: 'Sponsorship page',
      path: 'content/sponsor-page',
      schema: {
        intro: fields.text({ label: 'Intro text', multiline: true }),
        benefits: fields.array(
          fields.object({
            title: fields.text({ label: 'Benefit' }),
            blurb: fields.text({ label: 'Description', multiline: true }),
          }),
          {
            label: 'Benefits of sponsoring',
            itemLabel(props) {
              return props.fields.title.value || 'Benefit';
            },
          }
        ),
        packet: fields.file({
          label: 'Sponsorship packet (PDF)',
          description: 'Optional. Adds a download button to the page.',
          directory: fileDirectory,
          publicPath: filePublicPath,
        }),
      },
    }),
    homeAnnouncements: singleton({
      label: 'Home announcements',
      path: 'content/home-announcements',
      schema: {
        initiativeTitle: fields.text({ label: 'Current initiative title' }),
        initiativeBody: fields.text({
          label: 'Initiative description',
          multiline: true,
        }),
        initiativePoints: fields.array(fields.text({ label: 'Point' }), {
          label: 'Initiative bullet points',
          itemLabel(props) {
            return props.value ?? 'Point';
          },
        }),
        sponsorshipBlurb: fields.text({
          label: 'Sponsorship callout text',
          multiline: true,
        }),
      },
    }),
    ctfPage: singleton({
      label: 'CTF page content',
      path: 'content/ctf-page',
      schema: {
        previousTitle: fields.text({ label: 'Previous CTF event title' }),
        overview: fields.text({
          label: 'Previous CTF overview',
          multiline: true,
        }),
        participantsNote: fields.text({
          label: 'Participants count or note',
        }),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Challenge topics covered',
          itemLabel(props) {
            return props.value ?? 'Topic';
          },
        }),
        highlights: fields.array(fields.text({ label: 'Highlight' }), {
          label: 'Previous CTF highlights',
          itemLabel(props) {
            return props.value ?? 'Highlight';
          },
        }),
        plannedBlurb: fields.text({
          label: 'Upcoming CTF announcement text',
          multiline: true,
        }),
        goals: fields.array(fields.text({ label: 'Goal' }), {
          label: 'Goals for the next CTF',
          itemLabel(props) {
            return props.value ?? 'Goal';
          },
        }),
        timeline: fields.array(fields.text({ label: 'Timeline item' }), {
          label: 'Tentative timeline items',
          itemLabel(props) {
            return props.value ?? 'Item';
          },
        }),
        participateSteps: fields.array(fields.text({ label: 'Step' }), {
          label: 'How students can participate',
          itemLabel(props) {
            return props.value ?? 'Step';
          },
        }),
        photos: fields.array(
          fields.image({
            label: 'Photo',
            directory: uploadDirectory,
            publicPath: uploadPublicPath,
          }),
          {
            label: 'Previous CTF photos',
          }
        ),
      },
    }),
  },
});

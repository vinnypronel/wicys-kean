# WiCyS Kean University Student Chapter website

Next.js site with a built-in editor (Keystatic) so e-board members can post
events, photos, officers, and sponsors without touching code.

- Site: pages live in `app/(site)/`
- Content: YAML files in `content/`, uploaded images in `public/images/uploads/`
- Editor: `/keystatic` (or `/admin`, which redirects there)

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000. The editor at http://localhost:3000/keystatic
saves straight to the files on your machine when
`NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` is blank.

## Going live (one-time setup)

1. Push this repo to GitHub (`vinnypronel/wicys-kean`).
2. Import the repo in Vercel and deploy.
3. Create `.env.local` with `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=vinnypronel/wicys-kean`,
   run `npm run dev`, open `/keystatic`, and follow the "Create GitHub App"
   prompt. Keystatic writes the remaining `KEYSTATIC_*` values into your env
   file. Install the new GitHub App on the `wicys-kean` repo when GitHub asks.
4. In the GitHub App settings, add the production callback URL:
   `https://YOUR-DOMAIN/api/keystatic/github/oauth/callback`.
5. Copy every value from `.env.local` into Vercel (Settings, Environment
   Variables), plus `NEXT_PUBLIC_SITE_URL` once there is a custom domain.
   Redeploy.
6. Add each officer who will edit the site as a collaborator on the GitHub
   repo (they need a free GitHub account).

Every save in the editor becomes a commit on `main`, and Vercel redeploys the
site in about a minute.

## Photos

Upload photos as they come off the phone. They are shrunk automatically:

- The "Optimize uploaded images" GitHub Action resizes anything in
  `public/images/uploads/` to at most 2000px and recompresses it, then commits
  the smaller file (same name, so nothing breaks).
- The same script runs before every build (`npm run images` runs it by hand).
- Next.js then serves each photo as AVIF or WebP at the size the screen needs.

HEIC files are not supported; iPhones convert to JPG when uploading from the
browser, otherwise export as JPG first.

## Officer guide: updating the site

Go to `/admin` on the live site and sign in with GitHub.

**Add an event.** Activities, Events, Add. Fill in title, type, start time
(Eastern), location, and description. Add a registration link and flyer if
you have them. Save. The event shows under Upcoming, gets its own page with
"Add to calendar" buttons, and moves to Past on its own after it ends.

**Post a recap.** Open the event after it happens and fill in Recap,
Highlights, and Photos. Everything shows on the event's page and the Past
events list.

**Add a gallery album.** Activities, Gallery albums, Add. Set the semester,
academic year (like `2026-2027`), and category, optionally link the event,
then add photos. Albums linked to an event also show on that event's page.

**Officers.** People, E-board members. Display order controls position
(1 shows first).

**Sponsors.** Sponsors, Sponsors and partners for logos. Sponsors,
Sponsorship page for the intro, benefits, and the downloadable PDF packet.

**Meeting info, email, socials.** Content, Site settings.

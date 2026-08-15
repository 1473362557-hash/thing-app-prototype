# Thing app prototype

A mobile-first, installable web prototype for recording progress as Moments rather than managing a to-do list.

## Run locally

From this directory:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`. Use an HTTP server instead of opening `index.html` directly so the web manifest and offline cache work correctly.

## Deploy

This folder is a static site and requires no build command.

- **GitHub Pages:** place these files at the repository root, then choose **Settings → Pages → Deploy from a branch → main / root**.
- **Netlify:** drag this folder into Netlify Drop, or connect the repository. Leave the build command empty and use `.` as the publish directory.
- **Vercel:** import the repository, select “Other” as the framework, leave the build command empty, and use `.` as the output directory.

All prototype changes are saved in the browser with `localStorage`. Uploaded images are compressed only by the browser's data URL encoding, so this is suitable for testing—not for a public multi-user launch.

## Production backend still required

For a real friends-only product, connect the UI to a backend providing:

- account sign-in and profiles;
- Things, Moments, comments, likes, chats, and friend relationships;
- image storage and resizing;
- friends-only authorization rules enforced by the server;
- push notifications, blocking/reporting, deletion/export, and privacy consent;
- backups, moderation, analytics, and error monitoring.

Supabase or Firebase can cover the database, authentication, realtime chat, and image storage. The current local-first data model is deliberately isolated in `app.js` so those calls can replace `loadState()` / `saveState()` later.

# MeetFree – Free Chat Dating & Photo Leaderboards

Red + pink themed dating website. Meet people, chat free, share photos, track views, climb weekly & monthly leaderboards.

## Status

- Frontend MVP ✅ (all main pages working)
- Backend MVP ✅ (auth, users, views, leaderboard, chats)
- Frontend connected to backend APIs ✅
- Ready for deployment ✅

## Run locally (computer)

```bash
cd meet-free
npm install
npm run dev
```

Open http://localhost:3000

Seed demo data:
```bash
curl -X POST http://localhost:3000/api/seed
```

## Open on your phone

See the file **DEPLOY.md** for simple step-by-step instructions (Vercel is free and easiest).

## Demo login

- Email: `aisha@meetfree.com`
- Password: `demo123`

## Project structure

```
src/app/          → pages + API routes
src/components/   → Navbar
src/lib/          → database + seed + mock data
data/             → created automatically when running
DEPLOY.md         → how to put it online for phone
```

Made with ❤️ for real connections.

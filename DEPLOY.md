# How to Deploy MeetFree so you can open it on your phone

Follow these simple steps. You only need to do this once.

## Method 1 – Vercel (Easiest & Free)

1. Create a free account at https://vercel.com (you can sign up with Google or GitHub)

2. On a computer:
   - Open the `meet-free` folder
   - Run these commands:
     ```
     git init
     git add .
     git commit -m "MeetFree first version"
     ```
   - Push the project to GitHub (create a new repository on github.com)

3. Go back to Vercel → “Add New Project” → Import the GitHub repository

4. Click **Deploy**

5. After 1–2 minutes Vercel will give you a link like:
   `https://meet-free-xxxxx.vercel.app`

6. Open that link on your phone. It works!

---

## Method 2 – Even simpler (if you have a computer)

1. Install Node.js on the computer if it is not installed.
2. Open terminal inside the `meet-free` folder.
3. Run:
   ```
   npm install
   npm run dev
   ```
4. On the same Wi-Fi, open the computer’s local IP on your phone
   (example: http://192.168.1.5:3000)

---

## After deployment

- First time the site is live, open this once to create demo users:
  `https://your-link.vercel.app/api/seed`  (use POST or just visit and it will tell you)

- Then you can register new accounts or use:
  Email: aisha@meetfree.com
  Password: demo123

---

## Need help?

Come back to this chat and say:
“I deployed it, here is my link” or “I’m stuck on step X”
and I will help you finish.

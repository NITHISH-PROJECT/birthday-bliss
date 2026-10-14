# 🎂 Birthday Bliss — Create a Magical Birthday Surprise

**Birthday Bliss** is a full-stack, responsive, and emotionally interactive digital birthday surprise web application inspired by the creative gifting journey of modern interactive celebrations. It allows anyone to personalize a magical birthday celebration for a partner, friend, or family member, complete with custom themes, interactive cake blowing, the Tamil romantic song **"En Nenjorathil"**, wax-sealed birthday letters, and an interactive **"Let's Talk About Us ❤️"** relationship questionnaire.

---

## ✨ Features & User Journey

### 1. 🎨 Multi-Step Creator Wizard
- **Step 1: Choose Theme**: 8 bespoke visual themes (*Cake Celebration*, *Galaxy Birthday*, *Classic Birthday*, *Cute Pastel*, *Romantic Birthday*, *Friendship Celebration*, *Photo Memories*, *Minimal Elegant*).
- **Step 2: Recipient Details**: Recipient name, your name, relationship, and special nickname.
- **Step 3: Birthday Details**: Day, month, optional milestone age, and live countdown timer toggle.
- **Step 4: Birthday Message**: Main celebration greetings with inspired message prompts and character counter.
- **Step 5: Your Birthday Wish 💌**: Dedicated section for your deepest personal wish, special promise/vow, heartfelt ending, and handwritten signature with live love-note preview.
- **Step 6: "Let's Talk About Us ❤️" Questionnaire**: 7 curated playful, affectionate questions (with custom question addition and enable/disable toggle).
- **Step 7: Photo Memories**: Drag-and-drop photo uploader with captions and reordering.
- **Step 8: Song Selection**: Default Tamil romantic melody **"En Nenjorathil"** (*Pichaikkaran* — Vijay Antony & Supriya Joshi), audio tester, volume/mute controls, and option to upload your own authorized audio file (MP3 / WAV).
- **Step 9: Surprise Settings**: Toggles for confetti cannons, floating hearts, balloons, sparkles, and optional 4-digit secret passcode.
- **Step 10: Preview & Create**: Live interactive preview and generation of unpredictable unique shareable links.

---

### 2. 🎁 The Recipient Celebration Flow
1. **Unwrapping**: Opening scene with glowing animated gift box (*"Someone has prepared something special for you..."*).
2. **Grand Birthday Reveal**: Animated name reveal with celebratory confetti explosions and theme ambient particles.
3. **Interactive Birthday Cake**:
   - Instruction: *"Close your eyes, make a wish, and blow out the candles. 🎂✨"*
   - Dual blowing interactions: Primary **"Blow Out the Candles 🕯️"** button (always works on every device) or optional microphone breath detection.
   - Flames extinguish with smoke puffs, celebration fanfare, and *"Your wish has been made! ❤️"*.
4. **Music Playback**:
   - **Immediately upon blowing out the candles**, the romantic song **"En Nenjorathil"** starts playing in the background from the same user click handler, guaranteeing full compliance with iOS and Android audio autoplay restrictions.
   - Includes a floating glassmorphism audio player with animated equalizer bars, status badge, volume slider, and play/pause/mute controls.
5. **Special Birthday Letter 💌**:
   - Wax-sealed letter card with **"Open Your Special Letter 💌"** button.
   - Smooth opening animation displaying the personal wish, special promise, heartfelt message, and handwritten signature.
   - Neatly hidden if no wish was entered.
6. **"Let's Talk About Us ❤️" Questions**:
   - Single-card animated transitions between questions.
   - Multiple choice options, text inputs, and a skip button on every question.
   - Submits answers securely to the backend.
   - Displays: *"Thank you for sharing your heart with me. ❤️"*
7. **Photo Memories Gallery**: Polaroid-style photo carousel with captions, zoom lightbox, and dot navigation.
8. **Grand Finale**: Closing celebration wishes, replay celebration button, and *"Create Your Own Surprise"*.

---

### 3. 🔒 Private Creator Answers Dashboard
- When the creator shares the link, they receive a private **Answers Dashboard link** (`/answers/:id?token=...`).
- Displays all recipient answers in real-time with timestamps.
- **Completely confidential**: Answers are stripped from public birthday page API requests to ensure total privacy.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 / 19 with Vite & TypeScript
  - Tailwind CSS with custom glassmorphism and animations
  - Framer Motion for smooth transitions
  - Lucide React icons
  - Canvas Confetti for celebratory particle cannons
  - Web Audio API procedural synthesizer + HTML5 Audio fallback
  - `qrcode.react` for downloadable QR codes
  - React Router v6
- **Backend**:
  - Node.js & Express.js with TypeScript
  - Mongoose & MongoDB (with automatic persistent local JSON fallback if MongoDB is offline)
  - Zod for request validation
  - Bcrypt.js for 4-digit passcode hashing
  - Express Rate Limit for brute-force protection
  - CORS & Helmet-ready architecture

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### 1. Install Dependencies
```bash
# In the client directory
cd client
npm install

# In the server directory
cd ../server
npm install
```

### 2. Start the Development Servers
In two separate terminals:

```bash
# Terminal 1: Backend Server (runs on http://localhost:5000)
cd server
npm run dev

# Terminal 2: Frontend Client (runs on http://localhost:5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Environment Variables

### Server (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/birthday_bliss
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_secure_random_jwt_secret_here
```
> **Note**: If MongoDB is not running locally, the server automatically activates **Local Persistent Storage mode** (`server/data/surprises.json`), ensuring seamless out-of-the-box development!

### Client (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Building for Production

```bash
# Build Client
cd client
npm run build

# Build Server
cd ../server
npm run build
```

---

## 🎵 Song Credits
- **Song**: "En Nenjorathil" / "Nenjorathil"
- **Movie**: *Pichaikkaran* (2016)
- **Composer**: Vijay Antony
- **Singer**: Supriya Joshi
- **Lyricist**: Annamalai

---

## 📄 License
This project is licensed under the MIT License.

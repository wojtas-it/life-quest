# 🚀 Getting Started with LifeQuest

Quick start guide to run the LifeQuest application.

---

## ✅ Prerequisites Check

Make sure you have installed:
- ✅ Node.js 18.x+ (you have v22.20.0)
- ✅ npm (you have v10.9.3)
- ⚠️ MongoDB (local or Atlas cloud)
- 📱 Expo Go app on your phone (iOS/Android)

---

## 🗄️ Step 1: Setup MongoDB

### Option A: Local MongoDB (Recommended for development)

1. **Install MongoDB Community Edition**
   - Download from: https://www.mongodb.com/try/download/community
   - Follow installation instructions for Windows

2. **Start MongoDB**
   ```bash
   # Start MongoDB service
   mongod
   ```

3. **Verify connection** (in new terminal)
   ```bash
   mongosh
   # You should see MongoDB shell
   ```

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 Free tier)
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lifequest
   ```

---

## 🎮 Step 2: Start Backend Server

```bash
# Open new terminal
cd C:\ZPSM_II\LifeQuest\backend

# Start server in development mode
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5000
📝 Environment: development
✅ MongoDB Connected: localhost
📦 Database: lifequest
```

**If you see this** ✅ - Backend is running!

---

## 📱 Step 3: Start Frontend (React Native)

```bash
# Open NEW terminal (keep backend running)
cd C:\ZPSM_II\LifeQuest\frontend

# Start Expo
npm start
```

**Expected output:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or...
```

### To run the app:

**Option 1: Physical Device (Recommended)**
1. Install "Expo Go" app on your phone
2. Scan QR code from terminal
3. App will load

**Option 2: Android Emulator**
```bash
# Press 'a' in the terminal
```

**Option 3: iOS Simulator (Mac only)**
```bash
# Press 'i' in the terminal
```

**If you see the LifeQuest splash screen** ✅ - Frontend is running!

---

## 🧪 Step 4: Test the Setup

1. **Backend health check:**
   Open browser: http://localhost:5000

   You should see:
   ```json
   {
     "message": "LifeQuest API Server",
     "version": "1.0.0",
     "status": "running"
   }
   ```

2. **Frontend check:**
   You should see the HomeScreen with:
   - 🎮 LifeQuest title
   - ✅ Frontend initialized
   - ✅ Backend ready
   - 🚀 Ready to start coding!

---

## 🛠️ Development Workflow

### Daily Startup Routine:

```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm start
```

### Common Commands:

```bash
# Backend
cd backend
npm run dev          # Start with auto-reload
npm start            # Start production mode
npm run seed         # Seed database (when ready)

# Frontend
cd frontend
npm start            # Start Expo
npm run android      # Run on Android
npm run ios          # Run on iOS (Mac only)
```

---

## 📂 Project Structure

```
LifeQuest/
├── frontend/           # React Native app
│   ├── src/
│   │   ├── screens/   # Screen components
│   │   ├── components/# UI components
│   │   ├── navigation/# Navigation setup
│   │   ├── redux/     # State management
│   │   ├── services/  # API calls
│   │   └── theme/     # Colors, styles
│   └── App.js         # Entry point
│
├── backend/            # Express API
│   ├── src/
│   │   ├── models/    # Mongoose schemas
│   │   ├── routes/    # API routes
│   │   ├── controllers/# Business logic
│   │   └── config/    # Configuration
│   └── server.js      # Entry point
│
├── docs/               # Documentation
└── README.md
```

---

## 🐛 Troubleshooting

### Backend won't start

**Problem:** `MongoDB Connection Error`
**Solution:**
- Make sure MongoDB is running (`mongod`)
- Check `backend/.env` has correct `MONGODB_URI`

**Problem:** `Port 5000 already in use`
**Solution:**
- Change PORT in `backend/.env` to 5001
- Update `frontend/src/constants/config.js` API_URL

### Frontend won't start

**Problem:** `npm start` fails
**Solution:**
```bash
cd frontend
rm -rf node_modules
npm install --legacy-peer-deps
npm start
```

**Problem:** Metro bundler cache issues
**Solution:**
```bash
cd frontend
npm start -- --clear
```

### App won't load on phone

**Problem:** "Unable to connect to dev server"
**Solution:**
- Make sure phone and computer are on same WiFi
- Disable firewall temporarily
- Try `npm start -- --tunnel`

---

## 📚 Next Steps

Now that everything is set up:

1. **Review Documentation**
   - Read `docs/PROJECT_SPEC.md` for full specification
   - Check `docs/ROADMAP.md` for development plan
   - See `TODO.md` for task checklist

2. **Start Development**
   - Week 1-2: Backend models and auth
   - Week 3-4: Frontend screens
   - Week 5+: Features and polish

3. **Git Workflow**
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main  # (when you add remote)
   ```

---

## 🆘 Need Help?

- Check `docs/TECH_STACK.md` for setup details
- Review `docs/DATABASE_SCHEMA.md` for data models
- See `docs/UI_FLOWS.md` for screen designs

---

**Ready to code?** 🎮 Let's build LifeQuest!

---

**Created:** May 11, 2026
**Author:** Filip Wojtasiński with Claude Sonnet 4.5

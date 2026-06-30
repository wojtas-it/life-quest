# LifeQuest - Technology Stack & Setup Guide

> Comprehensive technology documentation and installation guide

---

## 📚 Table of Contents
1. [Technology Overview](#technology-overview)
2. [Frontend Stack](#frontend-stack)
3. [Backend Stack](#backend-stack)
4. [Development Tools](#development-tools)
5. [Installation Guide](#installation-guide)
6. [Project Structure](#project-structure)
7. [Configuration](#configuration)

---

## 1. Technology Overview

### Architecture
- **Pattern**: Client-Server (REST API)
- **Frontend**: React Native (mobile app)
- **Backend**: Node.js + Express (REST API)
- **Database**: MongoDB (NoSQL document database)
- **Authentication**: JWT (JSON Web Tokens)

### Why React Native?
- ✅ Cross-platform (iOS & Android from single codebase)
- ✅ Large community & ecosystem
- ✅ Hot reload for fast development
- ✅ Native performance
- ✅ Reusable components

### Why MongoDB?
- ✅ Flexible schema (perfect for evolving features)
- ✅ JSON-like documents (matches JavaScript naturally)
- ✅ Horizontal scalability
- ✅ Rich query language
- ✅ Excellent for mobile/offline apps

---

## 2. Frontend Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.76.x | Mobile app framework |
| **Expo** | 52.x | Development environment & build tools |
| **Node.js** | 18.x+ | JavaScript runtime |

### Navigation
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Navigation** | 7.x | Screen navigation (stack, tab, drawer) |
| **@react-navigation/native** | 7.x | Core navigation library |
| **@react-navigation/bottom-tabs** | 7.x | Bottom tab navigator |
| **@react-navigation/stack** | 7.x | Stack navigator |

### State Management
| Technology | Version | Purpose |
|------------|---------|---------|
| **Redux Toolkit** | 2.x | Global state management |
| **React Redux** | 9.x | React bindings for Redux |
| **Redux Persist** | 6.x | State persistence |

**Alternative (lighter)**: Zustand or Jotai could be used instead of Redux for simpler state management.

### Data Fetching
| Technology | Version | Purpose |
|------------|---------|---------|
| **Axios** | 1.x | HTTP client for API calls |
| **@tanstack/react-query** | 5.x | (Optional) Server state management & caching |

### Storage
| Technology | Version | Purpose |
|------------|---------|---------|
| **@react-native-async-storage/async-storage** | 2.x | Local key-value storage |

### UI & Visualization
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native SVG** | 15.x | SVG rendering |
| **Victory Native** | 41.x | Charts & data visualization |
| **React Native Reanimated** | 3.x | Smooth animations |
| **React Native Gesture Handler** | 2.x | Touch gestures |

### Notifications
| Technology | Version | Purpose |
|------------|---------|---------|
| **expo-notifications** | 1.x | Push notifications |

### Forms & Validation
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hook Form** | 7.x | Form state management |
| **Zod** | 3.x | Schema validation |

### Date & Time
| Technology | Version | Purpose |
|------------|---------|---------|
| **date-fns** | 3.x | Date manipulation |
| **@react-native-community/datetimepicker** | 8.x | Date/time picker |

---

## 3. Backend Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x+ | JavaScript runtime |
| **Express.js** | 4.x | Web framework |
| **TypeScript** | 5.x | (Optional) Type safety |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| **MongoDB** | 7.x | NoSQL database |
| **Mongoose** | 8.x | MongoDB ODM (Object Data Modeling) |

### Authentication & Security
| Technology | Version | Purpose |
|------------|---------|---------|
| **jsonwebtoken** | 9.x | JWT generation & verification |
| **bcryptjs** | 2.x | Password hashing |
| **helmet** | 7.x | Security headers |
| **cors** | 2.x | Cross-Origin Resource Sharing |
| **express-rate-limit** | 7.x | Rate limiting |

### Utilities
| Technology | Version | Purpose |
|------------|---------|---------|
| **dotenv** | 16.x | Environment variables |
| **morgan** | 1.x | HTTP request logger |
| **express-validator** | 7.x | Request validation |

---

## 4. Development Tools

### Code Quality
| Tool | Purpose |
|------|---------|
| **ESLint** | JavaScript linting |
| **Prettier** | Code formatting |
| **Husky** | Git hooks |
| **lint-staged** | Run linters on staged files |

### Testing (Optional for Stage 3)
| Tool | Purpose |
|------|---------|
| **Jest** | Unit testing |
| **React Native Testing Library** | Component testing |
| **Supertest** | API endpoint testing |

### Development
| Tool | Purpose |
|------|---------|
| **Nodemon** | Auto-restart server on changes |
| **Expo CLI** | Expo development tools |
| **Postman** | API testing |
| **MongoDB Compass** | MongoDB GUI |

### Version Control
| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **GitHub/GitLab** | Repository hosting |

---

## 5. Installation Guide

### Prerequisites
```bash
# Check Node.js version (should be 18.x or higher)
node --version

# Check npm version
npm --version

# Install Expo CLI globally
npm install -g expo-cli

# Install Git (if not already)
git --version
```

### MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# Visit: https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod

# Verify connection
mongosh
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 Free tier)
4. Get connection string
5. Whitelist your IP address

---

### Frontend Setup

```bash
# Navigate to project root
cd LifeQuest

# Create React Native app with Expo
npx create-expo-app frontend

# Navigate to frontend
cd frontend

# Install dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install @reduxjs/toolkit react-redux redux-persist
npm install @react-native-async-storage/async-storage
npm install axios
npm install react-native-svg victory-native
npm install react-native-reanimated react-native-gesture-handler
npm install expo-notifications
npm install react-hook-form zod
npm install date-fns
npm install @react-native-community/datetimepicker

# Dev dependencies
npm install --save-dev @babel/preset-typescript
```

---

### Backend Setup

```bash
# Navigate to project root
cd LifeQuest

# Create backend folder
mkdir backend
cd backend

# Initialize package.json
npm init -y

# Install dependencies
npm install express mongoose dotenv cors helmet morgan
npm install jsonwebtoken bcryptjs
npm install express-validator express-rate-limit

# Dev dependencies
npm install --save-dev nodemon
```

---

## 6. Project Structure

### Recommended Folder Structure

```
LifeQuest/
│
├── frontend/                      # React Native App
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── common/           # Generic components (Button, Card, etc.)
│   │   │   ├── quest/            # Quest-related components
│   │   │   └── stats/            # Statistics components
│   │   │
│   │   ├── screens/              # Screen components
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.js
│   │   │   │   ├── RegisterScreen.js
│   │   │   │   └── ForgotPasswordScreen.js
│   │   │   ├── home/
│   │   │   │   └── HomeScreen.js
│   │   │   ├── quest/
│   │   │   │   ├── NewQuestScreen.js
│   │   │   │   └── QuestDetailScreen.js
│   │   │   ├── skillTree/
│   │   │   │   └── SkillTreeScreen.js
│   │   │   ├── stats/
│   │   │   │   └── StatsScreen.js
│   │   │   └── profile/
│   │   │       └── ProfileScreen.js
│   │   │
│   │   ├── navigation/           # Navigation configuration
│   │   │   ├── AppNavigator.js
│   │   │   ├── AuthNavigator.js
│   │   │   └── MainNavigator.js
│   │   │
│   │   ├── redux/                # Redux store
│   │   │   ├── store.js
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── questSlice.js
│   │   │   │   └── userSlice.js
│   │   │   └── middleware/
│   │   │
│   │   ├── services/             # API services
│   │   │   ├── api.js            # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── questService.js
│   │   │   └── statsService.js
│   │   │
│   │   ├── utils/                # Helper functions
│   │   │   ├── xpCalculator.js
│   │   │   ├── dateHelpers.js
│   │   │   └── validators.js
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   └── useQuests.js
│   │   │
│   │   ├── theme/                # Theme & styling
│   │   │   ├── colors.js
│   │   │   ├── fonts.js
│   │   │   ├── spacing.js
│   │   │   └── theme.js
│   │   │
│   │   ├── constants/            # Constants
│   │   │   ├── categories.js
│   │   │   └── config.js
│   │   │
│   │   └── assets/               # Images, fonts, etc.
│   │       ├── images/
│   │       └── fonts/
│   │
│   ├── App.js                    # Root component
│   ├── app.json                  # Expo configuration
│   ├── babel.config.js
│   └── package.json
│
├── backend/                       # Express API Server
│   ├── src/
│   │   ├── models/               # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Quest.js
│   │   │   ├── Category.js
│   │   │   ├── SkillTree.js
│   │   │   ├── Achievement.js
│   │   │   └── UserStats.js
│   │   │
│   │   ├── routes/               # API routes
│   │   │   ├── auth.js
│   │   │   ├── quests.js
│   │   │   ├── categories.js
│   │   │   ├── stats.js
│   │   │   └── achievements.js
│   │   │
│   │   ├── controllers/          # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── questController.js
│   │   │   └── statsController.js
│   │   │
│   │   ├── middleware/           # Custom middleware
│   │   │   ├── auth.js           # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   └── validator.js
│   │   │
│   │   ├── utils/                # Helper functions
│   │   │   ├── xpCalculator.js
│   │   │   └── streakCalculator.js
│   │   │
│   │   ├── config/               # Configuration
│   │   │   ├── db.js             # MongoDB connection
│   │   │   └── constants.js
│   │   │
│   │   └── seeders/              # Database seeders
│   │       └── categorySeed.js
│   │
│   ├── server.js                 # Entry point
│   ├── .env                      # Environment variables (not in git)
│   ├── .env.example              # Example env file
│   └── package.json
│
├── docs/                          # Documentation
├── .gitignore
├── README.md
└── TODO.md
```

---

## 7. Configuration

### Backend .env Example

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/lifequest
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lifequest

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# CORS (if frontend on different domain)
ALLOWED_ORIGINS=http://localhost:19000,http://localhost:19001
```

### Frontend Config (src/constants/config.js)

```javascript
export const API_URL = __DEV__
  ? 'http://localhost:5000/api' // Development
  : 'https://your-production-api.com/api'; // Production

export const APP_CONFIG = {
  xpForLevel: (level) => Math.floor(100 * Math.pow(1.5, level - 1)),
  comboMultipliers: {
    1: 1.0,
    3: 1.2,
    7: 1.5,
    14: 2.0,
    30: 2.5,
  },
};
```

### Expo Configuration (app.json)

```json
{
  "expo": {
    "name": "LifeQuest",
    "slug": "lifequest",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "userInterfaceStyle": "automatic",
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

---

## 8. Running the Project

### Development Workflow

```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm start

# Choose platform:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app (physical device)
```

### Package.json Scripts

**Backend (backend/package.json)**:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node src/seeders/categorySeed.js"
  }
}
```

**Frontend (frontend/package.json)**:
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  }
}
```

---

## 9. Build & Deployment (Future)

### Expo Build (EAS Build)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Backend Deployment Options
- **Heroku** (easy, free tier available)
- **Railway** (modern, easy setup)
- **DigitalOcean App Platform**
- **AWS EC2** (more control)
- **Vercel/Netlify** (serverless functions)

---

## 10. Troubleshooting

### Common Issues

**Metro bundler cache issues:**
```bash
expo start -c
```

**iOS simulator not opening:**
```bash
sudo xcode-select --switch /Applications/Xcode.app
```

**Android emulator not detected:**
```bash
adb devices
adb reverse tcp:5000 tcp:5000
```

**MongoDB connection refused:**
- Check MongoDB service is running
- Verify connection string in .env
- Check firewall/network settings

---

**Document Version**: 1.0
**Last Updated**: May 11, 2026

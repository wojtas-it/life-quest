# LifeQuest - Development Roadmap

> Detailed timeline and implementation plan for Stage 3 (Functional Prototype)

---

## 📊 Overview

**Target**: Functional prototype with 50-70% of planned features
**Timeline**: April - June 2026
**Total Estimated Hours**: 137h

---

## 🎯 Stage 3 Goals

### Minimum Viable Product (50%)
- ✅ User authentication (register/login)
- ✅ Quest CRUD operations
- ✅ XP system & leveling
- ✅ HomeScreen with active quests
- ✅ Basic statistics

### Enhanced Version (70%)
- ✅ All MVP features
- ✅ Skill Tree visualization
- ✅ Streak system
- ✅ Combo multiplier
- ✅ Animations
- ✅ Dark mode

---

## 📅 Timeline Breakdown

### Week 1: Project Setup & Foundation (April 7-13)
**Status**: 🚧 In Progress
**Estimated**: 10h

#### Tasks
- [x] Documentation consolidation
- [ ] Initialize React Native with Expo
- [ ] Project structure setup (frontend/backend)
- [ ] Git repository initialization
- [ ] Install core dependencies
- [ ] Configure development environment

#### Deliverables
- ✅ Working React Native app (blank template)
- ✅ Backend server skeleton
- ✅ MongoDB connection established
- ✅ Basic navigation structure

---

### Week 2: Backend Foundation (April 14-20)
**Status**: ⏳ Planned
**Estimated**: 12h

#### Tasks
- [ ] MongoDB schemas (User, Quest, Category, SkillTree, UserStats, Achievement)
- [ ] User model with password hashing (bcrypt)
- [ ] JWT authentication middleware
- [ ] API routes structure
- [ ] Error handling middleware
- [ ] Environment variables setup (.env)

#### Endpoints to Implement
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

#### Deliverables
- ✅ User registration working (tested in Postman)
- ✅ User login returns JWT token
- ✅ Protected route middleware functional

---

### Week 3: Authentication UI (April 21-27)
**Status**: ⏳ Planned
**Estimated**: 10h

#### Tasks
- [ ] LoginScreen UI
- [ ] RegisterScreen UI
- [ ] Form validation (email, password requirements)
- [ ] AsyncStorage for token persistence
- [ ] Auth context/Redux slice
- [ ] Protected navigation (redirect if not logged in)
- [ ] Loading states & error handling

#### Deliverables
- ✅ User can register via mobile app
- ✅ User can login via mobile app
- ✅ Token persists across app restarts
- ✅ Proper error messages displayed

---

### Week 4: Quest CRUD - Backend (April 28 - May 4)
**Status**: ⏳ Planned
**Estimated**: 8h

#### Tasks
- [ ] Quest Mongoose model
- [ ] Category seeding (4 default categories)
- [ ] Quest CRUD endpoints

#### Endpoints to Implement
```
POST   /api/quests                 # Create quest
GET    /api/quests                 # List user's quests
GET    /api/quests/:id             # Get single quest
PUT    /api/quests/:id             # Update quest
DELETE /api/quests/:id             # Delete quest
PATCH  /api/quests/:id/complete    # Mark as complete
GET    /api/categories             # List all categories
```

#### Deliverables
- ✅ All quest endpoints working
- ✅ Quests filtered by userId
- ✅ Quest validation (required fields)
- ✅ Categories seeded in database

---

### Week 5: Quest CRUD - Frontend (May 5-11)
**Status**: ⏳ Planned
**Estimated**: 14h

#### Tasks
- [ ] HomeScreen layout & design
- [ ] Quest list component
- [ ] Quest card component (with category badge, XP, due date)
- [ ] NewQuestScreen form
- [ ] Category selector component
- [ ] Difficulty slider
- [ ] Date picker integration
- [ ] XP calculation preview
- [ ] FAB (Floating Action Button)
- [ ] Quest detail modal/screen
- [ ] Delete confirmation dialog
- [ ] Pull-to-refresh
- [ ] Empty state

#### Deliverables
- ✅ User can view their quests on HomeScreen
- ✅ User can add new quest via form
- ✅ User can edit existing quest
- ✅ User can delete quest (with confirmation)
- ✅ User can mark quest as complete

---

### Week 6: XP System & Leveling (May 12-18)
**Status**: ⏳ Planned
**Estimated**: 12h

#### Tasks
- [ ] XP calculation logic (backend)
- [ ] Level-up algorithm implementation
- [ ] Update User totalXP on quest completion
- [ ] Create/update SkillTree entry per category
- [ ] UserStats model & initialization
- [ ] XP display on HomeScreen (progress bar)
- [ ] Level display on HomeScreen
- [ ] XP gain animation (basic)
- [ ] Level-up modal

#### Backend Logic
```javascript
// XP for each level (exponential)
const xpForLevel = (level) => Math.floor(100 * Math.pow(1.5, level - 1));

// Quest completion handler
- Calculate base XP from quest
- Apply combo multiplier (if implemented)
- Add XP to User.totalXP
- Add XP to SkillTree[category].currentXP
- Check if User leveled up
- Check if SkillTree[category] leveled up
- Return updated data
```

#### Deliverables
- ✅ Completing quest awards XP
- ✅ User levels up when reaching threshold
- ✅ XP progress bar updates in real-time
- ✅ Level-up triggers visual feedback

---

### Week 7: Skill Tree (May 19-25)
**Status**: ⏳ Planned
**Estimated**: 16h

#### Tasks
- [ ] SkillTreeScreen layout
- [ ] Category progress cards
- [ ] Progress bars per category
- [ ] Level display per category
- [ ] Expandable category details
- [ ] Quest history per category
- [ ] SVG graphics for tree visualization (optional)
- [ ] Animation on level-up

#### Deliverables
- ✅ User can view Skill Tree
- ✅ Each category shows: name, icon, level, XP progress
- ✅ Tap category to expand details
- ✅ Visual polish (colors, icons)

---

### Week 8: Statistics Screen (May 26 - June 1)
**Status**: ⏳ Planned
**Estimated**: 14h

#### Tasks
- [ ] StatsScreen layout
- [ ] UserStats tracking (questsCompleted, currentStreak, longestStreak)
- [ ] Victory Native chart setup
- [ ] XP over time chart (line chart - 7/30 days)
- [ ] Quests per category chart (pie chart)
- [ ] Streak calendar heatmap
- [ ] Summary cards (total XP, level, quests)
- [ ] Time period selector

#### Deliverables
- ✅ User can view statistics
- ✅ Charts display accurate data
- ✅ Streak counter functional
- ✅ Visual polish

---

### Week 9: Gamification - Streak & Combo (June 2-8)
**Status**: ⏳ Planned
**Estimated**: 10h

#### Tasks
- [ ] Streak calculation logic
  - Track lastActiveDate in UserStats
  - Compare with current date on app open
  - Increment streak if within 24h
  - Reset if gap > 24h
- [ ] Combo multiplier implementation
  - 1-2 days: 1.0x
  - 3-6 days: 1.2x
  - 7-13 days: 1.5x
  - 14-29 days: 2.0x
  - 30+ days: 2.5x
- [ ] Apply combo to XP calculation
- [ ] Display streak on HomeScreen
- [ ] Display combo multiplier
- [ ] Streak calendar visualization
- [ ] "Streak at risk" warning (evening notification)

#### Deliverables
- ✅ Streak tracks daily activity
- ✅ Combo multiplier boosts XP
- ✅ Streak visible on HomeScreen
- ✅ Streak persists correctly

---

### Week 10: Polish & Animations (June 9-15)
**Status**: ⏳ Planned
**Estimated**: 12h

#### Tasks
- [ ] XP gain animation (counter, particles)
- [ ] Level-up animation (confetti, modal)
- [ ] Quest completion animation (slide out, checkmark)
- [ ] Progress bar fill animations
- [ ] Loading skeletons
- [ ] Haptic feedback on key actions
- [ ] Sound effects (optional)
- [ ] Micro-interactions (button press states, etc.)
- [ ] Smooth transitions between screens

#### Deliverables
- ✅ App feels polished and responsive
- ✅ Key moments have visual feedback
- ✅ Professional user experience

---

### Week 11: Dark Mode & UX (June 16-22)
**Status**: ⏳ Planned
**Estimated**: 8h

#### Tasks
- [ ] Define dark theme color palette
- [ ] Create theme context/provider
- [ ] Theme toggle in ProfileScreen
- [ ] Persist theme preference (AsyncStorage)
- [ ] Update all screens with theme support
- [ ] Test readability & contrast
- [ ] Empty states for all screens
- [ ] Error states
- [ ] Loading states

#### Deliverables
- ✅ Dark mode fully functional
- ✅ Theme persists across sessions
- ✅ All screens adapt to theme
- ✅ Excellent UX consistency

---

### Week 12: Notifications (Optional) (June 23-29)
**Status**: ⏳ Optional
**Estimated**: 8h

#### Tasks
- [ ] Expo Notifications setup
- [ ] Request notification permissions
- [ ] Daily reminder (morning: "Start your day!")
- [ ] Streak warning (evening: "Don't break your streak!")
- [ ] Level-up notification
- [ ] Achievement unlocked notification

#### Deliverables
- ✅ User receives daily reminders
- ✅ Notifications motivate engagement

---

### Week 13-14: Testing & Bugfixes (June 30 - July 6)
**Status**: ⏳ Planned
**Estimated**: 16h

#### Tasks
- [ ] End-to-end testing (full user flow)
- [ ] Edge case testing (empty states, errors, offline)
- [ ] Performance optimization
- [ ] Bug fixing
- [ ] Code cleanup & commenting
- [ ] Remove console.logs
- [ ] README updates
- [ ] Final documentation review

#### Deliverables
- ✅ Stable, bug-free app
- ✅ All core features working
- ✅ Clean, documented code

---

### Final Week: Deliverables (July 7-13)
**Status**: ⏳ Planned
**Estimated**: 10h

#### Tasks
- [ ] **Demo Video** (2-3 minutes)
  - Script outline
  - Screen recordings:
    - Registration
    - Adding quest
    - Completing quest (XP animation)
    - Skill Tree
    - Statistics
    - Dark mode toggle
  - Video editing
  - Export & compression

- [ ] **Source Code Archive**
  - Remove node_modules
  - Create .zip file
  - Test extraction & installation

- [ ] **Progress Report (PDF)**
  - Current state description
  - Implemented features list
  - Screenshots of all screens
  - Known issues & limitations
  - Future improvements

#### Deliverables
- ✅ Demo video uploaded
- ✅ Source code .zip submitted
- ✅ Progress report PDF submitted

---

## 📦 Feature Priority Matrix

### Must Have (CORE 50%)
| Feature | Priority | Effort | Status |
|---------|----------|--------|--------|
| Authentication | P0 | 10h | ⏳ |
| Quest CRUD | P0 | 14h | ⏳ |
| XP System | P0 | 12h | ⏳ |
| HomeScreen | P0 | 8h | ⏳ |
| Basic Stats | P0 | 6h | ⏳ |

### Should Have (to reach 70%)
| Feature | Priority | Effort | Status |
|---------|----------|--------|--------|
| Skill Tree | P1 | 16h | ⏳ |
| Streak System | P1 | 8h | ⏳ |
| Combo Multiplier | P1 | 4h | ⏳ |
| Animations | P1 | 12h | ⏳ |
| Dark Mode | P1 | 8h | ⏳ |

### Nice to Have (post-70%)
| Feature | Priority | Effort | Status |
|---------|----------|--------|--------|
| Push Notifications | P2 | 8h | ⏳ |
| Achievements System | P2 | 12h | ⏳ |
| Offline Sync | P2 | 10h | ⏳ |
| Quest Templates | P2 | 8h | ⏳ |

---

## 🎯 Milestones

### Milestone 1: Backend Ready (Week 2) ✅
- User can register/login via API
- Quest CRUD endpoints functional
- Database schemas defined

### Milestone 2: Auth UI Complete (Week 3) ✅
- User can register/login via mobile app
- Token persistence working

### Milestone 3: Quest Management Working (Week 5) ✅
- User can manage quests via mobile app
- HomeScreen fully functional

### Milestone 4: XP System Live (Week 6) ✅
- Completing quests earns XP
- Leveling up works

### Milestone 5: Gamification Complete (Week 9) ✅
- Skill Tree, Streak, Combo all working
- App feels like a game

### Milestone 6: Polish Done (Week 11) ✅
- Animations smooth
- Dark mode implemented
- Professional UX

### Milestone 7: Stage 3 Submitted (Final Week) ✅
- All deliverables submitted

---

## ⚠️ Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| MongoDB connection issues | High | Low | Use MongoDB Atlas cloud |
| Expo build errors | Medium | Medium | Test early, use latest stable versions |
| Animation performance | Medium | Medium | Use native animations, test on real devices |
| Scope creep | High | High | Stick to priority matrix, defer P2 features |
| Time overrun | High | Medium | Weekly check-ins, adjust scope if needed |

---

## 📊 Progress Tracking

Check `TODO.md` for detailed checklist and current progress.

---

**Document Version**: 1.0
**Last Updated**: May 11, 2026
**Next Review**: Weekly (every Monday)

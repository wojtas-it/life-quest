# LifeQuest - Project Specification

> Full project specification consolidated from Stage 1 & 2 documentation

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Team & Timeline](#team--timeline)
3. [Use Cases](#use-cases)
4. [Class Diagram](#class-diagram)
5. [Database Schema](#database-schema)
6. [Screen Specifications](#screen-specifications)
7. [Suggested Improvements](#suggested-improvements)

---

## 1. Project Overview

### Title
**LifeQuest: System organizacji i gamifikacji obowiązków codziennych z wykorzystaniem React Native**

### Concept
Mobile "Productivity RPG" app that transforms daily tasks into game elements. Users assign tasks to categories (e.g., Strength, Intelligence, Productivity), and completing them earns XP to level up a virtual avatar.

### Target Platforms
- iOS (via Expo)
- Android (via Expo)

### Project Type
Solo academic project for Advanced Mobile Systems Programming II course

---

## 2. Team & Timeline

### Team
- **Filip Wojtasiński** (Student ID: 37747)
- Role: Full-stack developer (solo project)

### Timeline
- **Stage 1**: Project concept approval - ✅ Completed (10.03.2026)
- **Stage 2**: Full documentation - ✅ Completed (31.03.2026)
- **Stage 3**: Functional prototype (50-70%) - 🚧 In Progress (Target: June 2026)

### Estimated Workload
- Total: ~137 hours
- Breakdown in `ROADMAP.md`

---

## 3. Use Cases

### 3.1 Actors

| Actor | Description |
|-------|-------------|
| **Unregistered User** | Person without account - can register and login |
| **Registered User** | Logged-in person - full access to features |
| **System** | Automated processes: XP calculation, streak checking, notifications |

### 3.2 Use Case Register

| ID | Name | Actor | Priority | Screen | Relations |
|----|------|-------|----------|--------|-----------|
| UC-01 | Register account | Unregistered User | High | RegisterScreen | - |
| UC-02 | Login | Unregistered User | High | LoginScreen | <<include>> UC-08 |
| UC-03 | Reset password | Unregistered User | Medium | ForgotPasswordScreen | <<extend>> UC-02 |
| UC-04 | Add quest | Registered User | High | NewQuestScreen | - |
| UC-05 | Complete quest | Registered User | High | QuestDetailScreen | <<include>> UC-09 |
| UC-06 | View Skill Tree | Registered User | High | SkillTreeScreen | - |
| UC-07 | View statistics | Registered User | Medium | StatsScreen | - |
| UC-08 | Verify data | System | High | - | - |
| UC-09 | Calculate XP | System | High | - | <<include>> UC-10 |
| UC-10 | Check achievements | System | Medium | - | - |

### 3.3 Detailed Use Cases

#### UC-01: Register Account

**ID**: UC-01
**Name**: Register account
**Actor**: Unregistered User
**Goal**: Create new account in LifeQuest system
**Precondition**: User doesn't have an account
**Postcondition**: Account created, user logged in and redirected to HomeScreen

**Main Scenario**:
1. User opens registration screen
2. User enters username, email, and password
3. User confirms form
4. System validates data (UC-08)
5. System creates account and generates session token
6. System creates default categories and empty UserStats
7. User redirected to HomeScreen

**Alternative Scenarios**:
- 3a. User selects "Login with Google" - system initiates OAuth 2.0 flow

**Exception Scenarios**:
- 4a. Email already taken - system displays error message
- 4b. Password doesn't meet requirements - system displays validation error

---

#### UC-02: Login

**ID**: UC-02
**Name**: Login
**Actor**: Unregistered User
**Goal**: Gain access to protected app resources
**Precondition**: User has registered account
**Postcondition**: User logged in and redirected to HomeScreen

**Main Scenario**:
1. User opens login screen
2. User enters email and password
3. User confirms form
4. System verifies credentials (UC-08)
5. System generates session token
6. User redirected to HomeScreen

**Alternative Scenarios**:
- 3a. User selects "Login with Google" - system initiates OAuth 2.0

**Exception Scenarios**:
- 4a. Invalid credentials - system displays error
- 4b. No network connection - system displays appropriate message

---

#### UC-04: Add Quest

**ID**: UC-04
**Name**: Add quest
**Actor**: Registered User
**Goal**: Create new task in system
**Precondition**: User is logged in
**Postcondition**: New quest created and visible in quest list

**Main Scenario**:
1. User navigates to add quest screen
2. User fills form: title, description, category, due date
3. System automatically assigns XP reward based on category
4. User confirms quest
5. System saves quest to database
6. Quest appears in active quest list

**Alternative Scenarios**:
- 2a. User selects quest template - form auto-fills

**Exception Scenarios**:
- 4a. Required fields empty - system displays validation
- 5a. Save error - system informs about problem

---

#### UC-05: Complete Quest

**ID**: UC-05
**Name**: Complete quest
**Actor**: Registered User
**Goal**: Mark quest as completed and receive XP reward
**Precondition**: User has at least one active quest
**Postcondition**: Quest marked complete, XP awarded, stats updated

**Main Scenario**:
1. User selects quest from active list
2. System displays quest details
3. User marks quest as completed
4. System calculates XP (UC-09)
5. System updates streak and combo in UserStats
6. System displays XP gain animation

**Alternative Scenarios**:
- 3a. User edits quest instead of completing
- 3b. User deletes quest

**Exception Scenarios**:
- 4a. Connection error - change saved locally and synced later

---

#### UC-09: Calculate XP

**ID**: UC-09
**Name**: Calculate XP
**Actor**: System
**Goal**: Calculate and assign XP after quest completion
**Precondition**: Quest marked as completed
**Postcondition**: XP awarded to User, SkillTree and UserStats updated

**Main Scenario**:
1. System retrieves XP reward from quest
2. System calculates combo multiplier from UserStats
3. System adds XP = baseXP * comboMultiplier
4. System updates SkillTree for quest's category
5. System checks if level-up occurred
6. System calls UC-10 (check achievements)

**Exception Scenarios**:
- 5a. Level-up - system displays level-up animation

---

## 4. Class Diagram

### 4.1 Classes Overview

| Class | Description |
|-------|-------------|
| **User** | Main user entity. Stores account data (email, password), avatar, level, total XP. Handles registration, login, profile updates. |
| **Quest** | Represents a task/quest. Has title, description, category, XP reward, completion status, due date. Supports full CRUD. |
| **Category** | Task category (e.g., Strength, Intelligence, Productivity). Has name, icon, color. Enables quest grouping. |
| **SkillTree** | Skill tree per category per user. Tracks XP and level in given category. Handles XP addition and level-up checking. |
| **Achievement** | Unlockable achievements. Each has unlock condition, XP bonus, and icon. System automatically checks condition fulfillment. |
| **UserStats** | User statistics: completed quests count, current streak, longest streak, combo multiplier. Handles streak and combo logic. |

### 4.2 Class Details

#### User
```
- _id: ObjectId
- username: string
- email: string
- passwordHash: string
- avatarUrl: string
- level: number
- totalXP: number
- createdAt: Date

+ register(): void
+ login(): AuthToken
+ updateProfile(): void
```

#### Quest
```
- _id: ObjectId
- userId: ObjectId (FK → Users)
- title: string
- description: string
- categoryId: ObjectId (FK → Categories)
- xpReward: number
- isCompleted: boolean
- dueDate: Date

+ create(): Quest
+ complete(): void
+ update(): void
+ delete(): void
```

#### Category
```
- _id: ObjectId
- name: string
- icon: string
- color: string
- description: string

+ getAll(): Category[]
+ getById(): Category
+ getQuests(): Quest[]
```

#### SkillTree
```
- _id: ObjectId
- userId: ObjectId (FK → Users)
- categoryId: ObjectId (FK → Categories)
- currentXP: number
- level: number

+ addXP(amount): void
+ getLevelProgress(): number
+ checkLevelUp(): boolean
```

#### Achievement
```
- _id: ObjectId
- title: string
- description: string
- icon: string
- condition: string
- xpBonus: number

+ checkUnlock(user): boolean
+ getAll(): Achievement[]
+ getUnlocked(): Achievement[]
```

#### UserStats
```
- _id: ObjectId
- userId: ObjectId (FK → Users)
- questsCompleted: number
- currentStreak: number
- longestStreak: number
- comboMultiplier: number

+ updateStreak(): void
+ getComboBonus(): number
+ resetCombo(): void
```

### 4.3 Relationships

- **User → Quest**: Composition (1:N) - user owns many quests, deleting user deletes their quests
- **User → UserStats**: Composition (1:1) - each user has exactly one stats object
- **User → Achievement**: Association (M:N) - user can unlock multiple achievements
- **User → SkillTree**: Composition (1:N) - user has skill tree for each category
- **Category → SkillTree**: Aggregation (1:N) - category linked to many skill trees of different users
- **Quest → Category**: Association (N:1) - quest belongs to one category

---

## 5. Database Schema

See `DATABASE_SCHEMA.md` for full ERD and detailed schema definitions.

**Main Collections**:
- users
- quests
- categories
- skillTrees
- achievements
- userStats
- userAchievements (junction table)

---

## 6. Screen Specifications

### 6.1 Screen List

| Screen | Purpose | Priority |
|--------|---------|----------|
| **LoginScreen** | User login | High |
| **RegisterScreen** | New account creation | High |
| **HomeScreen** | Main screen - active quests list | High |
| **NewQuestScreen** | Add new quest form | High |
| **QuestDetailScreen** | View/edit quest details | High |
| **SkillTreeScreen** | View skill progress per category | High |
| **StatsScreen** | View statistics and charts | Medium |
| **ProfileScreen** | User profile & settings | Medium |
| **ForgotPasswordScreen** | Password reset | Low |

### 6.2 Detailed Screen Specs

#### HomeScreen
**Purpose**: Main app screen with active quests

**Elements**:
- Header: User greeting, avatar, level, XP progress bar
- Streak counter with fire icon
- Active quests list (scrollable)
- Each quest card shows: title, category icon/color, XP reward, due date, checkbox
- FAB (Floating Action Button) for adding new quest
- Bottom tab navigation

**Interactions**:
- Tap quest → QuestDetailScreen
- Tap FAB → NewQuestScreen
- Swipe right on quest → mark complete
- Swipe left on quest → delete
- Pull to refresh

---

#### NewQuestScreen
**Purpose**: Create new quest

**Elements**:
- Back button
- Title input field
- Description input (optional)
- Category selector (4 buttons with icons)
- Difficulty slider (affects XP: 1-5)
- Due date picker
- XP reward preview (updates based on difficulty)
- "Add Quest" button

**Validation**:
- Title required
- Category required
- XP calculated automatically

---

#### SkillTreeScreen
**Purpose**: Visualize progress per category

**Elements**:
- Title: "Skill Tree"
- List of categories (4 cards):
  - Category name & icon
  - Current level
  - XP progress bar
  - Completed quests count
  - Unlock bonus description
- Each card expandable on tap

**Interactions**:
- Tap category → expand details with quest history

---

#### StatsScreen
**Purpose**: Show statistics and charts

**Elements**:
- Weekly summary cards (Level, XP, Quests completed)
- Streak section:
  - Current streak days
  - Longest streak
  - Combo multiplier
  - Calendar heatmap
- XP chart (last 7/30 days - line chart)
- Quests per category (pie chart)
- Time period selector (7 days / 30 days)

---

## 7. Suggested Improvements

### 7.1 Additional Features (Post-MVP)

#### High Priority
1. **Daily Quests** - Auto-generated daily tasks
2. **Quest Templates** - Pre-made quest library
3. **Offline Mode** - Full offline functionality with sync
4. **Dark Mode** - Theme toggle
5. **Animations** - XP gain, level-up, micro-interactions

#### Medium Priority
6. **Custom Avatar** - Avatar customization screen
7. **Sound Effects** - Audio feedback on actions
8. **Visual Badges** - Achievement badge gallery
9. **Weekly/Monthly Challenges** - Special time-limited quests
10. **Quest Priority** - Urgent/important flags

#### Low Priority
11. **Social Features** - Friend comparisons
12. **Leaderboards** - User rankings
13. **Party/Guild System** - Group quests
14. **Item Shop** - Spend XP on virtual rewards
15. **Calendar View** - Calendar integration

### 7.2 Technical Improvements

#### Database Schema Enhancements
```javascript
// Add to User model
{
  preferences: {
    theme: "light" | "dark",
    notifications: boolean,
    language: "pl" | "en"
  },
  lastLoginDate: Date,
  timezone: string
}

// Add to Quest model
{
  priority: "low" | "medium" | "high",
  difficulty: number, // 1-5
  tags: string[],
  recurringType: "daily" | "weekly" | "monthly" | "none",
  parentQuestId: ObjectId // for sub-tasks
}

// New collection: QuestHistory
{
  _id: ObjectId,
  userId: ObjectId,
  questId: ObjectId,
  completedAt: Date,
  xpEarned: number,
  comboMultiplier: number
}
```

#### Gamification Improvements
```javascript
// Non-linear leveling (more RPG-like)
const xpForLevel = (level) => Math.floor(100 * Math.pow(1.5, level - 1));

// Category-specific bonuses
const categoryBonuses = {
  Siła: "2x XP for physical tasks",
  Intelekt: "Unlock advanced quest templates",
  Produktywność: "Reduced XP requirement for level-up",
  Kreatywność: "Custom category creation unlocked"
};

// Enhanced combo multiplier
const comboMultiplier = {
  "1-2 days": 1.0,
  "3-6 days": 1.2,
  "7-13 days": 1.5,
  "14-29 days": 2.0,
  "30+ days": 2.5
};
```

### 7.3 UX Enhancements

1. **Onboarding Tutorial** - Interactive first-time experience
2. **Empty States** - Helpful messages when no data
3. **Loading Skeletons** - Better loading UX
4. **Haptic Feedback** - Vibrations on key actions
5. **Motivational Quotes** - After quest completion
6. **Progress Nudges** - "50 XP to next level!"
7. **Easter Eggs** - Hidden achievements

---

## 8. Success Criteria (Stage 3)

### Minimum (50%)
- ✅ User can register and login
- ✅ User can create, view, edit, delete quests
- ✅ User earns XP when completing quests
- ✅ User levels up when reaching XP threshold
- ✅ Basic HomeScreen with quest list functional
- ✅ Basic statistics display

### Target (70%)
- ✅ All of the above
- ✅ Skill Tree visualization working
- ✅ Streak system tracking daily activity
- ✅ Combo multiplier boosting XP
- ✅ Smooth animations on key actions
- ✅ Dark mode implemented
- ✅ Offline mode with AsyncStorage

---

## 9. References

- **Trello Board**: https://trello.com/b/jLVxD0Ua/lifequest
- **Original Documentation**: `etap1 - zrealizowany.pdf`, `etap2 - zrealizowany.pdf`
- **Stage 3 Requirements**: `etap 3 - do realizacji.txt`

---

**Document Version**: 1.0
**Last Updated**: May 11, 2026
**Author**: Filip Wojtasiński

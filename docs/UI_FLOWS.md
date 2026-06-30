# LifeQuest - User Interface Flows

> Complete user interaction scenarios and screen flows

---

## 📋 Table of Contents
1. [First-Time Experience](#1-first-time-experience)
2. [Daily Usage - Morning](#2-daily-usage---morning)
3. [Quest Completion](#3-quest-completion)
4. [Skill Tree Exploration](#4-skill-tree-exploration)
5. [Statistics Review](#5-statistics-review)
6. [Evening - Streak Maintenance](#6-evening---streak-maintenance)
7. [Achievement Unlocked](#7-achievement-unlocked)
8. [Design Polish](#8-design-polish)

---

## 1. First-Time Experience

### 1.1 App Launch → Onboarding

```
┌─────────────────────────────────────┐
│     Splash Screen (2 seconds)       │
│                                     │
│           ╔═══════╗                 │
│           ║   LQ  ║                 │
│           ╚═══════╝                 │
│          LifeQuest                  │
│                                     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Welcome Screen (Slider 1/3)    │
│                                     │
│     🎮                              │
│  Zamień swoje życie w grę RPG       │
│                                     │
│  [Illustration: Character vs Tasks] │
│                                     │
│         ●  ○  ○                     │
│                                     │
│  [     Pomiń     ]  [ Dalej → ]     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Welcome Screen (Slider 2/3)    │
│                                     │
│     🌳                              │
│   Rozwijaj swoje umiejętności       │
│                                     │
│  [Illustration: Skill Tree Growth]  │
│                                     │
│         ○  ●  ○                     │
│                                     │
│  [     Pomiń     ]  [ Dalej → ]     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Welcome Screen (Slider 3/3)    │
│                                     │
│     📊                              │
│   Śledź postępy i zdobywaj          │
│        osiągnięcia                  │
│                                     │
│  [Illustration: Charts & Trophies]  │
│                                     │
│         ○  ○  ●                     │
│                                     │
│           [ Zaczynamy! ]            │
│     Mam już konto? Zaloguj się      │
└─────────────────────────────────────┘
```

### 1.2 Registration Flow

```
┌─────────────────────────────────────┐
│  ← Stwórz swojego bohatera          │
│                                     │
│     [ Avatar Picker ]               │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │ 👨 │ │ 👩 │ │ 🧙 │ │ 🦸 │          │
│  └───┘ └───┘ └───┘ └───┘          │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │ 🐱 │ │ 🐶 │ │ 🦊 │ │ 🐼 │          │
│  └───┘ └───┘ └───┘ └───┘          │
│                                     │
│  Nazwa użytkownika                  │
│  ┌─────────────────────────────┐   │
│  │ Filip_Quest               ✓ │   │
│  └─────────────────────────────┘   │
│                                     │
│  Email                              │
│  ┌─────────────────────────────┐   │
│  │ filip@example.com         ✓ │   │
│  └─────────────────────────────┘   │
│                                     │
│  Hasło (min. 8 znaków)              │
│  ┌─────────────────────────────┐   │
│  │ ••••••••                  ✓ │   │
│  └─────────────────────────────┘   │
│  ✓ Wielka litera ✓ Cyfra            │
│                                     │
│  [   Rozpocznij przygodę!   ]       │
│                                     │
│  ──────── lub ────────              │
│                                     │
│  [ G  Zaloguj przez Google  ]       │
└─────────────────────────────────────┘
```

### 1.3 Interactive Tutorial

**Step 1: Add First Quest**
```
┌─────────────────────────────────────┐
│       👋 Witaj, Filip!              │
│                                     │
│  Stwórzmy twój pierwszy quest!      │
│                                     │
│  ↓ Kliknij tutaj ↓                  │
│              [➕] ← PULSUJE          │
│                                     │
└─────────────────────────────────────┘
```

**Step 2: Fill Quest Form**
```
┌─────────────────────────────────────┐
│  Świetnie! Teraz wypełnij formularz │
│                                     │
│  Tytuł                              │
│  ┌─────────────────────────────┐   │
│  │ Przeczytaj 20 stron książki │   │
│  └─────────────────────────────┘   │
│     ↑ Spróbuj wpisać to! ↑          │
│                                     │
│  Kategoria - wybierz Intelekt       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │💪  │ │🧠  │ │⚡  │ │🎨  │      │
│  │    │ │ ✓  │ │    │ │    │      │
│  └────┘ └────┘ └────┘ └────┘      │
│                                     │
│  💎 Dostaniesz: +30 XP              │
│                                     │
│  [      Dodaj quest      ]          │
└─────────────────────────────────────┘
```

**Step 3: Complete Tutorial Quest**
```
┌─────────────────────────────────────┐
│  Doskonale! Quest został dodany.    │
│                                     │
│  Teraz oznacz go jako ukończony     │
│  aby zobaczyć magię XP! ✨          │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 📚 Przeczytaj 20 stron        │ │
│  │ Intelekt       ⭐ +30 XP      │ │
│  │ [✓] Oznacz jako ukończone ←── │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
              ↓
       [ANIMATION SEQUENCE]
              ↓
┌─────────────────────────────────────┐
│                                     │
│      🎉 GRATULACJE! 🎉              │
│                                     │
│          +30 XP!                    │
│                                     │
│    [Counter: 0 → 30 animacja]       │
│                                     │
│      ⭐ LEVEL UP! ⭐                │
│     Poziom 1 → Poziom 2!            │
│                                     │
│  [Confetti animation spada]         │
│                                     │
│    [    Świetnie! Dalej!    ]       │
└─────────────────────────────────────┘
```

---

## 2. Daily Usage - Morning

### 2.1 Morning Notification

```
📲 Push Notification (7:00 AM)
╔════════════════════════════════╗
║ 🌅 LifeQuest                   ║
║ Dzień dobry, Filip!            ║
║ Masz 3 aktywne questy na dziś. ║
║ Zdobądź streak 7 dni! 🔥       ║
╚════════════════════════════════╝
```

### 2.2 App Open - HomeScreen

```
┌─────────────────────────────────────┐
│  HomeScreen                    ☀️  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 👤 Witaj, Filip!              │ │
│  │ Poziom 5 | Produktywny Mag    │ │
│  │ ████████░░ 850/1200 XP        │ │
│  │ (71% do poziomu 6)            │ │
│  └───────────────────────────────┘ │
│                                     │
│  🔥 Streak: 6 dni | Combo: x1.2    │
│  Jeszcze 1 dzień do x1.5!           │
│                                     │
│  ⚡ Aktywne questy (3)              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🏃 Trening siłowy             │ │
│  │ Siła           ⭐ +40 XP      │ │
│  │ [ ] Do dziś, 18:00            │ │
│  │ ────────────────── 3h left    │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 📚 Przeczytaj rozdział 3      │ │
│  │ Intelekt       ⭐ +30 XP      │ │
│  │ [ ] Do dziś, 23:59            │ │
│  │ ────────────────── 16h left   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 💼 Napisać raport             │ │
│  │ Produktywność  ⭐ +50 XP      │ │
│  │ [ ] PILNE! Do 17:00           │ │
│  │ ━━━━━━━━━━━━━━━━━ 2h left    │ │
│  │ ⚠️ Wysoki priorytet!          │ │
│  └───────────────────────────────┘ │
│                                     │
│  📋 Ukończone dziś (2)              │
│  ✓ Medytacja +20 XP                 │
│  ✓ Zrobić śniadanie +15 XP          │
│                                     │
│                              [➕]   │
│                                     │
│ [Home][Quests][🌳Tree][📊Stats][👤] │
└─────────────────────────────────────┘
```

### 2.3 Add New Quest

**User taps FAB [➕]**

```
┌─────────────────────────────────────┐
│  ← Nowy quest                       │
│                                     │
│  Tytuł *                            │
│  ┌─────────────────────────────┐   │
│  │ Wypić 2L wody              │   │
│  └─────────────────────────────┘   │
│                                     │
│  Opis (opcjonalnie)                 │
│  ┌─────────────────────────────┐   │
│  │ Nawodnienie organizmu      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Kategoria *                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │💪  │ │🧠  │ │⚡  │ │🎨  │      │
│  │Siła│ │Int.│ │Prod│ │Krea│      │
│  └────┘ └────┘ └────┘ └────┘      │
│          [SELECTED: Siła]           │
│                                     │
│  Trudność (wpływa na XP)            │
│  ●────●────●────●────●              │
│  1    2    3    4    5              │
│      [●] = Średnia                  │
│                                     │
│  Termin *                           │
│  📅 11 maja 2026, 20:00             │
│  [   Zmień termin   ]               │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━          │
│                                     │
│  💎 Nagroda:                        │
│      25 XP (base)                   │
│    × 1.2 (combo)                    │
│    ─────────                        │
│    = 30 XP                          │
│                                     │
│  [      Dodaj quest      ]          │
│                                     │
└─────────────────────────────────────┘
```

**Quest Added - Animation**

```
Quest card "slides in from right"
with gentle bounce effect

┌───────────────────────────────┐
│ 💧 Wypić 2L wody        NEW!  │ ← Badge fades after 2s
│ Siła           ⭐ +30 XP      │
│ [ ] Do dziś, 20:00            │
└───────────────────────────────┘
```

---

## 3. Quest Completion

### 3.1 Quest Detail View

**User taps on quest**

```
┌─────────────────────────────────────┐
│  ← Napisać raport              [⋮]  │
│                                     │
│  📊 Produktywność                   │
│  🎯 Priorytet: Wysoki               │
│  📅 Termin: Dziś, 17:00             │
│  ⭐ Nagroda: 50 XP (base) × 1.2     │
│     = 60 XP total                   │
│                                     │
│  Opis:                              │
│  ┌─────────────────────────────┐   │
│  │ Dokończyć raport dla klienta│   │
│  │ ABC - projekt Q1 2026       │   │
│  │                             │   │
│  │ Do zrobienia:               │   │
│  │ - Zebrać dane               │   │
│  │ - Zrobić wykresy            │   │
│  │ - Napisać wnioski           │   │
│  └─────────────────────────────┘   │
│                                     │
│  [ ✅ Oznacz jako ukończone ]       │
│                                     │
│  [ ✏️ Edytuj ]  [ 🗑️ Usuń ]        │
│                                     │
└─────────────────────────────────────┘
```

### 3.2 Completion Animation Sequence

**User taps [✅ Oznacz jako ukończone]**

```
STEP 1: Quest card animates out
┌───────────────────────────┐
│ 💼 Napisać raport         │  → slides out right
│ ✓ Ukończono!              │     with fade
└───────────────────────────┘

STEP 2: Screen dims with overlay
┌─────────────────────────────────────┐
│                                     │
│     [Semi-transparent overlay]      │
│                                     │
│                                     │
└─────────────────────────────────────┘

STEP 3: XP gain card appears
┌─────────────────────────────────────┐
│                                     │
│      ┌───────────────────────┐     │
│      │                       │     │
│      │   🎉 QUEST DONE! 🎉   │     │
│      │                       │     │
│      │   Base XP:     +50    │     │
│      │   Combo (1.2x): +10   │     │
│      │   ─────────────────   │     │
│      │   Total:       +60 XP │     │
│      │                       │     │
│      │   [Counter animates:  │     │
│      │    850...860...900... │     │
│      │    ...910 XP]         │     │
│      │                       │     │
│      └───────────────────────┘     │
│                                     │
└─────────────────────────────────────┘

STEP 4: Progress bar fills
┌───────────────────────────────┐
│ Poziom 5                      │
│ ████████████░░ 910/1200 XP    │ ← animates fill
│ (76% do poziomu 6)            │
└───────────────────────────────┘

STEP 5 (if level up): Level up modal
┌─────────────────────────────────────┐
│                                     │
│      ⭐⭐⭐ LEVEL UP! ⭐⭐⭐          │
│                                     │
│     Poziom 5 → Poziom 6! 🎊         │
│                                     │
│   [Confetti rains from top]         │
│                                     │
│     Odblokowałeś:                   │
│     🎯 Daily Challenges             │
│     🏆 Achievement "Level 6"        │
│                                     │
│     Bonus XP: +50                   │
│                                     │
│     [    Nieźle! Dalej!    ]        │
│                                     │
└─────────────────────────────────────┘

STEP 6: Haptic feedback
[Phone vibrates: short pulse]

STEP 7: Sound effect (optional)
[Sound: "ding!" or level-up chime]

STEP 8: Return to HomeScreen
[Quest moved to "Ukończone" section]
[Stats updated: currentStreak +1]
```

---

## 4. Skill Tree Exploration

### 4.1 SkillTreeScreen

**User navigates to Skill Tree tab**

```
┌─────────────────────────────────────┐
│         🌳 Drzewko Rozwoju          │
│                                     │
│  Całkowity poziom: 19 (sum)         │
│  Całkowite XP: 2,340                │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 💪 Siła              Lvl 3    │ │
│  │ ████████░░░░░░ 320/500 XP     │ │
│  │ (64% do poziomu 4)            │ │
│  │                               │ │
│  │ 5 ukończonych questów         │ │
│  │ Bonus: +10% XP dla fizycznych │ │
│  │        zadań                  │ │
│  │                        [›]    │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🧠 Intelekt          Lvl 5    │ │
│  │ ████████████░░ 680/800 XP     │ │
│  │ (85% do poziomu 6)            │ │
│  │                               │ │
│  │ 12 ukończonych questów        │ │
│  │ Bonus: Szybsze uczenie się    │ │
│  │ 🔥 Najwyższy poziom!          │ │
│  │                        [›]    │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ⚡ Produktywność     Lvl 4    │ │
│  │ ██████████░░░░ 500/600 XP     │ │
│  │ (83% do poziomu 5)            │ │
│  │                               │ │
│  │ 8 ukończonych questów         │ │
│  │ 🔥 Na fali! Streak: 6 dni     │ │
│  │                        [›]    │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🎨 Kreatywność       Lvl 1    │ │
│  │ ██░░░░░░░░░░░░ 80/200 XP      │ │
│  │ (40% do poziomu 2)            │ │
│  │                               │ │
│  │ 2 ukończone questy            │ │
│  │ Dopiero zaczynasz!            │ │
│  │                        [›]    │ │
│  └───────────────────────────────┘ │
│                                     │
│ [Home][Quests][🌳Tree][📊Stats][👤] │
└─────────────────────────────────────┘
```

### 4.2 Category Detail (Expanded)

**User taps on Intelekt category**

```
┌─────────────────────────────────────┐
│  ← 🧠 Intelekt - Poziom 5           │
│                                     │
│  📊 Postępy                         │
│  ████████████░░ 680/800 XP          │
│  Jeszcze 120 XP do poziomu 6!       │
│                                     │
│  📈 Historia XP (ostatnie 7 dni)    │
│  ┌─────────────────────────────┐   │
│  │ XP                          │   │
│  │ 100│         ╱╲             │   │
│  │  80│    ╱╲  ╱  ╲            │   │
│  │  60│   ╱  ╲╱    ╲           │   │
│  │  40│  ╱          ╲          │   │
│  │  20│ ╱            ╲         │   │
│  │   0└──────────────────      │   │
│  │     Pn Wt Śr Cz Pt So Nd   │   │
│  └─────────────────────────────┘   │
│                                     │
│  🎯 Ukończone questy (12):          │
│  ┌─────────────────────────────┐   │
│  │ ✅ Przeczytać rozdział 3    │   │
│  │    +30 XP • 2 dni temu      │   │
│  ├─────────────────────────────┤   │
│  │ ✅ Kurs online - moduł 2    │   │
│  │    +50 XP • 3 dni temu      │   │
│  ├─────────────────────────────┤   │
│  │ ✅ 10 zadań z matematyki    │   │
│  │    +40 XP • 5 dni temu      │   │
│  └─────────────────────────────┘   │
│  ... zobacz wszystkie (12)          │
│                                     │
│  🏆 Odblokowane osiągnięcia:        │
│  ⭐ Czytacz (10 questów z książkami)│
│  🎓 Student (5 ukończonych kursów)  │
│                                     │
│  🎁 Następne bonusy:                │
│  Poziom 6: +15% XP dla questów      │
│            Intelekt                 │
│  Poziom 10: Odblokowanie "Mentor"   │
│             (możliwość tworzenia    │
│             własnych questów        │
│             template)               │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. Statistics Review

### 5.1 StatsScreen

```
┌─────────────────────────────────────┐
│           📊 Statystyki             │
│                                     │
│  [ 7 dni ] [ 30 dni ] [ Wszys. ]    │
│     [●]      [ ]       [ ]          │
│                                     │
│  📅 Ten tydzień (7-13 maja)         │
│  ┌───────────────────────────────┐ │
│  │  Poziom     XP      Questy    │ │
│  │    6      2,340 XP    42      │ │
│  │  ↑ +1    ↑ +280    ↑ +7       │ │
│  │                               │ │
│  │  vs poprzedni tydzień:        │ │
│  │  ✨ +40% więcej XP!           │ │
│  └───────────────────────────────┘ │
│                                     │
│  🔥 Streak & Combo                  │
│  ┌───────────────────────────────┐ │
│  │  Aktualny: 6 dni 🔥           │ │
│  │  Najdłuższy: 14 dni 🏆        │ │
│  │  Combo: ×1.2                  │ │
│  │                               │ │
│  │  Kalendarz aktywności:        │ │
│  │  P  W  Ś  C  P  S  N         │ │
│  │  🔥 🔥 🔥 🔥 🔥 🔥 ⚪        │ │
│  │  Jeszcze 1 dzień do x1.5!     │ │
│  └───────────────────────────────┘ │
│                                     │
│  📈 XP w ostatnich 7 dniach         │
│  ┌─────────────────────────────┐   │
│  │ 100│         ██              │   │
│  │  80│         ██              │   │
│  │  60│   ██    ██    ██        │   │
│  │  40│   ██ ██ ██ ██ ██        │   │
│  │  20│ █ ██ ██ ██ ██ ██ ██     │   │
│  │   0└──────────────────────   │   │
│  │     P  W  Ś  C  P  S  N     │   │
│  └─────────────────────────────┘   │
│                                     │
│  🎯 Questy per kategoria (total)    │
│  ┌─────────────────────────────┐   │
│  │        ┌────╮               │   │
│  │       ╱      ╲              │   │
│  │      │  💪35% │             │   │
│  │      │  🧠40% │             │   │
│  │       ╲ ⚡25%╱              │   │
│  │        └────╯               │   │
│  │   💪 Siła: 15 questów       │   │
│  │   🧠 Intelekt: 17 questów   │   │
│  │   ⚡ Produktywność: 10       │   │
│  │   🎨 Kreatywność: 0         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⏰ Najproduktywniejszy dzień       │
│  Piątek - średnio 3 questy          │
│                                     │
│  🏅 Ranking XP (ten tydzień)        │
│  Top 10% użytkowników! 🎉           │
│                                     │
│ [Home][Quests][🌳Tree][📊Stats][👤] │
└─────────────────────────────────────┘
```

---

## 6. Evening - Streak Maintenance

### 6.1 Evening Reminder Notification

```
📲 Push Notification (22:30)
╔════════════════════════════════╗
║ ⚠️ LifeQuest                   ║
║ Filip! Masz jeszcze 1 quest    ║
║ do ukończenia przed północą.   ║
║ Nie zepsuj swojego 6-dniowego  ║
║ streak! 🔥                     ║
╚════════════════════════════════╝

[User taps notification]
      ↓
[App opens to HomeScreen with
 incomplete quests highlighted]
```

### 6.2 Quick Complete (Long Press)

**User long-presses quest card**

```
┌───────────────────────────────┐
│ 📚 Przeczytaj rozdział 3      │ ← Long press
│ Intelekt       ⭐ +30 XP      │
│ [ ] Do dziś                   │
└───────────────────────────────┘
        ↓
Quick Action Menu appears:

┌───────────────────────────────┐
│ 📚 Przeczytaj rozdział 3      │
│                               │
│  ┌─────────────────────────┐ │
│  │ ✅ Oznacz jako ukończone│ │ ← Tap
│  ├─────────────────────────┤ │
│  │ ✏️ Edytuj               │ │
│  ├─────────────────────────┤ │
│  │ 📅 Przesuń termin       │ │
│  ├─────────────────────────┤ │
│  │ 🗑️ Usuń                 │ │
│  └─────────────────────────┘ │
│                               │
│  [Tap outside to dismiss]     │
└───────────────────────────────┘
```

**After quick complete:**

```
[Mini XP animation]
┌─────────────────┐
│    +30 XP! 🎉   │ ← Bounces in/out
└─────────────────┘

[Notification banner at top]
┌───────────────────────────────────┐
│ Streak: 7 dni 🔥🔥🔥              │
│ Combo zwiększone do ×1.5!         │
└───────────────────────────────────┘
```

---

## 7. Achievement Unlocked

### 7.1 Surprise Achievement

**User completes 10th quest in Strength category**

```
[Screen dims with dark overlay]
        ↓
┌─────────────────────────────────────┐
│                                     │
│                                     │
│    ╔═════════════════════════╗     │
│    ║  🏆 OSIĄGNIĘCIE! 🏆     ║     │
│    ╠═════════════════════════╣     │
│    ║                         ║     │
│    ║         💪💪💪          ║     │
│    ║    "WOJOWNIK SIŁY"      ║     │
│    ║                         ║     │
│    ║  Ukończyłeś 10 questów  ║     │
│    ║  w kategorii Siła!      ║     │
│    ║                         ║     │
│    ║  ─────────────────      ║     │
│    ║                         ║     │
│    ║  Nagrody:               ║     │
│    ║  • +100 XP              ║     │
│    ║  • Odblokowano: Kategoria║    │
│    ║    "Mistrz Siły"        ║     │
│    ║    (harder quests with  ║     │
│    ║     2x XP multiplier)   ║     │
│    ║                         ║     │
│    ╚═════════════════════════╝     │
│                                     │
│    [  Sprawdź osiągnięcia  ]        │
│           [  OK  ]                  │
│                                     │
│   [Sparkles & shine effects]        │
│                                     │
└─────────────────────────────────────┘

[Sound: triumphant fanfare]
[Haptic: double pulse]
```

### 7.2 Achievement Gallery (ProfileScreen)

```
┌─────────────────────────────────────┐
│  ← Osiągnięcia (5/20)               │
│                                     │
│  🏆 Odblokowane (5)                 │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ 🎯  │ │ 💪  │ │ 🧠  │          │
│  │First│ │War- │ │Scho-│          │
│  │Quest│ │rior │ │lar │          │
│  └─────┘ └─────┘ └─────┘          │
│  ┌─────┐ ┌─────┐                   │
│  │ 🔥  │ │ ⭐  │                   │
│  │7-Day│ │Lvl 6│                   │
│  │Strek│ │     │                   │
│  └─────┘ └─────┘                   │
│                                     │
│  🔒 Zablokowane (15)                │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ ❓  │ │ ❓  │ │ ❓  │          │
│  │ ??? │ │ ??? │ │ ??? │          │
│  │     │ │     │ │     │          │
│  └─────┘ └─────┘ └─────┘          │
│  ...                                │
│                                     │
│  💡 Najbliższe do zdobycia:         │
│  • Marathon (30-day streak) - 23/30 │
│  • Productive (50 quests) - 42/50   │
│                                     │
└─────────────────────────────────────┘
```

---

## 8. Design Polish

### 8.1 Micro-interactions

**Button Press**
```
[Normal]         [Pressed]
┌───────────┐   ┌──────────┐
│   Dodaj   │ → │  Dodaj   │ ← Scale down 95%
└───────────┘   └──────────┘   + opacity 80%
```

**Quest Card Swipe**
```
Swipe Right → Complete
┌───────────────────────┐
│ Quest title       ✓   │ → Green background
└───────────────────────┘   fades in

Swipe Left → Delete
┌───────────────────────┐
│   🗑️     Quest title  │ ← Red background
└───────────────────────┘   fades in
```

**Loading Skeleton**
```
┌─────────────────────────────────┐
│ ░░░░░░░░░░░░                    │ ← Shimmer effect
│ ░░░░░░ ░░░░░░░░                 │   moves left→right
│                                 │
│ ░░░░░░░░░░░░                    │
│ ░░░░░░ ░░░░░░░░                 │
└─────────────────────────────────┘
```

### 8.2 Empty States

**No Quests Yet**
```
┌─────────────────────────────────────┐
│                                     │
│            🎯                       │
│                                     │
│      Brak aktywnych questów!        │
│                                     │
│   Dodaj swój pierwszy quest         │
│   i zacznij zdobywać XP! 🚀         │
│                                     │
│   [  ➕ Dodaj quest  ]              │
│                                     │
└─────────────────────────────────────┘
```

**No Stats Yet**
```
┌─────────────────────────────────────┐
│                                     │
│            📊                       │
│                                     │
│   Brak danych do wyświetlenia       │
│                                     │
│   Ukończ swój pierwszy quest        │
│   aby zobaczyć statystyki!          │
│                                     │
│   [  Zobacz questy  ]               │
│                                     │
└─────────────────────────────────────┘
```

### 8.3 Dark Mode

**Theme Toggle**
```
ProfileScreen:
┌─────────────────────────────────┐
│  Ustawienia                     │
│                                 │
│  Motyw                          │
│  ┌───┐ ┌───┐ ┌───┐            │
│  │ ☀️│ │🌓 │ │ 🌙│            │
│  │   │ │   │ │[●]│            │
│  └───┘ └───┘ └───┘            │
│  Light Auto Dark                │
│                                 │
└─────────────────────────────────┘
```

**Color Scheme**
```
Light Mode:
- Background: #FFFFFF
- Text: #1A1A1A
- Primary: #457B9D
- Success: #2A9D8F
- Warning: #F4A261
- Danger: #E63946

Dark Mode:
- Background: #1A1A1A
- Text: #FFFFFF
- Primary: #6BA3C7
- Success: #3DBFB0
- Warning: #FFB673
- Danger: #FF5A66
```

### 8.4 Motivational Elements

**Random Quotes (after quest completion)**
```
┌─────────────────────────────────┐
│        Quest Complete! ✓        │
│                                 │
│  "Great things never come from  │
│   comfort zones!"               │
│                                 │
│        +30 XP earned            │
└─────────────────────────────────┘
```

**Progress Nudges**
```
┌───────────────────────────────┐
│ 💡 Jeszcze 50 XP do poziomu 6!│
│    Możesz to zrobić! 💪        │
└───────────────────────────────┘
```

**Streak Warnings**
```
┌───────────────────────────────┐
│ ⚠️ Streak: 6 dni               │
│    Utrzymaj go dzisiaj!        │
│    Zostało: 3h 45min           │
└───────────────────────────────┘
```

---

## 9. Navigation Flow Summary

```
App Launch
    ↓
Splash Screen
    ↓
Onboarding (first time) OR Login (returning user)
    ↓
Registration/Login
    ↓
HomeScreen (Tab 1)
    ├─→ Tap quest → QuestDetailScreen
    ├─→ Tap FAB → NewQuestScreen
    └─→ Complete quest → XP Animation

Bottom Navigation:
├─ Tab 1: HomeScreen
├─ Tab 2: QuestsScreen (all quests, filtered)
├─ Tab 3: SkillTreeScreen
│   └─→ Tap category → CategoryDetailScreen
├─ Tab 4: StatsScreen
└─ Tab 5: ProfileScreen
    ├─→ Achievements
    ├─→ Settings
    └─→ Logout
```

---

**Document Version**: 1.0
**Last Updated**: May 11, 2026
**Next Update**: After UI implementation starts

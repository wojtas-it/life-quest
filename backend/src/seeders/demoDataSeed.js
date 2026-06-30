require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Quest = require('../models/Quest');
const QuestLog = require('../models/QuestLog');
const Category = require('../models/Category');

// 0=Nd, 1=Pon, 2=Wt, 3=Sr, 4=Czw, 5=Pt, 6=Sob
const QUESTS_TEMPLATE = [
  {
    title: 'Siłownia',
    description: 'Trening siłowy — klatka, plecy lub nogi',
    category: 'Ciało',
    difficulty: 4,
    schedule: [1, 3, 5, 6], // Pon, Śr, Pt, Sob
  },
  {
    title: 'Trening MMA',
    description: 'Sparring lub trening techniki',
    category: 'Ciało',
    difficulty: 5,
    schedule: [2, 4, 6], // Wt, Czw, Sob
  },
  {
    title: 'Bieganie',
    description: 'Minimum 3km w spokojnym tempie',
    category: 'Ciało',
    difficulty: 3,
    schedule: [0, 2, 4], // Nd, Wt, Czw
  },
  {
    title: 'Czytanie 10 stron',
    description: 'Codzienne czytanie — dowolna książka',
    category: 'Intelekt',
    difficulty: 1,
    schedule: [0, 1, 2, 3, 4, 5, 6], // codziennie
  },
  {
    title: 'Nauka niemieckiego',
    description: '20 minut — Duolingo lub słówka',
    category: 'Intelekt',
    difficulty: 2,
    schedule: [1, 3, 5, 0], // Pon, Śr, Pt, Nd
  },
  {
    title: 'Nauka kodowania 1h',
    description: 'Kurs, projekt lub algorytmy',
    category: 'Produktywność',
    difficulty: 3,
    schedule: [1, 2, 3, 4, 5], // Pon-Pt
  },
  {
    title: 'Podsumowanie finansowe dnia',
    description: 'Zapisz wydatki i przychody dnia',
    category: 'Produktywność',
    difficulty: 1,
    schedule: [0, 1, 2, 3, 4, 5, 6], // codziennie
  },
  {
    title: 'Medytacja',
    description: '10 minut ciszy i skupienia',
    category: 'Psyche',
    difficulty: 2,
    schedule: [0, 1, 2, 3, 4, 5, 6], // codziennie
  },
  {
    title: 'Oddech Wima Hofa',
    description: '3 rundy ćwiczeń oddechowych metodą Wima Hofa',
    category: 'Psyche',
    difficulty: 2,
    schedule: [1, 3, 5], // Pon, Śr, Pt
  },
];

// Completion rates per quest (realistic — nie wszystko zawsze)
const COMPLETION_RATES = {
  'Siłownia': 0.85,
  'Trening MMA': 0.75,
  'Bieganie': 0.70,
  'Czytanie 10 stron': 0.80,
  'Nauka niemieckiego': 0.65,
  'Nauka kodowania 1h': 0.80,
  'Podsumowanie finansowe dnia': 0.90,
  'Medytacja': 0.75,
  'Oddech Wima Hofa': 0.70,
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Find user filip2
    const user = await User.findOne({ username: 'filip2' });
    if (!user) {
      console.error('❌ Nie znaleziono użytkownika filip2. Najpierw zarejestruj konto.');
      process.exit(1);
    }
    console.log(`✅ Znaleziono użytkownika: ${user.username} (${user._id})`);

    // Get categories
    const categories = await Category.find();
    const catMap = {};
    categories.forEach((c) => { catMap[c.name] = c; });
    console.log(`✅ Kategorie: ${categories.map(c => c.name).join(', ')}`);

    // Clear existing quests and logs for this user
    await Quest.deleteMany({ userId: user._id });
    await QuestLog.deleteMany({ userId: user._id });
    console.log('🗑️  Wyczyszczono stare misje i logi');

    // Create quests
    const createdQuests = [];
    for (const tmpl of QUESTS_TEMPLATE) {
      const cat = catMap[tmpl.category];
      if (!cat) {
        console.warn(`⚠️  Brak kategorii: ${tmpl.category}`);
        continue;
      }
      const xpReward = 30 * tmpl.difficulty;
      const quest = await Quest.create({
        userId: user._id,
        title: tmpl.title,
        description: tmpl.description,
        categoryId: cat._id,
        difficulty: tmpl.difficulty,
        xpReward,
        schedule: tmpl.schedule,
      });
      createdQuests.push({ quest, tmpl });
      console.log(`   ⚔️  ${tmpl.title} (${xpReward} XP)`);
    }
    console.log(`✅ Utworzono ${createdQuests.length} misji`);

    // Generate QuestLog for last 30 days
    const logs = [];
    let totalXP = 0;

    for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
      const dayOfWeek = date.getDay();

      for (const { quest, tmpl } of createdQuests) {
        // Only create log if quest is scheduled for this day
        if (!tmpl.schedule.includes(dayOfWeek)) continue;

        // Don't create logs for today (user will do it live in demo)
        if (daysAgo === 0) continue;

        const rate = COMPLETION_RATES[tmpl.title] || 0.75;

        // Slightly better rate in recent days (shows improvement)
        const adjustedRate = daysAgo > 14 ? rate - 0.10 : rate;

        if (Math.random() < adjustedRate) {
          // Randomize completion time slightly
          const logDate = new Date(date);
          logDate.setHours(
            8 + Math.floor(Math.random() * 14),
            Math.floor(Math.random() * 60),
            0, 0
          );
          logs.push({
            userId: user._id,
            questId: quest._id,
            xpEarned: quest.xpReward,
            completedAt: logDate,
          });
          totalXP += quest.xpReward;
        }
      }
    }

    if (logs.length > 0) {
      await QuestLog.insertMany(logs);
    }
    console.log(`✅ Wygenerowano ${logs.length} wpisów w historii`);
    console.log(`✅ Łączne XP z historii: ${totalXP}`);

    // Update user XP and level
    user.totalXP = totalXP;
    user.level = 1;
    // Calculate level from XP
    while (true) {
      const xpNeeded = Math.floor(100 * Math.pow(1.5, user.level));
      if (user.totalXP >= xpNeeded) {
        user.level++;
      } else {
        break;
      }
    }
    await user.save();
    console.log(`✅ Zaktualizowano profil: poziom ${user.level}, ${user.totalXP} XP`);

    console.log('\n🎉 Dane demo gotowe! Możesz nagrywać film.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Błąd:', error.message);
    process.exit(1);
  }
};

seed();

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  {
    name: 'Ciało',
    icon: '💪',
    color: '#E63946',
    description: 'Trening, aktywność fizyczna, zdrowie',
  },
  {
    name: 'Intelekt',
    icon: '🧠',
    color: '#457B9D',
    description: 'Nauka, czytanie, kursy, rozwój umysłu',
  },
  {
    name: 'Produktywność',
    icon: '⚡',
    color: '#2A9D8F',
    description: 'Praca, projekty, organizacja',
  },
  {
    name: 'Psyche',
    icon: '🧘',
    color: '#8338EC',
    description: 'Medytacja, zimny prysznic, mindfulness, równowaga',
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Insert new categories
    const inserted = await Category.insertMany(categories);
    console.log(`✅ Inserted ${inserted.length} categories:`);
    inserted.forEach((cat) => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.color})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();

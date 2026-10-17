require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Event = require('../models/Event');
const seedEvents = require('../data/seedData.json');

const seedDatabase = async () => {
  const cliUri = process.argv[2];
  const mongoUri = cliUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gopratle';

  // Mask credentials in console output for security
  const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  console.log(`[Seed Script] Connecting to MongoDB at: ${maskedUri}`);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log('[Seed Script] Connected successfully.');

    let insertedCount = 0;
    let existingCount = 0;

    for (const item of seedEvents) {
      const existing = await Event.findOne({
        eventName: item.eventName,
        isDemo: true,
      });

      if (existing) {
        existingCount++;
      } else {
        await Event.create({
          ...item,
          isDemo: true,
          status: 'open',
        });
        insertedCount++;
      }
    }

    const totalDemo = await Event.countDocuments({ isDemo: true });
    const totalAll = await Event.countDocuments();

    console.log('----------------------------------------------------');
    console.log(`[Seed Script] Seeding complete!`);
    console.log(`- Inserted new demo records : ${insertedCount}`);
    console.log(`- Skipped existing duplicates: ${existingCount}`);
    console.log(`- Total demo records in DB   : ${totalDemo}`);
    console.log(`- Total all records in DB    : ${totalAll}`);
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    console.log('[Seed Script] Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]:', error.message);
    process.exit(1);
  }
};

seedDatabase();

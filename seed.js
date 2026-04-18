require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const SiteSetting = require('./models/SiteSetting');
const Stats = require('./models/Stats');
const Trainer = require('./models/Trainer');
const Member = require('./models/Member');
const Product = require('./models/Product');
const Transformation = require('./models/Transformation');
const DietPlan = require('./models/DietPlan');
const WorkoutPlan = require('./models/WorkoutPlan');
await Member.updateMany({ feeStatus: { $exists: false } }, { $set: { feeStatus: 'paid' } });
const Membership = require('./models/Membership');
const Gallery = require('./models/Gallery');
const Reel = require('./models/Reel');
const Review = require('./models/Review');
const ContactInfo = require('./models/ContactInfo');
const DietCategory = require('./models/DietCategory');
const DietMeal = require('./models/DietMeal');
const WorkoutCategory = require('./models/WorkoutCategory');
const WorkoutDay = require('./models/WorkoutDay');
const LegalContent = require('./models/LegalContent');
const Admin = require('./models/Admin');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ekanshmishra124_db_user:jXNpKsmoGH2Oujas@ultrafit.9siu9qp.mongodb.net/ultrafit?retryWrites=true&w=majority';

async function seedDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (order matters to avoid foreign key issues)
    await SiteSetting.deleteMany();
    await Stats.deleteMany();
    await Trainer.deleteMany();
    await Member.deleteMany();
    await Product.deleteMany();
    await Transformation.deleteMany();
    await DietPlan.deleteMany();
    await WorkoutPlan.deleteMany();
    await Membership.deleteMany();
    await Gallery.deleteMany();
    await Reel.deleteMany();
    await Review.deleteMany();
    await ContactInfo.deleteMany();
    await DietCategory.deleteMany();
    await DietMeal.deleteMany();
    await WorkoutCategory.deleteMany();
    await WorkoutDay.deleteMany();
    await Admin.deleteMany(); // Clears existing admin users
await Admin.create({
  email: 'ultrafit',
  password: '99350'
});
console.log('✅ Admin user created');

    console.log('Old data cleared');

    // 1. Site Settings (homepage, members, diet, workout)
    await SiteSetting.create({
      logoUrl: '/UltraFit logo.png',
      heroSubheading: 'The Standard of Strength',
      heroButtonText: 'Claim Your 3-Day VIP Pass',
      liveStatusText: 'Open Now – Closing at 10 PM',
      floatingButtonText: 'Book 3-Day Free Trial',
      membersHeroHeading: 'ULTRAFIT MEMBERS',
      membersHeroSubheading: 'An elite community built on discipline, consistency, and transformation.',
      membersFloatingButtonText: '📅 Book 3-Day Free Trial',
      dietHeroHeading: 'Diet & Nutrition Plans',
      dietHeroSubheading: 'Scientifically crafted · Michelin-inspired meals · Unlock your potential',
      calorieCalculatorHeading: '⚡ Daily Calorie Calculator',
      workoutHeroHeading: 'Weekly Workout Plan',
      workoutHeroSubheading: 'Periodized programming · Elite coaching · Unlock your athletic ceiling',
      workoutHeroImage: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1600',
      bmiCalculatorHeading: '⚖️ Body Mass Index'
    });

    // 2. Stats
    await Stats.create({
      membersCount: 1500,
      trainersCount: 20,
      transformationsCount: 500,
      totalMembers: 2340,
      activeMembers: 1892,
      membersTransformations: 1250
    });

    // 3. Trainers
    await Trainer.insertMany([
      { name: 'Marcus Vane', position: 'Founder & CEO', photoUrl: 'https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg', bio: '20+ years in fitness industry, former athlete and business leader.', whatsappNumber: '1234567890', instagramUrl: 'https://instagram.com/ultrafitgym' },
      { name: 'Elena Cross', position: 'Head of Performance', photoUrl: 'https://images.pexels.com/photos/841128/pexels-photo-841128.jpeg', bio: 'Specialist in athletic performance and functional training.', whatsappNumber: '1234567890', instagramUrl: 'https://instagram.com/ultrafitgym' },
      { name: 'David Okafor', position: 'Nutrition Director', photoUrl: 'https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg', bio: 'Certified nutritionist helping members achieve body composition goals.', whatsappNumber: '1234567890', instagramUrl: 'https://instagram.com/ultrafitgym' },
      { name: 'Isabella Cruz', position: 'Strength & Conditioning', photoUrl: '/Trainer.jpg', bio: 'Expert in powerlifting and injury prevention.', whatsappNumber: '1234567890', instagramUrl: 'https://instagram.com/ultrafitgym' }
    ]);

    // 4. Members (17 members from members.html)
    await Member.insertMany([
      { name: "Aarav Sharma", age: 28, since: "2023", photoUrl: "https://randomuser.me/api/portraits/men/32.jpg", experience: "intermediate", goal: "musclegain", featured: true, featuredTag: "Elite Member (6+ months)", status: "active" },
      { name: "Ishita Verma", age: 24, since: "2024", photoUrl: "https://randomuser.me/api/portraits/women/68.jpg", experience: "beginner", goal: "fatloss", featured: false, status: "active" },
      { name: "Rohan Mehta", age: 31, since: "2022", photoUrl: "https://randomuser.me/api/portraits/men/45.jpg", experience: "expert", goal: "musclegain", featured: true, featuredTag: "Content Creator", status: "active" },
      { name: "Priya Kaur", age: 26, since: "2023", photoUrl: "https://randomuser.me/api/portraits/women/33.jpg", experience: "intermediate", goal: "fatloss", featured: false, status: "inactive" },
      { name: "Vikram Singh", age: 35, since: "2021", photoUrl: "https://randomuser.me/api/portraits/men/22.jpg", experience: "expert", goal: "musclegain", featured: true, featuredTag: "VIP", status: "active" },
      { name: "Neha Gupta", age: 22, since: "2024", photoUrl: "https://randomuser.me/api/portraits/women/89.jpg", experience: "beginner", goal: "fatloss", featured: false, status: "active" },
      { name: "Kunal Desai", age: 29, since: "2022", photoUrl: "https://randomuser.me/api/portraits/men/52.jpg", experience: "intermediate", goal: "musclegain", featured: false, status: "active" },
      { name: "Simran Kaur", age: 27, since: "2023", photoUrl: "https://randomuser.me/api/portraits/women/44.jpg", experience: "intermediate", goal: "fatloss", featured: true, featuredTag: "Elite Member (6+ months)", status: "active" },
      { name: "Aditya Raj", age: 33, since: "2021", photoUrl: "https://randomuser.me/api/portraits/men/41.jpg", experience: "expert", goal: "musclegain", featured: false, status: "active" },
      { name: "Riya Bhatia", age: 23, since: "2024", photoUrl: "https://randomuser.me/api/portraits/women/55.jpg", experience: "beginner", goal: "fatloss", featured: false, status: "inactive" },
      { name: "Arjun Nair", age: 30, since: "2022", photoUrl: "https://randomuser.me/api/portraits/men/36.jpg", experience: "intermediate", goal: "musclegain", featured: false, status: "active" },
      { name: "Zara Khan", age: 26, since: "2023", photoUrl: "https://randomuser.me/api/portraits/women/17.jpg", experience: "expert", goal: "fatloss", featured: false, status: "active" },
      { name: "Dhruv Patel", age: 34, since: "2021", photoUrl: "https://randomuser.me/api/portraits/men/64.jpg", experience: "expert", goal: "musclegain", featured: true, featuredTag: "Content Creator", status: "active" },
      { name: "Anjali Mishra", age: 25, since: "2024", photoUrl: "https://randomuser.me/api/portraits/women/28.jpg", experience: "beginner", goal: "fatloss", featured: false, status: "active" },
      { name: "Rahul Joshi", age: 32, since: "2022", photoUrl: "https://randomuser.me/api/portraits/men/12.jpg", experience: "intermediate", goal: "musclegain", featured: false, status: "active" },
      { name: "Meera Iyer", age: 29, since: "2023", photoUrl: "https://randomuser.me/api/portraits/women/62.jpg", experience: "intermediate", goal: "fatloss", featured: false, status: "active" },
      { name: "Kabir Singh", age: 27, since: "2023", photoUrl: "https://randomuser.me/api/portraits/men/85.jpg", experience: "beginner", goal: "musclegain", featured: false, status: "inactive" }
    ]);

    // 5. Products (15 products with full details)
    await Product.insertMany([
      { name: "Ultra Whey Isolate", imageUrl: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "Premium whey isolate, fast absorption", price: 4999, tags: ["#1 Best Seller","Trainer’s Choice"], category: "supplements", type: "protein", goal: "musclegain", isBestseller: true, isTrainerChoice: true, features: ["25g protein per serving","Low carbs & sugar"], benefits: ["Muscle repair","Recovery boost"] },
      { name: "Ultra Creatine Monohydrate", imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400","https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400"], shortDescription: "Micronized creatine for strength", price: 2299, tags: ["Trainer’s Choice"], category: "supplements", type: "creatine", goal: "musclegain", isTrainerChoice: true, features: ["5g per serving","High purity"], benefits: ["Strength increase","ATP production"] },
      { name: "Ultra Pre-Workout", imageUrl: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "Explosive energy & focus", price: 3499, tags: ["Limited Stock","Best Seller"], category: "supplements", type: "preworkout", goal: "musclegain", isBestseller: true, features: ["300mg caffeine","Beta alanine"], benefits: ["Endurance","Pumps"] },
      { name: "Ultra Fat Burner", imageUrl: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400"], shortDescription: "Thermogenic support", price: 3199, tags: ["New Arrival"], category: "supplements", type: "fatloss", goal: "fatloss", features: ["Green tea extract","Cayenne"], benefits: ["Metabolism boost","Fat oxidation"] },
      { name: "Ultra Shaker Bottle", imageUrl: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "Premium leak-proof shaker", price: 799, tags: [], category: "accessories", type: "accessories", goal: "general", features: ["BPA-free","700ml"], benefits: ["Easy mix","Durable"] },
      { name: "Ultra Gym Bag", imageUrl: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400","https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400"], shortDescription: "Duffel with shoe compartment", price: 2999, tags: ["Trainer’s Choice"], category: "accessories", type: "accessories", goal: "general", isTrainerChoice: true, features: ["Water-resistant","Ventilated pocket"], benefits: ["Organized storage"] },
      { name: "Ultra Lifting Straps", imageUrl: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400"], shortDescription: "Leather wrist support", price: 1299, tags: [], category: "accessories", type: "accessories", goal: "musclegain", features: ["Neoprene padding"], benefits: ["Grip strength","Injury prevention"] },
      { name: "Ultra BCAA+ Electrolytes", imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400","https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400"], shortDescription: "Hydration & recovery", price: 2499, tags: ["Best Seller"], category: "supplements", type: "bcaa", goal: "musclegain", isBestseller: true, features: ["2:1:1 ratio","Electrolytes"], benefits: ["Reduce fatigue","Muscle preservation"] },
      { name: "Ultra Plant Protein", imageUrl: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "Vegan pea & rice protein", price: 4499, tags: ["New Arrival"], category: "supplements", type: "protein", goal: "musclegain", features: ["24g protein","Dairy-free"], benefits: ["Vegan friendly","Digestion"] },
      { name: "Ultra Resistance Bands", imageUrl: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400","https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400","https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400"], shortDescription: "Set of 5 bands", price: 1999, tags: [], category: "accessories", type: "accessories", goal: "fatloss", features: ["5 resistance levels"], benefits: ["Versatile","Home workouts"] },
      { name: "Ultra Omega-3", imageUrl: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "High potency fish oil", price: 1899, tags: ["Trainer’s Choice"], category: "supplements", type: "wellness", goal: "general", isTrainerChoice: true, features: ["1000mg EPA/DHA"], benefits: ["Joint health","Heart support"] },
      { name: "Ultra Hoodie", imageUrl: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400","https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400"], shortDescription: "Premium athletic hoodie", price: 3499, tags: ["Limited Stock"], category: "accessories", type: "apparel", goal: "general", features: ["Cotton blend","Gold embroidery"], benefits: ["Comfort","Style"] },
      { name: "Ultra Mass Gainer", imageUrl: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "High calorie weight gainer", price: 5499, tags: ["Best Seller"], category: "supplements", type: "massgainer", goal: "musclegain", isBestseller: true, features: ["50g protein","1200 cal"], benefits: ["Weight gain","Recovery"] },
      { name: "Ultra Knee Sleeves", imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400","https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400"], shortDescription: "Compression support", price: 2299, tags: [], category: "accessories", type: "accessories", goal: "general", features: ["Neoprene 7mm"], benefits: ["Stability","Warmth"] },
      { name: "Ultra Glutamine", imageUrl: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "Immune & recovery support", price: 2199, tags: ["Trainer’s Choice"], category: "supplements", type: "recovery", goal: "musclegain", isTrainerChoice: true, features: ["5g L-Glutamine"], benefits: ["Gut health","Muscle repair"] }
    ]);

    // 6. Transformations
    await Transformation.insertMany([
      { beforeImage: 'Before1.jpg', afterImage: 'After1.jpg' },
      { beforeImage: 'Before2.jpg', afterImage: 'After2.jpg' }
    ]);

    // 7. Diet Plans (preview cards – optional)
    await DietPlan.insertMany([
      { title: 'Veg', imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', shortDescription: 'Plant-based nutrition for sustained energy.', targets: ['Weight Loss', 'Balanced'] },
      { title: 'Egg', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', shortDescription: 'High-quality protein for muscle repair.', targets: ['Muscle Gain', 'Performance'] },
      { title: 'Non-Veg', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', shortDescription: 'Complete protein for strength development.', targets: ['Mass Building', 'Strength'] }
    ]);

    // 8. Workout Plans (preview cards – optional)
    await WorkoutPlan.insertMany([
      { title: 'Cardio Training', imageUrl: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg', shortDescription: 'HIIT to boost metabolic rate.', targets: ['Fat Burn', 'Endurance'] },
      { title: 'Muscle Training', imageUrl: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg', shortDescription: 'Strength-focused for lean mass.', targets: ['Strength', 'Hypertrophy'] }
    ]);

    // 9. Membership Plans
    await Membership.insertMany([
      { planName: 'Monthly Plan', price: 2000, duration: 'month', description: 'Full access, group classes, 24/7 support' },
      { planName: '3-Month Plan', price: 4500, duration: '3 months', description: 'Save ₹1500 + free personal training session' }
    ]);

    // 10. Gallery
    await Gallery.create({ images: ['gallery1.jpg', 'gallery2.jpg', 'gallery3.jpg', 'gallery4.jpg', 'gallery5.jpg'] });

    // 11. Reels
    await Reel.insertMany([
      { videoUrl: 'reel1.mp4', thumbnail: 'thumb1.jpg' },
      { videoUrl: 'reel2.mp4', thumbnail: 'thumb2.jpg' },
      { videoUrl: 'reel3.mp4', thumbnail: 'thumb3.jpg' }
    ]);

    // 12. Reviews
    await Review.insertMany([
      { name: 'Sarah Johnson', photoUrl: 'reviewer1.jpg', review: 'The best gym I have ever joined. Trainers really care.' },
      { name: 'Mike Lee', photoUrl: 'reviewer2.jpg', review: 'Amazing atmosphere and top-notch equipment.' }
    ]);

    // 13. Contact Info
    await ContactInfo.create({
      phone: '+1 (212) 555-7890',
      whatsappNumber: '+1 (212) 555-7891',
      facebookUrl: 'https://facebook.com/ultrafitgym',
      instagramUrl: 'https://instagram.com/ultrafitgym',
      address: '123 Strength Avenue, Manhattan, NY 10001, USA'
    });

    // 14. Diet Categories
    await DietCategory.insertMany([
      { key: 'veg', displayName: '🌱 Vegetarian Diet', order: 1 },
      { key: 'egg', displayName: '🥚 Eggetarian Diet', order: 2 },
      { key: 'nonveg', displayName: '🍗 Non-Vegetarian Diet', order: 3 }
    ]);

    // 15. Diet Meals (full conversion from dietDatabase)
    const dietMealsData = [
      // VEG - GAIN
      { categoryKey: 'veg', type: 'gain', mealTime: 'breakfast', name: 'Golden Oat Power Bowl', imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', ingredients: 'Rolled oats, banana, whey isolate(veg), peanut butter', quantity: '1 bowl', calories: 540, protein: 22, tags: ['High Energy'], isRecommended: false },
      { categoryKey: 'veg', type: 'gain', mealTime: 'breakfast', name: 'Protein Paneer Paratha', imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', ingredients: '2 multigrain paratha with paneer filling, curd', quantity: '2 pcs', calories: 610, protein: 28, tags: ['High Protein'], isRecommended: true },
      { categoryKey: 'veg', type: 'gain', mealTime: 'breakfast', name: 'Nutty Berry Smoothie', imageUrl: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg', ingredients: 'Greek yogurt, mixed berries, chia seeds, almonds', quantity: '500ml', calories: 490, protein: 24, tags: [], isRecommended: false },
      { categoryKey: 'veg', type: 'gain', mealTime: 'lunch', name: 'Paneer Biryani Feast', imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', ingredients: 'Brown rice, cottage cheese, veggies, mint raita', quantity: '1.5 bowl', calories: 680, protein: 30, tags: [], isRecommended: false },
      { categoryKey: 'veg', type: 'gain', mealTime: 'lunch', name: 'High-Protein Soya Chunk Curry', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Soya chunks, whole wheat roti, salad', quantity: '2 roti + curry', calories: 720, protein: 34, tags: ['High Protein'], isRecommended: true },
      { categoryKey: 'veg', type: 'gain', mealTime: 'lunch', name: 'Quinoa Chickpea Bowl', imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg', ingredients: 'Quinoa, chickpeas, tahini dressing, avocado', quantity: '400g', calories: 640, protein: 26, tags: [], isRecommended: false },
      { categoryKey: 'veg', type: 'gain', mealTime: 'dinner', name: 'Mushroom & Lentil Stew', imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', ingredients: 'Mixed lentil, sauteed mushrooms, multigrain bread', quantity: '1 bowl', calories: 590, protein: 27, tags: [], isRecommended: false },
      { categoryKey: 'veg', type: 'gain', mealTime: 'dinner', name: 'Tofu Tikka Masala', imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg', ingredients: 'Grilled tofu, bell peppers, low-fat cream', quantity: '200g', calories: 560, protein: 31, tags: ['High Protein'], isRecommended: true },
      { categoryKey: 'veg', type: 'gain', mealTime: 'dinner', name: 'Veg Protein Salad Deluxe', imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', ingredients: 'Edamame, cottage cheese, walnuts, greens', quantity: 'large bowl', calories: 510, protein: 29, tags: [], isRecommended: false },
      // VEG - LOSS
      { categoryKey: 'veg', type: 'loss', mealTime: 'breakfast', name: 'Green Detox Smoothie', imageUrl: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg', ingredients: 'Spinach, cucumber, green apple, plant protein', quantity: '400ml', calories: 290, protein: 18, tags: ['Low Calorie'], isRecommended: true },
      { categoryKey: 'veg', type: 'loss', mealTime: 'breakfast', name: 'Veg Poha with Sprouts', imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', ingredients: 'Flattened rice, sprouts, lemon', quantity: '1 bowl', calories: 310, protein: 14, tags: [], isRecommended: false },
      { categoryKey: 'veg', type: 'loss', mealTime: 'breakfast', name: 'Oats Upma', imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', ingredients: 'Oats, veggies, curry leaves', quantity: '200g', calories: 280, protein: 12, tags: [], isRecommended: false },
      { categoryKey: 'veg', type: 'loss', mealTime: 'lunch', name: 'Quinoa & Tofu Bowl', imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg', ingredients: 'Quinoa, tofu, mixed greens', quantity: '350g', calories: 380, protein: 22, tags: ['Low Calorie'], isRecommended: true },
      { categoryKey: 'veg', type: 'loss', mealTime: 'lunch', name: 'Lentil Soup + Salad', imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', ingredients: 'Masoor dal, cucumber salad', quantity: '1 bowl', calories: 320, protein: 18, tags: [], isRecommended: false },
      { categoryKey: 'veg', type: 'loss', mealTime: 'lunch', name: 'Grilled Paneer Wrap', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Whole wheat wrap, veggies, mint chutney', quantity: '1 wrap', calories: 410, protein: 24, tags: [], isRecommended: false },
      { categoryKey: 'veg', type: 'loss', mealTime: 'dinner', name: 'Zucchini Noodles', imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', ingredients: 'Zucchini, pesto, cherry tomatoes', quantity: '300g', calories: 260, protein: 10, tags: ['Low Calorie'], isRecommended: true },
      { categoryKey: 'veg', type: 'loss', mealTime: 'dinner', name: 'Stuffed Bell Peppers', imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg', ingredients: 'Bell peppers, cottage cheese, spinach', quantity: '2 pcs', calories: 340, protein: 21, tags: [], isRecommended: false },
      { categoryKey: 'veg', type: 'loss', mealTime: 'dinner', name: 'Clear Veg Soup + Eggplant', imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', ingredients: 'Broth, grilled eggplant', quantity: '1 bowl', calories: 290, protein: 14, tags: [], isRecommended: false },
      // EGG - GAIN
      { categoryKey: 'egg', type: 'gain', mealTime: 'breakfast', name: 'Egg White Frittata', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: '4 egg whites, cheese, veggies', quantity: '1 serving', calories: 470, protein: 35, tags: ['High Protein'], isRecommended: false },
      { categoryKey: 'egg', type: 'gain', mealTime: 'breakfast', name: '3 Egg Omelette Toast', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: 'Whole grain toast, butter, omelette', quantity: '1 serving', calories: 540, protein: 32, tags: [], isRecommended: true },
      { categoryKey: 'egg', type: 'gain', mealTime: 'breakfast', name: 'Egg & Avocado Bowl', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: '2 boiled eggs, avocado, quinoa', quantity: '1 bowl', calories: 590, protein: 28, tags: [], isRecommended: false },
      { categoryKey: 'egg', type: 'gain', mealTime: 'lunch', name: 'Egg Fried Rice', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: 'Brown rice, eggs, veggies', quantity: '1 bowl', calories: 650, protein: 30, tags: [], isRecommended: false },
      { categoryKey: 'egg', type: 'gain', mealTime: 'lunch', name: 'Egg Curry + Roti', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: '2 eggs curry, 2 multigrain roti', quantity: '1 plate', calories: 710, protein: 33, tags: ['High Protein'], isRecommended: true },
      { categoryKey: 'egg', type: 'gain', mealTime: 'lunch', name: 'Egg Salad Sandwich', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: 'Whole wheat bread, egg mayo, greens', quantity: '1 sandwich', calories: 600, protein: 29, tags: [], isRecommended: false },
      { categoryKey: 'egg', type: 'gain', mealTime: 'dinner', name: 'Deviled Eggs Platter', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: '4 egg halves, spinach side', quantity: '1 plate', calories: 490, protein: 28, tags: [], isRecommended: false },
      { categoryKey: 'egg', type: 'gain', mealTime: 'dinner', name: 'Egg & Broccoli Bake', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: 'Baked eggs, cheese, broccoli', quantity: '1 serving', calories: 520, protein: 32, tags: ['High Protein'], isRecommended: true },
      { categoryKey: 'egg', type: 'gain', mealTime: 'dinner', name: 'Omelette Roll', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: 'Egg wrap with mushrooms', quantity: '1 roll', calories: 470, protein: 26, tags: [], isRecommended: false },
      // EGG - LOSS
      { categoryKey: 'egg', type: 'loss', mealTime: 'breakfast', name: '2 Egg White Omelette', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: 'Spinach, tomatoes', quantity: '1 omelette', calories: 190, protein: 20, tags: ['Low Calorie'], isRecommended: true },
      { categoryKey: 'egg', type: 'loss', mealTime: 'breakfast', name: 'Boiled Egg & Berries', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: '2 boiled eggs, mixed berries', quantity: '1 plate', calories: 220, protein: 18, tags: [], isRecommended: false },
      { categoryKey: 'egg', type: 'loss', mealTime: 'breakfast', name: 'Egg & Veggie Scramble', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: '1 whole egg + whites', quantity: '1 serving', calories: 210, protein: 19, tags: [], isRecommended: false },
      { categoryKey: 'egg', type: 'loss', mealTime: 'lunch', name: 'Egg Lettuce Wraps', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: '3 egg whites, lettuce, mustard', quantity: '2 wraps', calories: 280, protein: 25, tags: ['Low Calorie'], isRecommended: true },
      { categoryKey: 'egg', type: 'loss', mealTime: 'lunch', name: 'Egg Drop Soup', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: 'Clear broth, egg ribbons', quantity: '1 bowl', calories: 200, protein: 16, tags: [], isRecommended: false },
      { categoryKey: 'egg', type: 'loss', mealTime: 'lunch', name: 'Egg Salad Light', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: 'Greek yogurt, cucumber', quantity: '1 bowl', calories: 260, protein: 22, tags: [], isRecommended: false },
      { categoryKey: 'egg', type: 'loss', mealTime: 'dinner', name: 'Baked Egg White Cups', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: 'Muffin tin eggs, bell peppers', quantity: '2 cups', calories: 190, protein: 18, tags: ['Low Calorie'], isRecommended: true },
      { categoryKey: 'egg', type: 'loss', mealTime: 'dinner', name: 'Egg & Cauliflower Rice', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: 'Stir fry eggs, cauliflower rice', quantity: '1 bowl', calories: 250, protein: 21, tags: [], isRecommended: false },
      { categoryKey: 'egg', type: 'loss', mealTime: 'dinner', name: 'Poached Eggs on Asparagus', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', ingredients: '2 poached eggs', quantity: '1 plate', calories: 210, protein: 17, tags: [], isRecommended: false },
      // NON-VEG - GAIN
      { categoryKey: 'nonveg', type: 'gain', mealTime: 'breakfast', name: 'Chicken Sausage & Eggs', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: '2 sausages, 3 whole eggs', quantity: '1 plate', calories: 680, protein: 44, tags: ['High Protein'], isRecommended: false },
      { categoryKey: 'nonveg', type: 'gain', mealTime: 'breakfast', name: 'Steak & Sweet Potato', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Lean beef, roasted sweet potato', quantity: '1 serving', calories: 720, protein: 48, tags: [], isRecommended: true },
      { categoryKey: 'nonveg', type: 'gain', mealTime: 'breakfast', name: 'Protein Pancakes', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Whey, eggs, banana', quantity: '2 pancakes', calories: 630, protein: 40, tags: [], isRecommended: false },
      { categoryKey: 'nonveg', type: 'gain', mealTime: 'lunch', name: 'Grilled Chicken Breast', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: '200g chicken, quinoa, broccoli', quantity: '1 plate', calories: 710, protein: 52, tags: ['High Protein'], isRecommended: true },
      { categoryKey: 'nonveg', type: 'gain', mealTime: 'lunch', name: 'Fish Curry Rice', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Salmon curry, brown rice', quantity: '1 bowl', calories: 760, protein: 46, tags: [], isRecommended: false },
      { categoryKey: 'nonveg', type: 'gain', mealTime: 'lunch', name: 'Beef Stir Fry', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Lean beef strips, bell peppers', quantity: '1 serving', calories: 740, protein: 50, tags: [], isRecommended: false },
      { categoryKey: 'nonveg', type: 'gain', mealTime: 'dinner', name: 'Turkey Meatballs', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Baked meatballs, zucchini noodles', quantity: '4 meatballs', calories: 620, protein: 45, tags: ['High Protein'], isRecommended: true },
      { categoryKey: 'nonveg', type: 'gain', mealTime: 'dinner', name: 'Herb Salmon', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Baked salmon, asparagus', quantity: '1 fillet', calories: 590, protein: 42, tags: [], isRecommended: false },
      { categoryKey: 'nonveg', type: 'gain', mealTime: 'dinner', name: 'Chicken Thighs', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: '2 chicken thighs, salad', quantity: '1 plate', calories: 650, protein: 44, tags: [], isRecommended: false },
      // NON-VEG - LOSS
      { categoryKey: 'nonveg', type: 'loss', mealTime: 'breakfast', name: 'Scrambled Egg Whites + Turkey', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Turkey slice, egg whites', quantity: '1 serving', calories: 210, protein: 28, tags: ['Low Calorie'], isRecommended: true },
      { categoryKey: 'nonveg', type: 'loss', mealTime: 'breakfast', name: 'Chicken & Veggie Bowl', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Shredded chicken, spinach', quantity: '1 bowl', calories: 290, protein: 30, tags: [], isRecommended: false },
      { categoryKey: 'nonveg', type: 'loss', mealTime: 'breakfast', name: 'Protein Smoothie', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Whey, almond milk, berries', quantity: '500ml', calories: 240, protein: 25, tags: [], isRecommended: false },
      { categoryKey: 'nonveg', type: 'loss', mealTime: 'lunch', name: 'Grilled Fish & Greens', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'White fish, arugula', quantity: '1 fillet', calories: 350, protein: 38, tags: ['Low Calorie'], isRecommended: true },
      { categoryKey: 'nonveg', type: 'loss', mealTime: 'lunch', name: 'Chicken Salad', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Grilled chicken, avocado, lettuce', quantity: '1 bowl', calories: 390, protein: 40, tags: [], isRecommended: false },
      { categoryKey: 'nonveg', type: 'loss', mealTime: 'lunch', name: 'Tuna Wrap', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Tuna, Greek yogurt, wrap', quantity: '1 wrap', calories: 340, protein: 32, tags: [], isRecommended: false },
      { categoryKey: 'nonveg', type: 'loss', mealTime: 'dinner', name: 'Lemon Herb Chicken', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Chicken breast, steamed broccoli', quantity: '1 serving', calories: 320, protein: 35, tags: ['Low Calorie'], isRecommended: true },
      { categoryKey: 'nonveg', type: 'loss', mealTime: 'dinner', name: 'Shrimp Zoodles', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Shrimp, zucchini noodles', quantity: '1 bowl', calories: 280, protein: 30, tags: [], isRecommended: false },
      { categoryKey: 'nonveg', type: 'loss', mealTime: 'dinner', name: 'Egg Drop Chicken Soup', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', ingredients: 'Chicken broth, egg', quantity: '1 bowl', calories: 210, protein: 24, tags: [], isRecommended: false }
    ];
    await DietMeal.insertMany(dietMealsData);

    // 16. Workout Categories
    await WorkoutCategory.insertMany([
      { key: 'beginner', displayName: 'Beginner', subheading: 'Foundation – 1 to 6 Months', order: 1 },
      { key: 'intermediate', displayName: 'Intermediate', subheading: 'Strength Building – 1 to 2 Years', order: 2 },
      { key: 'expert', displayName: 'Expert', subheading: 'Advanced Performance – 3+ Years', order: 3 }
    ]);

    // 17. Workout Days (full data for beginner, intermediate, expert – each 6 days)
    const workoutDaysData = [
      // BEGINNER
      { categoryKey: 'beginner', dayTitle: 'Day 1 – Chest & Triceps', order: 1, exercises: [{ name: "Flat DB Press", reps: "3x12" }, { name: "Incline Push-ups", reps: "3x10" }, { name: "Pec Deck Fly", reps: "3x12" }, { name: "Triceps Pushdown", reps: "3x12" }], images: [{ url: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400", label: "DB Press" }, { url: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", label: "Push-ups" }, { url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Chest Fly" }, { url: "https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400", label: "Triceps Ext" }] },
      { categoryKey: 'beginner', dayTitle: 'Day 2 – Back & Biceps', order: 2, exercises: [{ name: "Lat Pulldown", reps: "3x12" }, { name: "Seated Cable Row", reps: "3x12" }, { name: "Straight Arm Pushdown", reps: "3x12" }, { name: "Barbell Curl", reps: "3x10" }], images: [{ url: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", label: "Lat Pulldown" }, { url: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", label: "Cable Row" }, { url: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", label: "Pushdown" }, { url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "Barbell Curl" }] },
      { categoryKey: 'beginner', dayTitle: 'Day 3 – Legs & Core', order: 3, exercises: [{ name: "Goblet Squat", reps: "3x10" }, { name: "Leg Press", reps: "3x12" }, { name: "Lying Leg Curl", reps: "3x12" }, { name: "Plank", reps: "3x30 sec" }], images: [{ url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Goblet Squat" }, { url: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", label: "Leg Press" }, { url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "Leg Curl" }, { url: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", label: "Plank" }] },
      { categoryKey: 'beginner', dayTitle: 'Day 4 – Shoulders', order: 4, exercises: [{ name: "DB Overhead Press", reps: "3x10" }, { name: "Lateral Raises", reps: "3x12" }, { name: "Face Pulls", reps: "3x15" }, { name: "Front Raises", reps: "3x12" }], images: [{ url: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", label: "OHP" }, { url: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400", label: "Lat Raise" }, { url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Face Pull" }, { url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "Front Raise" }] },
      { categoryKey: 'beginner', dayTitle: 'Day 5 – Full Body Activation', order: 5, exercises: [{ name: "Deadlift (light)", reps: "3x8" }, { name: "Push Press", reps: "3x10" }, { name: "Pull-ups (assisted)", reps: "3x8" }, { name: "Leg raises", reps: "3x12" }], images: [{ url: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", label: "Deadlift" }, { url: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", label: "Push Press" }, { url: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", label: "Pull-ups" }, { url: "https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400", label: "Leg Raises" }] },
      { categoryKey: 'beginner', dayTitle: 'Day 6 – Cardio & Mobility', order: 6, exercises: [{ name: "KB swings", reps: "3x15" }, { name: "Burpees", reps: "3x10" }, { name: "Rowing", reps: "500m x3" }, { name: "Dynamic Stretching", reps: "10 min" }], images: [{ url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "KB Swings" }, { url: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", label: "Burpees" }, { url: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", label: "Rowing" }, { url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Stretch" }] },
      // INTERMEDIATE
      { categoryKey: 'intermediate', dayTitle: 'Day 1 – Chest & Triceps', order: 1, exercises: [{ name: "Bench Press", reps: "4x8" },{ name: "Incline DB", reps: "4x10" },{ name: "Cable Flys", reps: "3x12" },{ name: "Close-grip Press", reps: "3x10" }], images: [{ url: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400", label: "Bench Press" }, { url: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", label: "Incline DB" }, { url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Cable Fly" }, { url: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", label: "CGP" }] },
      { categoryKey: 'intermediate', dayTitle: 'Day 2 – Back & Biceps', order: 2, exercises: [{ name: "Pull-ups", reps: "4x fail" },{ name: "Barbell Row", reps: "4x8" },{ name: "T-Bar Row", reps: "3x10" },{ name: "Hammer Curls", reps: "3x10" }], images: [{ url: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", label: "Pull-ups" }, { url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "Barbell Row" }, { url: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", label: "T-Bar Row" }, { url: "https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400", label: "Hammer Curl" }] },
      { categoryKey: 'intermediate', dayTitle: 'Day 3 – Legs Strength', order: 3, exercises: [{ name: "Squat", reps: "4x6" },{ name: "RDL", reps: "4x8" },{ name: "Leg Extensions", reps: "3x12" },{ name: "Walking Lunges", reps: "3x12" }], images: [{ url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Squat" }, { url: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", label: "RDL" }, { url: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", label: "Extensions" }, { url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "Lunges" }] },
      { categoryKey: 'intermediate', dayTitle: 'Day 4 – Shoulders & Traps', order: 4, exercises: [{ name: "OHP", reps: "4x8" },{ name: "Arnold Press", reps: "3x10" },{ name: "Lateral Raises", reps: "3x12" },{ name: "Shrugs", reps: "3x12" }], images: [{ url: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400", label: "OHP" }, { url: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", label: "Arnold" }, { url: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", label: "Lateral" }, { url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Shrugs" }] },
      { categoryKey: 'intermediate', dayTitle: 'Day 5 – Arms Hypertrophy', order: 5, exercises: [{ name: "Skullcrushers", reps: "3x10" },{ name: "Preacher Curl", reps: "3x10" },{ name: "Triceps Rope", reps: "3x12" },{ name: "Concentration Curl", reps: "3x10" }], images: [{ url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "Skullcrusher" }, { url: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", label: "Preacher" }, { url: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", label: "Rope Push" }, { url: "https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400", label: "Concentration" }] },
      { categoryKey: 'intermediate', dayTitle: 'Day 6 – Full Body HIIT', order: 6, exercises: [{ name: "Deadlift", reps: "3x5" },{ name: "Kettlebell Swings", reps: "4x15" },{ name: "HIIT Run", reps: "15 min" },{ name: "Core circuit", reps: "10 min" }], images: [{ url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Deadlift" }, { url: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", label: "Swings" }, { url: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", label: "HIIT" }, { url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "Core" }] },
      // EXPERT
      { categoryKey: 'expert', dayTitle: 'Day 1 – Chest & Abs', order: 1, exercises: [{ name: "Decline Bench", reps: "5x5" },{ name: "Incline DB", reps: "4x8" },{ name: "Cable Crossovers", reps: "4x12" },{ name: "Weighted Crunches", reps: "3x15" }], images: [{ url: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400", label: "Decline" }, { url: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", label: "Incline DB" }, { url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Crossover" }, { url: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", label: "Crunches" }] },
      { categoryKey: 'expert', dayTitle: 'Day 2 – Back & Rear Delts', order: 2, exercises: [{ name: "Weighted Pull-ups", reps: "4x6" },{ name: "Deadlift", reps: "4x5" },{ name: "Seated Row", reps: "4x8" },{ name: "Reverse Flys", reps: "3x12" }], images: [{ url: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", label: "Pull-ups" }, { url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "Deadlift" }, { url: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", label: "Row" }, { url: "https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400", label: "Reverse Fly" }] },
      { categoryKey: 'expert', dayTitle: 'Day 3 – Legs Power', order: 3, exercises: [{ name: "Box Squat", reps: "5x3" },{ name: "Hack Squat", reps: "4x8" },{ name: "Romanian Deadlift", reps: "4x6" },{ name: "Bulgarian Split Squat", reps: "3x10" }], images: [{ url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Box Squat" }, { url: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", label: "Hack" }, { url: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", label: "RDL" }, { url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "Split Squat" }] },
      { categoryKey: 'expert', dayTitle: 'Day 4 – Shoulders & Traps', order: 4, exercises: [{ name: "Push Press", reps: "5x5" },{ name: "DB Lateral Raises", reps: "4x10" },{ name: "Upright Row", reps: "3x10" },{ name: "Farmers Walk", reps: "3x20m" }], images: [{ url: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400", label: "Push Press" }, { url: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", label: "Lateral" }, { url: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", label: "Upright" }, { url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Farmers" }] },
      { categoryKey: 'expert', dayTitle: 'Day 5 – Arms Intensity', order: 5, exercises: [{ name: "Close-grip Bench", reps: "4x6" },{ name: "Barbell Curl", reps: "4x6" },{ name: "Weighted Dips", reps: "3x8" },{ name: "21s Curl", reps: "3 sets" }], images: [{ url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "CGBP" }, { url: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", label: "Curl" }, { url: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", label: "Dips" }, { url: "https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400", label: "21s" }] },
      { categoryKey: 'expert', dayTitle: 'Day 6 – Conditioning', order: 6, exercises: [{ name: "Power Clean", reps: "5x3" },{ name: "Battle Ropes", reps: "4x30s" },{ name: "Sled Push", reps: "4x20m" },{ name: "Plyo Box Jumps", reps: "3x10" }], images: [{ url: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", label: "Power Clean" }, { url: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", label: "Ropes" }, { url: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", label: "Sled" }, { url: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", label: "Box Jumps" }] }
    ];
    await WorkoutDay.insertMany(workoutDaysData);

    // Legal Pages Content
await LegalContent.insertMany([
  {
    pageKey: 'privacy',
    heroHeading: 'Privacy Policy',
    heroSubheading: 'Your trust is our priority. We protect your data with the same intensity you bring to your workouts.',
    sections: [
      { title: 'What Data We Collect', content: '<p>UltraFit Gym collects only essential information to provide you with a seamless fitness experience. This includes your name, email address, phone number, membership preferences, and transaction history. We never store sensitive payment details on our servers — all payments are processed through PCI-compliant gateways.</p>' },
      { title: 'How We Use Your Data', content: '<p>Your data helps us personalize training plans, send class reminders, process membership renewals, and improve our services. We may use anonymized analytics to optimize gym operations. We never sell or share your personal information with third parties for marketing purposes.</p>' },
      { title: 'Payment Security', content: '<p>All transactions are encrypted using TLS 1.3 and processed via Stripe / Razorpay. Your card or UPI details never touch our servers. We also offer two-factor authentication for account access.</p>' },
      { title: 'Data Retention & Your Rights', content: '<p>You can request access, correction, or deletion of your data at any time by emailing privacy@ultrafit.com. We retain membership records for 7 years after account closure to comply with tax laws.</p>' }
    ]
  },
  {
    pageKey: 'refund',
    heroHeading: 'Refund Policy',
    heroSubheading: 'Clear, fair, and transparent – because your commitment deserves clarity.',
    sections: [
      { title: 'Cancellation Timelines', content: '<p>You may cancel your membership anytime. Refunds are processed based on the following schedule:</p><ul><li><strong>Within 7 days</strong> of purchase → Full refund (no questions asked).</li><li><strong>8–30 days</strong> → Prorated refund for unused months, minus a ₹500 admin fee.</li><li><strong>After 30 days</strong> → No refund for current month, but future months are fully refundable.</li></ul>' },
      { title: 'Refund Conditions', content: '<p>To be eligible for a refund, you must not have used more than 30% of your purchased sessions or days. Refunds for personal training packages are available only if less than 3 sessions have been consumed. All refunds are processed within 10 business days to the original payment method.</p>' },
      { title: 'Non-Refundable Items', content: '<p>Digital products (e-books, meal plans), discounted promotional offers, and gift vouchers are non-refundable. Membership freeze requests are allowed for medical reasons (documentation required) and do not count toward refund eligibility.</p>' },
      { title: 'How to Request a Refund', content: '<p>Email <strong>billing@ultrafit.com</strong> with your membership ID and reason. Our team will respond within 48 hours. You may also visit the front desk with your ID proof for immediate assistance.</p>' }
    ]
  },
  {
    pageKey: 'terms',
    heroHeading: 'Terms & Conditions',
    heroSubheading: 'Your roadmap to a safe, respectful, and powerful fitness journey.',
    sections: [
      { title: 'Booking Rules', content: '<p>All classes and personal training sessions must be booked at least 2 hours in advance via our app or front desk. Walk-ins are allowed only if capacity permits (max 20 people per session). You may reschedule up to 4 hours before start time without penalty.</p>' },
      { title: 'Cancellation Policy', content: '<p>If you cancel less than 2 hours before a booked session, it will be counted as a “late cancel” and will deduct one session from your plan. No-shows will forfeit the session entirely. For monthly members, three late cancels in 30 days will trigger a 3-day booking restriction.</p>' },
      { title: 'Check-in / Check-out Rules', content: '<p>All members must check in at the kiosk using their unique QR code or registered phone number. Guests must sign a waiver and be accompanied by a member. No entry without valid membership or day pass. The gym is open 24/7 for premium members; standard hours 6 AM – 10 PM.</p>' },
      { title: 'Liability Disclaimer', content: '<p>Exercise involves inherent risks. By using our facilities, you agree that UltraFit Gym is not liable for any injury, loss, or damage resulting from your workouts, improper use of equipment, or failure to follow staff instructions. We recommend a full medical check-up before starting any intense program. Lockers are provided at your own risk.</p>' }
    ]
  }
]);

    console.log('✅ All data inserted successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    mongoose.disconnect();
  }
}

seedDB();
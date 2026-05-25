require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const mailjet = require('node-mailjet');
const Groq = require('groq-sdk');

// Import models
const Trainer = require('./models/Trainer');
const Member = require('./models/Member');
const Product = require('./models/Product');
const DietPlan = require('./models/DietPlan');
const WorkoutPlan = require('./models/WorkoutPlan');
const Membership = require('./models/Membership');
const LegalContent = require('./models/LegalContent');
const ContactInfo = require('./models/ContactInfo'); // assuming you have this model

// Import routes
const trainerRoutes = require('./routes/trainers');
const memberRoutes = require('./routes/members');
const productRoutes = require('./routes/products');
const siteSettingsRoutes = require('./routes/siteSettings');
const statsRoutes = require('./routes/stats');
const transformationRoutes = require('./routes/transformations');
const dietPlanRoutes = require('./routes/dietPlans');
const workoutPlanRoutes = require('./routes/workoutPlans');
const membershipRoutes = require('./routes/memberships');
const galleryRoutes = require('./routes/gallery');
const reelRoutes = require('./routes/reels');
const reviewRoutes = require('./routes/reviews');
const contactInfoRoutes = require('./routes/contactInfo');
const dietCategoriesRoutes = require('./routes/dietCategories');
const dietMealsRoutes = require('./routes/dietMeals');
const workoutCategoriesRoutes = require('./routes/workoutCategories');
const workoutDaysRoutes = require('./routes/workoutDays');
const legalRoutes = require('./routes/legal');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
const corsOptions = {
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// ========== MAILJET ==========
const sendEmail = async (toEmail, toName, subject, htmlContent) => {
  try {
    const request = await mailjet
      .apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
      .post("send", { version: 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": process.env.MJ_FROM_EMAIL || "your-verified-email@example.com",
              "Name": process.env.MJ_FROM_NAME || "UltraFit Gym"
            },
            "To": [{ "Email": toEmail, "Name": toName }],
            "Subject": subject,
            "HTMLPart": htmlContent
          }
        ]
      });
    console.log(`✅ Email sent to ${toEmail}`);
    return true;
  } catch (err) {
    console.error(`❌ Mailjet error: ${err.statusCode} - ${err.message}`);
    return false;
  }
};

// ========== FREE TRIAL BOOKING ==========
app.post('/api/book-trial', async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone || !email) {
    return res.status(400).json({ message: 'Please provide name, phone number, and email address.' });
  }
  const adminEmailContent = `
    <h2>🎟️ New Free Trial Booking</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p>Please contact the member to schedule their one-day free trial.</p>
    <hr />
    <p><em>UltraFit Gym Automated Notification</em></p>
  `;
  const userEmailContent = `
    <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #121212; color: #eaeaea; border-radius: 20px; border: 1px solid #FFD700;">
      <h2 style="color: #FFD700; text-align: center;">🎉 You're Almost There!</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>Thank you for booking a <strong>one-day free trial</strong> at <strong>UltraFit Gym</strong>.</p>
      <p>We have received your request and our team will contact you shortly at <strong>${phone}</strong> to confirm your trial slot and answer any questions.</p>
      <p>If you have any immediate questions, please reply to this email or call us directly.</p>
      <br/>
      <p style="text-align: center;">💪 Get ready to transform your fitness journey!</p>
      <hr style="border-color: #FFD700;" />
      <p style="font-size: 12px; text-align: center;">UltraFit Gym – Where champions are made.</p>
    </div>
  `;
  const adminEmailSent = await sendEmail(process.env.ADMIN_EMAIL || 'admin@example.com', 'UltraFit Admin', 'New Free Trial Booking', adminEmailContent);
  const userEmailSent = await sendEmail(email, name, 'Your Free Trial Confirmation – UltraFit Gym', userEmailContent);
  if (adminEmailSent && userEmailSent) {
    res.status(200).json({ success: true, message: 'Trial booked successfully! Check your email for confirmation.' });
  } else if (adminEmailSent && !userEmailSent) {
    res.status(200).json({ success: true, message: 'Trial booked, but confirmation email could not be sent. Please contact us directly.' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to send booking emails. Please try again or contact us directly.' });
  }
});

// ========== GROQ CHATBOT (full website data) ==========
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getWebsiteDataForAI() {
  // Fetch all necessary collections
  const memberships = await Membership.find().lean();
  const members = await Member.find().lean();
  const products = await Product.find().lean().limit(30);
  const dietPlans = await DietPlan.find().lean();
  const workoutPlans = await WorkoutPlan.find().lean();
  const trainers = await Trainer.find().lean();
  const contact = await ContactInfo.findOne().lean(); // assuming single document
  const legalDocs = await LegalContent.find().lean(); // pageKey: 'privacy', 'refund', 'terms'

  // Extract legal summaries
  const privacyDoc = legalDocs.find(d => d.pageKey === 'privacy');
  const refundDoc = legalDocs.find(d => d.pageKey === 'refund');
  const termsDoc = legalDocs.find(d => d.pageKey === 'terms');

  const getLegalSummary = (doc) => {
    if (!doc || !doc.sections || doc.sections.length === 0) return null;
    // take first section content (first 500 chars) as summary
    const firstSection = doc.sections[0];
    let summary = firstSection.content;
    if (summary.length > 500) summary = summary.substring(0, 500) + '...';
    return summary;
  };

  const privacySummary = getLegalSummary(privacyDoc) || 'Privacy policy available on privacy.html.';
  const refundSummary = getLegalSummary(refundDoc) || 'Refund policy available on refund.html.';
  const termsSummary = getLegalSummary(termsDoc) || 'Terms & conditions available on terms.html.';

  // Members stats
  const activeMembers = members.filter(m => m.status === 'active').length;
  const inactiveMembers = members.filter(m => m.status === 'inactive').length;

  // Format trainers information (include phone/whatsapp)
  const trainersStr = trainers.map(t => 
    `- ${t.name} (${t.position}): WhatsApp ${t.whatsappNumber || 'N/A'}, Instagram: ${t.instagramUrl || 'N/A'}, Bio: ${t.bio || 'No bio'}`
  ).join('\n');

  // Format membership plans
  const membershipStr = memberships.map(m => `- ${m.planName}: ₹${m.price} / ${m.duration} (${m.description || ''})`).join('\n');

  // Format products
  const productsStr = products.map(p => `- ${p.name}: ₹${p.price} | Tags: ${(p.tags || []).join(', ')} | ${p.shortDescription || ''}`).join('\n');

  // Format diet plans
  const dietStr = dietPlans.map(d => `- ${d.title}: ${d.shortDescription} | Targets: ${(d.targets || []).join(', ')}`).join('\n');

  // Format workout plans
  const workoutStr = workoutPlans.map(w => `- ${w.title}: ${w.shortDescription} | Targets: ${(w.targets || []).join(', ')}`).join('\n');

  // Contact info
  let contactStr = 'Contact details not available.';
  if (contact) {
    contactStr = `Phone: ${contact.phone || 'N/A'}, WhatsApp: ${contact.whatsappNumber || 'N/A'}, Email: ${contact.email || 'N/A'}, Address: ${contact.address || 'N/A'}`;
  }

  // 3-day trial process (hardcoded but can be made dynamic if you store it in DB)
  const trialProcess = `To book a 3-day free trial, click the "Book 3-Day Free Trial" button on any page, or the "Claim Your 3-Day VIP Pass" button on the homepage. Fill in your full name, phone number, and email address. You will receive a confirmation email and our team will call you to schedule your trial slot. The trial includes full access to gym facilities and one free personal training session.`;

  return {
    membershipStr,
    membersCount: members.length,
    activeMembers,
    inactiveMembers,
    productsStr,
    dietStr,
    workoutStr,
    trainersStr,
    contactStr,
    trialProcess,
    privacySummary,
    refundSummary,
    termsSummary
  };
}

app.post('/api/chat-groq', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  try {
    const data = await getWebsiteDataForAI();

    const systemPrompt = `You are "UltraFit Coach", the official AI assistant for UltraFit Gym. You are both a fitness coach and a customer support agent. Answer all questions based ONLY on the following REAL data. If the user asks something not covered here, say "I don't have that information yet. Please contact the gym directly or visit the relevant page on our website."

=== REAL GYM DATA ===

**Membership Plans:**
${data.membershipStr || 'No membership plans found.'}

**Members Overview:**
Total members: ${data.membersCount}, Active: ${data.activeMembers}, Inactive: ${data.inactiveMembers}.

**Shop Products:**
${data.productsStr || 'No products found.'}

**Diet Plans:**
${data.dietStr || 'No diet plans found.'}

**Workout Plans:**
${data.workoutStr || 'No workout plans found.'}

**Trainers (with contact info):**
${data.trainersStr || 'No trainers found.'}

**Gym Contact Information:**
${data.contactStr}

**3-Day Free Trial Process:**
${data.trialProcess}

**Legal Policies (summaries):**
- Privacy Policy: ${data.privacySummary}
- Refund Policy: ${data.refundSummary}
- Terms & Conditions: ${data.termsSummary}

=== RULES ===
- Never invent prices, plan names, product details, trainer contacts, or policy details.
- If asked about membership fees, refer ONLY to the plans above.
- If asked about products (name, price, qualities), use ONLY the products list.
- For diet and workout plan details, use the listed plans.
- For trainer questions, provide name, position, WhatsApp number, and bio.
- For contact info, give the phone, WhatsApp, email, and address.
- For the free trial, explain the process exactly as described.
- For legal questions, provide the summary and direct the user to the full policy page (privacy.html, refund.html, terms.html).
- You may give general fitness advice (exercise, nutrition) using your own knowledge, but always prioritize real gym data when available.
- Keep answers concise, helpful, and professional.
- Never share personal member information beyond counts.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.4,
      max_tokens: 700,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'AI service unavailable. Please try again later.' });
  }
});

// ========== MONGODB CONNECTION ==========
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ekanshmishra124_db_user:jXNpKsmoGH2Oujas@ultrafit.9siu9qp.mongodb.net/ultrafit?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected to Atlas');
    console.log('📁 Database name:', mongoose.connection.name);
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ========== API ROUTES ==========
app.use('/api/trainers', trainerRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sitesettings', siteSettingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/transformations', transformationRoutes);
app.use('/api/dietplans', dietPlanRoutes);
app.use('/api/workoutplans', workoutPlanRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contactinfo', contactInfoRoutes);
app.use('/api/dietcategories', dietCategoriesRoutes);
app.use('/api/dietmeals', dietMealsRoutes);
app.use('/api/workoutcategories', workoutCategoriesRoutes);
app.use('/api/workoutdays', workoutDaysRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// ========== STATIC FILES & FALLBACK ==========
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
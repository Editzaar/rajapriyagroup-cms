/**
 * VERCEL SERVERLESS BACKEND API ROUTE: /api/publish
 * Handles 100% Zero-Touch Background Publishing to Blogger.
 */

const nodemailer = require('nodemailer');

const CATEGORY_MAP = {
  'real estate': ['Real Estate', 'Hyderabad', 'Plot Investment', 'Construction'],
  'video': ['Video Editing', 'Reels', 'Motion Graphics', 'Branding'],
  'web': ['Website Development', 'Web Design', 'SEO', 'Digital Solutions'],
  'brand': ['Brand Growth', 'Digital Marketing', 'Social Media', 'Lead Generation']
};

const IMAGE_ASSETS = {
  'real estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  'video': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
  'web': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'brand': 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1200&q=80'
};

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { topic, summary, category, secretEmail } = req.body || {};

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const targetEmail = secretEmail || process.env.BLOGGER_SECRET_EMAIL || 'rajapriyagroup.rajapriya123@blogger.com';
    const topicLower = topic.toLowerCase();
    
    let labels = ['Raja Priya Group', 'Insights'];
    let coverImg = IMAGE_ASSETS['real estate'];

    for (const [key, tags] of Object.entries(CATEGORY_MAP)) {
      if (topicLower.includes(key) || (category && category.toLowerCase().includes(key))) {
        labels = labels.concat(tags);
        coverImg = IMAGE_ASSETS[key];
        break;
      }
    }

    const title = topic.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    const htmlBody = `
<div class="article-content" style="font-family: sans-serif; color: #333333; line-height: 1.8;">
  <p style="font-size:1.15rem; line-height:1.75; color:#111111; font-weight:500;">
    ${summary ? summary : `In today's fast-evolving market, understanding ${topic} is crucial for long-term growth and high ROI. Raja Priya Group brings you an in-depth analysis and expert guide.`}
  </p>

  <div style="margin:24px 0; border-radius:16px; overflow:hidden;">
    <img src="${coverImg}" alt="${title}" style="width:100%; height:auto; display:block;" />
  </div>

  <h2 style="color:#d4af37; font-size:1.6rem; margin:28px 0 14px;">1. Key Market Trends & Strategic Advantages</h2>
  <p>Navigating ${topic} requires a structured approach. Whether scaling your digital presence or investing strategically in Hyderabad, timing and execution are paramount.</p>
  <ul>
    0<li><strong>Targeted Reach:</strong> Tailored strategies designed for maximum engagement.</li>
    <li><strong>Professional Execution:</strong> High-grade production and execution standards.</li>
    <li><strong>Long-Term Value:</strong> Built to generate sustainable returns and brand equity.</li>
  </ul>

  <h2 style="color:#d4af37; font-size:1.6rem; margin:28px 0 14px;">2. How Raja Priya Group Delivers Results</h2>
  <p>At Raja Priya Group, we integrate real estate development expertise with cutting-edge digital media services (Video Editing, Web Development, and Brand Growth) to deliver seamless end-to-end solutions.</p>

  <div style="background:#f9f6ef; border:1px solid #d4af37; padding:24px; border-radius:16px; margin:32px 0;">
    <h3 style="color:#111111; margin-bottom:8px;">💡 Ready to Transform Your Growth?</h3>
    <p>Get expert consultation for real estate, construction, video editing, or digital brand promotion in Hyderabad.</p>
    <a href="https://editzaar.github.io/rajapriyagroup-creator/contact.html" style="background:#d4af37; color:#07080a; font-weight:700; padding:12px 24px; border-radius:24px; text-decoration:none; display:inline-block;">Get Free Consultation &rarr;</a>
  </div>
</div>
`;

    // Configure Background SMTP Mailer
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: false,
        auth: { user: smtpUser, pass: smtpPass }
      });

      await transporter.sendMail({
        from: `"Raja Priya Group AI CMS" <${smtpUser}>`,
        to: targetEmail,
        subject: title,
        html: htmlBody
      });

      return res.status(200).json({
        success: true,
        message: 'Published Live via Background Serverless API!',
        title,
        targetEmail
      });
    }

    // Fallback payload response
    return res.status(200).json({
      success: true,
      message: 'Zero-touch API Payload Ready!',
      title,
      labels,
      htmlBody,
      targetEmail
    });

  } catch (error) {
    console.error('Publish API Error:', error);
    return res.status(500).json({ error: error.message || 'Server error during publishing' });
  }
};

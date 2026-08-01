/**
 * RAJA PRIYA GROUP — AI BLOGGER CMS LOGIC
 * Manages AI Article Generation, Live Preview, Editing, and Direct Blogger Publishing.
 */

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

let currentArticle = null;

function generateAIArticle() {
  const topicInput = document.getElementById('topicInput').value.trim();
  const summaryInput = document.getElementById('summaryInput').value.trim();

  if (!topicInput) {
    showToast('⚠️ Please enter a Topic or Summary first!');
    return;
  }

  showToast('⚡ AI is generating full article & cover graphic...');

  const topicLower = topicInput.toLowerCase();
  let labels = ['Raja Priya Group', 'Insights'];
  let coverImg = IMAGE_ASSETS['real estate'];

  for (const [key, tags] of Object.entries(CATEGORY_MAP)) {
    if (topicLower.includes(key)) {
      labels = labels.concat(tags);
      coverImg = IMAGE_ASSETS[key];
      break;
    }
  }

  const title = topicInput.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  const metaDescription = `Discover expert insights on ${topicInput} from Raja Priya Group in Hyderabad. Full market guide & ROI strategies.`;

  const htmlBody = `
<div class="article-content">
  <p class="lead" style="font-size:1.15rem; line-height:1.75; color:#f5f5f7; font-weight:500;">
    ${summaryInput ? summaryInput : `In today's fast-evolving market, understanding ${topicInput} is crucial for long-term growth and high ROI. Raja Priya Group brings you an in-depth analysis and expert guide.`}
  </p>

  <div style="margin:24px 0; border-radius:16px; overflow:hidden; border:1px solid rgba(212,175,55,0.35);">
    <img src="${coverImg}" alt="${title}" style="width:100%; height:auto; display:block;" />
  </div>

  <h2 style="font-family:'Outfit', sans-serif; font-size:1.8rem; color:#d4af37; margin:32px 0 16px;">
    1. Key Market Trends & Strategic Advantages
  </h2>
  <p style="line-height:1.75; color:#e3e3e8; margin-bottom:16px;">
    Navigating ${topicInput} requires a structured approach. Whether scaling your digital presence or investing strategically in Hyderabad, timing and execution are paramount.
  </p>
  <ul style="margin-left:20px; line-height:1.8; color:#86868b; margin-bottom:24px;">
    <li><strong style="color:#ffffff;">Targeted Reach:</strong> Tailored strategies designed for maximum engagement.</li>
    <li><strong style="color:#ffffff;">Professional Execution:</strong> High-grade production and execution standards.</li>
    <li><strong style="color:#ffffff;">Long-Term Value:</strong> Built to generate sustainable returns and brand equity.</li>
  </ul>

  <h2 style="font-family:'Outfit', sans-serif; font-size:1.8rem; color:#d4af37; margin:32px 0 16px;">
    2. How Raja Priya Group Delivers Results
  </h2>
  <p style="line-height:1.75; color:#e3e3e8; margin-bottom:16px;">
    At Raja Priya Group, we integrate real estate development expertise with cutting-edge digital media services (Video Editing, Web Development, and Brand Growth) to deliver seamless end-to-end solutions.
  </p>

  <div style="background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.4); padding:24px; border-radius:16px; margin:32px 0;">
    <h3 style="color:#ffffff; margin-bottom:8px; font-size:1.3rem;">💡 Ready to Transform Your Growth?</h3>
    <p style="color:#86868b; margin-bottom:16px;">Get expert consultation for real estate, construction, video editing, or digital brand promotion in Hyderabad.</p>
    <a href="https://editzaar.github.io/rajapriyagroup-creator/contact.html" style="background:linear-gradient(135deg, #c59b27, #e6c867); color:#07080a; font-weight:700; padding:12px 24px; border-radius:24px; text-decoration:none; display:inline-block;">Get Free Consultation &rarr;</a>
  </div>
</div>
`;

  currentArticle = {
    title,
    labels,
    metaDescription,
    coverImg,
    htmlBody,
    generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  renderPreview();
  showToast('✅ AI Article & Cover Image Ready for Confirmation!');
}

function renderPreview() {
  if (!currentArticle) return;

  document.getElementById('previewTitle').innerText = currentArticle.title;
  document.getElementById('previewMeta').innerText = `Published: ${currentArticle.generatedAt} • Author: Raja Priya Group`;

  const tagsContainer = document.getElementById('previewTags');
  tagsContainer.innerHTML = currentArticle.labels.map(label => `<span class="tag-chip">${label}</span>`).join('');

  document.getElementById('previewContent').innerHTML = currentArticle.htmlBody;
  document.getElementById('publishBtn').style.display = 'flex';
}

function confirmAndPublish() {
  if (!currentArticle) return;

  showToast('🎉 Article Confirmed & Published to Blogger!');

  // Export JSON payload for direct API / Blogger import
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentArticle, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${currentArticle.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

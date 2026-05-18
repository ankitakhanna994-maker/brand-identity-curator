import axios from 'axios';
import * as cheerio from 'cheerio';
import nodemailer from 'nodemailer';

// Initialize Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Define all sources to monitor
const sources = {
  brandIdentity: {
    sources: [
      { name: 'The Brand Identity', url: 'https://the-brandidentity.com', selector: 'article' },
      { name: 'Pentagram', url: 'https://www.pentagram.com/brand-identity', selector: '.project-card' },
      { name: 'Dezeen', url: 'https://www.dezeen.com/tag/branding/', selector: 'article' },
      { name: 'Creative Boom', url: 'https://www.creativeboom.com/design/branding/', selector: '.article' },
    ],
    articlesPerDay: 7,
    sendTime: '07:00',
    emailSubject: '7 Brand Identity Case Studies to Study',
  },
};

// Function to scrape articles from a source
async function scrapeSource(sourceConfig) {
  try {
    const response = await axios.get(sourceConfig.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const articles = [];

    $(sourceConfig.selector).slice(0, 15).each((index, element) => {
      const title = $(element).find('h2, h3, a').first().text().trim();
      const link = $(element).find('a').first().attr('href');

      // Handle relative URLs
      let fullUrl = link;
      if (link && !link.startsWith('http')) {
        const baseUrl = new URL(sourceConfig.url).origin;
        fullUrl = baseUrl + (link.startsWith('/') ? link : '/' + link);
      }

      if (title && fullUrl) {
        articles.push({
          title: title.substring(0, 100),
          url: fullUrl,
          source: sourceConfig.name,
        });
      }
    });

    return articles;
  } catch (error) {
    console.error(`Error scraping ${sourceConfig.name}:`, error.message);
    return [];
  }
}

// Function to curate articles (simple scoring system - you can make this smarter)
function curateArticles(allArticles, count) {
  // Filter for articles that likely contain "case study", "identity", "branding", "design system"
  const keywordScores = {
    'case study': 5,
    'identity': 4,
    'branding': 4,
    'design system': 5,
    'visual identity': 5,
    'brand strategy': 4,
    'rebranding': 3,
    'logo': 2,
  };

  const scoredArticles = allArticles.map((article) => {
    let score = 0;
    const titleLower = article.title.toLowerCase();

    Object.entries(keywordScores).forEach(([keyword, points]) => {
      if (titleLower.includes(keyword)) {
        score += points;
      }
    });

    return { ...article, score };
  });

  // Sort by score (highest first) and return top N
  return scoredArticles.sort((a, b) => b.score - a.score).slice(0, count);
}

// Function to format and send email
async function sendEmail(articles, topic) {
  const topicConfig = sources[topic];

  if (!articles || articles.length === 0) {
    console.log(`No articles found for ${topic}`);
    return;
  }

  // Format articles as a clean list
  let emailBody = `Good morning! Here are ${articles.length} brand identity case studies for you to study today:\n\n`;

  articles.forEach((article, index) => {
    emailBody += `${index + 1}. ${article.title}\n`;
    emailBody += `   ${article.url}\n`;
    emailBody += `   Source: ${article.source}\n\n`;
  });

  emailBody += `---\n`;
  emailBody += `Generated at ${new Date().toLocaleString()}\n`;
  emailBody += `Next digest tomorrow at 7:00 AM IST`;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: topicConfig.emailSubject,
      text: emailBody,
    });

    console.log(`✅ Email sent for ${topic} with ${articles.length} articles`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Main handler function
export default async function handler(req, res) {
  // Only accept POST requests or scheduled triggers
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 Starting curator job...');

    // Get current time in IST
    const now = new Date();
    const istTime = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    console.log(`Current IST time: ${istTime}`);

    // Process each topic
    for (const [topicKey, topicConfig] of Object.entries(sources)) {
      console.log(`\n📚 Processing topic: ${topicKey}`);

      // Scrape all sources for this topic
      let allArticles = [];
      for (const source of topicConfig.sources) {
        console.log(`  Scraping ${source.name}...`);
        const articles = await scrapeSource(source);
        allArticles = allArticles.concat(articles);
        console.log(`  Found ${articles.length} articles from ${source.name}`);
      }

      console.log(`  Total articles found: ${allArticles.length}`);

      // Curate the best ones
      const curatedArticles = curateArticles(allArticles, topicConfig.articlesPerDay);
      console.log(`  Curated to ${curatedArticles.length} top articles`);

      // Send email
      await sendEmail(curatedArticles, topicKey);
    }

    res.status(200).json({
      success: true,
      message: 'Curator job completed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Curator job failed:', error);
    res.status(500).json({
      error: 'Curator job failed',
      message: error.message,
    });
  }
}

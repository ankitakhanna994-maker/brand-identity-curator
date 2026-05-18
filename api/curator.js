import axios from 'axios';
import sgMail from '@sendgrid/mail';
import xml2js from 'xml2js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://www.underconsideration.com/brandnew/feed/', { timeout: 10000 });
    const parser = new xml2js.Parser();
    const data = await parser.parseStringPromise(response.data);
    const items = data.rss?.channel?.[0]?.item || [];
    
    const articles = items.slice(0, 7).map(item => ({
      title: (item.title?.[0] || '').substring(0, 100),
      url: item.link?.[0] || '',
    })).filter(a => a.title && a.url);

    if (articles.length > 0) {
      let body = 'Brand Identity Case Studies:\n\n';
      articles.forEach((a, i) => { body += `${i + 1}. ${a.title}\n${a.url}\n\n`; });
      
      await sgMail.send({
        to: process.env.GMAIL_USER,
        from: process.env.GMAIL_USER,
        subject: `Brand Studies ${new Date().toDateString()}`,
        text: body,
      });
    }
    
    res.json({ success: true, articles: articles.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

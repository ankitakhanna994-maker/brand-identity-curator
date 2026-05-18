// To run locally: node test-local.js
// Make sure to create .env file with GMAIL_USER and GMAIL_APP_PASSWORD first

import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing Brand Identity Curator...\n');

// Check environment variables
console.log('✅ Environment Variables:');
console.log(`   GMAIL_USER: ${process.env.GMAIL_USER || '❌ NOT SET'}`);
console.log(`   GMAIL_APP_PASSWORD: ${process.env.GMAIL_APP_PASSWORD ? '✅ SET' : '❌ NOT SET'}`);

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.log('\n⚠️  Please set environment variables in .env file first');
  process.exit(1);
}

console.log('\n📚 Sources to monitor:');
console.log('   1. The Brand Identity (the-brandidentity.com)');
console.log('   2. Pentagram (pentagram.com)');
console.log('   3. Dezeen (dezeen.com)');
console.log('   4. Creative Boom (creativeboom.com)');

console.log('\n⏰ Schedule:');
console.log('   Daily at 7:00 AM IST');
console.log('   Email to: ' + process.env.GMAIL_USER);

console.log('\n✅ Setup looks good!');
console.log('\nNext steps:');
console.log('   1. Create GitHub repository');
console.log('   2. Push these files to GitHub');
console.log('   3. Connect to Vercel');
console.log('   4. Add environment variables in Vercel dashboard');
console.log('   5. Deploy!');

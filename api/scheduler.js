import axios from 'axios';

// This function runs on a schedule (you'll set up via Vercel Cron)
export default async function handler(req, res) {
  try {
    // Get current time in IST
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();

    console.log(`⏰ Scheduler check at ${hour}:${String(minute).padStart(2, '0')} IST`);

    // Trigger curator if it's between 7:00 AM and 7:05 AM IST
    if (hour === 7 && minute < 5) {
      console.log('🎯 Time to run curator!');

      const curatorUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/curator`;

      const response = await axios.post(curatorUrl, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      });

      return res.status(200).json({
        message: 'Curator triggered successfully',
        curatorResponse: response.data,
      });
    } else {
      return res.status(200).json({
        message: `Scheduler waiting. Current time: ${hour}:${String(minute).padStart(2, '0')} IST`,
        nextRun: '07:00 IST',
      });
    }
  } catch (error) {
    console.error('Scheduler error:', error.message);
    return res.status(500).json({
      error: 'Scheduler failed',
      message: error.message,
    });
  }
}

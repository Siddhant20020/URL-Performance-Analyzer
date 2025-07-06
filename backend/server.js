// backend/server.js
const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const cors = require('cors');

const app = express();

// Only enable CORS in development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

app.use(express.json());

// Serve React build files in production
app.use(express.static(path.join(__dirname, 'public')));

app.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );

    let totalSize = 0;
    let requestCount = 0;

    page.on('response', async (response) => {
      try {
        const buffer = await response.buffer();
        totalSize += buffer.length;
        requestCount++;
      } catch (_) {}
    });

    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    const endTime = Date.now();

    res.json({
      loadTime: ((endTime - startTime) / 1000).toFixed(2),
      pageSize: (totalSize / 1024).toFixed(2),
      requestCount,
    });
  } catch (err) {
    console.error('Error analyzing URL:', err);
    res.status(500).json({
      error: 'Failed to analyze URL. Some sites block bots or URL is invalid.',
      details: err.message,
    });
  } finally {
    if (browser) await browser.close();
  }
});

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

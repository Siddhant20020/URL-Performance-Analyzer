// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { chromium } = require('playwright');  // Playwright Chromium browser

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files (built React app)
app.use(express.static(path.join(__dirname, 'public')));

app.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  let browser;
  try {
    browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    let totalSize = 0;
    let requestCount = 0;

    page.on('response', async (response) => {
      try {
        const buffer = await response.body();
        totalSize += buffer.length;
        requestCount++;
      } catch (e) {
        // ignore errors (some responses may not have body)
      }
    });

    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    const endTime = Date.now();

    await browser.close();

    res.json({
      loadTime: ((endTime - startTime) / 1000).toFixed(2),
      pageSize: (totalSize / 1024).toFixed(2),
      requestCount,
    });
  } catch (err) {
    if (browser) await browser.close();
    console.error('Error analyzing URL:', err);
    res.status(500).json({
      error: 'Failed to analyze URL. Some websites block automated tools or the URL might be invalid.',
      details: err.message,
    });
  }
});

// Serve React app for any other route (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

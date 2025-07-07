const express = require('express');
const { chromium } = require('playwright');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    let totalSize = 0;
    let requestCount = 0;

    page.on('response', async (response) => {
      try {
        const buffer = await response.body();
        totalSize += buffer.length;
        requestCount++;
      } catch (_) { }
    });

    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle' });
    const endTime = Date.now();

    res.json({
      loadTime: ((endTime - startTime) / 1000).toFixed(2),
      pageSize: (totalSize / 1024).toFixed(2),
      requestCount,
    });
  } catch (err) {
    console.error('Error analyzing URL:', err);
    res.status(500).json({
      error: 'Failed to analyze URL.',
      details: err.message,
    });
  } finally {
    if (browser) await browser.close();
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

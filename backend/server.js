const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// React Router fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
      } catch { }
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
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to analyze URL', details: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

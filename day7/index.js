const express = require('express');
const shortid = require('shortid');
const app = express();
const port = process.env.PORT || 3000;

// In-memory store for URLs (for demonstration purposes)
const urls = {};

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle GET requests for shortened URLs
app.get('/:shortUrl', (req, res) => {
  const longUrl = urls[req.params.shortUrl];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

// Handle POST requests for creating new shortened URLs
app.use(express.json());
app.post('/create', (req, res) => {
  const longUrl = req.body.longUrl;
  const shortUrl = shortid.generate();
  urls[shortUrl] = longUrl;
  res.json({ shortUrl });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
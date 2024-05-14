const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Serve static files from each game directory
app.use(express.static('future'));
app.use(express.static('past'));
app.use(express.static('present'));

// Optionally, serve other static assets like shared JS/CSS/images if needed
// app.use(express.static('public'));

// Route for the main index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Routes for each game - serve the index.html for each specific game
app.get('/future', (req, res) => {
  res.sendFile(path.join(__dirname, 'future', 'future.html'));
});

app.get('/past', (req, res) => {
  res.sendFile(path.join(__dirname, 'past', 'past.html'));
});

app.get('/present', (req, res) => {
  res.sendFile(path.join(__dirname, 'present', 'present.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

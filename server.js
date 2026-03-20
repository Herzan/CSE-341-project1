const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 3001;

// Parse JSON bodies
app.use(bodyParser.json());

// ────────────────────────────────────────────────
// Debug: Log raw body for POST/PUT to catch bad JSON early
// ────────────────────────────────────────────────
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    let rawBody = '';
    req.on('data', chunk => { rawBody += chunk; });
    req.on('end', () => {
      if (rawBody) {
        console.log(`[RAW BODY] ${req.method} ${req.path}`);
        console.log(rawBody.slice(0, 400)); // limit to avoid flooding console
        if (rawBody.length > 400) console.log('... (truncated)');
        console.log('──────────────────────────────');
      }
      // Put body back so body-parser can read it again
      req.rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
});

// CORS configuration (looks good already)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Catch JSON parse errors cleanly (very important for your current issue)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.log(`[JSON PARSE ERROR] ${req.method} ${req.path}`);
    console.log('Detail:', err.message);
    return res.status(400).json({
      error: 'Invalid JSON in request body',
      detail: err.message,
      hint: 'Make sure to use double quotes around keys and string values'
    });
  }
  next(err);
});

// Routes
app.use('/', require('./routes'));

// Fallback - 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler (last resort)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start database and server
mongodb.initDb((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});
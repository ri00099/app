/**
 * SitePilot AI — Express backend server
 *
 * Provides a REST API for running website audits.
 * The audit engine is heuristic-based for this MVP, but the
 * architecture is designed so the engine can be swapped for
 * Lighthouse, PageSpeed Insights, or an LLM API without changing
 * the API surface.
 */

const express = require('express');
const cors = require('cors');
const { runAudit, normalizeUrl } = require('./auditEngine');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/**
 * POST /api/audit
 * Body: { "url": "https://example.com" }
 * Response: AuditResult JSON
 */
app.post('/api/audit', (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'URL is required.' });
  }

  const normalized = normalizeUrl(url);
  try {
    new URL(normalized);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  try {
    const result = runAudit(url);
    res.json(result);
  } catch (err) {
    console.error('Audit error:', err);
    res.status(500).json({ error: 'Failed to run audit.' });
  }
});

/**
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SitePilot AI' });
});

app.listen(PORT, () => {
  console.log(`SitePilot AI server running on http://localhost:${PORT}`);
});

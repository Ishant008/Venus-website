const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const CLARITY_API_TOKEN = process.env.CLARITY_API_TOKEN;

// @desc    Fetch aggregated traffic/engagement insights from Microsoft Clarity's
//          Data Export API. This runs server-side so the API token is never
//          exposed to the browser. Clarity's free tier only allows numOfDays
//          between 1-3, and roughly 10 requests/project/day — so the frontend
//          should cache this rather than poll it repeatedly.
// @route   GET /api/analytics/clarity?numOfDays=3
// @access  Private/Admin
const getClarityInsights = asyncHandler(async (req, res) => {
  if (!CLARITY_API_TOKEN) {
    throw new ApiError(400, 'Microsoft Clarity is not configured — set CLARITY_API_TOKEN in the backend .env');
  }

  const numOfDays = Math.min(3, Math.max(1, parseInt(req.query.numOfDays, 10) || 3));

  const response = await fetch(
    `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=${numOfDays}`,
    { headers: { Authorization: `Bearer ${CLARITY_API_TOKEN}` } }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new ApiError(
      response.status === 429 ? 429 : 502,
      response.status === 429
        ? 'Clarity API rate limit reached — it allows about 10 requests per project per day. Try again later.'
        : `Clarity API error (${response.status}): ${text || 'no additional details'}`
    );
  }

  const data = await response.json();
  res.json({ success: true, numOfDays, data });
});

module.exports = { getClarityInsights };
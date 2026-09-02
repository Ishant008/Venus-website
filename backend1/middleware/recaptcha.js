const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const MIN_SCORE = parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5');

/**
 * Verifies a Google reCAPTCHA v3 token against Google's siteverify API.
 * If RECAPTCHA_SECRET_KEY isn't set in .env, this is a silent no-op —
 * so the endpoint keeps working for setups that haven't configured
 * reCAPTCHA yet.
 */
const verifyRecaptcha = asyncHandler(async (req, res, next) => {
  if (!RECAPTCHA_SECRET) return next(); // not configured — skip

  const token = req.body?.recaptchaToken;
  if (!token) {
    throw new ApiError(400, 'reCAPTCHA verification failed — please try again');
  }

  const params = new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token });
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const data = await response.json();

  if (!data.success || (typeof data.score === 'number' && data.score < MIN_SCORE)) {
    throw new ApiError(403, 'This request was flagged as automated. Please try again.');
  }

  next();
});

module.exports = { verifyRecaptcha };
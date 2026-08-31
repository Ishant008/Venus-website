// Lightweight, fully offline SEO helper — no external API, no cost.
// Inspired by how tools like Yoast SEO / Rank Math score WordPress content.

const STOPWORDS = new Set(
  `a about above after again against all am an and any are aren't as at be because been before
   being below between both but by can't cannot could couldn't did didn't do does doesn't doing
   don't down during each few for from further had hadn't has hasn't have haven't having he he'd
   he'll he's her here here's hers herself him himself his how how's i i'd i'll i'm i've if in into
   is isn't it it's its itself let's me more most mustn't my myself no nor not of off on once only
   or other ought our ours ourselves out over own same shan't she she'd she'll she's should
   shouldn't so some such than that that's the their theirs them themselves then there there's
   these they they'd they'll they're they've this those through to too under until up very was
   wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while
   who who's whom why why's with won't would wouldn't you you'd you'll you're you've your yours
   yourself yourselves is are was were will can also with new`
    .split(/\s+/)
    .filter(Boolean)
);

const stripHtml = (html = '') => html.replace(/<[^>]+>/g, ' ');

const tokenize = (text) =>
  stripHtml(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

/**
 * Suggests SEO keywords from the article's title, summary, and body —
 * ranks single words and two-word phrases by frequency (title/summary
 * words are weighted higher since they carry more SEO signal).
 */
export function suggestKeywords({ title = '', summary = '', body = '' }, max = 8) {
  const scores = new Map();

  const addTokens = (text, weight) => {
    const words = tokenize(text);
    words.forEach((w) => scores.set(w, (scores.get(w) || 0) + weight));
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      scores.set(phrase, (scores.get(phrase) || 0) + weight * 1.5); // phrases rank higher
    }
  };

  addTokens(title, 4);
  addTokens(summary, 2);
  addTokens(body, 1);

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([phrase]) => phrase)
    .filter((phrase, i, arr) => !arr.slice(0, i).some((p) => p.includes(phrase) || phrase.includes(p)))
    .slice(0, max);
}

const wordCount = (text) => tokenize(text).length + stripHtml(text).split(/\s+/).filter(Boolean).length - tokenize(text).length;

const countOccurrences = (haystack, needle) => {
  if (!needle) return 0;
  const re = new RegExp(needle.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return (stripHtml(haystack).match(re) || []).length;
};

const status = (ok, warn = false) => (ok ? 'good' : warn ? 'ok' : 'bad');

/**
 * Runs a WordPress-plugin-style (Yoast/Rank Math) SEO + readability
 * check against the article fields. Everything runs locally in the
 * browser — no API calls, no cost.
 */
export function analyzeSeo({ title = '', summary = '', body = '', focusKeyword = '', imagesWithAlt = 0, totalImages = 0 }) {
  const checks = [];
  const bodyText = stripHtml(body);
  const totalWords = bodyText.split(/\s+/).filter(Boolean).length;
  const sentences = bodyText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLength = sentences.length ? totalWords / sentences.length : 0;
  const keyword = focusKeyword.split(',')[0]?.trim().toLowerCase();

  // Title length
  checks.push({
    id: 'title-length',
    label: 'Title length',
    status: status(title.length >= 40 && title.length <= 60, title.length > 0),
    message: `${title.length} characters (ideal: 40–60)`,
  });

  // Meta/summary description length
  checks.push({
    id: 'summary-length',
    label: 'Summary / meta description length',
    status: status(summary.length >= 120 && summary.length <= 160, summary.length > 0),
    message: `${summary.length} characters (ideal: 120–160)`,
  });

  // Content length
  checks.push({
    id: 'content-length',
    label: 'Content length',
    status: status(totalWords >= 300, totalWords >= 150),
    message: `${totalWords} words (aim for 300+ for strong SEO)`,
  });

  if (keyword) {
    const inTitle = title.toLowerCase().includes(keyword);
    const inSummary = summary.toLowerCase().includes(keyword);
    const inFirst100 = bodyText.toLowerCase().split(/\s+/).slice(0, 100).join(' ').includes(keyword);
    const density = totalWords ? (countOccurrences(body, keyword) / totalWords) * 100 : 0;

    checks.push({
      id: 'keyword-title',
      label: 'Focus keyword in title',
      status: status(inTitle),
      message: inTitle ? `"${keyword}" found in title` : `"${keyword}" is missing from the title`,
    });
    checks.push({
      id: 'keyword-summary',
      label: 'Focus keyword in summary',
      status: status(inSummary),
      message: inSummary ? `"${keyword}" found in summary` : `"${keyword}" is missing from the summary`,
    });
    checks.push({
      id: 'keyword-intro',
      label: 'Focus keyword in first 100 words',
      status: status(inFirst100),
      message: inFirst100 ? 'Keyword appears early in the article' : 'Add the keyword within the first paragraph',
    });
    checks.push({
      id: 'keyword-density',
      label: 'Keyword density',
      status: status(density >= 0.5 && density <= 2.5, density > 0),
      message: `${density.toFixed(2)}% (ideal: 0.5%–2.5%)`,
    });
  } else {
    checks.push({
      id: 'keyword-missing',
      label: 'Focus keyword',
      status: 'bad',
      message: 'No SEO keyword set — add one so we can check keyword placement',
    });
  }

  // Readability — average sentence length
  checks.push({
    id: 'readability',
    label: 'Readability (avg. sentence length)',
    status: status(avgSentenceLength > 0 && avgSentenceLength <= 20, avgSentenceLength <= 25),
    message: `${avgSentenceLength.toFixed(1)} words/sentence (aim for ≤20)`,
  });

  // Images
  checks.push({
    id: 'has-images',
    label: 'Article images',
    status: status(totalImages >= 1),
    message: totalImages >= 1 ? `${totalImages} image(s) attached` : 'Add at least one image — articles with images perform better',
  });
  if (totalImages > 0) {
    checks.push({
      id: 'image-alt',
      label: 'Image alt text (accessibility + image SEO)',
      status: status(imagesWithAlt === totalImages, imagesWithAlt > 0),
      message: `${imagesWithAlt}/${totalImages} images have alt text`,
    });
  }

  const scoreValue = checks.reduce((sum, c) => sum + (c.status === 'good' ? 1 : c.status === 'ok' ? 0.5 : 0), 0);
  const score = Math.round((scoreValue / checks.length) * 100);

  return { score, checks };
}   
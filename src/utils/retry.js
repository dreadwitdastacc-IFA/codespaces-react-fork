/**
 * Exponential backoff with jitter helper.
 * @param {Function} fn - async function to execute
 * @param {Object} options
 * @param {number} options.retries - max retries
 * @param {number} options.baseMs - base delay in ms
 * @param {number} options.maxMs - max delay in ms
 * @param {Function} options.shouldRetry - function(error) => boolean
 */
async function retryWithBackoff(fn, options = {}) {
  const {
    retries = 5,
    baseMs = 200,
    maxMs = 10000,
    shouldRetry = (err) => err && (err.code === 429 || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT'),
  } = options;

  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      if (attempt > retries || !shouldRetry(err)) throw err;
      // Exponential backoff with full jitter: sleep random(0, min(max, base * 2^attempt))
      const exp = Math.min(maxMs, baseMs * Math.pow(2, attempt));
      const delay = Math.floor(Math.random() * exp);
      console.warn(`Retry attempt ${attempt} after ${delay}ms due to`, err.message || err);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

module.exports = { retryWithBackoff };

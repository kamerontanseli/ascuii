// utils/chat.js
// Utility for calling OpenRouter chat completions API
const axios = require('axios');

/**
 * Calls OpenRouter chat completions API.
 * @param {Object} opts
 * @param {string} opts.model - Model name (e.g. 'openai/gpt-4.1-mini')
 * @param {Array} opts.messages - Array of message objects
 * @param {boolean} [opts.stream] - Whether to stream the response
 * @param {Object} [opts.headers] - Additional headers
 * @param {Object} [opts.extra] - Any extra axios config
 * @returns {Promise<import('axios').AxiosResponse>} Axios response (stream if stream: true)
 */
async function chat({ model, messages, stream = false, headers = {}, extra = {}, axiosInstance } = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('Missing OPENROUTER_API_KEY');
  const ax = axiosInstance || axios;
  return ax({
    method: 'post',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    data: {
      model,
      messages,
      stream,
    },
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    responseType: stream ? 'stream' : 'json',
    validateStatus: () => true,
    ...extra,
  });
}

module.exports = { chat };

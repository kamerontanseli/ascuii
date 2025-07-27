// Facade for streaming OpenRouter AI responses to a writable stream (e.g., Express response)
// Usage: streamOpenRouter({ axios, req, res, data, headers })

/**
 * Streams OpenRouter AI response to a writable stream (e.g., Express response).
 * Handles chunked SSE, error handling, and code block cleanup.
 * @param {Object} opts
 * @param {import('axios')} opts.axios - Axios instance
 * @param {Object} opts.res - Express response (writable stream)
 * @param {Object} opts.axiosConfig - Axios config for the OpenRouter request
 * @param {function=} opts.onContent - Optional callback for each content chunk
 */
/**
 * Processes incoming SSE chunked data from OpenRouter and writes to response.
 * @param {Object} opts
 * @param {string} chunk - Incoming data chunk
 * @param {Object} res - Express response
 * @param {function=} onContent - Optional callback for each content chunk
 * @param {string} buffer - Buffer string (will be mutated)
 * @returns {string} Updated buffer
 */
function processOpenRouterChunk({ chunk, res, onContent, buffer }) {
  buffer += chunk.toString();
  let lineEnd;
  while ((lineEnd = buffer.indexOf('\n')) !== -1) {
    let line = buffer.slice(0, lineEnd).trim();
    buffer = buffer.slice(lineEnd + 1);
    if (!line || line.startsWith(':')) continue; // skip keepalive/comments
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') {
        res.end();
        return '';
      }
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          // Remove markdown code block markers if present
          const clean = content.replace(/^```(?:ascii)?\n?/gm, '').replace(/\n?```$/gm, '');
          res.write(clean);
          if (onContent) onContent(clean);
        }
      } catch (e) {
        // ignore JSON parse errors
      }
    }
  }
  return buffer;
}

function streamOpenRouter({ axios, res, axiosConfig, onContent }) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  axios(axiosConfig)
    .then(openrouterRes => {
      let buffer = '';
      openrouterRes.data.on('data', (chunk) => {
        buffer = processOpenRouterChunk({ chunk, res, onContent, buffer });
      });
      openrouterRes.data.on('end', () => {
        res.end();
      });
      openrouterRes.data.on('error', (err) => {
        console.error(err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to process image with AI (stream error).' });
        } else {
          res.end();
        }
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to process image with AI.' });
    });
}

module.exports = { streamOpenRouter, processOpenRouterChunk };

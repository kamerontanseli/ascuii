// utils/validate.js

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/gif'];

/**
 * Validates file upload and required fields for ascii art endpoints.
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Object} opts
 * @param {boolean} [opts.requireAscii] - Require req.body.ascii
 * @param {boolean} [opts.requireMessage] - Require req.body.message
 * @returns {boolean} true if validation failed and response sent, false if valid
 */
function validateUpload(req, res, { requireAscii = false, requireMessage = false } = {}) {
  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded.' });
    return true;
  }
  if (!ALLOWED_MIMETYPES.includes(req.file.mimetype)) {
    res.status(400).json({ error: 'Invalid image format.' });
    return true;
  }
  if (requireAscii && !req.body.ascii) {
    res.status(400).json({ error: 'Missing ASCII art.' });
    return true;
  }
  if (requireMessage && !req.body.message) {
    res.status(400).json({ error: 'Missing message.' });
    return true;
  }
  return false;
}

module.exports = { validateUpload };

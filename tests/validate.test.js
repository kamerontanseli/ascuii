import { describe, it, expect } from 'vitest';
import { validateUpload } from '../utils/validate';

describe('validateUpload', () => {
  function makeReqRes({ file = undefined, ascii, message, mimetype = 'image/png' } = {}) {
    const req = { file: file ? { mimetype } : undefined, body: {} };
    if (ascii !== undefined) req.body.ascii = ascii;
    if (message !== undefined) req.body.message = message;
    let statusCode = undefined;
    let jsonArg = undefined;
    const res = {
      status(code) { statusCode = code; return this; },
      json(arg) { jsonArg = arg; return this; }
    };
    return { req, res, getStatus: () => statusCode, getJson: () => jsonArg };
  }

  it('returns true and sends error if file missing', () => {
    const { req, res, getStatus, getJson } = makeReqRes();
    const result = validateUpload(req, res);
    expect(result).toBe(true);
    expect(getStatus()).toBe(400);
    expect(getJson()).toEqual({ error: 'No image uploaded.' });
  });

  it('returns true and sends error if mimetype invalid', () => {
    const { req, res, getStatus, getJson } = makeReqRes({ file: true, mimetype: 'image/svg+xml' });
    const result = validateUpload(req, res);
    expect(result).toBe(true);
    expect(getStatus()).toBe(400);
    expect(getJson()).toEqual({ error: 'Invalid image format.' });
  });

  it('returns true and sends error if ascii required and missing', () => {
    const { req, res, getStatus, getJson } = makeReqRes({ file: true });
    const result = validateUpload(req, res, { requireAscii: true });
    expect(result).toBe(true);
    expect(getStatus()).toBe(400);
    expect(getJson()).toEqual({ error: 'Missing ASCII art.' });
  });

  it('returns true and sends error if message required and missing', () => {
    const { req, res, getStatus, getJson } = makeReqRes({ file: true, ascii: 'foo' });
    const result = validateUpload(req, res, { requireAscii: true, requireMessage: true });
    expect(result).toBe(true);
    expect(getStatus()).toBe(400);
    expect(getJson()).toEqual({ error: 'Missing message.' });
  });

  it('returns false if all valid and required fields present', () => {
    const { req, res, getStatus, getJson } = makeReqRes({ file: true, ascii: 'foo', message: 'bar' });
    const result = validateUpload(req, res, { requireAscii: true, requireMessage: true });
    expect(result).toBe(false);
    expect(getStatus()).toBe(undefined);
    expect(getJson()).toBe(undefined);
  });
});

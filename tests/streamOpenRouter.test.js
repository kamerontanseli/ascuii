import { describe, it, expect, vi } from 'vitest';
import { processOpenRouterChunk } from '../utils/streamOpenRouter';

// processOpenRouterChunk tests

describe('processOpenRouterChunk', () => {
  it('skips keepalive and comments', () => {
    let buffer = '';
    const res = { write: vi.fn(), end: vi.fn() };
    const chunk = Buffer.from(':keepalive\n:comment\n');
    const out = processOpenRouterChunk({ chunk, res, buffer });
    expect(out).toBe('');
    expect(res.write).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
  });

  it('ends response on [DONE]', () => {
    let buffer = '';
    const res = { write: vi.fn(), end: vi.fn() };
    const chunk = Buffer.from('data: [DONE]\n');
    const out = processOpenRouterChunk({ chunk, res, buffer });
    expect(res.end).toHaveBeenCalled();
    expect(out).toBe('');
  });

  it('writes cleaned content and calls onContent', () => {
    let buffer = '';
    const res = { write: vi.fn(), end: vi.fn() };
    const content = '```ascii\nfoo\n```';
    const data = JSON.stringify({ choices: [{ delta: { content } }] });
    const chunk = Buffer.from(`data: ${data}\n`);
    const onContent = vi.fn();
    const out = processOpenRouterChunk({ chunk, res, buffer, onContent });
    expect(res.write).toHaveBeenCalledWith('foo\n');
    expect(onContent).toHaveBeenCalledWith('foo\n');
    expect(out).toBe('');
  });

  it('ignores JSON parse errors', () => {
    let buffer = '';
    const res = { write: vi.fn(), end: vi.fn() };
    const chunk = Buffer.from('data: notjson\n');
    expect(() => processOpenRouterChunk({ chunk, res, buffer })).not.toThrow();
  });

  it('returns remaining buffer if no newline', () => {
    let buffer = 'partial';
    const res = { write: vi.fn(), end: vi.fn() };
    const chunk = Buffer.from('data: ');
    const out = processOpenRouterChunk({ chunk, res, buffer });
    expect(out).toContain('partial');
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { chat } from '../utils/chat';

describe('chat()', () => {
  let axiosMock;
  beforeEach(() => {
    axiosMock = vi.fn();
    process.env.OPENROUTER_API_KEY = 'test-key';
  });

  it('calls axios with correct params and returns response', async () => {
    const fakeResponse = { data: { foo: 'bar' } };
    axiosMock.mockResolvedValue(fakeResponse);
    const model = 'test-model';
    const messages = [{ role: 'user', content: 'hi' }];
    const res = await chat({ model, messages, stream: false, axiosInstance: axiosMock });
    expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({
      method: 'post',
      url: expect.stringContaining('openrouter.ai'),
      data: expect.objectContaining({ model, messages, stream: false }),
      headers: expect.objectContaining({ Authorization: expect.any(String) })
    }));
    expect(res).toBe(fakeResponse);
  });

  it('throws if API key is missing', async () => {
    const oldKey = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    await expect(chat({ model: 'm', messages: [], axiosInstance: axiosMock })).rejects.toThrow('Missing OPENROUTER_API_KEY');
    process.env.OPENROUTER_API_KEY = oldKey;
  });
});

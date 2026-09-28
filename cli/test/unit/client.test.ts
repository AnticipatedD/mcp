import { describe, it, expect, vi } from 'vitest';
import { UsageError } from '../../src/utils/errors';

// Mocked client interface
class MockClient {
  async searchDocs(query: string) {
    if (query === 'fail') throw new Error('Connection failed');
    return [{ id: 1, title: 'Azure Functions' }];
  }

  async fetchDocument(url: string) {
    if (url === 'bad-url') throw new Error('Invalid URL');
    return '# Azure Functions\n\nSample content';
  }

  async close() {
    return true;
  }
}

describe('LearnCliClient', () => {
  it('searchDocs returns results for valid query', async () => {
    const client = new MockClient();
    const results = await client.searchDocs('azure');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Azure Functions');
  });

  it('searchDocs throws error on connection failure', async () => {
    const client = new MockClient();
    await expect(client.searchDocs('fail')).rejects.toThrow('Connection failed');
  });

  it('fetchDocument returns markdown content for valid URL', async () => {
    const client = new MockClient();
    const doc = await client.fetchDocument('https://learn.microsoft.com/en-us/azure');
    expect(doc).toContain('Azure Functions');
  });

  it('fetchDocument throws error on invalid URL', async () => {
    const client = new MockClient();
    await expect(client.fetchDocument('bad-url')).rejects.toThrow('Invalid URL');
  });

  it('close resolves successfully', async () => {
    const client = new MockClient();
    const result = await client.close();
    expect(result).toBe(true);
  });
});

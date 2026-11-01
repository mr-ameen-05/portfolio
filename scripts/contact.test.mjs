import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { test } from 'node:test';

process.env.VERCEL = '1';
process.env.SEND_EMAIL = 'false';
process.env.GOOGLE_SHEET_WEBHOOK_URL = 'https://example.invalid/webhook';
const { default: handler } = await import('../api/server.js');

async function request(body, url = '/api/contact', method = 'POST', parsed = false) {
  const req = Readable.from(parsed ? [] : [JSON.stringify(body)]);
  Object.assign(req, { url, method, headers: { host: 'localhost' }, socket: {} });
  if (parsed) req.body = body;
  const res = {
    writeHead(status, headers) { this.status = status; this.headers = headers; },
    end(value) { this.body = JSON.parse(value); },
  };
  await handler(req, res);
  return res;
}

test('serverless contact validates and only confirms durable delivery', async () => {
  assert.equal(typeof handler, 'function');
  assert.equal((await request({})).status, 400);
  const valid = { name: 'Jane Smith', email: 'jane@acme.org', company: 'Acme', description: 'Review our application' };
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => ({ ok: false, status: 503 });
    const failed = await request(valid);
    assert.equal(failed.status, 503);
    assert.equal(failed.body.success, false);
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: false }) });
    assert.equal((await request(valid)).status, 503);
    globalThis.fetch = async (_url, options) => {
      assert.ok(options.signal);
      return { ok: true, json: async () => ({ success: true }) };
    };
    const saved = await request(valid, '/api/contact', 'POST', true);
    assert.equal(saved.status, 200);
    assert.equal(saved.body.sheet_saved, true);
    assert.equal(saved.headers['Cache-Control'], 'no-store');
    assert.equal((await request(null, '/api/contact', 'POST', true)).status, 400);
    assert.equal((await request('{invalid', '/api/contact', 'POST', true)).status, 400);
    assert.equal((await request({ description: 'a'.repeat(512 * 1024) }, '/api/contact', 'POST', true)).status, 400);
    assert.equal((await request({}, '/api/missing', 'GET')).status, 404);
    const health = await request({}, '/api/health', 'GET');
    assert.equal(health.status, 200);
    assert.equal(health.body.smtp, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

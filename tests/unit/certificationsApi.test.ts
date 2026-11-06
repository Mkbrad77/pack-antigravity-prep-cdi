import { describe, expect, it } from 'vitest';
import { createApiMiddleware } from '../../src/server/api';
import { LocalSqliteStore } from '../../src/server/db';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';

function simulateApiRequest(
  middleware: (req: IncomingMessage, res: ServerResponse) => Promise<void>,
  url: string,
  method = 'GET'
): Promise<{ status: number; body: any }> {
  return new Promise((resolve) => {
    const socket = new Socket();
    const req = new IncomingMessage(socket);
    req.url = url;
    req.method = method;

    let responseBody = '';
    let statusCode = 200;

    const res = new ServerResponse(req);
    res.end = (chunk?: any) => {
      if (chunk) responseBody += chunk;
      try {
        resolve({ status: statusCode, body: JSON.parse(responseBody) });
      } catch {
        resolve({ status: statusCode, body: responseBody });
      }
      return res;
    };
    res.setHeader = () => res;
    Object.defineProperty(res, 'statusCode', {
      set(val) {
        statusCode = val;
      },
      get() {
        return statusCode;
      },
    });

    middleware(req, res);
  });
}

describe('API Endpoints Certifications (/api/certifications/*)', () => {
  const store = new LocalSqliteStore(':memory:');
  const middleware = createApiMiddleware(store);

  it('GET /api/certifications/clf/chapters renvoie les 13 chapitres', async () => {
    const res = await simulateApiRequest(middleware, '/api/certifications/clf/chapters');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(13);
    expect(res.body[0].id).toBe('clf-01-concepts-cloud');
    expect(res.body[0].title).toContain('Concepts Fondamentaux');
  });

  it('GET /api/certifications/clf/chapters/clf-01-concepts-cloud renvoie le markdown', async () => {
    const res = await simulateApiRequest(
      middleware,
      '/api/certifications/clf/chapters/clf-01-concepts-cloud'
    );
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('clf-01-concepts-cloud');
    expect(res.body.content).toContain('Objectifs');
  });

  it('GET /api/certifications/clf/fiches renvoie 4 fiches', async () => {
    const res = await simulateApiRequest(middleware, '/api/certifications/clf/fiches');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  });

  it('GET /api/certifications/clf/questions renvoie 150 questions', async () => {
    const res = await simulateApiRequest(middleware, '/api/certifications/clf/questions');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(150);
  });

  it('GET /api/certifications/dea/questions renvoie 300 questions', async () => {
    const res = await simulateApiRequest(middleware, '/api/certifications/dea/questions');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(300);
  });

  it('GET /api/certifications/dbt/questions renvoie 150 questions', async () => {
    const res = await simulateApiRequest(middleware, '/api/certifications/dbt/questions');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(150);
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('static release contract', () => {
  it('rewrites only the demo route and sends unknown routes to the designed 404', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as {
      navigationFallback?: unknown;
      routes: { route: string; rewrite?: string }[];
      responseOverrides: Record<string, { rewrite: string }>;
    };
    expect(config.navigationFallback).toBeUndefined();
    expect(config.routes).toContainEqual(expect.objectContaining({ route: '/demo', rewrite: '/index.html' }));
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  });

  it('ships complete social, install, and legal-page metadata', () => {
    const index = readFileSync('index.html', 'utf8');
    expect(index).toContain('rel="canonical"');
    expect(index).toContain('property="og:image"');
    expect(index).toContain('name="twitter:card"');
    expect(index).toContain('rel="apple-touch-icon"');
    expect(index).toContain('href="/manifest.json"');
    for (const path of ['public/privacy/index.html', 'public/terms/index.html', 'public/404.html']) {
      const page = readFileSync(path, 'utf8');
      expect(page).toContain('<footer>');
      expect(page).toContain('Built by Param Factory');
    }
  });

  it('gives every declared claim exactly one tagged regression test', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as { id: string }[];
    const tests = readFileSync('tests/e2e/app.spec.ts', 'utf8');
    for (const { id } of claims) {
      expect(tests.match(new RegExp(`@claim:${id}`, 'g'))).toHaveLength(1);
    }
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('static release contract', () => {
  it('rewrites the direct demo route to its dedicated shell and sends unknown routes to the designed 404', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as {
      navigationFallback?: unknown;
      routes: { route: string; rewrite?: string }[];
      responseOverrides: Record<string, { rewrite: string }>;
    };
    expect(config.navigationFallback).toBeUndefined();
    expect(config.routes).toContainEqual(expect.objectContaining({ route: '/demo', rewrite: '/demo.html' }));
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  });

  it('ships complete social, install, legal-page, and 404 metadata', () => {
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
      for (const name of ['description', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
        expect(page).toContain(`name="${name}"`);
      }
      for (const name of ['og:type', 'og:title', 'og:description', 'og:url', 'og:image']) {
        expect(page).toContain(`property="${name}"`);
      }
      expect(page).toContain('rel="canonical"');
    }
  });

  it('ships a raw demo shell whose metadata identifies the demo', () => {
    const demo = readFileSync('demo.html', 'utf8');
    expect(demo).toContain('<title>Demo — House History Pack</title>');
    expect(demo).toContain('href="https://house-history-pack.sociobot.in/demo"');
    expect(demo).toContain('content="Demo — House History Pack"');
    expect(demo).toContain('content="https://house-history-pack.sociobot.in/demo"');
  });

  it('gives every declared claim exactly one tagged regression test', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as { id: string }[];
    const tests = readFileSync('tests/e2e/app.spec.ts', 'utf8');
    for (const { id } of claims) {
      expect(tests.match(new RegExp(`@claim:${id}`, 'g'))).toHaveLength(1);
    }
  });
});

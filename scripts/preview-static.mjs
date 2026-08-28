import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve('dist');
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1] || fallback;
};
const host = option('--host', '127.0.0.1');
const port = Number(option('--port', '4173'));
const types = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.xml': 'application/xml; charset=utf-8'
};

function candidate(pathname) {
  if (pathname === '/') return '/index.html';
  if (pathname === '/demo') return '/demo.html';
  return pathname;
}

async function fileFor(pathname) {
  const relative = candidate(pathname);
  const path = resolve(root, `.${relative}`);
  if (!path.startsWith(`${root}${sep}`) && path !== root) return null;
  try {
    const info = await stat(path);
    if (info.isDirectory()) return resolve(path, 'index.html');
    return path;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || host}`);
  const path = await fileFor(url.pathname);
  const isMissing = !path;
  const target = path || resolve(root, '404.html');
  try {
    const body = await readFile(target);
    response.writeHead(isMissing ? 404 : 200, { 'Content-Type': types[extname(target)] || 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(port, host, () => console.log(`Static preview running at http://${host}:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));

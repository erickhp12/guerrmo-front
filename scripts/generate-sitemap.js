const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL || 'https://d289zu0ewg0kat.cloudfront.net/api/v1';
const SITE_URL = 'https://guerrmo.com';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const options = {
      headers: { 'User-Agent': 'guerrmo-sitemap-generator/1.0', 'Accept': 'application/json' },
    };
    client.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`JSON inválido desde ${url} (status ${res.statusCode})`));
        }
      });
    }).on('error', reject);
  });
}

function buildXml(urls) {
  const today = new Date().toISOString().split('T')[0];
  const entries = urls
    .map(
      ({ loc, changefreq, priority, lastmod }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod || today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

async function main() {
  const today = new Date().toISOString().split('T')[0];
  const urls = [];

  // Páginas estáticas
  urls.push({ loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0', lastmod: today });
  urls.push({ loc: `${SITE_URL}/#/catalogo`, changefreq: 'weekly', priority: '0.9', lastmod: today });
  urls.push({ loc: `${SITE_URL}/#/sucursales`, changefreq: 'monthly', priority: '0.6' });

  // Categorías
  console.log('📦 Obteniendo categorías...');
  const categoriesRes = await fetchJson(`${API_URL}/articles/categories/`);
  if (categoriesRes.error) throw new Error('La API devolvió error en /categories/');

  const categories = categoriesRes.data;
  console.log(`   ${categories.length} categorías encontradas`);

  for (const cat of categories) {
    urls.push({
      loc: `${SITE_URL}/#/categoria/${cat.id}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: today,
    });
  }

  // Productos por categoría (en paralelo)
  console.log('🔩 Obteniendo productos...');
  const productClaves = new Set();

  await Promise.all(
    categories.map(async (cat) => {
      try {
        const data = await fetchJson(`${API_URL}/articles/articles-by-category/0/${cat.id}`);
        if (!data.error && Array.isArray(data)) {
          for (const p of data) {
            if (p.clave) productClaves.add(p.clave);
          }
        }
      } catch {
        console.warn(`   ⚠️  Sin productos para categoría ${cat.id}`);
      }
    })
  );

  console.log(`   ${productClaves.size} productos únicos encontrados`);

  for (const clave of productClaves) {
    urls.push({
      loc: `${SITE_URL}/#/producto/${encodeURIComponent(clave)}`,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  // Escribir sitemap.xml
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, buildXml(urls));
  console.log(`\n✅ sitemap.xml generado — ${urls.length} URLs totales`);
  console.log(`   Estáticas: 3  |  Categorías: ${categories.length}  |  Productos: ${productClaves.size}`);
}

main().catch((err) => {
  console.error('❌ Error generando sitemap:', err.message);
  process.exit(1);
});

import type { APIRoute } from 'astro';

export const prerender = false;

/*
| Indeksiranje se dopušta samo na pravoj domeni. Privremena Coolify adresa nije tajna: certifikat za
| nju Let's Encrypt objavi u javne Certificate Transparency logove čim ga izda, pa je crawleri nađu
| i bez ijedne poveznice. Canonical sam po sebi nije dovoljan — pokazuje na domenu koja još ne
| razlučuje, a takav canonical Google smije zanemariti i indeksirati stvarni URL.
*/
const PRAVE_DOMENE = new Set(['mojacijena.hr', 'www.mojacijena.hr']);

export const GET: APIRoute = ({ request, url }) => {
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? url.host)
    .split(',')[0].trim().split(':')[0].toLowerCase();

  const tijelo = PRAVE_DOMENE.has(host)
    ? 'User-agent: *\nAllow: /\nSitemap: https://mojacijena.hr/sitemap-index.xml\n'
    : 'User-agent: *\nDisallow: /\n';

  return new Response(tijelo, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};

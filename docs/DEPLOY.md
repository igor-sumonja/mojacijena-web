# Deploy: mojacijena.hr na Coolifyju

Stanje 18. 9. 2026. Ovaj dokument je za **marketing web (Astro)**. Servis (Laravel) ima svoj
`docs/PREDAJA.md` u repou `cjenik-servis`; ondje su zamke koje vrijede za njegov deploy.

## 0. Odluka o domenama

| Što | Adresa | Coolify resurs |
| --- | --- | --- |
| Marketing web (ovaj repo) | `mojacijena.hr` + `www.mojacijena.hr` | novi, `mojacijena-web` |
| Servis: admin, portal, javne datoteke cjenika, `widget.js` | `cjenik.mojacijena.hr` | postojeći, `mojacijena` |

Odabrana je **varijanta 1 iz PREDAJA §2 (poddomena)**, ne podjela po putanji. Razlog: Astro
homepage nigdje ne zove servis, pa zajednička domena ne donosi ništa, a nosila bi ručna Traefik
pravila za sve prefikse servisa — uz `/admin`, `/portal`, `/t/*`, `/api/*`, `/widget.js` i `/up`
i Filamentove `/livewire/*`, `/js/filament/*`, `/css/filament/*`, `/fonts/*` te `/storage/*` za
potpisane URL-ove dokaza. Svaki promašeni prefiks je panel bez CSS-a ili 404 na dokazu.

Cijena odluke: javni cjenik živi na `cjenik.mojacijena.hr/t/{slug}/cjenik/latest.csv`, i tu
adresu vide inspekcija i QR kod. Odabran je `cjenik.` umjesto `app.` jer se na papiru čita kao
ono što jest. **Predomišljanje nije besplatno nakon prvih klijenata**: zatvoreni mjesečni
indeksi (`index-YYYY-MM.json`) nose apsolutne URL-ove i više se ne prepisuju, pa bi ih trebalo
obrisati (mjesec kojem datoteka ne postoji ponovno se napiše pri prvoj sljedećoj objavi).

**`mojacijena.hr` na dan pisanja nije registrirana** (`whois.dns.hr` → `No entries found`).
Dok nije, koraci 1, 3 i 4 stoje: Let's Encrypt ne izdaje certifikat bez DNS-a. Korak 2 ne čeka
ništa — Astro ide na privremenu Coolify domenu i kasnije se domena samo zamijeni.

## 1. DNS (nakon registracije domene)

**Stanje 18. 9. 2026.: provedeno.** Domena registrirana preko hrvatskog hostinga, NS prebačeni
na Cloudflare (`beau`/`natasha.ns.cloudflare.com`), zapisi upisani u Cloudflareu sa sivim
oblakom (DNS only); `mojacijena.hr` i `www` žive s Let's Encrypt certifikatom.

Coolify server: **167.233.70.110** (`*.apps.timis.cloud` već pokazuje na njega).

| Tip | Ime | Vrijednost |
| --- | --- | --- |
| A | `@` | `167.233.70.110` |
| A | `www` | `167.233.70.110` |
| A | `cjenik` | `167.233.70.110` |

TTL 300 dok se ne slegne, poslije 3600. Provjera prije nego se dirne Coolify:
`dig +short mojacijena.hr www.mojacijena.hr cjenik.mojacijena.hr` — sva tri moraju vratiti tu adresu.

Dvije napomene:

- **Ako domena završi iza Cloudflarea, proxy (narančasti oblak) mora biti isključen** dok Coolify
  ne izda certifikat. Coolify traži Let's Encrypt preko HTTP-01, a proxy taj izazov presretne.
- **Mail za formu ne čeka mojacijena.hr.** Faza 1: forma šalje kroz postojeći timis.digital
  SMTP (Hetzner), gdje SPF/DKIM već postoje — `MAIL_FROM` mora biti adresa na timis.digital.
  Tek kad se `mojacijena.hr` doda kao mail domena, prelazi se na `info@mojacijena.hr` uz
  vlastiti SPF/DKIM zapis.

## 2. Coolify resurs za Astro

Projekt `mojacijena`, okruženje `production` (isto gdje je i servis).

1. **+ New → Private Repository (with GitHub App)** — ista GitHub App veza kao servis.
   Repo `igor-sumonja/mojacijena-web`, grana **`main`**.
   Pozor: servis je na `master`, ovaj repo na `main`. Coolify u polju za granu nudi zadano
   `main`, ali ako se prepiše po navici iz servisa, deploy padne na „branch not found“.
2. **Build Pack: `Dockerfile`.** Ne Nixpacks. Dockerfile je u korijenu repoa i pinna
   `node:22-alpine`; Nixpacks bi birao svoju verziju Nodea i deploy ne bi bio ponovljiv.
3. **Interni port je `3000`, ne 4321.** Dockerfile postavlja `PORT=4321`, ali platforma pri
   pokretanju ubaci vlastiti `PORT=3000` koji ga pregazi, i Astro sluša na 3000. Na svim
   domenama resursa *Internal port* mora biti `3000` — s 4321 Traefik vraća 502 (provjereno
   18. 9. pri prebacivanju na pravu domenu). Port Mappings ostaviti prazno.
4. **Domains:** zasad klik na *Generate Domain* (dobije se nešto na `*.apps.timis.cloud`).
   Kad DNS iz koraka 1 proradi, polje se zamijeni s
   `https://mojacijena.hr,https://www.mojacijena.hr` i pokrene Redeploy.
5. **Health check:** path `/`, port `3000` (v. točku 3), očekivani status `200`. Astro nema `/up`.
6. **Environment Variables** (stranica same aplikacije, ne *Shared Variables* — v. zamku 2 u
   PREDAJA §1). Sve su **runtime**, nijedna nije *Build Variable*: `src/pages/api/kontakt.ts`
   ih čita preko `process.env` pri zahtjevu, ne pri buildu.

   | Varijabla | Vrijednost |
   | --- | --- |
   | `SMTP_HOST` | Hetznerov mail host za timis.digital (npr. `mail.your-server.de`) |
   | `SMTP_PORT` | `587` |
   | `SMTP_SECURE` | `false` (`true` samo za port 465) |
   | `SMTP_USER` | `igor@timis.digital` (ili zaseban `web@timis.digital`) |
   | `SMTP_PASS` | lozinka sandučića |
   | `MAIL_FROM` | ista adresa kao `SMTP_USER` (mora biti na timis.digital zbog SPF-a) |
   | `MAIL_TO` | `igor@timis.digital` |

   `NODE_ENV`, `HOST` i `PORT` već postavlja Dockerfile i ne treba ih upisivati.

7. **Automatic Deployment** uključen — GitHub App sama postavlja webhook, pa push na `main`
   okida deploy.

### Zamka specifična za ovaj resurs

**Bez SMTP varijabli kontakt forma tiho puca.** `nodemailer` bez `SMTP_HOST` pada na
`127.0.0.1:587`, veza se odbija i posjetitelj dobije `/kontakt?greska=1`; u logu stoji
`kontakt: slanje nije uspjelo Error: connect ECONNREFUSED 127.0.0.1:587`. Stranica pritom radi
savršeno, pa se to ne primijeti dok netko ne prijavi da mu upit nije stigao. Provjeriti odmah
nakon prvog deploya, slanjem jednog upita kroz formu.

### Provjereno lokalno prije pisanja ovih uputa

`docker build` prolazi, kontejner sluša na 4321, a `/`, `/paketi`, `/kontakt`, `/robots.txt` i
`/favicon.svg` vraćaju 200; nepostojeća ruta vraća 404.

## 3. APP_URL servisa

Na Coolify aplikaciji `mojacijena` (servis), **dvije stvari, obje pa onda Redeploy**:

1. *Domains*: `https://mojacijena.apps.timis.cloud` → `https://cjenik.mojacijena.hr`.
   Bez ovoga Traefik ne zna rutati novu domenu.
2. *Environment Variables*: `APP_URL` → `https://cjenik.mojacijena.hr`.

**Redeploy, ne Restart.** Compose varijable ulaze u kontejner pri deployu, a `php artisan optimize`
u deploy koraku osvježi keširani config s novim `APP_URL`.

Ništa se ne regenerira: `App\Objave\JavniUrl` gradi sve javne URL-ove iz `config('app.url')`, a
`App\Objave\QrKod` QR kod stvara pri preuzimanju, ne sprema ga. Jedina iznimka su zatvoreni
`index-YYYY-MM.json` iz sekcije 0 — dok nema klijenata, nema ih ni na disku.

Privremenu domenu **ne brisati odmah**; neka ostane dok korak 4 ne prođe, da postoji put natrag.

## 3a. Statistika posjeta (Umami)

Self-hosted Umami kao Coolify servis (Umami + PostgreSQL), domena `https://stat.mojacijena.hr`
(A zapis `stat` → isti server, sivi oblak), interni port 3000, bez indeksiranja. Skripta je u
`src/layouts/Base.astro` (samo `import.meta.env.PROD`), website-id u samoj skripti; bez kolačića.
Zaštita podataka opisuje ovu obradu — ako se Umami ikad makne ili zamijeni, ažurirati i taj tekst.

## 4. Provjera nakon prebacivanja

```sh
# marketing web
curl -sI https://mojacijena.hr/ | head -1
curl -sI https://www.mojacijena.hr/ | head -1
curl -s https://mojacijena.hr/paketi | grep -o '<link rel="canonical"[^>]*>'   # mora biti https://mojacijena.hr/paketi/

# servis
curl -sI https://cjenik.mojacijena.hr/up | head -1          # 200
curl -sI https://cjenik.mojacijena.hr/admin | head -1       # 302 na /admin/login
curl -sI https://cjenik.mojacijena.hr/widget.js | head -1   # 200
```

Zatim, s jednim stvarnim klijentom u adminu:

- `https://cjenik.mojacijena.hr/t/{slug}/cjenik/` otvara stranicu cjenika,
- `.../latest.csv` i `.../index.json` se preuzimaju,
- u `index.json` svi `url` počinju s `https://cjenik.mojacijena.hr`,
- QR kod preuzet iz portala vodi na `https://cjenik.mojacijena.hr/t/{slug}/cjenik/`
  (ili na domenu klijenta, ako je tako postavljeno u portalu).

`widget.js` **ne treba ništa mijenjati**: origin servisa čita iz `src` same skripte
(`new URL(skripta.src, location.href).origin`). Mijenja se samo isječak koji klijent kopira —
`<script src="https://cjenik.mojacijena.hr/widget.js" data-tenant="...">`.

## 5. Otvoreno

**Laravelov `welcome.blade.php` je izložen.** `https://mojacijena.apps.timis.cloud/` danas vraća
200 i 70 kB Laravelove početne stranice s naslovom „Moje cijene“. Na `cjenik.mojacijena.hr` to je
stranica koja duplira marketing web i može se indeksirati. PREDAJA §2 to već traži zatvoriti;
izlaz je preusmjeriti `/` u `routes/web.php` servisa na `https://mojacijena.hr`.

**Sitemap postoji** (`@astrojs/sitemap`, generira `sitemap-index.xml` pri buildu) i
`robots.txt` pokazuje na njega.

**Indeksiranje privremene domene je zatvoreno**, ali samo dok se popis domena drži ažurnim.
`src/pages/robots.txt.ts` gleda `Host` (odnosno `X-Forwarded-Host`) i dopušta indeksiranje samo na
`mojacijena.hr` i `www.mojacijena.hr`; svemu ostalom vraća `Disallow: /`. Trebalo je, jer privremena
adresa nije tajna: certifikat za nju Let's Encrypt objavi u javne Certificate Transparency logove
čim ga izda — `penpot.apps.timis.cloud` i `solarko.apps.timis.cloud` već stoje u `crt.sh`.

**Ako se ikad doda još koja prava domena, mora ući u `PRAVE_DOMENE` u toj datoteci**, inače će
stranica sama sebi zabraniti indeksiranje, i to tiho.

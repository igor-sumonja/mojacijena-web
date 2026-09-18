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
- **SPF prije nego kontakt forma proradi.** Forma šalje s `MAIL_FROM=web@mojacijena.hr` preko
  vlastitog SMTP-a; bez SPF zapisa za taj poslužitelj upiti klijenata idu u spam. Zapis se dodaje
  tek kad se zna koji SMTP host se koristi.

## 2. Coolify resurs za Astro

Projekt `mojacijena`, okruženje `production` (isto gdje je i servis).

1. **+ New → Private Repository (with GitHub App)** — ista GitHub App veza kao servis.
   Repo `igor-sumonja/mojacijena-web`, grana **`main`**.
   Pozor: servis je na `master`, ovaj repo na `main`. Coolify u polju za granu nudi zadano
   `main`, ali ako se prepiše po navici iz servisa, deploy padne na „branch not found“.
2. **Build Pack: `Dockerfile`.** Ne Nixpacks. Dockerfile je u korijenu repoa i pinna
   `node:22-alpine`; Nixpacks bi birao svoju verziju Nodea i deploy ne bi bio ponovljiv.
3. **Ports Exposes: `4321`.** Port Mappings ostaviti prazno — Traefik ide kroz Dockerovu mrežu,
   a objavljen port bi aplikaciju izložio mimo proxyja.
4. **Domains:** zasad klik na *Generate Domain* (dobije se nešto na `*.apps.timis.cloud`).
   Kad DNS iz koraka 1 proradi, polje se zamijeni s
   `https://mojacijena.hr,https://www.mojacijena.hr` i pokrene Redeploy.
5. **Health check:** path `/`, port `4321`, očekivani status `200`. Astro nema `/up`.
6. **Environment Variables** (stranica same aplikacije, ne *Shared Variables* — v. zamku 2 u
   PREDAJA §1). Sve su **runtime**, nijedna nije *Build Variable*: `src/pages/api/kontakt.ts`
   ih čita preko `process.env` pri zahtjevu, ne pri buildu.

   | Varijabla | Vrijednost |
   | --- | --- |
   | `SMTP_HOST` | host vlastitog mail servera |
   | `SMTP_PORT` | `587` |
   | `SMTP_SECURE` | `false` (`true` samo za port 465) |
   | `SMTP_USER` | `web@mojacijena.hr` |
   | `SMTP_PASS` | lozinka |
   | `MAIL_FROM` | `web@mojacijena.hr` |
   | `MAIL_TO` | adresa na koju stižu upiti |

   `NODE_ENV`, `HOST` i `PORT` već postavlja Dockerfile i ne treba ih upisivati.

7. **Automatic Deployment** uključen — GitHub App sama postavlja webhook, pa push na `master`
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

**Sitemap još ne postoji.** `public/robots.txt` pokazuje na `https://mojacijena.hr/sitemap.xml`,
koji će vraćati 404 dok se ne doda `@astrojs/sitemap` (otvoreni zadatak 3 u `CLAUDE.md`).
Crawleri to podnose, ali vrijedi zatvoriti prije nego stranica ode u indeks.

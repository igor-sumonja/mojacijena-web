# mojacijena.hr – marketing web

Astro 5 + Tailwind 4, Node adapter (SSR samo za `/kontakt` i `/api/kontakt`, sve ostalo je statično). Deploy na Coolify iz Dockerfilea.

## Lokalno

```bash
npm install
cp .env.example .env   # SMTP podaci za kontakt formu
npm run dev            # http://localhost:4321
npm run build && npm start
```

## Deploy na Coolify

1. Gurni repo na Git (GitHub/Gitea).
2. Coolify → New resource → Application → Git repo → Build pack: **Dockerfile**.
3. Port: `4321`. Domena: `mojacijena.hr` (+ `www.mojacijena.hr` s redirectom).
4. Environment variables (iz `.env.example`): `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`.
5. Deploy. Health check: `GET /` → 200.

Aplikacija (Laravel) ide zasebno na `app.mojacijena.hr`; ovaj web s njom ne dijeli ništa.

## Gdje se što mijenja

| Što | Gdje |
| --- | --- |
| Cijene i sadržaj paketa | `src/data/paketi.ts` (jedino mjesto) |
| Pitanja i odgovori | `src/data/faq.ts` (`landing: true` = prikaz na naslovnici) |
| Boje, fontovi, tokeni | `src/styles/global.css` (`@theme`) |
| Navigacija | `src/components/Header.astro` |
| Adresa, telefon, e-mail | `[ADRESA]`, `[TELEFON]`, `[E-MAIL]` u `src/pages/index.astro` i `src/pages/kontakt.astro` |
| Pravni tekstovi | `src/pages/uvjeti.astro`, `privatnost.astro`, `impressum.astro` (placeholderi) |
| Naknada za knjigovođe | `[IZNOS]` u `src/pages/knjigovodje.astro` |

## Otvoreno prije objave

- [ ] Upisati telefon i e-mail (adresa, OIB, IBAN su upisani); u impressumu još sud, MBS, temeljni kapital i član uprave
- [ ] Uvjeti usluge, zaštita podataka, impressum
- [ ] Iznos naknade po preporuci za knjigovođe
- [ ] Odlučiti: link "Otvorite besplatni portal" na `/paketi` sada vodi na kontakt; kad portal bude javan, promijeniti na `https://app.mojacijena.hr/...`
- [ ] SMTP podaci u Coolifyju
- [ ] Provjeriti tekst u sekciji „Zašto na vašoj stranici” nakon što izađe pravilnik uz ZZP

# CLAUDE.md – mojacijena.hr (marketing web)

Marketing web za uslugu **Moja Cijena** (Timis Digital d.o.o.): strojno čitljivi cjenici i sidrene cijene na vlastitom webu klijenta, za hrvatske obrtnike i male trgovce. Astro 5, Tailwind 4, Node adapter, deploy na Coolify (Dockerfile). Laravel aplikacija je zaseban projekt na `app.mojacijena.hr`; njezin spec je `docs/SPEC.md` u tom repou i on kaže što sustav stvarno radi.

## Pravila za svaki zadatak

- Jezik stranice je hrvatski, ton služben i suzdržan, obraćanje na „vi”. Bez tehničkog žargona za obrtnike (ne objašnjavaj XML; reci „datoteka koju računalo može pročitati”).
- **Stranica ne smije obećati ništa što ne piše u SPEC.md aplikacije.** Nije u fazi 1 i ne spominje se: widget za ne‑WP webove, uvoz iz blagajne, automatska naplata pretplate, CNAME poddomena.
- **Nikad ne obećavati usklađenost sa zakonom.** Formula je: „tehnički dio provodimo mi, za sadržaj cjenika odgovarate vi”. Ne pisati „bit ćete u skladu sa zakonom”.
- WooCommerce shopovi nisu ciljni klijenti; stranica ih uljudno odbija.
- Izrada ili preseljenje weba s ugrađenim cjenikom („Novi web + cjenik”) ravnopravan je paket, ne dodatak. Besplatni self-service više se ne nudi i nigdje se ne spominje. Trgovina nije standardni paket: iznad stotinjak artikala ide individualna ponuda, bez istaknute cijene.
- Treća varijanta isporuke (Wix, tuđi hosting) je slabija i tako se i opisuje; nikad kao ravnopravan paket.
- Cijene i sadržaj paketa mijenjaju se **samo** u `src/data/paketi.ts`; FAQ samo u `src/data/faq.ts`.
- Dizajn: tokeni u `src/styles/global.css` (`@theme`). Serif Source Serif 4 za naslove, Source Sans 3 za tekst, jedan akcent (`--color-accent`). Bez gradijenata, emojija, ilustracija; jedina „slika” je prikaz cjenika na webu klijenta u heroju.
- Pravni izvori koji se citiraju: NN 101/2026 (Odluka o objavi cjenika, Odluka o isticanju dodatne cijene), na snazi 1. 10. 2026.; izmjene Zakona o zaštiti potrošača 17. 11. 2026. Prije dodavanja nove pravne tvrdnje provjeri službeni tekst u Narodnim novinama.
- Nakon promjena: `npm run build` mora proći bez grešaka. Ne mijenjaj `Dockerfile` osim ako zadatak to izričito traži.

## Struktura

- `src/pages/` – `index` (landing), `paketi`, `vodic`, `pitanja`, `knjigovodje`, `kontakt` (SSR, čita `?paket=`), `api/kontakt.ts` (POST, nodemailer, honeypot), `uvjeti`/`privatnost`/`impressum` (placeholderi).
- `src/components/` – `Header`, `Footer`, `Logo`, `PriceCards`, `ContactForm`, `Cta`.
- `src/data/` – `paketi.ts`, `faq.ts`.

## Otvoreni zadaci (redoslijed)

1. Upisati kontakt podatke i iznos naknade za knjigovođe (placeholderi u uglatim zagradama).
2. Napisati uvjete usluge, zaštitu podataka i impressum (uvjeti moraju sadržavati: tehnička provedba a ne pravni savjet, obveza klijenta da promjene javi na vrijeme, jamstvo povrata uključenja do 31. 12. 2026., otkaz bilo kad, DPA).
3. Sitemap (`@astrojs/sitemap`) i OG slika.
4. Kad pravilnik uz ZZP izađe: ažurirati `vodic.astro`, `faq.ts` i sekciju „Jamstvo” na landingu.

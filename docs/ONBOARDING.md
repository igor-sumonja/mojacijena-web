# Onboarding klijenta — checklista

Od upita do prve objave. Dva obećanja sa stranice koja vežu: **javljanje u jednom radnom
danu** od upita i **uključenje u 1–2 radna dana** od dostave materijala (za trgovine ovisno
o broju artikala). Admin je na `cjenik.mojacijena.hr/admin`; pojmovi su iz SPEC-a servisa
(tenant = klijent).

## 0. Stigao upit (forma ili poziv)

- [ ] Odgovoriti unutar jednog radnog dana.
- [ ] Trijaža prije razgovora:
  - **WooCommerce?** → uljudno uputiti na gotove dodatke, ne preuzimati.
  - **Nema web / zastario / Wix bez pristupa?** → paket Novi web + cjenik (isporuka od
    listopada), ili varijanta s poveznicom na naš servis — uvijek je predstaviti kao slabiju.
  - **Trgovina s više od stotinjak artikala, više objekata, dnevne akcije?** → individualna
    ponuda, ne standardni paket.
  - Pitanje „jesam li obveznik?” → knjigovođa ili HOK, mi to ne procjenjujemo.

## 1. Razgovor — što tražiti od klijenta

- [ ] **Popis stavki s cijenama** — bilo koji oblik: Excel, papir, fotografija starog cjenika.
- [ ] **Cijene na referentni datum** + **dokaz** (fotka cjenika, letak, račun, screenshot):
  - usluge i „ostalo”: cijena na **10. 9. 2026.**
  - hrana, piće, kozmetika, čišćenje, toaletne potrepštine, kućanstvo: cijena na **2. 5. 2025.**
  - stavka uvedena poslije referentnog datuma: prva cijena po kojoj se nudila.
- [ ] **Pristup webu**: WordPress admin ili pristup poslužitelju/hostingu.
- [ ] Posebnosti: više lokala (svaki objekt = svoj cjenik), akcije u tijeku (akcijska +
  redovna cijena + do kada), e-mail osobe koja će koristiti portal.
- [ ] Dogovoriti paket i **kanal za javljanje promjena** (Bez brige): WhatsApp/SMS/e-mail.

## 2. Ponuda i račun

- [ ] Ponuda s **godišnjom opcijom prvom** (10 za 12, jedan račun godišnje); mjesečna ispod.
- [ ] Račun za uključenje — **plaća se prije početka rada** (tako pišu uvjeti).
- [ ] Po uplati krenuti; sat vremena posla ne čeka uplatu ako klijent žuri, ali objava ide
  tek s plaćenim uključenjem.

## 3. Unos u admin

- [ ] Novi klijent (tenant): naziv, OIB, tip `usluge` / `proizvodi` / `oboje`,
  `auto_objava` (u pravilu: trgovine da, usluge ne), paket.
- [ ] Prodajni objekt(i) — obrt s jednim lokalom ima jedan; naziv datoteke se slaže iz
  ovih podataka, pa adresa i oznaka objekta moraju biti točni.
- [ ] Stavke: naziv, cijena, **sidrena cijena**, ispravna **kategorija** (određuje referentni
  datum!); za trgovine CSV import.
- [ ] Akcije u tijeku: akcijska cijena, naziv oblika prodaje, `akcija_do`, redovna cijena.
- [ ] Upload **dokaza** uz referentne cijene (datum_cijene ispravno postavljen).
- [ ] Korisnik portala: klijentov e-mail, uloga u tenantu.

## 4. Spajanje s klijentovim webom

- [ ] WordPress: instalirati naš dodatak → `njihovadomena.hr/cjenik/`.
- [ ] Statična stranica s pristupom poslužitelju: pravilo da `/cjenik/` vodi na naš sustav.
- [ ] Bez pristupa (iznimka): poveznica na `cjenik.mojacijena.hr/t/{slug}/cjenik/` s
  klijentovog weba; sidrene uz cijene na svom webu tada ističe sam.
- [ ] Provjeriti da stranica cjenika radi na klijentovoj adresi (i na telefonu).

## 5. Prva objava i kontrola

- [ ] Objaviti; provjeriti da se `latest.csv` i `latest.xml` preuzimaju i prolaze validaciju.
- [ ] Naziv datoteke sadrži oblik objekta, adresu, oznaku, broj pohrane i vremensku oznaku.
- [ ] QR kod iz portala vodi na ispravnu adresu.
- [ ] Za `auto_objava` klijente: sutradan provjeriti da je jutarnja objava (06:30) prošla.

## 6. Predaja klijentu

Poslati jedan e-mail sa svime:

- [ ] link na njegov cjenik (njegova domena),
- [ ] PDF cjenik za pult, QR kod za vrata/račun,
- [ ] tablica cijena za letke i oglase (aktualna, redovna, najniža 30 d, sidrena),
- [ ] uputa u dvije rečenice: kako se prijaviti u portal (poveznica na e-mail, vrijedi
  15 min) i kako promijeniti cijenu / javiti promjenu porukom,
- [ ] podsjetnik: za točnost cijena i sadržaj cjenika odgovara klijent; promjene javiti
  **prije** nego što nova cijena krene.
- [ ] Test: klijent se uspio prijaviti u portal (magic link stigao, nije u spamu).

## 7. Nakon uključenja (ništa se ne zaboravlja samo)

- [ ] Bez brige: promjene stižu porukom → unos i objava isti radni dan.
- [ ] Mjesečni sažetak i podsjetnici idu automatski e-mailom (provjeriti da MAIL_* radi).
- [ ] Alarm u 07:15 ako jutarnja objava nije prošla — reagirati isto jutro.
- [ ] Kod promjene propisa: prilagodba je u pretplati, klijent ne radi ništa.

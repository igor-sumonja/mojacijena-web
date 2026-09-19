export type Paket = {
  id: string;
  naziv: string;
  naslovKartice: string;
  recenica: string;
  prvaGodina: number; // eur, bez PDV-a
  obnova: number; // eur godišnje, bez PDV-a
  istaknut?: boolean;
  napomena?: string;
};

// Cijene i sadržaj paketa mijenjaju se samo ovdje.
// Model: jedan godišnji iznos po paketu, os „koliko posla radimo mi”.
export const paketi: Paket[] = [
  {
    id: 'na-vasem-webu',
    naziv: 'Cjenik na vašem webu',
    naslovKartice: 'Postavimo i objavljujemo',
    recenica: 'Sve postavimo i cjenik objavljujemo na vašoj domeni. Cijene mijenjate sami, u portalu s telefona — jedan ekran i gumb „Objavi”.',
    prvaGodina: 149,
    obnova: 99,
    istaknut: true,
  },
  {
    id: 'novi-web',
    naziv: 'Novi web + cjenik',
    naslovKartice: 'Nemate web?',
    recenica: 'Izradimo novu stranicu s ugrađenim cjenikom, do 5 stranica; hosting i domena uključeni.',
    prvaGodina: 690,
    obnova: 149,
  },
];

// Dodatak uz bilo koji plaćeni paket, ne zaseban paket.
export const dodatakPromjene = {
  naziv: 'Promjene unosimo mi',
  cijenaGod: 100,
  opis: 'Ne želite dirati ni portal? Promjenu nam javite porukom, mi je unesemo i objavimo isti dan. Do 12 promjena cjenika godišnje.',
};

// Besplatno, trajno — ručno. Sve živi na našoj adresi; automatika i vlastita domena su plaćeni paketi.
export const besplatno = {
  id: 'besplatno',
  naziv: 'Besplatni cjenik',
  naslovKartice: 'Vi, sami',
  recenica: 'Sami unosite cijene i sami skidate XML, CSV i PDF kad god vam trebaju. Javni cjenik i QR dobivate na našoj adresi.',
  ograda: 'Datoteke stalno preuzimate i sami stavljate na svoj web. Želite li da to ide automatski ili da cjenik stoji na vašoj domeni — to su plaćeni paketi.',
};

export const noviWeb = paketi.find((p) => p.id === 'novi-web')!;
export const glavni = paketi.find((p) => p.id === 'na-vasem-webu')!;

// Po čemu se plaćeni paketi razlikuju od besplatnog. Samo ono što sustav danas stvarno radi.
export const uSvakomPlacenomPaketu = [
  'automatska objava, bez ručnog skidanja',
  'cjenik i arhiva na vašoj domeni',
  'postavljanje i prvi unos radimo mi',
  'promjene cijena bez naplate',
];

// Trgovine s robom nemaju standardni paket; iznad stotinjak artikala ide individualna ponuda.
export const trgovine = {
  naslov: 'Prodajete robu?',
  kratko: 'Trgovina s više od stotinjak artikala? Radimo individualnu ponudu — javite nam se.',
  tekst: 'Manja trgovina, do stotinjak artikala, stane u paket „Cjenik na vašem webu”; cjenik se tada objavljuje automatski svako jutro, i vikendom. Za veće trgovine, više prodajnih objekata, uvoz artikala iz Excela ili CSV-a i vođenje akcija radimo individualnu ponudu prema opsegu posla.',
};

export const eur = (n: number) => `${n} €`;

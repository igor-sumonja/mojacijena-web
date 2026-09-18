export type Paket = {
  id: string;
  naziv: string;
  naslovKartice: string;
  recenica: string;
  ukljucenje: number;
  mjesecno: number;
  istaknut?: boolean;
  napomena?: string;
};

// Cijene i sadržaj paketa mijenjaju se samo ovdje.
export const paketi: Paket[] = [
  {
    id: 'na-vasem-webu',
    naziv: 'Na vašem webu',
    naslovKartice: 'Vi, sami',
    recenica: 'Cijene mijenjate sami, u portalu s telefona — jedan ekran i gumb „Objavi”.',
    ukljucenje: 129,
    mjesecno: 9,
  },
  {
    id: 'bez-brige',
    naziv: 'Bez brige',
    naslovKartice: 'Mi, po vašoj poruci',
    recenica: 'Promjenu nam javite porukom, mi je unesemo i objavimo isti dan. Vi ne dirate ništa.',
    ukljucenje: 149,
    mjesecno: 35,
    istaknut: true,
    napomena: 'Računamo na uobičajen ritam promjena u uslužnom cjeniku. Svakodnevno mijenjanje velikog broja cijena posao je za individualnu ponudu.',
  },
  {
    id: 'novi-web',
    naziv: 'Novi web + cjenik',
    naslovKartice: 'Nemate web?',
    recenica: 'Izradimo novu stranicu s ugrađenim cjenikom, do 5 stranica; hosting i domena uključeni.',
    ukljucenje: 449,
    mjesecno: 29,
  },
];

export const noviWeb = paketi.find((p) => p.id === 'novi-web')!;

// Zajedničke stavke, izvučene iz kartica da razlika među paketima ostane čitljiva.
export const uSvakomPaketu = [
  'cjenik na vašoj domeni',
  'sidrene cijene',
  'PDF i QR kod',
  'trajna arhiva',
  'prilagodba propisu',
  'promjene cijena bez naplate',
];

// Trgovine s robom nemaju standardni paket; iznad stotinjak artikala ide individualna ponuda.
export const trgovine = {
  naslov: 'Prodajete robu?',
  kratko: 'Trgovina s više od stotinjak artikala? Radimo individualnu ponudu — javite nam se.',
  tekst: 'Manja trgovina, do stotinjak artikala, stane u gornje pakete; cjenik se tada objavljuje automatski svako jutro, i vikendom. Za veće trgovine, više prodajnih objekata, uvoz artikala iz Excela ili CSV-a i vođenje akcija radimo individualnu ponudu prema opsegu posla.',
};

export const eur = (n: number) => `${n} €`;

export type Paket = {
  id: string;
  naziv: string;
  za: string;
  ukljucenje: number;
  mjesecno: number;
  istaknut?: boolean;
  stavke: string[];
  napomena?: string;
};

// Cijene: sredina raspona iz poslovne analize. Mijenjaj samo ovdje.
export const paketi: Paket[] = [
  {
    id: 'na-vasem-webu',
    naziv: 'Na vašem webu',
    za: 'Za uslužne obrte koji sami mijenjaju cijene u portalu.',
    ukljucenje: 129,
    mjesecno: 9,
    stavke: [
      'Cjenik na vašoj domeni',
      'Sidrene cijene uz cijene na webu',
      'Unos početnog cjenika i dokazi',
      'Portal za promjene s telefona',
      'PDF, QR kod, arhiva objava',
    ],
  },
  {
    id: 'bez-brige',
    naziv: 'Bez brige',
    za: 'Vi javite promjenu porukom, mi je unesemo i objavimo isti dan.',
    ukljucenje: 149,
    mjesecno: 19,
    istaknut: true,
    stavke: [
      'Sve iz paketa Na vašem webu',
      'Promjene javljate porukom, objava isti dan',
      'Mjesečni izvještaj o objavama',
      'Prilagodba kad se propis promijeni',
      'Tablica cijena za letke i oglase',
    ],
    napomena: 'Računamo na uobičajen ritam promjena u uslužnom cjeniku. Svakodnevno mijenjanje velikog broja cijena posao je za individualnu ponudu.',
  },
  {
    id: 'novi-web',
    naziv: 'Novi web + cjenik',
    za: 'Za obrte bez weba ili sa zastarjelom stranicom, s cjenikom od prvog dana.',
    ukljucenje: 449,
    mjesecno: 29,
    stavke: [
      'Nova stranica na našem predlošku, do 5 stranica',
      'Cjenik ugrađen od prvog dana',
      'Hosting i domena uključeni u pretplatu',
      'Sitne izmjene teksta bez naplate',
      'Sve iz paketa Bez brige',
    ],
  },
];

export const noviWeb = paketi.find((p) => p.id === 'novi-web')!;

// Trgovine s robom nemaju standardni paket; iznad stotinjak artikala ide individualna ponuda.
export const trgovine = {
  naslov: 'Prodajete robu?',
  kratko: 'Za trgovine s više od stotinjak artikala radimo individualnu ponudu.',
  tekst: 'Manja trgovina, do stotinjak artikala, stane u gornje pakete; cjenik se tada objavljuje automatski svako jutro, i vikendom. Za veće trgovine, više prodajnih objekata, uvoz artikala iz Excela ili CSV-a i vođenje akcija radimo individualnu ponudu prema opsegu posla.',
};

export const eur = (n: number) => `${n} €`;

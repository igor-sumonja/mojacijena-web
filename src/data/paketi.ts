export type Paket = {
  id: string;
  naziv: string;
  za: string;
  ukljucenje: number;
  mjesecno: number;
  istaknut?: boolean;
  stavke: string[];
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
  },
  {
    id: 'trgovina',
    naziv: 'Trgovina',
    za: 'Za trgovine robom s dnevnom objavom i više artikala.',
    ukljucenje: 349,
    mjesecno: 49,
    stavke: [
      'Automatska objava svako jutro',
      'Više prodajnih objekata',
      'Uvoz artikala iz Excela ili CSV-a',
      'Akcije s najnižom cijenom u 30 dana',
      'Prilagodba kad se propis promijeni',
    ],
  },
];

export const kombo = { naziv: 'Novi web + cjenik', ukljucenje: 449, mjesecno: 29 };

export const eur = (n: number) => `${n} €`;

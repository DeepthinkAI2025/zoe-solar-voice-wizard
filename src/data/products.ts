
export type Product = {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
};

export type Manufacturer = {
  id: string;
  name: string;
  products: Product[];
};

export const manufacturers: Manufacturer[] = [
  {
    id: 'vaillant',
    name: 'Vaillant',
    products: [
      { id: 'vcw', name: 'ecoTEC plus VCW 26', description: 'Ein Gas-Brennwertgerät, das Effizienz und Komfort für Heizung und Warmwasserbereitung in Ein- und Mehrfamilienhäusern bietet.', videoUrl: 'https://www.youtube.com/embed/a_n456zpl_o' },
      { id: 'vsc', name: 'ecoCOMPACT VSC', description: 'Kompakte Gas-Brennwert-Unit mit integriertem Schichtladespeicher für höchsten Warmwasserkomfort.', videoUrl: 'https://www.youtube.com/embed/o-YBDTqX_ZU' },
    ]
  },
  {
    id: 'wolf',
    name: 'Wolf GmbH',
    products: [
        { id: 'cgb-2', name: 'CGB-2', description: 'Gas-Brennwertkessel für eine zuverlässige und effiziente Wärmeversorgung.', videoUrl: 'https://www.youtube.com/embed/3tmd-ClpJxA' },
    ]
  },
  {
    id: 'buderus',
    name: 'Buderus',
    products: [
        { id: 'gb172', name: 'Logamax plus GB172', description: 'Wandhängender Gas-Brennwertkessel, bekannt für seine Robustheit und Langlebigkeit.', videoUrl: 'https://www.youtube.com/embed/QH2-TGUlwu4' },
    ]
  }
];


import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ExternalLink } from 'lucide-react';

const manufacturers = [
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

type Product = typeof manufacturers[0]['products'][0];

const ProductsScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Produkte</h1>
          <p className="text-muted-foreground">Hersteller und Montageinformationen.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {manufacturers.map((manufacturer) => (
            <AccordionItem key={manufacturer.id} value={manufacturer.id} className="bg-secondary/50 border-none rounded-xl overflow-hidden">
              <AccordionTrigger className="p-4 font-bold text-lg hover:no-underline">
                {manufacturer.name}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <div className="space-y-3">
                    {manufacturer.products.map((product) => (
                        <div key={product.id} className="p-3 bg-background/50 rounded-lg flex justify-between items-center gap-2">
                            <div className="flex-1">
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(product)}>Details</Button>
                        </div>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}>
        <DialogContent className="max-w-sm w-[90%] rounded-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  {selectedProduct.description}
                </DialogDescription>
              </DialogHeader>
              <div className="aspect-video rounded-lg overflow-hidden my-4 border">
                <iframe
                    className="w-full h-full"
                    src={selectedProduct.videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
              </div>
              <DialogFooter>
                  <Button asChild variant="outline" className="w-full">
                      <a href={selectedProduct.videoUrl.replace('embed/', 'watch?v=')} target="_blank" rel="noopener noreferrer">
                          Auf YouTube ansehen
                          <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                  </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsScreen;

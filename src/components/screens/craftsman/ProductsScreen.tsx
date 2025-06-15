
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ExternalLink, Search, Plus, Bot, FileText, BookOpen, Wrench } from 'lucide-react';
import { manufacturers, Product, Manufacturer } from '@/data/products';
import ProductAiDialog from '@/components/products/ProductAiDialog';
import AddManufacturerDialog from '@/components/products/AddManufacturerDialog';
import { toast } from "@/components/ui/use-toast";

const ProductsScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentManufacturers, setCurrentManufacturers] = useState(manufacturers);

  // Filter manufacturers and products based on search
  const filteredManufacturers = currentManufacturers.map(manufacturer => ({
    ...manufacturer,
    products: manufacturer.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(manufacturer => 
    manufacturer.products.length > 0 || 
    manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddManufacturer = (manufacturer: { name: string }, product?: any) => {
    const existingManufacturer = currentManufacturers.find(m => m.name.toLowerCase() === manufacturer.name.toLowerCase());

    if (existingManufacturer) {
        // TODO: Add product to existing manufacturer
         toast({
            title: "Hersteller existiert bereits",
            description: `Ein Produkt kann zu einem bestehenden Hersteller hinzugefügt werden (Funktion in Entwicklung).`,
            variant: "destructive"
        });
        return;
    }

    const newManufacturer: Manufacturer = {
      id: manufacturer.name.toLowerCase().replace(/\s+/g, '-'),
      name: manufacturer.name,
      products: product ? [{
        id: product.name.toLowerCase().replace(/\s+/g, '-'),
        name: product.name,
        description: product.description,
        videoUrl: product.videoUrl,
        datasheets: product.datasheets || [],
        manuals: product.manuals || [],
        installationGuides: product.installationGuides || []
      }] : []
    };

    setCurrentManufacturers(prev => [...prev, newManufacturer]);
    
    toast({
      title: "Hersteller hinzugefügt",
      description: `${manufacturer.name} wurde erfolgreich hinzugefügt.`
    });
  };

  return (
    <>
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Produkte</h1>
          <p className="text-muted-foreground">Hersteller und Montageinformationen.</p>
        </div>

        {/* Search and Add Controls */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Produkte oder Hersteller suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Hinzufügen
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredManufacturers.map((manufacturer) => (
            <AccordionItem key={manufacturer.id} value={manufacturer.id} className="bg-secondary/50 border-none rounded-xl overflow-hidden">
              <AccordionTrigger className="p-4 font-bold text-lg hover:no-underline">
                {manufacturer.name}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <div className="space-y-3">
                    {manufacturer.products.map((product) => (
                        <div key={product.id} className="p-3 bg-background/50 rounded-lg">
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(product)}>
                                        Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filteredManufacturers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Keine Produkte gefunden.</p>
          </div>
        )}
      </div>

      {/* Product Details Dialog */}
      <Dialog open={!!selectedProduct && !isAiDialogOpen} onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  {selectedProduct.description}
                </DialogDescription>
              </DialogHeader>
              <div className='overflow-y-auto pr-2'>
              {selectedProduct.videoUrl && (
                <div className="aspect-video rounded-lg overflow-hidden border mb-4">
                    <iframe
                        className="w-full h-full"
                        src={selectedProduct.videoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
              )}

              {/* Documents */}
              <div className="space-y-4">
                {selectedProduct.datasheets && selectedProduct.datasheets.length > 0 && (
                  <div>
                    <h4 className="font-semibold flex items-center mb-2"><FileText className="h-4 w-4 mr-2" />Datenblätter</h4>
                    <div className="space-y-1 pl-6 list-disc text-sm text-muted-foreground">
                      {selectedProduct.datasheets.map((sheet, index) => <li key={index}>{sheet}</li>)}
                    </div>
                  </div>
                )}

                {selectedProduct.manuals && selectedProduct.manuals.length > 0 && (
                  <div>
                    <h4 className="font-semibold flex items-center mb-2"><BookOpen className="h-4 w-4 mr-2" />Handbücher</h4>
                    <div className="space-y-1 pl-6 list-disc text-sm text-muted-foreground">
                      {selectedProduct.manuals.map((manual, index) => <li key={index}>{manual}</li>)}
                    </div>
                  </div>
                )}

                {selectedProduct.installationGuides && selectedProduct.installationGuides.length > 0 && (
                  <div>
                    <h4 className="font-semibold flex items-center mb-2"><Wrench className="h-4 w-4 mr-2" />Installationsanleitungen</h4>
                    <div className="space-y-1 pl-6 list-disc text-sm text-muted-foreground">
                      {selectedProduct.installationGuides.map((guide, index) => <li key={index}>{guide}</li>)}
                    </div>
                  </div>
                )}
              </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                  <Button onClick={() => setIsAiDialogOpen(true)} className="w-full">
                      <Bot className="mr-2 h-4 w-4" />
                      KI-Assistent fragen
                  </Button>
                  {selectedProduct.videoUrl && (
                    <Button asChild variant="outline" className="w-full">
                        <a href={selectedProduct.videoUrl.replace('embed/', 'watch?v=')} target="_blank" rel="noopener noreferrer">
                            Auf YouTube ansehen
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                  )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Dialog */}
      {selectedProduct && (
        <ProductAiDialog
          isOpen={isAiDialogOpen}
          onOpenChange={setIsAiDialogOpen}
          product={selectedProduct}
        />
      )}

      {/* Add Manufacturer Dialog */}
      <AddManufacturerDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddManufacturer}
      />
    </>
  );
};

export default ProductsScreen;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddManufacturerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (manufacturer: { name: string }, product?: {
    name: string;
    description: string;
    videoUrl: string;
    datasheets: string[];
    manuals: string[];
    installationGuides: string[];
  }) => void;
}

const AddManufacturerDialog = ({ isOpen, onOpenChange, onAdd }: AddManufacturerDialogProps) => {
  const [manufacturerName, setManufacturerName] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [addProduct, setAddProduct] = useState(false);

  const handleSubmit = () => {
    if (!manufacturerName.trim()) return;

    const manufacturer = { name: manufacturerName.trim() };
    
    const product = addProduct && productName.trim() ? {
      name: productName.trim(),
      description: productDescription.trim(),
      videoUrl: videoUrl.trim(),
      datasheets: [],
      manuals: [],
      installationGuides: []
    } : undefined;

    onAdd(manufacturer, product);
    
    // Reset form
    setManufacturerName('');
    setProductName('');
    setProductDescription('');
    setVideoUrl('');
    setAddProduct(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hersteller hinzufügen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="manufacturer-name">Hersteller Name *</Label>
            <Input
              id="manufacturer-name"
              value={manufacturerName}
              onChange={(e) => setManufacturerName(e.target.value)}
              placeholder="z.B. Vaillant, Wolf, Buderus..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="add-product"
              checked={addProduct}
              onChange={(e) => setAddProduct(e.target.checked)}
            />
            <Label htmlFor="add-product">Direkt ein Produkt hinzufügen</Label>
          </div>

          {addProduct && (
            <>
              <div>
                <Label htmlFor="product-name">Produktname</Label>
                <Input
                  id="product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="z.B. ecoTEC plus VCW 26"
                />
              </div>

              <div>
                <Label htmlFor="product-description">Beschreibung</Label>
                <Textarea
                  id="product-description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Kurze Beschreibung des Produkts..."
                  className="min-h-[60px]"
                />
              </div>

              <div>
                <Label htmlFor="video-url">YouTube Video URL (embed)</Label>
                <Input
                  id="video-url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={!manufacturerName.trim()}>
            Hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddManufacturerDialog;

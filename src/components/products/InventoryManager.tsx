
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Minus, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  lastUpdated: string;
}

const initialInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Wärmepumpe NIBE F2120',
    category: 'Wärmepumpen',
    quantity: 3,
    minStock: 2,
    unit: 'Stück',
    lastUpdated: '2025-06-15T10:00:00'
  },
  {
    id: '2', 
    name: 'Rohrisolierung 22mm',
    category: 'Rohre & Fittings',
    quantity: 50,
    minStock: 20,
    unit: 'Meter',
    lastUpdated: '2025-06-15T09:30:00'
  },
  {
    id: '3',
    name: 'Absperrventil 1/2"',
    category: 'Ventile',
    quantity: 8,
    minStock: 10,
    unit: 'Stück',
    lastUpdated: '2025-06-14T16:00:00'
  }
];

const InventoryManager: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateQuantity = (id: string, change: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        const updatedItem = {
          ...item,
          quantity: newQuantity,
          lastUpdated: new Date().toISOString()
        };
        
        if (newQuantity <= item.minStock) {
          toast({
            title: "Niedriger Lagerbestand",
            description: `${item.name} hat nur noch ${newQuantity} ${item.unit}`,
            variant: "destructive"
          });
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);

  return (
    <div className="space-y-4">
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Niedriger Lagerbestand ({lowStockItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-sm">{item.name}</span>
                  <Badge variant="destructive">{item.quantity} {item.unit}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lagerbestand
          </CardTitle>
          <Input
            placeholder="Artikel suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredInventory.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={item.quantity <= item.minStock ? "destructive" : "secondary"}>
                    {item.quantity} {item.unit}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;

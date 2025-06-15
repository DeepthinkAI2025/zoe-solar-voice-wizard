
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X } from 'lucide-react';
import type { Contact, Category } from '@/hooks/useContactManagement';
import { categories, contactCategoryLabels } from '@/hooks/useContactManagement';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ContactEditorProps {
  contact?: Contact;
  onSave: (contact: Contact | Omit<Contact, 'id'>) => void;
  onClose: () => void;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({ contact, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Contact, 'id'>>({
    name: contact?.name || '',
    number: contact?.number || '',
    category: contact?.category || 'kunde',
  });

  const handleSave = () => {
    if (formData.name && formData.number) {
      if (contact) {
        onSave({ ...contact, ...formData });
      } else {
        onSave(formData);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as Category }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-sm animate-slide-up relative flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-6">{contact ? 'Kontakt bearbeiten' : 'Neuer Kontakt'}</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Max Mustermann" />
          </div>
          <div>
            <Label htmlFor="number">Nummer</Label>
            <Input id="number" name="number" type="tel" value={formData.number} onChange={handleChange} placeholder="+49 123 456789" />
          </div>
          <div>
            <Label htmlFor="category">Kategorie</Label>
            <Select name="category" value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{contactCategoryLabels[cat]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Abbrechen</Button>
          <Button onClick={handleSave} disabled={!formData.name || !formData.number}>Speichern</Button>
        </div>
      </div>
    </div>
  );
};

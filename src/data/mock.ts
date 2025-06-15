
import { Phone, Voicemail, List, Contact, Bot, Building, Gavel, Handshake } from 'lucide-react';

export const aiAgents = [
  { id: 'tech', name: 'KI Techniker', icon: Building, description: 'Für technische Anfragen zu Solaranlagen.' },
  { id: 'lead', name: 'KI Lead-Agent', icon: Handshake, description: 'Qualifiziert neue Kundenanfragen.' },
  { id: 'legal', name: 'KI Anwalt', icon: Gavel, description: 'Beantwortet rechtliche Standardfragen.' },
  { id: 'general', name: 'KI Zentrale', icon: Bot, description: 'Allgemeine Anfragen und Weiterleitung.' },
];

export const contacts = [
    { name: 'Max Mustermann', number: '+49 176 12345678', type: 'Kunde' },
    { name: 'Erika Musterfrau', number: '+49 151 87654321', type: 'Lead' },
    { name: 'Bauamt Berlin', number: '030 90250', type: 'Behörde' },
    { name: 'Großhandel GmbH', number: '089 123456', type: 'Lieferant' },
];

export const callHistory = [
    { name: 'Erika Musterfrau', type: 'Eingehend', time: '14:32', date: 'Heute' },
    { name: 'Unbekannt', type: 'Verpasst', time: '11:05', date: 'Heute' },
    { name: 'Max Mustermann', type: 'Ausgehend (KI)', time: '09:15', date: 'Gestern' },
];

export const voicemails = [
    { name: 'Max Mustermann', duration: '0:45', time: '18:10', date: 'Vorgestern' },
];

export const navItems = [
    { id: 'history', label: 'Anrufe', icon: List },
    { id: 'contacts', label: 'Kontakte', icon: Contact },
    { id: 'dialpad', label: 'Tastenfeld', icon: Dialpad },
    { id: 'voicemail', label: 'Voicemail', icon: Voicemail },
];

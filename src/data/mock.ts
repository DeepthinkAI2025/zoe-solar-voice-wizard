
export const aiAgents = [
  { id: 'tech', name: 'KI Techniker', icon: 'Building', description: 'Für technische Anfragen zu Solaranlagen.' },
  { id: 'lead', name: 'KI Lead-Agent', icon: 'Handshake', description: 'Qualifiziert neue Kundenanfragen.' },
  { id: 'legal', name: 'KI Anwalt', icon: 'Gavel', description: 'Beantwortet rechtliche Standardfragen.' },
  { id: 'general', name: 'KI Zentrale', icon: 'Bot', description: 'Allgemeine Anfragen und Weiterleitung.' },
];

export const contacts = [
    { name: 'Max Mustermann', number: '+49 176 12345678', type: 'Kunde' },
    { name: 'Erika Musterfrau', number: '+49 151 87654321', type: 'Lead' },
    { name: 'Bauamt Berlin', number: '030 90250', type: 'Behörde' },
    { name: 'Großhandel GmbH', number: '089 123456', type: 'Lieferant' },
];

export const callHistory = [
    { name: 'Erika Musterfrau', number: '+49 151 87654321', type: 'Eingehend', time: '14:32', date: 'Heute', summary: 'Anfrage zu Rechnung XY. Kunde hat nach Rabatt gefragt. Weiterleitung an Buchhaltung empfohlen.', transcript: ['KI: Hallo ZOE Solar, wie kann ich helfen?', 'Erika: Ja, ich habe eine Frage zu meiner Rechnung.', 'KI: Selbstverständlich, um welche Rechnung handelt es sich?', 'Erika: Die vom letzten Monat.'] },
    { name: 'Unbekannt', number: 'Unbekannt', type: 'Verpasst', time: '11:05', date: 'Heute', summary: null, transcript: null },
    { name: 'Max Mustermann', number: '+49 176 12345678', type: 'Ausgehend (KI)', time: '09:15', date: 'Gestern', summary: 'Termin für die Installation am 25.06.2025 wurde bestätigt. Kunde war zufrieden und hat keine weiteren Fragen.', transcript: ['KI: Hallo Herr Mustermann, hier ist ZOE Solar. Ich rufe wegen Ihres Termins an.', 'Max: Ah ja, hallo. Passt alles.', 'KI: Wunderbar, dann ist der Termin für Sie fest eingetragen.'] },
];

export const voicemails = [
    { name: 'Max Mustermann', duration: '0:45', time: '18:10', date: 'Vorgestern' },
];

export const navItems = [
    { id: 'history', label: 'Anrufe', icon: 'List' },
    { id: 'contacts', label: 'Kontakte', icon: 'Contact' },
    { id: 'dialpad', label: 'Tastenfeld', icon: 'Grid3x3' },
    { id: 'voicemail', label: 'Voicemail', icon: 'Voicemail' },
];

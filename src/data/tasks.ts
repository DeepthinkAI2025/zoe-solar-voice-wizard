
import type { Task } from '@/types/task';

export const initialTasks: Task[] = [
  {
    id: 1,
    text: 'Ersatzteile für Wärmepumpe bestellen',
    completed: false,
    priority: 'high',
    subtasks: [
      { id: 1, text: 'Teilenummer recherchieren', completed: true },
      { id: 2, text: 'Lieferant kontaktieren', completed: false }
    ],
    dueDate: '2025-06-17T00:00:00',
    createdAt: '2025-06-15T08:00:00'
  },
  {
    id: 2,
    text: 'Kundendokumentation erstellen',
    completed: false,
    priority: 'medium',
    subtasks: [],
    appointmentId: '1',
    dueDate: '2025-06-16T00:00:00',
    createdAt: '2025-06-15T09:00:00'
  },
  {
    id: 3,
    text: 'Werkzeuge für nächste Woche vorbereiten',
    completed: true,
    priority: 'low',
    subtasks: [
      { id: 3, text: 'Werkzeugkoffer prüfen', completed: true },
      { id: 4, text: 'Defekte Werkzeuge aussortieren', completed: true }
    ],
    createdAt: '2025-06-14T10:00:00'
  }
];

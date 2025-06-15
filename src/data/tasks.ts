
import type { Task } from '@/types/task';

export const initialTasks: Task[] = [
    { id: 1, text: 'Material für Baustelle "Musterfrau" bestellen', priority: 'high', completed: false, subtasks: [
        { id: 101, text: 'Holzbalken 10x10cm', completed: false },
        { id: 102, text: 'Schrauben 5x50mm', completed: true },
    ], appointmentId: '2' },
    { id: 2, text: 'Angebot für "John Doe" erstellen', priority: 'medium', completed: false, subtasks: [], appointmentId: '3' },
    { id: 3, text: 'Rechnung für "Peter Pan" schreiben', priority: 'low', completed: true, subtasks: [] },
    { id: 4, text: 'Werkzeug warten', priority: 'medium', completed: false, subtasks: [], appointmentId: '1' },
];

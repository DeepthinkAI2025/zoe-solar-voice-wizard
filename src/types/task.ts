
export interface Subtask {
  id: number;
  text: string;
  completed: boolean;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  subtasks: Subtask[];
  appointmentId?: string;
  dueDate?: string; // ISO string
  createdAt: string; // ISO string
}

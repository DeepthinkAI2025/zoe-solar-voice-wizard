
export type Subtask = {
    id: number;
    text: string;
    completed: boolean;
};

export type Task = {
    id: number;
    text: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
    subtasks?: Subtask[];
    appointmentId?: string;
};


import { useCallback } from 'react';
import { manufacturers, Product } from '@/data/products';
import { useTasks } from './useTasks';
import { useAppointments } from './useAppointments';

export const useAiTools = () => {
    const { taskList, handleAddTask, handleToggle, handleUpdateTask } = useTasks();
    const { appointments, addAppointment, updateAppointmentStatus } = useAppointments();

    const searchProducts = useCallback((query?: string): string => {
        console.log(`Searching for products with query: "${query}"`);
        if (!query || query.trim() === '') {
            const allProducts = manufacturers.flatMap(m => m.products);
            return JSON.stringify(allProducts.slice(0, 5).map(p => ({ name: p.name, description: p.description })));
        }
        const lowercasedQuery = query.toLowerCase();
        const results: Product[] = [];
        for (const manufacturer of manufacturers) {
            for (const product of manufacturer.products) {
                if (
                    product.name.toLowerCase().includes(lowercasedQuery) ||
                    product.description.toLowerCase().includes(lowercasedQuery) ||
                    manufacturer.name.toLowerCase().includes(lowercasedQuery)
                ) {
                    results.push(product);
                }
            }
        }
        
        if (results.length === 0) {
            return JSON.stringify({ info: "Keine Produkte für diese Anfrage gefunden." });
        }
        return JSON.stringify(results.map(p => ({ name: p.name, description: p.description })));
    }, []);

    const availableTools = {
        search_products: searchProducts,
        add_task: (args: { text: string; priority: 'high' | 'medium' | 'low'; appointmentId?: string }) => {
            handleAddTask(args.text, args.priority || 'medium', args.appointmentId);
            return JSON.stringify({ success: true, message: `Aufgabe "${args.text}" wurde erstellt.` });
        },
        toggle_task_completion: (args: { taskId: number }) => {
            handleToggle(args.taskId);
            const task = taskList.find(t => t.id === args.taskId);
            return JSON.stringify({ success: true, message: `Aufgabe "${task?.text}" wurde als ${task?.completed ? 'offen' : 'erledigt'} markiert.` });
        },
        update_task: (args: { taskId: number; text?: string; priority?: 'high' | 'medium' | 'low' }) => {
            const task = taskList.find(t => t.id === args.taskId);
            if (!task) return JSON.stringify({ success: false, message: "Aufgabe nicht gefunden."});
            handleUpdateTask(args.taskId, args.text || task.text, args.priority || task.priority);
            return JSON.stringify({ success: true, message: `Aufgabe "${task.text}" wurde aktualisiert.` });
        },
        add_appointment: (args: { date: string; customer: string; address: string; reason: string; }) => {
            addAppointment(args);
            return JSON.stringify({ success: true, message: `Termin für ${args.customer} am ${new Date(args.date).toLocaleString('de-DE')} wurde erstellt.` });
        },
        update_appointment_status: (args: { appointmentId: string; status: 'completed' | 'cancelled' }) => {
            updateAppointmentStatus(args.appointmentId, args.status);
            return JSON.stringify({ success: true, message: `Termin wurde als ${args.status === 'completed' ? 'abgeschlossen' : 'storniert'} markiert.` });
        }
    };

    const getSystemPrompt = () => {
        return `Du bist Zoe, eine freundliche und hilfsbereite KI-Assistentin für Handwerker der Firma ZOE Solar. Deine Expertise liegt im Bereich Solartechnik und Photovoltaik. Antworte auf Deutsch. Sei präzise und kurz. Du kannst die Produktdatenbank mit der Funktion 'search_products' durchsuchen. Du kannst auch Aufgaben (Tasks) und Termine (Appointments) verwalten. Benutze dazu die verfügbaren Tools.
        Heutiges Datum: ${new Date().toISOString().split('T')[0]}
        Aktuelle Aufgaben: ${JSON.stringify(taskList.map(t => ({id: t.id, text: t.text, completed: t.completed, priority: t.priority, appointmentId: t.appointmentId})))}
        Aktuelle Termine: ${JSON.stringify(appointments.map(a => ({id: a.id, customer: a.customer, reason: a.reason, date: a.date, status: a.status})))}
        `;
    };

    return {
        availableTools,
        getSystemPrompt,
        taskList,
        appointments,
    };
};

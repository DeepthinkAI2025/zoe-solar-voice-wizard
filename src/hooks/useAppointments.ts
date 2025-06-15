import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export type Appointment = {
  id: string;
  date: string; // ISO string
  customer: string;
  address: string;
  reason: string;
  status: 'upcoming' | 'completed' | 'cancelled';
};

const initialAppointments: Appointment[] = [
  {
    id: '1',
    date: '2025-06-16T09:00:00',
    customer: 'Max Mustermann',
    address: 'Musterstraße 1, 12345 Musterstadt',
    reason: 'Heizungswartung',
    status: 'upcoming'
  },
  {
    id: '2',
    date: '2025-06-16T11:30:00',
    customer: 'Erika Musterfrau',
    address: 'Beispielweg 2, 54321 Beispielhausen',
    reason: 'Installation Wärmepumpe',
    status: 'upcoming'
  },
  {
    id: '3',
    date: '2025-06-17T14:00:00',
    customer: 'John Doe',
    address: 'Am Testfeld 3, 98765 Testdorf',
    reason: 'Notfall: Rohrbruch',
    status: 'upcoming'
  },
    {
    id: '4',
    date: '2025-06-15T10:00:00',
    customer: 'Peter Pan',
    address: 'Nimmerland Allee 42',
    reason: 'Sanitärinstallation',
    status: 'completed'
  },
];

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);
    const { toast } = useToast();

    const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
        const newAppointment: Appointment = {
            ...appointmentData,
            id: `appt-${Date.now()}`,
            status: 'upcoming',
        };
        setAppointments(prev => [...prev, newAppointment].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        toast({
            title: "Termin erstellt",
            description: `Termin für ${appointmentData.customer} wurde hinzugefügt.`,
        });
        setIsNewAppointmentDialogOpen(false);
    };

    const updateAppointmentStatus = (appointmentId: string, status: 'completed' | 'cancelled') => {
        setAppointments(prev =>
            prev.map(app =>
                app.id === appointmentId ? { ...app, status } : app
            )
        );
        toast({
            title: `Termin aktualisiert`,
            description: `Der Termin wurde als ${status === 'completed' ? 'abgeschlossen' : 'storniert'} markiert.`,
        });
    };

    return {
        appointments,
        addAppointment,
        updateAppointmentStatus,
        isNewAppointmentDialogOpen,
        setIsNewAppointmentDialogOpen,
    };
};

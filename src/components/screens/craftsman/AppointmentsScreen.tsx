
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, User } from 'lucide-react';

const appointments = [
  {
    id: 1,
    date: '2025-06-16T09:00:00',
    customer: 'Max Mustermann',
    address: 'Musterstraße 1, 12345 Musterstadt',
    reason: 'Heizungswartung',
    status: 'upcoming'
  },
  {
    id: 2,
    date: '2025-06-16T11:30:00',
    customer: 'Erika Musterfrau',
    address: 'Beispielweg 2, 54321 Beispielhausen',
    reason: 'Installation Wärmepumpe',
    status: 'upcoming'
  },
  {
    id: 3,
    date: '2025-06-17T14:00:00',
    customer: 'John Doe',
    address: 'Am Testfeld 3, 98765 Testdorf',
    reason: 'Notfall: Rohrbruch',
    status: 'upcoming'
  },
    {
    id: 4,
    date: '2025-06-15T10:00:00',
    customer: 'Peter Pan',
    address: 'Nimmerland Allee 42',
    reason: 'Sanitärinstallation',
    status: 'completed'
  },
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
};

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const AppointmentsScreen = () => {
    const upcomingAppointments = appointments
      .filter(a => a.status === 'upcoming' && new Date(a.date) >= new Date('2025-06-15')) // Show only future or today's appointments
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const groupedAppointments = upcomingAppointments.reduce((acc, appointment) => {
        const date = formatDate(appointment.date);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(appointment);
        return acc;
    }, {} as Record<string, typeof appointments>);

    return (
        <div className="p-4 flex-grow overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Termine</h1>
                <p className="text-muted-foreground">Ihre anstehenden Termine.</p>
            </div>
            
            {Object.keys(groupedAppointments).length > 0 ? (
                 <div className="space-y-6">
                    {Object.entries(groupedAppointments).map(([date, appointmentsForDay]) => (
                        <div key={date}>
                            <h2 className="font-semibold mb-3 text-lg">{date}</h2>
                            <div className="space-y-4">
                                {appointmentsForDay.map((appointment) => (
                                    <Card key={appointment.id} className="bg-secondary/50 border-none">
                                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                            <CardTitle className="text-base font-medium">{appointment.reason}</CardTitle>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold">{formatTime(appointment.date)} Uhr</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm pt-2">
                                            <div className="flex items-center text-muted-foreground">
                                                <User className="mr-2 h-4 w-4 shrink-0" />
                                                <span>{appointment.customer}</span>
                                            </div>
                                            <div className="flex items-center text-muted-foreground">
                                                <MapPin className="mr-2 h-4 w-4 shrink-0" />
                                                <span>{appointment.address}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                    <p>Keine anstehenden Termine.</p>
                </div>
            )}
        </div>
    );
};

export default AppointmentsScreen;

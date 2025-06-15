
import React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DeleteTaskDialogProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const DeleteTaskDialog = ({ isOpen, onCancel, onConfirm }: DeleteTaskDialogProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird die Aufgabe dauerhaft gelöscht.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className={buttonVariants({ variant: "destructive" })}>Löschen</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteTaskDialog;

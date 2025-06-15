
import React from 'react';
import Dialpad from '@/components/Dialpad';
import ContactsScreen from '@/components/screens/ContactsScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';
import type { CallHistoryItem } from '@/types/call';
import type { Agent } from '@/hooks/useAgentManagement';
import type { Contact } from '@/hooks/useContactManagement';

interface AppContentProps {
  activeTab: 'dialpad' | 'history' | 'settings';
  // History/Contacts props
  onCallSelect: (call: CallHistoryItem) => void;
  onSelectContact: (number: string) => void;
  onStartCall: (number: string, context?: string) => void;
  onStartCallManually: (number: string) => void;
  contacts: Contact[];
  addContact: (name: string, number: string) => void;
  updateContact: (id: string, name: string, number: string) => void;
  deleteContact: (id: string) => void;
  contactToEditId: string | null;
  onEditorClose: () => void;
  callHistory: CallHistoryItem[];
  
  // Settings props
  autoAnswerEnabled: boolean;
  onAutoAnswerToggle: () => void;
  workingHoursStart: string;
  onWorkingHoursStartChange: (time: string) => void;
  workingHoursEnd: string;
  onWorkingHoursEndChange: (time: string) => void;
  silentModeEnabled: boolean;
  onSilentModeToggle: () => void;
  handleInBackground: boolean;
  onHandleInBackgroundToggle: () => void;
  agents: Agent[];
  isVmActive: boolean;
  onVmToggle: () => void;
  onToggleAgent: (agentId: string) => void;
  globalSystemInstructions: string;
  onGlobalSystemInstructionsChange: (instructions: string) => void;
  onUpdateAgentDetails: (agentId: string, details: Partial<Agent>) => void;
  agentToFocusInSettings: string | null;
  setAgentToFocusInSettings: (agentId: string | null) => void;

  // Dialpad props
  onSchedule: () => void;
}

const AppContent: React.FC<AppContentProps> = ({
  activeTab,
  // History/Contacts
  onCallSelect,
  onSelectContact,
  onStartCall,
  onStartCallManually,
  contacts,
  addContact,
  updateContact,
  deleteContact,
  contactToEditId,
  onEditorClose,
  callHistory,
  // Settings
  autoAnswerEnabled,
  onAutoAnswerToggle,
  workingHoursStart,
  onWorkingHoursStartChange,
  workingHoursEnd,
  onWorkingHoursEndChange,
  silentModeEnabled,
  onSilentModeToggle,
  handleInBackground,
  onHandleInBackgroundToggle,
  agents,
  isVmActive,
  onVmToggle,
  onToggleAgent,
  globalSystemInstructions,
  onGlobalSystemInstructionsChange,
  onUpdateAgentDetails,
  agentToFocusInSettings,
  setAgentToFocusInSettings,
  // Dialpad
  onSchedule,
}) => {
  switch (activeTab) {
    case 'history':
      return <ContactsScreen 
        callHistory={callHistory}
        onCallSelect={onCallSelect} 
        onSelectContact={onSelectContact} 
        onStartCall={onStartCall} 
        onStartCallManually={onStartCallManually}
        contacts={contacts}
        addContact={addContact}
        updateContact={updateContact}
        deleteContact={deleteContact}
        contactToEditId={contactToEditId}
        onEditorClose={onEditorClose}
      />;
    case 'settings':
      return <SettingsScreen
        autoAnswerEnabled={autoAnswerEnabled}
        onAutoAnswerToggle={onAutoAnswerToggle}
        workingHoursStart={workingHoursStart}
        onWorkingHoursStartChange={onWorkingHoursStartChange}
        workingHoursEnd={workingHoursEnd}
        onWorkingHoursEndChange={onWorkingHoursEndChange}
        silentModeEnabled={silentModeEnabled}
        onSilentModeToggle={onSilentModeToggle}
        handleInBackground={handleInBackground}
        onHandleInBackgroundToggle={onHandleInBackgroundToggle}
        agents={agents}
        isVmActive={isVmActive}
        onVmToggle={onVmToggle}
        onToggleAgent={onToggleAgent}
        globalSystemInstructions={globalSystemInstructions}
        onGlobalSystemInstructionsChange={onGlobalSystemInstructionsChange}
        onUpdateAgentDetails={onUpdateAgentDetails}
        agentToFocusInSettings={agentToFocusInSettings}
        setAgentToFocusInSettings={setAgentToFocusInSettings}
      />;
    case 'dialpad':
    default:
      return <Dialpad 
        onCall={onStartCall}
        onCallManually={onStartCallManually}
        onSchedule={onSchedule}
      />;
  }
};

export default AppContent;

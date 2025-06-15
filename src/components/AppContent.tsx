
import React from 'react';
import Dialpad from '@/components/Dialpad';
import ContactsScreen from '@/components/screens/ContactsScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';
import AppointmentsScreen from '@/components/screens/craftsman/AppointmentsScreen';
import TasksScreen from '@/components/screens/craftsman/TasksScreen';
import ProductsScreen from '@/components/screens/craftsman/ProductsScreen';
import AiChatScreen from '@/components/screens/craftsman/AiChatScreen';
import type { NavItemId } from '@/hooks/usePhoneState';
import type { CallHistoryItem } from '@/types/call';
import type { AgentWithSettings } from '@/hooks/useAgentManagement';
import type { Contact } from '@/hooks/useContactManagement';

interface AppContentProps {
  activeApp: 'phone' | 'craftsman';
  activeTab: NavItemId;
  // History/Contacts props
  onCallSelect: (call: CallHistoryItem) => void;
  onSelectContact: (number: string) => void;
  onStartCall: (number: string, context?: string) => void;
  onStartCallManually: (number: string) => void;
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  contactToEditId: string | null;
  onEditorClose: () => void;
  callHistory: CallHistoryItem[];
  
  // Settings props
  autoAnswerEnabled: boolean;
  onAutoAnswerToggle: (enabled: boolean) => void;
  workingHoursStart: number;
  onWorkingHoursStartChange: (hour: number) => void;
  workingHoursEnd: number;
  onWorkingHoursEndChange: (hour: number) => void;
  silentModeEnabled: boolean;
  onSilentModeToggle: (enabled: boolean) => void;
  handleInBackground: boolean;
  onHandleInBackgroundToggle: (enabled: boolean) => void;
  agents: AgentWithSettings[];
  isVmActive: boolean;
  onVmToggle: (active: boolean) => void;
  onToggleAgent: (agentId: string, active: boolean) => void;
  globalSystemInstructions: string;
  onGlobalSystemInstructionsChange: (instructions: string) => void;
  onUpdateAgentDetails: (agentId: string, details: Partial<Omit<AgentWithSettings, 'id' | 'icon' | 'active'>>) => void;
  agentToFocusInSettings: string | null;
  setAgentToFocusInSettings: (agentId: string | null) => void;

  // Dialpad props
  onSchedule: (number: string) => void;
}

const AppContent: React.FC<AppContentProps> = ({
  activeApp,
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
  if (activeApp === 'craftsman') {
    switch (activeTab) {
      case 'termine':
        return <AppointmentsScreen />;
      case 'aufgaben':
        return <TasksScreen />;
      case 'produkte':
        return <ProductsScreen />;
      case 'ki-chat':
        return <AiChatScreen />;
      default:
        return <AppointmentsScreen />;
    }
  }

  // Phone App
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

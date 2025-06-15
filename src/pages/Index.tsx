import React from 'react';
import BottomNav from '@/components/BottomNav';
import Dialpad from '@/components/Dialpad';
import AgentSelector from '@/components/AgentSelector';
import ActiveCallView from '@/components/ActiveCallView';
import CallDetailsDrawer from '@/components/CallDetailsDrawer';
import { usePhoneState } from '@/hooks/usePhoneState';
import HistoryScreen from '@/components/screens/HistoryScreen';
import ContactsScreen from '@/components/screens/ContactsScreen';
import VoicemailScreen from '@/components/screens/VoicemailScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';
// import { contacts } from '@/data/mock';

const Index = () => {
  const {
    activeTab,
    setActiveTab,
    callState,
    showAgentSelector,
    selectedCall,
    agents,
    isVmActive,
    handleStartCall,
    handleAgentSelect,
    handleVmToggle,
    handleAgentToggle,
    handleUpdateAgentName,
    handleAcceptCallWithAI,
    handleAcceptCallManually,
    handleEndCall,
    handleIntervene,
    handleScheduleCall,
    setShowAgentSelector,
    setSelectedCall,
    handleStartCallManually,
    isUiForwarding,
    handleForward,
    // Settings
    autoAnswerEnabled,
    workingHoursStart,
    workingHoursEnd,
    silentModeEnabled,
    handleAutoAnswerToggle,
    handleWorkingHoursStartChange,
    handleWorkingHoursEndChange,
    handleSilentModeToggle,
    // Agent Settings
    globalSystemInstructions,
    setGlobalSystemInstructions,
    handleUpdateAgentDetails,
    // Contact Management
    contacts,
    addContact,
    updateContact,
    deleteContact,
    // Contact Editor State
    contactToEditId,
    openContactEditor,
    clearContactToEdit,
  } = usePhoneState();

  const handleSelectContactFromHistory = (number: string) => {
    const contact = contacts.find(c => c.number === number);
    if (contact) {
      openContactEditor(contact.id);
    }
  };

  const contactName = showAgentSelector
    ? contacts.find(c => c.number === showAgentSelector)?.name
    : undefined;
  
  const activeCallContactName = callState?.number
    ? contacts.find(c => c.number === callState.number)?.name
    : undefined;

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return <HistoryScreen 
          onCallSelect={setSelectedCall} 
          onStartCall={handleStartCall} 
          onStartCallManually={handleStartCallManually}
          onSelectContact={handleSelectContactFromHistory} 
        />;
      case 'contacts':
        return <ContactsScreen 
          onStartCall={handleStartCall} 
          onStartCallManually={handleStartCallManually}
          contacts={contacts}
          addContact={addContact}
          updateContact={updateContact}
          deleteContact={deleteContact}
          contactToEditId={contactToEditId}
          onEditorClose={clearContactToEdit}
        />;
      case 'voicemail':
        return <VoicemailScreen onVoicemailSelect={setSelectedCall} />;
      case 'settings':
        return <SettingsScreen
          autoAnswerEnabled={autoAnswerEnabled}
          onAutoAnswerToggle={handleAutoAnswerToggle}
          workingHoursStart={workingHoursStart}
          onWorkingHoursStartChange={handleWorkingHoursStartChange}
          workingHoursEnd={workingHoursEnd}
          onWorkingHoursEndChange={handleWorkingHoursEndChange}
          silentModeEnabled={silentModeEnabled}
          onSilentModeToggle={handleSilentModeToggle}
          // Agent Settings
          agents={agents}
          isVmActive={isVmActive}
          onVmToggle={handleVmToggle}
          onToggleAgent={handleAgentToggle}
          globalSystemInstructions={globalSystemInstructions}
          onGlobalSystemInstructionsChange={setGlobalSystemInstructions}
          onUpdateAgentDetails={handleUpdateAgentDetails}
        />;
      case 'dialpad':
      default:
        return <Dialpad 
          onCall={handleStartCall}
          onCallManually={handleStartCallManually}
          onSchedule={handleStartCall}
        />;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-background flex flex-col overflow-hidden rounded-3xl border-4 border-border shadow-2xl shadow-primary/20">
      <header className="flex-shrink-0 text-center py-4">
        <h1 className="text-xl font-bold text-foreground tracking-wider">ZOE <span className="text-primary">Solar</span></h1>
        <p className="text-xs text-muted-foreground">AI Phone</p>
      </header>

      <main className="flex-grow flex flex-col overflow-hidden">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} className="flex-shrink-0" />

      {showAgentSelector && (
        <AgentSelector 
            agents={agents}
            isVmActive={isVmActive}
            onToggleVm={handleVmToggle}
            onToggleAgent={handleAgentToggle}
            onUpdateAgentName={handleUpdateAgentName}
            onSelect={handleAgentSelect}
            onScheduleCall={handleScheduleCall}
            onClose={() => setShowAgentSelector(null)} 
            numberToCall={showAgentSelector}
            contactName={contactName}
        />
      )}

      {callState && (
        <ActiveCallView 
            {...callState} 
            agents={agents}
            contactName={activeCallContactName}
            onEndCall={handleEndCall}
            onAcceptCall={handleAcceptCallWithAI}
            onAcceptCallManually={handleAcceptCallManually}
            onForward={handleForward}
            onIntervene={handleIntervene}
            isForwarding={isUiForwarding}
        />
      )}

      <CallDetailsDrawer 
        call={selectedCall} 
        onClose={() => setSelectedCall(null)}
        onStartCall={handleStartCall}
        onStartCallManually={handleStartCallManually}
      />
    </div>
  );
};

export default Index;

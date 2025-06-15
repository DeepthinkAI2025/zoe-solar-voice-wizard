import React from 'react';
import BottomNav from '@/components/BottomNav';
import Dialpad from '@/components/Dialpad';
import AgentSelector from '@/components/AgentSelector';
import ActiveCallView from '@/components/ActiveCallView';
import CallWidget from '@/components/CallWidget';
import CallDetailsDrawer from '@/components/CallDetailsDrawer';
import { usePhoneState } from '@/hooks/usePhoneState';
import ContactsScreen from '@/components/screens/ContactsScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';
import { callHistory } from '@/data/mock';
import type { CallHistoryItem } from '@/types/call';

const Index = () => {
  const {
    activeTab,
    setActiveTab,
    activeCall,
    agentSelectorState,
    closeAgentSelector,
    selectedCall,
    agents,
    isVmActive,
    handleStartCall,
    handleAgentSelect,
    handleVmToggle,
    handleAgentToggle,
    handleUpdateAgentName,
    handleAcceptCallWithAI,
    acceptCallManually,
    endCall,
    interveneInCall,
    handleScheduleCall,
    setSelectedCall,
    handleStartCallManually,
    isForwarding,
    forwardCall,
    isCallMinimized,
    setIsCallMinimized,
    duration,
    // Settings
    autoAnswerEnabled,
    workingHoursStart,
    workingHoursEnd,
    silentModeEnabled,
    handleInBackground,
    handleAutoAnswerToggle,
    handleWorkingHoursStartChange,
    handleWorkingHoursEndChange,
    handleSilentModeToggle,
    handleHandleInBackgroundToggle,
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
    agentToFocusInSettings,
    setAgentToFocusInSettings,
  } = usePhoneState();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleSelectContactFromHistory = (number: string) => {
    const contact = contacts.find(c => c.number === number);
    if (contact) {
      openContactEditor(contact.id);
    }
  };

  const contactName = agentSelectorState?.number
    ? contacts.find(c => c.number === agentSelectorState.number)?.name
    : undefined;
  
  const activeCallContactName = activeCall?.number
    ? contacts.find(c => c.number === activeCall.number)?.name
    : undefined;
  
  const activeCallAgent = activeCall?.agentId ? agents.find(a => a.id === activeCall.agentId) : undefined;

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return <ContactsScreen 
          callHistory={callHistory}
          onCallSelect={(call: CallHistoryItem) => setSelectedCall(call)} 
          onSelectContact={handleSelectContactFromHistory} 
          onStartCall={handleStartCall} 
          onStartCallManually={handleStartCallManually}
          contacts={contacts}
          addContact={addContact}
          updateContact={updateContact}
          deleteContact={deleteContact}
          contactToEditId={contactToEditId}
          onEditorClose={clearContactToEdit}
        />;
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
          handleInBackground={handleInBackground}
          onHandleInBackgroundToggle={handleHandleInBackgroundToggle}
          // Agent Settings
          agents={agents}
          isVmActive={isVmActive}
          onVmToggle={handleVmToggle}
          onToggleAgent={handleAgentToggle}
          globalSystemInstructions={globalSystemInstructions}
          onGlobalSystemInstructionsChange={setGlobalSystemInstructions}
          onUpdateAgentDetails={handleUpdateAgentDetails}
          agentToFocusInSettings={agentToFocusInSettings}
          setAgentToFocusInSettings={setAgentToFocusInSettings}
        />;
      case 'dialpad':
      default:
        return <Dialpad 
          onCall={handleStartCall}
          onCallManually={handleStartCallManually}
          onSchedule={handleScheduleCall}
        />;
    }
  };

  return (
    <div ref={containerRef} className="h-screen w-full max-w-md mx-auto bg-background flex flex-col relative rounded-3xl border-4 border-border shadow-2xl shadow-primary/20">
      <header className="flex-shrink-0 py-4 px-6 flex justify-between items-center">
        <img src="/lovable-uploads/5cbdb31b-130f-40f1-9ead-f812366683b2.png" alt="Zoe Logo" className="h-12" />
        <img src="/lovable-uploads/526a4663-c366-4462-a3e2-2713130c98ff.png" alt="Fapro Logo" className="h-12" />
      </header>

      <main className="flex-grow flex flex-col overflow-hidden">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} className="flex-shrink-0" />

      {agentSelectorState && (
        <AgentSelector 
            agents={agents}
            isVmActive={isVmActive}
            onToggleVm={handleVmToggle}
            onToggleAgent={handleAgentToggle}
            onUpdateAgentName={handleUpdateAgentName}
            onSelect={handleAgentSelect}
            onScheduleCall={handleScheduleCall}
            onClose={closeAgentSelector} 
            numberToCall={agentSelectorState.number}
            contactName={contactName}
            context={agentSelectorState.context}
        />
      )}

      {activeCall && !isCallMinimized && (
        <ActiveCallView 
            {...activeCall} 
            duration={duration}
            agents={agents}
            contactName={activeCallContactName}
            onEndCall={endCall}
            onAcceptCall={handleAcceptCallWithAI}
            onAcceptCallManually={acceptCallManually}
            onForward={forwardCall}
            onIntervene={interveneInCall}
            isForwarding={isForwarding}
            onMinimize={() => setIsCallMinimized(true)}
        />
      )}
      
      {activeCall && isCallMinimized && (
        <CallWidget
          callState={activeCall}
          contactName={activeCallContactName}
          agent={activeCallAgent}
          duration={duration}
          onMaximize={() => setIsCallMinimized(false)}
          onEndCall={endCall}
          dragConstraints={containerRef}
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


import React from 'react';
import BottomNav from '@/components/BottomNav';
import AgentSelector from '@/components/AgentSelector';
import ActiveCallView from '@/components/ActiveCallView';
import CallWidget from '@/components/CallWidget';
import CallDetailsDrawer from '@/components/CallDetailsDrawer';
import { usePhoneState } from '@/hooks/usePhoneState';
import { callHistory } from '@/data/mock';
import AppHeader from '@/components/AppHeader';
import AppContent from '@/components/AppContent';
import { AnimatePresence, motion } from 'framer-motion';
import AppSwitcher from '@/components/AppSwitcher';

const Index = () => {
  const phoneState = usePhoneState();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleSelectContactFromHistory = (number: string) => {
    const contact = phoneState.contacts.find(c => c.number === number);
    if (contact) {
      phoneState.openContactEditor(contact.id);
    }
  };

  const contactName = phoneState.agentSelectorState?.number
    ? phoneState.contacts.find(c => c.number === phoneState.agentSelectorState.number)?.name
    : undefined;
  
  const activeCallContactName = phoneState.activeCall?.number
    ? phoneState.contacts.find(c => c.number === phoneState.activeCall.number)?.name
    : undefined;
  
  const activeCallAgent = phoneState.activeCall?.agentId ? phoneState.agents.find(a => a.id === phoneState.activeCall.agentId) : undefined;

  return (
    <div ref={containerRef} className="h-screen w-full max-w-md mx-auto bg-background flex flex-col relative rounded-3xl border-4 border-border shadow-2xl shadow-primary/20 overflow-hidden">
      <AppHeader
        activeApp={phoneState.activeApp}
        activeTab={phoneState.activeTab}
        onSwitchApp={phoneState.switchApp}
      />
      <AppSwitcher onClick={phoneState.switchApp} activeApp={phoneState.activeApp} />
      <main className="flex-grow flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={phoneState.activeApp}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col overflow-hidden"
          >
            <AppContent
              activeApp={phoneState.activeApp}
              activeTab={phoneState.activeTab}
              callHistory={callHistory}
              onCallSelect={phoneState.setSelectedCall}
              onSelectContact={handleSelectContactFromHistory}
              onStartCall={phoneState.handleStartCall}
              onStartCallManually={phoneState.handleStartCallManually}
              contacts={phoneState.contacts}
              addContact={phoneState.addContact}
              updateContact={phoneState.updateContact}
              deleteContact={phoneState.deleteContact}
              contactToEditId={phoneState.contactToEditId}
              onEditorClose={phoneState.clearContactToEdit}
              autoAnswerEnabled={phoneState.autoAnswerEnabled}
              onAutoAnswerToggle={phoneState.handleAutoAnswerToggle}
              workingHoursStart={phoneState.workingHoursStart}
              onWorkingHoursStartChange={phoneState.handleWorkingHoursStartChange}
              workingHoursEnd={phoneState.workingHoursEnd}
              onWorkingHoursEndChange={phoneState.handleWorkingHoursEndChange}
              silentModeEnabled={phoneState.silentModeEnabled}
              onSilentModeToggle={phoneState.handleSilentModeToggle}
              handleInBackground={phoneState.handleInBackground}
              onHandleInBackgroundToggle={phoneState.handleHandleInBackgroundToggle}
              agents={phoneState.agents}
              isVmActive={phoneState.isVmActive}
              onVmToggle={phoneState.handleVmToggle}
              onToggleAgent={phoneState.handleAgentToggle}
              globalSystemInstructions={phoneState.globalSystemInstructions}
              onGlobalSystemInstructionsChange={phoneState.setGlobalSystemInstructions}
              onUpdateAgentDetails={phoneState.handleUpdateAgentDetails}
              agentToFocusInSettings={phoneState.agentToFocusInSettings}
              setAgentToFocusInSettings={phoneState.setAgentToFocusInSettings}
              onSchedule={phoneState.handleScheduleCall}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav 
        activeApp={phoneState.activeApp}
        activeTab={phoneState.activeTab} 
        setActiveTab={phoneState.setActiveTab} 
        className="flex-shrink-0" 
      />

      {phoneState.agentSelectorState && (
        <AgentSelector 
            agents={phoneState.agents}
            isVmActive={phoneState.isVmActive}
            onToggleVm={phoneState.handleVmToggle}
            onToggleAgent={phoneState.handleAgentToggle}
            onUpdateAgentName={phoneState.handleUpdateAgentName}
            onSelect={phoneState.handleAgentSelect}
            onScheduleCall={phoneState.handleScheduleCall}
            onClose={phoneState.closeAgentSelector} 
            numberToCall={phoneState.agentSelectorState.number}
            contactName={contactName}
            context={phoneState.agentSelectorState.context}
        />
      )}

      {phoneState.activeCall && !phoneState.isCallMinimized && (
        <ActiveCallView 
            {...phoneState.activeCall} 
            duration={phoneState.duration}
            agents={phoneState.agents}
            contactName={activeCallContactName}
            onEndCall={phoneState.endCall}
            onAcceptCall={phoneState.handleAcceptCallWithAI}
            onAcceptCallManually={phoneState.acceptCallManually}
            onForward={phoneState.forwardCall}
            onIntervene={phoneState.interveneInCall}
            isForwarding={phoneState.isForwarding}
            onMinimize={() => phoneState.setIsCallMinimized(true)}
        />
      )}
      
      {phoneState.activeCall && phoneState.isCallMinimized && (
        <CallWidget
          callState={phoneState.activeCall}
          contactName={activeCallContactName}
          agent={activeCallAgent}
          duration={phoneState.duration}
          onMaximize={() => phoneState.setIsCallMinimized(false)}
          onEndCall={phoneState.endCall}
          dragConstraints={containerRef}
        />
      )}

      <CallDetailsDrawer 
        call={phoneState.selectedCall} 
        onClose={() => phoneState.setSelectedCall(null)}
        onStartCall={phoneState.handleStartCall}
        onStartCallManually={phoneState.handleStartCallManually}
      />
    </div>
  );
};

export default Index;

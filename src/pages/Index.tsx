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
    handleScheduleCall,
    setShowAgentSelector,
    setSelectedCall,
    handleStartCallManually,
    // Settings
    autoAnswerEnabled,
    workingHoursStart,
    workingHoursEnd,
    silentModeEnabled,
    handleAutoAnswerToggle,
    handleWorkingHoursStartChange,
    handleWorkingHoursEndChange,
    handleSilentModeToggle,
  } = usePhoneState();

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return <HistoryScreen 
          onCallSelect={setSelectedCall} 
          onStartCall={handleStartCall} 
          onStartCallManually={handleStartCallManually} 
        />;
      case 'contacts':
        return <ContactsScreen 
          onStartCall={handleStartCall} 
          onStartCallManually={handleStartCallManually} 
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
    <div className="h-screen w-full max-w-md mx-auto bg-black flex flex-col overflow-hidden rounded-3xl border-4 border-white/10 shadow-2xl shadow-primary/20">
      <header className="flex-shrink-0 text-center py-4">
        <h1 className="text-xl font-bold text-white tracking-wider">ZOE <span className="text-primary">Solar</span></h1>
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
        />
      )}

      {callState && (
        <ActiveCallView 
            {...callState} 
            agents={agents}
            onEndCall={handleEndCall}
            onAcceptCall={handleAcceptCallWithAI}
            onAcceptCallManually={handleAcceptCallManually}
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

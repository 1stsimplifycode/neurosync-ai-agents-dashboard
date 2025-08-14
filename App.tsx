import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingScreen } from './components/LandingScreen';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { AgentsOverview } from './components/AgentsOverview';
import { ScalabilityMap } from './components/ScalabilityMap';
import { TechStackExplorer } from './components/TechStackExplorer';
import { BenefitsSection } from './components/BenefitsSection';
import { AtosBenefitsDashboard } from './components/AtosBenefitsDashboard';
import { BeforeAfterComparison } from './components/BeforeAfterComparison';
import { ClosingVision } from './components/ClosingVision';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [screenHistory, setScreenHistory] = useState(['landing']);

  const navigateToScreen = (screen) => {
    setCurrentScreen(screen);
    setScreenHistory(prev => [...prev, screen]);
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = screenHistory.slice(0, -1);
      setScreenHistory(newHistory);
      setCurrentScreen(newHistory[newHistory.length - 1]);
    }
  };

  const restartDemo = () => {
    setCurrentScreen('landing');
    setScreenHistory(['landing']);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingScreen onNavigate={navigateToScreen} />;
      case 'workflow-builder':
        return <WorkflowBuilder onNavigate={navigateToScreen} onBack={goBack} />;
      case 'agents-overview':
        return <AgentsOverview onNavigate={navigateToScreen} onBack={goBack} />;
      case 'scalability-map':
        return <ScalabilityMap onNavigate={navigateToScreen} onBack={goBack} />;
      case 'tech-stack':
        return <TechStackExplorer onNavigate={navigateToScreen} onBack={goBack} />;
      case 'benefits':
        return <BenefitsSection onNavigate={navigateToScreen} onBack={goBack} />;
      case 'atos-benefits':
        return <AtosBenefitsDashboard onNavigate={navigateToScreen} onBack={goBack} />;
      case 'before-after':
        return <BeforeAfterComparison onNavigate={navigateToScreen} onBack={goBack} />;
      case 'closing':
        return <ClosingVision onRestart={restartDemo} />;
      default:
        return <LandingScreen onNavigate={navigateToScreen} />;
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
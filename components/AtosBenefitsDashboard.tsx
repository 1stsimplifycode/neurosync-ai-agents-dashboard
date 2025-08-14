import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Recycle, Zap, TrendingUp, Lock, Shield, Award } from 'lucide-react';

const ATOS_BENEFITS = [
  {
    id: 'knowledge-reuse',
    title: 'Knowledge Reuse',
    icon: Recycle,
    color: 'from-green-400 to-green-600',
    description: 'Capture and reuse expert knowledge across projects',
    scenario: {
      title: 'Project Acceleration Scenario',
      before: 'New blockchain project starts from scratch, 6-month timeline',
      after: 'Reuses captured crypto expertise, reduces to 3.5 months',
      metrics: {
        'Time Saved': '42% reduction',
        'Quality Score': '94% vs 87%',
        'Resource Efficiency': '67% improvement'
      },
      details: 'When Atos starts a new blockchain project, instead of beginning with research and trial-and-error, the team immediately accesses captured knowledge from previous successful implementations. This includes architectural decisions, common pitfalls, proven patterns, and expert insights.'
    }
  },
  {
    id: 'faster-setup',
    title: 'Faster Setup',
    icon: Zap,
    color: 'from-blue-400 to-blue-600',
    description: 'Accelerate project initiation and team onboarding',
    scenario: {
      title: 'Rapid Deployment Scenario',
      before: 'Cloud migration setup takes 3 weeks with expert consultation',
      after: 'AI-guided setup completes in 5 days with automated best practices',
      metrics: {
        'Setup Time': '70% faster',
        'Error Rate': '80% reduction',
        'Expert Hours': '60% savings'
      },
      details: 'For cloud migrations, Atos teams get instant access to proven setup procedures, configuration templates, and deployment checklists. The AI guides them through each step, preventing common mistakes and ensuring best practices from day one.'
    }
  },
  {
    id: 'stronger-offers',
    title: 'Stronger Offers',
    icon: TrendingUp,
    color: 'from-purple-400 to-purple-600',
    description: 'Create compelling proposals with proven methodologies',
    scenario: {
      title: 'Competitive Advantage Scenario',
      before: 'Generic proposal based on standard templates',
      after: 'Data-driven proposal with specific success metrics and proven approaches',
      metrics: {
        'Win Rate': '34% increase',
        'Proposal Quality': '89% client satisfaction',
        'Time to Market': '45% faster'
      },
      details: 'When bidding for a smart city project, Atos can instantly reference successful implementations, include specific performance metrics, showcase proven methodologies, and provide realistic timelines based on actual project data rather than estimates.'
    }
  },
  {
    id: 'ip-ownership',
    title: 'IP Ownership',
    icon: Lock,
    color: 'from-orange-400 to-orange-600',
    description: 'Build proprietary AI workflows as competitive assets',
    scenario: {
      title: 'Intellectual Property Scenario',
      before: 'Solutions rely on generic industry practices',
      after: 'Proprietary AI-enhanced methodologies unique to Atos',
      metrics: {
        'Unique Processes': '47 proprietary workflows',
        'Competitive Moat': 'Impossible to replicate',
        'Value Creation': '€12M additional revenue'
      },
      details: 'Atos develops unique AI-powered processes for supply chain optimization that competitors cannot replicate. These become valuable intellectual property, creating sustainable competitive advantages and new revenue streams through licensing opportunities.'
    }
  },
  {
    id: 'safer-delivery',
    title: 'Safer Delivery',
    icon: Shield,
    color: 'from-red-400 to-red-600',
    description: 'Reduce risks with battle-tested processes',
    scenario: {
      title: 'Risk Mitigation Scenario',
      before: 'High-stakes digital transformation with unknown risks',
      after: 'AI-guided delivery with predictive risk management',
      metrics: {
        'Risk Incidents': '73% reduction',
        'Project Success': '96% vs 78%',
        'Client Satisfaction': '94% rating'
      },
      details: 'For a critical banking transformation, Atos uses AI to predict potential risks based on similar past projects, automatically flagging issues before they occur, and providing proven mitigation strategies from successful implementations.'
    }
  },
  {
    id: 'industry-leadership',
    title: 'Industry Leadership',
    icon: Award,
    color: 'from-cyan-400 to-cyan-600',
    description: 'Position Atos as the AI-native consulting leader',
    scenario: {
      title: 'Market Position Scenario',
      before: 'Traditional consulting approach in competitive market',
      after: 'First AI-native consultant with unique value proposition',
      metrics: {
        'Market Share': '23% growth',
        'Premium Pricing': '35% above market',
        'Client Retention': '94% vs 82%'
      },
      details: 'Atos becomes the only consultant that can guarantee knowledge transfer, provide AI-enhanced delivery, and continuously improve client outcomes. This unique positioning commands premium pricing and attracts top-tier clients seeking innovative solutions.'
    }
  }
];

export const AtosBenefitsDashboard = ({ onNavigate, onBack }) => {
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [showScenario, setShowScenario] = useState(false);

  const handleBenefitClick = (benefit) => {
    setSelectedBenefit(benefit);
    setShowScenario(true);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-white">Atos Benefits Dashboard</h1>
              <p className="text-blue-200">Strategic advantages for Atos with NeuroSync implementation</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => onNavigate('before-after')}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10"
            >
              Before & After
            </Button>
            <Button
              onClick={() => onNavigate('closing')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              View Vision
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {ATOS_BENEFITS.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() => handleBenefitClick(benefit)}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center`}>
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{benefit.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-blue-200 leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <div className="text-sm text-blue-100 mb-2">Expected Impact</div>
                    <div className="space-y-1">
                      {Object.entries(benefit.scenario.metrics).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-blue-200">{key}</span>
                          <span className="text-cyan-400 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBenefitClick(benefit);
                    }}
                  >
                    View Scenario
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary Statistics */}
        <Card className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-white text-center mb-6">
              Projected Annual Impact for Atos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">€47M</div>
                <div className="text-blue-200 text-sm">Additional Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">67%</div>
                <div className="text-blue-200 text-sm">Efficiency Gain</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">94%</div>
                <div className="text-blue-200 text-sm">Project Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">23%</div>
                <div className="text-blue-200 text-sm">Market Share Growth</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Overlay Modal */}
      <AnimatePresence>
        {showScenario && selectedBenefit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowScenario(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-purple-900/95 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-4xl w-full mx-8 max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedBenefit.color} flex items-center justify-center`}>
                  <selectedBenefit.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">{selectedBenefit.scenario.title}</h2>
                  <p className="text-blue-200">{selectedBenefit.title} Implementation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Before/After Comparison */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Before vs After</h3>
                  <div className="space-y-4">
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-300 font-medium text-sm">Before NeuroSync</span>
                      </div>
                      <p className="text-blue-100 text-sm">{selectedBenefit.scenario.before}</p>
                    </div>
                    
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-300 font-medium text-sm">With NeuroSync</span>
                      </div>
                      <p className="text-blue-100 text-sm">{selectedBenefit.scenario.after}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-white font-medium mb-3">Implementation Details</h4>
                    <div className="bg-white/5 rounded-lg p-4 border-l-4 border-cyan-400">
                      <p className="text-blue-100 text-sm leading-relaxed">
                        {selectedBenefit.scenario.details}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Impact Metrics</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedBenefit.scenario.metrics).map(([metric, value]) => (
                      <motion.div
                        key={metric}
                        className="bg-white/10 rounded-lg p-4 border border-white/10"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-blue-200 text-sm font-medium">{metric}</span>
                          <span className="text-xl font-bold text-white">{value}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full bg-gradient-to-r ${selectedBenefit.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-500/30">
                    <h4 className="text-cyan-400 font-medium mb-2">Strategic Value</h4>
                    <p className="text-blue-100 text-sm">
                      This implementation creates lasting competitive advantages that compound over time, 
                      building unique capabilities that competitors cannot easily replicate.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <Button
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/10"
                  onClick={() => setShowScenario(false)}
                >
                  Close
                </Button>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      setShowScenario(false);
                      onNavigate('workflow-builder');
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600"
                  >
                    Build This Workflow
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
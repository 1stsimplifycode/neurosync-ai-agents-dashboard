import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { ArrowLeft, Search, Play, Database, Users, TrendingUp, Settings } from 'lucide-react';

const DETAILED_AGENTS = [
  {
    id: 'observer',
    name: 'Observer Agent',
    icon: '👁️',
    color: 'from-green-400 to-emerald-600',
    description: 'Monitors expert workflows with permission, capturing process steps, timing, and contextual data.',
    purpose: 'Watches experts work with permission to capture valuable knowledge and processes.',
    example: 'Watches how a fraud analyst investigates a suspicious transaction, recording each step: database queries, decision criteria, escalation triggers, and time spent on each phase.',
    features: ['Passive tracking', 'Contextual tagging', 'Privacy controls', 'Real-time monitoring'],
    metrics: {
      active: 12,
      captured: 847,
      accuracy: 94.7
    },
    interactions: [
      'Drag into Workflow Builder to auto-link with Memory Agent',
      'Configure monitoring parameters',
      'Set up privacy permissions'
    ]
  },
  {
    id: 'memory',
    name: 'Memory Agent',
    icon: '🧠',
    color: 'from-blue-400 to-blue-600',
    description: 'Stores workflows and decision logic in a searchable knowledge graph.',
    purpose: 'Stores workflows and decision logic with metadata for easy retrieval and reuse.',
    example: 'Saves "Escalate if weekend + high amount" rule with complete context: when it applies, why it was created, success rate, and related decision patterns.',
    features: ['Neo4j + AI embeddings', 'Keyword search', 'Reusable logic blocks', 'Decision patterns'],
    metrics: {
      stored: 2847,
      retrieved: 1240,
      reused: 67
    },
    interactions: [
      'Search stored decisions and patterns',
      'Create new knowledge entries',
      'Link related decisions'
    ],
    searchable: true
  },
  {
    id: 'replica',
    name: 'Replica Agent',
    icon: '🤖',
    color: 'from-purple-400 to-purple-600',
    description: 'Recreates expert logic into ready-to-use workflows.',
    purpose: 'Creates digital replicas of expert workflows that can be deployed and executed.',
    example: 'Generates a fraud-check workflow mirroring top analyst methods: data gathering, pattern analysis, risk scoring, and decision logic - ready for immediate deployment.',
    features: ['Workflow synthesis', 'Context adaptation', 'Instant deployment', 'Performance tracking'],
    metrics: {
      replicas: 23,
      deployed: 18,
      success: 89.3
    },
    interactions: [
      'Drag into Workflow Builder to auto-generate steps',
      'Configure replica parameters',
      'Deploy to production systems'
    ]
  },
  {
    id: 'teacher',
    name: 'Teacher Agent',
    icon: '🎓',
    color: 'from-orange-400 to-orange-600',
    description: 'Trains new staff using real expert approaches in simulations.',
    purpose: 'Trains new team members using captured expert knowledge and adaptive learning paths.',
    example: 'Guides a new analyst step-by-step through fraud detection: "First, check transaction patterns. Notice the timing anomaly? That\'s a red flag. Now verify the merchant..."',
    features: ['Adaptive learning', 'Interactive guidance', 'Gamified training', 'Progress tracking'],
    metrics: {
      trained: 156,
      completed: 134,
      satisfaction: 4.8
    },
    interactions: [
      'Start interactive training simulation',
      'Customize learning paths',
      'Track progress and performance'
    ],
    hasSimulation: true
  },
  {
    id: 'evolver',
    name: 'Evolver Agent',
    icon: '🔄',
    color: 'from-teal-400 to-teal-600',
    description: 'Analyzes workflows for inefficiencies and suggests improvements.',
    purpose: 'Continuously improves processes based on new data, outcomes, and changing conditions.',
    example: 'Flags "Step 3 takes too long — automate low-risk cases" and provides specific optimization: "Move manual review to high-risk only, saving 40% processing time."',
    features: ['Performance analytics', 'Process optimization triggers', 'A/B testing', 'Continuous monitoring'],
    metrics: {
      optimized: 34,
      timeSaved: 127,
      efficiency: 23.5
    },
    interactions: [
      'Drag into workflow to trigger improvement suggestions',
      'Review optimization recommendations',
      'Implement performance enhancements'
    ]
  }
];

export const AgentsOverview = ({ onNavigate, onBack }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [simulationStep, setSimulationStep] = useState(0);
  const [showSimulation, setShowSimulation] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Simulate search results
      const mockResults = [
        'Escalate if weekend + high amount',
        'Fraud pattern: Multiple small transactions',
        'Customer verification protocol',
        'Risk scoring methodology'
      ].filter(result => result.toLowerCase().includes(query.toLowerCase()));
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  const startSimulation = () => {
    setShowSimulation(true);
    setSimulationStep(0);
  };

  const nextSimulationStep = () => {
    if (simulationStep < 2) {
      setSimulationStep(prev => prev + 1);
    } else {
      setShowSimulation(false);
      setSimulationStep(0);
    }
  };

  const simulationSteps = [
    {
      title: "Assess Current Skills",
      description: "The Teacher Agent evaluates your existing knowledge in fraud detection.",
      action: "Analyzing your response patterns..."
    },
    {
      title: "Customize Training Path",
      description: "Based on expert knowledge, a personalized learning path is created.",
      action: "Building your custom curriculum..."
    },
    {
      title: "Interactive Guidance",
      description: "Real-time coaching using proven expert methodologies.",
      action: "Starting hands-on training session..."
    }
  ];

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
              <h1 className="text-2xl font-semibold text-white">AI Agents Overview</h1>
              <p className="text-blue-200">Detailed exploration of NeuroSync's intelligent agents</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => onNavigate('workflow-builder')}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10"
            >
              Build Workflow
            </Button>
            <Button
              onClick={() => onNavigate('scalability-map')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              View Scalability
            </Button>
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {DETAILED_AGENTS.map((agent) => (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer h-full"
                onClick={() => setSelectedAgent(agent)}
              >
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${agent.color} flex items-center justify-center text-2xl`}>
                      {agent.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">{agent.name}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-green-400">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                          Active
                        </div>
                        <div className="text-blue-200">
                          <Database className="w-3 h-3 inline mr-1" />
                          {agent.metrics.active || agent.metrics.stored || agent.metrics.replicas || agent.metrics.trained || agent.metrics.optimized}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-blue-200 leading-relaxed mb-4">
                    {agent.description}
                  </CardDescription>
                  
                  <div className="space-y-2">
                    {agent.features.slice(0, 2).map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-blue-100">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white hover:from-cyan-500/30 hover:to-purple-500/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAgent(agent);
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-900/30 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Collaborative Workflows</h3>
              <p className="text-blue-200 text-sm mb-4">Agents work together seamlessly</p>
              <Button
                onClick={() => onNavigate('workflow-builder')}
                variant="outline"
                size="sm"
                className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10"
              >
                Build Together
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/30 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Performance Analytics</h3>
              <p className="text-blue-200 text-sm mb-4">Track and optimize efficiency</p>
              <Button
                onClick={() => onNavigate('scalability-map')}
                variant="outline"
                size="sm"
                className="text-purple-400 border-purple-400/30 hover:bg-purple-400/10"
              >
                View Metrics
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-teal-900/30 border-teal-500/30">
            <CardContent className="p-6 text-center">
              <Settings className="w-8 h-8 text-teal-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Enterprise Integration</h3>
              <p className="text-blue-200 text-sm mb-4">Connect with existing systems</p>
              <Button
                onClick={() => onNavigate('tech-stack')}
                variant="outline"
                size="sm"
                className="text-teal-400 border-teal-400/30 hover:bg-teal-400/10"
              >
                Explore Tech
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agent Detail Modal */}
      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="max-w-4xl h-[80vh] bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-purple-900/95 backdrop-blur-lg border-white/20 text-white overflow-auto">
          {selectedAgent && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedAgent.color} flex items-center justify-center text-2xl`}>
                    {selectedAgent.icon}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl text-white">{selectedAgent.name}</DialogTitle>
                    <p className="text-blue-200">{selectedAgent.purpose}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Real-World Example</h3>
                    <div className="bg-white/10 rounded-lg p-4 border-l-4 border-cyan-400">
                      <p className="text-blue-100 leading-relaxed">{selectedAgent.example}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedAgent.features.map((feature) => (
                        <div key={feature} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-sm text-blue-100">{feature}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Interactive Features */}
                  {selectedAgent.searchable && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Search Stored Knowledge</h3>
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                          <Input
                            placeholder="Search decisions, patterns, rules..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder-blue-300"
                          />
                        </div>
                        {searchResults.length > 0 && (
                          <div className="bg-white/10 rounded-lg border border-white/20">
                            {searchResults.map((result, index) => (
                              <div key={index} className="p-3 border-b border-white/10 last:border-b-0 hover:bg-white/5 cursor-pointer">
                                <div className="text-sm text-blue-100">{result}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedAgent.hasSimulation && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Training Simulation</h3>
                      <Button
                        onClick={startSimulation}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start 3-Step Training
                      </Button>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(selectedAgent.metrics).map(([key, value]) => (
                        <div key={key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex justify-between items-center">
                            <span className="text-blue-200 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-xl font-semibold text-white">
                              {typeof value === 'number' && value < 100 ? `${value}%` : value.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${selectedAgent.color}`}
                              style={{ width: `${typeof value === 'number' && value < 100 ? value : Math.min(value / 10, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Interactive Options</h3>
                    <div className="space-y-3">
                      {selectedAgent.interactions.map((interaction, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
                          <div className="text-sm text-blue-100">{interaction}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        setSelectedAgent(null);
                        onNavigate('workflow-builder');
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
                    >
                      Add to Workflow
                    </Button>
                    <Button
                      variant="outline"
                      className="text-white border-white/30 hover:bg-white/10"
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Training Simulation Modal */}
      <Dialog open={showSimulation} onOpenChange={() => setShowSimulation(false)}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-orange-900/95 via-orange-800/95 to-red-900/95 backdrop-blur-lg border-orange-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Teacher Agent Training Simulation</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {simulationSteps.map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= simulationStep ? 'bg-orange-500' : 'bg-white/20'
                  }`}>
                    {index + 1}
                  </div>
                  {index < simulationSteps.length - 1 && (
                    <div className={`w-12 h-0.5 ${index < simulationStep ? 'bg-orange-500' : 'bg-white/20'}`}></div>
                  )}
                </div>
              ))}
            </div>

            <motion.div
              key={simulationStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">{simulationSteps[simulationStep].title}</h3>
              <p className="text-orange-100">{simulationSteps[simulationStep].description}</p>
              <div className="bg-orange-900/50 rounded-lg p-4">
                <div className="text-sm text-orange-200">{simulationSteps[simulationStep].action}</div>
                <div className="w-full bg-orange-800/50 rounded-full h-2 mt-3">
                  <motion.div 
                    className="h-2 rounded-full bg-orange-400"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                  ></motion.div>
                </div>
              </div>
            </motion.div>

            <Button
              onClick={nextSimulationStep}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {simulationStep < 2 ? 'Next Step' : 'Complete Training'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
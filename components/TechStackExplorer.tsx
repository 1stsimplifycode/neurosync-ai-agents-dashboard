import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Layers, Database, Cpu, Shield, Cloud, Zap } from 'lucide-react';

const TECH_LAYERS = [
  {
    id: 'ai-helpers',
    name: 'AI Helpers',
    description: 'Intelligent agents that understand and assist',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    technologies: ['Natural Language Processing', 'Computer Vision', 'Decision Trees', 'Pattern Recognition'],
    details: 'Advanced AI models that interpret user intent, process natural language queries, and provide intelligent assistance.'
  },
  {
    id: 'observers-memory',
    name: 'Observers & Memory',
    description: 'Knowledge capture and storage systems',
    icon: Database,
    color: 'from-blue-400 to-blue-600',
    technologies: ['Neo4j Graph Database', 'Vector Embeddings', 'Knowledge Graphs', 'Real-time Monitoring'],
    details: 'Sophisticated systems for capturing expert knowledge, storing decision patterns, and creating searchable knowledge repositories.'
  },
  {
    id: 'execution-tools',
    name: 'Execution Tools',
    description: 'Workflow automation and process execution',
    icon: Cpu,
    color: 'from-green-400 to-green-600',
    technologies: ['Workflow Engine', 'API Orchestration', 'Event Processing', 'Task Automation'],
    details: 'Robust execution environment for running automated workflows, managing complex processes, and integrating with existing systems.'
  },
  {
    id: 'ai-brain',
    name: 'AI Brain',
    description: 'Central intelligence and decision making',
    icon: Layers,
    color: 'from-purple-400 to-purple-600',
    technologies: ['Machine Learning Models', 'Neural Networks', 'Ensemble Methods', 'Adaptive Learning'],
    details: 'Core AI engine that makes intelligent decisions, learns from patterns, and continuously improves system performance.'
  },
  {
    id: 'security-deployment',
    name: 'Security & Deployment',
    description: 'Enterprise security and cloud infrastructure',
    icon: Shield,
    color: 'from-red-400 to-red-600',
    technologies: ['Zero Trust Security', 'Kubernetes', 'Docker', 'AWS/Azure/GCP'],
    details: 'Enterprise-grade security frameworks and scalable cloud deployment infrastructure for reliable operation.'
  }
];

export const TechStackExplorer = ({ onNavigate, onBack }) => {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [layers, setLayers] = useState(TECH_LAYERS);
  const [draggedLayer, setDraggedLayer] = useState(null);
  const [customView, setCustomView] = useState(false);

  const handleDragStart = (e, layer) => {
    setDraggedLayer(layer);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedLayer) return;

    const draggedIndex = layers.findIndex(l => l.id === draggedLayer.id);
    const newLayers = [...layers];
    
    // Remove dragged item
    const [removed] = newLayers.splice(draggedIndex, 1);
    // Insert at new position
    newLayers.splice(targetIndex, 0, removed);
    
    setLayers(newLayers);
    setDraggedLayer(null);
    setCustomView(true);
  };

  const resetToDefault = () => {
    setLayers(TECH_LAYERS);
    setCustomView(false);
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
              <h1 className="text-2xl font-semibold text-white">Tech Stack Explorer</h1>
              <p className="text-blue-200">Interactive architecture visualization and customization</p>
            </div>
          </div>
          <div className="flex space-x-3">
            {customView && (
              <Button
                onClick={resetToDefault}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                Reset to Default
              </Button>
            )}
            <Button
              onClick={() => onNavigate('benefits')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              View Benefits
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Left Panel - Layer Stack */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Architecture Layers</h2>
              <p className="text-blue-200">
                {customView ? 'Custom view - drag layers to reorder' : 'Click to expand layers, drag to reorder for custom views'}
              </p>
            </div>

            <div className="relative">
              {/* Layer Stack */}
              <div className="space-y-4">
                {layers.map((layer, index) => (
                  <motion.div
                    key={layer.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, layer)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="cursor-move"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    <Card 
                      className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 ${
                        selectedLayer?.id === layer.id ? 'ring-2 ring-cyan-400' : ''
                      }`}
                      onClick={() => setSelectedLayer(layer)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${layer.color} flex items-center justify-center`}>
                            <layer.icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">{layer.name}</h3>
                            <p className="text-blue-200 text-sm mb-3">{layer.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {layer.technologies.slice(0, 3).map((tech) => (
                                <div
                                  key={tech}
                                  className="bg-white/10 rounded-full px-3 py-1 text-xs text-blue-100"
                                >
                                  {tech}
                                </div>
                              ))}
                              {layer.technologies.length > 3 && (
                                <div className="bg-white/10 rounded-full px-3 py-1 text-xs text-blue-100">
                                  +{layer.technologies.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white mb-1">{index + 1}</div>
                            <div className="text-xs text-blue-200">Layer</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Connection Lines */}
              <div className="absolute left-8 top-20 bottom-20 w-0.5 bg-gradient-to-b from-cyan-400 to-purple-400 opacity-50"></div>
              {layers.map((_, index) => (
                index < layers.length - 1 && (
                  <div
                    key={index}
                    className="absolute left-6 w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-50"
                    style={{ top: `${20 + (index + 1) * 140}px` }}
                  ></div>
                )
              ))}
            </div>
          </div>

          {/* Right Panel - Layer Details */}
          <div>
            <AnimatePresence mode="wait">
              {selectedLayer ? (
                <motion.div
                  key={selectedLayer.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${selectedLayer.color} flex items-center justify-center`}>
                          <selectedLayer.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{selectedLayer.name}</CardTitle>
                          <CardDescription className="text-blue-200">
                            {selectedLayer.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-100 text-sm leading-relaxed mb-4">
                        {selectedLayer.details}
                      </p>

                      <h4 className="text-white font-medium mb-3">Technologies</h4>
                      <div className="space-y-2">
                        {selectedLayer.technologies.map((tech) => (
                          <div
                            key={tech}
                            className="flex items-center space-x-2 bg-white/5 rounded-lg p-2"
                          >
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            <span className="text-blue-100 text-sm">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Integration Examples */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Integration Examples</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {['Slack Integration', 'Microsoft Teams', 'Salesforce CRM', 'Custom APIs'].map((integration) => (
                          <div
                            key={integration}
                            className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                          >
                            <span className="text-blue-100 text-sm">{integration}</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-8">
                      <Cloud className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                      <h3 className="text-white font-semibold mb-2">Explore Architecture</h3>
                      <p className="text-blue-200 text-sm mb-4">
                        Click any layer to view detailed information about technologies and integrations.
                      </p>
                      <p className="text-blue-300 text-xs">
                        Drag layers to create custom architecture views.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
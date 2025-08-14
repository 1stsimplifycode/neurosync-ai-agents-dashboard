import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ArrowLeft, Plus, Play, Download, Settings } from 'lucide-react';

const AGENTS = [
  {
    id: 'observer',
    name: 'Observer',
    icon: '👁️',
    color: 'from-green-400 to-emerald-600',
    description: 'Monitors workflows'
  },
  {
    id: 'memory',
    name: 'Memory',
    icon: '🧠',
    color: 'from-blue-400 to-blue-600',
    description: 'Stores decisions'
  },
  {
    id: 'replica',
    name: 'Replica',
    icon: '🤖',
    color: 'from-purple-400 to-purple-600',
    description: 'Creates workflows'
  },
  {
    id: 'teacher',
    name: 'Teacher',
    icon: '🎓',
    color: 'from-orange-400 to-orange-600',
    description: 'Trains users'
  },
  {
    id: 'evolver',
    name: 'Evolver',
    icon: '🔄',
    color: 'from-teal-400 to-teal-600',
    description: 'Improves processes'
  }
];

export const WorkflowBuilder = ({ onNavigate, onBack }) => {
  const [workflowName, setWorkflowName] = useState('Fraud Detection Process');
  const [droppedAgents, setDroppedAgents] = useState([]);
  const [draggedAgent, setDraggedAgent] = useState(null);
  const [dropZoneActive, setDropZoneActive] = useState(false);
  const dragRef = useRef(null);

  const handleDragStart = (e, agent) => {
    setDraggedAgent(agent);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropZoneActive(true);
  };

  const handleDragLeave = (e) => {
    if (!dragRef.current?.contains(e.relatedTarget)) {
      setDropZoneActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedAgent && !droppedAgents.find(a => a.id === draggedAgent.id)) {
      setDroppedAgents(prev => [...prev, { ...draggedAgent, position: prev.length }]);
    }
    setDropZoneActive(false);
    setDraggedAgent(null);
  };

  const removeAgent = (agentId) => {
    setDroppedAgents(prev => prev.filter(a => a.id !== agentId));
  };

  const generatePreview = () => {
    if (droppedAgents.length === 0) return "Add agents to preview workflow";
    
    const steps = droppedAgents.map((agent, index) => {
      switch (agent.id) {
        case 'observer':
          return `${index + 1}. Monitor and capture expert actions`;
        case 'memory':
          return `${index + 1}. Store decisions and reasoning`;
        case 'replica':
          return `${index + 1}. Generate executable workflow`;
        case 'teacher':
          return `${index + 1}. Train team members`;
        case 'evolver':
          return `${index + 1}. Optimize and improve`;
        default:
          return `${index + 1}. Process with ${agent.name}`;
      }
    });
    
    return steps.join('\n');
  };

  return (
    <div className="w-full h-full flex bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-center justify-between p-6">
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
            <h1 className="text-xl font-semibold text-white">Workflow Builder</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button size="sm" variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600">
              <Play className="w-4 h-4 mr-2" />
              Run Workflow
            </Button>
          </div>
        </div>
      </div>

      {/* Left Panel - Agent Library */}
      <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/20 pt-20 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">AI Agent Library</h2>
          <p className="text-blue-200 text-sm">Drag agents to build your workflow</p>
        </div>

        <div className="space-y-3">
          {AGENTS.map((agent) => (
            <motion.div
              key={agent.id}
              draggable
              onDragStart={(e) => handleDragStart(e, agent)}
              className="cursor-move"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${agent.color} flex items-center justify-center text-lg`}>
                      {agent.icon}
                    </div>
                    <div>
                      <div className="font-medium text-white">{agent.name}</div>
                      <div className="text-xs text-blue-200">{agent.description}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
          <h3 className="font-medium text-white mb-2">Quick Templates</h3>
          <div className="space-y-2">
            {['Fraud Detection', 'Customer Support', 'Code Review'].map((template) => (
              <button
                key={template}
                className="w-full text-left p-2 text-sm text-blue-200 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center Canvas - Workflow Builder */}
      <div className="flex-1 pt-20 p-6">
        <div className="mb-6">
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-2xl font-semibold bg-transparent border-none text-white placeholder-blue-200 focus:ring-2 focus:ring-cyan-400 mb-2"
            placeholder="Workflow Name"
          />
          <p className="text-blue-200">Design your intelligent workflow by adding AI agents</p>
        </div>

        <div
          ref={dragRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative h-96 border-2 border-dashed rounded-xl transition-all duration-300 ${
            dropZoneActive 
              ? 'border-cyan-400 bg-cyan-400/10' 
              : droppedAgents.length > 0 
                ? 'border-white/30 bg-white/5' 
                : 'border-white/20 bg-white/5'
          }`}
        >
          {droppedAgents.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Plus className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Drop AI agents here to build your workflow</p>
                <p className="text-white/40 text-sm mt-2">Agents will connect automatically</p>
              </div>
            </div>
          ) : (
            <div className="p-6 h-full">
              <div className="flex items-center space-x-6 h-full">
                <AnimatePresence>
                  {droppedAgents.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative"
                    >
                      <Card className="bg-white/10 backdrop-blur-sm border-white/30 w-32">
                        <CardContent className="p-4 text-center">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${agent.color} flex items-center justify-center text-xl mx-auto mb-2`}>
                            {agent.icon}
                          </div>
                          <div className="font-medium text-white text-sm">{agent.name}</div>
                          <button
                            onClick={() => removeAgent(agent.id)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </CardContent>
                      </Card>
                      
                      {index < droppedAgents.length - 1 && (
                        <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                          <div className="w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
                          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/30 hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <Button
            onClick={() => onNavigate('agents-overview')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600"
          >
            View Agent Details
          </Button>
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-80 bg-white/5 backdrop-blur-sm border-l border-white/20 pt-20 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">Live Preview</h2>
          <p className="text-blue-200 text-sm">Real-time workflow visualization</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-sm">Workflow Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-blue-200 text-xs whitespace-pre-wrap font-mono leading-relaxed">
              {generatePreview()}
            </pre>
          </CardContent>
        </Card>

        {droppedAgents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Card className="bg-blue-900/30 border-blue-500/30">
              <CardContent className="p-4">
                <div className="text-white text-sm font-medium mb-2">Estimated Performance</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">Processing Time</span>
                    <span className="text-white">2.3s</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">Accuracy</span>
                    <span className="text-white">94.7%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">Resource Usage</span>
                    <span className="text-white">Low</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};
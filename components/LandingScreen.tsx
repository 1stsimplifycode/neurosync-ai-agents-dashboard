import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Sparkles, Zap } from 'lucide-react';

export const LandingScreen = ({ onNavigate }) => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    // Generate random nodes for neural network animation
    const generateNodes = () => {
      const newNodes = [];
      for (let i = 0; i < 50; i++) {
        newNodes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.7 + 0.3,
        });
      }
      setNodes(newNodes);
    };

    generateNodes();
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        opacity: Math.random() * 0.7 + 0.3,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Animated Neural Network Background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Connection Lines */}
          {nodes.map((node, i) => 
            nodes.slice(i + 1).map((otherNode, j) => {
              const distance = Math.sqrt(
                Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
              );
              if (distance < 20) {
                return (
                  <motion.line
                    key={`${i}-${j}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${otherNode.x}%`}
                    y2={`${otherNode.y}%`}
                    stroke="url(#gradient)"
                    strokeWidth="0.1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: Math.min(node.opacity, otherNode.opacity) * 0.5 }}
                    transition={{ duration: 2 }}
                  />
                );
              }
              return null;
            })
          )}
          
          {/* Nodes */}
          {nodes.map((node) => (
            <motion.circle
              key={node.id}
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size * 0.2}
              fill="url(#nodeGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: node.opacity }}
              transition={{ duration: 2 }}
            />
          ))}
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="nodeGradient">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-white text-sm font-medium">Enterprise AI Platform</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl font-bold text-white mb-6 leading-tight"
        >
          NeuroSync
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            The Nervous System for Enterprise Work
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Turning every project into a smarter one. Capture expert knowledge, 
          automate workflows, and scale best practices across your organization.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={() => onNavigate('workflow-builder')}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
          >
            <Zap className="w-5 h-5 mr-2" />
            Build a Workflow
          </Button>
          
          <Button
            onClick={() => onNavigate('agents-overview')}
            size="lg"
            variant="outline"
            className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 min-w-[200px]"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Explore Agents
          </Button>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          {['Knowledge Capture', 'Workflow Automation', 'Expert Training', 'Process Evolution'].map((feature, index) => (
            <div
              key={feature}
              className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium"
            >
              {feature}
            </div>
          ))}
        </motion.div>

        {/* Navigation dots for demo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex justify-center space-x-2 mt-16"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-cyan-400' : 'bg-white/30'} transition-all duration-300`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
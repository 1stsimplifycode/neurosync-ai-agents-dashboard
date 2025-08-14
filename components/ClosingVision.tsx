import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Sparkles, RotateCcw, Globe } from 'lucide-react';

export const ClosingVision = ({ onRestart }) => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    // Generate global network nodes
    const generateNetwork = () => {
      const newNodes = [];
      const cities = [
        { name: 'New York', x: 25, y: 35 },
        { name: 'London', x: 50, y: 25 },
        { name: 'Tokyo', x: 80, y: 40 },
        { name: 'Sydney', x: 85, y: 70 },
        { name: 'São Paulo', x: 35, y: 65 },
        { name: 'Mumbai', x: 70, y: 45 },
        { name: 'Lagos', x: 52, y: 55 },
        { name: 'Berlin', x: 52, y: 30 },
        { name: 'Singapore', x: 75, y: 58 },
        { name: 'Toronto', x: 22, y: 28 }
      ];

      cities.forEach((city, index) => {
        newNodes.push({
          id: index,
          ...city,
          size: Math.random() * 3 + 2,
          pulseDelay: Math.random() * 2,
        });
      });

      // Generate connections
      const newConnections = [];
      for (let i = 0; i < newNodes.length; i++) {
        for (let j = i + 1; j < newNodes.length; j++) {
          if (Math.random() > 0.6) { // 40% chance of connection
            newConnections.push({
              from: newNodes[i],
              to: newNodes[j],
              delay: Math.random() * 3
            });
          }
        }
      }

      setNodes(newNodes);
      setConnections(newConnections);
    };

    generateNetwork();
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 overflow-hidden">
      {/* Animated Background Network */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
            </radialGradient>
            <linearGradient id="connectionGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Connection Lines */}
          {connections.map((connection, index) => (
            <motion.line
              key={`connection-${index}`}
              x1={`${connection.from.x}%`}
              y1={`${connection.from.y}%`}
              x2={`${connection.to.x}%`}
              y2={`${connection.to.y}%`}
              stroke="url(#connectionGlow)"
              strokeWidth="0.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: connection.delay, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
            />
          ))}

          {/* Network Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.size}
                fill="url(#nodeGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: node.pulseDelay }}
              />
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.size * 2}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="0.3"
                strokeOpacity="0.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 3, 
                  delay: node.pulseDelay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <Globe className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl font-bold text-white mb-6 leading-tight"
          >
            Turning Atos into a
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Learning Machine
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Every project becomes smarter. Every expert's knowledge becomes immortal. 
            Every team member becomes more capable. This is the future of enterprise intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
                <div className="text-3xl font-bold text-cyan-400 mb-2">∞</div>
                <div className="text-white font-medium">Infinite Memory</div>
                <div className="text-blue-200 text-sm">Never lose knowledge again</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <div className="text-3xl font-bold text-purple-400 mb-2">🚀</div>
                <div className="text-white font-medium">Exponential Growth</div>
                <div className="text-blue-200 text-sm">Every project makes you smarter</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                <div className="text-3xl font-bold text-green-400 mb-2">🌍</div>
                <div className="text-white font-medium">Global Impact</div>
                <div className="text-blue-200 text-sm">Knowledge without borders</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={onRestart}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Restart Demo
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 min-w-[200px]"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Contact Atos
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-center text-blue-300 text-sm mt-8"
            >
              The future of enterprise intelligence starts now.
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              y: [null, -100],
              scale: [0, 1, 0],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};
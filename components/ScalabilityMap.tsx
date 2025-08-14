import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Building2, Heart, Factory, ShoppingCart, TrendingUp, Users, Clock, DollarSign } from 'lucide-react';

const INDUSTRIES = [
  {
    id: 'banking',
    name: 'Banking & Finance',
    icon: Building2,
    position: { x: 25, y: 40 },
    color: 'from-blue-400 to-blue-600',
    kpis: {
      'Fraud Detection': { value: 94.7, unit: '% accuracy', trend: '+12%' },
      'Processing Time': { value: 2.3, unit: 'seconds', trend: '-67%' },
      'Cost Savings': { value: 2.4, unit: 'M annually', trend: '+340%' }
    },
    caseStudy: 'Implemented NeuroSync for fraud detection, reducing false positives by 67% while maintaining 94.7% accuracy.'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Heart,
    position: { x: 75, y: 30 },
    color: 'from-red-400 to-red-600',
    kpis: {
      'Diagnosis Accuracy': { value: 96.2, unit: '% accuracy', trend: '+8%' },
      'Patient Throughput': { value: 34, unit: '% faster', trend: '+34%' },
      'Training Time': { value: 60, unit: '% reduction', trend: '-60%' }
    },
    caseStudy: 'Trained new nurses using expert knowledge, reducing onboarding time by 60% while improving patient care quality.'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: Factory,
    position: { x: 45, y: 70 },
    color: 'from-orange-400 to-orange-600',
    kpis: {
      'Quality Control': { value: 99.1, unit: '% accuracy', trend: '+15%' },
      'Downtime Reduction': { value: 45, unit: '% decrease', trend: '-45%' },
      'Efficiency Gains': { value: 28, unit: '% improvement', trend: '+28%' }
    },
    caseStudy: 'Captured senior technician expertise, reducing equipment downtime by 45% and improving quality control.'
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    icon: ShoppingCart,
    position: { x: 70, y: 60 },
    color: 'from-purple-400 to-purple-600',
    kpis: {
      'Customer Support': { value: 87, unit: '% satisfaction', trend: '+23%' },
      'Response Time': { value: 3.2, unit: 'minutes avg', trend: '-55%' },
      'Resolution Rate': { value: 92, unit: '% first contact', trend: '+38%' }
    },
    caseStudy: 'Replicated top customer service agents, improving satisfaction scores by 23% and reducing response times.'
  }
];

export const ScalabilityMap = ({ onNavigate, onBack }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [connections, setConnections] = useState([]);
  const [animatedKPIs, setAnimatedKPIs] = useState({});

  useEffect(() => {
    // Generate animated connections between industries
    const generateConnections = () => {
      const newConnections = [];
      for (let i = 0; i < INDUSTRIES.length; i++) {
        for (let j = i + 1; j < INDUSTRIES.length; j++) {
          if (Math.random() > 0.3) { // 70% chance of connection
            newConnections.push({
              from: INDUSTRIES[i],
              to: INDUSTRIES[j],
              strength: Math.random() * 0.8 + 0.2
            });
          }
        }
      }
      setConnections(newConnections);
    };

    generateConnections();
    const interval = setInterval(generateConnections, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleIndustryClick = (industry) => {
    setSelectedIndustry(industry);
    
    // Animate KPIs
    const animated = {};
    Object.entries(industry.kpis).forEach(([key, kpi]) => {
      animated[key] = 0;
    });
    setAnimatedKPIs(animated);

    // Gradually animate to final values
    setTimeout(() => {
      const finalAnimated = {};
      Object.entries(industry.kpis).forEach(([key, kpi]) => {
        finalAnimated[key] = kpi.value;
      });
      setAnimatedKPIs(finalAnimated);
    }, 100);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
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
            <div>
              <h1 className="text-2xl font-semibold text-white">Scalability Map</h1>
              <p className="text-blue-200">Real-time industry deployment and performance metrics</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => onNavigate('tech-stack')}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10"
            >
              Tech Stack
            </Button>
            <Button
              onClick={() => onNavigate('benefits')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              View Benefits
            </Button>
          </div>
        </div>
      </div>

      {/* World Map Container */}
      <div className="absolute inset-0 pt-20">
        <div className="relative w-full h-full">
          {/* Stylized World Map Background */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 1000 500" className="w-full h-full">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" className="text-white/20"/>
            </svg>
          </div>

          {/* Animated Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            
            {connections.map((connection, index) => (
              <motion.line
                key={`${connection.from.id}-${connection.to.id}-${index}`}
                x1={`${connection.from.position.x}%`}
                y1={`${connection.from.position.y}%`}
                x2={`${connection.to.position.x}%`}
                y2={`${connection.to.position.y}%`}
                stroke="url(#connectionGradient)"
                strokeWidth={connection.strength * 3}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: connection.strength }}
                transition={{ duration: 2, delay: index * 0.1 }}
              />
            ))}
          </svg>

          {/* Industry Nodes */}
          {INDUSTRIES.map((industry) => (
            <motion.div
              key={industry.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${industry.position.x}%`,
                top: `${industry.position.y}%`
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleIndustryClick(industry)}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${industry.color} flex items-center justify-center shadow-lg relative`}>
                <industry.icon className="w-8 h-8 text-white" />
                
                {/* Pulsing Ring */}
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${industry.color} opacity-30`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-white text-sm font-medium whitespace-nowrap">
                  {industry.name}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Global Stats Overlay */}
          <div className="absolute top-8 left-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-64">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3">Global Deployment</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Active Deployments</span>
                    <span className="text-white font-medium">247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Industries Served</span>
                    <span className="text-white font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Success Rate</span>
                    <span className="text-white font-medium">94.3%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">ROI Average</span>
                    <span className="text-white font-medium">340%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Industry Detail Modal */}
      <AnimatePresence>
        {selectedIndustry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30"
            onClick={() => setSelectedIndustry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-purple-900/95 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-4xl w-full mx-8 max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedIndustry.color} flex items-center justify-center`}>
                  <selectedIndustry.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">{selectedIndustry.name}</h2>
                  <p className="text-blue-200">NeuroSync Implementation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* KPIs */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Key Performance Indicators</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedIndustry.kpis).map(([metric, data]) => (
                      <motion.div
                        key={metric}
                        className="bg-white/10 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-200 text-sm">{metric}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-white">
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                {Math.round(animatedKPIs[metric] || 0)}
                                {data.unit.includes('%') ? '%' : ''}
                              </motion.span>
                            </span>
                            <span className="text-xs text-green-400">{data.trend}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full bg-gradient-to-r ${selectedIndustry.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${(animatedKPIs[metric] || 0)}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Case Study */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Case Study</h3>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
                    <p className="text-blue-100 leading-relaxed mb-4">
                      {selectedIndustry.caseStudy}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400 mb-1">
                          <Users className="w-6 h-6 mx-auto mb-1" />
                          1,247
                        </div>
                        <div className="text-xs text-blue-200">Users Trained</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                          <Clock className="w-6 h-6 mx-auto mb-1" />
                          67%
                        </div>
                        <div className="text-xs text-blue-200">Time Saved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          <DollarSign className="w-6 h-6 mx-auto mb-1" />
                          $2.4M
                        </div>
                        <div className="text-xs text-blue-200">ROI Generated</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        setSelectedIndustry(null);
                        onNavigate('workflow-builder');
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
                    >
                      Build Similar Workflow
                    </Button>
                    <Button
                      variant="outline"
                      className="text-white border-white/30 hover:bg-white/10"
                      onClick={() => setSelectedIndustry(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
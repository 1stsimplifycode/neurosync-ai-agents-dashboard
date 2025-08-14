import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { ArrowLeft, Users, Building, TrendingUp, Clock, BookOpen, Shield, Award, Zap } from 'lucide-react';

const EMPLOYEE_BENEFITS = [
  {
    id: 'onboarding',
    icon: BookOpen,
    title: 'Faster Onboarding',
    description: 'AI remembers expert steps so new hires ramp up 60% faster',
    detail: 'Instead of shadowing experts for weeks, new employees learn from captured knowledge patterns, getting productive immediately.',
    metric: '60% faster ramp-up',
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'learning',
    icon: TrendingUp,
    title: 'Continuous Learning',
    description: 'Get real-time tips and guidance from AI agents during work',
    detail: 'AI agents provide contextual suggestions and expert insights as you work, turning every task into a learning opportunity.',
    metric: '85% skill improvement',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'growth',
    icon: Award,
    title: 'Career Growth',
    description: 'Access expert knowledge across departments for skill development',
    detail: 'Break down silos and learn from the best performers in any department, accelerating your professional development.',
    metric: '40% promotion rate increase',
    color: 'from-purple-400 to-purple-600'
  }
];

const COMPANY_BENEFITS = [
  {
    id: 'knowledge',
    icon: Shield,
    title: 'No Knowledge Loss',
    description: 'Every project adds to an enterprise "brain" that never forgets',
    detail: 'When experts leave, their knowledge stays. Every decision, process, and insight becomes part of your organizational memory.',
    metric: '100% knowledge retention',
    color: 'from-orange-400 to-orange-600'
  },
  {
    id: 'delivery',
    icon: Zap,
    title: 'Faster Delivery',
    description: 'Projects start with proven workflows instead of from scratch',
    detail: 'New projects leverage existing expertise and proven methodologies, dramatically reducing startup time and risk.',
    metric: '45% faster project delivery',
    color: 'from-cyan-400 to-cyan-600'
  },
  {
    id: 'advantage',
    icon: Users,
    title: 'Competitive Advantage',
    description: 'Own proprietary AI workflows, reduce errors, scale best practices',
    detail: 'Build unique AI-powered processes that competitors can\'t replicate, creating sustainable competitive advantages.',
    metric: '23% error reduction',
    color: 'from-red-400 to-red-600'
  }
];

export const BenefitsSection = ({ onNavigate, onBack }) => {
  const [viewMode, setViewMode] = useState('employee'); // 'employee' or 'company'
  const [selectedBenefit, setSelectedBenefit] = useState(null);

  const currentBenefits = viewMode === 'employee' ? EMPLOYEE_BENEFITS : COMPANY_BENEFITS;

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
              <h1 className="text-2xl font-semibold text-white">Why NeuroSync is Promising</h1>
              <p className="text-blue-200">Benefits for employees and companies alike</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => onNavigate('atos-benefits')}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10"
            >
              Atos Benefits
            </Button>
            <Button
              onClick={() => onNavigate('before-after')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              Before & After
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* View Toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                viewMode === 'employee' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'text-blue-200'
              }`}>
                <Users className="w-4 h-4" />
                <span className="font-medium">Employee View</span>
              </div>
              
              <Switch
                checked={viewMode === 'company'}
                onCheckedChange={(checked) => setViewMode(checked ? 'company' : 'employee')}
                className="data-[state=checked]:bg-purple-600"
              />
              
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                viewMode === 'company' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' : 'text-blue-200'
              }`}>
                <Building className="w-4 h-4" />
                <span className="font-medium">Company View</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {currentBenefits.map((benefit, index) => (
              <motion.div
                key={`${viewMode}-${benefit.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => setSelectedBenefit(benefit)}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center`}>
                        <benefit.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg">{benefit.title}</CardTitle>
                        <div className="text-sm font-medium text-cyan-400 mt-1">{benefit.metric}</div>
                      </div>
                    </div>
                    <CardDescription className="text-blue-200 leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="bg-white/5 rounded-lg p-4 border-l-4 border-cyan-400">
                      <p className="text-blue-100 text-sm leading-relaxed">
                        {benefit.detail}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Active Benefits</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBenefit(benefit);
                        }}
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Card */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <Card className={`${
            viewMode === 'employee' 
              ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-500/30' 
              : 'bg-gradient-to-r from-purple-900/30 to-purple-800/30 border-purple-500/30'
          } backdrop-blur-sm`}>
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-white mb-4">
                {viewMode === 'employee' ? 'Empowering Every Employee' : 'Transforming Organizations'}
              </h3>
              <p className="text-blue-200 text-lg mb-6 max-w-3xl mx-auto">
                {viewMode === 'employee' 
                  ? 'NeuroSync makes every employee more effective by giving them access to organizational wisdom and expert knowledge, accelerating their growth and impact.'
                  : 'NeuroSync transforms companies into learning organizations that capture, preserve, and scale their most valuable asset: knowledge and expertise.'
                }
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {viewMode === 'employee' ? (
                  <>
                    <div className="bg-white/10 rounded-full px-4 py-2 text-cyan-400 font-medium">
                      60% Faster Learning
                    </div>
                    <div className="bg-white/10 rounded-full px-4 py-2 text-blue-400 font-medium">
                      85% Skill Improvement
                    </div>
                    <div className="bg-white/10 rounded-full px-4 py-2 text-purple-400 font-medium">
                      40% More Promotions
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white/10 rounded-full px-4 py-2 text-orange-400 font-medium">
                      100% Knowledge Retention
                    </div>
                    <div className="bg-white/10 rounded-full px-4 py-2 text-cyan-400 font-medium">
                      45% Faster Delivery
                    </div>
                    <div className="bg-white/10 rounded-full px-4 py-2 text-red-400 font-medium">
                      23% Error Reduction
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Benefit Detail Modal */}
      <AnimatePresence>
        {selectedBenefit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedBenefit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-purple-900/95 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedBenefit.color} flex items-center justify-center`}>
                  <selectedBenefit.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">{selectedBenefit.title}</h2>
                  <p className="text-cyan-400 font-medium">{selectedBenefit.metric}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Overview</h3>
                  <p className="text-blue-200 leading-relaxed">{selectedBenefit.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
                  <div className="bg-white/5 rounded-lg p-4 border-l-4 border-cyan-400">
                    <p className="text-blue-100 leading-relaxed">{selectedBenefit.detail}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      setSelectedBenefit(null);
                      onNavigate('workflow-builder');
                    }}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
                  >
                    Try in Workflow Builder
                  </Button>
                  <Button
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                    onClick={() => setSelectedBenefit(null)}
                  >
                    Close
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
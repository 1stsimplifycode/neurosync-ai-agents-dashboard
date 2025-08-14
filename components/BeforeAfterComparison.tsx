import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { ArrowLeft, Clock, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';
import { COMPARISON_SCENARIOS } from './comparisonData';

export const BeforeAfterComparison = ({ onNavigate, onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [sliderValue, setSliderValue] = useState([0]);
  const isAfter = sliderValue[0] > 50;

  const scenario = COMPARISON_SCENARIOS[currentScenario];
  const currentData = isAfter ? scenario.new : scenario.old;

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
              <h1 className="text-2xl font-semibold text-white">Before vs After</h1>
              <p className="text-blue-200">Compare traditional methods with NeuroSync transformation</p>
            </div>
          </div>
          <div className="flex space-x-3">
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
        {/* Scenario Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="flex space-x-2">
              {COMPARISON_SCENARIOS.map((scenario, index) => (
                <button
                  key={scenario.id}
                  onClick={() => setCurrentScenario(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    currentScenario === index
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {scenario.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Comparison Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className={`text-lg font-semibold transition-all duration-300 ${
              !isAfter ? 'text-red-400' : 'text-red-400/50'
            }`}>
              Old Way
            </div>
            <div className="flex-1 mx-8">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className={`text-lg font-semibold transition-all duration-300 ${
              isAfter ? 'text-green-400' : 'text-green-400/50'
            }`}>
              NeuroSync Way
            </div>
          </div>
          
          <div className="text-center">
            <motion.div
              key={isAfter ? 'after' : 'before'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-2xl font-bold ${isAfter ? 'text-green-400' : 'text-red-400'}`}
            >
              {currentData.title}
            </motion.div>
            <div className="text-blue-200 mt-1">{scenario.description}</div>
          </div>
        </div>

        {/* Content Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScenario}-${isAfter}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Process Flow */}
            <Card className={`${
              isAfter 
                ? 'bg-green-900/20 border-green-500/30' 
                : 'bg-red-900/20 border-red-500/30'
            } backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Process & Timeline</span>
                </CardTitle>
                <CardDescription className={`font-medium ${
                  isAfter ? 'text-green-300' : 'text-red-300'
                }`}>
                  {currentData.timeline}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentData.process.map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isAfter ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-blue-100 text-sm leading-relaxed">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Metrics */}
            <Card className={`${
              isAfter 
                ? 'bg-green-900/20 border-green-500/30' 
                : 'bg-red-900/20 border-red-500/30'
            } backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Key Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(currentData.metrics).map(([metric, value]) => (
                    <motion.div
                      key={metric}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200 text-sm">{metric}</span>
                        <span className={`font-bold ${isAfter ? 'text-green-400' : 'text-red-400'}`}>
                          {typeof value === 'number' && value > 100 ? `$${(value/1000).toFixed(1)}k` : 
                           typeof value === 'number' && metric.includes('Time') && value > 10 ? `${value} mo` :
                           typeof value === 'number' && metric.includes('Time') && value < 10 ? `${value} mo` :
                           typeof value === 'number' ? `${value}%` : value}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${
                            isAfter ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${typeof value === 'number' ? Math.min(value, 100) : 50}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Issues/Benefits */}
            <Card className={`${
              isAfter 
                ? 'bg-green-900/20 border-green-500/30' 
                : 'bg-red-900/20 border-red-500/30'
            } backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  {isAfter ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  <span>{isAfter ? 'Key Benefits' : 'Pain Points'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(isAfter ? currentData.benefits : currentData.pain_points).map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      {isAfter ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-blue-100 text-sm leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Summary Card */}
        <motion.div
          key={`summary-${currentScenario}-${isAfter}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className={`${
            isAfter 
              ? 'bg-gradient-to-r from-green-900/30 to-green-800/30 border-green-500/30' 
              : 'bg-gradient-to-r from-red-900/30 to-red-800/30 border-red-500/30'
          } backdrop-blur-sm`}>
            <CardContent className="p-8 text-center">
              <h3 className={`text-2xl font-semibold mb-4 ${isAfter ? 'text-green-400' : 'text-red-400'}`}>
                {isAfter ? 'The NeuroSync Advantage' : 'Current State Challenges'}
              </h3>
              <p className="text-blue-200 text-lg mb-6 max-w-3xl mx-auto">
                {isAfter 
                  ? 'With NeuroSync, organizations transform how they capture, share, and leverage knowledge, creating sustainable competitive advantages through AI-enhanced processes.'
                  : 'Traditional approaches face significant challenges with knowledge loss, inconsistent processes, and heavy dependence on individual expertise that doesn\'t scale.'
                }
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    if (isAfter) {
                      onNavigate('workflow-builder');
                    } else {
                      setSliderValue([100]);
                    }
                  }}
                  className={`${
                    isAfter 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
                  } text-white px-8 py-3`}
                >
                  {isAfter ? 'Build This Solution' : 'See NeuroSync Solution'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
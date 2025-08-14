import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const Overview = ({ agents, onAgentSelect }) => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">AI Agent Overview</h2>
        <p className="text-gray-600 text-lg">
          Discover how our AI agents work together to create an intelligent nervous system for your organization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card 
            key={agent.id} 
            className="transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-blue-200"
            onClick={() => onAgentSelect(agent.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-3xl">{agent.icon}</div>
                <div>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <Badge variant="secondary" className={`mt-1 ${agent.accentColorClass}`}>
                    {agent.accentColor.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-gray-600 leading-relaxed">
                {agent.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">{agent.metric}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onAgentSelect(agent.id);
                }}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">How NeuroSync Agents Work Together</h3>
        <p className="text-blue-800 mb-4">
          Our AI agents form an interconnected system that captures, stores, replicates, teaches, and evolves organizational knowledge.
        </p>
        <div className="flex items-center space-x-4 text-sm text-blue-700">
          <span>👁️ Observer captures</span>
          <span>→</span>
          <span>🧠 Memory stores</span>
          <span>→</span>
          <span>🤖 Replica executes</span>
          <span>→</span>
          <span>🎓 Teacher trains</span>
          <span>→</span>
          <span>🔄 Evolver improves</span>
        </div>
      </div>
    </div>
  );
};
import React from 'react';

export const Sidebar = ({ currentView, onNavigate, agents }) => {
  const isActive = (view) => currentView === view || currentView === 'agent-detail' && view === agents.find(a => a.id === currentView)?.id;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-medium">N</span>
          </div>
          <span className="font-medium text-gray-900">NeuroSync</span>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          <button
            onClick={() => onNavigate('overview')}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'overview'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3">📊</span>
            Overview
          </button>

          <div className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              AI Agents
            </h3>
            <div className="space-y-1">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => onNavigate(agent.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    (currentView === 'agent-detail' && isActive(agent.id)) || currentView === agent.id
                      ? `${agent.accentColorClass} border`
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{agent.icon}</span>
                  {agent.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>System Status</span>
            <span className="text-green-600">Active</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Agents Online</span>
            <span className="text-gray-900">5/5</span>
          </div>
        </div>
      </div>
    </div>
  );
};
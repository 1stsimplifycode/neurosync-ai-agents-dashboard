import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AgentDetail = ({ agent }) => {
  if (!agent) return null;

  const getAccentColor = (color) => {
    const colors = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      teal: 'text-teal-600'
    };
    return colors[color] || 'text-blue-600';
  };

  const getChartColor = (color) => {
    const colors = {
      green: '#10b981',
      blue: '#3b82f6',
      purple: '#8b5cf6',
      orange: '#f97316',
      teal: '#14b8a6'
    };
    return colors[color] || '#3b82f6';
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-5xl">{agent.icon}</div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{agent.name}</h1>
            <Badge className={`mt-2 ${agent.accentColorClass}`}>
              {agent.accentColor.toUpperCase()} AGENT
            </Badge>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl">{agent.purpose}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Example Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>💡</span>
                <span>Real-World Example</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-700 leading-relaxed">{agent.example}</p>
              </div>
            </CardContent>
          </Card>

          {/* Flow Diagram */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Process Flow</span>
              </CardTitle>
              <CardDescription>How the {agent.name} operates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {agent.flowSteps.map((step, index) => (
                  <React.Fragment key={step.step}>
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className={`w-12 h-12 rounded-full bg-${agent.accentColor}-100 border-2 border-${agent.accentColor}-300 flex items-center justify-center mb-3`}>
                        <span className={`font-semibold ${getAccentColor(agent.accentColor)}`}>
                          {step.step}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    {index < agent.flowSteps.length - 1 && (
                      <div className="flex items-center px-4">
                        <div className="w-8 h-0.5 bg-gray-300"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full ml-1"></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📈</span>
                <span>Performance Trends</span>
              </CardTitle>
              <CardDescription>6-month performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={agent.metrics.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey={Object.keys(agent.metrics.chartData[0]).find(key => key !== 'month')} 
                      stroke={getChartColor(agent.accentColor)}
                      strokeWidth={3}
                      dot={{ fill: getChartColor(agent.accentColor), strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🎯</span>
                <span>Key Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{agent.metrics.title}</span>
                  <span className="font-semibold text-gray-900">{agent.metrics.value}</span>
                </div>
                <Progress value={(agent.metrics.value / 100) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">{agent.metrics.unit}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Status: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Last Updated: 2 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚙️</span>
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">View Logs</div>
                <div className="text-sm text-gray-500">Check recent activity</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Configure Settings</div>
                <div className="text-sm text-gray-500">Adjust agent parameters</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Download Report</div>
                <div className="text-sm text-gray-500">Export performance data</div>
              </button>
            </CardContent>
          </Card>

          {/* Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🔗</span>
                <span>Integrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Slack</span>
                  <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Microsoft Teams</span>
                  <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Salesforce</span>
                  <Badge variant="outline" className="text-gray-500 border-gray-300">
                    Available
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export const agentsData = [
  {
    id: 'observer',
    name: 'Observer Agent',
    icon: '👁️',
    description: 'Watches experts work with permission and records their processes',
    metric: 'Active in 12 workflows',
    accentColor: 'green',
    accentColorClass: 'bg-green-100 text-green-800 border-green-200',
    purpose: 'Observer Agent: Watches experts work with permission to capture valuable knowledge and processes.',
    example: 'Records how a fraud expert checks transactions, capturing the sequence of steps, decision points, and criteria used to identify suspicious activity.',
    flowSteps: [
      { step: 1, title: 'Watch', description: 'Expert performs their work' },
      { step: 2, title: 'Record', description: 'Observer logs steps and decisions' },
      { step: 3, title: 'Share', description: 'Data sent to Memory Agent' }
    ],
    metrics: {
      title: 'Knowledge Capture Rate',
      value: 45,
      unit: 'processes recorded',
      chartData: [
        { month: 'Jan', processes: 8 },
        { month: 'Feb', processes: 12 },
        { month: 'Mar', processes: 15 },
        { month: 'Apr', processes: 18 },
        { month: 'May', processes: 22 },
        { month: 'Jun', processes: 45 }
      ]
    }
  },
  {
    id: 'memory',
    name: 'Memory Agent',
    icon: '🧠',
    description: 'Saves expert decisions and the reasoning behind them',
    metric: 'Storing 847 decision patterns',
    accentColor: 'blue',
    accentColorClass: 'bg-blue-100 text-blue-800 border-blue-200',
    purpose: 'Memory Agent: Saves expert decisions and the "why" behind them to build organizational knowledge.',
    example: 'Stores how a senior nurse handles patient intake, including the questions asked, observations made, and reasoning for priority assignments.',
    flowSteps: [
      { step: 1, title: 'Receive', description: 'Gets data from Observer Agent' },
      { step: 2, title: 'Process', description: 'Analyzes patterns and decisions' },
      { step: 3, title: 'Store', description: 'Saves structured knowledge' }
    ],
    metrics: {
      title: 'Knowledge Reused',
      value: 847,
      unit: 'decision patterns',
      chartData: [
        { month: 'Jan', patterns: 124 },
        { month: 'Feb', patterns: 298 },
        { month: 'Mar', patterns: 445 },
        { month: 'Apr', patterns: 612 },
        { month: 'May', patterns: 723 },
        { month: 'Jun', patterns: 847 }
      ]
    }
  },
  {
    id: 'replica',
    name: 'Replica Agent',
    icon: '🤖',
    description: 'Creates digital replicas of expert workflows and processes',
    metric: 'Running 23 expert replicas',
    accentColor: 'purple',
    accentColorClass: 'bg-purple-100 text-purple-800 border-purple-200',
    purpose: 'Replica Agent: Creates digital replicas of expert workflows that can be deployed and executed.',
    example: 'Replicates a financial analyst\'s market assessment process, enabling automated preliminary analysis before human review.',
    flowSteps: [
      { step: 1, title: 'Learn', description: 'Studies expert patterns from Memory' },
      { step: 2, title: 'Model', description: 'Creates executable workflow replica' },
      { step: 3, title: 'Deploy', description: 'Runs replica in production systems' }
    ],
    metrics: {
      title: 'Active Replicas',
      value: 23,
      unit: 'expert workflows',
      chartData: [
        { month: 'Jan', replicas: 3 },
        { month: 'Feb', replicas: 7 },
        { month: 'Mar', replicas: 12 },
        { month: 'Apr', replicas: 16 },
        { month: 'May', replicas: 19 },
        { month: 'Jun', replicas: 23 }
      ]
    }
  },
  {
    id: 'teacher',
    name: 'Teacher Agent',
    icon: '🎓',
    description: 'Trains new team members using captured expert knowledge',
    metric: 'Trained 156 employees',
    accentColor: 'orange',
    accentColorClass: 'bg-orange-100 text-orange-800 border-orange-200',
    purpose: 'Teacher Agent: Trains new team members using captured expert knowledge and adaptive learning paths.',
    example: 'Teaches new customer service representatives how expert agents handle complex complaints, adapting the training based on individual learning progress.',
    flowSteps: [
      { step: 1, title: 'Assess', description: 'Evaluates learner\'s current skills' },
      { step: 2, title: 'Adapt', description: 'Customizes training from expert knowledge' },
      { step: 3, title: 'Guide', description: 'Provides personalized instruction' }
    ],
    metrics: {
      title: 'Training Completions',
      value: 156,
      unit: 'employees trained',
      chartData: [
        { month: 'Jan', trained: 18 },
        { month: 'Feb', trained: 34 },
        { month: 'Mar', trained: 52 },
        { month: 'Apr', trained: 78 },
        { month: 'May', trained: 112 },
        { month: 'Jun', trained: 156 }
      ]
    }
  },
  {
    id: 'evolver',
    name: 'Evolver Agent',
    icon: '🔄',
    description: 'Continuously improves processes based on new data and outcomes',
    metric: 'Optimized 34 workflows',
    accentColor: 'teal',
    accentColorClass: 'bg-teal-100 text-teal-800 border-teal-200',
    purpose: 'Evolver Agent: Continuously improves processes based on new data, outcomes, and changing conditions.',
    example: 'Analyzes supply chain disruption patterns and evolves procurement strategies, automatically updating decision criteria based on market changes.',
    flowSteps: [
      { step: 1, title: 'Monitor', description: 'Tracks process performance' },
      { step: 2, title: 'Analyze', description: 'Identifies improvement opportunities' },
      { step: 3, title: 'Evolve', description: 'Updates and optimizes processes' }
    ],
    metrics: {
      title: 'Process Improvements',
      value: 34,
      unit: 'workflows optimized',
      chartData: [
        { month: 'Jan', optimized: 2 },
        { month: 'Feb', optimized: 8 },
        { month: 'Mar', optimized: 14 },
        { month: 'Apr', optimized: 21 },
        { month: 'May', optimized: 28 },
        { month: 'Jun', optimized: 34 }
      ]
    }
  }
];
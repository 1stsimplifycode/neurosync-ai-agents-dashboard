import time
import json
import threading
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, asdict
from collections import defaultdict
import sqlite3
import pandas as pd
import gradio as gr
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

@dataclass
class Observation:
    """Data class for structured observations"""
    timestamp: datetime
    user: str
    action: str
    context: Dict[str, Any]
    risk_level: str = "LOW"
    alert_triggered: bool = False
    processed: bool = False
    
    def to_dict(self):
        """Convert to dictionary for serialization"""
        data = asdict(self)
        data['timestamp'] = self.timestamp.isoformat()
        return data

class DatabaseManager:
    """Handles SQLite database operations"""
    
    def __init__(self, db_path: str = "observer_data.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize database tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS observations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                user TEXT NOT NULL,
                action TEXT NOT NULL,
                context TEXT NOT NULL,
                risk_level TEXT DEFAULT 'LOW',
                alert_triggered BOOLEAN DEFAULT FALSE,
                processed BOOLEAN DEFAULT FALSE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                user TEXT NOT NULL,
                alert_type TEXT NOT NULL,
                message TEXT NOT NULL,
                severity TEXT DEFAULT 'MEDIUM',
                acknowledged BOOLEAN DEFAULT FALSE
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def save_observation(self, observation: Observation):
        """Save observation to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO observations 
            (timestamp, user, action, context, risk_level, alert_triggered, processed)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            observation.timestamp.isoformat(),
            observation.user,
            observation.action,
            json.dumps(observation.context),
            observation.risk_level,
            observation.alert_triggered,
            observation.processed
        ))
        
        conn.commit()
        conn.close()
    
    def get_observations(self, limit: int = 100) -> List[Dict]:
        """Retrieve observations from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM observations 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (limit,))
        
        columns = [description[0] for description in cursor.description]
        observations = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        conn.close()
        return observations

class RiskAnalyzer:
    """Analyzes observations for risk patterns"""
    
    def __init__(self):
        self.risk_rules = {
            'high_amount': lambda ctx: ctx.get('amount', 0) > 10000,
            'suspicious_country': lambda ctx: ctx.get('country', '').lower() in ['nigeria', 'somalia', 'afghanistan'],
            'weekend_activity': lambda ctx: ctx.get('is_weekend', False),
            'high_risk_score': lambda ctx: ctx.get('risk_score', 0) > 0.8,
            'multiple_attempts': lambda ctx: ctx.get('attempt_count', 1) > 3,
            'unusual_time': lambda ctx: self._is_unusual_time(ctx.get('timestamp', datetime.now()))
        }
    
    def _is_unusual_time(self, timestamp: datetime) -> bool:
        """Check if timestamp is during unusual hours (11 PM - 6 AM)"""
        hour = timestamp.hour
        return hour >= 23 or hour <= 6
    
    def analyze_risk(self, context: Dict) -> tuple[str, List[str]]:
        """Analyze risk level and return triggered rules"""
        triggered_rules = []
        
        for rule_name, rule_func in self.risk_rules.items():
            try:
                if rule_func(context):
                    triggered_rules.append(rule_name)
            except Exception as e:
                print(f"Error in rule {rule_name}: {e}")
        
        # Determine risk level based on triggered rules
        if len(triggered_rules) >= 3:
            return "CRITICAL", triggered_rules
        elif len(triggered_rules) >= 2:
            return "HIGH", triggered_rules
        elif len(triggered_rules) >= 1:
            return "MEDIUM", triggered_rules
        else:
            return "LOW", triggered_rules

class AlertManager:
    """Manages alerts and notifications"""
    
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager
        self.alert_thresholds = {
            'CRITICAL': 0,  # Always alert
            'HIGH': 1,      # Alert after 1 similar event
            'MEDIUM': 3,    # Alert after 3 similar events
            'LOW': 10       # Alert after 10 similar events
        }
    
    def should_alert(self, observation: Observation) -> bool:
        """Determine if an alert should be triggered"""
        risk_level = observation.risk_level
        threshold = self.alert_thresholds.get(risk_level, 5)
        
        if risk_level == 'CRITICAL':
            return True
        
        # Count similar recent observations
        # In a real system, you'd query the database here
        return True  # Simplified for demo
    
    def create_alert(self, observation: Observation, triggered_rules: List[str]):
        """Create and save an alert"""
        alert_message = f"Risk detected for user {observation.user}: {', '.join(triggered_rules)}"
        
        conn = sqlite3.connect(self.db_manager.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO alerts 
            (timestamp, user, alert_type, message, severity)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            datetime.now().isoformat(),
            observation.user,
            observation.action,
            alert_message,
            observation.risk_level
        ))
        
        conn.commit()
        conn.close()
        
        print(f"🚨 ALERT [{observation.risk_level}]: {alert_message}")

class ObserverAgent:
    """Enhanced Observer Agent with risk analysis and alerting"""
    
    def __init__(self):
        self.observed_actions = []
        self.db_manager = DatabaseManager()
        self.risk_analyzer = RiskAnalyzer()
        self.alert_manager = AlertManager(self.db_manager)
        self.is_monitoring = False
        self.stats = defaultdict(int)
    
    def watch_action(self, user: str, action: str, context: dict) -> Observation:
        """Watch and analyze an action"""
        # Analyze risk
        risk_level, triggered_rules = self.risk_analyzer.analyze_risk(context)
        
        # Create observation
        observation = Observation(
            timestamp=datetime.now(),
            user=user,
            action=action,
            context=context,
            risk_level=risk_level,
            alert_triggered=False
        )
        
        # Check if alert should be triggered
        if self.alert_manager.should_alert(observation):
            observation.alert_triggered = True
            self.alert_manager.create_alert(observation, triggered_rules)
        
        # Save to database
        self.db_manager.save_observation(observation)
        
        # Update in-memory list (keep last 1000)
        self.observed_actions.append(observation)
        if len(self.observed_actions) > 1000:
            self.observed_actions.pop(0)
        
        # Update stats
        self.stats['total_observations'] += 1
        self.stats[f'risk_{risk_level.lower()}'] += 1
        if observation.alert_triggered:
            self.stats['total_alerts'] += 1
        
        print(f"[Observer] 👁️  {user} → {action} [Risk: {risk_level}]")
        if triggered_rules:
            print(f"[Observer] ⚠️  Triggered rules: {', '.join(triggered_rules)}")
        
        return observation
    
    def get_recent_observations(self, hours: int = 24) -> List[Observation]:
        """Get observations from the last N hours"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        return [obs for obs in self.observed_actions if obs.timestamp >= cutoff_time]
    
    def get_user_activity(self, user: str) -> List[Observation]:
        """Get all activity for a specific user"""
        return [obs for obs in self.observed_actions if obs.user == user]
    
    def start_monitoring(self):
        """Start background monitoring thread"""
        self.is_monitoring = True
        monitor_thread = threading.Thread(target=self._background_monitor)
        monitor_thread.daemon = True
        monitor_thread.start()
    
    def _background_monitor(self):
        """Background monitoring for system health"""
        while self.is_monitoring:
            time.sleep(30)  # Check every 30 seconds
            # Perform health checks, cleanup old data, etc.
            self._cleanup_old_observations()
    
    def _cleanup_old_observations(self):
        """Clean up observations older than 7 days"""
        cutoff_time = datetime.now() - timedelta(days=7)
        self.observed_actions = [
            obs for obs in self.observed_actions 
            if obs.timestamp >= cutoff_time
        ]

# Gradio Interface Functions
def create_gradio_interface(observer: ObserverAgent):
    """Create Gradio interface for the Observer Agent"""
    
    def submit_observation(user, action, amount, country, risk_score, is_weekend, attempt_count):
        """Submit a new observation through Gradio"""
        try:
            context = {
                "amount": float(amount) if amount else 0,
                "country": country or "Unknown",
                "risk_score": float(risk_score) if risk_score else 0,
                "is_weekend": is_weekend,
                "attempt_count": int(attempt_count) if attempt_count else 1,
                "timestamp": datetime.now()
            }
            
            observation = observer.watch_action(user, action, context)
            
            return f"✅ Observation recorded for {user}\nRisk Level: {observation.risk_level}\nAlert Triggered: {'Yes' if observation.alert_triggered else 'No'}"
        except Exception as e:
            return f"❌ Error: {str(e)}"
    
    def get_dashboard_data():
        """Get data for dashboard visualization"""
        observations = observer.db_manager.get_observations(500)
        
        if not observations:
            return "No data available", None, None
        
        df = pd.DataFrame(observations)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Risk level distribution
        risk_counts = df['risk_level'].value_counts()
        risk_fig = px.pie(
            values=risk_counts.values, 
            names=risk_counts.index,
            title="Risk Level Distribution",
            color_discrete_map={
                'LOW': '#28a745',
                'MEDIUM': '#ffc107', 
                'HIGH': '#fd7e14',
                'CRITICAL': '#dc3545'
            }
        )
        
        # Activity timeline
        df['hour'] = df['timestamp'].dt.hour
        hourly_activity = df.groupby('hour').size().reset_index(name='count')
        timeline_fig = px.bar(
            hourly_activity, 
            x='hour', 
            y='count',
            title="Activity by Hour of Day",
            labels={'hour': 'Hour of Day', 'count': 'Number of Actions'}
        )
        
        # Top users
        user_counts = df['user'].value_counts().head(10)
        users_fig = px.bar(
            x=user_counts.values,
            y=user_counts.index,
            orientation='h',
            title="Top 10 Most Active Users",
            labels={'x': 'Number of Actions', 'y': 'User'}
        )
        
        # Recent activity table
        recent_df = df.head(20)[['timestamp', 'user', 'action', 'risk_level', 'alert_triggered']]
        recent_df['timestamp'] = recent_df['timestamp'].dt.strftime('%Y-%m-%d %H:%M:%S')
        
        stats_text = f"""
        📊 **System Statistics**
        - Total Observations: {observer.stats['total_observations']}
        - Total Alerts: {observer.stats['total_alerts']}
        - Low Risk: {observer.stats['risk_low']}
        - Medium Risk: {observer.stats['risk_medium']}
        - High Risk: {observer.stats['risk_high']}
        - Critical Risk: {observer.stats['risk_critical']}
        """
        
        return stats_text, risk_fig, timeline_fig, users_fig, recent_df
    
    # Create Gradio interface
    with gr.Blocks(title="Observer Agent Dashboard", theme=gr.themes.Soft()) as interface:
        gr.Markdown("# 👁️ Observer Agent Monitoring System")
        gr.Markdown("Real-time monitoring and risk analysis system")
        
        with gr.Tabs():
            # Submit Observation Tab
            with gr.Tab("Submit Observation"):
                gr.Markdown("## Record New Action")
                
                with gr.Row():
                    with gr.Column():
                        user_input = gr.Textbox(label="User", placeholder="Enter username")
                        action_input = gr.Dropdown(
                            label="Action",
                            choices=[
                                "login_attempt",
                                "flagged_transaction", 
                                "password_reset",
                                "account_locked",
                                "suspicious_access",
                                "data_download",
                                "permission_escalation"
                            ],
                            value="flagged_transaction"
                        )
                    
                    with gr.Column():
                        amount_input = gr.Number(label="Amount", value=1000)
                        country_input = gr.Textbox(label="Country", value="India")
                        risk_score_input = gr.Slider(
                            label="Risk Score", 
                            minimum=0, 
                            maximum=1, 
                            value=0.3,
                            step=0.1
                        )
                        
                    with gr.Column():
                        weekend_input = gr.Checkbox(label="Weekend Activity")
                        attempt_count_input = gr.Number(
                            label="Attempt Count", 
                            value=1, 
                            minimum=1
                        )
                
                submit_btn = gr.Button("Submit Observation", variant="primary")
                result_output = gr.Textbox(label="Result", lines=3)
                
                submit_btn.click(
                    submit_observation,
                    inputs=[
                        user_input, action_input, amount_input, 
                        country_input, risk_score_input, weekend_input, 
                        attempt_count_input
                    ],
                    outputs=result_output
                )
            
            # Dashboard Tab
            with gr.Tab("Dashboard"):
                gr.Markdown("## System Overview")
                
                refresh_btn = gr.Button("Refresh Dashboard", variant="secondary")
                
                with gr.Row():
                    stats_text = gr.Markdown("Loading...")
                
                with gr.Row():
                    with gr.Column():
                        risk_plot = gr.Plot(label="Risk Distribution")
                        timeline_plot = gr.Plot(label="Activity Timeline")
                    
                    with gr.Column():
                        users_plot = gr.Plot(label="Top Users")
                
                recent_table = gr.Dataframe(
                    label="Recent Activity",
                    headers=["Timestamp", "User", "Action", "Risk Level", "Alert Triggered"],
                    datatype=["str", "str", "str", "str", "bool"],
                    max_rows=20
                )
                
                refresh_btn.click(
                    get_dashboard_data,
                    outputs=[stats_text, risk_plot, timeline_plot, users_plot, recent_table]
                )
                
                # Auto-refresh every 30 seconds
                interface.load(
                    get_dashboard_data,
                    outputs=[stats_text, risk_plot, timeline_plot, users_plot, recent_table]
                )
    
    return interface

# Demo and Testing Functions
def simulate_realistic_data(observer: ObserverAgent, num_observations: int = 50):
    """Generate realistic sample data for testing"""
    import random
    
    users = ["Alice", "Bob", "Charlie", "Priya", "David", "Emma", "Frank", "Grace", "Henry", "Ivy"]
    actions = ["login_attempt", "flagged_transaction", "password_reset", "suspicious_access", "data_download"]
    countries = ["India", "USA", "UK", "Nigeria", "Germany", "Japan", "Brazil", "Canada", "Australia", "France"]
    
    print(f"🎲 Generating {num_observations} sample observations...")
    
    for i in range(num_observations):
        user = random.choice(users)
        action = random.choice(actions)
        
        context = {
            "amount": random.uniform(100, 50000),
            "country": random.choice(countries),
            "risk_score": random.uniform(0, 1),
            "is_weekend": random.choice([True, False]),
            "attempt_count": random.randint(1, 5),
            "timestamp": datetime.now() - timedelta(
                hours=random.randint(0, 168)  # Last week
            )
        }
        
        observer.watch_action(user, action, context)
        time.sleep(0.1)  # Small delay to avoid overwhelming output
    
    print(f"✅ Generated {num_observations} observations")

# Main execution
if __name__ == "__main__":
    # Initialize the Observer Agent
    observer = ObserverAgent()
    observer.start_monitoring()
    
    # Generate some sample data for demonstration
    simulate_realistic_data(observer, 100)
    
    # Test manual observation
    print("\n🧪 Testing manual observation:")
    test_obs = observer.watch_action(
        user="Priya",
        action="flagged_transaction",
        context={
            "amount": 9500,
            "country": "India", 
            "is_weekend": True,
            "risk_score": 0.92,
            "attempt_count": 1
        }
    )
    
    print(f"\n📊 Current Stats: {dict(observer.stats)}")
    
    # Create and launch Gradio interface
    print("\n🚀 Launching Gradio interface...")
    interface = create_gradio_interface(observer)
    
    # Launch the interface
    # interface.launch(
    #     server_name="0.0.0.0",  # Allow external access
    #     server_port=7860,
    #     share=False,  # Set to True for public sharing
    #     debug=True
    # )
    
    print("Interface created successfully! Uncomment the launch() call to start the web interface.")

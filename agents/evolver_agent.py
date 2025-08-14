import gradio as gr
import asyncio
import json
import time
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from dataclasses import dataclass, asdict
import os
import requests
import websocket
import threading
from queue import Queue
import base64

# Import AI libraries
try:
    from mistralai.client import MistralClient
    from mistralai.models.chat_completion import ChatMessage
except ImportError:
    print("Install mistralai: pip install mistralai")

try:
    import deepgram
    from deepgram import Deepgram
    from deepgram.utils import verboselogs
except ImportError:
    print("Install deepgram: pip install deepgram-sdk")

try:
    import guardrails as gd
    from guardrails.validators import ValidLength, ToxicLanguage, RestrictToTopic
except ImportError:
    print("Install guardrails: pip install guardrails-ai")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class PerformanceLog:
    """Enhanced performance log with more metrics"""
    step: str
    time_taken_sec: float
    errors: int
    timestamp: datetime
    user_id: str = "default"
    success_rate: float = 0.0
    resource_usage: Dict = None
    metadata: Dict = None

@dataclass
class ImprovementSuggestion:
    """Structured improvement suggestion"""
    priority: str  # HIGH, MEDIUM, LOW
    category: str  # AUTOMATION, OPTIMIZATION, VALIDATION, MONITORING
    description: str
    impact_score: float
    implementation_effort: str
    estimated_time_savings: float

class AIIntegrations:
    """Manages all AI service integrations"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.mistral_client = None
        self.deepgram_client = None
        self.guardrails_guard = None
        self.initialize_services()
    
    def initialize_services(self):
        """Initialize AI services with API keys"""
        # Mistral AI
        if self.config.get("mistral_api_key"):
            try:
                self.mistral_client = MistralClient(api_key=self.config["mistral_api_key"])
                logger.info("Mistral AI initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Mistral AI: {e}")
        
        # Deepgram AI
        if self.config.get("deepgram_api_key"):
            try:
                self.deepgram_client = Deepgram(self.config["deepgram_api_key"])
                logger.info("Deepgram AI initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Deepgram AI: {e}")
        
        # Guardrails AI
        try:
            self.guardrails_guard = gd.Guard.from_pydantic(
                output_class=ImprovementSuggestion,
                validators=[
                    ValidLength(min=10, max=500, on_fail="exception"),
                    ToxicLanguage(on_fail="filter"),
                    RestrictToTopic(valid_topics=["automation", "optimization", "performance"], on_fail="filter")
                ]
            )
            logger.info("Guardrails AI initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Guardrails AI: {e}")

class AdvancedEvolverAgent:
    """Enhanced EvolverAgent with AI capabilities"""
    
    def __init__(self, config: Dict = None):
        self.performance_logs: List[PerformanceLog] = []
        self.ai_integrations = AIIntegrations(config or {})
        self.analysis_cache = {}
        self.improvement_history = []
        self.thresholds = {
            "slow_operation": 30.0,
            "high_error_rate": 2,
            "low_success_rate": 0.8
        }
    
    def log_performance(self, 
                       step: str, 
                       time_taken_sec: float, 
                       errors: int,
                       user_id: str = "default",
                       success_rate: float = 1.0,
                       resource_usage: Dict = None,
                       metadata: Dict = None):
        """Enhanced performance logging"""
        log_entry = PerformanceLog(
            step=step,
            time_taken_sec=time_taken_sec,
            errors=errors,
            timestamp=datetime.now(),
            user_id=user_id,
            success_rate=success_rate,
            resource_usage=resource_usage or {},
            metadata=metadata or {}
        )
        self.performance_logs.append(log_entry)
        logger.info(f"Logged performance for step: {step}")
    
    async def analyze_with_mistral(self, performance_data: List[Dict]) -> Dict:
        """Use Mistral AI to analyze performance patterns"""
        if not self.ai_integrations.mistral_client:
            return {"error": "Mistral AI not configured"}
        
        try:
            # Prepare data summary for Mistral
            data_summary = {
                "total_steps": len(performance_data),
                "avg_time": sum(log["time_taken_sec"] for log in performance_data) / len(performance_data),
                "total_errors": sum(log["errors"] for log in performance_data),
                "steps": [{"step": log["step"], "time": log["time_taken_sec"], "errors": log["errors"]} 
                         for log in performance_data[-10:]]  # Last 10 entries
            }
            
            prompt = f"""
            Analyze the following performance data and provide insights:
            {json.dumps(data_summary, indent=2)}
            
            Please identify:
            1. Performance bottlenecks
            2. Error patterns
            3. Optimization opportunities
            4. Recommended actions
            
            Respond in JSON format with structured recommendations.
            """
            
            messages = [ChatMessage(role="user", content=prompt)]
            response = await self.ai_integrations.mistral_client.chat_stream(
                model="mistral-large-latest",
                messages=messages,
                temperature=0.3
            )
            
            # Collect streaming response
            analysis_text = ""
            async for chunk in response:
                if chunk.choices[0].delta.content:
                    analysis_text += chunk.choices[0].delta.content
            
            # Parse JSON response
            try:
                analysis = json.loads(analysis_text)
            except json.JSONDecodeError:
                analysis = {"raw_analysis": analysis_text}
            
            return analysis
            
        except Exception as e:
            logger.error(f"Mistral analysis failed: {e}")
            return {"error": str(e)}
    
    async def process_audio_feedback(self, audio_file_path: str) -> Dict:
        """Process audio feedback using Deepgram AI"""
        if not self.ai_integrations.deepgram_client:
            return {"error": "Deepgram AI not configured"}
        
        try:
            # Configure Deepgram options
            options = {
                "model": "nova-2",
                "language": "en",
                "punctuate": True,
                "diarize": True,
                "smart_format": True,
                "sentiment": True,
                "topics": True
            }
            
            # Process audio file
            with open(audio_file_path, "rb") as audio:
                source = {"buffer": audio.read(), "mimetype": "audio/wav"}
                response = await self.ai_integrations.deepgram_client.transcription.prerecorded(
                    source, options
                )
            
            # Extract insights
            transcript = response["results"]["channels"][0]["alternatives"][0]["transcript"]
            sentiment = response["results"]["channels"][0]["alternatives"][0].get("sentiment", {})
            topics = response["results"].get("topics", {}).get("segments", [])
            
            return {
                "transcript": transcript,
                "sentiment": sentiment,
                "topics": topics,
                "confidence": response["results"]["channels"][0]["alternatives"][0]["confidence"]
            }
            
        except Exception as e:
            logger.error(f"Deepgram processing failed: {e}")
            return {"error": str(e)}
    
    def validate_suggestions_with_guardrails(self, suggestions: List[Dict]) -> List[Dict]:
        """Validate improvement suggestions using Guardrails AI"""
        if not self.ai_integrations.guardrails_guard:
            return suggestions
        
        validated_suggestions = []
        
        for suggestion in suggestions:
            try:
                # Create prompt for validation
                prompt = f"Validate this improvement suggestion: {suggestion['description']}"
                
                # Use guardrails to validate
                validated_output = self.ai_integrations.guardrails_guard(
                    llm_api=lambda prompt: suggestion['description'],  # Mock LLM for validation
                    prompt=prompt
                )
                
                suggestion['validated'] = True
                suggestion['guardrails_score'] = validated_output.validation_passed
                validated_suggestions.append(suggestion)
                
            except Exception as e:
                logger.warning(f"Guardrails validation failed for suggestion: {e}")
                suggestion['validated'] = False
                suggestion['validation_error'] = str(e)
                validated_suggestions.append(suggestion)
        
        return validated_suggestions
    
    def generate_advanced_suggestions(self) -> List[ImprovementSuggestion]:
        """Generate sophisticated improvement suggestions"""
        if not self.performance_logs:
            return []
        
        suggestions = []
        
        # Analyze recent performance
        recent_logs = self.performance_logs[-50:]  # Last 50 entries
        
        # Group by step for analysis
        step_analysis = {}
        for log in recent_logs:
            if log.step not in step_analysis:
                step_analysis[log.step] = {
                    "times": [],
                    "errors": [],
                    "success_rates": [],
                    "count": 0
                }
            
            step_analysis[log.step]["times"].append(log.time_taken_sec)
            step_analysis[log.step]["errors"].append(log.errors)
            step_analysis[log.step]["success_rates"].append(log.success_rate)
            step_analysis[log.step]["count"] += 1
        
        # Generate suggestions based on analysis
        for step, data in step_analysis.items():
            avg_time = sum(data["times"]) / len(data["times"])
            avg_errors = sum(data["errors"]) / len(data["errors"])
            avg_success_rate = sum(data["success_rates"]) / len(data["success_rates"])
            
            # Time-based suggestions
            if avg_time > self.thresholds["slow_operation"]:
                suggestions.append(ImprovementSuggestion(
                    priority="HIGH",
                    category="OPTIMIZATION",
                    description=f"Optimize '{step}' - averaging {avg_time:.1f}s (target: <{self.thresholds['slow_operation']}s)",
                    impact_score=min(avg_time / self.thresholds["slow_operation"] * 10, 10),
                    implementation_effort="MEDIUM",
                    estimated_time_savings=avg_time * 0.3 * data["count"]
                ))
            
            # Error-based suggestions
            if avg_errors > self.thresholds["high_error_rate"]:
                suggestions.append(ImprovementSuggestion(
                    priority="HIGH",
                    category="VALIDATION",
                    description=f"Add error handling to '{step}' - averaging {avg_errors:.1f} errors",
                    impact_score=min(avg_errors * 2, 10),
                    implementation_effort="LOW",
                    estimated_time_savings=avg_errors * 5 * data["count"]
                ))
            
            # Success rate suggestions
            if avg_success_rate < self.thresholds["low_success_rate"]:
                suggestions.append(ImprovementSuggestion(
                    priority="MEDIUM",
                    category="MONITORING",
                    description=f"Improve reliability of '{step}' - {avg_success_rate:.1%} success rate",
                    impact_score=min((1 - avg_success_rate) * 15, 10),
                    implementation_effort="MEDIUM",
                    estimated_time_savings=data["count"] * 10
                ))
        
        # Sort by impact score
        suggestions.sort(key=lambda x: x.impact_score, reverse=True)
        return suggestions[:10]  # Return top 10 suggestions
    
    def generate_performance_dashboard(self) -> Tuple[go.Figure, go.Figure, pd.DataFrame]:
        """Generate interactive dashboard components"""
        if not self.performance_logs:
            return None, None, pd.DataFrame()
        
        # Convert logs to DataFrame
        df = pd.DataFrame([asdict(log) for log in self.performance_logs])
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Time series chart
        fig_timeline = go.Figure()
        
        for step in df['step'].unique():
            step_data = df[df['step'] == step]
            fig_timeline.add_trace(go.Scatter(
                x=step_data['timestamp'],
                y=step_data['time_taken_sec'],
                mode='lines+markers',
                name=step,
                hovertemplate='<b>%{fullData.name}</b><br>' +
                             'Time: %{y:.1f}s<br>' +
                             'Errors: %{customdata}<br>' +
                             '<extra></extra>',
                customdata=step_data['errors']
            ))
        
        fig_timeline.update_layout(
            title='Performance Timeline',
            xaxis_title='Time',
            yaxis_title='Execution Time (seconds)',
            hovermode='closest'
        )
        
        # Error analysis chart
        error_summary = df.groupby('step').agg({
            'errors': ['sum', 'mean'],
            'time_taken_sec': 'mean'
        }).round(2)
        
        fig_errors = px.bar(
            x=error_summary.index,
            y=error_summary[('errors', 'sum')],
            title='Error Count by Step',
            labels={'x': 'Step', 'y': 'Total Errors'}
        )
        
        return fig_timeline, fig_errors, df

def create_gradio_interface(agent: AdvancedEvolverAgent):
    """Create comprehensive Gradio interface"""
    
    def log_performance_ui(step, time_taken, errors, user_id, success_rate):
        """UI function for logging performance"""
        try:
            agent.log_performance(
                step=step,
                time_taken_sec=float(time_taken),
                errors=int(errors),
                user_id=user_id or "default",
                success_rate=float(success_rate) / 100
            )
            return f"✅ Logged performance for step: {step}"
        except Exception as e:
            return f"❌ Error logging performance: {str(e)}"
    
    def get_suggestions_ui():
        """UI function for getting suggestions"""
        try:
            suggestions = agent.generate_advanced_suggestions()
            if not suggestions:
                return "📊 No suggestions available. Log some performance data first!"
            
            output = "🚀 **Improvement Suggestions:**\n\n"
            for i, suggestion in enumerate(suggestions[:5], 1):
                priority_emoji = {"HIGH": "🔴", "MEDIUM": "🟡", "LOW": "🟢"}
                category_emoji = {
                    "OPTIMIZATION": "⚡",
                    "VALIDATION": "🛡️",
                    "MONITORING": "📊",
                    "AUTOMATION": "🤖"
                }
                
                output += f"{i}. {priority_emoji[suggestion.priority]} **{suggestion.category}**\n"
                output += f"   {category_emoji.get(suggestion.category, '🔧')} {suggestion.description}\n"
                output += f"   📈 Impact Score: {suggestion.impact_score:.1f}/10\n"
                output += f"   ⏱️ Est. Time Savings: {suggestion.estimated_time_savings:.1f}s\n"
                output += f"   🔨 Effort: {suggestion.implementation_effort}\n\n"
            
            return output
        except Exception as e:
            return f"❌ Error generating suggestions: {str(e)}"
    
    def get_dashboard_ui():
        """UI function for dashboard"""
        try:
            fig_timeline, fig_errors, df = agent.generate_performance_dashboard()
            if fig_timeline is None:
                return None, None, "No data available for dashboard"
            
            summary = f"""
            📊 **Performance Summary**
            - Total Steps Logged: {len(df)}
            - Unique Steps: {df['step'].nunique()}
            - Average Execution Time: {df['time_taken_sec'].mean():.2f}s
            - Total Errors: {df['errors'].sum()}
            - Date Range: {df['timestamp'].min().strftime('%Y-%m-%d')} to {df['timestamp'].max().strftime('%Y-%m-%d')}
            """
            
            return fig_timeline, fig_errors, summary
        except Exception as e:
            return None, None, f"❌ Error generating dashboard: {str(e)}"
    
    async def analyze_with_ai_ui(analysis_type):
        """UI function for AI analysis"""
        try:
            if analysis_type == "Mistral AI Analysis":
                if not agent.performance_logs:
                    return "No performance data to analyze"
                
                # Convert logs to dict format
                performance_data = [asdict(log) for log in agent.performance_logs[-20:]]
                analysis = await agent.analyze_with_mistral(performance_data)
                
                if "error" in analysis:
                    return f"❌ Analysis failed: {analysis['error']}"
                
                return f"🤖 **Mistral AI Analysis:**\n\n{json.dumps(analysis, indent=2)}"
            
            else:
                return "Select an analysis type"
                
        except Exception as e:
            return f"❌ Error in AI analysis: {str(e)}"
    
    # Create Gradio interface
    with gr.Blocks(title="🚀 Advanced EvolverAgent Dashboard", theme=gr.themes.Soft()) as interface:
        gr.Markdown("""
        # 🚀 Advanced EvolverAgent Dashboard
        
        **AI-Powered Performance Optimization System**
        
        Integrate with Mistral AI, Deepgram AI, and Guardrails AI for comprehensive performance analysis and improvement suggestions.
        """)
        
        with gr.Tabs():
            # Performance Logging Tab
            with gr.TabItem("📝 Log Performance"):
                with gr.Row():
                    with gr.Column():
                        step_input = gr.Textbox(label="Step Name", placeholder="e.g., document_processing")
                        time_input = gr.Number(label="Time Taken (seconds)", value=0.0)
                        errors_input = gr.Number(label="Number of Errors", value=0)
                        user_input = gr.Textbox(label="User ID", value="default")
                        success_rate_input = gr.Slider(label="Success Rate (%)", minimum=0, maximum=100, value=100)
                        
                        log_btn = gr.Button("📝 Log Performance", variant="primary")
                        log_output = gr.Textbox(label="Status", interactive=False)
                
                log_btn.click(
                    log_performance_ui,
                    inputs=[step_input, time_input, errors_input, user_input, success_rate_input],
                    outputs=log_output
                )
            
            # Suggestions Tab
            with gr.TabItem("💡 AI Suggestions"):
                suggest_btn = gr.Button("🚀 Generate Suggestions", variant="primary")
                suggestions_output = gr.Markdown()
                
                suggest_btn.click(get_suggestions_ui, outputs=suggestions_output)
            
            # Dashboard Tab
            with gr.TabItem("📊 Performance Dashboard"):
                dashboard_btn = gr.Button("📊 Generate Dashboard", variant="primary")
                
                with gr.Row():
                    timeline_plot = gr.Plot(label="Performance Timeline")
                    errors_plot = gr.Plot(label="Error Analysis")
                
                dashboard_summary = gr.Markdown()
                
                dashboard_btn.click(
                    get_dashboard_ui,
                    outputs=[timeline_plot, errors_plot, dashboard_summary]
                )
            
            # AI Analysis Tab
            with gr.TabItem("🤖 AI Analysis"):
                analysis_type = gr.Dropdown(
                    choices=["Mistral AI Analysis", "Deepgram Audio Analysis"],
                    label="Analysis Type",
                    value="Mistral AI Analysis"
                )
                
                analyze_btn = gr.Button("🔍 Analyze with AI", variant="primary")
                analysis_output = gr.Markdown()
                
                # Note: This would need to be wrapped in an async interface for real use
                analyze_btn.click(
                    lambda x: "🤖 AI Analysis feature requires async setup. See implementation notes.",
                    inputs=analysis_type,
                    outputs=analysis_output
                )
            
            # Configuration Tab
            with gr.TabItem("⚙️ Configuration"):
                gr.Markdown("""
                ## API Configuration
                
                To enable AI features, configure your API keys:
                
                ```python
                config = {
                    "mistral_api_key": "your_mistral_key",
                    "deepgram_api_key": "your_deepgram_key"
                }
                agent = AdvancedEvolverAgent(config)
                ```
                
                ## Features
                
                - 📝 **Performance Logging**: Track execution times, errors, and success rates
                - 💡 **AI Suggestions**: Get intelligent optimization recommendations
                - 📊 **Interactive Dashboard**: Visualize performance trends
                - 🤖 **Mistral AI Integration**: Advanced pattern analysis
                - 🎤 **Deepgram AI**: Audio feedback processing
                - 🛡️ **Guardrails AI**: Suggestion validation and safety
                """)
    
    return interface

# Example usage and setup
if __name__ == "__main__":
    # Configuration (replace with your actual API keys)
    config = {
        "mistral_api_key": os.getenv("MISTRAL_API_KEY"),
        "deepgram_api_key": os.getenv("DEEPGRAM_API_KEY"),
    }
    
    # Initialize the enhanced agent
    agent = AdvancedEvolverAgent(config)
    
    # Add some sample data for demonstration
    sample_steps = [
        ("document_processing", 45.2, 3),
        ("email_automation", 2.1, 0),
        ("data_validation", 12.5, 1),
        ("report_generation", 35.8, 2),
        ("user_notification", 1.2, 0),
    ]
    
    for step, time_taken, errors in sample_steps:
        agent.log_performance(step, time_taken, errors)
    
    # Create and launch the Gradio interface
    interface = create_gradio_interface(agent)
    
    print("🚀 Starting Advanced EvolverAgent Dashboard...")
    interface.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=True,
        show_error=True
    )

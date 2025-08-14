import gradio as gr
import json
import asyncio
from typing import Dict, List, Optional, Tuple
import requests
import os
from datetime import datetime
import logging
from dataclasses import dataclass, asdict
from enum import Enum
import re

# Third-party imports (you'll need to install these)
try:
    from mistralai.client import MistralClient
    from mistralai.models.chat_completion import ChatMessage
except ImportError:
    print("Please install: pip install mistralai")

try:
    import deepgram
    from deepgram import DeepgramClient, PrerecordedOptions, FileSource
except ImportError:
    print("Please install: pip install deepgram-sdk")

try:
    import guardrails as gd
    from guardrails.validators import ValidRange, ValidChoices
except ImportError:
    print("Please install: pip install guardrails-ai")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class TransactionScenario:
    """Data class for transaction scenarios"""
    amount: float
    country: str
    is_weekend: bool
    customer_type: str
    transaction_type: str
    risk_score: float
    timestamp: str = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()

class MemoryAgent:
    """Enhanced memory system for storing training sessions and scenarios"""
    
    def __init__(self):
        self.scenarios_history: List[TransactionScenario] = []
        self.teaching_sessions: List[Dict] = []
        self.user_progress: Dict = {
            "scenarios_completed": 0,
            "correct_decisions": 0,
            "areas_for_improvement": []
        }
    
    def store_scenario(self, scenario: TransactionScenario, user_decision: str, correct_decision: str):
        """Store a completed scenario with user's decision"""
        self.scenarios_history.append(scenario)
        session = {
            "scenario": asdict(scenario),
            "user_decision": user_decision,
            "correct_decision": correct_decision,
            "timestamp": datetime.now().isoformat(),
            "was_correct": user_decision.lower() == correct_decision.lower()
        }
        self.teaching_sessions.append(session)
        
        # Update progress
        self.user_progress["scenarios_completed"] += 1
        if session["was_correct"]:
            self.user_progress["correct_decisions"] += 1
    
    def get_performance_summary(self) -> Dict:
        """Get user performance summary"""
        total = self.user_progress["scenarios_completed"]
        correct = self.user_progress["correct_decisions"]
        accuracy = (correct / total * 100) if total > 0 else 0
        
        return {
            "total_scenarios": total,
            "correct_decisions": correct,
            "accuracy": accuracy,
            "recent_sessions": self.teaching_sessions[-5:] if self.teaching_sessions else []
        }

class GuardrailsValidator:
    """Guardrails integration for input validation"""
    
    def __init__(self):
        # Define validation guards
        self.amount_guard = ValidRange(min=0, max=1000000)
        self.risk_score_guard = ValidRange(min=0.0, max=1.0)
        self.country_guard = ValidChoices(choices=[
            "India", "China", "Nigeria", "USA", "UK", "Germany", 
            "Brazil", "Russia", "South Africa", "Japan"
        ])
    
    def validate_scenario(self, scenario_data: Dict) -> Tuple[bool, List[str]]:
        """Validate scenario input using guardrails"""
        errors = []
        
        try:
            # Validate amount
            self.amount_guard.validate(scenario_data.get("amount", 0))
        except Exception as e:
            errors.append(f"Amount validation failed: {str(e)}")
        
        try:
            # Validate risk score
            self.risk_score_guard.validate(scenario_data.get("risk_score", 0))
        except Exception as e:
            errors.append(f"Risk score validation failed: {str(e)}")
        
        try:
            # Validate country
            self.country_guard.validate(scenario_data.get("country", ""))
        except Exception as e:
            errors.append(f"Country validation failed: {str(e)}")
        
        return len(errors) == 0, errors

class MistralAIIntegration:
    """Mistral AI integration for generating explanations and scenarios"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("MISTRAL_API_KEY")
        if self.api_key:
            self.client = MistralClient(api_key=self.api_key)
        else:
            self.client = None
            logger.warning("Mistral API key not provided. AI features will be limited.")
    
    async def generate_explanation(self, scenario: TransactionScenario, decision: str) -> str:
        """Generate AI-powered explanation for compliance decision"""
        if not self.client:
            return self._fallback_explanation(scenario, decision)
        
        try:
            prompt = f"""
            As a compliance expert, explain why this transaction requires the decision: {decision}
            
            Transaction Details:
            - Amount: ${scenario.amount:,.2f}
            - Country: {scenario.country}
            - Weekend Transaction: {scenario.is_weekend}
            - Customer Type: {scenario.customer_type}
            - Transaction Type: {scenario.transaction_type}
            - Risk Score: {scenario.risk_score}
            
            Provide a clear, educational explanation covering:
            1. Key risk factors
            2. Regulatory considerations
            3. Best practices for similar cases
            4. Step-by-step reasoning
            
            Keep it concise but thorough for training purposes.
            """
            
            messages = [ChatMessage(role="user", content=prompt)]
            response = self.client.chat(
                model="mistral-medium",
                messages=messages,
                max_tokens=500
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            logger.error(f"Mistral AI error: {str(e)}")
            return self._fallback_explanation(scenario, decision)
    
    def _fallback_explanation(self, scenario: TransactionScenario, decision: str) -> str:
        """Fallback explanation when AI is unavailable"""
        explanations = {
            "approve": f"This ${scenario.amount:,.2f} transaction from {scenario.country} appears to meet standard approval criteria based on the risk score of {scenario.risk_score}.",
            "review": f"This transaction requires review due to elevated risk factors: amount ${scenario.amount:,.2f}, country {scenario.country}, risk score {scenario.risk_score}.",
            "reject": f"This transaction should be rejected due to high risk: ${scenario.amount:,.2f} from {scenario.country} with risk score {scenario.risk_score}."
        }
        return explanations.get(decision.lower(), "Decision explanation not available.")
    
    async def generate_scenario(self, difficulty: str = "medium") -> Dict:
        """Generate a new training scenario"""
        if not self.client:
            return self._fallback_scenario(difficulty)
        
        try:
            prompt = f"""
            Generate a realistic compliance training scenario with {difficulty} difficulty.
            
            Return a JSON object with:
            - amount: transaction amount (number)
            - country: origin country (string)
            - is_weekend: whether it's a weekend (boolean)
            - customer_type: type of customer (string)
            - transaction_type: type of transaction (string)
            - risk_score: risk score 0-1 (number)
            
            Make it realistic and educational for compliance training.
            """
            
            messages = [ChatMessage(role="user", content=prompt)]
            response = self.client.chat(
                model="mistral-medium",
                messages=messages,
                max_tokens=200
            )
            
            # Parse JSON from response
            content = response.choices[0].message.content
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return self._fallback_scenario(difficulty)
                
        except Exception as e:
            logger.error(f"Scenario generation error: {str(e)}")
            return self._fallback_scenario(difficulty)
    
    def _fallback_scenario(self, difficulty: str) -> Dict:
        """Fallback scenario generation"""
        scenarios = {
            "easy": {
                "amount": 1500,
                "country": "USA",
                "is_weekend": False,
                "customer_type": "retail",
                "transaction_type": "wire_transfer",
                "risk_score": 0.3
            },
            "medium": {
                "amount": 8500,
                "country": "Nigeria",
                "is_weekend": True,
                "customer_type": "business",
                "transaction_type": "international_transfer",
                "risk_score": 0.7
            },
            "hard": {
                "amount": 25000,
                "country": "Russia",
                "is_weekend": True,
                "customer_type": "high_net_worth",
                "transaction_type": "crypto_exchange",
                "risk_score": 0.92
            }
        }
        return scenarios.get(difficulty, scenarios["medium"])

class DeepgramIntegration:
    """Deepgram integration for voice interactions"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("DEEPGRAM_API_KEY")
        if self.api_key:
            self.deepgram = DeepgramClient(self.api_key)
        else:
            self.deepgram = None
            logger.warning("Deepgram API key not provided. Voice features disabled.")
    
    async def transcribe_audio(self, audio_file_path: str) -> str:
        """Transcribe audio to text"""
        if not self.deepgram:
            return "Voice transcription unavailable (API key not configured)"
        
        try:
            with open(audio_file_path, "rb") as file:
                buffer_data = file.read()
            
            payload: FileSource = {
                "buffer": buffer_data,
            }
            
            options = PrerecordedOptions(
                model="nova-2",
                smart_format=True,
            )
            
            response = self.deepgram.listen.prerecorded.v("1").transcribe_file(payload, options)
            
            transcript = response["results"]["channels"][0]["alternatives"][0]["transcript"]
            return transcript
        
        except Exception as e:
            logger.error(f"Deepgram transcription error: {str(e)}")
            return f"Transcription error: {str(e)}"

class EnhancedTeacherAgent:
    """Enhanced Teacher Agent with AI integration"""
    
    def __init__(self):
        self.memory = MemoryAgent()
        self.mistral = MistralAIIntegration()
        self.deepgram = DeepgramIntegration()
        self.validator = GuardrailsValidator()
    
    def calculate_risk_level(self, scenario: TransactionScenario) -> RiskLevel:
        """Calculate risk level based on scenario parameters"""
        risk_factors = 0
        
        # Amount risk
        if scenario.amount > 10000:
            risk_factors += 2
        elif scenario.amount > 5000:
            risk_factors += 1
        
        # Country risk (simplified)
        high_risk_countries = ["Nigeria", "Russia", "China"]
        if scenario.country in high_risk_countries:
            risk_factors += 2
        
        # Weekend risk
        if scenario.is_weekend:
            risk_factors += 1
        
        # Risk score
        if scenario.risk_score > 0.8:
            risk_factors += 3
        elif scenario.risk_score > 0.6:
            risk_factors += 2
        elif scenario.risk_score > 0.4:
            risk_factors += 1
        
        # Determine risk level
        if risk_factors >= 6:
            return RiskLevel.CRITICAL
        elif risk_factors >= 4:
            return RiskLevel.HIGH
        elif risk_factors >= 2:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.LOW
    
    def get_recommended_decision(self, scenario: TransactionScenario) -> str:
        """Get recommended decision based on risk assessment"""
        risk_level = self.calculate_risk_level(scenario)
        
        decision_map = {
            RiskLevel.LOW: "approve",
            RiskLevel.MEDIUM: "review",
            RiskLevel.HIGH: "reject",
            RiskLevel.CRITICAL: "reject"
        }
        
        return decision_map[risk_level]
    
    async def teach_step(self, scenario: TransactionScenario) -> Dict:
        """Enhanced teaching step with AI explanations"""
        risk_level = self.calculate_risk_level(scenario)
        recommended_decision = self.get_recommended_decision(scenario)
        
        # Generate AI explanation
        explanation = await self.mistral.generate_explanation(scenario, recommended_decision)
        
        # Create teaching response
        teaching_response = {
            "scenario": asdict(scenario),
            "risk_level": risk_level.value,
            "recommended_decision": recommended_decision,
            "explanation": explanation,
            "risk_factors": self._identify_risk_factors(scenario),
            "compliance_steps": self._get_compliance_steps(scenario)
        }
        
        return teaching_response
    
    def _identify_risk_factors(self, scenario: TransactionScenario) -> List[str]:
        """Identify specific risk factors in the scenario"""
        factors = []
        
        if scenario.amount > 10000:
            factors.append(f"High amount: ${scenario.amount:,.2f}")
        if scenario.is_weekend:
            factors.append("Weekend transaction (higher risk)")
        if scenario.risk_score > 0.7:
            factors.append(f"High risk score: {scenario.risk_score}")
        if scenario.country in ["Nigeria", "Russia", "China"]:
            factors.append(f"High-risk country: {scenario.country}")
        
        return factors
    
    def _get_compliance_steps(self, scenario: TransactionScenario) -> List[str]:
        """Get recommended compliance steps"""
        steps = ["Verify customer identity"]
        
        if scenario.amount > 5000:
            steps.append("Check enhanced due diligence requirements")
        if scenario.is_weekend:
            steps.append("Flag for Monday review")
        if scenario.risk_score > 0.8:
            steps.append("Escalate to compliance team immediately")
        if scenario.country in ["Nigeria", "Russia", "China"]:
            steps.append("Check current sanction lists")
        
        return steps

# Initialize the enhanced teacher agent
teacher_agent = EnhancedTeacherAgent()

async def create_gradio_interface():
    """Create the Gradio interface for the compliance training system"""
    
    async def process_scenario(amount, country, is_weekend, customer_type, transaction_type, risk_score, user_decision):
        """Process a training scenario"""
        try:
            # Validate inputs
            scenario_data = {
                "amount": float(amount),
                "country": country,
                "risk_score": float(risk_score)
            }
            
            is_valid, errors = teacher_agent.validator.validate_scenario(scenario_data)
            if not is_valid:
                return f"Validation errors: {'; '.join(errors)}", "", "", ""
            
            # Create scenario
            scenario = TransactionScenario(
                amount=float(amount),
                country=country,
                is_weekend=is_weekend,
                customer_type=customer_type,
                transaction_type=transaction_type,
                risk_score=float(risk_score)
            )
            
            # Get teaching response
            teaching_response = await teacher_agent.teach_step(scenario)
            
            # Store in memory
            teacher_agent.memory.store_scenario(
                scenario, 
                user_decision, 
                teaching_response["recommended_decision"]
            )
            
            # Format response
            risk_factors = "\n".join([f"• {factor}" for factor in teaching_response["risk_factors"]])
            compliance_steps = "\n".join([f"{i+1}. {step}" for i, step in enumerate(teaching_response["compliance_steps"])])
            
            result_text = f"""
🎯 **Recommended Decision:** {teaching_response["recommended_decision"].upper()}
🚨 **Risk Level:** {teaching_response["risk_level"].upper()}

**Your Decision:** {user_decision.upper()}
**Result:** {'✅ Correct!' if user_decision.lower() == teaching_response["recommended_decision"] else '❌ Incorrect'}

**Risk Factors Identified:**
{risk_factors}

**Compliance Steps:**
{compliance_steps}
            """
            
            return result_text, teaching_response["explanation"], "", ""
            
        except Exception as e:
            logger.error(f"Error processing scenario: {str(e)}")
            return f"Error: {str(e)}", "", "", ""
    
    async def generate_new_scenario(difficulty):
        """Generate a new training scenario"""
        try:
            scenario_data = await teacher_agent.mistral.generate_scenario(difficulty.lower())
            
            return (
                scenario_data.get("amount", 5000),
                scenario_data.get("country", "USA"),
                scenario_data.get("is_weekend", False),
                scenario_data.get("customer_type", "retail"),
                scenario_data.get("transaction_type", "wire_transfer"),
                scenario_data.get("risk_score", 0.5)
            )
        except Exception as e:
            logger.error(f"Error generating scenario: {str(e)}")
            return 5000, "USA", False, "retail", "wire_transfer", 0.5
    
    def get_performance_summary():
        """Get user performance summary"""
        summary = teacher_agent.memory.get_performance_summary()
        
        return f"""
📊 **Performance Summary**
Total Scenarios Completed: {summary['total_scenarios']}
Correct Decisions: {summary['correct_decisions']}
Accuracy: {summary['accuracy']:.1f}%

Recent Performance: {len(summary['recent_sessions'])} recent sessions
        """
    
    async def transcribe_voice_input(audio_file):
        """Transcribe voice input for decision"""
        if audio_file is None:
            return "No audio file provided"
        
        try:
            transcript = await teacher_agent.deepgram.transcribe_audio(audio_file)
            return transcript
        except Exception as e:
            return f"Transcription error: {str(e)}"
    
    # Create Gradio interface
    with gr.Blocks(title="AI-Powered Compliance Training System", theme=gr.themes.Soft()) as interface:
        gr.Markdown("# 🏦 AI-Powered Compliance Training System")
        gr.Markdown("Learn financial compliance through AI-powered scenarios with voice interaction capabilities.")
        
        with gr.Tab("Training Scenario"):
            with gr.Row():
                with gr.Column(scale=1):
                    gr.Markdown("## 📝 Transaction Details")
                    amount = gr.Number(label="Amount ($)", value=5000, minimum=0, maximum=1000000)
                    country = gr.Dropdown(
                        label="Country",
                        choices=["India", "China", "Nigeria", "USA", "UK", "Germany", "Brazil", "Russia", "South Africa", "Japan"],
                        value="USA"
                    )
                    is_weekend = gr.Checkbox(label="Weekend Transaction", value=False)
                    customer_type = gr.Dropdown(
                        label="Customer Type",
                        choices=["retail", "business", "high_net_worth", "institutional"],
                        value="retail"
                    )
                    transaction_type = gr.Dropdown(
                        label="Transaction Type",
                        choices=["wire_transfer", "international_transfer", "crypto_exchange", "cash_deposit"],
                        value="wire_transfer"
                    )
                    risk_score = gr.Slider(label="Risk Score", minimum=0.0, maximum=1.0, step=0.01, value=0.5)
                    
                    gr.Markdown("## 🎤 Your Decision")
                    user_decision = gr.Radio(
                        label="What should be done with this transaction?",
                        choices=["approve", "review", "reject"],
                        value="review"
                    )
                    
                    # Voice input option
                    audio_input = gr.Audio(label="Or speak your decision", type="filepath")
                    voice_transcript = gr.Textbox(label="Voice Transcript", interactive=False)
                    
                    transcribe_btn = gr.Button("🎙️ Transcribe Voice")
                    process_btn = gr.Button("📊 Analyze Scenario", variant="primary")
                
                with gr.Column(scale=1):
                    gr.Markdown("## 🎯 Analysis Results")
                    result_output = gr.Textbox(label="Decision Analysis", lines=15, interactive=False)
                    ai_explanation = gr.Textbox(label="AI Expert Explanation", lines=10, interactive=False)
        
        with gr.Tab("Scenario Generator"):
            with gr.Row():
                with gr.Column():
                    difficulty = gr.Radio(
                        label="Difficulty Level",
                        choices=["Easy", "Medium", "Hard"],
                        value="Medium"
                    )
                    generate_btn = gr.Button("🎲 Generate New Scenario", variant="primary")
                    
        with gr.Tab("Performance"):
            with gr.Column():
                performance_btn = gr.Button("📈 View Performance Summary", variant="secondary")
                performance_output = gr.Textbox(label="Performance Summary", lines=10, interactive=False)
        
        # Event handlers
        transcribe_btn.click(
            fn=transcribe_voice_input,
            inputs=[audio_input],
            outputs=[voice_transcript]
        )
        
        process_btn.click(
            fn=process_scenario,
            inputs=[amount, country, is_weekend, customer_type, transaction_type, risk_score, user_decision],
            outputs=[result_output, ai_explanation, gr.Textbox(visible=False), gr.Textbox(visible=False)]
        )
        
        generate_btn.click(
            fn=generate_new_scenario,
            inputs=[difficulty],
            outputs=[amount, country, is_weekend, customer_type, transaction_type, risk_score]
        )
        
        performance_btn.click(
            fn=get_performance_summary,
            inputs=[],
            outputs=[performance_output]
        )
    
    return interface

# Main execution
if __name__ == "__main__":
    # Set up environment variables (you'll need to set these)
    print("🚀 Starting AI-Powered Compliance Training System")
    print("📝 Make sure to set your API keys:")
    print("   - MISTRAL_API_KEY for AI explanations")
    print("   - DEEPGRAM_API_KEY for voice transcription")
    
    # Create and launch the interface
    interface = asyncio.run(create_gradio_interface())
    interface.launch(
        share=True,
        server_name="0.0.0.0",
        server_port=7860,
        show_error=True
    )

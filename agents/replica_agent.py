import gradio as gr
import json
import requests
from datetime import datetime
from typing import Dict, List, Any
import pandas as pd

class MemoryAgent:
    """Enhanced memory agent to store and retrieve expert knowledge"""
    def __init__(self):
        self.expert_knowledge = {}
        self.transaction_history = []
        
    def store_expert_knowledge(self, expert: str, domain: str, knowledge: str):
        if expert not in self.expert_knowledge:
            self.expert_knowledge[expert] = {}
        self.expert_knowledge[expert][domain] = {
            "knowledge": knowledge,
            "timestamp": datetime.now().isoformat()
        }
        
    def get_expert_knowledge(self, expert: str, domain: str):
        return self.expert_knowledge.get(expert, {}).get(domain, {}).get("knowledge", "")
        
    def store_transaction(self, transaction: Dict):
        transaction["timestamp"] = datetime.now().isoformat()
        self.transaction_history.append(transaction)

class ReplicaAgent:
    """Enhanced ReplicaAgent with Mistral AI integration"""
    def __init__(self, memory_agent, mistral_api_key=None):
        self.memory = memory_agent
        self.workflows = {}
        self.mistral_api_key = mistral_api_key
        self.mistral_base_url = "https://api.mistral.ai/v1/chat/completions"
        
    def query_mistral(self, prompt: str) -> str:
        """Query Mistral AI for intelligent workflow generation"""
        if not self.mistral_api_key:
            return "Mistral API key not provided. Using fallback logic."
            
        headers = {
            "Authorization": f"Bearer {self.mistral_api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "mistral-medium",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 500
        }
        
        try:
            response = requests.post(self.mistral_base_url, headers=headers, json=data)
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            else:
                return f"Mistral API Error: {response.status_code} - {response.text}"
        except Exception as e:
            return f"Error connecting to Mistral: {str(e)}"
    
    def build_workflow(self, goal: str, expert: str, context: str = "") -> Dict:
        """Build intelligent workflow using expert knowledge and Mistral AI"""
        expert_knowledge = self.memory.get_expert_knowledge(expert, goal)
        
        # Create enhanced prompt for Mistral
        prompt = f"""
        As an AI assistant helping build fraud detection workflows, create a detailed workflow for the goal: "{goal}"
        
        Expert: {expert}
        Expert's knowledge: {expert_knowledge}
        Additional context: {context}
        
        Please provide a JSON response with:
        1. "steps": A list of specific steps for this workflow
        2. "logic": Python-like conditional logic string
        3. "risk_factors": List of key risk indicators
        4. "thresholds": Recommended threshold values
        
        Focus on practical fraud detection rules that can be implemented.
        """
        
        ai_response = self.query_mistral(prompt)
        
        # Fallback workflow structure
        workflow = {
            "goal": goal,
            "steps": [
                "Validate transaction data",
                "Check transaction amount against limits",
                "Verify merchant and location data",
                "Assess customer behavior patterns",
                "Calculate risk score",
                "Apply decision rules"
            ],
            "logic": f"if amount > 5000 and country_risk > 0.7: escalate",
            "risk_factors": ["high_amount", "suspicious_location", "unusual_timing"],
            "thresholds": {"amount": 5000, "risk_score": 0.7},
            "built_from": f"Expert: {expert}",
            "ai_enhancement": ai_response,
            "timestamp": datetime.now().isoformat()
        }
        
        self.workflows[goal] = workflow
        return workflow
    
    def evaluate_transaction(self, workflow_name: str, transaction_data: Dict) -> Dict:
        """Evaluate a transaction against a workflow"""
        if workflow_name not in self.workflows:
            return {"error": "Workflow not found"}
            
        workflow = self.workflows[workflow_name]
        
        # Store transaction for analysis
        self.memory.store_transaction(transaction_data)
        
        # Basic evaluation logic
        amount = float(transaction_data.get("amount", 0))
        country_risk = float(transaction_data.get("country_risk", 0))
        is_weekend = transaction_data.get("is_weekend", False)
        
        risk_score = 0
        risk_factors = []
        
        # Apply workflow logic
        if amount > workflow["thresholds"]["amount"]:
            risk_score += 0.3
            risk_factors.append("high_amount")
            
        if country_risk > workflow["thresholds"]["risk_score"]:
            risk_score += 0.4
            risk_factors.append("high_country_risk")
            
        if is_weekend:
            risk_score += 0.2
            risk_factors.append("weekend_transaction")
        
        # Decision
        if risk_score > 0.7:
            decision = "ESCALATE"
        elif risk_score > 0.4:
            decision = "REVIEW"
        else:
            decision = "APPROVE"
            
        result = {
            "decision": decision,
            "risk_score": round(risk_score, 2),
            "risk_factors": risk_factors,
            "workflow_used": workflow_name,
            "timestamp": datetime.now().isoformat()
        }
        
        return result

# Global instances
memory_agent = MemoryAgent()
replica_agent = None

def initialize_replica(api_key):
    """Initialize ReplicaAgent with API key"""
    global replica_agent
    replica_agent = ReplicaAgent(memory_agent, api_key if api_key.strip() else None)
    return "✅ ReplicaAgent initialized successfully!"

def add_expert_knowledge(expert_name, domain, knowledge):
    """Add expert knowledge to memory"""
    memory_agent.store_expert_knowledge(expert_name, domain, knowledge)
    return f"✅ Added knowledge for expert '{expert_name}' in domain '{domain}'"

def create_workflow(goal, expert, context):
    """Create a new workflow"""
    if not replica_agent:
        return "❌ Please initialize ReplicaAgent first with your Mistral API key"
        
    workflow = replica_agent.build_workflow(goal, expert, context)
    
    # Format for display
    display_text = f"""
🎯 **Workflow Created: {goal}**

👨‍💼 **Expert**: {expert}
📅 **Created**: {workflow['timestamp']}

**Steps**:
{chr(10).join([f"{i+1}. {step}" for i, step in enumerate(workflow['steps'])])}

**Logic**: {workflow['logic']}

**Risk Factors**: {', '.join(workflow['risk_factors'])}

**Thresholds**: {json.dumps(workflow['thresholds'], indent=2)}

**AI Enhancement**:
{workflow['ai_enhancement']}
"""
    return display_text

def test_transaction(workflow_name, amount, country_risk, is_weekend, merchant, location):
    """Test a transaction against a workflow"""
    if not replica_agent:
        return "❌ Please initialize ReplicaAgent first"
        
    transaction_data = {
        "amount": amount,
        "country_risk": country_risk,
        "is_weekend": is_weekend,
        "merchant": merchant,
        "location": location
    }
    
    result = replica_agent.evaluate_transaction(workflow_name, transaction_data)
    
    if "error" in result:
        return f"❌ {result['error']}"
    
    # Format result
    emoji = "🚨" if result["decision"] == "ESCALATE" else "⚠️" if result["decision"] == "REVIEW" else "✅"
    
    display_text = f"""
{emoji} **Transaction Result**

**Decision**: {result['decision']}
**Risk Score**: {result['risk_score']}
**Risk Factors**: {', '.join(result['risk_factors']) if result['risk_factors'] else 'None detected'}
**Workflow**: {result['workflow_used']}
**Processed**: {result['timestamp']}

**Transaction Details**:
• Amount: ${amount:,.2f}
• Country Risk: {country_risk}
• Weekend: {is_weekend}
• Merchant: {merchant}
• Location: {location}
"""
    return display_text

def get_workflow_list():
    """Get list of available workflows"""
    if not replica_agent or not replica_agent.workflows:
        return "No workflows created yet"
    
    workflows = []
    for name, workflow in replica_agent.workflows.items():
        workflows.append(f"• {name} (by {workflow['built_from']})")
    
    return "**Available Workflows**:\n" + "\n".join(workflows)

def get_transaction_history():
    """Get transaction history as DataFrame"""
    if not memory_agent.transaction_history:
        return pd.DataFrame({"Message": ["No transactions processed yet"]})
    
    df = pd.DataFrame(memory_agent.transaction_history)
    return df

# Gradio Interface
with gr.Blocks(title="ReplicaAgent - Fraud Detection Workflows", theme=gr.themes.Soft()) as app:
    gr.Markdown("# 🤖 ReplicaAgent - Real-time Fraud Detection Workflows")
    gr.Markdown("Build intelligent fraud detection workflows using expert knowledge and Mistral AI")
    
    with gr.Tab("⚙️ Setup"):
        gr.Markdown("## Initialize ReplicaAgent")
        with gr.Row():
            api_key_input = gr.Textbox(
                label="Mistral API Key", 
                placeholder="Enter your Mistral AI API key here...",
                type="password"
            )
            init_btn = gr.Button("Initialize ReplicaAgent", variant="primary")
        
        init_output = gr.Textbox(label="Status", interactive=False)
        init_btn.click(initialize_replica, inputs=[api_key_input], outputs=[init_output])
        
        gr.Markdown("## Add Expert Knowledge")
        with gr.Row():
            expert_name = gr.Textbox(label="Expert Name", placeholder="e.g., Priya, John, Sarah")
            domain = gr.Textbox(label="Domain", placeholder="e.g., fraud_check, risk_assessment")
        
        knowledge_text = gr.Textbox(
            label="Expert Knowledge", 
            placeholder="Enter expert's knowledge about fraud detection...",
            lines=3
        )
        add_knowledge_btn = gr.Button("Add Knowledge")
        knowledge_output = gr.Textbox(label="Status", interactive=False)
        
        add_knowledge_btn.click(
            add_expert_knowledge, 
            inputs=[expert_name, domain, knowledge_text], 
            outputs=[knowledge_output]
        )
    
    with gr.Tab("🔨 Build Workflows"):
        gr.Markdown("## Create New Workflow")
        with gr.Row():
            goal_input = gr.Textbox(label="Goal", placeholder="e.g., fraud_check, payment_verification")
            expert_input = gr.Textbox(label="Expert Name", placeholder="e.g., Priya")
        
        context_input = gr.Textbox(
            label="Additional Context", 
            placeholder="Any additional context for the workflow...",
            lines=2
        )
        
        create_btn = gr.Button("Create Workflow", variant="primary")
        workflow_output = gr.Markdown()
        
        create_btn.click(
            create_workflow, 
            inputs=[goal_input, expert_input, context_input], 
            outputs=[workflow_output]
        )
    
    with gr.Tab("🧪 Test Transactions"):
        gr.Markdown("## Test Transaction Against Workflow")
        
        with gr.Row():
            workflow_name = gr.Textbox(label="Workflow Name", placeholder="e.g., fraud_check")
            amount = gr.Number(label="Transaction Amount", value=1000)
        
        with gr.Row():
            country_risk = gr.Slider(label="Country Risk Level", minimum=0, maximum=1, step=0.1, value=0.3)
            is_weekend = gr.Checkbox(label="Weekend Transaction")
        
        with gr.Row():
            merchant = gr.Textbox(label="Merchant", placeholder="e.g., Amazon, Walmart")
            location = gr.Textbox(label="Location", placeholder="e.g., New York, London")
        
        test_btn = gr.Button("Test Transaction", variant="primary")
        test_output = gr.Markdown()
        
        test_btn.click(
            test_transaction,
            inputs=[workflow_name, amount, country_risk, is_weekend, merchant, location],
            outputs=[test_output]
        )
    
    with gr.Tab("📊 Dashboard"):
        gr.Markdown("## Workflow Dashboard")
        
        with gr.Row():
            refresh_workflows = gr.Button("Refresh Workflows")
            refresh_history = gr.Button("Refresh History")
        
        workflow_list = gr.Markdown()
        transaction_history = gr.Dataframe()
        
        refresh_workflows.click(get_workflow_list, outputs=[workflow_list])
        refresh_history.click(get_transaction_history, outputs=[transaction_history])
        
        # Auto-refresh every 5 seconds
        app.load(get_workflow_list, outputs=[workflow_list])
        app.load(get_transaction_history, outputs=[transaction_history])

if __name__ == "__main__":
    app.launch(share=True, debug=True)

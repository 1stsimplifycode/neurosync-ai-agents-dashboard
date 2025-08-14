import gradio as gr
from neo4j import GraphDatabase
import json
import time
from datetime import datetime
from typing import List, Dict, Optional
import pandas as pd

class MemoryAgent:
    def __init__(self, uri="bolt://localhost:7687", user="neo4j", pwd="password"):
        """Initialize the Memory Agent with Neo4j connection"""
        try:
            self.driver = GraphDatabase.driver(uri, auth=(user, pwd))
            # Test connection
            with self.driver.session() as session:
                session.run("RETURN 1")
            self.connected = True
            print("✅ Connected to Neo4j database")
        except Exception as e:
            print(f"❌ Failed to connect to Neo4j: {e}")
            self.connected = False
            self.driver = None
    
    def close(self):
        """Close the database connection"""
        if self.driver:
            self.driver.close()
    
    def remember_decision(self, expert: str, action: str, reason: str, context: dict):
        """Store a decision in the knowledge graph"""
        if not self.connected:
            return "❌ Database not connected"
        
        try:
            with self.driver.session() as session:
                result = session.run("""
                    CREATE (d:Decision {
                        expert: $expert,
                        action: $action,
                        reason: $reason,
                        context: $context,
                        timestamp: timestamp(),
                        created_date: datetime()
                    })
                    RETURN d.expert as expert, d.action as action, d.reason as reason
                """, expert=expert, action=action, reason=reason, context=json.dumps(context))
                
                record = result.single()
                if record:
                    return f"✅ Decision stored: '{record['action']}' by {record['expert']}"
                else:
                    return "❌ Failed to store decision"
        except Exception as e:
            return f"❌ Error storing decision: {str(e)}"
    
    def search_similar_decisions(self, query: str, expert: str = "", limit: int = 5):
        """Search for similar decisions based on reason or action"""
        if not self.connected:
            return "❌ Database not connected"
        
        try:
            with self.driver.session() as session:
                # Build query based on filters
                cypher_query = """
                MATCH (d:Decision)
                WHERE toLower(d.reason) CONTAINS toLower($query) 
                   OR toLower(d.action) CONTAINS toLower($query)
                """
                
                params = {"query": query, "limit": limit}
                
                if expert:
                    cypher_query += " AND toLower(d.expert) = toLower($expert)"
                    params["expert"] = expert
                
                cypher_query += """
                RETURN d.expert as expert, d.action as action, d.reason as reason, 
                       d.context as context, d.created_date as date
                ORDER BY d.timestamp DESC
                LIMIT $limit
                """
                
                result = session.run(cypher_query, **params)
                
                decisions = []
                for record in result:
                    decisions.append({
                        "Expert": record["expert"],
                        "Action": record["action"],
                        "Reason": record["reason"],
                        "Context": record["context"],
                        "Date": str(record["date"])[:19] if record["date"] else "N/A"
                    })
                
                if decisions:
                    return pd.DataFrame(decisions)
                else:
                    return pd.DataFrame({"Message": ["No matching decisions found"]})
        except Exception as e:
            return f"❌ Error searching decisions: {str(e)}"
    
    def get_expert_stats(self):
        """Get statistics about experts and their decisions"""
        if not self.connected:
            return "❌ Database not connected"
        
        try:
            with self.driver.session() as session:
                result = session.run("""
                MATCH (d:Decision)
                RETURN d.expert as expert, count(*) as decision_count,
                       collect(DISTINCT d.action)[0..3] as sample_actions
                ORDER BY decision_count DESC
                """)
                
                stats = []
                for record in result:
                    stats.append({
                        "Expert": record["expert"],
                        "Decisions": record["decision_count"],
                        "Sample Actions": ", ".join(record["sample_actions"])
                    })
                
                if stats:
                    return pd.DataFrame(stats)
                else:
                    return pd.DataFrame({"Message": ["No decisions found"]})
        except Exception as e:
            return f"❌ Error getting stats: {str(e)}"
    
    def get_recent_decisions(self, limit: int = 10):
        """Get the most recent decisions"""
        if not self.connected:
            return "❌ Database not connected"
        
        try:
            with self.driver.session() as session:
                result = session.run("""
                MATCH (d:Decision)
                RETURN d.expert as expert, d.action as action, d.reason as reason,
                       d.context as context, d.created_date as date
                ORDER BY d.timestamp DESC
                LIMIT $limit
                """, limit=limit)
                
                decisions = []
                for record in result:
                    decisions.append({
                        "Expert": record["expert"],
                        "Action": record["action"],
                        "Reason": record["reason"],
                        "Context": record["context"][:100] + "..." if len(record["context"]) > 100 else record["context"],
                        "Date": str(record["date"])[:19] if record["date"] else "N/A"
                    })
                
                if decisions:
                    return pd.DataFrame(decisions)
                else:
                    return pd.DataFrame({"Message": ["No decisions found"]})
        except Exception as e:
            return f"❌ Error getting recent decisions: {str(e)}"

# Initialize the memory agent
memory_agent = MemoryAgent()

def store_decision(expert_name, action_taken, reasoning, context_json):
    """Store a new decision via Gradio interface"""
    if not expert_name or not action_taken or not reasoning:
        return "❌ Please fill in all required fields (Expert, Action, and Reason)"
    
    try:
        # Parse context JSON if provided
        if context_json.strip():
            context = json.loads(context_json)
        else:
            context = {}
        
        result = memory_agent.remember_decision(expert_name, action_taken, reasoning, context)
        return result
    except json.JSONDecodeError:
        return "❌ Invalid JSON format in context field"
    except Exception as e:
        return f"❌ Error: {str(e)}"

def search_decisions(search_query, expert_filter, max_results):
    """Search decisions via Gradio interface"""
    if not search_query:
        return pd.DataFrame({"Message": ["Please enter a search query"]})
    
    return memory_agent.search_similar_decisions(search_query, expert_filter, max_results)

def get_stats():
    """Get expert statistics via Gradio interface"""
    return memory_agent.get_expert_stats()

def get_recent():
    """Get recent decisions via Gradio interface"""
    return memory_agent.get_recent_decisions()

def refresh_data():
    """Refresh all data displays"""
    return get_recent(), get_stats()

# Create the Gradio interface
with gr.Blocks(title="Memory Agent - Decision Tracker", theme=gr.themes.Soft()) as app:
    gr.Markdown("""
    # 🧠 Memory Agent - Decision Tracking System
    
    Track and retrieve expert decisions using Neo4j graph database with real-time updates.
    """)
    
    with gr.Tabs():
        # Store Decision Tab
        with gr.Tab("📝 Store Decision"):
            with gr.Row():
                with gr.Column(scale=2):
                    expert_input = gr.Textbox(
                        label="Expert Name*",
                        placeholder="e.g., Priya, John, Sarah",
                        info="Name of the expert making the decision"
                    )
                    action_input = gr.Textbox(
                        label="Action Taken*",
                        placeholder="e.g., escalate_fraud_alert, approve_transaction",
                        info="The action that was taken"
                    )
                    reason_input = gr.Textbox(
                        label="Reasoning*",
                        placeholder="e.g., High amount on weekend from high-risk country",
                        lines=3,
                        info="The reasoning behind the decision"
                    )
                    context_input = gr.Textbox(
                        label="Context (JSON)",
                        placeholder='{"amount": 9500, "day": "Sunday", "risk_origin": true}',
                        lines=3,
                        info="Additional context as JSON (optional)"
                    )
                
                with gr.Column(scale=1):
                    store_btn = gr.Button("💾 Store Decision", variant="primary", size="lg")
                    store_output = gr.Textbox(
                        label="Status",
                        interactive=False,
                        lines=3
                    )
        
        # Search Decisions Tab
        with gr.Tab("🔍 Search Decisions"):
            with gr.Row():
                with gr.Column():
                    search_input = gr.Textbox(
                        label="Search Query",
                        placeholder="e.g., fraud, high amount, weekend",
                        info="Search in actions and reasoning"
                    )
                    with gr.Row():
                        expert_filter = gr.Textbox(
                            label="Filter by Expert",
                            placeholder="Leave empty for all experts",
                            scale=2
                        )
                        max_results = gr.Slider(
                            label="Max Results",
                            minimum=1,
                            maximum=20,
                            value=5,
                            step=1,
                            scale=1
                        )
                    search_btn = gr.Button("🔍 Search", variant="secondary")
            
            search_results = gr.Dataframe(
                label="Search Results",
                interactive=False,
                wrap=True
            )
        
        # Dashboard Tab
        with gr.Tab("📊 Dashboard"):
            with gr.Row():
                refresh_btn = gr.Button("🔄 Refresh Data", variant="secondary")
            
            with gr.Row():
                with gr.Column():
                    gr.Markdown("### 📈 Expert Statistics")
                    stats_df = gr.Dataframe(
                        label="Expert Performance",
                        interactive=False
                    )
                
                with gr.Column():
                    gr.Markdown("### 🕐 Recent Decisions")
                    recent_df = gr.Dataframe(
                        label="Latest Decisions",
                        interactive=False,
                        wrap=True
                    )
    
    # Event handlers
    store_btn.click(
        fn=store_decision,
        inputs=[expert_input, action_input, reason_input, context_input],
        outputs=store_output
    )
    
    search_btn.click(
        fn=search_decisions,
        inputs=[search_input, expert_filter, max_results],
        outputs=search_results
    )
    
    refresh_btn.click(
        fn=refresh_data,
        outputs=[recent_df, stats_df]
    )
    
    # Load initial data
    app.load(
        fn=refresh_data,
        outputs=[recent_df, stats_df]
    )

if __name__ == "__main__":
    print("🚀 Starting Memory Agent Gradio Interface...")
    print("💡 Make sure Neo4j is running on bolt://localhost:7687")
    print("🌐 Access the interface at: http://localhost:7860")
    
    try:
        app.launch(
            server_name="0.0.0.0",
            server_port=7860,
            share=False,
            debug=True,
            show_error=True
        )
    finally:
        memory_agent.close()
        print("🔒 Database connection closed")

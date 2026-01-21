import './Agent.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

function Agent() {

    const navigate = useNavigate();
    const [prompt, setPrompt] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

    const handleGenerate = async () => {
        console.log("REACT_APP_GEMINI_API_KEY:", process.env.REACT_APP_GEMINI_API_KEY);
        if (!prompt.trim()) return;
        setLoading(true);
        setError(null);
        setOutput(null);
        try {
            const ai = new GoogleGenAI({
                apiKey: process.env.REACT_APP_GEMINI_API_KEY,
            });

            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `
                    Return ONLY valid JSON.
                    Schema:
                    [
                    {
                        "Phase": "string",
                        "Topics": ["string"]
                    }
                    ]

                    Topic: ${prompt}
                    Rules:
                    - Minimum 5 Phases
                    - No markdown
                    - No explanations
                    - No trailing commas
                    `
            });
            
            const text = result.text;
            const cleanText = text.replace(/```json|```/g, '').trim();
            const parsedData = JSON.parse(cleanText);

            if (Array.isArray(parsedData)) {
    
                navigate('/roadmap', { state: { data: parsedData } });
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (error) {
            console.error(error);
            setError("⚠ Error: Unable to generate response. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="agent-container">
            {/* Navbar */}
            <nav className="navbar">
                <h1 className="logo">LearnFlow</h1>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <h2 className="title">Turn Ambition into a Learning Path.</h2>
                <p className="subtitle">
                    Let AI organize what to learn, when to learn, and how to grow.
                </p>

                {/* Prompt Input */}
                <div className="prompt-box-wrapper">
                    <div className="prompt-box">
                        <input
                            type="text"
                            className="prompt-input"
                            placeholder="What do you want to learn today?"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            className="generate-btn"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? "Thinking..." : "Generate 🚀"}
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                {error && <div className="output-card" style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</div>}

                {/**/ }
                {/* output && (
                    <Roadmap data={output} />
                ) */}
            </header>

        </div>
    )
}
export default Agent;
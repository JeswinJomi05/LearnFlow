import './Agent.css';


function Agent() {
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
                            ////
                        />
                        <button
                            className="generate-btn"
                            ////
                        >Enter
                            {/**/ }
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                {/**/ }
                {/* output && (
                    <Roadmap data={output} />
                ) */}
            </header>

        </div>
    )
}
export default Agent;
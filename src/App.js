
import './App.css';
import Agent from './pages/agent.jsx';
import Roadmap from './pages/roadmap.jsx';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Agent />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Routes>
    </Router>
  );

}

export default App;

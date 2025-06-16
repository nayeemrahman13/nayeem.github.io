import Home from './pages/Home';
import './App.css';

function Logo() {
  return (
    <div className="logo-container">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="90" height="90" rx="15" fill="#BFDBFE"/>
        <text x="20" y="70" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="70" fill="#ffffff" dominantBaseline="middle" textAnchor="start">N</text>
        <text x="55" y="70" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="70" fill="#ffffff" dominantBaseline="middle" textAnchor="start">R</text>
      </svg>
    </div>
  );
}

function NavBar() {
  return (
    <nav className="glass-navbar">
      <div className="glass-navbar-inner">
        <Logo />
        <a href="#home" className="glass-nav-link">Home</a>
        <a href="#about" className="glass-nav-link">About</a>
        <a href="#projects" className="glass-nav-link">Projects</a>
        <a href="#photos" className="glass-nav-link">Photos</a>
        <a href="#contact" className="glass-nav-link">Contact</a>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <Home />
    </div>
  );
}

export default App;

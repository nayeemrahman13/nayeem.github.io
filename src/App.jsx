import Home from './pages/Home';
import './App.css';

function NavBar() {
  return (
    <nav className="glass-navbar">
      <div className="glass-navbar-inner">
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

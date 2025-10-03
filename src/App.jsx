import { useState } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  };

  // Handle escape key to close mobile menu
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="glass-navbar" onKeyDown={handleKeyDown}>
      <div className="glass-navbar-inner">
        <Logo />
        {/* Desktop Navigation */}
        <div className="nav-links">
          <a href="#home" className="glass-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
          <a href="#about" className="glass-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
          <a href="#projects" className="glass-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>Projects</a>
          <a href="#photos" className="glass-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('photos'); }}>Photos</a>
          <a href="#contact" className="glass-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        id="mobile-navigation"
        className={`mobile-nav-menu ${isMenuOpen ? 'active' : ''}`}
        role="menu"
        aria-hidden={!isMenuOpen}
      >
        <div className="mobile-nav-content">
          <a href="#home" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} role="menuitem">Home</a>
          <a href="#about" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} role="menuitem">About</a>
          <a href="#projects" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }} role="menuitem">Projects</a>
          <a href="#photos" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('photos'); }} role="menuitem">Photos</a>
          <a href="#contact" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} role="menuitem">Contact</a>
        </div>
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

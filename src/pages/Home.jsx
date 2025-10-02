function Home() {
  return (
    <div className="glass-basic-bg">
      <section className="glass-section glass-hero-section" id="home">
        <h1 className="glass-title">Nayeem Rahman</h1>
        <p className="glass-tagline">Tinkerer and product manager.</p>
        <a href="#projects" className="glass-cta">See My Work</a>
      </section>
      <section className="glass-section glass-about-section" id="about">
        <h2>About Me</h2>
        <p>
          I'm Nayeem. I like building things that focus on memories and connection.
        </p>
      </section>
      <section className="glass-section glass-projects-section" id="projects">
        <h2>Projects</h2>
        <ul className="glass-projects-list">
          <li>
            <a href="https://reston-nayeemrahman13.replit.app/" className="glass-project-name">Reston</a>
            <span className="glass-project-desc">Voice AI that helps therapy-goers have better sessions through work outside of sessions</span>
          </li>
          <li>
            <a href="https://regal-voice-ai-agent-nayeemrahman13.replit.app/" className="glass-project-name">Voice AI agent</a>
            <span className="glass-project-desc">A customer support agent that can speak like Yoda (Easter egg)</span>
          </li>
          <li>
            <span className="glass-project-name">Resume Agent</span>
            <span className="glass-project-desc">Chat with my resume to find out what I've done</span>
          </li>
        </ul>
      </section>
      <section className="glass-section glass-photos-section" id="photos">
        <h2>Photos</h2>
        <ul className="glass-projects-list">
          <li>
            <span className="glass-project-name">Japan</span>
            <span className="glass-project-desc">A life-changing 15 days in Tokyo, Hakone, Kyoto, and Osaka</span>
          </li>
          <li>
            <span className="glass-project-name">American Southwest</span>
            <span className="glass-project-desc">Hiked the Grand Canyon, Zion, Bryce, and more</span>
          </li>
          <li>
            <span className="glass-project-name">Acadia</span>
            <span className="glass-project-desc">Abandoned our car, but still had a great time</span>
          </li>
        </ul>
      </section>
      <section className="glass-section glass-contact-section" id="contact">
        <h2>Contact</h2>
        <p>Want to collaborate or just say hi? I'm always up for a chat!</p>
        <a href="mailto:nayeemr613@gmail.com" className="glass-cta glass-cta-secondary">Email Me</a>
      </section>
      <elevenlabs-convai agent-id="agent_6401k1bc5tp8f3rsfjng67q7f88t"></elevenlabs-convai><script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
    </div>
  );
}

export default Home; 
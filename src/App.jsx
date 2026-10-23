import InstaxCamera from './instax/InstaxCamera';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="grain" aria-hidden="true" />
      <InstaxCamera />
    </div>
  );
}

export default App;

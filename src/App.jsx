import LensInstrument from './lens/LensInstrument';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="grain" aria-hidden="true" />
      <LensInstrument />
    </div>
  );
}

export default App;

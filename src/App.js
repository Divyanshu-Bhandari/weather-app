import Weather from './components/Weather.js';
import './App.css';

function App() {
  return (
    <div className="App" style={{
      display: "flex",
      justifyContent: "center",
    }}>
      <Weather />
    </div>
  );
}

export default App;

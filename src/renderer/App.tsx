import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-app-engine</h1>
      <button onClick={() => { throw new Error('test throw in renderer') }}>
        test throw in renderer
      </button>
      <button onClick={() => { rendererUndefined() }}>
        rendererUndefined
      </button>
      <button onClick={() => { process.crash() }}>
        rendererCrash
      </button>
      <button onClick={() => { window.electron.ipcRenderer.sendMessage('namedpipe-send')}}>
        NamedPipe Send
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}

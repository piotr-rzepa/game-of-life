import React from 'react';
import './App.css';
// import WsConnector from './components/WebsocketConnector';
import Canvas from './components/Canvas';

const App = () => (
  <div className="App">
    <header className="App-header">
      <Canvas
        width="1200"
        height="600"
        cellSize={40}
        cellFillStyle="#282c34"
      />
    </header>
  </div>
);

export default App;

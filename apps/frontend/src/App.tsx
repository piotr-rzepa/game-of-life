import React from 'react';
import './App.css';
// import WsConnector from './components/WebsocketConnector';
import Canvas from './components/Canvas';
import { WebsocketProvider } from './context';

const App = () => (
  <div className="App">
    <header className="App-header">
      <WebsocketProvider>
        <Canvas
          width="1200"
          height="600"
          cellSize={40}
          cellFillStyle="#282c34"
        />
      </WebsocketProvider>
    </header>
  </div>
);

export default App;

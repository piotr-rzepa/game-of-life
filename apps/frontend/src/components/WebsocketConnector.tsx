import React from 'react';
import io from 'socket.io-client';

const connectToWebsocket = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ws = io('http://localhost:3001/');
};

const WebSoscketConnector: React.FC = () => (
  <button
    type="button"
    onClick={connectToWebsocket}
  >
    Establish connection
  </button>
);

export default WebSoscketConnector;
